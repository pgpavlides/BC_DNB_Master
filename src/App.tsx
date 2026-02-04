import { useState, useCallback } from 'react';
import { useStore } from './store';
import { PadGrid } from './components/PadGrid/PadGrid';
import { MetronomeControls } from './components/Metronome/MetronomeControls';
import { ModeSelector } from './components/ModeSelector/ModeSelector';
import { PatternTimeline } from './components/PatternDisplay/PatternTimeline';
import { PatternLibrary } from './components/PatternLibrary/PatternLibrary';
import { PracticePanel } from './components/Practice/PracticePanel';
import { TimingFeedback } from './components/Practice/TimingFeedback';
import { PatternEditor, useEditorActions } from './components/PatternEditor/PatternEditor';
import { EditorControls } from './components/PatternEditor/EditorControls';
import { PatternLoaderModal } from './components/PatternEditor/PatternLoaderModal';
import { SplashScreen } from './components/SplashScreen/SplashScreen';
import styles from './components/Layout/Layout.module.css';

const SKIP_SPLASH = import.meta.env.VITE_SKIP_SPLASH === 'true';

export default function App() {
  const mode = useStore((s) => s.mode);
  const editorLoaderOpen = useStore((s) => s.editorLoaderOpen);
  const editorActions = useEditorActions();
  const [splashDone, setSplashDone] = useState(SKIP_SPLASH);

  const handleSplashEnter = useCallback(() => setSplashDone(true), []);

  if (!splashDone) {
    return <SplashScreen onEnter={handleSplashEnter} />;
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.4"/>
            </svg>
          </div>
          <div>
            <div className={styles.logoText}>Finger Drummer</div>
            <div className={styles.logoSub}>Drum Pad Trainer</div>
          </div>
        </div>
        <ModeSelector />
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarTitle}>Metronome</div>
            <MetronomeControls />
          </div>

          {mode === 'pattern' && (
            <div className={styles.sidebarSectionFill}>
              <div className={styles.sidebarTitle}>Pattern Editor</div>
              <EditorControls
                onPlay={editorActions.handlePlay}
                onStop={editorActions.handleStop}
                onSave={editorActions.handleSave}
                isPlaying={editorActions.isPlaying}
              />
            </div>
          )}

          {(mode === 'learn' || mode === 'practice') && (
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarTitle}>Patterns</div>
              <PatternLibrary />
            </div>
          )}
        </aside>

        <main className={styles.main}>
          {mode === 'pattern' ? (
            <div className={styles.mainContentFull}>
              <PatternEditor />
            </div>
          ) : (
            <div className={styles.mainContent}>
              <PadGrid />

              {(mode === 'learn' || mode === 'practice') && <PatternTimeline />}

              {mode === 'practice' && <PracticePanel />}
            </div>
          )}
        </main>
      </div>

      {mode === 'practice' && <TimingFeedback />}
      {mode === 'pattern' && editorLoaderOpen && <PatternLoaderModal />}
    </div>
  );
}
