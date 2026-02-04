import { useMemo } from 'react';
import { useStore } from '../../store';
import { getGroupAccentBeats } from '../../audio/metronomeConstants';
import styles from './BeatIndicator.module.css';

export function BeatIndicator() {
  const currentBeat = useStore((s) => s.currentBeat);
  const beatGrouping = useStore((s) => s.beatGrouping);

  const accentBeats = useMemo(
    () => getGroupAccentBeats(beatGrouping),
    [beatGrouping],
  );

  // Build flat list of beats with group boundary info
  const beats: { index: number; isGroupStart: boolean }[] = [];
  let pos = 0;
  for (let g = 0; g < beatGrouping.length; g++) {
    for (let b = 0; b < beatGrouping[g]; b++) {
      beats.push({ index: pos, isGroupStart: b === 0 && g > 0 });
      pos++;
    }
  }

  return (
    <div className={styles.container}>
      {beats.map(({ index, isGroupStart }) => (
        <div
          key={index}
          className={[
            styles.dot,
            isGroupStart ? styles.groupGap : '',
            accentBeats.has(index) ? styles.dotAccentIdle : '',
            currentBeat === index
              ? index === 0
                ? styles.dotDownbeat
                : accentBeats.has(index)
                  ? styles.dotAccent
                  : styles.dotActive
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      ))}
    </div>
  );
}
