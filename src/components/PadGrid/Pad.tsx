import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PadConfig } from '../../types/pad';
import { PAD_TO_KEY } from '../../constants/keyboard-map';
import { useStore } from '../../store';
import styles from './Pad.module.css';

const COLOR_PALETTE = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
  '#1abc9c', '#3498db', '#9b59b6', '#e91e63',
  '#00bcd4', '#ff5722', '#8bc34a', '#ff9800',
  '#795548', '#607d8b', '#673ab7', '#9c27b0',
];

interface PadProps {
  config: PadConfig;
  isActive: boolean;
  isHighlighted: boolean;
  onTrigger: (padId: number) => void;
}

export function Pad({ config, isActive, isHighlighted, onTrigger }: PadProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<HTMLDivElement>(null);

  const padColor = useStore((s) => s.padColors[config.id]) ?? config.color;
  const setPadColor = useStore((s) => s.setPadColor);

  const disabled = !config.sampleFile;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (disabled || menuOpen) return;
      onTrigger(config.id);
    },
    [config.id, onTrigger, menuOpen, disabled]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setMenuPos({ x: e.clientX, y: e.clientY });
      setMenuOpen(true);
    },
    [disabled]
  );

  const handleColorPick = useCallback(
    (color: string) => {
      setPadColor(config.id, color);
      setMenuOpen(false);
    },
    [config.id, setPadColor]
  );

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleClick);
    return () => window.removeEventListener('pointerdown', handleClick);
  }, [menuOpen]);

  const classNames = [
    styles.pad,
    disabled ? styles.padDisabled : '',
    !disabled && isActive ? styles.padActive : '',
    !disabled && isHighlighted ? styles.padHighlighted : '',
  ]
    .filter(Boolean)
    .join(' ');

  const bgColor = disabled
    ? undefined
    : isActive
      ? padColor
      : `color-mix(in srgb, ${padColor} 60%, #1a1a2e)`;

  return (
    <>
      <div
        ref={padRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={classNames}
        style={disabled ? undefined : {
          backgroundColor: bgColor,
          color: padColor,
          boxShadow: isActive
            ? `0 0 24px 4px ${padColor}80, inset 0 0 20px rgba(255,255,255,0.2)`
            : isHighlighted
              ? `0 0 20px 4px ${padColor}60`
              : `inset 0 -2px 4px rgba(0,0,0,0.3)`,
        }}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
      >
        <span className={styles.padNumber}>{config.id + 1}</span>
        <span className={styles.padName}>{config.shortName}</span>
        <span className={styles.padKey}>{PAD_TO_KEY[config.id]}</span>
      </div>

      {menuOpen && createPortal(
        <div
          ref={menuRef}
          className={styles.colorMenu}
          style={{ top: menuPos.y, left: menuPos.x }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              className={`${styles.colorSwatch} ${padColor === color ? styles.colorSwatchActive : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorPick(color)}
            />
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
