import { useCallback, useEffect, useRef, useState } from 'react';
import { audioEngine } from '../../audio/AudioEngine';
import {
  TIME_SIG_OPTIONS,
  getDefaultGrouping,
  formatGrouping,
} from '../../audio/metronomeConstants';
import { useStore } from '../../store';
import { BeatIndicator } from './BeatIndicator';
import styles from './MetronomeControls.module.css';

const PRESET_LABELS: Record<string, string> = {
  classic: 'Classic',
  woodblock: 'Wood Block',
  hihat: 'Hi-Hat',
  cowbell: 'Cowbell',
  beep: 'Beep',
};

const PRESET_KEYS = Object.keys(PRESET_LABELS);

export function MetronomeControls() {
  const bpm = useStore((s) => s.bpm);
  const setBpm = useStore((s) => s.setBpm);
  const isRunning = useStore((s) => s.isMetronomeRunning);
  const setCurrentBeat = useStore((s) => s.setCurrentBeat);
  const beatsPerMeasure = useStore((s) => s.beatsPerMeasure);
  const setBeatsPerMeasure = useStore((s) => s.setBeatsPerMeasure);
  const beatNoteValue = useStore((s) => s.beatNoteValue);
  const setBeatNoteValue = useStore((s) => s.setBeatNoteValue);
  const beatGrouping = useStore((s) => s.beatGrouping);
  const setBeatGrouping = useStore((s) => s.setBeatGrouping);
  const metronomeVolume = useStore((s) => s.metronomeVolume);
  const setMetronomeVolume = useStore((s) => s.setMetronomeVolume);
  const metronomePreset = useStore((s) => s.metronomePreset);
  const setMetronomePreset = useStore((s) => s.setMetronomePreset);
  const isMetronomeMuted = useStore((s) => s.isMetronomeMuted);
  const setMetronomeMuted = useStore((s) => s.setMetronomeMuted);
  const editorSetBeatsPerBar = useStore((s) => s.editorSetBeatsPerBar);

  const [timeSigOpen, setTimeSigOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tapTimes = useRef<number[]>([]);

  // Close popup on outside click
  useEffect(() => {
    if (!timeSigOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setTimeSigOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [timeSigOpen]);

  const restartMetronome = useCallback(
    (num: number, den: number, grp: number[]) => {
      if (isRunning) {
        audioEngine.stopMetronome();
        audioEngine.onMetronomeBeat((beat) => setCurrentBeat(beat));
        audioEngine.startMetronome(bpm, num, metronomePreset, metronomeVolume, den, grp);
      }
    },
    [isRunning, bpm, metronomePreset, metronomeVolume, setCurrentBeat],
  );

  const handleMuteToggle = useCallback(() => {
    if (isMetronomeMuted) {
      audioEngine.unmuteMetronome();
      setMetronomeMuted(false);
    } else {
      audioEngine.muteMetronome();
      setMetronomeMuted(true);
    }
  }, [isMetronomeMuted, setMetronomeMuted]);

  const handleBpmChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newBpm = Number(e.target.value);
      setBpm(newBpm);
      if (isRunning) audioEngine.setMetronomeBpm(newBpm);
    },
    [setBpm, isRunning],
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const vol = Number(e.target.value);
      setMetronomeVolume(vol);
      audioEngine.setMetronomeVolume(vol);
    },
    [setMetronomeVolume],
  );

  const handlePresetChange = useCallback(
    (preset: string) => {
      setMetronomePreset(preset);
      audioEngine.setMetronomePreset(preset);
    },
    [setMetronomePreset],
  );

  const handleTimeSigSelect = useCallback(
    (num: number, den: number) => {
      const defaultGrp = getDefaultGrouping(num, den);
      setBeatsPerMeasure(num);
      setBeatNoteValue(den);
      setBeatGrouping(defaultGrp);
      editorSetBeatsPerBar(num);
      restartMetronome(num, den, defaultGrp);
    },
    [setBeatsPerMeasure, setBeatNoteValue, setBeatGrouping, editorSetBeatsPerBar, restartMetronome],
  );

  const handleGroupingSelect = useCallback(
    (grp: number[]) => {
      setBeatGrouping(grp);
      restartMetronome(beatsPerMeasure, beatNoteValue, grp);
    },
    [beatsPerMeasure, beatNoteValue, setBeatGrouping, restartMetronome],
  );

  const handleTapTempo = useCallback(() => {
    const now = performance.now();
    tapTimes.current.push(now);
    if (tapTimes.current.length > 4) tapTimes.current = tapTimes.current.slice(-4);

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
      if (isRunning) audioEngine.setMetronomeBpm(clampedBpm);
    }
  }, [setBpm, isRunning]);

  // Find current sig's grouping options
  const currentSigOption = TIME_SIG_OPTIONS.find(
    (o) => o.sig[0] === beatsPerMeasure && o.sig[1] === beatNoteValue,
  );

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
          className={`${styles.muteBtn} ${isMetronomeMuted ? styles.muteBtnActive : ''}`}
          onClick={handleMuteToggle}
        >
          {isMetronomeMuted ? 'Unmute' : 'Mute'}
        </button>
        <button className={styles.tapBtn} onClick={handleTapTempo}>
          Tap
        </button>

        {/* Time signature trigger */}
        <div className={styles.timeSigAnchor}>
          <button
            ref={triggerRef}
            className={styles.timeSigTrigger}
            onClick={() => setTimeSigOpen((o) => !o)}
          >
            <span className={styles.timeSigTriggerNum}>{beatsPerMeasure}</span>
            <span className={styles.timeSigTriggerDiv} />
            <span className={styles.timeSigTriggerDen}>{beatNoteValue}</span>
          </button>

          {timeSigOpen && (
            <div ref={popupRef} className={styles.timeSigPopup}>
              <div className={styles.popupSection}>
                <span className={styles.popupLabel}>Time Signature</span>
                <div className={styles.popupSigRow}>
                  {TIME_SIG_OPTIONS.map(({ sig: [num, den] }) => (
                    <button
                      key={`${num}/${den}`}
                      className={`${styles.popupSigBtn} ${
                        beatsPerMeasure === num && beatNoteValue === den
                          ? styles.popupSigBtnActive
                          : ''
                      }`}
                      onClick={() => handleTimeSigSelect(num, den)}
                    >
                      <span className={styles.popupSigNum}>{num}</span>
                      <span className={styles.popupSigDiv} />
                      <span className={styles.popupSigDen}>{den}</span>
                    </button>
                  ))}
                </div>
              </div>

              {currentSigOption && currentSigOption.groupings.length > 1 && (
                <div className={styles.popupSection}>
                  <span className={styles.popupLabel}>Grouping</span>
                  <div className={styles.popupGroupRow}>
                    {currentSigOption.groupings.map((grp) => {
                      const key = grp.join(',');
                      const isActive = beatGrouping.join(',') === key;
                      return (
                        <button
                          key={key}
                          className={`${styles.popupGroupBtn} ${
                            isActive ? styles.popupGroupBtnActive : ''
                          }`}
                          onClick={() => handleGroupingSelect(grp)}
                        >
                          {formatGrouping(grp)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.volumeGroup}>
        <span className={styles.volumeLabel}>Vol</span>
        <input
          type="range"
          min={0}
          max={100}
          value={metronomeVolume}
          onChange={handleVolumeChange}
          className={styles.volumeSlider}
        />
        <span className={styles.volumeValue}>{metronomeVolume}</span>
      </div>

      <div className={styles.presetGroup}>
        <span className={styles.presetLabel}>Sound</span>
        <div className={styles.presetRow}>
          {PRESET_KEYS.map((key) => (
            <button
              key={key}
              className={`${styles.presetBtn} ${metronomePreset === key ? styles.presetBtnActive : ''}`}
              onClick={() => handlePresetChange(key)}
            >
              {PRESET_LABELS[key]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
