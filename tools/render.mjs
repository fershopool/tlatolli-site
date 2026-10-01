// Fragmentos y metadatos generados en build a partir de frontend/src/content/*.json.
export const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const fecha = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
const pad = (n) => String(n).padStart(2, '0');
const img = (c, sizes, eager = false) => `<img src="./frontend/src/assets/cases/${c.imagen}-785.webp" srcset="./frontend/src/assets/cases/${c.imagen}-480.webp 480w, ./frontend/src/assets/cases/${c.imagen}-785.webp 785w" sizes="${sizes}" width="785" height="971" alt="${esc(c.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

export function renderServicios(servicios) {
  return `<ul class="s-servicios__grid">${servicios.map((s, i) => `
    <li><article class="svc" id="servicio-${s.id}">
      <span class="svc__no">${pad(i + 1)}</span>
      <h3>${esc(s.name)}</h3>
      <p class="svc__resumen">${esc(s.resumen)}</p>
      <details class="svc__more" data-track="servicio_detalle" data-track-label="${s.id}">
        <summary>Para quién y qué incluye</summary>
        <dl>
          <dt>Para quién</dt><dd>${esc(s.para)}</dd>
          <dt>Qué incluye</dt><dd><ul>${s.incluye.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></dd>
          <dt>Cómo se combina</dt><dd>${esc(s.combina)}</dd>
        </dl>
      </details>
    </article></li>`).join('')}</ul>`;
}

export const serviciosJson = (servicios) => `<script type="application/json" id="data-servicios">${JSON.stringify(servicios.map(({ id, name }) => ({ id, name }))).replaceAll('<', '\\u003c')}</script>`;

export function renderCasosCards({ estado, casos }) {
  return `<ul class="s-casos__grid">${casos.map((c) => `
    <li><article class="caso-card">
      <div class="caso-card__media">${img(c, '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw')}</div>
      <div class="caso-card__body">
        <p class="caso-card__status"><span aria-hidden="true"></span>${esc(estado)}</p>
        <p class="caso-card__type">${esc(c.tipo)}</p>
        <h3><a href="caso-${c.slug}.html" data-track="caso_abrir" data-track-label="${c.slug}">${esc(c.name)}</a></h3>
        <p>${esc(c.resumen)}</p>
        <p class="caso-card__date">Última mejora: <time datetime="${c.ultima}">${fecha(c.ultima)}</time></p>
      </div>
    </article></li>`).join('')}
    <li class="caso-card caso-card--next"><p class="caso-card__type">¿Sigue tu negocio?</p><h3>Cuéntanos qué quieres lograr.</h3><a class="btn btn--primary" href="#diagnostico" data-track="cta_diagnostico" data-track-label="casos">Agenda tu diagnóstico</a></li>
  </ul>`;
}

export function casoHead({ caso: c, casos }) {
  return `<section id="caso" class="section section--ink s-caso">
  <div class="container s-caso__inner">
    <div class="s-caso__copy">
      <nav class="s-caso__crumbs" aria-label="Ruta de navegación"><a href="{{h}}#casos">Casos</a><span aria-hidden="true">/</span><span aria-current="page">${esc(c.name)}</span></nav>
      <p class="s-caso__status"><span aria-hidden="true"></span>${esc(casos.estado)}</p>
      <h1>${esc(c.name)}</h1>
      <p class="s-caso__lead">${esc(c.resumen)}</p>
      <dl class="s-caso__meta">
        <div><dt>Tipo</dt><dd>${esc(c.tipo)}</dd></div>
        <div><dt>Última mejora</dt><dd><time datetime="${c.ultima}">${fecha(c.ultima)}</time></dd></div>
        <div><dt>Servicios</dt><dd>${c.servicios.map(esc).join(' · ')}</dd></div>
      </dl>
      <div class="s-caso__actions">
        <a class="btn btn--primary" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer" data-track="caso_sitio" data-track-label="${c.slug}">Abrir el sitio <span aria-hidden="true">↗</span></a>
        <button class="btn btn--ghost" type="button" data-live-open data-url="${esc(c.url)}" data-name="${esc(c.name)}">Verlo aquí <span aria-hidden="true">▶</span></button>
      </div>
    </div>
    <figure class="s-caso__media">${img(c, '(min-width: 900px) 440px, 90vw', true)}</figure>
  </div>
  <div class="container"><div class="s-caso__live" data-live aria-live="polite"></div></div>
</section>`;
}

export function casoDetalle({ caso: c, casos }) {
  const list = casos.casos;
  const i = list.findIndex((x) => x.slug === c.slug);
  const prev = list[(i + list.length - 1) % list.length], next = list[(i + 1) % list.length];
  return `<section id="detalle" class="section section--ivory s-detalle">
  <div class="container s-detalle__grid">
    <div class="s-detalle__block"><p class="eyebrow">1 · El problema</p><h2>Qué había que resolver</h2><p>${esc(c.problema)}</p></div>
    <div class="s-detalle__block"><p class="eyebrow">2 · Qué se hizo</p><h2>Lo que construimos</h2><ul class="s-detalle__list">${c.hecho.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div class="s-detalle__block"><p class="eyebrow">3 · Estado actual</p><h2>Qué funciona hoy</h2><ul class="s-detalle__state">${c.hoy.map(([label, estado]) => `<li><span>${esc(label)}</span><b>${esc(estado)}</b></li>`).join('')}</ul></div>
  </div>
  <div class="container s-detalle__log">
    <div><p class="eyebrow">Mejora continua</p><h2>Bitácora</h2><p>Cada ajuste queda registrado. Este caso se publicó y sigue mejorando.</p></div>
    <ol class="s-bitacora">${c.bitacora.map(([d, text]) => `<li><time datetime="${d}">${fecha(d)}</time><p>${esc(text)}</p></li>`).join('')}</ol>
  </div>
  <div class="container"><p class="s-detalle__results"><b>Resultados</b> [PENDIENTE: resultados medidos de ${esc(c.name)}, solo si existen datos reales]</p></div>
  <div class="container"><nav class="s-detalle__pager" aria-label="Otros casos"><a href="caso-${prev.slug}.html"><small>← Anterior</small>${esc(prev.name)}</a><a href="caso-${next.slug}.html"><small>Siguiente →</small>${esc(next.name)}</a></nav></div>
</section>`;
}

export const jsonld = (kind, { cfg, page, servicios, casos }) => {
  const url = cfg.url, image = `${url}frontend/src/assets/brand/og.png`;
  const base = { '@context': 'https://schema.org' };
  const org = { '@type': 'ProfessionalService', '@id': `${url}#agencia`, name: cfg.name, alternateName: 'Tlatolli, la palabra', url, image, logo: `${url}frontend/src/assets/brand/logo.svg`, description: 'Agencia de marketing mexicana: servicios a la medida que se combinan en paquetes según lo que cada negocio necesita.', telephone: cfg.telefono, areaServed: { '@type': 'Country', name: 'México' }, availableLanguage: 'es-MX', contactPoint: { '@type': 'ContactPoint', telephone: cfg.telefono, contactType: 'ventas', availableLanguage: 'es-MX' }, knowsAbout: servicios.map((s) => s.name), hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Servicios Tlatolli', itemListElement: servicios.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, description: s.resumen } })) } };
  const graph = [];
  if (kind === 'professionalService') graph.push(org, { '@type': 'WebSite', '@id': `${url}#sitio`, url, name: cfg.name, inLanguage: 'es-MX', publisher: { '@id': `${url}#agencia` } });
  else graph.push({ '@type': 'ProfessionalService', '@id': org['@id'], name: cfg.name, url, telephone: cfg.telefono }, { '@type': kind === 'organization' ? 'AboutPage' : 'WebPage', url: url + page.file, name: page.title, description: page.description, inLanguage: 'es-MX', isPartOf: { '@id': `${url}#sitio` } });
  if (page.caso) graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: url }, { '@type': 'ListItem', position: 2, name: 'Casos', item: `${url}#casos` }, { '@type': 'ListItem', position: 3, name: page.caso.name, item: url + page.file }] });
  return `<script type="application/ld+json">${JSON.stringify({ ...base, '@graph': graph }).replaceAll('<', '\\u003c')}</script>`;
};

export function analyticsTag({ provider, id, src }) {
  if (!provider || !id) return '';
  if (provider === 'plausible') return `<script defer data-domain="${esc(id)}" src="${esc(src || 'https://plausible.io/js/script.js')}"></script>`;
  if (provider === 'umami') return `<script defer data-website-id="${esc(id)}" src="${esc(src || 'https://cloud.umami.is/script.js')}"></script>`;
  throw new Error(`Proveedor de analítica desconocido: ${provider} (usa plausible o umami).`);
}

export const sitemap = (cfg, pages) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${cfg.url}${p.file === 'index.html' ? '' : p.file}</loc></url>`).join('\n')}\n</urlset>\n`;
export const robots = (cfg) => `User-agent: *\nAllow: /\n\nSitemap: ${cfg.url}sitemap.xml\n`;
