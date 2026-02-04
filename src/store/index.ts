import { create } from 'zustand';
import type { AudioSlice } from './audioSlice';
import { createAudioSlice } from './audioSlice';
import type { PadSlice } from './padSlice';
import { createPadSlice } from './padSlice';
import type { MetronomeSlice } from './metronomeSlice';
import { createMetronomeSlice } from './metronomeSlice';
import type { ModeSlice } from './modeSlice';
import { createModeSlice } from './modeSlice';
import type { PatternSlice } from './patternSlice';
import { createPatternSlice } from './patternSlice';
import type { PracticeSlice } from './practiceSlice';
import { createPracticeSlice } from './practiceSlice';
import type { EditorSlice } from './editorSlice';
import { createEditorSlice } from './editorSlice';

export type AppStore = AudioSlice &
  PadSlice &
  MetronomeSlice &
  ModeSlice &
  PatternSlice &
  PracticeSlice &
  EditorSlice;

export const useStore = create<AppStore>()((...a) => ({
  ...createAudioSlice(...a),
  ...createPadSlice(...a),
  ...createMetronomeSlice(...a),
  ...createModeSlice(...a),
  ...createPatternSlice(...a),
  ...createPracticeSlice(...a),
  ...createEditorSlice(...a),
}));
