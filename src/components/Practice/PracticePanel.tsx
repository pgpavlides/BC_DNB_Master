import { useCallback, useRef, useEffect } from 'react';
import { audioEngine } from '../../audio/AudioEngine';
import { useStore } from '../../store';
import styles from './Practice.module.css';

export function PracticePanel() {
  const selectedPattern = useStore((s) => s.selectedPattern);
  const isPracticing = useStore((s) => s.isPracticing);
  const startPractice = useStore((s) => s.startPractice);
  const stopPractice = useStore((s) => s.stopPractice);
  const resetStats = useStore((s) => s.resetStats);
  const practiceStats = useStore((s) => s.practiceStats);
  const setPatternPlaying = useStore((s) => s.setPatternPlaying);
  const clearAllHighlights = useStore((s) => s.clearAllHighlights);
  const highlightPad = useStore((s) => s.highlightPad);
  const clearHighlight = useStore((s) => s.clearHighlight);
  const setBpm = useStore((s) => s.setBpm);
  const setMetronomeRunning = useStore((s) => s.setMetronomeRunning);
  const setCurrentBeat = useStore((s) => s.setCurrentBeat);
  const animRef = useRef(false);

  const handleToggle = useCallback(() => {
    if (!selectedPattern) return;

    if (isPracticing) {
      audioEngine.stopPattern();
      audioEngine.stopMetronome();
      setPatternPlaying(false);
      setMetronomeRunning(false);
      clearAllHighlights();
      stopPractice();
      animRef.current = false;
    } else {
      // Start practice: load pattern, start metronome, but don't play sounds
      audioEngine.loadPattern(selectedPattern);

      // Highlight pads on events but don't play sounds
      audioEngine.onPatternEvent((event) => {
        highlightPad(event.padId);
        setTimeout(() => clearHighlight(event.padId), 200);
      });

      setBpm(selectedPattern.bpm);

      // Start metronome
      audioEngine.onMetronomeBeat((beat) => {
        setCurrentBeat(beat);
      });
      audioEngine.startMetronome(selectedPattern.bpm, selectedPattern.timeSignature[0]);
      setMetronomeRunning(true);

      // Start pattern (no audio playback)
      audioEngine.startPattern(false);
      setPatternPlaying(true);
      startPractice();
      animRef.current = true;
    }
  }, [
    selectedPattern,
    isPracticing,
    setPatternPlaying,
    clearAllHighlights,
    highlightPad,
    clearHighlight,
    startPractice,
    stopPractice,
    setBpm,
    setMetronomeRunning,
    setCurrentBeat,
  ]);

  useEffect(() => {
    return () => {
      animRef.current = false;
    };
  }, []);

  if (!selectedPattern) {
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>Practice</span>
        </div>
        <div className={styles.noPattern}>Select a pattern to practice</div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Practice</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{practiceStats.accuracyPercent}%</div>
          <div className={styles.statLabel}>Accuracy</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{practiceStats.currentStreak}</div>
          <div className={styles.statLabel}>Streak</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{practiceStats.bestStreak}</div>
          <div className={styles.statLabel}>Best</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{practiceStats.totalHits}</div>
          <div className={styles.statLabel}>Total Hits</div>
        </div>
      </div>

      <div className={styles.grades}>
        <span className={`${styles.grade} ${styles.gradePerfect}`}>
          Perfect: {practiceStats.perfectCount}
        </span>
        <span className={`${styles.grade} ${styles.gradeGood}`}>
          Good: {practiceStats.goodCount}
        </span>
        <span className={`${styles.grade} ${styles.gradeEarly}`}>
          Early: {practiceStats.earlyCount}
        </span>
        <span className={`${styles.grade} ${styles.gradeLate}`}>
          Late: {practiceStats.lateCount}
        </span>
        <span className={`${styles.grade} ${styles.gradeMiss}`}>
          Miss: {practiceStats.missCount}
        </span>
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${isPracticing ? styles.btnActive : ''}`}
          onClick={handleToggle}
        >
          {isPracticing ? 'Stop Practice' : 'Start Practice'}
        </button>
        {!isPracticing && practiceStats.totalHits > 0 && (
          <button className={styles.btn} onClick={resetStats}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
