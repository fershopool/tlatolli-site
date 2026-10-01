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
