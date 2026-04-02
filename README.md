# ChoreHero Help Center

This app is the public support and knowledge base for ChoreHero. It is intentionally separate from the root `docs/` folder, which remains for internal engineering and operations documentation.

## Local development

```bash
npm install
npm start
```

## Production build

```bash
npm run build
```

The static output is written to `build/`.

## Cloudflare Pages

The primary deployment model is a Git-connected Cloudflare Pages project with:

- root directory: `help`
- build command: `npm run build`
- build output directory: `build`
- production branch: `main`

See [`../docs/SUPPORT_SITE_SETUP.md`](../docs/SUPPORT_SITE_SETUP.md) for the exact dashboard settings, GitHub integration, Sentry setup, Algolia maintenance, and the optional Wrangler fallback.

## Algolia hybrid search

The help center uses the official hybrid DocSearch React components for both standard search and Ask AI.

The current search and Ask AI values live in:

- [`src/components/DocSearch.tsx`](./src/components/DocSearch.tsx)
- [`src/components/HybridDocSearch.tsx`](./src/components/HybridDocSearch.tsx)

Keep local development guidance here and use [`../docs/SUPPORT_SITE_SETUP.md`](../docs/SUPPORT_SITE_SETUP.md) as the source of truth for production setup.
