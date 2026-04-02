# Support Docs Authoring Guide (Internal)

This internal guide is for maintainers updating the public help center in `help/`.

## When to update support docs

Update the help center when a pull request changes a user-facing behavior such as:

- parent or child app flows
- onboarding, login, account, or settings behavior
- billing, subscriptions, entitlements, or plan messaging
- marketing-site user flows that affect where parents go for support
- support language or troubleshooting expectations

If a pull request touches those surfaces but does **not** need a help-center change, the PR must explicitly declare that by checking **No support docs update is required** or using the `docs-not-needed` label.

## Local workflow

From the repo root:

```bash
npm --prefix help install
npm run help:dev
```

To create a production build:

```bash
npm run help:build
```

## Writing style

- write for parents and household admins, not engineers
- describe what users should do next
- keep plan-dependent language precise
- avoid promising support channels or product capabilities that are not actually configured

## Keep these sources aligned

When support copy depends on product behavior, cross-check:

- `docs/FEATURE_MATRIX.md`
- `README.md`
- relevant flows in `src/`
- billing logic in `src/functions/_shared/billing.js`

## Algolia search and Ask AI

The public help landing page uses the hybrid DocSearch implementation in `help/src/components/HybridDocSearch.tsx`.

If the Algolia application, index, API key, or Ask AI assistant changes, update that component and redeploy the help site.

The optional `help/.env` file is reserved for future local overrides, but the current hybrid search component does not read from it directly.

## PR expectations

The repo includes a dedicated `support-docs:check` status check.

It passes when:

- `help/` changed, or
- no watched user-facing files changed, or
- the PR explicitly declares that no support docs update is required

It fails when watched product changes land without either docs updates or an explicit declaration path.
