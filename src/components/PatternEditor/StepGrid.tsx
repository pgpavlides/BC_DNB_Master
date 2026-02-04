import { useCallback } from 'react';
import { useStore } from '../../store';
import { EDITOR_PAD_ORDER } from '../../utils/step-grid';
import { getPadById } from '../../constants/pad-config';
import { StepCell } from './StepCell';
import styles from './PatternEditor.module.css';

export function StepGrid() {
  const grid = useStore((s) => s.editorGrid);
  const bars = useStore((s) => s.editorBars);
  const previewStep = useStore((s) => s.editorPreviewStep);
  const toggleStep = useStore((s) => s.editorToggleStep);
  const beatsPerMeasure = useStore((s) => s.beatsPerMeasure);
  const beatNoteValue = useStore((s) => s.beatNoteValue);

  const stepsPerBar = beatsPerMeasure * 16 / beatNoteValue;
  const totalSteps = bars * stepsPerBar;

  const handleToggle = useCallback(
    (padId: number, step: number) => {
      toggleStep(padId, step);
    },
    [toggleStep]
  );

  // Build beat markers (column numbers header)
  const beatMarkers: React.ReactNode[] = [];
  // Empty cell for the label column
  beatMarkers.push(<div key="label-spacer" className={styles.labelSpacer} />);
  for (let i = 0; i < totalSteps; i++) {
    const isBeatStart = i % 4 === 0;
    const isBarStart = i % stepsPerBar === 0;
    let markerClass = styles.beatMarker;
    if (isBarStart) markerClass += ` ${styles.beatMarkerBar}`;
    else if (isBeatStart) markerClass += ` ${styles.beatMarkerBeat}`;

    beatMarkers.push(
      <div key={`marker-${i}`} className={markerClass}>
        {isBeatStart ? Math.floor((i % stepsPerBar) / 4) + 1 : ''}
      </div>
    );
  }

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.beatMarkerRow}>{beatMarkers}</div>
      <div className={styles.grid}>
        {EDITOR_PAD_ORDER.map((padId) => {
          const pad = getPadById(padId);
          if (!pad) return null;
          const steps = grid.get(padId);
          if (!steps) return null;

          return (
            <div key={padId} className={styles.gridRow}>
              <div
                className={styles.padLabel}
                style={{ borderLeftColor: pad.color }}
              >
                {pad.shortName}
              </div>
              {Array.from({ length: totalSteps }, (_, i) => (
                <StepCell
                  key={i}
                  padId={padId}
                  step={i}
                  active={steps[i] || false}
                  color={pad.color}
                  isPlayhead={previewStep === i}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
