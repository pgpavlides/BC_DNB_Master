import { useStore } from '../../store';
import styles from './BeatIndicator.module.css';

export function BeatIndicator() {
  const currentBeat = useStore((s) => s.currentBeat);
  const beatsPerMeasure = useStore((s) => s.beatsPerMeasure);

  return (
    <div className={styles.container}>
      {Array.from({ length: beatsPerMeasure }, (_, i) => (
        <div
          key={i}
          className={[
            styles.dot,
            currentBeat === i
              ? i === 0
                ? styles.dotDownbeat
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
