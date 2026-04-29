document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  document.querySelectorAll('[data-page-link]').forEach(link => {
    if (link.dataset.pageLink === page) link.classList.add('active');
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
    observer.observe(el);
  });
  const form = document.querySelector('[data-reserve-form]');
  const status = document.querySelector('[data-form-status]');
  if (form && status) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = form.querySelector('[name="name"]')?.value?.trim() || 'tu reserva';
      status.textContent = `Solicitud enviada. Revisamos ${name} y te contactamos en menos de 24 horas.`;
      form.reset();
    });
  }
});
