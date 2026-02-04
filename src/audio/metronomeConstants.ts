/**
 * Shared metronome constants — no Tone.js dependency so they can be
 * statically imported by UI components without pulling in the audio lib.
 */

export interface MetronomePresetConfig {
  oscillatorType: string;
  envelope: { attack: number; decay: number; sustain: number; release: number };
  downbeatNote: string;
  accentNote: string;
  offbeatNote: string;
  downbeatVelocity: number;
  accentVelocity: number;
  offbeatVelocity: number;
}

export const METRONOME_PRESETS: Record<string, MetronomePresetConfig> = {
  classic: {
    oscillatorType: 'triangle',
    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 },
    downbeatNote: 'C6',
    accentNote: 'G5',
    offbeatNote: 'C5',
    downbeatVelocity: 0.8,
    accentVelocity: 0.6,
    offbeatVelocity: 0.35,
  },
  woodblock: {
    oscillatorType: 'square',
    envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.02 },
    downbeatNote: 'G5',
    accentNote: 'D5',
    offbeatNote: 'G4',
    downbeatVelocity: 0.9,
    accentVelocity: 0.7,
    offbeatVelocity: 0.4,
  },
  hihat: {
    oscillatorType: 'square',
    envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.01 },
    downbeatNote: 'C7',
    accentNote: 'C7',
    offbeatNote: 'C7',
    downbeatVelocity: 0.7,
    accentVelocity: 0.55,
    offbeatVelocity: 0.3,
  },
  cowbell: {
    oscillatorType: 'square',
    envelope: { attack: 0.001, decay: 0.15, sustain: 0.02, release: 0.1 },
    downbeatNote: 'A5',
    accentNote: 'E5',
    offbeatNote: 'A4',
    downbeatVelocity: 0.85,
    accentVelocity: 0.65,
    offbeatVelocity: 0.4,
  },
  beep: {
    oscillatorType: 'sine',
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 },
    downbeatNote: 'E6',
    accentNote: 'B5',
    offbeatNote: 'E5',
    downbeatVelocity: 0.8,
    accentVelocity: 0.6,
    offbeatVelocity: 0.35,
  },
};

export interface TimeSigOption {
  sig: [number, number];
  groupings: number[][];
}

/**
 * Available time signatures with their possible beat groupings.
 * The first grouping in each list is the default.
 */
export const TIME_SIG_OPTIONS: TimeSigOption[] = [
  { sig: [4, 4], groupings: [[4], [2, 2]] },
  { sig: [3, 4], groupings: [[3]] },
  { sig: [5, 4], groupings: [[3, 2], [2, 3]] },
  { sig: [6, 8], groupings: [[3, 3], [2, 2, 2]] },
  { sig: [7, 8], groupings: [[2, 2, 3], [3, 2, 2], [2, 3, 2]] },
  { sig: [8, 8], groupings: [[3, 3, 2], [3, 2, 3], [2, 3, 3]] },
];

/** Get the default grouping for a time signature key like "7/8" */
export function getDefaultGrouping(numerator: number, denominator: number): number[] {
  const opt = TIME_SIG_OPTIONS.find(
    (o) => o.sig[0] === numerator && o.sig[1] === denominator,
  );
  return opt ? opt.groupings[0] : [numerator];
}

/** Get the set of beat positions that start a sub-group (excluding beat 0). */
export function getGroupAccentBeats(grouping: number[]): Set<number> {
  const accents = new Set<number>();
  let pos = 0;
  for (const size of grouping) {
    if (pos > 0) accents.add(pos);
    pos += size;
  }
  return accents;
}

/** Format a grouping array for display, e.g. [2,2,3] → "2+2+3" */
export function formatGrouping(grouping: number[]): string {
  return grouping.join('+');
}
