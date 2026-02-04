import { useCallback } from 'react';
import { PAD_CONFIGS } from '../../constants/pad-config';
import { useStore } from '../../store';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { usePadTrigger } from '../../hooks/usePadTrigger';
import { useTimingAnalysis } from '../../hooks/useTimingAnalysis';
import { Pad } from './Pad';
import styles from './PadGrid.module.css';

export function PadGrid() {
  const activePads = useStore((s) => s.activePads);
  const highlightedPads = useStore((s) => s.highlightedPads);
  const mode = useStore((s) => s.mode);
  const isPracticing = useStore((s) => s.isPracticing);
  const { trigger, release } = usePadTrigger();
  const { analyzeHit } = useTimingAnalysis();

  const handleTrigger = useCallback(
    (padId: number) => {
      trigger(padId);
      if (mode === 'practice' && isPracticing) {
        analyzeHit(padId);
      }
    },
    [trigger, mode, isPracticing, analyzeHit]
  );

  useKeyboardInput(handleTrigger, release);

  // Arrange pads: row 3 (top) first, row 0 (bottom) last for visual display
  const sortedPads = [...PAD_CONFIGS].sort((a, b) => {
    if (a.row !== b.row) return b.row - a.row; // higher rows first
    return a.col - b.col;
  });

  return (
    <div className={styles.grid}>
      {sortedPads.map((padConfig) => (
        <Pad
          key={padConfig.id}
          config={padConfig}
          isActive={activePads.has(padConfig.id)}
          isHighlighted={highlightedPads.has(padConfig.id)}
          onTrigger={handleTrigger}
        />
      ))}
    </div>
  );
}
