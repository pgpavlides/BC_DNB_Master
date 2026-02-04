import type { StateCreator } from 'zustand';

export interface MetronomeSlice {
  bpm: number;
  isMetronomeRunning: boolean;
  currentBeat: number;
  beatsPerMeasure: number;
  beatNoteValue: number;
  beatGrouping: number[];
  metronomeVolume: number;
  metronomePreset: string;
  isMetronomeMuted: boolean;
  setBpm: (bpm: number) => void;
  setMetronomeRunning: (running: boolean) => void;
  setCurrentBeat: (beat: number) => void;
  setBeatsPerMeasure: (beats: number) => void;
  setBeatNoteValue: (val: number) => void;
  setBeatGrouping: (grouping: number[]) => void;
  setMetronomeVolume: (vol: number) => void;
  setMetronomePreset: (preset: string) => void;
  setMetronomeMuted: (muted: boolean) => void;
}

export const createMetronomeSlice: StateCreator<MetronomeSlice> = (set) => ({
  bpm: 120,
  isMetronomeRunning: false,
  currentBeat: -1,
  beatsPerMeasure: 4,
  beatNoteValue: 4,
  beatGrouping: [4],
  metronomeVolume: 70,
  metronomePreset: 'classic',
  isMetronomeMuted: false,
  setBpm: (bpm) => set({ bpm }),
  setMetronomeRunning: (running) =>
    set({ isMetronomeRunning: running, currentBeat: running ? 0 : -1 }),
  setCurrentBeat: (beat) => set({ currentBeat: beat }),
  setBeatsPerMeasure: (beats) => set({ beatsPerMeasure: beats }),
  setBeatNoteValue: (val) => set({ beatNoteValue: val }),
  setBeatGrouping: (grouping) => set({ beatGrouping: grouping }),
  setMetronomeVolume: (vol) => set({ metronomeVolume: vol }),
  setMetronomePreset: (preset) => set({ metronomePreset: preset }),
  setMetronomeMuted: (muted) => set({ isMetronomeMuted: muted }),
});
