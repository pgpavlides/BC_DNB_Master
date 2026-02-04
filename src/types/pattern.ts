export interface PatternEvent {
  time: string; // Tone.js time notation: 'bars:quarters:sixteenths'
  padId: number;
}

export interface Pattern {
  id: string;
  name: string;
  category: string;
  bpm: number;
  timeSignature: [number, number];
  lengthInBars: number;
  difficulty: number; // 1-5
  events: PatternEvent[];
}
