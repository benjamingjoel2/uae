// Tiny static server for local preview of dist/ with clean URLs. `npm run serve` → http://localhost:4173
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };
const port = +process.env.PORT || 4173;
createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  let f = join(DIST, p);
  try { if ((await stat(f)).isDirectory()) { res.writeHead(308, { Location: p + '/' }); return res.end(); } }
  catch { const loc = p.split('/')[1]; f = join(DIST, ['fr', 'de', 'es'].includes(loc) ? loc : '', '404.html'); res.statusCode = 404; }
  try { const b = await readFile(f); res.setHeader('Content-Type', types[extname(f)] || 'application/octet-stream'); res.end(b); }
  catch { res.statusCode = 500; res.end('error'); }
}).listen(port, () => console.log(`Serving dist/ on http://localhost:${port}`));
