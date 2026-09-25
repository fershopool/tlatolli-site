const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  const filter = button.dataset.filter;
  projectCards.forEach((card) => {
    card.classList.toggle('is-hidden', filter !== 'all' && !card.dataset.category.includes(filter));
  });
}));

const diagnosticForm = document.querySelector('#diagnostic-form');
const diagnosticSteps = [...document.querySelectorAll('.diagnostic-step')];
const diagnosticResult = document.querySelector('.diagnostic-result');
const progress = [...document.querySelectorAll('.progress span')];
let diagnosticStep = 0;

function showDiagnosticStep(index) {
  diagnosticSteps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
  progress.forEach((item, itemIndex) => item.style.background = itemIndex <= index ? 'var(--copper)' : 'rgba(255,255,255,.2)');
}

document.querySelectorAll('.next-step').forEach((button) => button.addEventListener('click', () => {
  const activeStep = diagnosticSteps[diagnosticStep];
  if (!activeStep.querySelector('input:checked')) return;
  diagnosticStep += 1;
  showDiagnosticStep(diagnosticStep);
}));

diagnosticForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(diagnosticForm);
  const goal = data.get('goal');
  const status = data.get('status');
  const build = data.get('build');
  diagnosticSteps.forEach((step) => step.classList.remove('is-active'));
  diagnosticResult.classList.add('is-visible');
  diagnosticResult.querySelector('.result-text').textContent = `Si quieres ${goal.toLowerCase()}, hoy tienes una base de “${status.toLowerCase()}”. Te recomendamos empezar por una ruta de ${build.toLowerCase()}, con estrategia y una primera acción medible.`;
  progress.forEach((item) => item.style.background = 'var(--copper)');
});

document.querySelector('.reset-diagnostic')?.addEventListener('click', () => {
  diagnosticForm.reset();
  diagnosticResult.classList.remove('is-visible');
  diagnosticStep = 0;
  showDiagnosticStep(0);
});

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = event.currentTarget.querySelector('.form-status');
  status.textContent = 'Solicitud lista. Te contactaremos pronto.';
  event.currentTarget.reset();
});
