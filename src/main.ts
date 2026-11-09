// ========================================
// MAIN ENTRY POINT
// ========================================

import './styles/main.css';
import { initTheme } from './scripts/components/theme-toggle';
import { initMobileNav } from './scripts/components/mobile-nav';
import { initSearch } from './scripts/components/search';
import { initCounterAnimation } from './scripts/components/counter';
import { initFormValidation } from './scripts/components/form-validation';
import { initProjectFilters } from './scripts/components/project-filters';
import { initLazyImages } from './scripts/components/lazy-images';
import { initScrollSpy } from './scripts/components/scroll-spy';

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initSearch();
  initCounterAnimation();
  initFormValidation();
  initProjectFilters();
  initLazyImages();
  initScrollSpy();

  // Announce page load for screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'visually-hidden';
  announcement.textContent = 'Page loaded';
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
});

// Handle page transitions (for future SPA enhancement)
export function navigateTo(url: string): void {
  window.location.href = url;
}

// Performance observer for monitoring
if ('PerformanceObserver' in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('[Performance] LCP:', entry.startTime.toFixed(2), 'ms');
        }
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          console.log('[Performance] FID:', fidEntry.processingStart - fidEntry.startTime, 'ms');
        }
        if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!clsEntry.hadRecentInput && clsEntry.value !== undefined) {
            console.log('[Performance] CLS:', clsEntry.value.toFixed(4));
          }
        }
      }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    observer.observe({ type: 'first-input', buffered: true });
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // Silently fail if not supported
  }
}