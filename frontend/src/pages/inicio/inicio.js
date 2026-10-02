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
