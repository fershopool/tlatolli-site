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
