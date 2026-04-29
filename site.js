document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  const host = window.location.hostname || '';
  const titleByPage = {
    home: 'Estudio de tatuaje',
    estudio: 'Estudio',
    galeria: 'Galería',
    equipo: 'Equipo',
    reservas: 'Reservas'
  };

  const toTitleCase = (value) => value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

  const getStudioName = () => {
    const parts = host.split('.').filter(Boolean);
    if (parts.length > 2) return toTitleCase(parts[0]);
    return 'Nocturne Ink';
  };

  const studioName = getStudioName();
  const pageLabel = titleByPage[page] || 'Estudio de tatuaje';
  document.title = page === 'home' ? `${studioName} | Estudio de tatuaje` : `${pageLabel} | ${studioName}`;

  const brandMarkup = studioName.toUpperCase().replace(/\s+/g, '<span>·</span>');
  document.querySelectorAll('.brand').forEach(el => {
    el.innerHTML = brandMarkup;
    el.setAttribute('aria-label', studioName);
  });

  const footerCopy = document.querySelector('.footer-copy');
  if (footerCopy) {
    footerCopy.textContent = `© 2026 ${studioName} · Madrid · Solo con cita previa`;
  }

  const heroEyebrow = document.querySelector('.hero .eyebrow');
  if (heroEyebrow && host.split('.').filter(Boolean).length > 2) {
    heroEyebrow.textContent = `${studioName} · Arte permanente`;
  }

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
