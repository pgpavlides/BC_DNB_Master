import type { StateCreator } from 'zustand';

export interface MetronomeSlice {
  bpm: number;
  isMetronomeRunning: boolean;
  currentBeat: number;
  beatsPerMeasure: number;
  setBpm: (bpm: number) => void;
  setMetronomeRunning: (running: boolean) => void;
  setCurrentBeat: (beat: number) => void;
  setBeatsPerMeasure: (beats: number) => void;
}

export const createMetronomeSlice: StateCreator<MetronomeSlice> = (set) => ({
  bpm: 120,
  isMetronomeRunning: false,
  currentBeat: -1,
  beatsPerMeasure: 4,
  setBpm: (bpm) => set({ bpm }),
  setMetronomeRunning: (running) =>
    set({ isMetronomeRunning: running, currentBeat: running ? 0 : -1 }),
  setCurrentBeat: (beat) => set({ currentBeat: beat }),
  setBeatsPerMeasure: (beats) => set({ beatsPerMeasure: beats }),
});
