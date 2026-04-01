/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_SENTRY_ENABLED?: string;
	readonly PUBLIC_SENTRY_DSN?: string;
	readonly PUBLIC_SENTRY_ENVIRONMENT?: string;
	readonly PUBLIC_SENTRY_TRACES_SAMPLE_RATE?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
