import type { Pattern } from '../types/pattern';

export const DEFAULT_PATTERNS: Pattern[] = [
  {
    id: 'basic-rock',
    name: 'Basic Rock Beat',
    category: 'rock',
    bpm: 100,
    timeSignature: [4, 4],
    lengthInBars: 1,
    difficulty: 1,
    events: [
      // Beat 1: kick + hi-hat
      { time: '0:0:0', padId: 0 },
      { time: '0:0:0', padId: 7 },
      // &: hi-hat
      { time: '0:0:2', padId: 7 },
      // Beat 2: snare + hi-hat
      { time: '0:1:0', padId: 1 },
      { time: '0:1:0', padId: 7 },
      // &: hi-hat
      { time: '0:1:2', padId: 7 },
      // Beat 3: kick + hi-hat
      { time: '0:2:0', padId: 0 },
      { time: '0:2:0', padId: 7 },
      // &: hi-hat
      { time: '0:2:2', padId: 7 },
      // Beat 4: snare + hi-hat
      { time: '0:3:0', padId: 1 },
      { time: '0:3:0', padId: 7 },
      // &: hi-hat
      { time: '0:3:2', padId: 7 },
    ],
  },
  {
    id: 'boom-bap',
    name: 'Boom Bap',
    category: 'hip-hop',
    bpm: 90,
    timeSignature: [4, 4],
    lengthInBars: 1,
    difficulty: 2,
    events: [
      // Beat 1: kick + hi-hat
      { time: '0:0:0', padId: 0 },
      { time: '0:0:0', padId: 7 },
      { time: '0:0:2', padId: 7 },
      // Beat 2: snare + hi-hat
      { time: '0:1:0', padId: 1 },
      { time: '0:1:0', padId: 7 },
      { time: '0:1:2', padId: 7 },
      // Beat 3: kick (syncopated) + hi-hat
      { time: '0:2:0', padId: 7 },
      { time: '0:2:2', padId: 0 },
      { time: '0:2:2', padId: 7 },
      // Beat 4: snare + hi-hat
      { time: '0:3:0', padId: 1 },
      { time: '0:3:0', padId: 7 },
      { time: '0:3:2', padId: 7 },
    ],
  },
  {
    id: 'trap-hihats',
    name: 'Trap Hi-Hats',
    category: 'trap',
    bpm: 140,
    timeSignature: [4, 4],
    lengthInBars: 1,
    difficulty: 3,
    events: [
      // Kick pattern
      { time: '0:0:0', padId: 0 },
      { time: '0:2:2', padId: 0 },
      // Snare on 2 and 4
      { time: '0:1:0', padId: 1 },
      { time: '0:3:0', padId: 1 },
      // Fast hi-hats (16th notes)
      { time: '0:0:0', padId: 7 },
      { time: '0:0:1', padId: 7 },
      { time: '0:0:2', padId: 7 },
      { time: '0:0:3', padId: 7 },
      { time: '0:1:0', padId: 7 },
      { time: '0:1:1', padId: 7 },
      { time: '0:1:2', padId: 7 },
      { time: '0:1:3', padId: 7 },
      { time: '0:2:0', padId: 7 },
      { time: '0:2:1', padId: 7 },
      { time: '0:2:2', padId: 7 },
      { time: '0:2:3', padId: 7 },
      { time: '0:3:0', padId: 7 },
      { time: '0:3:1', padId: 7 },
      { time: '0:3:2', padId: 7 },
      { time: '0:3:3', padId: 7 },
      // Open hat accent
      { time: '0:1:2', padId: 11 },
      { time: '0:3:2', padId: 11 },
    ],
  },
  {
    id: 'four-on-floor',
    name: 'Four on the Floor',
    category: 'house',
    bpm: 120,
    timeSignature: [4, 4],
    lengthInBars: 1,
    difficulty: 1,
    events: [
      // Kick on every beat
      { time: '0:0:0', padId: 0 },
      { time: '0:1:0', padId: 0 },
      { time: '0:2:0', padId: 0 },
      { time: '0:3:0', padId: 0 },
      // Hi-hat on off-beats
      { time: '0:0:2', padId: 7 },
      { time: '0:1:2', padId: 7 },
      { time: '0:2:2', padId: 7 },
      { time: '0:3:2', padId: 7 },
      // Clap on 2 and 4
      { time: '0:1:0', padId: 2 },
      { time: '0:3:0', padId: 2 },
    ],
  },
  {
    id: 'bossa-nova',
    name: 'Bossa Nova',
    category: 'latin',
    bpm: 110,
    timeSignature: [4, 4],
    lengthInBars: 2,
    difficulty: 3,
    events: [
      // Bar 1
      { time: '0:0:0', padId: 0 },
      { time: '0:0:0', padId: 7 },
      { time: '0:0:2', padId: 7 },
      { time: '0:1:0', padId: 3 },
      { time: '0:1:0', padId: 7 },
      { time: '0:1:2', padId: 7 },
      { time: '0:2:0', padId: 7 },
      { time: '0:2:2', padId: 0 },
      { time: '0:2:2', padId: 7 },
      { time: '0:3:0', padId: 3 },
      { time: '0:3:0', padId: 7 },
      { time: '0:3:2', padId: 7 },
      // Bar 2
      { time: '1:0:0', padId: 0 },
      { time: '1:0:0', padId: 7 },
      { time: '1:0:2', padId: 7 },
      { time: '1:1:0', padId: 3 },
      { time: '1:1:0', padId: 7 },
      { time: '1:1:2', padId: 7 },
      { time: '1:2:0', padId: 0 },
      { time: '1:2:0', padId: 7 },
      { time: '1:2:2', padId: 7 },
      { time: '1:3:0', padId: 3 },
      { time: '1:3:0', padId: 7 },
      { time: '1:3:2', padId: 7 },
    ],
  },
  {
    id: 'shuffle',
    name: 'Shuffle',
    category: 'blues',
    bpm: 95,
    timeSignature: [4, 4],
    lengthInBars: 1,
    difficulty: 2,
    events: [
      // Shuffle feel: beat + last triplet position (approximated with 16ths)
      { time: '0:0:0', padId: 0 },
      { time: '0:0:0', padId: 7 },
      { time: '0:0:3', padId: 7 },
      { time: '0:1:0', padId: 1 },
      { time: '0:1:0', padId: 7 },
      { time: '0:1:3', padId: 7 },
      { time: '0:2:0', padId: 0 },
      { time: '0:2:0', padId: 7 },
      { time: '0:2:3', padId: 7 },
      { time: '0:3:0', padId: 1 },
      { time: '0:3:0', padId: 7 },
      { time: '0:3:3', padId: 7 },
    ],
  },
  {
    id: 'funky-drummer',
    name: 'Funky Drummer',
    category: 'funk',
    bpm: 100,
    timeSignature: [4, 4],
    lengthInBars: 1,
    difficulty: 4,
    events: [
      // Kick
      { time: '0:0:0', padId: 0 },
      { time: '0:1:2', padId: 0 },
      { time: '0:2:0', padId: 0 },
      { time: '0:3:2', padId: 0 },
      // Snare
      { time: '0:1:0', padId: 1 },
      { time: '0:3:0', padId: 1 },
      // Ghost snares
      { time: '0:0:2', padId: 3 },
      { time: '0:2:2', padId: 3 },
      { time: '0:2:3', padId: 3 },
      // Hi-hat
      { time: '0:0:0', padId: 7 },
      { time: '0:0:2', padId: 7 },
      { time: '0:1:0', padId: 7 },
      { time: '0:1:2', padId: 7 },
      { time: '0:2:0', padId: 7 },
      { time: '0:2:2', padId: 7 },
      { time: '0:3:0', padId: 7 },
      { time: '0:3:2', padId: 7 },
    ],
  },
  {
    id: 'drum-and-bass',
    name: 'Drum & Bass',
    category: 'electronic',
    bpm: 174,
    timeSignature: [4, 4],
    lengthInBars: 1,
    difficulty: 4,
    events: [
      // Kick
      { time: '0:0:0', padId: 0 },
      { time: '0:2:2', padId: 0 },
      // Snare
      { time: '0:1:0', padId: 1 },
      { time: '0:3:0', padId: 1 },
      // Fast hi-hats
      { time: '0:0:0', padId: 7 },
      { time: '0:0:2', padId: 7 },
      { time: '0:1:0', padId: 7 },
      { time: '0:1:2', padId: 7 },
      { time: '0:2:0', padId: 7 },
      { time: '0:2:2', padId: 7 },
      { time: '0:3:0', padId: 7 },
      { time: '0:3:2', padId: 7 },
      // Extra kick hits for DnB flavor
      { time: '0:0:3', padId: 0 },
      { time: '0:3:2', padId: 0 },
    ],
  },
  {
    id: 'jazz-ride',
    name: 'Jazz Ride',
    category: 'jazz',
    bpm: 130,
    timeSignature: [4, 4],
    lengthInBars: 1,
    difficulty: 3,
    events: [
      // Ride cymbal pattern (swing feel)
      { time: '0:0:0', padId: 14 },
      { time: '0:0:3', padId: 14 },
      { time: '0:1:0', padId: 14 },
      { time: '0:1:3', padId: 14 },
      { time: '0:2:0', padId: 14 },
      { time: '0:2:3', padId: 14 },
      { time: '0:3:0', padId: 14 },
      { time: '0:3:3', padId: 14 },
      // Hi-hat foot on 2 and 4
      { time: '0:1:0', padId: 7 },
      { time: '0:3:0', padId: 7 },
      // Kick (sparse)
      { time: '0:0:0', padId: 0 },
      { time: '0:2:2', padId: 0 },
    ],
  },
  {
    id: 'half-time',
    name: 'Half-Time',
    category: 'rock',
    bpm: 85,
    timeSignature: [4, 4],
    lengthInBars: 1,
    difficulty: 1,
    events: [
      // Kick on 1
      { time: '0:0:0', padId: 0 },
      // Snare on 3
      { time: '0:2:0', padId: 1 },
      // Hi-hat 8ths
      { time: '0:0:0', padId: 7 },
      { time: '0:0:2', padId: 7 },
      { time: '0:1:0', padId: 7 },
      { time: '0:1:2', padId: 7 },
      { time: '0:2:0', padId: 7 },
      { time: '0:2:2', padId: 7 },
      { time: '0:3:0', padId: 7 },
      { time: '0:3:2', padId: 7 },
    ],
  },
];
