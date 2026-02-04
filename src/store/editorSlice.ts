import type { StateCreator } from 'zustand';
import {
  EDITOR_PAD_ORDER,
  createEmptyGrid,
  eventsToStepGrid,
  stepGridToEvents,
  type StepGrid,
} from '../utils/step-grid';
import type { Pattern } from '../types/pattern';

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
  editorSetPreviewPlaying: (playing: boolean) => void;
  editorSetPreviewStep: (step: number) => void;
  editorLoadPattern: (pattern: Pattern) => void;
  editorBuildPattern: (bpm: number) => Pattern;
  editorSetLoaderOpen: (open: boolean) => void;
}

export const createEditorSlice: StateCreator<EditorSlice> = (set, get) => ({
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

  editorClear: () =>
    set((state) => ({
      editorGrid: createEmptyGrid(EDITOR_PAD_ORDER, state.editorBars * 16),
    })),

  editorSetName: (name) => set({ editorName: name }),

  editorSetBars: (bars) =>
    set((state) => {
      const oldSteps = state.editorBars * 16;
      const newSteps = bars * 16;
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
        pattern.timeSignature[0]
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
    const events = stepGridToEvents(state.editorGrid, state.editorBars);
    return {
      id: state.editorLoadedPatternId || crypto.randomUUID(),
      name: state.editorName,
      category: 'custom',
      bpm,
      timeSignature: [4, 4] as [number, number],
      lengthInBars: state.editorBars,
      difficulty: 1,
      events,
    };
  },

  editorSetLoaderOpen: (open) => set({ editorLoaderOpen: open }),
});
