import type { StateCreator } from 'zustand';

export type AppMode = 'free-play' | 'learn' | 'practice';

export interface ModeSlice {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const createModeSlice: StateCreator<ModeSlice> = (set) => ({
  mode: 'free-play',
  setMode: (mode) => set({ mode }),
});
