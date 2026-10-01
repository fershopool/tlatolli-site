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

  const TL = { $, $$, reduced, whatsapp, inView, progress, countUp, lerp, clamp };
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
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

const header = document.querySelector('.site-header');
const stageLinks = [...document.querySelectorAll('[data-stage-link]')];
const sections = stageLinks.map((link) => document.getElementById(link.dataset.stage)).filter(Boolean);
if ('IntersectionObserver' in window && header && sections.length) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    header.dataset.stage = (entry.target.dataset.stage || entry.target.id).split(/\s+/)[0];
    header.dataset.navTheme = entry.target.dataset.navTheme || '';
    stageLinks.forEach((link) => link.classList.toggle('is-current', link.dataset.stageLink === entry.target.id));
  }), { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

document.querySelectorAll('.reveal').forEach((element) => {
  window.inView?.(element, { once: true, enter: (node) => node.classList.add('is-visible') });
});

document.querySelectorAll('[data-hero-visual]').forEach((visual) => {
  if (!('IntersectionObserver' in window)) { visual.classList.add('in-view'); return; }
  const observer = new IntersectionObserver(([entry]) => visual.classList.toggle('in-view', entry.isIntersecting), { threshold: 0.08 });
  observer.observe(visual);
});

/* hero */
(function () {
  const root = (window.TL && window.TL.$ ? window.TL.$('#inicio') : document.querySelector('#inicio'));
  if (!root) return;
  const visual = root.querySelector('[data-hero-visual]');
  if (!visual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let active = true;
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => { active = entry.isIntersecting; }, { threshold: 0.08 }) : null;
  observer?.observe(visual);
  root.addEventListener('pointermove', (event) => {
    if (!active || event.pointerType === 'touch') return;
    const box = visual.getBoundingClientRect();
    visual.style.setProperty('--hero-x', ((event.clientX - box.left) / box.width - .5) * 10);
    visual.style.setProperty('--hero-y', ((event.clientY - box.top) / box.height - .5) * 8);
  });
  root.addEventListener('pointerleave', () => { visual.style.setProperty('--hero-x', 0); visual.style.setProperty('--hero-y', 0); });
}());


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
  if (heatNote) heatNote.textContent = 'Semana de ejemplo: más color = más actividad en ese escenario.';
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

  const choices = { producto: 'Escenario de ejemplo: preparar el producto para ese momento y observar qué sucede en el siguiente dato.', promocion: 'Escenario de ejemplo: probar una promoción y comparar las señales que aparezcan después.', publicar: 'Escenario de ejemplo: publicar el viernes y registrar si cambia la conversación.' };
  const choiceButtons = [...root.querySelectorAll('[data-choice]')], choiceResult = q('[data-choice-result]');
  choiceButtons.forEach((button) => button.addEventListener('click', () => { choiceButtons.forEach((item) => { const active = item === button; item.classList.toggle('is-selected', active); item.setAttribute('aria-pressed', String(active)); }); choiceResult.textContent = choices[button.dataset.choice]; }));

  const modules = { clientes: ['Clientes', 'capacidad', 'Reúne las señales de relación para reconocer nuevas conversaciones y próximos pasos.'], ventas: ['Ventas', 'capacidad', 'Ordena acciones de compra de ejemplo para observar qué momentos merecen atención.'], contenido: ['Contenido', 'prototipo', 'Relaciona piezas de contenido con las señales que despiertan en el ecosistema.'], promociones: ['Promociones', 'prototipo', 'Permite comparar escenarios de activación sin prometer una venta.'], mapa: ['Mapa', 'capacidad', 'Ubica zonas, rutas o lugares como una capa contextual del negocio.'], actividad: ['Actividad', 'capacidad', 'Muestra una lectura conjunta de las señales que ocurren en distintos momentos.'] };
  const bars = { clientes: [45, 75, 58], ventas: [22, 90, 64, 42], contenido: [70, 35, 56], promociones: [28, 52, 80], mapa: [60, 40, 70], actividad: [38, 82, 51] };
  const moduleButtons = [...root.querySelectorAll('[data-module]')], moduleView = q('[data-module-visual]');
  const renderModule = (key) => { const [name, state, copy] = modules[key]; moduleButtons.forEach((button) => { const active = button.dataset.module === key; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); }); q('[data-module-title]').textContent = name; q('[data-module-copy]').textContent = copy; const badge = q('[data-module-badge]'); badge.textContent = state === 'prototipo' ? 'Prototipo' : 'Capacidad'; badge.className = `badge badge--${state}`; moduleView.replaceChildren(...bars[key].map((height, index) => { const bar = document.createElement('span'); bar.style.height = `${height}%`; bar.setAttribute('aria-label', `Señal ${index + 1} de ejemplo`); return bar; })); moduleView.dataset.module = key; };
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


/* proyectos */
(function () {
  const root=(window.TL&&window.TL.$?window.TL.$('#proyectos'):document.querySelector('#proyectos')); if(!root)return;
  const data={
    koben:{name:'KÓOBEN',badge:'Beta',badgeClass:'badge--beta',type:'ecosistema digital',image:'./frontend/src/assets/cases/koben-hero.jpg',alt:'Vista de Kóoben',summary:'Una experiencia beta para explorar una relación digital con clientes y negocios.',problem:'Kóoben explora cómo una experiencia digital puede acercar a un negocio y a sus clientes.',url:'https://fershopool.github.io/koooben-beta/#inicio',functions:[['Login','prototipo'],['Código QR','prototipo'],['Wallet','sin configurar'],['Panel','datos de ejemplo']]},
    clinica:{name:'CLÍNICA SAN PEDRO',badge:'Publicado',badgeClass:'badge--disponible',type:'sitio institucional',image:'./frontend/src/assets/cases/clinica-hero.jpg',alt:'Vista de Clínica San Pedro',summary:'Un sitio institucional publicado para presentar la clínica y orientar a sus visitantes.',problem:'La información de una clínica necesita un lugar claro, confiable y fácil de recorrer.',url:'https://fershopool.github.io/clinica-san-pedro-de-los-pinos/',functions:[['Sitio institucional','disponible'],['Información de la clínica','disponible'],['Navegación web','disponible']]},
    ollin:{name:'OLLIN',badge:'En desarrollo',badgeClass:'badge--capacidad',type:'ecosistema conceptual',image:'./frontend/src/assets/cases/ollin-hero.jpg',alt:'Vista de Ollin',summary:'Un ecosistema conceptual en desarrollo para ordenar una experiencia digital propia.',problem:'OLLIN está tomando forma: el reto es convertir una idea amplia en una experiencia que pueda crecer.',url:'https://fershopool.github.io/ollin-site/',functions:[['Experiencia web','en desarrollo'],['Ecosistema digital','capacidad'],['Módulos futuros','próximamente']]},
    calpulli:{name:'UPIICSA CALPULLI',badge:'En desarrollo',badgeClass:'badge--capacidad',type:'ecosistema académico',image:'./frontend/src/assets/cases/calpulli-hero.jpg',alt:'Vista de UPIICSA Calpulli',summary:'Una propuesta en desarrollo para reunir funciones y mapa dentro de una experiencia académica.',problem:'Calpulli necesita que sus funciones y su territorio puedan leerse como una sola experiencia.',url:'https://fershopool.github.io/upiicsa-calpulli-site/',functions:[['Funciones','en desarrollo'],['Mapa','próximamente'],['Experiencia académica','capacidad']]}
  };
  const items=[...root.querySelectorAll('[data-project]')], feature=root.querySelector('[data-project-feature]'), badge=root.querySelector('[data-project-badge]'), count=root.querySelector('[data-project-count]'), image=root.querySelector('[data-project-image]'), type=root.querySelector('[data-project-type]'), title=root.querySelector('[data-project-title]'), summary=root.querySelector('[data-project-summary]'), dialog=root.querySelector('[data-project-dialog]'), dialogTitle=root.querySelector('[data-dialog-title]'), dialogState=root.querySelector('[data-dialog-state]'), dialogProblem=root.querySelector('[data-dialog-problem]'), dialogFunctions=root.querySelector('[data-dialog-functions]'), external=root.querySelector('[data-dialog-external]'), liveButton=root.querySelector('[data-dialog-live]'), live=root.querySelector('[data-live-frame]'); let active='koben', lastTrigger;
  const paint=(key)=>{const item=data[key];if(!item)return;active=key;items.forEach((button,index)=>{const on=button.dataset.project===key;button.classList.toggle('is-active',on);button.setAttribute('aria-pressed',String(on));if(on)count.textContent=`${String(index+1).padStart(2,'0')} / 04`;});badge.className=`badge ${item.badgeClass}`;badge.textContent=item.badge;image.src=item.image;image.alt=item.alt;type.textContent=item.type;title.textContent=item.name;summary.textContent=item.summary;root.style.setProperty('--project-accent',key==='clinica'?'#8EAC69':key==='ollin'?'#D9A64C':key==='calpulli'?'#E2A263':'#D9A64C');};
  const showDetails=(trigger)=>{const item=data[active];lastTrigger=trigger;dialogTitle.textContent=item.name;dialogState.textContent=item.badge;dialogProblem.textContent=item.problem;external.href=item.url;dialogFunctions.replaceChildren(...item.functions.map(([label,state])=>{const li=document.createElement('li');li.textContent=label;const small=document.createElement('small');small.textContent=state;li.append(small);return li;}));live.replaceChildren();if(dialog.showModal)dialog.showModal();else{dialog.setAttribute('open','');dialog.classList.add('is-open');}root.querySelector('[data-dialog-close]')?.focus();};
  const hideDetails=()=>{if(dialog.open&&dialog.close)dialog.close();else{dialog.removeAttribute('open');dialog.classList.remove('is-open');}lastTrigger?.focus();};
  items.forEach((button)=>button.addEventListener('click',()=>paint(button.dataset.project)));root.querySelector('[data-project-details]')?.addEventListener('click',(event)=>showDetails(event.currentTarget));root.querySelector('[data-dialog-close]')?.addEventListener('click',hideDetails);dialog?.addEventListener('click',(event)=>{if(event.target===dialog)hideDetails();});dialog?.addEventListener('cancel',(event)=>{event.preventDefault();hideDetails();});
  liveButton?.addEventListener('click',()=>{const item=data[active];live.replaceChildren();const phone=document.createElement('div');phone.className='s-proyectos__phone';const frame=document.createElement('iframe');frame.src=item.url;frame.title=`Vista en vivo de ${item.name}`;frame.loading='lazy';frame.referrerPolicy='no-referrer-when-downgrade';frame.sandbox='allow-scripts allow-forms allow-same-origin allow-popups';phone.append(frame);live.append(phone);liveButton.disabled=true;liveButton.setAttribute('aria-label',`Vista en vivo cargada de ${item.name}`);});
  paint(active);
}());


/* diferencia */
(function (root) { var TL = root.TL = root.TL || {}; var section = root.document && (TL.$ ? TL.$('#diferencia') : root.document.getElementById('diferencia')); if (!section) return; var tabs = section.querySelectorAll('[data-compare]'); tabs.forEach(function (tab) { tab.addEventListener('click', function () { var selected = tab.dataset.compare; tabs.forEach(function (item) { var active = item === tab; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); }); section.querySelectorAll('[data-panel]').forEach(function (panel) { panel.hidden = panel.dataset.panel !== selected; }); }); }); })(typeof window !== 'undefined' ? window : globalThis);


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
  form.addEventListener('submit', function (event) { event.preventDefault(); var answers = readForm(), validation = validateAnswers(answers); showErrors(validation); if (!validation.valid) { var firstError = section.querySelector('[data-error]:not(:empty)'); if (firstError) firstError.scrollIntoView({ block: 'nearest' }); return; } state.answers = answers; state.result = compute(answers); if (progress) progress.textContent = 'Diagnóstico listo'; render(state.result); section.dispatchEvent(new root.CustomEvent('tl:diagnostic', { bubbles: true, detail: { answers: cleanAnswers(answers), result: state.result } })); });
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
  function open(message) { var url = urlFor(message), popup = root.open ? root.open(url, '_blank', 'noopener,noreferrer') : null; status.textContent = popup ? 'WhatsApp se abrió en una pestaña nueva.' : 'Si WhatsApp no se abrió, usa este enlace. '; var link = root.document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Abrir WhatsApp'; status.appendChild(link); }
  function updateMainLink(event) { if (mainLink) mainLink.href = event.detail && event.detail.result ? urlFor(TL.diagnostic.buildMessage(event.detail.answers, event.detail.result)) : 'https://wa.me/' + NUMBER; }
  root.document.addEventListener('tl:diagnostic', updateMainLink);
  form.addEventListener('submit', function (event) { event.preventDefault(); var data = new FormData(form), name = String(data.get('name') || '').trim(), business = String(data.get('business') || '').trim(), need = String(data.get('need') || '').trim(); if (!name || !business || !need) { status.textContent = 'Completa nombre, negocio y necesidad.'; return; } open(['Hola Tlatolli, quiero conversar sobre mi negocio.', 'Nombre: ' + name, 'Negocio: ' + business, 'Necesidad: ' + need].join('\n') + diagnosticText()); });
})(typeof window !== 'undefined' ? window : globalThis);
