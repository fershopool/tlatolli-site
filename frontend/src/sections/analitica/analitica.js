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
