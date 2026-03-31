import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  outDir: './build',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
});
