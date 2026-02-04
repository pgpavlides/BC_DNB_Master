import type { StateCreator } from 'zustand';

export interface AudioSlice {
  isAudioInitialized: boolean;
  isLoading: boolean;
  setAudioInitialized: (initialized: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const createAudioSlice: StateCreator<AudioSlice> = (set) => ({
  isAudioInitialized: false,
  isLoading: false,
  setAudioInitialized: (initialized) => set({ isAudioInitialized: initialized }),
  setLoading: (loading) => set({ isLoading: loading }),
});
