import { useCallback } from 'react';
import { audioEngine } from '../audio/AudioEngine';
import { useStore } from '../store';

export function useAudioEngine() {
  const setAudioInitialized = useStore((s) => s.setAudioInitialized);
  const setLoading = useStore((s) => s.setLoading);

  const initAudio = useCallback(async () => {
    setLoading(true);
    try {
      await audioEngine.init();
      setAudioInitialized(true);
    } catch (err) {
      console.error('Failed to initialize audio:', err);
    } finally {
      setLoading(false);
    }
  }, [setAudioInitialized, setLoading]);

  return { initAudio };
}
