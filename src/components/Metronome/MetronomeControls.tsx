import { useCallback, useRef } from 'react';
import { audioEngine } from '../../audio/AudioEngine';
import { useStore } from '../../store';
import { BeatIndicator } from './BeatIndicator';
import styles from './MetronomeControls.module.css';

export function MetronomeControls() {
  const bpm = useStore((s) => s.bpm);
  const setBpm = useStore((s) => s.setBpm);
  const isRunning = useStore((s) => s.isMetronomeRunning);
  const setRunning = useStore((s) => s.setMetronomeRunning);
  const setCurrentBeat = useStore((s) => s.setCurrentBeat);
  const beatsPerMeasure = useStore((s) => s.beatsPerMeasure);

  const tapTimes = useRef<number[]>([]);

  const handleToggle = useCallback(() => {
    if (isRunning) {
      audioEngine.stopMetronome();
      setRunning(false);
    } else {
      audioEngine.onMetronomeBeat((beat) => {
        setCurrentBeat(beat);
      });
      audioEngine.startMetronome(bpm, beatsPerMeasure);
      setRunning(true);
    }
  }, [isRunning, bpm, beatsPerMeasure, setRunning, setCurrentBeat]);

  const handleBpmChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newBpm = Number(e.target.value);
      setBpm(newBpm);
      if (isRunning) {
        audioEngine.setMetronomeBpm(newBpm);
      }
    },
    [setBpm, isRunning]
  );

  const handleTapTempo = useCallback(() => {
    const now = performance.now();
    tapTimes.current.push(now);

    // Keep last 4 taps
    if (tapTimes.current.length > 4) {
      tapTimes.current = tapTimes.current.slice(-4);
    }

    // Reset if gap > 2s
    if (tapTimes.current.length >= 2) {
      const last = tapTimes.current[tapTimes.current.length - 1];
      const prev = tapTimes.current[tapTimes.current.length - 2];
      if (last - prev > 2000) {
        tapTimes.current = [now];
        return;
      }
    }

    if (tapTimes.current.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < tapTimes.current.length; i++) {
        intervals.push(tapTimes.current[i] - tapTimes.current[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const tapBpm = Math.round(60000 / avgInterval);
      const clampedBpm = Math.max(40, Math.min(300, tapBpm));
      setBpm(clampedBpm);
      if (isRunning) {
        audioEngine.setMetronomeBpm(clampedBpm);
      }
    }
  }, [setBpm, isRunning]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Metronome</span>
        <div className={styles.bpmDisplay}>
          <span className={styles.bpmValue}>{bpm}</span>
          <span className={styles.bpmLabel}>BPM</span>
        </div>
      </div>

      <BeatIndicator />

      <input
        type="range"
        min={40}
        max={300}
        value={bpm}
        onChange={handleBpmChange}
        className={styles.slider}
      />

      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${isRunning ? styles.btnActive : ''}`}
          onClick={handleToggle}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button className={styles.tapBtn} onClick={handleTapTempo}>
          Tap
        </button>
      </div>
    </div>
  );
}
