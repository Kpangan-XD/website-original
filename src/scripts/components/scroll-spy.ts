// ========================================
// SCROLL SPY (Active nav highlighting)
// ========================================

export function initScrollSpy(): void {
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link, .mobile-nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          const isActive = href === `#${id}` || href === `/${id}` || (id === 'home' && href === '/');
          link.classList.toggle('active', isActive);
          link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

// Smooth scroll for anchor links
export function initSmoothScroll(): void {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const targetEl = document.querySelector<HTMLElement>(href);
    if (!targetEl) return;

    e.preventDefault();
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    targetEl.focus({ preventScroll: true });
    history.pushState(null, '', href);
  });
}