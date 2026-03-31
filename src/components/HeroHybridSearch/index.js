import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {DocSearchButton} from '@docsearch/modal';
import {SidepanelButton} from '@docsearch/sidepanel';

import styles from './styles.module.css';

function HeroHybridSearchFallback() {
  return (
    <div aria-hidden="true" className={styles.hybridSearch}>
      <div className={styles.searchFallback}>
        <span className={styles.searchFallbackLabel}>Search</span>
        <span className={styles.searchFallbackKeys}>Ctrl K</span>
      </div>
      <div className={styles.askAiFallback}>Ask AI</div>
    </div>
  );
}

export default function HeroHybridSearch() {
  const {siteConfig} = useDocusaurusContext();
  const docsearchConfig = siteConfig.customFields?.docsearch;

  if (!docsearchConfig) {
    return null;
  }

  return (
    <BrowserOnly fallback={<HeroHybridSearchFallback />}>
      {() => (
        <div className={styles.hybridSearch}>
          <DocSearchButton
            className={styles.searchButton}
            translations={{
              buttonAriaLabel: 'Search the ChoreHero help center',
              buttonText: 'Search',
            }}
          />
          <SidepanelButton className={styles.askAiButton} />
        </div>
      )}
    </BrowserOnly>
  );
}
