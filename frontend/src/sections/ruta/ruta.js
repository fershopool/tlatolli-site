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
