import { useCallback } from 'react';
import { useStore } from '../../store';
import styles from './PatternEditor.module.css';

interface EditorControlsProps {
  onPlay: () => void;
  onStop: () => void;
  onSave: () => void;
  onExportMidi: () => void;
  onImportMidi: () => void;
  isPlaying: boolean;
}

export function EditorControls({ onPlay, onStop, onSave, onExportMidi, onImportMidi, isPlaying }: EditorControlsProps) {
  const name = useStore((s) => s.editorName);
  const bars = useStore((s) => s.editorBars);
  const setName = useStore((s) => s.editorSetName);
  const setBars = useStore((s) => s.editorSetBars);
  const clear = useStore((s) => s.editorClear);
  const setLoaderOpen = useStore((s) => s.editorSetLoaderOpen);

  const handleBarsChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setBars(Number(e.target.value));
    },
    [setBars]
  );

  return (
    <div className={styles.sidebarControls}>
      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>Name</label>
        <input
          type="text"
          className={styles.nameInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pattern name"
        />
      </div>

      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>Bars</label>
        <select
          className={styles.barsSelect}
          value={bars}
          onChange={handleBarsChange}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>

      <div className={styles.controlButtons}>
        <button className={styles.clearBtn} onClick={clear}>
          Clear
        </button>
        <button className={styles.saveBtn} onClick={onSave}>
          Save
        </button>
        <button className={styles.exportBtn} onClick={onExportMidi}>
          Export MIDI
        </button>
        <button className={styles.importBtn} onClick={onImportMidi}>
          Import MIDI
        </button>
      </div>

      <button
        className={styles.loadBtn}
        onClick={() => setLoaderOpen(true)}
      >
        Load Pattern
      </button>

      <div className={styles.transportButtons}>
        <button
          className={`${styles.playBtnLarge} ${isPlaying ? styles.btnDisabled : ''}`}
          onClick={onPlay}
          disabled={isPlaying}
        >
          <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2.5v11l9-5.5L4 2.5z"/>
          </svg>
          Play
        </button>
        <button
          className={`${styles.stopBtnLarge} ${!isPlaying ? styles.btnDisabled : ''}`}
          onClick={onStop}
          disabled={!isPlaying}
        >
          <svg width="24" height="24" viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="2" width="10" height="10" rx="1.5"/>
          </svg>
          Stop
        </button>
      </div>
    </div>
  );
}
