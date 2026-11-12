import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { VitePWA } from 'vite-plugin-pwa';
import compression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Handlebars from 'handlebars';
import { projects } from './src/data/projects';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Handlebars helpers
const hbsHelpers = {
  formatDate: (dateStr: string, format: string = 'short') => {
    const date = new Date(dateStr);
    if (format === 'short') {
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  },
  year: () => new Date().getFullYear(),
  eq: (a: unknown, b: unknown) => a === b,
  json: (context: unknown) => JSON.stringify(context, null, 2),
  safeString: (str: string) => new Handlebars.SafeString(str),
};

// Generate sitemap
function generateSitemap() {
  const baseUrl = 'https://inpianda.dev';
  const pages = ['', 'projects', 'about', 'contact', 'form', 'documentation', 'project', 'theory', 'note', 'settings'];
  const projectUrls = projects.map(p => `projects#${p.id}`);

  const urls = [
    ...pages.map(page => `${baseUrl}/${page || ''}`),
    ...projectUrls.map(u => `${baseUrl}/${u}`),
  ].map(url => `  <url><loc>${url}</loc><changefreq>weekly</changefreq><priority>${url === baseUrl ? '1.0' : '0.8'}</priority></url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
}

const pages = ['index', 'projects', 'about', 'contact', 'form', 'documentation', 'project', 'theory', 'note', 'settings'];

export default defineConfig({
  base: './', // <-- TAMBAHKAN BARIS INI DI SINI
  root: '.',
  publicDir: 'public',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      input: pages.reduce((acc, page) => {
        acc[page] = path.resolve(__dirname, `${page}.html`);
        return acc;
      }, {} as Record<string, string>),
    },
  },
  plugins: [
    handlebars({
      partialDirectory: path.resolve(__dirname, 'src/components'),
      compileOptions: { strict: true },
      helpers: hbsHelpers,
      context(pagePath) {
        const pageName = path.basename(pagePath, '.html');
        const isHome = pageName === 'index';
        const isProjects = pageName === 'projects';
        const isAbout = pageName === 'about';
        const isContact = pageName === 'contact';
        const isForm = pageName === 'form';
        const isDocumentation = pageName === 'documentation';
        const isProject = pageName === 'project';
        const isTheory = pageName === 'theory';
        const isNote = pageName === 'note';
        const isSettings = pageName === 'settings';

        return {
          title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
          description: 'Inpianda Software Foundation — Low-level systems programming: compilers, operating systems, embedded.',
          isHome,
          isProjects,
          isAbout,
          isContact,
          isForm,
          isDocumentation,
          isProject,
          isTheory,
          isNote,
          isSettings,
          pageScript: isHome ? '/src/scripts/pages/home.ts' :
                      isProjects ? '/src/scripts/pages/projects.ts' :
                      isContact ? '/src/scripts/pages/contact.ts' :
                      isForm ? '/src/scripts/pages/form.ts' : undefined,
          heroImage: isHome ? '/assets/hero.jpg' : undefined,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Inpianda Center',
            url: 'https://inpianda.dev',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://inpianda.dev/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
        };
      },
    }),
    imagetools({
      defaultDirectives: (url) => new URLSearchParams({
        format: 'avif;webp;png',
        as: 'picture',
        widths: '320;640;1024;1920',
      }),
    }),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      includeAssets: ['robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Inpianda Center',
        short_name: 'Inpianda',
        description: 'Project documentation & portfolio center',
        theme_color: '#1a1a2e',
        background_color: '#fafafa',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        shortcuts: [
          { name: 'Projects', short_name: 'Projects', url: '/projects', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
          { name: 'Contact', short_name: 'Contact', url: '/contact', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }, cacheableResponse: { statuses: [0, 200] } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }, cacheableResponse: { statuses: [0, 200] } },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'images-cache', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }, cacheableResponse: { statuses: [0, 200] } },
          },
        ],
      },
    }),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
    {
      name: 'generate-sitemap',
      writeBundle() {
        const sitemap = generateSitemap();
        fs.writeFileSync(path.resolve(__dirname, 'dist/sitemap.xml'), sitemap);
      },
    },
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 3000,
    open: true,
    configureServer: (server) => {
      server.middlewares.use('/api/contact', async (req, res, next) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }
        let body = '';
        for await (const chunk of req) body += chunk;
        try {
          const data = JSON.parse(body);
          if (!data.name || !data.email || !data.subject || !data.message) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'All fields are required' }));
            return;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Message sent successfully! We will get back to you soon.' }));
        } catch {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Failed to send message' }));
        }
      });
    },
  },
  preview: {
    port: 3000,
  },
  // MPA routing for dev server
  appType: 'mpa',
});
