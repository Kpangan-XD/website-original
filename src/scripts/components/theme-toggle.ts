// ========================================
// THEME TOGGLE
// ========================================

const THEME_KEY = 'inpianda-theme';
const SYSTEM_THEME = 'system';

type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme): void {
  const resolved = theme === SYSTEM_THEME ? getSystemTheme() : theme;
  document.documentElement.setAttribute('data-theme', resolved);
  localStorage.setItem(THEME_KEY, theme);
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  return stored ?? SYSTEM_THEME;
}

export function initTheme(): void {
  const toggles = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  if (!toggles.length) return;

  // Apply initial theme
  const stored = getStoredTheme();
  applyTheme(stored);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    const current = getStoredTheme();
    if (current === SYSTEM_THEME) {
      applyTheme(SYSTEM_THEME);
      updateAllToggleIcons();
    }
  });

  // Toggle handler for each toggle button
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const current = getStoredTheme();
      const next: Theme = current === 'light' ? 'dark' : current === 'dark' ? SYSTEM_THEME : 'light';
      applyTheme(next);
      updateAllToggleIcons();
    });
  });

  function updateAllToggleIcons(): void {
    const current = getStoredTheme();
    const resolved = current === SYSTEM_THEME ? getSystemTheme() : current;
    toggles.forEach(toggle => {
      toggle.setAttribute('aria-label', resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  updateAllToggleIcons();
}