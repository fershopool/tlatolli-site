(() => {
  const noop = () => {};
  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => [...(root?.querySelectorAll(selector) || [])];
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const whatsapp = (text = '') => `https://wa.me/525539761846?text=${encodeURIComponent(text)}`;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;

  function inView(element, options = {}) {
    if (!element || !('IntersectionObserver' in window)) {
      options.enter?.(element);
      return noop;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) options.enter?.(entry.target, entry);
      else options.leave?.(entry.target, entry);
      if (options.once && entry.isIntersecting) observer.unobserve(entry.target);
    }), { threshold: options.threshold ?? .12, rootMargin: options.rootMargin ?? '0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }

  function progress(element, options = {}) {
    if (!element) return noop;
    const mode = options.mode || 'fill';
    const pin = options.pin === true;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const range = Math.max(rect.height - innerHeight, 1);
      const value = clamp(-rect.top / range);
      element.style.setProperty('--progress', value.toFixed(4));
      if (mode === 'fill') element.style.setProperty('--progress-percent', `${value * 100}%`);
      if (pin) element.classList.toggle('is-pinned', rect.top <= 0 && rect.bottom >= innerHeight);
      (options.onUpdate || options.update)?.(value, element);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); element.classList.remove('is-pinned'); };
  }

  function countUp(element, to, options = {}) {
    if (!element) return noop;
    const from = Number(options.from ?? 0);
    const duration = reduced() ? 0 : Number(options.duration ?? 900);
    const format = options.format || ((value) => Math.round(value).toLocaleString('es-MX'));
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const amount = duration ? clamp((now - start) / duration) : 1;
      element.textContent = format(lerp(from, Number(to), 1 - ((1 - amount) ** 3)));
      if (amount < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => frame && cancelAnimationFrame(frame);
  }

  // Analítica sin cookies: solo actúa si el build inyectó Plausible o Umami.
  const track = (name, props = {}) => {
    try {
      if (typeof window.plausible === 'function') window.plausible(name, { props });
      else window.umami?.track?.(name, props);
    } catch (error) { /* la analítica nunca debe romper el sitio */ }
  };
  document.addEventListener('click', (event) => {
    const target = event.target.closest?.('[data-track]');
    if (target) track(target.dataset.track, target.dataset.trackLabel ? { label: target.dataset.trackLabel } : {});
  });

  const TL = { $, $$, reduced, whatsapp, inView, progress, countUp, lerp, clamp, track };
  window.Tlatolli = TL;
  Object.assign(window, { TL, $, $$, reduced, whatsapp, inView, progress, countUp, lerp, clamp });
})();

document.documentElement.classList.add('js-ready');

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const setMenu = (open) => {
  nav?.classList.toggle('is-open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
};
menuToggle?.addEventListener('click', () => setMenu(!nav?.classList.contains('is-open')));
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && nav?.classList.contains('is-open')) { setMenu(false); menuToggle?.focus(); } });

document.querySelectorAll('.reveal').forEach((element) => {
  window.inView?.(element, { once: true, enter: (node) => node.classList.add('is-visible') });
});

// Resalta en la barra móvil la sección visible
const spy = [...document.querySelectorAll('.mobile-nav [data-spy]')];
if (spy.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) spy.forEach((a) => a.classList.toggle('is-active', a.dataset.spy === entry.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  spy.forEach((a) => { const section = document.getElementById(a.dataset.spy); if (section) io.observe(section); });
}

/* ruta */
(function (root) {
  var TL = root.TL = root.TL || {};
  var WHATSAPP_NUMBER = '525539761846';
  var NEEDS = [
    { id: 'encontrar', label: 'Que más personas me encuentren', services: ['seo', 'publicidad', 'redes'] },
    { id: 'marca', label: 'Ordenar mi marca y mi mensaje', services: ['estrategia'] },
    { id: 'web', label: 'Tener un sitio nuevo o mejorar el que tengo', services: ['web', 'seo'] },
    { id: 'whatsapp', label: 'Atender y vender mejor por WhatsApp o correo', services: ['mensajeria', 'crm'] },
    { id: 'regresar', label: 'Que mis clientes regresen', services: ['crm', 'mensajeria'] },
    { id: 'medir', label: 'Saber qué funciona y qué no', services: ['analitica'] },
    { id: 'contenido', label: 'Contenido para redes que sí conecte', services: ['redes', 'audiovisual'] },
    { id: 'video', label: 'Producir video o transmitir en vivo', services: ['audiovisual'] },
    { id: 'app', label: 'Tener una app o experiencia móvil', services: ['apps'] },
    { id: 'zona', label: 'Llegar a una zona o a varias sucursales', services: ['geomarketing', 'seo'] },
    { id: 'nose', label: 'Todavía no lo sé', services: ['estrategia', 'analitica'] }
  ];
  var STARTS = [
    { id: 'cero', label: 'Desde cero' },
    { id: 'mejora', label: 'Ya tengo algo y quiero mejorarlo' },
    { id: 'nose', label: 'Aún no lo sé' }
  ];
  var NAMES = { estrategia: 'Estrategia y marca', web: 'Diseño web: desde cero o rediseño', redes: 'Redes y contenido', publicidad: 'Publicidad de pago', seo: 'SEO y búsqueda local', mensajeria: 'WhatsApp y correo', crm: 'CRM y fidelización', analitica: 'Analítica y tableros', apps: 'Apps y PWA', audiovisual: 'Producción audiovisual y transmisiones en vivo', geomarketing: 'Geomarketing' };
  var ORDER = Object.keys(NAMES);
  var WHY = {
    estrategia: 'Aclara el mensaje antes de invertir en medios.', web: 'Tu punto de contacto principal, claro y rápido.', redes: 'Presencia constante con voz propia.', publicidad: 'Llegar a personas con intención de compra.', seo: 'Que te encuentren cuando te buscan.', mensajeria: 'Seguimiento ordenado con quien ya te escribió.', crm: 'Memoria de tus clientes y razones para volver.', analitica: 'Medir para mejorar cada mes.', apps: 'Una experiencia que vive en el celular.', audiovisual: 'Video y transmisiones con intención.', geomarketing: 'Decisiones con mapa.'
  };

  function clean(answers) {
    answers = answers || {};
    var ids = NEEDS.map(function (need) { return need.id; });
    return { needs: (Array.isArray(answers.needs) ? answers.needs : []).filter(function (id) { return ids.indexOf(id) >= 0; }), start: STARTS.some(function (s) { return s.id === answers.start; }) ? answers.start : 'nose' };
  }
  function compute(answers) {
    var data = clean(answers), scores = {};
    data.needs.forEach(function (id) {
      NEEDS.filter(function (need) { return need.id === id; })[0].services.forEach(function (service, index) { scores[service] = (scores[service] || 0) + (index === 0 ? 2 : 1); });
    });
    var services = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a] || ORDER.indexOf(a) - ORDER.indexOf(b); }).map(function (id) { return { id: id, name: NAMES[id], why: WHY[id], score: scores[id] }; });
    return { answers: data, services: services };
  }
  function labelOf(list, id) { return list.filter(function (item) { return item.id === id; })[0].label; }
  function buildMessage(answers, result) {
    var data = clean(answers), route = result || compute(data);
    return ['Hola Tlatolli, armé mi ruta en el sitio.', '', 'Lo que necesito:'].concat(data.needs.map(function (id) { return '- ' + labelOf(NEEDS, id); }), ['', 'Punto de partida: ' + labelOf(STARTS, data.start), '', 'Combinación sugerida:'], route.services.map(function (s) { return '- ' + s.name; }), ['', 'Me gustaría platicar el alcance y cómo cotizan.']).join('\n');
  }
  function whatsappUrl(message) { return typeof TL.whatsapp === 'function' ? TL.whatsapp(message) : 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message); }
  TL.ruta = { needs: NEEDS, starts: STARTS, compute: compute, buildMessage: buildMessage, whatsappUrl: whatsappUrl };

  var doc = root.document;
  var section = doc && doc.getElementById('ruta');
  if (!section) return;
  var form = section.querySelector('form'), result = section.querySelector('[data-ruta-result]');
  function field(type, name, item) {
    var label = doc.createElement('label'), input = doc.createElement('input'), text = doc.createElement('span');
    input.type = type; input.name = name; input.value = item.id; text.textContent = item.label;
    label.append(input, text);
    return label;
  }
  section.querySelector('[data-ruta-needs]').append.apply(section.querySelector('[data-ruta-needs]'), NEEDS.map(function (need) { return field('checkbox', 'needs', need); }));
  var startBox = section.querySelector('[data-ruta-start]');
  startBox.append.apply(startBox, STARTS.map(function (start) { var label = field('radio', 'start', start); if (start.id === 'nose') label.firstChild.checked = true; return label; }));
  function read() { var data = new root.FormData(form); return { needs: data.getAll('needs'), start: data.get('start') }; }
  function render() {
    var answers = read(), route = compute(answers);
    result.textContent = '';
    if (!route.answers.needs.length) { var empty = doc.createElement('p'); empty.className = 's-ruta__empty'; empty.textContent = 'Marca al menos una necesidad para ver tu ruta sugerida.'; result.append(empty); return; }
    var title = doc.createElement('h3'); title.textContent = 'Tu ruta sugerida';
    var list = doc.createElement('ol'); list.className = 's-ruta__services';
    route.services.forEach(function (s) { var li = doc.createElement('li'), b = doc.createElement('b'), small = doc.createElement('span'); b.textContent = s.name; small.textContent = s.why; li.append(b, small); list.append(li); });
    var note = doc.createElement('p'); note.className = 's-ruta__note'; note.textContent = 'Es un punto de partida: el alcance y la cotización se afinan contigo. No hay precios fijos.';
    var link = doc.createElement('a'); link.className = 'btn btn--primary'; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.href = whatsappUrl(buildMessage(answers, route)); link.textContent = 'Enviar mi ruta por WhatsApp ↗';
    link.setAttribute('data-track', 'ruta_whatsapp'); link.setAttribute('data-track-label', route.services.map(function (s) { return s.id; }).join(','));
    result.append(title, list, note, link);
  }
  form.addEventListener('change', render);
  form.addEventListener('submit', function (event) { event.preventDefault(); });
}(typeof window !== 'undefined' ? window : globalThis));


/* proyectos */
(function () {
  const button = document.querySelector('[data-live-open]');
  const live = document.querySelector('[data-live]');
  if (!button || !live) return;
  // El sitio del caso solo se carga cuando se pide verlo aquí.
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = button.dataset.url;
    frame.title = `Vista en vivo de ${button.dataset.name}`;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.sandbox = 'allow-scripts allow-forms allow-same-origin allow-popups';
    const wrap = document.createElement('div');
    wrap.className = 'frame';
    wrap.append(frame);
    live.replaceChildren(wrap);
    button.disabled = true;
    window.TL?.track?.('caso_en_vivo', { label: button.dataset.name });
  });
}());


/* diagnostico */
(function (root) {
  var TL = root.TL = root.TL || {};
  var WHATSAPP_NUMBER = '525539761846';
  var PROBLEMS = [
    'no consigo suficientes clientes', 'mis clientes no regresan', 'publico pero no sé si funciona',
    'no conozco a mis clientes', 'mis herramientas están separadas', 'mejorar mi presencia digital',
    'digitalizar mi negocio', 'conocer mejor mis ventas'
  ];
  var MODULES = {
    presencia: { name: 'Presencia digital', reason: 'Haz más claro el primer contacto y facilita que te encuentren.' },
    marketing: { name: 'Marketing', reason: 'Convierte tus publicaciones en acciones con una intención clara.' },
    fidelizacion: { name: 'Fidelización', reason: 'Crea motivos para que tus clientes regresen y mantén la conversación.' },
    analitica: { name: 'Analítica', reason: 'Reúne señales para saber qué pasa y decidir el siguiente movimiento.' },
    integraciones: { name: 'Integraciones', reason: 'Conecta las herramientas que ya usas para evitar trabajo repetido.' },
    app: { name: 'Ruta digital', reason: 'Ordena una experiencia digital que pueda crecer contigo.' }
  };
  var BUSINESSES = ['Restaurante o alimentos', 'Comercio', 'Servicios profesionales', 'Educación o cultura', 'Otro tipo de negocio'];
  var CONNECTIONS = ['Estoy empezando', 'Tengo presencia básica', 'Uso varias herramientas', 'Tengo un ecosistema conectado'];
  var WEIGHTS = {
    'no consigo suficientes clientes': { presencia: 3, marketing: 3 },
    'mis clientes no regresan': { fidelizacion: 4, analitica: 1 },
    'publico pero no sé si funciona': { marketing: 2, analitica: 4 },
    'no conozco a mis clientes': { analitica: 3, fidelizacion: 2 },
    'mis herramientas están separadas': { integraciones: 4, analitica: 2 },
    'mejorar mi presencia digital': { presencia: 4, marketing: 1 },
    'digitalizar mi negocio': { app: 3, presencia: 2, integraciones: 1 },
    'conocer mejor mis ventas': { analitica: 4, marketing: 1 }
  };
  function cleanAnswers(answers) {
    answers = answers || {};
    return { problems: Array.isArray(answers.problems) ? answers.problems.slice() : [], business: String(answers.business || ''), connection: String(answers.connection || '') };
  }
  function validateAnswers(answers) {
    var data = cleanAnswers(answers), errors = {};
    if (!data.problems.length) errors.problems = 'Elige al menos un reto.';
    else if (data.problems.some(function (problem) { return !PROBLEMS.includes(problem); })) errors.problems = 'Elige un reto de la lista.';
    if (!data.business) errors.business = 'Elige un tipo de negocio.';
    else if (!BUSINESSES.includes(data.business)) errors.business = 'Elige un tipo de negocio de la lista.';
    if (!data.connection) errors.connection = 'Elige un nivel de conexión.';
    else if (!CONNECTIONS.includes(data.connection)) errors.connection = 'Elige un nivel de conexión de la lista.';
    return { valid: Object.keys(errors).length === 0, errors: errors };
  }
  function compute(answers) {
    var data = cleanAnswers(answers), scores = {}, reasons = {};
    Object.keys(MODULES).forEach(function (key) { scores[key] = 0; reasons[key] = []; });
    data.problems.forEach(function (problem) {
      var weights = WEIGHTS[problem] || {};
      Object.keys(weights).forEach(function (module) { scores[module] += weights[module]; });
    });
    if (data.connection === 'Estoy empezando') scores.presencia += 1;
    if (data.connection === 'Tengo presencia básica') scores.presencia += 1;
    if (data.connection === 'Uso varias herramientas') scores.integraciones += 1;
    if (data.connection === 'Tengo un ecosistema conectado') scores.analitica += 1;
    data.problems.forEach(function (problem) {
      var weights = WEIGHTS[problem] || {};
      Object.keys(weights).forEach(function (module) { reasons[module].push(problem); });
    });
    var modules = Object.keys(scores).filter(function (key) { return scores[key] > 0; }).sort(function (a, b) { return scores[b] - scores[a] || MODULES[a].name.localeCompare(MODULES[b].name); }).map(function (key) {
      var prompt = reasons[key].slice(0, 2).join(' y ');
      return { key: key, name: MODULES[key].name, score: scores[key], reason: MODULES[key].reason + (prompt ? ' Responde a: ' + prompt + '.' : '') };
    });
    var first = modules[0] || { name: 'Entender tu punto de partida', reason: 'Comienza por observar una señal concreta de tu negocio.' };
    var subjects = { 'Restaurante o alimentos': 'Tu negocio de alimentos', Comercio: 'Tu comercio', 'Servicios profesionales': 'Tu servicio', 'Educación o cultura': 'Tu proyecto de educación o cultura', 'Otro tipo de negocio': 'Tu negocio' };
    var levels = { 'Estoy empezando': 'está empezando', 'Tengo presencia básica': 'ya tiene una presencia básica', 'Uso varias herramientas': 'ya usa varias herramientas', 'Tengo un ecosistema conectado': 'ya tiene un ecosistema conectado' };
    var subject = subjects[data.business] || 'Tu negocio', level = levels[data.connection] || 'está encontrando su punto de partida';
    var summary = subject + ' ' + level + '. Empieza por ' + first.name.toLowerCase() + ': ' + first.reason;
    return { answers: data, modules: modules, firstLever: first.name + ': ' + first.reason, summary: summary, title: 'Tu primera palanca es ' + first.name.toLowerCase() };
  }
  function buildMessage(answers, result) {
    var data = cleanAnswers(answers), recommendation = result || compute(data);
    return ['Hola Tlatolli, quiero conversar sobre mi diagnóstico.', '', 'Mis respuestas:', 'Retos: ' + (data.problems.join('; ') || 'No indicado'), 'Tipo de negocio: ' + (data.business || 'No indicado'), 'Nivel de conexión: ' + (data.connection || 'No indicado'), '', 'Recomendación completa:', recommendation.summary, 'Primera palanca: ' + recommendation.firstLever, 'Módulos recomendados:', recommendation.modules.map(function (module) { return '- ' + module.name + ': ' + module.reason; }).join('\n')].join('\n');
  }
  function whatsappUrl(message) { return typeof TL.whatsapp === 'function' ? TL.whatsapp(message) : 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message); }
  var state = { answers: null, result: null };
  var api = TL.diagnostic = { problems: PROBLEMS.slice(), weights: WEIGHTS, validate: validateAnswers, compute: compute, buildMessage: buildMessage, whatsappUrl: whatsappUrl, getState: function () { return state.result ? { answers: cleanAnswers(state.answers), result: state.result } : null; }, invalidate: function () { state.answers = null; state.result = null; return null; } };
  if (!root.document) return;
  var section = TL.$ ? TL.$('#diagnostico') : root.document.getElementById('diagnostico');
  if (!section) return;
  var form = section.querySelector('form'), steps = section.querySelectorAll('.s-diagnostico__step'), resultBox = section.querySelector('.s-diagnostico__result');
  var errors = section.querySelectorAll('[data-error]'), progress = section.querySelector('.s-diagnostico__progress');
  function readForm() { var data = new FormData(form); return { problems: data.getAll('problems'), business: data.get('business') || '', connection: data.get('connection') || '' }; }
  function invalidate() { api.invalidate(); if (resultBox) resultBox.hidden = true; if (form) form.hidden = false; section.dispatchEvent(new root.CustomEvent('tl:diagnostic', { bubbles: true, detail: { answers: null, result: null } })); }
  function showErrors(validation) { errors.forEach(function (item) { item.textContent = validation.errors[item.dataset.error] || ''; }); }
  function render(recommendation) {
    section.querySelector('[data-result="title"]').textContent = recommendation.title;
    section.querySelector('[data-result="summary"]').textContent = recommendation.summary;
    section.querySelector('[data-result="lever"]').textContent = recommendation.firstLever;
    section.querySelector('[data-whatsapp]').href = whatsappUrl(buildMessage(state.answers, recommendation));
    var moduleList = section.querySelector('[data-result="modules"]'); moduleList.textContent = '';
    recommendation.modules.forEach(function (module) { var item = root.document.createElement('div'); item.className = 's-diagnostico__module'; item.innerHTML = '<strong></strong><span></span>'; item.querySelector('strong').textContent = module.name; item.querySelector('span').textContent = module.reason; moduleList.appendChild(item); });
    resultBox.hidden = false; form.hidden = true; if (typeof resultBox.focus === 'function') resultBox.focus();
  }
  steps.forEach(function (step) { step.classList.add('is-active'); });
  form.querySelectorAll('input').forEach(function (input) { input.addEventListener('change', invalidate); });
  form.addEventListener('submit', function (event) { event.preventDefault(); var answers = readForm(), validation = validateAnswers(answers); showErrors(validation); if (!validation.valid) { var firstError = section.querySelector('[data-error]:not(:empty)'); if (firstError) firstError.scrollIntoView({ block: 'nearest' }); return; } state.answers = answers; state.result = compute(answers); if (TL.track) TL.track('diagnostico_completo', { label: state.result.modules[0] ? state.result.modules[0].key : 'sin_modulo' }); if (progress) progress.textContent = 'Diagnóstico listo'; render(state.result); section.dispatchEvent(new root.CustomEvent('tl:diagnostic', { bubbles: true, detail: { answers: cleanAnswers(answers), result: state.result } })); });
  section.querySelector('[data-reset]')?.addEventListener('click', invalidate);
})(typeof window !== 'undefined' ? window : globalThis);


/* contacto */
(function (root) {
  var TL = root.TL = root.TL || {}, NUMBER = '525539761846';
  var section = root.document && (TL.$ ? TL.$('#contacto') : root.document.getElementById('contacto'));
  if (!section) return;
  var form = section.querySelector('form'), status = section.querySelector('[data-status]'), mainLink = section.querySelector('[data-contact-whatsapp]');
  function urlFor(message) { var fromShared = typeof TL.whatsapp === 'function' ? TL.whatsapp(message) : ''; return typeof fromShared === 'string' && fromShared ? fromShared : 'https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(message); }
  function diagnosticText() { var current = TL.diagnostic && typeof TL.diagnostic.getState === 'function' ? TL.diagnostic.getState() : null; if (!current) return ''; return '\n\nDiagnóstico Tlatolli:\n' + TL.diagnostic.buildMessage(current.answers, current.result); }
  function open(message) { if (TL.track) TL.track('whatsapp_click', { label: 'formulario' }); var url = urlFor(message), popup = root.open ? root.open(url, '_blank', 'noopener,noreferrer') : null; status.textContent = popup ? 'WhatsApp se abrió en una pestaña nueva.' : 'Si WhatsApp no se abrió, usa este enlace. '; var link = root.document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Abrir WhatsApp'; status.appendChild(link); }
  function updateMainLink(event) { if (mainLink) mainLink.href = event.detail && event.detail.result ? urlFor(TL.diagnostic.buildMessage(event.detail.answers, event.detail.result)) : 'https://wa.me/' + NUMBER; }
  root.document.addEventListener('tl:diagnostic', updateMainLink);
  form.addEventListener('submit', function (event) { event.preventDefault(); var data = new FormData(form), name = String(data.get('name') || '').trim(), business = String(data.get('business') || '').trim(), need = String(data.get('need') || '').trim(); if (!name || !business || !need) { status.textContent = 'Completa nombre, negocio y necesidad.'; return; } open(['Hola Tlatolli, quiero conversar sobre mi negocio.', 'Nombre: ' + name, 'Negocio: ' + business, 'Necesidad: ' + need].join('\n') + diagnosticText()); });
})(typeof window !== 'undefined' ? window : globalThis);

(function () {
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Progreso de lectura + sombra de cabecera
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  const header = document.querySelector('.site-header');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
      header?.classList.toggle('is-scrolled', scrollY > 12);
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // Greca decorativa entre secciones
  $$('main > section').slice(1).forEach((section) => {
    const band = document.createElement('div');
    band.className = 'greca';
    band.setAttribute('aria-hidden', 'true');
    section.before(band);
  });

  // Foco de luz que sigue al cursor en las tarjetas de los simuladores
  const SPOT = '.s-problema__piece,.s-analitica__kpi,.s-analitica__panel,.s-app__card,.s-presencia__panel,.s-live__benefits article,.s-marketing__calendar,.s-fidelizacion__pos';
  $$(SPOT).forEach((element) => element.setAttribute('data-spot', ''));
  if (fine) {
    document.addEventListener('pointermove', (event) => {
      const target = event.target.closest?.('[data-spot]');
      if (!target) return;
      const box = target.getBoundingClientRect();
      target.style.setProperty('--mx', `${event.clientX - box.left}px`);
      target.style.setProperty('--my', `${event.clientY - box.top}px`);
    }, { passive: true });
  }

  // Revelado escalonado: el retraso solo cuenta para la entrada
  $$('.reveal').forEach((element) => {
    const index = $$('.reveal', element.parentElement).indexOf(element);
    element.style.setProperty('--i', Math.min(Math.max(index, 0), 5));
    element.addEventListener('transitionend', () => element.style.setProperty('--i', 0), { once: true });
  });
}());
