// ========================================
// COUNTER ANIMATION (IntersectionObserver)
// ========================================

export function initCounterAnimation(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count') || '0', 10);
        const duration = prefersReducedMotion ? 0 : 2000;
        const startTime = performance.now();

        function animate(currentTime: number): void {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const current = Math.floor(eased * target);
          el.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target.toLocaleString();
          }
        }

        if (prefersReducedMotion) {
          el.textContent = target.toLocaleString();
        } else {
          requestAnimationFrame(animate);
        }

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });

  counters.forEach(counter => observer.observe(counter));
}