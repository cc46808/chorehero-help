import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './ask-ai.module.css';

const starterQuestions = [
  'How do I set up ChoreHero for my family?',
  "Why can't my child log in or see their chores?",
  'How do I change or cancel my subscription?',
];

function StarterPromptList() {
  return (
    <div className={styles.promptList}>
      {starterQuestions.map((question) => (
        <div className={styles.promptCard} key={question}>
          {question}
        </div>
      ))}
    </div>
  );
}

export default function AskAiPage() {
  const {siteConfig} = useDocusaurusContext();
  const agentConfig = siteConfig.customFields?.algoliaAgent;

  return (
    <Layout
      title="Ask AI"
      description="Ask the ChoreHero support assistant about setup, billing, chores, rewards, child access, and troubleshooting."
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>ChoreHero AI support</p>
            <h1 className={styles.title}>Ask a support question in plain language.</h1>
            <p className={styles.description}>
              Use the Algolia-powered assistant when you want a faster answer
              than browsing article by article. It is best for household setup,
              child access, rewards, subscriptions, and day-to-day
              troubleshooting.
            </p>
            <StarterPromptList />
            <p className={styles.meta}>
              Powered by{' '}
              <a
                href="https://www.algolia.com/products/ai/"
                target="_blank"
                rel="noreferrer"
              >
                Algolia AI
              </a>
              . You can still use{' '}
              <Link to="/search">search results</Link>
              {' '}for article-by-article browsing.
            </p>
          </div>
        </section>

        <section className={styles.chatSection}>
          {agentConfig ? (
            <BrowserOnly
              fallback={
                <div className={styles.loadingCard}>
                  Loading the ChoreHero AI assistant.
                </div>
              }
            >
              {() => {
                const AgentChat = require('../components/AgentChat').default;

                return <AgentChat config={agentConfig} />;
              }}
            </BrowserOnly>
          ) : (
            <div className={styles.loadingCard}>
              The Algolia AI assistant is not configured for this build yet.
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
