// Image pipeline: turns source photos into right-sized AVIF + WebP files in public/img
// and writes src/data/images.json (dimensions, focal point and credits).
// Usage: npm run images -- <folder with manifest.json and source jpgs>
// Needs `sharp` (npm i -D sharp). Not used at deploy time: the outputs are committed.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.argv[2] || join(ROOT, 'raw-images');
const OUT = join(ROOT, 'public/img');
const WIDTHS = [480, 800, 1200, 1600, 2000];
mkdirSync(OUT, { recursive: true });

// Reads manifest.json and any manifest-*.json files in the source folder.
const manifest = readdirSync(SRC).filter((f) => /^manifest.*\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(join(SRC, f), 'utf8')));
const dataPath = join(ROOT, 'src/data/images.json');
const data = existsSync(dataPath) ? JSON.parse(readFileSync(dataPath, 'utf8')) : {};
const focal = existsSync(join(SRC, 'focal.json')) ? JSON.parse(readFileSync(join(SRC, 'focal.json'), 'utf8')) : {};

for (const m of manifest) {
  if (!m.file) continue;
  const file = join(SRC, m.file);
  if (!existsSync(file)) { console.warn('missing', file); continue; }
  const meta = await sharp(file).metadata();
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);
  for (const w of widths) {
    const base = sharp(file).rotate().resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: w <= 800 ? 52 : 46, effort: 5 }).toFile(join(OUT, `${m.slot}-${w}.avif`));
    await base.clone().webp({ quality: 74, effort: 5 }).toFile(join(OUT, `${m.slot}-${w}.webp`));
  }
  const lic = (m.license || '').toLowerCase();
  data[m.slot] = {
    w: 1200, h: Math.round((1200 * meta.height) / meta.width), widths, pos: focal[m.slot] || m.focal || data[m.slot]?.pos || '50% 50%',
    credit: { title: m.title, author: m.author, license: m.license, license_url: m.license_url, source_url: m.source_url, place: m.place,
      attribution: !lic.includes('unsplash') },
  };
  console.log('✓', m.slot, widths.join(','));
}
writeFileSync(dataPath, JSON.stringify(data, null, 2));
