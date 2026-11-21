"""Barjeel Journeys colour grade: gives every photo one shared palette.

Matches each photo's LAB mean/std to a fixed target palette (50% on lightness, 90% on colour),
lowers chroma to 0.84, lifts blacks / caps whites (L = 0.07 + L*0.88) and adds fine grain (sigma 2).
Night photos (--night) get only the chroma and fade steps.
The target palette (TARGET below) was measured once from mood references for the look only;
no reference images are stored or published.

usage: python3 scripts/grade.py <in.jpg> <out.jpg> [--night]   (needs Pillow + numpy)
Then run: npm run images -- <folder with graded jpgs + manifest.json> --force, and bump imageVersion in src/config.mjs."""
import sys, glob, numpy as np
from PIL import Image, ImageCms

SRGB = ImageCms.createProfile('sRGB'); LAB = ImageCms.createProfile('LAB')
TO_LAB = ImageCms.buildTransformFromOpenProfiles(SRGB, LAB, 'RGB', 'LAB')
TO_RGB = ImageCms.buildTransformFromOpenProfiles(LAB, SRGB, 'LAB', 'RGB')

def lab_arrays(img):
    lab = ImageCms.applyTransform(img.convert('RGB'), TO_LAB)
    L, a, b = lab.split()
    L = np.asarray(L, dtype=np.float64) / 255.0          # 0..1
    # This PIL/LittleCMS build stores a/b offset by 128 (neutral grey = 128), not as int8.
    a = np.asarray(a, dtype=np.float64) - 128.0
    b = np.asarray(b, dtype=np.float64) - 128.0
    return L, a, b

def to_img(L, a, b):
    Li = Image.fromarray(np.clip(L * 255.0, 0, 255).round().astype(np.uint8), 'L')
    ai = Image.fromarray((np.clip(a, -128, 127) + 128).round().astype(np.uint8), 'L')
    bi = Image.fromarray((np.clip(b, -128, 127) + 128).round().astype(np.uint8), 'L')
    return ImageCms.applyTransform(Image.merge('LAB', (Li, ai, bi)), TO_RGB)

TARGET = np.array([[0.379, 0.221], [7.0, 4.665], [19.972, 11.209]])  # LAB (L 0-1, a, b): [mean, std]

def ref_stats(refs_dir):
    st = []
    for f in sorted(glob.glob(refs_dir + '/*.jpg')):
        L, a, b = lab_arrays(Image.open(f))
        st.append([(c.mean(), c.std()) for c in (L, a, b)])
    return np.array(st).mean(axis=0)  # [[mL,sL],[ma,sa],[mb,sb]]

def match(c, tm, ts, w):
    m, s = c.mean(), c.std() or 1e-6
    return c * (1 - w) + ((c - m) / s * ts + tm) * w

def grade(img, R, night=False):
    L, a, b = lab_arrays(img)
    if not night:
        L = match(L, R[0][0], R[0][1], 0.5)   # 50% on lightness
        a = match(a, R[1][0], R[1][1], 0.9)   # 90% on colour
        b = match(b, R[2][0], R[2][1], 0.9)
    a, b = a * 0.84, b * 0.84                  # lower chroma
    L = 0.07 + np.clip(L, 0, 1) * 0.88         # lift blacks, cap whites
    out = np.asarray(to_img(L, a, b), dtype=np.float64)
    rng = np.random.default_rng(7)
    grain = rng.normal(0, 2.0, out.shape[:2])[..., None]   # fine luminance grain, sigma 2
    return Image.fromarray(np.clip(out + grain, 0, 255).astype(np.uint8), 'RGB')

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    src, dst = args[0], args[1]
    R = TARGET
    grade(Image.open(src), R, '--night' in sys.argv).save(dst, quality=93)
    print('graded', dst)
