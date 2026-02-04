import { useCallback } from 'react';
import { useStore } from '../../store';
import type { Pattern } from '../../types/pattern';
import { audioEngine } from '../../audio/AudioEngine';
import styles from './PatternLibrary.module.css';

function PatternCard({
  pattern,
  isSelected,
  onSelect,
}: {
  pattern: Pattern;
  isSelected: boolean;
  onSelect: (p: Pattern) => void;
}) {
  return (
    <button
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={() => onSelect(pattern)}
    >
      <div className={styles.cardInfo}>
        <div className={styles.cardName}>{pattern.name}</div>
        <div className={styles.cardMeta}>
          {pattern.bpm} BPM &middot; {pattern.category}
        </div>
      </div>
      <div className={styles.difficulty}>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={`${styles.diffDot} ${i < pattern.difficulty ? styles.diffDotFilled : ''}`}
          />
        ))}
      </div>
    </button>
  );
}

export function PatternLibrary() {
  const patterns = useStore((s) => s.patterns);
  const selectedPattern = useStore((s) => s.selectedPattern);
  const selectPattern = useStore((s) => s.selectPattern);
  const isPatternPlaying = useStore((s) => s.isPatternPlaying);
  const setPatternPlaying = useStore((s) => s.setPatternPlaying);
  const clearAllHighlights = useStore((s) => s.clearAllHighlights);

  const handleSelect = useCallback(
    (pattern: Pattern) => {
      if (isPatternPlaying) {
        audioEngine.stopPattern();
        setPatternPlaying(false);
        clearAllHighlights();
      }
      selectPattern(pattern);
    },
    [selectPattern, isPatternPlaying, setPatternPlaying, clearAllHighlights]
  );

  // Group by category
  const categories = new Map<string, Pattern[]>();
  patterns.forEach((p) => {
    const list = categories.get(p.category) || [];
    list.push(p);
    categories.set(p.category, list);
  });

  return (
    <div className={styles.container}>
      {Array.from(categories.entries()).map(([category, pats]) => (
        <div key={category}>
          <div className={styles.sectionTitle}>{category}</div>
          {pats.map((pattern) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              isSelected={selectedPattern?.id === pattern.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
