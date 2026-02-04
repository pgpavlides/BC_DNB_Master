import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { audioEngine } from '../../audio/AudioEngine';
import { EDITOR_PAD_ORDER } from '../../utils/step-grid';
import type { Pattern } from '../../types/pattern';
import { StepGrid } from './StepGrid';
import styles from './PatternEditor.module.css';

/**
 * Build a pattern with an event at EVERY possible step for every pad.
 * The actual filtering (which cells are active) happens in the playback callback.
 */
function buildFullPattern(bars: number, bpm: number): Pattern {
  const events: { time: string; padId: number }[] = [];
  const totalSteps = bars * 16;

  for (const padId of EDITOR_PAD_ORDER) {
    for (let i = 0; i < totalSteps; i++) {
      const bar = Math.floor(i / 16);
      const remainder = i % 16;
      const quarter = Math.floor(remainder / 4);
      const sixteenth = remainder % 4;
      events.push({ time: `${bar}:${quarter}:${sixteenth}`, padId });
    }
  }

  return {
    id: '__preview__',
    name: 'Preview',
    category: 'custom',
    bpm,
    timeSignature: [4, 4],
    lengthInBars: bars,
    difficulty: 1,
    events,
  };
}

/** Convert "bars:quarters:sixteenths" back to a step index */
function timeToStep(time: string): number {
  const parts = time.split(':').map(Number);
  return (parts[0] || 0) * 16 + (parts[1] || 0) * 4 + (parts[2] || 0);
}

export function PatternEditor() {
  const isPlaying = useStore((s) => s.editorPreviewPlaying);
  const editorBars = useStore((s) => s.editorBars);
  const bpm = useStore((s) => s.bpm);
  const editorSetPreviewStep = useStore((s) => s.editorSetPreviewStep);

  const rafRef = useRef<number>(0);
  const playStartRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    playStartRef.current = performance.now();

    const totalSteps = editorBars * 16;
    const secondsPerBeat = 60 / bpm;
    const secondsPerStep = secondsPerBeat / 4;
    const patternDurationMs = totalSteps * secondsPerStep * 1000;

    const tick = () => {
      const elapsed = performance.now() - playStartRef.current;
      const loopedMs = elapsed % patternDurationMs;
      const currentStep = Math.floor(loopedMs / (secondsPerStep * 1000)) % totalSteps;
      editorSetPreviewStep(currentStep);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, editorBars, bpm, editorSetPreviewStep]);

  useEffect(() => {
    return () => {
      try { audioEngine.stopPattern(); } catch { /* */ }
    };
  }, []);

  return (
    <div className={styles.editor}>
      <StepGrid />
    </div>
  );
}

export function useEditorActions() {
  const editorBuildPattern = useStore((s) => s.editorBuildPattern);
  const editorSetPreviewPlaying = useStore((s) => s.editorSetPreviewPlaying);
  const editorSetPreviewStep = useStore((s) => s.editorSetPreviewStep);
  const editorBars = useStore((s) => s.editorBars);
  const addPattern = useStore((s) => s.addPattern);
  const updatePattern = useStore((s) => s.updatePattern);
  const patterns = useStore((s) => s.patterns);
  const bpm = useStore((s) => s.bpm);
  const isPlaying = useStore((s) => s.editorPreviewPlaying);

  const handlePlay = useCallback(() => {
    // Check there's at least one active cell
    const grid = useStore.getState().editorGrid;
    let hasAny = false;
    for (const steps of grid.values()) {
      if (steps.some(Boolean)) { hasAny = true; break; }
    }
    if (!hasAny) return;

    try { audioEngine.stopPattern(); } catch { /* */ }

    // Load a full pattern (event at every step for every pad)
    const fullPattern = buildFullPattern(editorBars, bpm);
    audioEngine.loadPattern(fullPattern);

    // The callback reads the LIVE grid state each time an event fires
    audioEngine.onPatternEvent((event) => {
      const liveGrid = useStore.getState().editorGrid;
      const steps = liveGrid.get(event.padId);
      const stepIndex = timeToStep(event.time);
      if (steps && steps[stepIndex]) {
        audioEngine.triggerPad(event.padId);
      }
    });

    audioEngine.startPattern(false);
    editorSetPreviewPlaying(true);
  }, [editorBars, editorSetPreviewPlaying, bpm]);

  // Reload only when bars or bpm change while playing (pattern structure changes)
  useEffect(() => {
    if (!isPlaying) return;

    try { audioEngine.stopPattern(); } catch { /* */ }

    const fullPattern = buildFullPattern(editorBars, bpm);
    audioEngine.loadPattern(fullPattern);

    audioEngine.onPatternEvent((event) => {
      const liveGrid = useStore.getState().editorGrid;
      const steps = liveGrid.get(event.padId);
      const stepIndex = timeToStep(event.time);
      if (steps && steps[stepIndex]) {
        audioEngine.triggerPad(event.padId);
      }
    });

    audioEngine.startPattern(false);
  }, [editorBars, bpm, isPlaying]);

  const handleStop = useCallback(() => {
    try { audioEngine.stopPattern(); } catch { /* */ }
    editorSetPreviewPlaying(false);
    editorSetPreviewStep(-1);
  }, [editorSetPreviewPlaying, editorSetPreviewStep]);

  const handleSave = useCallback(() => {
    const pattern = editorBuildPattern(bpm);
    const existing = patterns.find((p) => p.id === pattern.id);
    if (existing) {
      updatePattern(pattern);
    } else {
      addPattern(pattern);
    }
  }, [editorBuildPattern, bpm, patterns, addPattern, updatePattern]);

  return { handlePlay, handleStop, handleSave, isPlaying };
}
