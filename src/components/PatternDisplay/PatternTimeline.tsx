import { useCallback, useEffect, useRef, useState } from 'react';
import { audioEngine } from '../../audio/AudioEngine';
import { useStore } from '../../store';
import { PAD_CONFIGS } from '../../constants/pad-config';
import styles from './PatternTimeline.module.css';

export function PatternTimeline() {
  const selectedPattern = useStore((s) => s.selectedPattern);
  const isPatternPlaying = useStore((s) => s.isPatternPlaying);
  const setPatternPlaying = useStore((s) => s.setPatternPlaying);
  const highlightPad = useStore((s) => s.highlightPad);
  const clearHighlight = useStore((s) => s.clearHighlight);
  const clearAllHighlights = useStore((s) => s.clearAllHighlights);
  const mode = useStore((s) => s.mode);
  const setBpm = useStore((s) => s.setBpm);
  const [cursorPos, setCursorPos] = useState(0);
  const [activeSteps, setActiveSteps] = useState(new Set<number>());
  const animFrameRef = useRef<number>(0);

  const handleTogglePlay = useCallback(() => {
    if (!selectedPattern) return;

    if (isPatternPlaying) {
      audioEngine.stopPattern();
      setPatternPlaying(false);
      clearAllHighlights();
      setCursorPos(0);
      setActiveSteps(new Set());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      audioEngine.loadPattern(selectedPattern);

      if (mode === 'learn') {
        // In learn mode, play sounds and highlight pads
        audioEngine.onPatternEvent((event) => {
          audioEngine.triggerPad(event.padId);
          highlightPad(event.padId);
          setTimeout(() => clearHighlight(event.padId), 200);

          setActiveSteps((prev) => {
            const next = new Set(prev);
            const idx = selectedPattern.events.findIndex(
              (e) => e.time === event.time && e.padId === event.padId
            );
            if (idx >= 0) next.add(idx);
            setTimeout(() => {
              setActiveSteps((p) => {
                const n = new Set(p);
                n.delete(idx);
                return n;
              });
            }, 200);
            return next;
          });
        });
      }

      setBpm(selectedPattern.bpm);
      audioEngine.startPattern(mode === 'learn');
      setPatternPlaying(true);

      // Animate cursor
      const updateCursor = () => {
        if (!audioEngine.isPlaying()) return;
        const pos = audioEngine.getTransportPosition();
        const bpmVal = selectedPattern.bpm;
        const secondsPerBeat = 60 / bpmVal;
        const totalSeconds =
          secondsPerBeat * selectedPattern.timeSignature[0] * selectedPattern.lengthInBars;
        const normalizedPos = (pos % totalSeconds) / totalSeconds;
        setCursorPos(normalizedPos * 100);
        animFrameRef.current = requestAnimationFrame(updateCursor);
      };
      animFrameRef.current = requestAnimationFrame(updateCursor);
    }
  }, [
    selectedPattern,
    isPatternPlaying,
    setPatternPlaying,
    clearAllHighlights,
    highlightPad,
    clearHighlight,
    mode,
    setBpm,
  ]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!selectedPattern) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>Pattern</span>
        </div>
        <div className={styles.empty}>Select a pattern from the library</div>
      </div>
    );
  }

  // Calculate event positions on timeline
  const totalSixteenths =
    selectedPattern.lengthInBars * selectedPattern.timeSignature[0] * 4;

  const eventPositions = selectedPattern.events.map((event) => {
    const parts = event.time.split(':').map(Number);
    const sixteenths =
      parts[0] * selectedPattern.timeSignature[0] * 4 + parts[1] * 4 + parts[2];
    const x = (sixteenths / totalSixteenths) * 100;

    const padConfig = PAD_CONFIGS.find((p) => p.id === event.padId);
    // Y position based on pad row (inverted for visual)
    const y = padConfig ? ((3 - padConfig.row) / 3) * 60 + 20 : 50;

    return { x, y, color: padConfig?.color ?? '#fff' };
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Pattern</span>
        <span className={styles.patternName}>{selectedPattern.name}</span>
      </div>

      <div className={styles.timeline}>
        {eventPositions.map((pos, i) => (
          <div
            key={i}
            className={`${styles.step} ${activeSteps.has(i) ? styles.stepActive : ''}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              backgroundColor: pos.color,
              color: pos.color,
            }}
          />
        ))}
        {isPatternPlaying && (
          <div className={styles.cursor} style={{ left: `${cursorPos}%` }} />
        )}
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${isPatternPlaying ? styles.btnActive : ''}`}
          onClick={handleTogglePlay}
        >
          {isPatternPlaying ? 'Stop' : 'Play'}
        </button>
      </div>
    </div>
  );
}
