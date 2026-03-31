import SearchBar from '@theme/SearchBar';
import styles from './HybridSearch.module.css';

export default function HybridSearch() {
  return (
    <div className={styles.searchShell}>
      <SearchBar />
    </div>
  );
}