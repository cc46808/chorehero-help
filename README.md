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

See [`../docs/SUPPORT_SITE_SETUP.md`](../docs/SUPPORT_SITE_SETUP.md) for the exact dashboard settings, required GitHub setup, Algolia DocSearch variables, and the optional secondary Wrangler fallback.

## Algolia AI assistant

The help center uses the DocSearch adapter for both standard search and Ask AI.

Use `DOCSEARCH_APP_ID`, `DOCSEARCH_API_KEY`, and `DOCSEARCH_INDEX_NAME` for search, and `DOCSEARCH_ASK_AI_ASSISTANT_ID` for the hybrid Ask AI experience that appears with the search UI.
