import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

type ConsentConfig = {
  cookiePolicyUrl: string;
  sentryEnabled: boolean;
  sentryDsn: string;
  sentryEnvironment: string;
  sentryTracesSampleRate: number;
};

declare global {
  interface Window {
    ChoreHeroConsent?: {
      showPreferences: () => void;
    };
    Sentry?: {
      init?: (options: Record<string, unknown>) => void;
      captureConsoleIntegration?: (options: Record<string, unknown>) => unknown;
      captureException?: (error: unknown, context?: Record<string, unknown>) => void;
      captureMessage?: (message: string, context?: Record<string, unknown>) => void;
      Integrations?: {
        CaptureConsole?: new (options: Record<string, unknown>) => unknown;
      };
    };
    __choreHeroConsentInitialized?: boolean;
    __choreHeroConsentTriggersBound?: boolean;
    __choreHeroSentryBooted?: boolean;
    __choreHeroSentryGlobalHandlersInstalled?: boolean;
  }
}

const CONSENT_COOKIE_NAME = 'ch_cookie_consent';
const REGION_POLICY_COOKIE_NAME = 'ch_region_policy';
const CONSENT_REVISION = 2;
const SENTRY_BROWSER_BUNDLE_URL = 'https://browser.sentry-cdn.com/10.22.0/bundle.min.js';
const STRICT_REGION_POLICY = 'strict';
const SHARED_COOKIE_DOMAIN = '.chorehero.cloud';

function readCookie(name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function isChoreHeroHostname(hostname = window.location.hostname) {
  return hostname === 'chorehero.cloud' || hostname.endsWith('.chorehero.cloud');
}

function resolveConsentCookieDomain() {
  return isChoreHeroHostname() ? SHARED_COOKIE_DOMAIN : undefined;
}

function readRegionPolicy() {
  return readCookie(REGION_POLICY_COOKIE_NAME) === 'standard' ? 'standard' : STRICT_REGION_POLICY;
}

function isStrictRegion() {
  return readRegionPolicy() === STRICT_REGION_POLICY;
}

function normalizeSampleRate(value: number) {
  return Number.isFinite(value) ? value : 0.1;
}

function loadScript(src: string) {
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (existing) {
    if (existing.dataset.loaded === 'true') return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        resolve();
      },
      { once: true }
    );
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

function registerPreferenceTriggers() {
  if (window.__choreHeroConsentTriggersBound) return;

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const trigger = target?.closest('[data-cookie-settings]');
    if (!trigger) return;

    event.preventDefault();
    CookieConsent.showPreferences();
  });

  window.ChoreHeroConsent = {
    showPreferences: () => CookieConsent.showPreferences(),
  };
  window.__choreHeroConsentTriggersBound = true;
}

function collectErrorTexts(value: unknown, target: string[] = []) {
  if (!value) return target;

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (normalized) target.push(normalized);
    return target;
  }

  if (value instanceof Error) {
    collectErrorTexts(value.name, target);
    collectErrorTexts(value.message, target);
    return target;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectErrorTexts(entry, target));
    return target;
  }

  if (typeof value === 'object') {
    const candidate = value as Record<string, unknown>;
    collectErrorTexts(candidate.message, target);
    collectErrorTexts(candidate.name, target);
    collectErrorTexts(candidate.type, target);
    collectErrorTexts(candidate.reason, target);
    collectErrorTexts(candidate.formatted, target);
    collectErrorTexts(candidate.value, target);

    if (Array.isArray(candidate.exception?.values)) {
      candidate.exception.values.forEach((entry) => collectErrorTexts(entry, target));
    }

    if (candidate.logentry) {
      collectErrorTexts(candidate.logentry, target);
    }
  }

  return target;
}

function matchesPatterns(value: unknown, patterns: RegExp[]) {
  return collectErrorTexts(value).some((text) => patterns.some((pattern) => pattern.test(text)));
}

function ensureSentryRuntime(config: ConsentConfig) {
  if (!config.sentryEnabled || !config.sentryDsn || window.__choreHeroSentryBooted) return Promise.resolve();

  return loadScript(SENTRY_BROWSER_BUNDLE_URL).then(() => {
    if (window.__choreHeroSentryBooted) return;

    const ignoreSentryPatterns = [
      /^CHOREHERO_(?:CONSOLE|RUNTIME)_ERROR_TEST_/i,
      /Lock broken by another request with the 'steal' option\./i,
    ];
    const dynamicImportFailurePatterns = [
      /Failed to fetch dynamically imported module/i,
      /Importing a module script failed/i,
      /error loading dynamically imported module/i,
      /Unable to preload CSS/i,
    ];
    const dynamicImportReloadKey = '__chorehero_dynamic_import_reload__';
    const dynamicImportReloadWindowMs = 15000;

    const shouldIgnoreSentryValue = (value: unknown) => matchesPatterns(value, ignoreSentryPatterns);
    const shouldIgnoreSentryEvent = (event: unknown, hint: { originalException?: unknown; syntheticException?: unknown } = {}) =>
      shouldIgnoreSentryValue(event) ||
      shouldIgnoreSentryValue(hint.originalException) ||
      shouldIgnoreSentryValue(hint.syntheticException);

    const recoverFromDynamicImportFailure = (value: unknown) => {
      if (!matchesPatterns(value, dynamicImportFailurePatterns)) return false;

      try {
        const now = Date.now();
        const currentHref = window.location.href;
        const previousRaw = window.sessionStorage.getItem(dynamicImportReloadKey);
        const previous = previousRaw ? JSON.parse(previousRaw) : null;
        const retriedRecently =
          previous?.href === currentHref &&
          now - Number(previous?.at || 0) < dynamicImportReloadWindowMs;

        if (retriedRecently) return false;

        window.sessionStorage.setItem(
          dynamicImportReloadKey,
          JSON.stringify({ href: currentHref, at: now })
        );
        window.location.reload();
        return true;
      } catch {
        return false;
      }
    };

    const consoleIntegration =
      typeof window.Sentry?.captureConsoleIntegration === 'function'
        ? window.Sentry.captureConsoleIntegration({
            levels: ['error', 'warn', 'assert'],
          })
        : typeof window.Sentry?.Integrations?.CaptureConsole === 'function'
          ? new window.Sentry.Integrations.CaptureConsole({
              levels: ['error', 'warn', 'assert'],
            })
          : null;

    window.Sentry?.init?.({
      dsn: config.sentryDsn,
      environment: config.sentryEnvironment,
      integrations: consoleIntegration ? [consoleIntegration] : [],
      tracesSampleRate: normalizeSampleRate(config.sentryTracesSampleRate),
      ignoreErrors: ignoreSentryPatterns,
      beforeSend(event: unknown, hint: { originalException?: unknown; syntheticException?: unknown }) {
        if (shouldIgnoreSentryEvent(event, hint)) {
          return null;
        }
        return event;
      },
    });

    window.addEventListener('vite:preloadError', (event) => {
      const payload = (event as CustomEvent).detail ?? (event as { payload?: unknown }).payload ?? (event as { error?: unknown }).error ?? null;
      if (recoverFromDynamicImportFailure(payload)) {
        event.preventDefault?.();
      }
    });

    if (!consoleIntegration && window.Sentry) {
      const originalConsoleError = console.error.bind(console);
      const originalConsoleWarn = console.warn.bind(console);
      const originalConsoleAssert = console.assert.bind(console);
      let isCapturing = false;

      const normalizeArg = (value: unknown) => {
        if (value instanceof Error) return value.message;
        if (typeof value === 'string') return value;
        try {
          return JSON.stringify(value);
        } catch {
          return String(value);
        }
      };

      const captureConsoleEvent = (level: 'error' | 'warning', args: unknown[]) => {
        if (isCapturing) return;
        if (shouldIgnoreSentryValue(args)) return;
        isCapturing = true;
        try {
          const errorArg = args.find((arg) => arg instanceof Error) as Error | undefined;
          const normalizedArgs = args.map(normalizeArg).join(' ');

          if (errorArg) {
            window.Sentry?.captureException?.(errorArg, {
              level,
              extra: { console_args: normalizedArgs },
            });
          } else {
            window.Sentry?.captureMessage?.(normalizedArgs || 'Console message', {
              level,
            });
          }
        } finally {
          isCapturing = false;
        }
      };

      console.error = (...args: unknown[]) => {
        captureConsoleEvent('error', args);
        originalConsoleError(...args);
      };

      console.warn = (...args: unknown[]) => {
        captureConsoleEvent('warning', args);
        originalConsoleWarn(...args);
      };

      console.assert = (condition?: boolean, ...args: unknown[]) => {
        if (!condition) {
          captureConsoleEvent('error', ['Assertion failed', ...args]);
        }
        originalConsoleAssert(condition, ...args);
      };
    }

    if (window.Sentry && !window.__choreHeroSentryGlobalHandlersInstalled) {
      window.__choreHeroSentryGlobalHandlersInstalled = true;

      window.addEventListener('error', (event) => {
        const errorValue = event.error || event.message || 'Uncaught browser error';
        if (recoverFromDynamicImportFailure(errorValue) || shouldIgnoreSentryValue(errorValue)) {
          return;
        }

        const error = event.error instanceof Error
          ? event.error
          : new Error(event.message || 'Uncaught browser error');

        window.Sentry?.captureException?.(error, {
          level: 'error',
          extra: {
            source: 'window.error',
            filename: event.filename || null,
            lineno: event.lineno || null,
            colno: event.colno || null,
          },
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason;
        if (recoverFromDynamicImportFailure(reason) || shouldIgnoreSentryValue(reason)) {
          return;
        }

        const error = reason instanceof Error
          ? reason
          : new Error(typeof reason === 'string' ? reason : 'Unhandled promise rejection');

        window.Sentry?.captureException?.(error, {
          level: 'error',
          extra: {
            source: 'window.unhandledrejection',
            reason: reason && !(reason instanceof Error)
              ? (() => {
                  try {
                    return JSON.stringify(reason);
                  } catch {
                    return String(reason);
                  }
                })()
              : null,
          },
        });
      });
    }

    window.__choreHeroSentryBooted = true;
  });
}

function syncTelemetry(config: ConsentConfig, changedCategories: string[] = []) {
  const diagnosticsEnabled = config.sentryEnabled && CookieConsent.acceptedCategory('diagnostics');
  const diagnosticsChanged = changedCategories.includes('diagnostics');

  if (diagnosticsEnabled) {
    void ensureSentryRuntime(config);
  } else if (diagnosticsChanged && window.__choreHeroSentryBooted) {
    window.location.reload();
  }
}

function buildCookiePolicyDescription(cookiePolicyUrl: string) {
  return `You can update your optional diagnostics choices at any time. Read our <a href="${cookiePolicyUrl}">Privacy Policy</a> for more detail.`;
}

function buildCookieConfig(config: ConsentConfig) {
  return {
    name: CONSENT_COOKIE_NAME,
    domain: resolveConsentCookieDomain(),
    path: '/',
    sameSite: 'Lax' as const,
    secure: true,
    expiresAfterDays: 180,
    useLocalStorage: false,
    revision: CONSENT_REVISION,
    mode: isStrictRegion() ? ('opt-in' as const) : ('opt-out' as const),
    autoShow: true,
    manageScriptTags: false,
    autoClearCookies: true,
    hideFromBots: false,
    guiOptions: {
      consentModal: {
        layout: 'box' as const,
        position: 'bottom right' as const,
        equalWeightButtons: true,
      },
      preferencesModal: {
        layout: 'box' as const,
        equalWeightButtons: true,
      },
    },
    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {},
      diagnostics: {},
    },
    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'Cookie choices for ChoreHero',
            description:
              'We use necessary cookies to keep the site working. Optional diagnostics help us identify public help-center failures. Search stays available regardless of this choice.',
            acceptAllBtn: 'Accept all',
            showPreferencesBtn: 'Review settings',
            footer: buildCookiePolicyDescription(config.cookiePolicyUrl),
          },
          preferencesModal: {
            title: 'Cookie settings',
            acceptAllBtn: 'Accept all',
            savePreferencesBtn: 'Save settings',
            closeIconLabel: 'Close',
            sections: [
              {
                title: 'Cookie use on our public sites',
                description:
                  'Necessary cookies keep the banner and site settings working. Optional diagnostics helps us debug public-site failures. Help search remains available either way.',
              },
              {
                title: 'Necessary',
                description:
                  'These cookies are required for core site behavior, including remembering your cookie choices.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analytics',
                description:
                  'Reserved for future optional public-site analytics categories. No additional analytics vendor is currently gated on the help center.',
                linkedCategory: 'analytics',
              },
              {
                title: 'Diagnostics',
                description:
                  'Allows browser error diagnostics so we can debug failures on the public sites.',
                linkedCategory: 'diagnostics',
              },
              {
                title: 'More information',
                description: buildCookiePolicyDescription(config.cookiePolicyUrl),
              },
            ],
          },
        },
      },
    },
    onModalReady: ({ modalName, modal }: { modalName: 'consentModal' | 'preferencesModal'; modal: HTMLElement }) => {
      modal.dataset.testid = modalName === 'consentModal' ? 'cookie-consent-modal' : 'cookie-preferences-modal';
    },
    onFirstConsent: () => {
      syncTelemetry(config);
    },
    onConsent: () => {
      syncTelemetry(config);
    },
    onChange: ({ changedCategories }: { changedCategories: string[] }) => {
      syncTelemetry(config, changedCategories);
    },
  };
}

export async function initPublicConsent(config: ConsentConfig) {
  if (window.__choreHeroConsentInitialized) return;

  registerPreferenceTriggers();
  await CookieConsent.run(buildCookieConfig(config));
  syncTelemetry(config);
  window.__choreHeroConsentInitialized = true;
}
