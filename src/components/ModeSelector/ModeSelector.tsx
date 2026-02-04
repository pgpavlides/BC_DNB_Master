import { useCallback } from 'react';
import { useStore } from '../../store';
import type { AppMode } from '../../store/modeSlice';
import { audioEngine } from '../../audio/AudioEngine';
import styles from './ModeSelector.module.css';

const MODES: { id: AppMode; label: string }[] = [
  { id: 'free-play', label: 'Free Play' },
  { id: 'learn', label: 'Learn' },
  { id: 'practice', label: 'Practice' },
  { id: 'pattern', label: 'Pattern' },
];

export function ModeSelector() {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const setPatternPlaying = useStore((s) => s.setPatternPlaying);
  const stopPractice = useStore((s) => s.stopPractice);
  const clearAllHighlights = useStore((s) => s.clearAllHighlights);
  const setMetronomeRunning = useStore((s) => s.setMetronomeRunning);

  const handleModeChange = useCallback(
    (newMode: AppMode) => {
      if (newMode === mode) return;

      // Clean up current mode
      audioEngine.stopPattern();
      audioEngine.stopMetronome();
      setPatternPlaying(false);
      setMetronomeRunning(false);
      clearAllHighlights();
      stopPractice();

      setMode(newMode);
    },
    [mode, setMode, setPatternPlaying, clearAllHighlights, stopPractice, setMetronomeRunning]
  );

  return (
    <div className={styles.container}>
      {MODES.map((m) => (
        <button
          key={m.id}
          className={`${styles.tab} ${mode === m.id ? styles.tabActive : ''}`}
          onClick={() => handleModeChange(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
