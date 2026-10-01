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
