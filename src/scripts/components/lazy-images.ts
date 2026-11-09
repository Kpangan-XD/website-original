// ========================================
// LAZY IMAGES (IntersectionObserver + fade-in)
// ========================================

export function initLazyImages(): void {
  const images = document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]');
  if (!images.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        // Force load
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }

        img.addEventListener('load', () => {
          img.classList.add('loaded');
          if (!prefersReducedMotion) {
            img.style.animation = 'fade-in 0.4s ease-out';
          }
        }, { once: true });

        observer.unobserve(img);
      }
    });
  }, { rootMargin: '100px 0px', threshold: 0.01 });

  images.forEach(img => {
    // Add fade-in style
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.4s ease-out';
    observer.observe(img);
  });

  // Add loaded class styles
  const style = document.createElement('style');
  style.textContent = `
    img.loaded { opacity: 1 !important; }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  `;
  document.head.appendChild(style);
}

// Picture element lazy loading (for responsive images from vite-imagetools)
export function initLazyPictures(): void {
  const pictures = document.querySelectorAll<HTMLPictureElement>('picture[data-lazy]');
  if (!pictures.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const picture = entry.target as HTMLPictureElement;
        const sources = picture.querySelectorAll<HTMLSourceElement>('source[data-srcset]');
        const img = picture.querySelector<HTMLImageElement>('img[data-src]');

        sources.forEach(source => {
          source.srcset = source.dataset.srcset || '';
          source.removeAttribute('data-srcset');
        });
        if (img) {
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
        }

        observer.unobserve(picture);
        picture.removeAttribute('data-lazy');
      }
    });
  }, { rootMargin: '100px 0px' });

  pictures.forEach(pic => observer.observe(pic));
}