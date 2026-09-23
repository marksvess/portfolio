// Собирает встроенные MVP из apps/<slug>/ в public/apps/<slug>/demo/.
// Подробности в apps/README.md.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const src = join(root, 'apps');
const out = join(root, 'public', 'apps');

rmSync(out, { recursive: true, force: true });
if (!existsSync(src)) process.exit(0);

const skip = new Set(['node_modules', 'dist', 'package.json', 'package-lock.json', 'README.md']);
let count = 0;

for (const slug of readdirSync(src)) {
  const dir = join(src, slug);
  if (!statSync(dir).isDirectory()) continue;
  const target = join(out, slug, 'demo');
  mkdirSync(target, { recursive: true });

  if (existsSync(join(dir, 'package.json'))) {
    const install = existsSync(join(dir, 'package-lock.json')) ? 'npm ci' : 'npm install';
    console.log(`[demos] ${slug}: ${install} && npm run build`);
    execSync(`${install} && npm run build`, { cwd: dir, stdio: 'inherit' });
    cpSync(join(dir, 'dist'), target, { recursive: true });
  } else {
    cpSync(dir, target, {
      recursive: true,
      filter: (p) => !skip.has(p.split(/[\\/]/).pop()),
    });
  }
  count++;
}
console.log(`[demos] готово: ${count}`);
