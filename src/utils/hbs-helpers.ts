// ========================================
// HANDLEBARS HELPERS
// ========================================

import Handlebars from 'handlebars';

export default function registerHelpers(hbs: typeof Handlebars): void {
  // Format date
  hbs.registerHelper('formatDate', (dateStr: string, format: string = 'short') => {
    const date = new Date(dateStr);
    if (format === 'short') {
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  // Current year
  hbs.registerHelper('year', () => new Date().getFullYear());

  // Conditional equality
  hbs.registerHelper('eq', (a: unknown, b: unknown) => a === b);

  // JSON stringify for structured data
  hbs.registerHelper('json', (context: unknown) => JSON.stringify(context, null, 2));

  // Safe string output
  hbs.registerHelper('safeString', (str: string) => new hbs.SafeString(str));
}