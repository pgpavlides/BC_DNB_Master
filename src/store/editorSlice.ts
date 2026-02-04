import type { StateCreator } from 'zustand';
import {
  EDITOR_PAD_ORDER,
  createEmptyGrid,
  eventsToStepGrid,
  stepGridToEvents,
  type StepGrid,
} from '../utils/step-grid';
import type { Pattern } from '../types/pattern';
import type { MetronomeSlice } from './metronomeSlice';

export interface EditorSlice {
  editorGrid: StepGrid;
  editorName: string;
  editorBars: number;
  editorPreviewPlaying: boolean;
  editorPreviewStep: number;
  editorLoadedPatternId: string | null;
  editorLoaderOpen: boolean;

  editorToggleStep: (padId: number, step: number) => void;
  editorClear: () => void;
  editorSetName: (name: string) => void;
  editorSetBars: (bars: number) => void;
  editorSetBeatsPerBar: (beatsPerBar: number) => void;
  editorSetPreviewPlaying: (playing: boolean) => void;
  editorSetPreviewStep: (step: number) => void;
  editorLoadPattern: (pattern: Pattern) => void;
  editorBuildPattern: (bpm: number) => Pattern;
  editorSetLoaderOpen: (open: boolean) => void;
}

export const createEditorSlice: StateCreator<
  EditorSlice & MetronomeSlice,
  [],
  [],
  EditorSlice
> = (set, get) => ({
  editorGrid: createEmptyGrid(EDITOR_PAD_ORDER, 16),
  editorName: 'New Pattern',
  editorBars: 1,
  editorPreviewPlaying: false,
  editorPreviewStep: -1,
  editorLoadedPatternId: null,
  editorLoaderOpen: false,

  editorToggleStep: (padId, step) =>
    set((state) => {
      const newGrid: StepGrid = new Map();
      for (const [id, steps] of state.editorGrid) {
        if (id === padId) {
          const newSteps = [...steps];
          newSteps[step] = !newSteps[step];
          newGrid.set(id, newSteps);
        } else {
          newGrid.set(id, steps);
        }
      }
      return { editorGrid: newGrid };
    }),

  editorClear: () => {
    const stepsPerBar = get().beatsPerMeasure * 16 / get().beatNoteValue;
    return set((state) => ({
      editorGrid: createEmptyGrid(EDITOR_PAD_ORDER, state.editorBars * stepsPerBar),
    }));
  },

  editorSetName: (name) => set({ editorName: name }),

  editorSetBars: (bars) => {
    const stepsPerBar = get().beatsPerMeasure * 16 / get().beatNoteValue;
    return set((state) => {
      const oldSteps = state.editorBars * stepsPerBar;
      const newSteps = bars * stepsPerBar;
      const newGrid: StepGrid = new Map();

      for (const [padId, steps] of state.editorGrid) {
        if (newSteps > oldSteps) {
          const expanded = [...steps, ...new Array(newSteps - oldSteps).fill(false)];
          newGrid.set(padId, expanded);
        } else {
          newGrid.set(padId, steps.slice(0, newSteps));
        }
      }

      return { editorBars: bars, editorGrid: newGrid };
    });
  },

  editorSetBeatsPerBar: (beatsPerBar: number) =>
    set((state) => {
      const oldStepsPerBar = Math.round(
        (state.editorGrid.values().next().value?.length ?? 16) / state.editorBars
      );
      const newStepsPerBar = beatsPerBar * 16 / get().beatNoteValue;
      if (oldStepsPerBar === newStepsPerBar) return {};

      const newTotalSteps = state.editorBars * newStepsPerBar;
      const newGrid: StepGrid = new Map();
      for (const [padId] of state.editorGrid) {
        newGrid.set(padId, new Array(newTotalSteps).fill(false));
      }
      return { editorGrid: newGrid };
    }),

  editorSetPreviewPlaying: (playing) =>
    set({ editorPreviewPlaying: playing, editorPreviewStep: playing ? 0 : -1 }),

  editorSetPreviewStep: (step) => set({ editorPreviewStep: step }),

  editorLoadPattern: (pattern) =>
    set(() => {
      const bars = pattern.lengthInBars;
      const grid = eventsToStepGrid(
        pattern.events,
        EDITOR_PAD_ORDER,
        bars,
        pattern.timeSignature[0],
        pattern.timeSignature[1]
      );
      return {
        editorGrid: grid,
        editorName: pattern.name,
        editorBars: bars,
        editorPreviewPlaying: false,
        editorPreviewStep: -1,
        editorLoadedPatternId: pattern.id,
        editorLoaderOpen: false,
      };
    }),

  editorBuildPattern: (bpm: number) => {
    const state = get();
    const beatsPerMeasure = state.beatsPerMeasure;
    const beatNoteValue = state.beatNoteValue;
    const events = stepGridToEvents(state.editorGrid, state.editorBars, beatsPerMeasure, beatNoteValue);
    return {
      id: state.editorLoadedPatternId || crypto.randomUUID(),
      name: state.editorName,
      category: 'custom',
      bpm,
      timeSignature: [beatsPerMeasure, beatNoteValue] as [number, number],
      lengthInBars: state.editorBars,
      difficulty: 1,
      events,
    };
  },

  editorSetLoaderOpen: (open) => set({ editorLoaderOpen: open }),
});
