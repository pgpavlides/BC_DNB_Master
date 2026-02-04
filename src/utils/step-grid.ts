import type { PatternEvent } from '../types/pattern';

// Pad IDs that have samples loaded (active pads)
export const ACTIVE_PAD_IDS = [15, 14, 10, 7, 11, 9, 6, 2, 1, 0] as const;

// Editor row order: hats top, snares middle, kicks bottom
export const EDITOR_PAD_ORDER: readonly number[] = ACTIVE_PAD_IDS;

export type StepGrid = Map<number, boolean[]>;

export function createEmptyGrid(
  padIds: readonly number[],
  totalSteps: number
): StepGrid {
  const grid: StepGrid = new Map();
  for (const id of padIds) {
    grid.set(id, new Array(totalSteps).fill(false));
  }
  return grid;
}

/**
 * Convert a StepGrid into PatternEvent[] using Tone.js time notation.
 * Each step is a 16th note: "bars:quarters:sixteenths"
 */
export function stepGridToEvents(
  grid: StepGrid,
  bars: number,
  beatsPerBar = 4
): PatternEvent[] {
  const events: PatternEvent[] = [];
  const stepsPerBeat = 4; // 16th-note resolution
  const stepsPerBar = beatsPerBar * stepsPerBeat;
  const totalSteps = bars * stepsPerBar;

  for (const [padId, steps] of grid) {
    for (let i = 0; i < Math.min(steps.length, totalSteps); i++) {
      if (!steps[i]) continue;

      const bar = Math.floor(i / stepsPerBar);
      const remainder = i % stepsPerBar;
      const quarter = Math.floor(remainder / stepsPerBeat);
      const sixteenth = remainder % stepsPerBeat;

      events.push({
        time: `${bar}:${quarter}:${sixteenth}`,
        padId,
      });
    }
  }

  return events;
}

/**
 * Convert PatternEvent[] back into a StepGrid.
 */
export function eventsToStepGrid(
  events: PatternEvent[],
  padIds: readonly number[],
  bars: number,
  beatsPerBar = 4
): StepGrid {
  const stepsPerBeat = 4;
  const stepsPerBar = beatsPerBar * stepsPerBeat;
  const totalSteps = bars * stepsPerBar;
  const grid = createEmptyGrid(padIds, totalSteps);

  for (const event of events) {
    if (!grid.has(event.padId)) continue;

    const parts = event.time.split(':').map(Number);
    const bar = parts[0] || 0;
    const quarter = parts[1] || 0;
    const sixteenth = parts[2] || 0;

    const stepIndex = bar * stepsPerBar + quarter * stepsPerBeat + sixteenth;
    if (stepIndex < totalSteps) {
      grid.get(event.padId)![stepIndex] = true;
    }
  }

  return grid;
}
