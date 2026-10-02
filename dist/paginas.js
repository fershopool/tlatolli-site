(() => {
  const noop = () => {};
  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => [...(root?.querySelectorAll(selector) || [])];
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const whatsapp = (text = '') => `https://wa.me/525539761846?text=${encodeURIComponent(text)}`;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;

  function inView(element, options = {}) {
    if (!element || !('IntersectionObserver' in window)) {
      options.enter?.(element);
      return noop;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) options.enter?.(entry.target, entry);
      else options.leave?.(entry.target, entry);
      if (options.once && entry.isIntersecting) observer.unobserve(entry.target);
    }), { threshold: options.threshold ?? .12, rootMargin: options.rootMargin ?? '0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }

  function progress(element, options = {}) {
    if (!element) return noop;
    const mode = options.mode || 'fill';
    const pin = options.pin === true;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const range = Math.max(rect.height - innerHeight, 1);
      const value = clamp(-rect.top / range);
      element.style.setProperty('--progress', value.toFixed(4));
      if (mode === 'fill') element.style.setProperty('--progress-percent', `${value * 100}%`);
      if (pin) element.classList.toggle('is-pinned', rect.top <= 0 && rect.bottom >= innerHeight);
      (options.onUpdate || options.update)?.(value, element);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); element.classList.remove('is-pinned'); };
  }

  function countUp(element, to, options = {}) {
    if (!element) return noop;
    const from = Number(options.from ?? 0);
    const duration = reduced() ? 0 : Number(options.duration ?? 900);
    const format = options.format || ((value) => Math.round(value).toLocaleString('es-MX'));
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const amount = duration ? clamp((now - start) / duration) : 1;
      element.textContent = format(lerp(from, Number(to), 1 - ((1 - amount) ** 3)));
      if (amount < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => frame && cancelAnimationFrame(frame);
  }

  // Analítica sin cookies: solo actúa si el build inyectó Plausible o Umami.
  const track = (name, props = {}) => {
    try {
      if (typeof window.plausible === 'function') window.plausible(name, { props });
      else window.umami?.track?.(name, props);
    } catch (error) { /* la analítica nunca debe romper el sitio */ }
  };
  document.addEventListener('click', (event) => {
    const target = event.target.closest?.('[data-track]');
    if (target) track(target.dataset.track, target.dataset.trackLabel ? { label: target.dataset.trackLabel } : {});
  });

  const TL = { $, $$, reduced, whatsapp, inView, progress, countUp, lerp, clamp, track };
  window.Tlatolli = TL;
  Object.assign(window, { TL, $, $$, reduced, whatsapp, inView, progress, countUp, lerp, clamp });
})();

document.documentElement.classList.add('js-ready');

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const setMenu = (open) => {
  nav?.classList.toggle('is-open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
};
menuToggle?.addEventListener('click', () => setMenu(!nav?.classList.contains('is-open')));
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && nav?.classList.contains('is-open')) { setMenu(false); menuToggle?.focus(); } });

document.querySelectorAll('.reveal').forEach((element) => {
  window.inView?.(element, { once: true, enter: (node) => node.classList.add('is-visible') });
});

// Resalta en la barra móvil la sección visible
const spy = [...document.querySelectorAll('.mobile-nav [data-spy]')];
if (spy.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) spy.forEach((a) => a.classList.toggle('is-active', a.dataset.spy === entry.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  spy.forEach((a) => { const section = document.getElementById(a.dataset.spy); if (section) io.observe(section); });
}

/* proyectos */
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
