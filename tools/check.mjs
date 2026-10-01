import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const src = (path) => join(root, 'frontend', 'src', path);
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const errors = [];
const report = (message) => errors.push(message);
const HOME_BUDGET = 500 * 1024;

const cfg = readJson(join(root, 'site.config.json'));
const registry = new Map(readJson(src('sections/sections.json')).map((section) => [section.id, section]));
const pages = [...readJson(src('pages.json'))];
readJson(src('content/casos.json')).casos.forEach((caso) => pages.push({ file: `caso-${caso.slug}.html`, bundle: 'paginas', sections: ['casohead', 'casodetalle', 'cta'] }));
const html = new Map();
const idsOf = (content) => new Set([...content.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]));

for (const page of pages) {
  const path = join(root, page.file);
  if (!existsSync(path)) { report(`Falta ${page.file}. Ejecuta node build.mjs.`); continue; }
  html.set(page.file, readFileSync(path, 'utf8'));
}

for (const page of pages) {
  const content = html.get(page.file);
  if (!content) continue;
  const where = page.file;
  const ids = idsOf(content);
  if ((content.match(/<h1\b/gi) || []).length !== 1) report(`${where}: debe existir un único h1.`);
  if (!/<html lang="es-MX"/.test(content)) report(`${where}: falta lang="es-MX".`);
  if (!/<main id="contenido"/.test(content)) report(`${where}: falta <main id="contenido">.`);
  if (!/<header\b/.test(content) || !/<footer\b/.test(content)) report(`${where}: faltan landmarks header/footer.`);
  if (content.includes('{{')) report(`${where}: quedaron marcadores {{…}} sin resolver.`);
  for (const tag of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:title"', 'property="og:url"']) if (!content.includes(tag)) report(`${where}: falta ${tag}.`);
  const canonical = content.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const expected = cfg.url + (page.file === 'index.html' ? '' : page.file);
  if (canonical !== expected) report(`${where}: canonical ${canonical} ≠ ${expected}.`);
  for (const match of content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(match[1]); } catch (error) { report(`${where}: JSON-LD inválido (${error.message}).`); } }
  if (!content.includes('application/ld+json')) report(`${where}: falta JSON-LD.`);
  for (const id of page.sections) { const section = registry.get(id); if (!section) report(`${where}: sección «${id}» fuera del registro.`); else if (!ids.has(section.domId)) report(`${where}: falta #${section.domId}.`); }
  for (const match of content.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)) report(`${where}: img sin alt: ${match[0].slice(0, 60)}`);
  for (const match of content.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(href)) continue;
    const [file, hash] = href.split('#');
    if (!file) { if (hash && !ids.has(hash) && hash !== 'contenido') report(`${where}: href interno sin destino: #${hash}.`); continue; }
    const clean = file.replace(/^\.\//, '');
    const target = html.get(clean);
    if (clean.endsWith('.html')) { if (!target) report(`${where}: enlace a página inexistente: ${href}.`); else if (hash && !idsOf(target).has(hash)) report(`${where}: ${href} no tiene destino.`); }
    else if (!existsSync(resolve(root, clean))) report(`${where}: archivo faltante: ${href}.`);
  }
  checkAssets(content, join(root, page.file));
  for (const match of content.matchAll(/(?:src|srcset)=["']([^"']+)["']/gi)) match[1].split(',').map((part) => part.trim().split(/\s+/)[0]).filter((url) => url && !/^(?:https?:|data:)/.test(url)).forEach((url) => { if (!existsSync(resolve(root, url))) report(`${where}: asset faltante: ${url}.`); });
}

function checkAssets(content, sourcePath) {
  const urls = sourcePath.endsWith('.css') ? [...content.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/gi)].map((match) => match[1]) : [...content.matchAll(/<(?:link|script)\b[^>]*(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
  urls.filter((asset) => !/^(?:https?:|data:|#|mailto:|tel:|javascript:)/i.test(asset)).forEach((asset) => {
    const clean = asset.split(/[?#]/)[0];
    if (clean && !existsSync(resolve(join(resolve(sourcePath, '..'), clean)))) report(`Asset faltante (${relative(root, sourcePath)}): ${asset}.`);
  });
}
for (const bundle of new Set(pages.map((page) => page.bundle))) {
  for (const ext of ['css', 'js']) if (!existsSync(join(root, 'dist', `${bundle}.${ext}`))) report(`Falta dist/${bundle}.${ext}.`);
  const css = join(root, 'dist', `${bundle}.css`);
  if (existsSync(css)) checkAssets(readFileSync(css, 'utf8'), css);
}

// SEO técnico
const sitemapPath = join(root, 'sitemap.xml');
if (!existsSync(sitemapPath)) report('Falta sitemap.xml.');
else { const sitemap = readFileSync(sitemapPath, 'utf8'); pages.forEach((page) => { if (!sitemap.includes(`<loc>${cfg.url}${page.file === 'index.html' ? '' : page.file}</loc>`)) report(`sitemap.xml no lista ${page.file}.`); }); }
if (!existsSync(join(root, 'robots.txt'))) report('Falta robots.txt.');

// Peso de la home (1x): HTML + CSS + JS + fuentes declaradas + imágenes con su variante más ligera
const size = (path) => (existsSync(path) ? statSync(path).size : 0);
let weight = 0;
const home = html.get('index.html') || '';
weight += size(join(root, 'index.html')) + size(join(root, 'dist/tlatolli.css')) + size(join(root, 'dist/tlatolli.js'));
const cssText = existsSync(join(root, 'dist/tlatolli.css')) ? readFileSync(join(root, 'dist/tlatolli.css'), 'utf8') : '';
for (const match of cssText.matchAll(/url\(\.\.\/(frontend\/src\/assets\/fonts\/[^)]+)\)/g)) weight += size(join(root, match[1]));
for (const match of home.matchAll(/srcset="([^"]+)"/g)) weight += size(join(root, match[1].split(',')[0].trim().split(/\s+/)[0]));
for (const match of home.matchAll(/<img\b(?![^>]*srcset)[^>]*\bsrc="([^"]+)"/g)) if (!/^https?:/.test(match[1])) weight += size(join(root, match[1]));
if (weight > HOME_BUDGET) report(`La home pesa ${(weight / 1024).toFixed(0)} KB (máximo 500 KB).`);

// Sintaxis y pruebas de Node
const jsFiles = [];
function collect(dir) {
  if (!existsSync(dir)) return;
  readdirSync(dir, { withFileTypes: true }).forEach((entry) => { const path = join(dir, entry.name); if (entry.isDirectory()) collect(path); else if (/\.(js|mjs)$/.test(entry.name)) jsFiles.push(path); });
}
collect(join(root, 'frontend', 'src'));
collect(join(root, 'tools'));
jsFiles.push(join(root, 'build.mjs'));
jsFiles.forEach((file) => run('syntax', ['--check', file]));
['diagnostico', 'marketing', 'fidelizacion', 'analitica', 'ruta'].forEach((name) => {
  const path = jsFiles.find((file) => file.endsWith(`/sections/${name}/${name}.test.js`));
  if (path) run('test', [path]); else report(`Falta la prueba de ${name}.`);
});

function run(kind, args) {
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) report(`Node ${kind} falló: ${relative(root, args.at(-1))}\n${(result.stderr || result.stdout).trim()}`);
}
if (errors.length) { console.error(errors.map((error) => `✗ ${error}`).join('\n')); process.exit(1); }
console.log(`QA estático OK: ${pages.length} páginas (H1 único, landmarks, enlaces entre páginas, assets, JSON-LD, sitemap), home ${(weight / 1024).toFixed(0)} KB de 500 KB, Node verificado.`);
