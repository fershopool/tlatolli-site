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

  const TL = { $, $$, reduced, whatsapp, inView, progress, countUp, lerp, clamp };
  window.Tlatolli = TL;
  Object.assign(window, { TL, $, $$, reduced, whatsapp, inView, progress, countUp, lerp, clamp });
})();
