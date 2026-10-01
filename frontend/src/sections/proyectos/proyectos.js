(function () {
  const button = document.querySelector('[data-live-open]');
  const live = document.querySelector('[data-live]');
  if (!button || !live) return;
  // El sitio del caso solo se carga cuando se pide verlo aquí.
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = button.dataset.url;
    frame.title = `Vista en vivo de ${button.dataset.name}`;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.sandbox = 'allow-scripts allow-forms allow-same-origin allow-popups';
    const wrap = document.createElement('div');
    wrap.className = 'frame';
    wrap.append(frame);
    live.replaceChildren(wrap);
    button.disabled = true;
    window.TL?.track?.('caso_en_vivo', { label: button.dataset.name });
  });
}());
