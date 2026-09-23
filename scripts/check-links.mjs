// Проверяет, что все внутренние ссылки и картинки в собранном сайте (dist/) ведут на существующие файлы.
// Запуск: npm run build && npm run check:links
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');
const base = (process.env.BASE_PATH ?? '/portfolio').replace(/\/$/, '');

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith('.html')) yield p;
  }
}

const broken = [];
let checked = 0;
for (const file of walk(dist)) {
  const html = readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    checked++;
    if (base && !url.startsWith(`${base}/`) && url !== base) {
      broken.push(`${file}: ${url} (нет префикса ${base})`);
      continue;
    }
    let rel = url.slice(base.length);
    let target = join(dist, decodeURIComponent(rel));
    if (rel.endsWith('/')) target = join(target, 'index.html');
    if (!existsSync(target)) broken.push(`${file.replace(dist, '')}: ${url}`);
  }
}

if (broken.length) {
  console.error(`Битые ссылки (${broken.length}):\n` + [...new Set(broken)].join('\n'));
  process.exit(1);
}
console.log(`Ссылки в порядке: проверено ${checked}`);
