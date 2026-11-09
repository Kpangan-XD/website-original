// ========================================
// MOBILE NAVIGATION
// ========================================

export function initMobileNav(): void {
  const menuBtn = document.querySelector<HTMLButtonElement>('[data-mobile-menu-btn]');
  const nav = document.querySelector<HTMLElement>('#mobile-nav');
  const overlay = document.querySelector<HTMLElement>('[data-mobile-nav-overlay]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-mobile-nav-close]');
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-mobile-nav-link]');

  if (!menuBtn || !nav || !overlay) return;

  let wasOpen = false;

  function openNav(): void {
    if (!nav || !overlay || !menuBtn) return;
    nav.classList.add('open');
    overlay.classList.add('visible');
    menuBtn.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    wasOpen = true;
    // Focus first link
    const firstLink = nav.querySelector<HTMLAnchorElement>('[data-mobile-nav-link]');
    firstLink?.focus();
  }

  function closeNav(): void {
    if (!nav || !overlay || !menuBtn) return;
    nav.classList.remove('open');
    overlay.classList.remove('visible');
    menuBtn.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    wasOpen = false;
  }

  function toggleNav(): void {
    if (wasOpen) closeNav(); else openNav();
  }

  menuBtn.addEventListener('click', toggleNav);
  closeBtn?.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);

  links.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wasOpen) {
      closeNav();
      menuBtn.focus();
    }
  });

  // Close on resize to desktop
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  const handleResize = (e: MediaQueryListEvent) => {
    if (e.matches && wasOpen) closeNav();
  };
  mediaQuery.addEventListener?.('change', handleResize);
}