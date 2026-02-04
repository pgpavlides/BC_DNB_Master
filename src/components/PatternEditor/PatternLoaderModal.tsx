import { useStore } from '../../store';
import styles from './PatternEditor.module.css';

export function PatternLoaderModal() {
  const patterns = useStore((s) => s.patterns);
  const editorLoadedPatternId = useStore((s) => s.editorLoadedPatternId);
  const editorLoadPattern = useStore((s) => s.editorLoadPattern);
  const setLoaderOpen = useStore((s) => s.editorSetLoaderOpen);

  const customPatterns = patterns.filter((p) => p.category === 'custom');
  const builtInPatterns = patterns.filter((p) => p.category !== 'custom');

  return (
    <div className={styles.modalOverlay} onClick={() => setLoaderOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Load Pattern</span>
          <button
            className={styles.modalClose}
            onClick={() => setLoaderOpen(false)}
          >
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {customPatterns.length > 0 && (
            <div className={styles.loaderGroup}>
              <div className={styles.loaderGroupLabel}>Custom</div>
              {customPatterns.map((p) => (
                <button
                  key={p.id}
                  className={`${styles.loaderItem} ${
                    editorLoadedPatternId === p.id ? styles.loaderItemActive : ''
                  }`}
                  onClick={() => editorLoadPattern(p)}
                >
                  <span>{p.name}</span>
                  <span className={styles.loaderItemMeta}>
                    {p.bpm} BPM &middot; {p.lengthInBars} bar{p.lengthInBars > 1 ? 's' : ''}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className={styles.loaderGroup}>
            <div className={styles.loaderGroupLabel}>Built-in</div>
            {builtInPatterns.map((p) => (
              <button
                key={p.id}
                className={`${styles.loaderItem} ${
                  editorLoadedPatternId === p.id ? styles.loaderItemActive : ''
                }`}
                onClick={() => editorLoadPattern(p)}
              >
                <span>{p.name}</span>
                <span className={styles.loaderItemMeta}>
                  {p.bpm} BPM &middot; {p.lengthInBars} bar{p.lengthInBars > 1 ? 's' : ''}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
