/**
 * Hybrid Mode: Modal + Sidepanel working together.
 *
 * When both Modal and Sidepanel are rendered inside the same
 * <DocSearch> context, Hybrid Mode is enabled automatically.
 * Ask AI actions from the Modal transition into the Sidepanel.
 *
 * NOTE: Hybrid Mode is React-only. JS does not support it yet.
 */
import {DocSearch} from '@docsearch/core';
import {DocSearchButton, DocSearchModal} from '@docsearch/modal';
import {SidepanelButton, Sidepanel} from '@docsearch/sidepanel';

import '@docsearch/css/dist/style.css';
import '@docsearch/css/dist/sidepanel.css';

function HybridSearch() {
  return (
    <DocSearch>
      <DocSearchButton />
      <DocSearchModal
        indexName="ChoreHero"
        appId="HVCACK97MH"
        apiKey="b79c2f7cdecacea1edc9696d03e1c07a"
        askAi="tWomB3HjvuYi"
      />
      <SidepanelButton />
      <Sidepanel
        indexName="ChoreHero"
        appId="HVCACK97MH"
        apiKey="b79c2f7cdecacea1edc9696d03e1c07a"
        assistantId="tWomB3HjvuYi"
        suggestedQuestions={true}
      />
    </DocSearch>
  );
}

export default HybridSearch;
