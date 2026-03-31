import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {DocSearch} from '@docsearch/core';
import {DocSearchModal} from '@docsearch/modal';
import {Sidepanel} from '@docsearch/sidepanel';

import '@docsearch/css/dist/style.css';
import '@docsearch/css/dist/sidepanel.css';

export default function Root({children}) {
  const {siteConfig} = useDocusaurusContext();
  const docsearchConfig = siteConfig.customFields?.docsearch;

  if (!docsearchConfig) {
    return <>{children}</>;
  }

  return (
    <BrowserOnly fallback={<>{children}</>}>
      {() => (
        <DocSearch>
          {children}
          <DocSearchModal
            apiKey={docsearchConfig.apiKey}
            appId={docsearchConfig.appId}
            askAi={docsearchConfig.askAi.assistantId}
            indexName={docsearchConfig.indexName}
          />
          <Sidepanel
            apiKey={docsearchConfig.apiKey}
            appId={docsearchConfig.appId}
            assistantId={docsearchConfig.askAi.assistantId}
            indexName={docsearchConfig.indexName}
            suggestedQuestions={docsearchConfig.askAi.suggestedQuestions}
          />
        </DocSearch>
      )}
    </BrowserOnly>
  );
}
