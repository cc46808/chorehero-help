// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

process.loadEnvFile?.('.env');

const defaultDocsearchConfig = {
  appId: 'HVCACK97MH',
  apiKey: 'b79c2f7cdecacea1edc9696d03e1c07a',
  indexName: 'ChoreHero',
  assistantId: 'tWomB3HjvuYi',
};

const docsearchConfig = {
  appId: process.env.DOCSEARCH_APP_ID ?? defaultDocsearchConfig.appId,
  apiKey: process.env.DOCSEARCH_API_KEY ?? defaultDocsearchConfig.apiKey,
  indexName: process.env.DOCSEARCH_INDEX_NAME ?? defaultDocsearchConfig.indexName,
  assistantId:
    process.env.DOCSEARCH_ASK_AI_ASSISTANT_ID ??
    defaultDocsearchConfig.assistantId,
};

const hasDocsearch = Object.values(docsearchConfig).every(Boolean);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ChoreHero Help Center',
  tagline:
    'Practical answers for parents, plans, login flows, chores, rewards, and household troubleshooting.',
  favicon: 'img/chorehero-mark.svg',
  future: {
    v4: true,
  },
  url: 'https://help.chorehero.cloud',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.6,
          ignorePatterns: ['/tags/**'],
        },
      }),
    ],
  ],
  themes: hasDocsearch ? ['@docsearch/docusaurus-adapter'] : [],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/parent-dashboard.png',
      metadata: [
        {
          name: 'description',
          content:
            'Support articles for ChoreHero parents covering setup, billing, child access, chores, rewards, and troubleshooting.',
        },
        {
          name: 'keywords',
          content:
            'chorehero help, parent faq, child login, chore app support, billing support, household routines',
        },
      ],
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Help Center',
        logo: {
          alt: 'ChoreHero',
          src: 'img/logo-wordmark.png',
        },
        items: [
          {to: '/docs/getting-started', label: 'Getting started', position: 'left'},
          {to: '/docs/parent-faqs', label: 'Parent FAQs', position: 'left'},
          {to: '/docs/billing-subscriptions', label: 'Billing', position: 'left'},
          {to: '/docs/troubleshooting', label: 'Troubleshooting', position: 'left'},
          {href: 'https://app.chorehero.cloud/login', label: 'Open app', position: 'right'},
          {href: 'https://chorehero.cloud', label: 'Website', position: 'right'},
          ...(hasDocsearch ? [{type: 'search', position: 'right'}] : []),
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Support',
            items: [
              {label: 'Getting started', to: '/docs/getting-started'},
              {label: 'Parent FAQs', to: '/docs/parent-faqs'},
              {label: 'Contact and support', to: '/docs/contact-support'},
            ],
          },
          {
            title: 'Product',
            items: [
              {label: 'Open app', href: 'https://app.chorehero.cloud/login'},
              {label: 'Marketing site', href: 'https://chorehero.cloud'},
            ],
          },
          {
            title: 'Legal',
            items: [
              {label: 'Privacy policy', href: 'https://app.chorehero.cloud/privacy-policy'},
              {label: 'Terms of use', href: 'https://app.chorehero.cloud/terms-of-use'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ChoreHero. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      ...(hasDocsearch
        ? {
            docsearch: {
              appId: docsearchConfig.appId,
              apiKey: docsearchConfig.apiKey,
              indexName: docsearchConfig.indexName,
              contextualSearch: true,
              searchPagePath: 'search',
              askAi: {
                assistantId: docsearchConfig.assistantId,
                suggestedQuestions: true,
              },
            },
          }
        : {}),
    }),
};

export default config;
