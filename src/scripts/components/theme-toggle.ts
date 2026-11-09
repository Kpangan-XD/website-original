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
  const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!toggle) return;

  // Apply initial theme
  const stored = getStoredTheme();
  applyTheme(stored);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    const current = getStoredTheme();
    if (current === SYSTEM_THEME) {
      applyTheme(SYSTEM_THEME);
      updateToggleIcon();
    }
  });

  // Toggle handler
  toggle.addEventListener('click', () => {
    const current = getStoredTheme();
    const next: Theme = current === 'light' ? 'dark' : current === 'dark' ? SYSTEM_THEME : 'light';
    applyTheme(next);
    updateToggleIcon();
  });

  function updateToggleIcon(): void {
    if (!toggle) return;
    const current = getStoredTheme();
    const resolved = current === SYSTEM_THEME ? getSystemTheme() : current;
    toggle.setAttribute('aria-label', resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  updateToggleIcon();
}