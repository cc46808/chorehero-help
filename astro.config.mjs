import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  outDir: './build',
  legacy: {
    collections: true,
  },
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
});
