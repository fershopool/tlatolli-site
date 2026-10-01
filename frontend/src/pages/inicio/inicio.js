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
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

const header = document.querySelector('.site-header');
const stageLinks = [...document.querySelectorAll('[data-stage-link]')];
const sections = stageLinks.map((link) => document.getElementById(link.dataset.stage)).filter(Boolean);
if ('IntersectionObserver' in window && header && sections.length) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    header.dataset.stage = (entry.target.dataset.stage || entry.target.id).split(/\s+/)[0];
    header.dataset.navTheme = entry.target.dataset.navTheme || '';
    stageLinks.forEach((link) => link.classList.toggle('is-current', link.dataset.stageLink === entry.target.id));
  }), { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

document.querySelectorAll('.reveal').forEach((element) => {
  window.inView?.(element, { once: true, enter: (node) => node.classList.add('is-visible') });
});

document.querySelectorAll('[data-hero-visual]').forEach((visual) => {
  if (!('IntersectionObserver' in window)) { visual.classList.add('in-view'); return; }
  const observer = new IntersectionObserver(([entry]) => visual.classList.toggle('in-view', entry.isIntersecting), { threshold: 0.08 });
  observer.observe(visual);
});
