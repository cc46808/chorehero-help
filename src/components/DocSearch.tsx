import { DocSearch } from '@docsearch/react';
import '@docsearch/css';

export default function DocSearchComponent() {
  return (
    <DocSearch
      appId="HVCACK97MH"
      apiKey="b79c2f7cdecacea1edc9696d03e1c07a"
      indexName="ChoreHero"
      askAi={
        // @ts-expect-error — askAi is a runtime-valid DocSearch v4 option
        {
          assistantId: 'tWomB3HjvuYi',
          suggestedQuestions: true,
          sidePanel: {
            variant: 'inline',
            pushSelector: '#docsearch-sidepanel-offset-anchor',
          },
        }
      }
    />
  );
}
