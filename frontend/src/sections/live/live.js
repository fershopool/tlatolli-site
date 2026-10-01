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
