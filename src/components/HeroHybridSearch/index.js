import BrowserOnly from '@docusaurus/BrowserOnly';
import HybridSearch from './HybridSearch';

export default function HeroHybridSearch() {
  return <BrowserOnly fallback={null}>{() => <HybridSearch />}</BrowserOnly>;
}
