import { memo, useCallback } from 'react';
import styles from './PatternEditor.module.css';

interface StepCellProps {
  padId: number;
  step: number;
  active: boolean;
  color: string;
  isPlayhead: boolean;
  onToggle: (padId: number, step: number) => void;
}

export const StepCell = memo(function StepCell({
  padId,
  step,
  active,
  color,
  isPlayhead,
  onToggle,
}: StepCellProps) {
  const handleClick = useCallback(() => {
    onToggle(padId, step);
  }, [padId, step, onToggle]);

  let className = styles.cell;
  if (active) className += ` ${styles.cellActive}`;
  if (isPlayhead) className += ` ${styles.cellPlayhead}`;

  return (
    <button
      className={className}
      style={active ? { background: color } : undefined}
      onClick={handleClick}
      aria-label={`Step ${step + 1}`}
    />
  );
});
