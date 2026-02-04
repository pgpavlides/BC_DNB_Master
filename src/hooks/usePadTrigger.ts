import { useCallback, useRef } from 'react';
import { audioEngine } from '../audio/AudioEngine';
import { useStore } from '../store';

export function usePadTrigger() {
  const triggerPad = useStore((s) => s.triggerPad);
  const releasePad = useStore((s) => s.releasePad);
  const setAudioInitialized = useStore((s) => s.setAudioInitialized);
  const timeoutRefs = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const initPromise = useRef<Promise<void> | null>(null);

  const ensureAudio = useCallback(async () => {
    if (audioEngine.isInitialized()) return;
    if (!initPromise.current) {
      initPromise.current = audioEngine.init().then(() => {
        setAudioInitialized(true);
      });
    }
    await initPromise.current;
  }, [setAudioInitialized]);

  const trigger = useCallback(
    (padId: number) => {
      // Show visual feedback immediately
      triggerPad(padId);

      const existing = timeoutRefs.current.get(padId);
      if (existing) clearTimeout(existing);

      const timeout = setTimeout(() => {
        releasePad(padId);
        timeoutRefs.current.delete(padId);
      }, 120);
      timeoutRefs.current.set(padId, timeout);

      // Init audio on first interaction, then play
      ensureAudio().then(() => {
        audioEngine.triggerPad(padId);
      });
    },
    [triggerPad, releasePad, ensureAudio]
  );

  const release = useCallback(
    (padId: number) => {
      const existing = timeoutRefs.current.get(padId);
      if (existing) {
        clearTimeout(existing);
        timeoutRefs.current.delete(padId);
      }
      releasePad(padId);
    },
    [releasePad]
  );

  return { trigger, release };
}
