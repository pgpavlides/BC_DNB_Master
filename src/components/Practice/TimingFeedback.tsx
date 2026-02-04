import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import type { TimingGrade } from '../../types/practice';
import styles from './Practice.module.css';

const GRADE_COLORS: Record<TimingGrade, string> = {
  perfect: '#00b894',
  good: '#6c5ce7',
  early: '#fdcb6e',
  late: '#e17055',
  miss: '#d63031',
};

const GRADE_LABELS: Record<TimingGrade, string> = {
  perfect: 'Perfect!',
  good: 'Good',
  early: 'Early',
  late: 'Late',
  miss: 'Miss',
};

export function TimingFeedback() {
  const lastHitResult = useStore((s) => s.lastHitResult);
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (lastHitResult) {
      setVisible(true);
      setKey((k) => k + 1);
      const timeout = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [lastHitResult]);

  if (!visible || !lastHitResult) return null;

  return (
    <div className={styles.feedback}>
      <div
        key={key}
        className={styles.feedbackText}
        style={{ color: GRADE_COLORS[lastHitResult.grade] }}
      >
        {GRADE_LABELS[lastHitResult.grade]}
      </div>
    </div>
  );
}
