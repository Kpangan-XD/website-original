// ========================================
// PROJECT FILTERS
// ========================================

import { projects, getProjectsByCategory } from '@/data/projects';

export function initProjectFilters(): void {
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  const grid = document.getElementById('projects-grid');
  const featuredGrid = document.getElementById('featured-projects');
  const noResults = document.getElementById('no-results');

  if (!grid && !featuredGrid) return;

  let currentProjects = featuredGrid ? projects.filter(p => p.featured) : projects;

  function renderProjects(projectList: typeof projects): void {
    const targetGrid = grid || featuredGrid!;
    if (!targetGrid) return;

    if (projectList.length === 0) {
      targetGrid.innerHTML = '';
      noResults?.classList.remove('hidden');
      return;
    }

    noResults?.classList.add('hidden');

    targetGrid.innerHTML = projectList.map(project => `
      <article class="project-card card" role="listitem" data-category="${project.category}" data-id="${project.id}">
        <div class="project-image">
          ${project.image ? `
            <img src="${project.image}" alt="" loading="lazy" width="400" height="250"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="hidden w-full h-full flex items-center justify-center bg-tertiary" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
            </div>
          ` : `
            <div class="w-full h-full flex items-center justify-center bg-tertiary" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
            </div>
          `}
        </div>
        <div class="project-content">
          <div class="project-meta">
            <span class="badge badge-primary">${project.category}</span>
            <time class="text-xs text-tertiary" datetime="${project.date}">${formatDate(project.date)}</time>
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tags">
            ${project.tags.slice(0, 4).map(tag => `<span class="badge badge-neutral">${tag}</span>`).join('')}
            ${project.tags.length > 4 ? `<span class="badge badge-neutral">+${project.tags.length - 4}</span>` : ''}
          </div>
          <div class="project-footer">
            <div>
              ${project.demoUrl ? `<a href="${project.demoUrl}" class="project-link" target="_blank" rel="noopener noreferrer">Demo <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
              ${project.repoUrl ? `<a href="${project.repoUrl}" class="project-link" target="_blank" rel="noopener noreferrer">Code <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>` : ''}
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
  }

  function filterProjects(category: string): void {
    currentProjects = featuredGrid ? projects.filter(p => p.featured && (category === 'all' || p.category === category)) : getProjectsByCategory(category);
    renderProjects(currentProjects);
  }

  // Initialize
  renderProjects(currentProjects);

  // Event listeners
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter || 'all';
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      filterProjects(filter);
    });
  });
}