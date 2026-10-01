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
