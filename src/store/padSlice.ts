import type { StateCreator } from 'zustand';

export interface PadSlice {
  activePads: Set<number>;
  highlightedPads: Set<number>;
  padColors: Record<number, string>;
  triggerPad: (padId: number) => void;
  releasePad: (padId: number) => void;
  highlightPad: (padId: number) => void;
  clearHighlight: (padId: number) => void;
  clearAllHighlights: () => void;
  setPadColor: (padId: number, color: string) => void;
}

export const createPadSlice: StateCreator<PadSlice> = (set) => ({
  activePads: new Set<number>(),
  highlightedPads: new Set<number>(),
  padColors: {},
  triggerPad: (padId) =>
    set((state) => {
      const next = new Set(state.activePads);
      next.add(padId);
      return { activePads: next };
    }),
  releasePad: (padId) =>
    set((state) => {
      const next = new Set(state.activePads);
      next.delete(padId);
      return { activePads: next };
    }),
  highlightPad: (padId) =>
    set((state) => {
      const next = new Set(state.highlightedPads);
      next.add(padId);
      return { highlightedPads: next };
    }),
  clearHighlight: (padId) =>
    set((state) => {
      const next = new Set(state.highlightedPads);
      next.delete(padId);
      return { highlightedPads: next };
    }),
  clearAllHighlights: () => set({ highlightedPads: new Set() }),
  setPadColor: (padId, color) =>
    set((state) => ({
      padColors: { ...state.padColors, [padId]: color },
    })),
});
