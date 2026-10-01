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
