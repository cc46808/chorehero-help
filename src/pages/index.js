import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HeroHybridSearch from '@site/src/components/HeroHybridSearch';

import styles from './index.module.css';

const quickLinks = [
  {
    title: 'Get started',
    body: 'Set up your household, learn the core parent flow, and understand where kids sign in.',
    to: '/docs/getting-started',
  },
  {
    title: 'Parent FAQs',
    body: 'Answers to the most common questions about child access, rewards, routines, and daily use.',
    to: '/docs/parent-faqs',
  },
  {
    title: 'Billing and subscriptions',
    body: 'Understand Free, Plus, and Pro, where billing lives, and what happens during plan changes.',
    to: '/docs/billing-subscriptions',
  },
  {
    title: 'Troubleshooting',
    body: 'Start here for login issues, missing chores, access changes, push problems, and billing confusion.',
    to: '/docs/troubleshooting',
  },
];

const supportLanes = [
  'Parent setup, onboarding, and account basics',
  'Child login, quick-login links, and trusted-device questions',
  'Recurring chores, approvals, proof, rewards, and dashboard workflows',
  'Billing, plan access, and Stripe-backed subscription questions',
];

export default function Home() {
  return (
    <Layout
      title="Help Center"
      description="Support articles for ChoreHero parents covering setup, billing, login flows, chores, rewards, and troubleshooting.">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroShell}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}>ChoreHero support</span>
              <Heading as="h1" className={styles.heroTitle}>
                Help that keeps family routines moving.
              </Heading>
              <p className={styles.heroSubtitle}>
                Find the fastest path for setup, child access, chores, rewards, billing, and
                day-to-day troubleshooting without digging through internal docs.
              </p>
              <div className={styles.heroSearchGroup}>
                <p className={styles.heroHint}>
                  Search the help center or ask AI first for fast answers about login, chores,
                  billing, and family setup.
                </p>
                <HeroHybridSearch />
              </div>
              <div className={styles.heroActions}>
                <Link
                  className={`button button--primary button--lg ${styles.heroPrimaryAction}`}
                  to="/docs/getting-started">
                  Start with setup
                </Link>
                <Link
                  className={`button button--secondary button--lg ${styles.heroSecondaryAction}`}
                  to="/docs/parent-faqs">
                  Browse parent FAQs
                </Link>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.previewCard}>
                <img
                  alt="ChoreHero parent dashboard preview"
                  className={styles.previewImage}
                  src="/img/parent-dashboard.png"
                />
                <div className={styles.previewMeta}>
                  <strong>Parent dashboard</strong>
                  <span>One place for chores, approvals, rewards, and family settings.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Heading as="h2" className={styles.sectionTitle}>
              Start with the topic that matches your question
            </Heading>
            <p className={styles.sectionCopy}>
              The help center is organized around parent-facing product flows, not engineering
              internals.
            </p>
          </div>
          <div className={styles.quickGrid}>
            {quickLinks.map((item) => (
              <Link className={styles.quickCard} key={item.to} to={item.to}>
                <Heading as="h3" className={styles.quickTitle}>
                  {item.title}
                </Heading>
                <p>{item.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.twoUp}>
            <div className={styles.glancePanel}>
              <Heading as="h2" className={styles.sectionTitle}>
                What this help center covers
              </Heading>
              <ul className={styles.laneList}>
                {supportLanes.map((lane) => (
                  <li key={lane}>{lane}</li>
                ))}
              </ul>
            </div>
            <div className={styles.glancePanel}>
              <Heading as="h2" className={styles.sectionTitle}>
                When a change needs docs review
              </Heading>
              <p className={styles.sectionCopy}>
                User-facing app, billing, onboarding, child access, and support-surface changes are
                expected to update <code>help/</code> or explicitly declare that no support docs
                update is needed in the pull request.
              </p>
              <Link className={styles.inlineLink} to="/docs/authoring-guide">
                Read the docs authoring guide
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.supportStrip}>
          <div>
            <Heading as="h2" className={styles.supportTitle}>
              Need the product right now?
            </Heading>
            <p className={styles.supportCopy}>
              Open the app for account access, billing settings, and your current household data.
            </p>
          </div>
          <div className={styles.supportActions}>
            <Link className="button button--primary" href="https://app.chorehero.cloud/login">
              Open ChoreHero
            </Link>
            <Link className="button button--secondary" href="https://chorehero.cloud">
              Visit chorehero.cloud
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
