import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const source = (path) => join(root, 'frontend', 'src', path);
const exists = async (path) => access(path).then(() => true).catch(() => false);
const read = async (path) => (await exists(path) ? readFile(path, 'utf8') : '');
const cssFiles = ['assets/fonts/fonts.css', 'styles/reset.css', 'styles/variables.css', 'styles/global.css', 'styles/components.css', 'pages/inicio/inicio.css'];
const jsFiles = ['shared/shared.js', 'pages/inicio/inicio.js'];
const readCss = async (file) => {
  const content = await read(source(file));
  return file === 'assets/fonts/fonts.css' ? content.replaceAll('url(./', 'url(../frontend/src/assets/fonts/') : content;
};

const sections = JSON.parse(await read(source('sections/sections.json')));
const template = await read(join(root, 'index.template.html'));
const top = await read(source('pages/inicio/top.html'));
const bottom = await read(source('pages/inicio/bottom.html'));
let html = template.replace('<!-- TOP -->', top).replace('<!-- BOTTOM -->', bottom);
const sectionCss = [];
const sectionJs = [];
const missing = [];

for (const section of sections) {
  let candidate = '';
  for (const base of section.candidates || []) {
    if (await exists(source(`${base}.html`))) { candidate = base; break; }
  }
  const marker = `<!-- SECTION:${section.id} -->`;
  if (!candidate) {
    missing.push(section.id);
    html = html.replace(marker, `<!-- SECTION:${section.id} pendiente -->`);
    continue;
  }
  html = html.replace(marker, await read(source(`${candidate}.html`)));
  const cssPath = source(`${candidate}.css`);
  const jsPath = source(`${candidate}.js`);
  if (await exists(cssPath)) sectionCss.push(`\n/* ${section.id} */\n${await read(cssPath)}`);
  if (await exists(jsPath)) sectionJs.push(`\n/* ${section.id} */\n${await read(jsPath)}`);
}

await mkdir(join(root, 'dist'), { recursive: true });
const polishCss = await read(source('styles/polish.css'));
const polishJs = await read(source('shared/polish.js'));
await writeFile(join(root, 'dist/tlatolli.css'), `${(await Promise.all(cssFiles.map(readCss))).join('\n')}${sectionCss.join('\n')}\n${polishCss}`);
await writeFile(join(root, 'dist/tlatolli.js'), `${(await Promise.all(jsFiles.map((file) => read(source(file))))).join('\n')}${sectionJs.join('\n')}\n${polishJs}`);
await writeFile(join(root, 'index.html'), html);

if (missing.length) console.warn(`Tlatolli: secciones pendientes (${missing.join(', ')}); se ensambló lo disponible.`);
console.log(`Tlatolli: index.html + dist/tlatolli.css + dist/tlatolli.js (${sections.length - missing.length}/${sections.length} secciones).`);
