// Interacciones pequeñas: navegación, revelado, filtros y formularios demo.

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('is-open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menú');
}));

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const filterButtons = document.querySelectorAll('.filter-button');
const caseCards = document.querySelectorAll('.case-card');
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  const filter = button.dataset.filter;
  caseCards.forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && !card.dataset.category.includes(filter)));
}));

const diagnosticForm = document.querySelector('#diagnostic-form');
const diagnosticSteps = [...document.querySelectorAll('.diagnostic-step')];
const diagnosticResult = document.querySelector('.diagnostic-result');
const progress = [...document.querySelectorAll('.progress span')];
let diagnosticStep = 0;

function showDiagnosticStep(index) {
  diagnosticSteps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
  progress.forEach((item, itemIndex) => { item.style.background = itemIndex <= index ? 'var(--copper)' : 'rgba(255,255,255,.2)'; });
}

document.querySelectorAll('.next-step').forEach((button) => button.addEventListener('click', () => {
  const activeStep = diagnosticSteps[diagnosticStep];
  if (!activeStep?.querySelector('input:checked')) return;
  diagnosticStep = Math.min(diagnosticStep + 1, diagnosticSteps.length - 1);
  showDiagnosticStep(diagnosticStep);
}));

diagnosticForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(diagnosticForm);
  const goal = String(data.get('goal') || 'tu objetivo').toLowerCase();
  const status = String(data.get('status') || 'tu punto de partida').toLowerCase();
  const build = String(data.get('build') || 'una primera acción').toLowerCase();
  diagnosticSteps.forEach((step) => step.classList.remove('is-active'));
  diagnosticResult?.classList.add('is-visible');
  const resultText = diagnosticResult?.querySelector('.result-text');
  if (resultText) resultText.textContent = `Si quieres ${goal}, hoy partes de ${status}. Una ruta inicial puede ser ${build}, con una primera acción medible.`;
  progress.forEach((item) => { item.style.background = 'var(--copper)'; });
});

document.querySelector('.reset-diagnostic')?.addEventListener('click', () => {
  diagnosticForm?.reset();
  diagnosticResult?.classList.remove('is-visible');
  diagnosticStep = 0;
  showDiagnosticStep(0);
});

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    'Hola Tlatolli, quiero conocer sus servicios.',
    `Nombre: ${data.get('name') || 'No indicado'}`,
    `Empresa: ${data.get('company') || 'No indicada'}`,
    `Correo: ${data.get('email') || 'No indicado'}`,
    `Proyecto: ${data.get('project') || 'No indicado'}`,
    `Necesidad: ${data.get('message') || 'No indicada'}`,
  ].join('\n');
  window.location.href = `https://wa.me/525539761846?text=${encodeURIComponent(message)}`;
});
