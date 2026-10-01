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
