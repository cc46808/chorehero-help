import React, {useEffect, useMemo, useRef} from 'react';
import {liteClient as algoliasearch} from 'algoliasearch/lite';
import {Chat, InstantSearch} from 'react-instantsearch';
import 'instantsearch.css/components/chat.css';
import styles from './styles.module.css';

function getItemTitle(item) {
  return (
    item.hierarchy?.lvl2 ??
    item.hierarchy?.lvl1 ??
    item.hierarchy?.lvl0 ??
    item.title ??
    item.objectID
  );
}

function getItemSummary(item) {
  return item.content ?? item.description ?? item.hierarchy?.lvl0 ?? '';
}

function ResultCard({item}) {
  const title = getItemTitle(item);
  const summary = getItemSummary(item);

  return (
    <article className={styles.resultCard}>
      <h3 className={styles.resultTitle}>{title}</h3>
      {summary ? <p className={styles.resultSummary}>{summary}</p> : null}
    </article>
  );
}

export default function AgentChat({config}) {
  const openedRef = useRef(false);
  const searchClient = useMemo(
    () => algoliasearch(config.appId, config.apiKey),
    [config.appId, config.apiKey],
  );
  const chatProps = config.agentUrl
    ? {
        transport: {
          api: config.agentUrl,
          headers: {
            'x-algolia-application-id': config.appId,
            'x-algolia-api-key': config.apiKey,
          },
        },
      }
    : {agentId: config.agentId};

  useEffect(() => {
    if (openedRef.current) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const toggleButton = document.querySelector(
        '[data-chorehero-agent-chat] .ais-Chat-toggleButton',
      );
      const promptInput = document.querySelector(
        '[data-chorehero-agent-chat] textarea, [data-chorehero-agent-chat] input',
      );

      if (toggleButton instanceof HTMLButtonElement && !promptInput) {
        toggleButton.click();
        openedRef.current = true;
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={styles.chatShell} data-chorehero-agent-chat>
      <InstantSearch indexName={config.indexName} searchClient={searchClient}>
        <Chat
          {...chatProps}
          itemComponent={({item}) => <ResultCard item={item} />}
          promptHeaderComponent={() => (
            <p className={styles.promptHeader}>
              Ask about setup, child login, chores, rewards, subscriptions, or
              account troubleshooting.
            </p>
          )}
          promptFooterComponent={() => (
            <p className={styles.promptFooter}>
              Answers are grounded in the public ChoreHero help center and may
              link to articles when you need the exact steps.
            </p>
          )}
          translations={{
            placeholder: 'Ask ChoreHero AI a support question',
          }}
        />
      </InstantSearch>
    </div>
  );
}
