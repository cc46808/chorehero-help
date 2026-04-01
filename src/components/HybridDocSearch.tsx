import { DocSearch } from '@docsearch/react';
import { DocSearchSidepanel } from '@docsearch/react/sidepanel';
import { useRef } from 'react';
import '@docsearch/css';
import '@docsearch/react/style/sidepanel';
import styles from './DocSearchHybrid.module.css';

const appId = 'HVCACK97MH';
const apiKey = 'b79c2f7cdecacea1edc9696d03e1c07a';
const indexName = 'ChoreHero';
const assistantId = 'tWomB3HjvuYi';

export default function HybridDocSearch() {
  const sidepanelRef = useRef<any>(null);

  return (
    <div className={styles.searchShell}>
      <DocSearch
        appId={appId}
        apiKey={apiKey}
        indexName={indexName}
        askAi={{ assistantId, suggestedQuestions: true }}
        interceptAskAiEvent={(initialMessage) => {
          sidepanelRef.current?.openAskAi(initialMessage);
          return true;
        }}
      />
      <DocSearchSidepanel
        ref={sidepanelRef}
        appId={appId}
        apiKey={apiKey}
        indexName={indexName}
        assistantId={assistantId}
        button={{ variant: 'inline' }}
        panel={{
          variant: 'inline',
          pushSelector: '#docsearch-sidepanel-offset-anchor',
          suggestedQuestions: true,
        }}
      />
    </div>
  );
}
