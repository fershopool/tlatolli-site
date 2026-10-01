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

/* problema */
(function () { const root=(window.TL&&window.TL.$?window.TL.$('#problema'):document.querySelector('#problema')); if(!root)return; const board=root.querySelector('[data-problem-board]'),connect=root.querySelector('[data-connect]'); connect?.addEventListener('click',()=>{const on=board.classList.toggle('is-connected');connect.setAttribute('aria-pressed',String(on));}); }());


/* ciclo */
(function () {
  const root=(window.TL&&window.TL.$?window.TL.$('#sistema'):document.querySelector('#sistema')); if(!root)return;
  const steps=[...root.querySelectorAll('[data-step]')], track=root.querySelector('[data-cycle-steps]'), current=root.querySelector('[data-cycle-current]'), ring=root.querySelector('[data-cycle-ring]'), dot=root.querySelector('[data-cycle-dot]'), reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches; let active=0;
  const setStep=(index,scroll=false)=>{active=(index+steps.length)%steps.length;steps.forEach((step,i)=>{const on=i===active;step.classList.toggle('is-active',on);step.setAttribute('aria-current',on?'step':'false');});if(current)current.textContent=String(active+1).padStart(2,'0');if(ring)ring.style.strokeDashoffset=String(1043-(1043*(active+1)/8));if(dot)dot.style.transform=`rotate(${active*45}deg)`;if(scroll&&window.matchMedia('(max-width:680px)').matches)steps[active]?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'start'});};
  root.querySelector('[data-cycle-prev]')?.addEventListener('click',()=>setStep(active-1,true));root.querySelector('[data-cycle-next]')?.addEventListener('click',()=>setStep(active+1,true));
  root.addEventListener('keydown',(event)=>{if(event.key==='ArrowRight')setStep(active+1);if(event.key==='ArrowLeft')setStep(active-1);});
  root.tabIndex=0;
  const update=()=>{if(reduced||window.matchMedia('(max-width:680px)').matches)return;const rect=root.getBoundingClientRect(), span=Math.max(1,rect.height-window.innerHeight), ratio=Math.max(0,Math.min(1,-rect.top/span));setStep(Math.min(7,Math.floor(ratio*8)));};
  let usesProgress=false;if(!reduced&&window.TL?.progress){try{window.TL.progress(root,{mode:'pin',update});usesProgress=true;}catch(_error){/* scroll fallback below */}}
  if(!reduced&&!usesProgress)window.addEventListener('scroll',update,{passive:true});if(!reduced)update();
  let scrollTimer;track?.addEventListener('scroll',()=>{if(!window.matchMedia('(max-width:680px)').matches)return;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{const target=track.scrollLeft+track.clientWidth*.12;let nearest=0;steps.forEach((step,i)=>{if(Math.abs(step.offsetLeft-target)<Math.abs(steps[nearest].offsetLeft-target))nearest=i;});setStep(nearest);},80);},{passive:true});
}());


/* presencia */
(() => {
  const root = document.querySelector('#presencia');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-device-tab]')];
  const panels = [...root.querySelectorAll('[data-device-panel]')];
  const selectDevice = (name) => {
    tabs.forEach((tab) => { const selected = tab.dataset.deviceTab === name; tab.setAttribute('aria-selected', String(selected)); });
    panels.forEach((panel) => { panel.hidden = panel.dataset.devicePanel !== name; });
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => selectDevice(tab.dataset.deviceTab)));
  root.querySelector('[role="tablist"]')?.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = Math.max(0, tabs.indexOf(document.activeElement));
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus(); selectDevice(tabs[next].dataset.deviceTab);
  });
  const details = {
    whatsapp: ['WhatsApp puede recibir la pregunta que nace en la página.', 'El botón puede abrir una conversación con contexto: qué busca la persona, cuándo quiere ir y qué necesita resolver.'],
    citas: ['Las citas convierten intención en un momento concreto.', 'Una agenda puede leer disponibilidad, pedir los datos mínimos y dejar el siguiente paso confirmado.'],
    catalogo: ['El catálogo ayuda a decidir sin perderse.', 'Una ficha puede conectar producto, precio, existencias y una pregunta sencilla para continuar.'],
    cliente: ['La memoria del cliente evita empezar de cero.', 'Las señales de la visita pueden alimentar una lectura útil para reconocer, medir y volver a conversar.']
  };
  const detail = root.querySelector('[data-integration-detail]');
  const selectIntegration = (name) => {
    root.querySelectorAll('[data-integration]').forEach((item) => item.classList.toggle('is-active', item.dataset.integration === name));
    if (!detail || !details[name]) return;
    detail.innerHTML = `<strong>${details[name][0]}</strong><p>${details[name][1]}</p>`;
  };
  root.querySelectorAll('[data-integration]').forEach((item) => item.addEventListener('click', () => selectIntegration(item.dataset.integration)));
})();


/* fidelizacion */
(function (root) {
  var TL = root.TL = root.TL || {};
  var CONFIGS = {
    restaurante: { label: 'Restaurante', brand: 'Mesa de ejemplo', pass: 'Pase de visitas', action: 'Una visita suma contexto', reward: '+1 visita', segment: 'Cliente frecuente · ejemplo', token: 'TL-DEMO-RESTAURANTE' },
    clinica: { label: 'Clínica', brand: 'Cuidado de ejemplo', pass: 'Seguimiento de visitas', action: 'Una visita actualiza contexto', reward: '+1 visita', segment: 'Paciente invitado · ejemplo', token: 'TL-DEMO-CLINICA' },
    comercio: { label: 'Comercio', brand: 'Comunidad de ejemplo', pass: 'Pase de visitas', action: 'Una visita suma contexto', reward: '+1 visita', segment: 'Cliente frecuente · ejemplo', token: 'TL-DEMO-COMERCIO' }
  };
  function initialState() { return { visits: 2, balance: 2, qrVersion: 1, last: 'Esperando simulación' }; }
  function simulateVisit(state) { state = Object.assign({}, state); state.visits += 1; state.balance += 1; state.qrVersion += 1; state.last = 'Visita simulada · actualización compartida'; return state; }
  TL.fidelizacion = { configs: CONFIGS, initialState: initialState, simulateVisit: simulateVisit };
  if (!root.document) return;
  var section = TL.$ ? TL.$('#fidelizacion') : root.document.getElementById('fidelizacion');
  if (!section) return;
  var state = initialState(), kind = 'restaurante', qrVersion = 1;
  var refs = { brand: section.querySelector('[data-brand]'), type: section.querySelector('[data-type-label]'), pass: section.querySelector('[data-pass-label]'), tier: section.querySelector('[data-tier]'), visits: section.querySelector('[data-visits]'), balance: section.querySelector('[data-balance]'), token: section.querySelector('[data-token]'), qr: section.querySelector('[data-qr]'), posTitle: section.querySelector('[data-pos-title]'), posSegment: section.querySelector('[data-pos-segment]'), posAction: section.querySelector('[data-pos-action]'), posReward: section.querySelector('[data-pos-reward]'), posStatus: section.querySelector('[data-pos-status]'), history: section.querySelector('[data-history]') };
  function rect(x, y) { var node = root.document.createElementNS('http://www.w3.org/2000/svg', 'rect'); node.setAttribute('x', x * 10); node.setAttribute('y', y * 10); node.setAttribute('width', 10); node.setAttribute('height', 10); node.setAttribute('fill', '#234536'); return node; }
  function drawFinder(svg, ox, oy) { for (var y = 0; y < 7; y += 1) for (var x = 0; x < 7; x += 1) if (x === 0 || y === 0 || x === 6 || y === 6 || (x > 1 && x < 5 && y > 1 && y < 5)) svg.appendChild(rect(ox + x, oy + y)); }
  function drawQr() { var svg = refs.qr; svg.textContent = ''; var config = CONFIGS[kind], seed = config.token.length + qrVersion * 17; drawFinder(svg, 1, 1); drawFinder(svg, 13, 1); drawFinder(svg, 1, 13); for (var y = 0; y < 21; y += 1) for (var x = 0; x < 21; x += 1) { var reserved = (x < 9 && y < 9) || (x > 11 && y < 9) || (x < 9 && y > 11); if (!reserved && ((x * 13 + y * 7 + seed + (x * y)) % 5 < 2)) svg.appendChild(rect(x, y)); } }
  function render() { var config = CONFIGS[kind]; refs.brand.textContent = config.brand; refs.type.textContent = config.label; refs.pass.textContent = config.pass; refs.tier.textContent = 'Comunidad'; refs.visits.textContent = state.visits; refs.balance.textContent = state.balance; refs.posTitle.textContent = config.action; refs.posSegment.textContent = config.segment; refs.posAction.textContent = config.action; refs.posReward.textContent = config.reward; refs.token.textContent = config.token + '-' + String(qrVersion).padStart(2, '0'); drawQr(); }
  section.querySelectorAll('[data-kind]').forEach(function (tab) { tab.addEventListener('click', function () { kind = tab.dataset.kind; state = initialState(); qrVersion = 1; section.querySelectorAll('[data-kind]').forEach(function (item) { item.setAttribute('aria-selected', String(item === tab)); }); refs.posStatus.textContent = 'Sin movimientos todavía en esta demostración.'; refs.history.textContent = state.last; render(); }); });
  section.querySelector('[data-simulate]')?.addEventListener('click', function () { state = simulateVisit(state); qrVersion = state.qrVersion; refs.posStatus.textContent = 'Visita simulada. Teléfono y POS están actualizados.'; refs.history.textContent = state.last; render(); });
  section.querySelector('[data-qr-refresh]')?.addEventListener('click', function () { qrVersion += 1; state.qrVersion = qrVersion; refs.token.textContent = CONFIGS[kind].token + '-' + String(qrVersion).padStart(2, '0'); drawQr(); });
  render();
})(typeof window !== 'undefined' ? window : globalThis);


/* analitica */
(function (global) {
  const periods = {
    day: { label: 'Día', labels: ['09', '12', '15', '18', '21', '23', '01'], values: [12, 16, 13, 22, 27, 34, 24], kpis: [248, 148, 31, 18], products: [12, 9, 6, 3, 1], mix: [18, 12, 3, 8], focus: '18:00' },
    week: { label: 'Semana', labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], values: [38, 45, 41, 56, 64, 78, 52], kpis: [396, 374, 47, 29], products: [14, 12, 10, 7, 4], mix: [29, 19, 4, 14], focus: 'viernes' },
    month: { label: 'Mes', labels: ['S1', 'S2', 'S3', 'S4', 'S5'], values: [210, 225, 218, 247, 260], kpis: [1280, 1160, 118, 83], products: [35, 30, 25, 18, 10], mix: [83, 52, 12, 38], focus: 'semana 5' },
    season: { label: 'Temporada', labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'], values: [610, 650, 625, 710, 760], kpis: [3820, 3355, 364, 241], products: [110, 90, 70, 58, 36], mix: [241, 156, 26, 104], focus: 'mayo' },
  };
  const productTotal = (period) => period.products.reduce((sum, value) => sum + value, 0);
  if (typeof module !== 'undefined') module.exports = { periods, productTotal };
  if (!global.document) return;
  const root = (global.TL && global.TL.$ ? global.TL.$('#analitica') : document.querySelector('#analitica'));
  if (!root) return;
  const buttons = [...root.querySelectorAll('[data-period]')];
  const q = (selector) => root.querySelector(selector);
  const labels = q('[data-chart-labels]'), line = q('[data-chart-line]'), area = q('[data-chart-area]'), dots = q('[data-chart-dots]');
  const axis = q('.s-analitica__axis'), description = q('[data-chart-description]'), chartText = q('[data-chart-text]'), periodLabel = q('[data-period-label]');
  const kpiNames = ['visitas', 'senales', 'acciones', 'relaciones'];
  const productNodes = [...root.querySelectorAll('.s-analitica__product-columns li span')];
  productNodes.forEach((node, index) => node.dataset.productCount = String(index));
  q('#products-title')?.replaceChildren(document.createTextNode('Productos más y menos vendidos'));
  const productLabels = root.querySelectorAll('.s-analitica__product-columns small');
  if (productLabels[0]) productLabels[0].textContent = 'más vendidos';
  if (productLabels[1]) productLabels[1].textContent = 'menos vendidos';
  const heatNote = q('.s-analitica__heat-note');
  if (heatNote) heatNote.textContent = 'Más color = más actividad.';
  const panelNote = q('.s-analitica__panel-head>p');
  if (panelNote) panelNote.textContent = 'Vista conceptual del panel. Los módulos se adaptan al proyecto.';

  function render(key) {
    const period = periods[key] || periods.day;
    buttons.forEach((button) => { const active = button.dataset.period === key; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
    const max = Math.max(...period.values), step = period.values.length > 1 ? 650 / (period.values.length - 1) : 0;
    const points = period.values.map((value, index) => `${30 + index * step},${225 - value / max * 170}`).join(' ');
    periodLabel.textContent = period.label;
    labels.replaceChildren(...period.labels.map((value) => { const node = document.createElement('span'); node.textContent = value; return node; }));
    line.setAttribute('points', points); area.setAttribute('points', `30,225 ${points} ${30 + (period.values.length - 1) * step},225`);
    description.textContent = `Actividad de ejemplo durante ${period.label.toLowerCase()}: ${period.values.join(', ')} señales por punto.`;
    chartText.textContent = `En ${period.label.toLowerCase()}, la señal más alta aparece en ${period.focus} en este ejemplo.`;
    dots.replaceChildren(...period.values.map((value, index) => { const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dot.classList.add('s-analitica__chart-dot'); dot.setAttribute('cx', 30 + index * step); dot.setAttribute('cy', 225 - value / max * 170); dot.setAttribute('r', '4'); return dot; }));
    axis.replaceChildren(...[max, Math.round(max * .75), Math.round(max * .5), Math.round(max * .25), 0].map((value) => { const node = document.createElement('span'); node.textContent = value; return node; }));
    kpiNames.forEach((name, index) => { const node = q(`[data-kpi="${name}"]`); if (node) node.textContent = period.kpis[index].toLocaleString('es-MX'); });
    productNodes.forEach((node, index) => { const amount = period.products[index] || 0; node.textContent = `${amount} ${amount === 1 ? 'unidad' : 'unidades'} de ejemplo`; });
    const maxMix = Math.max(...period.mix); root.querySelectorAll('.s-analitica__mix-bars>div').forEach((row, index) => { const value = period.mix[index] || 0; row.querySelector('strong').textContent = value; row.querySelector('b').style.width = `${Math.max(12, value / maxMix * 100)}%`; });
  }
  buttons.forEach((button) => button.addEventListener('click', () => render(button.dataset.period)));
  render('day');

  const choices = { producto: 'preparar el producto para ese momento y observar qué sucede en el siguiente dato.', promocion: 'probar una promoción y comparar las señales que aparezcan después.', publicar: 'publicar el viernes y registrar si cambia la conversación.' };
  const choiceButtons = [...root.querySelectorAll('[data-choice]')], choiceResult = q('[data-choice-result]');
  choiceButtons.forEach((button) => button.addEventListener('click', () => { choiceButtons.forEach((item) => { const active = item === button; item.classList.toggle('is-selected', active); item.setAttribute('aria-pressed', String(active)); }); choiceResult.textContent = choices[button.dataset.choice]; }));

  const modules = { clientes: ['Clientes', 'capacidad', 'Reúne las señales de relación para reconocer nuevas conversaciones y próximos pasos.'], ventas: ['Ventas', 'capacidad', 'Ordena acciones de compra de ejemplo para observar qué momentos merecen atención.'], contenido: ['Contenido', 'prototipo', 'Relaciona piezas de contenido con las señales que despiertan en el ecosistema.'], promociones: ['Promociones', 'prototipo', 'Permite comparar escenarios de activación sin prometer una venta.'], mapa: ['Mapa', 'capacidad', 'Ubica zonas, rutas o lugares como una capa contextual del negocio.'], actividad: ['Actividad', 'capacidad', 'Muestra una lectura conjunta de las señales que ocurren en distintos momentos.'] };
  const bars = { clientes: [45, 75, 58], ventas: [22, 90, 64, 42], contenido: [70, 35, 56], promociones: [28, 52, 80], mapa: [60, 40, 70], actividad: [38, 82, 51] };
  const moduleButtons = [...root.querySelectorAll('[data-module]')], moduleView = q('[data-module-visual]');
  const renderModule = (key) => { const [name, state, copy] = modules[key]; moduleButtons.forEach((button) => { const active = button.dataset.module === key; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); }); q('[data-module-title]').textContent = name; q('[data-module-copy]').textContent = copy; moduleView.replaceChildren(...bars[key].map((height, index) => { const bar = document.createElement('span'); bar.style.height = `${height}%`; bar.setAttribute('aria-label', `Señal ${index + 1} de ejemplo`); return bar; })); moduleView.dataset.module = key; };
  moduleButtons.forEach((button) => button.addEventListener('click', () => renderModule(button.dataset.module)));
  renderModule('clientes');
  const heat = q('[data-heatmap]'), heatValues = [[1, 2, 0, 3, 2], [0, 1, 2, 3, 4], [1, 0, 2, 2, 3], [2, 1, 3, 3, 4], [1, 2, 3, 4, 4], [0, 1, 2, 4, 3], [0, 0, 1, 2, 2]];
  heat.replaceChildren(...heatValues.map((row, index) => { const lineNode = document.createElement('div'); lineNode.className = 's-analitica__heat-row'; const label = document.createElement('span'); label.textContent = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][index]; lineNode.append(label, ...row.map((value) => { const cell = document.createElement('i'); cell.className = 's-analitica__heat-cell'; cell.style.background = `rgba(111,125,79,${.1 + value * .15})`; cell.title = `${value} nivel de actividad de ejemplo`; return cell; })); return lineNode; }));
}(typeof window === 'undefined' ? globalThis : window));


/* marketing */
(function (root) {
  var TL = root.TL = root.TL || {};
  var EVENTS = [
    { month: 10, days: [1, 2], label: 'Día de Muertos', reason: 'Una fecha para hablar de memoria, comunidad y lo que hace especial a tu negocio.', action: 'Cuenta una historia de tu negocio e invita a compartir una tradición.' },
    { month: 11, days: [12], label: 'Día de la Virgen de Guadalupe', reason: 'Una fecha cultural con espacio para agradecer, reunirse y reconocer a tu comunidad.', action: 'Publica un mensaje de agradecimiento con una invitación clara.' },
    { month: 11, days: [24, 25], label: 'Navidad', reason: 'La conversación gira alrededor de compartir, regalar y encontrarse.', action: 'Muestra una opción concreta y explica cómo dar el siguiente paso.' },
    { month: 1, days: [14], label: 'San Valentín', reason: 'Una ocasión para hablar de vínculos, detalles y experiencias compartidas.', action: 'Presenta una idea para dos y facilita la reserva o consulta.' }
  ];
  var MONTH_NOTES = { 10: { label: 'Buen Fin', reason: 'Ocurre en noviembre y su fecha exacta cambia cada año. Planea tu propuesta sin inventar un día.', action: 'Define una oferta y explica sus condiciones antes de anunciarla.' } };
  function monthEvents(month) { return EVENTS.filter(function (event) { return event.month === month; }); }
  function dateEvent(month, day) { return monthEvents(month).find(function (event) { return event.days.includes(day); }) || null; }
  function monthTitle(year, month) { var title = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1)); return title.charAt(0).toUpperCase() + title.slice(1); }
  TL.marketing = { events: EVENTS.slice(), monthEvents: monthEvents, dateEvent: dateEvent, monthTitle: monthTitle };
  if (!root.document) return;
  var section = TL.$ ? TL.$('#marketing') : root.document.getElementById('marketing');
  if (!section) return;
  var title = section.querySelector('[data-calendar-title]'), daysBox = section.querySelector('[data-calendar-days]'), detail = section.querySelector('[data-calendar-detail]');
  var cursor = { year: 2026, month: 9 }, selected = null;
  function renderDetail(year, month, day) {
    var date = new Date(year, month, day), event = dateEvent(month, day), note = event || MONTH_NOTES[month];
    detail.querySelector('strong').textContent = date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' }) + (note ? ' · ' + note.label : '');
    detail.querySelector('span').textContent = note ? note.reason + ' Acción: ' + note.action : 'Usa este día para probar una idea concreta y observar qué conversación abre.';
  }
  function render() {
    title.textContent = monthTitle(cursor.year, cursor.month); daysBox.textContent = '';
    var first = new Date(cursor.year, cursor.month, 1).getDay(), total = new Date(cursor.year, cursor.month + 1, 0).getDate();
    for (var blank = 0; blank < first; blank += 1) { var empty = root.document.createElement('span'); empty.setAttribute('aria-hidden', 'true'); daysBox.appendChild(empty); }
    for (var day = 1; day <= total; day += 1) {
      var event = dateEvent(cursor.month, day), button = root.document.createElement('button'); button.type = 'button'; button.className = 's-marketing__day'; button.setAttribute('role', 'gridcell'); button.setAttribute('aria-label', new Date(cursor.year, cursor.month, day).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) + (event ? ' · ' + event.label : '')); button.dataset.day = day; button.innerHTML = '<strong>' + day + '</strong>' + (event ? '<small>' + event.label + '</small>' : '');
      if (selected === day) button.classList.add('is-selected');
      button.addEventListener('click', function (event) { selected = Number(event.currentTarget.dataset.day); render(selected); });
      button.addEventListener('keydown', function (event) { var move = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[event.key]; if (move) { event.preventDefault(); selected = Math.max(1, Math.min(total, selected + move)); render(selected); } }); daysBox.appendChild(button);
    }
    if (!selected || selected > total) selected = 1;
    renderDetail(cursor.year, cursor.month, selected);
    if (arguments[0]) daysBox.querySelector('[data-day="' + selected + '"]')?.focus();
  }
  section.querySelector('[data-calendar-prev]')?.addEventListener('click', function () { cursor.month -= 1; if (cursor.month < 0) { cursor.month = 11; cursor.year -= 1; } selected = null; render(); });
  section.querySelector('[data-calendar-next]')?.addEventListener('click', function () { cursor.month += 1; if (cursor.month > 11) { cursor.month = 0; cursor.year += 1; } selected = null; render(); });
  var formatTabs = section.querySelectorAll('[data-format]');
  function selectFormat(tab, focus) { formatTabs.forEach(function (item) { var active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; }); section.querySelectorAll('[data-format-panel]').forEach(function (panel) { panel.hidden = panel.dataset.formatPanel !== tab.dataset.format; }); if (focus) tab.focus(); }
  formatTabs.forEach(function (tab, index) { tab.addEventListener('click', function () { selectFormat(tab, false); }); tab.addEventListener('keydown', function (event) { if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); var next = event.key === 'Home' ? 0 : event.key === 'End' ? formatTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + formatTabs.length) % formatTabs.length; selectFormat(formatTabs[next], true); }); });
  render();
})(typeof window !== 'undefined' ? window : globalThis);


/* mapas */
(() => {
  const root = document.querySelector('#mapas');
  if (!root) return;
  const copy = {
    sucursales: ['Sucursales', 'Una vista de ejemplo para comparar dónde llega la atención y dónde aún hay espacio para conectar.'],
    rutas: ['Rutas', 'La ruta no es una línea decorativa: muestra los recorridos que puedes observar para decidir dónde aparecer.'],
    eventos: ['Eventos', 'Un evento puede ser la señal que explica una visita, una conversación o una oportunidad de volver.'],
    campus: ['Campus', 'Agrupa lugares de aprendizaje, trabajo o comunidad para entender qué relación se está formando.'],
    zonas: ['Zonas', 'Cruza señales por zonas para elegir una pregunta concreta y aprender antes de invertir más.']
  };
  const sheet = root.querySelector('[data-map-sheet]');
  const title = root.querySelector('[data-map-sheet-title]');
  const body = root.querySelector('[data-map-sheet-copy]');
  let previousFocus;
  const open = (name) => {
    const selected = copy[name] ? name : 'sucursales';
    root.querySelectorAll('[data-map-layer]').forEach((item) => item.classList.toggle('is-active', item.dataset.mapLayer === selected));
    title.textContent = copy[selected][0]; body.textContent = copy[selected][1]; sheet.hidden = false; previousFocus = document.activeElement; root.querySelector('[data-map-close]')?.focus();
  };
  const close = () => { sheet.hidden = true; previousFocus?.focus?.(); };
  root.querySelectorAll('[data-map-pin], [data-map-layer]').forEach((item) => item.addEventListener('click', () => open(item.dataset.mapPin || item.dataset.mapLayer)));
  root.querySelector('[data-map-close]')?.addEventListener('click', close);
  sheet?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { close(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...sheet.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0]; const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();


/* live */
(function (root) {
  var TL = root.TL = root.TL || {};
  var INSIGHTS = ['Preguntas frecuentes: horarios · menú · pedidos', 'Temas: experiencia · comunidad', 'Productos: menú · temporada', 'Participación: preguntas abiertas'];
  TL.live = { insights: INSIGHTS.slice(), analyze: function () { return INSIGHTS.slice(); } };
  if (!root.document) return;
  var section = TL.$ ? TL.$('#live') : root.document.getElementById('live');
  if (!section) return;
  var analyzeButton = section.querySelector('[data-analyze]'), insights = section.querySelector('[data-insights]'), poll = section.querySelector('[data-poll]'), status = section.querySelector('[data-poll-status]');
  analyzeButton?.addEventListener('click', function () { insights.hidden = false; analyzeButton.textContent = 'Análisis visible'; analyzeButton.disabled = true; });
  poll?.querySelectorAll('input').forEach(function (input) { input.addEventListener('change', function () { status.textContent = 'Respuesta registrada para esta demo: ' + input.value + '.'; }); });
  section.querySelector('[data-poll-reset]')?.addEventListener('click', function () { poll.reset(); status.textContent = 'Elige otra respuesta cuando quieras.'; });
})(typeof window !== 'undefined' ? window : globalThis);


/* app */
(() => {
  const root = document.querySelector('#app');
  if (!root) return;
  const stageButtons = [...root.querySelectorAll('[data-app-stage]')];
  const needButtons = [...root.querySelectorAll('[data-app-need]')];
  const cards = [...root.querySelectorAll('[data-route-card]')];
  const answer = root.querySelector('[data-app-answer]');
  const messages = {
    entrada: { web: 'Empieza por una web responsive que conecte la intención con una acción.', pwa: 'Prueba primero la experiencia en web; la instalación cobra sentido cuando la visita ya se repite.', stores: 'Una app de tiendas puede esperar hasta que la comunidad tenga un motivo claro para volver.' },
    operacion: { web: 'Haz visible la operación en una web responsive antes de convertirla en rutina digital.', pwa: 'Una PWA puede acompañar una operación recurrente sin exigir una descarga desde el primer día.', stores: 'Las tiendas tienen sentido cuando el equipo y sus clientes ya usan la herramienta con frecuencia.' },
    comunidad: { web: 'Cuenta la propuesta y observa quién vuelve; esa señal guía la siguiente decisión.', pwa: 'Una experiencia instalable puede cuidar una relación frecuente y medible.', stores: 'La distribución en tiendas puede llegar cuando la comunidad pide una puerta propia.' }
  };
  let stage = 'web'; let need = 'entrada';
  const render = () => { cards.forEach((card) => card.classList.toggle('is-active', card.dataset.routeCard === stage)); answer.textContent = messages[need][stage]; stageButtons.forEach((button) => button.setAttribute('aria-selected', String(button.dataset.appStage === stage))); needButtons.forEach((button) => button.setAttribute('aria-selected', String(button.dataset.appNeed === need))); };
  stageButtons.forEach((button) => button.addEventListener('click', () => { stage = button.dataset.appStage; render(); }));
  needButtons.forEach((button) => button.addEventListener('click', () => { need = button.dataset.appNeed; render(); }));
  root.querySelectorAll('[role="tablist"]').forEach((list) => list.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const buttons = [...list.querySelectorAll('[role="tab"]')]; const current = Math.max(0, buttons.indexOf(document.activeElement));
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus(); buttons[next].click();
  }));
})();

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
