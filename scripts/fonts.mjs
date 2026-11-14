// Rebuilds the Arabic label font subset from the characters actually used on the site.
// Needs Python fonttools + brotli (pip install fonttools brotli) and the full Amiri Arabic woff2
// (from @fontsource/amiri: files/amiri-arabic-400-normal.woff2). Usage: npm run fonts -- <path to full Amiri woff2>
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
if (!src) { console.error('Pass the full Amiri Arabic woff2 path'); process.exit(1); }
const chars = new Set();
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(mjs|html)$/.test(f)) for (const c of readFileSync(p, 'utf8')) if (/[؀-ۿﭐ-﷿ﹰ-ﻼ]/.test(c)) chars.add(c); });
walk(join(ROOT, 'src')); walk(join(ROOT, 'scripts'));
const text = [...chars].join('') + ' ';
execFileSync('pyftsubset', [src, `--text=${text}`, '--flavor=woff2', '--layout-features=*', `--output-file=${join(ROOT, 'public/fonts/amiri-arabic-subset.woff2')}`], { stdio: 'inherit' });
console.log(`Subset ${chars.size} Arabic characters → public/fonts/amiri-arabic-subset.woff2`);
