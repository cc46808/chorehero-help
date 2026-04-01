import { DocSearch } from '@docsearch/react';
import '@docsearch/css';

const appId = 'HVCACK97MH';
const apiKey = 'b79c2f7cdecacea1edc9696d03e1c07a';
const indexName = 'ChoreHero';
const assistantId = 'tWomB3HjvuYi';

export default function DocSearchComponent() {
  return (
    <DocSearch
      appId={appId}
      apiKey={apiKey}
      indexName={indexName}
      askAi={{ assistantId, suggestedQuestions: true }}
    />
  );
}
