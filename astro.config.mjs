// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

// Keystatic (админка контента) нужен только локально: ему нужен сервер,
// а продакшен-сайт на GitHub Pages полностью статический.
const isDev = process.argv.includes('dev');

// Пока домен не подключён, сайт живёт на https://marksvess.github.io/portfolio/.
// После подключения marksvess.com: SITE_URL=https://marksvess.com и BASE_PATH=/
// (меняется в .github/workflows/deploy.yml, см. Reference.md, раздел 10).
// Локально сайт всегда открывается от корня (http://localhost:4321/): Keystatic не поддерживает префикс.
const SITE = process.env.SITE_URL ?? 'https://marksvess.github.io';
const BASE = isDev ? '/' : (process.env.BASE_PATH ?? '/portfolio');

export default defineConfig({
  site: SITE,
  base: BASE,
  // Keystatic использует адреса без слэша в конце, поэтому строгое правило только для продакшена.
  trailingSlash: isDev ? 'ignore' : 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', ru: 'ru-RU' } },
    }),
    ...(isDev ? [keystatic()] : []),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'cyrillic'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
