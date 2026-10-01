(function () {
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Progreso de lectura + sombra de cabecera
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  const header = document.querySelector('.site-header');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
      header?.classList.toggle('is-scrolled', scrollY > 12);
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // Greca decorativa entre secciones
  $$('main > section').slice(1).forEach((section) => {
    const band = document.createElement('div');
    band.className = 'greca';
    band.setAttribute('aria-hidden', 'true');
    section.before(band);
  });

  // Foco de luz que sigue al cursor en las tarjetas de los simuladores
  const SPOT = '.s-problema__piece,.s-analitica__kpi,.s-analitica__panel,.s-app__card,.s-presencia__panel,.s-live__benefits article,.s-marketing__calendar,.s-fidelizacion__pos';
  $$(SPOT).forEach((element) => element.setAttribute('data-spot', ''));
  if (fine) {
    document.addEventListener('pointermove', (event) => {
      const target = event.target.closest?.('[data-spot]');
      if (!target) return;
      const box = target.getBoundingClientRect();
      target.style.setProperty('--mx', `${event.clientX - box.left}px`);
      target.style.setProperty('--my', `${event.clientY - box.top}px`);
    }, { passive: true });
  }

  // Revelado escalonado: el retraso solo cuenta para la entrada
  $$('.reveal').forEach((element) => {
    const index = $$('.reveal', element.parentElement).indexOf(element);
    element.style.setProperty('--i', Math.min(Math.max(index, 0), 5));
    element.addEventListener('transitionend', () => element.style.setProperty('--i', 0), { once: true });
  });
}());
