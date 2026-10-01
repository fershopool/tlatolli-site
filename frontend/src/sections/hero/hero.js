(function () {
  const root = (window.TL && window.TL.$ ? window.TL.$('#inicio') : document.querySelector('#inicio'));
  if (!root) return;
  const visual = root.querySelector('[data-hero-visual]');
  if (!visual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let active = true;
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => { active = entry.isIntersecting; }, { threshold: 0.08 }) : null;
  observer?.observe(visual);
  root.addEventListener('pointermove', (event) => {
    if (!active || event.pointerType === 'touch') return;
    const box = visual.getBoundingClientRect();
    visual.style.setProperty('--hero-x', ((event.clientX - box.left) / box.width - .5) * 10);
    visual.style.setProperty('--hero-y', ((event.clientY - box.top) / box.height - .5) * 8);
  });
  root.addEventListener('pointerleave', () => { visual.style.setProperty('--hero-x', 0); visual.style.setProperty('--hero-y', 0); });
}());
