import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const partial = process.argv.includes('--partial');
const indexPath = join(root, 'index.html');
const cssPath = join(root, 'dist', 'tlatolli.css');
const errors = [];
const expected = ['inicio', 'problema', 'sistema', 'presencia', 'fidelizacion', 'analitica', 'marketing', 'live', 'mapas', 'app', 'proyectos', 'diferencia', 'diagnostico', 'contacto'];
const report = (message) => errors.push(message);

if (!existsSync(indexPath)) report('Falta index.html. Ejecuta node build.mjs.');
else {
  const html = readFileSync(indexPath, 'utf8');
  const allIds = [...html.matchAll(/<section\b[^>]*\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const ids = [...html.matchAll(/<section\b(?=[^>]*\bclass=["'][^"']*\bsection\b)[^>]*\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  if (!partial) expected.forEach((id) => { if (!ids.includes(id)) report(`Falta sección #${id}.`); });
  ids.forEach((id) => { if (!expected.includes(id)) report(`Sección inesperada #${id}.`); });
  if (!partial && ids.length !== expected.length) report(`Se esperaban ${expected.length} secciones y hay ${ids.length}.`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) report('Debe existir un único h1.');
  const targets = new Set(allIds.concat(['contenido']));
  for (const match of html.matchAll(/\bhref=["']#([^"']+)["']/gi)) if (!targets.has(match[1])) report(`href interno sin destino: #${match[1]}.`);
  checkAssets(html, indexPath);
}
if (existsSync(cssPath)) checkAssets(readFileSync(cssPath, 'utf8'), cssPath);
else if (!partial) report('Falta dist/tlatolli.css. Ejecuta node build.mjs.');

function checkAssets(content, sourcePath) {
  const patterns = sourcePath.endsWith('.css') ? [...content.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/gi)].map((match) => match[1]) : [...content.matchAll(/(?:src|href)=["']([^"']+)["']/gi)].map((match) => match[1]);
  patterns.filter((asset) => !/^(?:https?:|data:|#|mailto:|tel:|javascript:)/i.test(asset)).forEach((asset) => {
    const clean = asset.split(/[?#]/)[0];
    if (!clean) return;
    const path = resolve(join(resolve(sourcePath, '..'), clean));
    if (!existsSync(path)) report(`Asset faltante (${relative(root, sourcePath)}): ${asset}.`);
  });
}

const jsFiles = [];
function collect(dir) {
  if (!existsSync(dir)) return;
  readdirSync(dir, { withFileTypes: true }).forEach((entry) => { const path = join(dir, entry.name); if (entry.isDirectory()) collect(path); else if (entry.name.endsWith('.js')) jsFiles.push(path); });
}
collect(join(root, 'frontend', 'src'));
jsFiles.forEach((file) => run('syntax', ['--check', file]));
['diagnostico.test.js', 'marketing.test.js', 'fidelizacion.test.js', 'analitica.test.js'].forEach((name) => {
  const path = jsFiles.find((file) => file.endsWith(`/sections/${name.replace('.test.js', '')}/${name}`));
  if (path) run('test', [path]);
});

function run(kind, args) {
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) report(`Node ${kind} falló: ${relative(root, args.at(-1))}\n${(result.stderr || result.stdout).trim()}`);
}
if (errors.length) { console.error(errors.map((error) => `✗ ${error}`).join('\n')); process.exit(1); }
console.log(`QA estático OK: ${expected.length} secciones, H1 único, enlaces, assets y Node verificados${partial ? ' (partial)' : ''}.`);
