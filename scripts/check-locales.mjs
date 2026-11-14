// Verifies every locale file mirrors the English structure (same keys, same array lengths, same tokens).
import en from '../src/content/en.mjs';
const locales = process.argv.slice(2).length ? process.argv.slice(2) : ['fr', 'de', 'es'];
let problems = 0;
const tokens = (s) => (String(s).match(/\{[a-z]+\}|@[a-z]+|<[a-z]+/g) || []).sort().join(',');
function walk(a, b, path, loc) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) { console.log(`[${loc}] array mismatch at ${path}`); problems++; return; }
    a.forEach((v, i) => walk(v, b[i], `${path}[${i}]`, loc));
  } else if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') { console.log(`[${loc}] missing object ${path}`); problems++; return; }
    for (const k of Object.keys(a)) walk(a[k], b[k], `${path}.${k}`, loc);
    for (const k of Object.keys(b)) if (!(k in a)) { console.log(`[${loc}] extra key ${path}.${k}`); problems++; }
  } else if (typeof a === 'string') {
    if (typeof b !== 'string') { console.log(`[${loc}] missing string ${path}`); problems++; return; }
    if (tokens(a) !== tokens(b)) { console.log(`[${loc}] token mismatch at ${path}: ${tokens(a)} vs ${tokens(b)}`); problems++; }
  } else if (a !== b && !['nights'].includes(path.split('.').pop())) {
    if (typeof a !== typeof b) { console.log(`[${loc}] type mismatch at ${path}`); problems++; }
  }
}
for (const loc of locales) {
  const mod = (await import(`../src/content/${loc}.mjs`)).default;
  walk(en, mod, loc, loc);
}
console.log(problems ? `${problems} problem(s)` : 'Locales OK');
process.exit(problems ? 1 : 0);
