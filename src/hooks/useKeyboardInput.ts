import { useEffect, useRef } from 'react';
import { KEYBOARD_TO_PAD } from '../constants/keyboard-map';
import { PAD_CONFIGS } from '../constants/pad-config';

const DISABLED_PADS = new Set(
  PAD_CONFIGS.filter((p) => !p.sampleFile).map((p) => p.id)
);

export function useKeyboardInput(
  onPadTrigger: (padId: number) => void,
  onPadRelease: (padId: number) => void
) {
  const pressedKeys = useRef(new Set<string>());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      const padId = KEYBOARD_TO_PAD[key];
      if (padId !== undefined && !DISABLED_PADS.has(padId) && !pressedKeys.current.has(key)) {
        pressedKeys.current.add(key);
        onPadTrigger(padId);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const padId = KEYBOARD_TO_PAD[key];
      if (padId !== undefined && !DISABLED_PADS.has(padId)) {
        pressedKeys.current.delete(key);
        onPadRelease(padId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onPadTrigger, onPadRelease]);
}
