import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyticsTag, casoDetalle, casoHead, esc, jsonld, renderCasosCards, renderServicios, robots, serviciosJson, sitemap } from './tools/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const source = (path) => join(root, 'frontend', 'src', path);
const exists = async (path) => access(path).then(() => true).catch(() => false);
const read = async (path) => (await exists(path) ? readFile(path, 'utf8') : '');
const json = async (path) => JSON.parse(await read(path));

const cfg = await json(join(root, 'site.config.json'));
const env = process.env;
// La analítica queda apagada hasta que exista un ID (site.config.json o variables de entorno).
const analytics = { provider: env.TLATOLLI_ANALYTICS_PROVIDER ?? cfg.analytics.provider, id: env.TLATOLLI_ANALYTICS_ID ?? cfg.analytics.id, src: env.TLATOLLI_ANALYTICS_SRC ?? cfg.analytics.src };
const servicios = await json(source('content/servicios.json'));
const casos = await json(source('content/casos.json'));
const registry = new Map((await json(source('sections/sections.json'))).map((section) => [section.id, section]));
const pages = [...await json(source('pages.json'))];
casos.casos.forEach((caso) => pages.push({
  file: `caso-${caso.slug}.html`, bundle: 'paginas', nav: 'casos', schema: 'webPage', caso,
  title: `${caso.name} | Caso Tlatolli`, description: `${caso.resumen} Problema, qué se hizo, estado actual y bitácora de mejora continua.`,
  sections: ['casohead', 'casodetalle', 'cta']
}));

const cssBase = ['assets/fonts/fonts.css', 'styles/reset.css', 'styles/variables.css', 'styles/global.css', 'styles/components.css', 'pages/inicio/inicio.css'];
const jsBase = ['shared/shared.js', 'pages/inicio/inicio.js'];
const readCss = async (file) => {
  const content = await read(source(file));
  return file === 'assets/fonts/fonts.css' ? content.replaceAll('url(./', 'url(../frontend/src/assets/fonts/') : content;
};
const fragments = { servicios: () => renderServicios(servicios) + serviciosJson(servicios), casos: () => renderCasosCards(casos) };
const template = await read(join(root, 'index.template.html'));
const top = await read(source('pages/inicio/top.html'));
const bottom = await read(source('pages/inicio/bottom.html'));
const bundles = new Map();
const problems = [];

for (const page of pages) {
  const parts = [];
  for (const id of page.sections) {
    const section = registry.get(id);
    if (!section) { problems.push(`${page.file}: sección desconocida «${id}»`); continue; }
    const b = bundles.get(page.bundle) ?? bundles.set(page.bundle, new Set()).get(page.bundle);
    b.add(section.dir);
    parts.push(section.render ? { casoHead, casoDetalle }[section.render]({ caso: page.caso, casos }) : await read(source(`sections/${section.dir}/${section.dir}.html`)));
  }
  const main = parts.join('\n').replace(/<!--FRAGMENT:(\w+)-->/g, (_, name) => fragments[name]());
  const url = cfg.url + (page.file === 'index.html' ? '' : page.file);
  const html = template
    .replace('<!-- TOP -->', top).replace('<!-- MAIN -->', main).replace('<!-- BOTTOM -->', bottom)
    .replaceAll('{{title}}', esc(page.title)).replaceAll('{{description}}', esc(page.description)).replaceAll('{{canonical}}', url)
    .replaceAll('{{ogimage}}', `${cfg.url}frontend/src/assets/brand/og.png`).replaceAll('{{bundle}}', page.bundle)
    .replace('{{jsonld}}', jsonld(page.schema, { cfg, page, servicios, casos })).replace('{{analytics}}', analyticsTag(analytics))
    .replace(/\{\{cur:(\w+)\}\}/g, (_, nav) => (nav === page.nav ? 'aria-current="page"' : ''))
    .replaceAll('{{h}}', page.file === 'index.html' ? '' : 'index.html');
  await writeFile(join(root, page.file), html);
}

await mkdir(join(root, 'dist'), { recursive: true });
const polishCss = await read(source('styles/polish.css'));
const polishJs = await read(source('shared/polish.js'));
for (const [name, dirs] of bundles) {
  const css = [], js = [];
  for (const dir of dirs) {
    const stylesheet = await read(source(`sections/${dir}/${dir}.css`)), script = await read(source(`sections/${dir}/${dir}.js`));
    if (stylesheet) css.push(`\n/* ${dir} */\n${stylesheet}`);
    if (script) js.push(`\n/* ${dir} */\n${script}`);
  }
  await writeFile(join(root, `dist/${name}.css`), `${(await Promise.all(cssBase.map(readCss))).join('\n')}${css.join('\n')}\n${polishCss}`);
  await writeFile(join(root, `dist/${name}.js`), `${(await Promise.all(jsBase.map((file) => read(source(file))))).join('\n')}${js.join('\n')}\n${polishJs}`);
}
await writeFile(join(root, 'sitemap.xml'), sitemap(cfg, pages));
await writeFile(join(root, 'robots.txt'), robots(cfg));

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`Tlatolli: ${pages.length} páginas, ${bundles.size} bundles, sitemap.xml y robots.txt${analytics.id ? ` (analítica ${analytics.provider})` : ' (analítica apagada)'}.`);
