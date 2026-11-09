// ========================================
// SEARCH (Client-side, debounced)
// ========================================

import { projects, searchProjects } from '@/data/projects';

interface SearchResult {
  project: typeof projects[0];
  score: number;
}

function calculateScore(project: typeof projects[0], query: string): number {
  const lower = query.toLowerCase();
  let score = 0;
  if (project.title.toLowerCase().includes(lower)) score += 10;
  if (project.description.toLowerCase().includes(lower)) score += 5;
  project.tags.forEach(tag => {
    if (tag.toLowerCase().includes(lower)) score += 3;
  });
  return score;
}

export function initSearch(): void {
  const input = document.querySelector<HTMLInputElement>('.search-input');
  if (!input) return;

  let debounceTimer: ReturnType<typeof setTimeout>;
  let resultsContainer: HTMLDivElement | null = null;

  function createResultsContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'search-results';
    container.setAttribute('role', 'listbox');
    container.setAttribute('aria-label', 'Search results');
    Object.assign(container.style, {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      marginTop: 'var(--space-1)',
      background: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border-medium)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      maxHeight: '400px',
      overflowY: 'auto',
      zIndex: 'var(--z-dropdown)',
      display: 'none',
    });
    return container;
  }

  function renderResults(results: SearchResult[]): void {
    if (!resultsContainer || !input) return;

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="p-4 text-center text-secondary text-sm" role="option" aria-selected="false">
          No results found
        </div>
      `;
      resultsContainer.style.display = 'block';
      return;
    }

    resultsContainer.innerHTML = results.map(({ project }) => `
      <a href="/projects#${project.id}" class="search-result-item flex items-center gap-3 p-3 hover:bg-tertiary transition-colors" role="option" aria-selected="false" data-project-id="${project.id}">
        <span class="badge badge-primary badge-sm">${project.category}</span>
        <span class="font-medium text-sm">${project.title}</span>
        <span class="text-tertiary text-xs flex-1 text-end">${project.tags.slice(0, 2).join(', ')}</span>
      </a>
    `).join('');
    resultsContainer.style.display = 'block';

    // Add click handlers
    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        input!.value = '';
        hideResults();
      });
    });
  }

  function showResults(): void {
    if (!resultsContainer) {
      resultsContainer = createResultsContainer();
      input!.parentElement?.appendChild(resultsContainer);
    }
  }

  function hideResults(): void {
    resultsContainer?.remove();
    resultsContainer = null;
  }

  function handleInput(): void {
    if (!input) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = input.value.trim();
      if (query.length < 2) {
        hideResults();
        return;
      }

      const results = searchProjects(query)
        .map(p => ({ project: p, score: calculateScore(p, query) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);

      showResults();
      renderResults(results);
    }, 150);
  }

  function handleFocus(): void {
    if (!input) return;
    if (input.value.trim().length >= 2) handleInput();
  }

  function handleBlur(): void {
    setTimeout(hideResults, 200); // Allow click on results
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (!input) return;
    if (!resultsContainer || resultsContainer.style.display === 'none') return;

    const items = resultsContainer.querySelectorAll<HTMLElement>('.search-result-item');
    const currentIndex = Array.from(items).findIndex(item => item === document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = items[(currentIndex + 1) % items.length];
      next.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = items[(currentIndex - 1 + items.length) % items.length];
      prev.focus();
    } else if (e.key === 'Enter' && currentIndex >= 0) {
      e.preventDefault();
      items[currentIndex].click();
    } else if (e.key === 'Escape') {
      hideResults();
      input.blur();
    }
  }

  input.addEventListener('input', handleInput);
  input.addEventListener('focus', handleFocus);
  input.addEventListener('blur', handleBlur);
  input.addEventListener('keydown', handleKeydown);

  // Hide results on scroll
  window.addEventListener('scroll', hideResults, { passive: true });
}