import type { StateCreator } from 'zustand';
import type { Pattern } from '../types/pattern';
import { DEFAULT_PATTERNS } from '../constants/default-patterns';

export interface PatternSlice {
  patterns: Pattern[];
  selectedPattern: Pattern | null;
  isPatternPlaying: boolean;
  currentStep: number;
  selectPattern: (pattern: Pattern) => void;
  setPatternPlaying: (playing: boolean) => void;
  setCurrentStep: (step: number) => void;
  addPattern: (pattern: Pattern) => void;
  updatePattern: (pattern: Pattern) => void;
}

export const createPatternSlice: StateCreator<PatternSlice> = (set) => ({
  patterns: DEFAULT_PATTERNS,
  selectedPattern: null,
  isPatternPlaying: false,
  currentStep: -1,
  selectPattern: (pattern) => set({ selectedPattern: pattern, currentStep: -1 }),
  setPatternPlaying: (playing) =>
    set({ isPatternPlaying: playing, currentStep: playing ? 0 : -1 }),
  setCurrentStep: (step) => set({ currentStep: step }),
  addPattern: (pattern) =>
    set((state) => ({ patterns: [...state.patterns, pattern] })),
  updatePattern: (pattern) =>
    set((state) => ({
      patterns: state.patterns.map((p) => (p.id === pattern.id ? pattern : p)),
    })),
});
