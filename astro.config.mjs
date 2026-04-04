import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import remarkDocGallery from './src/plugins/remark-doc-gallery.mjs';

export default defineConfig({
  outDir: './build',
  legacy: {
    collections: true,
  },
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  markdown: {
    remarkPlugins: [remarkDocGallery],
  },
});
