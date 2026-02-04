import type { Pattern } from '../types/pattern';

// Pad ID mapping for squid_dnb_samples:
//   0  = squid bass kick 3
//   1  = squid bass kick 2
//   2  = squid bass kick
//   6  = squid kick        (main kick)
//   7  = squid ghost snare  (ghost notes)
//   9  = squid snare 2      (snare accent / clap substitute)
//  10  = squid hat 1        (closed hi-hat)
//  11  = squid snare 1      (main snare)
//  14  = squid hat 2        (open hat / accent)
//  15  = squid hat 3        (ride-like / hat variant)

const KICK = 6;
const BASS_KICK = 0;
const SNARE = 11;
const SNARE2 = 9;
const GHOST = 7;
const HAT = 10;
const OPEN_HAT = 14;
const HAT3 = 15;

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
      { time: '0:0:0', padId: KICK },
      { time: '0:0:0', padId: HAT },
      // &: hi-hat
      { time: '0:0:2', padId: HAT },
      // Beat 2: snare + hi-hat
      { time: '0:1:0', padId: SNARE },
      { time: '0:1:0', padId: HAT },
      // &: hi-hat
      { time: '0:1:2', padId: HAT },
      // Beat 3: kick + hi-hat
      { time: '0:2:0', padId: KICK },
      { time: '0:2:0', padId: HAT },
      // &: hi-hat
      { time: '0:2:2', padId: HAT },
      // Beat 4: snare + hi-hat
      { time: '0:3:0', padId: SNARE },
      { time: '0:3:0', padId: HAT },
      // &: hi-hat
      { time: '0:3:2', padId: HAT },
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
      { time: '0:0:0', padId: KICK },
      { time: '0:0:0', padId: HAT },
      { time: '0:0:2', padId: HAT },
      // Beat 2: snare + hi-hat
      { time: '0:1:0', padId: SNARE },
      { time: '0:1:0', padId: HAT },
      { time: '0:1:2', padId: HAT },
      // Beat 3: kick (syncopated) + hi-hat
      { time: '0:2:0', padId: HAT },
      { time: '0:2:2', padId: KICK },
      { time: '0:2:2', padId: HAT },
      // Beat 4: snare + hi-hat
      { time: '0:3:0', padId: SNARE },
      { time: '0:3:0', padId: HAT },
      { time: '0:3:2', padId: HAT },
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
      { time: '0:0:0', padId: KICK },
      { time: '0:2:2', padId: KICK },
      // Snare on 2 and 4
      { time: '0:1:0', padId: SNARE },
      { time: '0:3:0', padId: SNARE },
      // Fast hi-hats (16th notes)
      { time: '0:0:0', padId: HAT },
      { time: '0:0:1', padId: HAT },
      { time: '0:0:2', padId: HAT },
      { time: '0:0:3', padId: HAT },
      { time: '0:1:0', padId: HAT },
      { time: '0:1:1', padId: HAT },
      { time: '0:1:2', padId: HAT },
      { time: '0:1:3', padId: HAT },
      { time: '0:2:0', padId: HAT },
      { time: '0:2:1', padId: HAT },
      { time: '0:2:2', padId: HAT },
      { time: '0:2:3', padId: HAT },
      { time: '0:3:0', padId: HAT },
      { time: '0:3:1', padId: HAT },
      { time: '0:3:2', padId: HAT },
      { time: '0:3:3', padId: HAT },
      // Open hat accent
      { time: '0:1:2', padId: OPEN_HAT },
      { time: '0:3:2', padId: OPEN_HAT },
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
      { time: '0:0:0', padId: KICK },
      { time: '0:1:0', padId: KICK },
      { time: '0:2:0', padId: KICK },
      { time: '0:3:0', padId: KICK },
      // Hi-hat on off-beats
      { time: '0:0:2', padId: HAT },
      { time: '0:1:2', padId: HAT },
      { time: '0:2:2', padId: HAT },
      { time: '0:3:2', padId: HAT },
      // Snare on 2 and 4
      { time: '0:1:0', padId: SNARE },
      { time: '0:3:0', padId: SNARE },
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
      { time: '0:0:0', padId: KICK },
      { time: '0:0:0', padId: HAT },
      { time: '0:0:2', padId: HAT },
      { time: '0:1:0', padId: SNARE2 },
      { time: '0:1:0', padId: HAT },
      { time: '0:1:2', padId: HAT },
      { time: '0:2:0', padId: HAT },
      { time: '0:2:2', padId: KICK },
      { time: '0:2:2', padId: HAT },
      { time: '0:3:0', padId: SNARE2 },
      { time: '0:3:0', padId: HAT },
      { time: '0:3:2', padId: HAT },
      // Bar 2
      { time: '1:0:0', padId: KICK },
      { time: '1:0:0', padId: HAT },
      { time: '1:0:2', padId: HAT },
      { time: '1:1:0', padId: SNARE2 },
      { time: '1:1:0', padId: HAT },
      { time: '1:1:2', padId: HAT },
      { time: '1:2:0', padId: KICK },
      { time: '1:2:0', padId: HAT },
      { time: '1:2:2', padId: HAT },
      { time: '1:3:0', padId: SNARE2 },
      { time: '1:3:0', padId: HAT },
      { time: '1:3:2', padId: HAT },
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
      // Shuffle feel: beat + last triplet position
      { time: '0:0:0', padId: KICK },
      { time: '0:0:0', padId: HAT },
      { time: '0:0:3', padId: HAT },
      { time: '0:1:0', padId: SNARE },
      { time: '0:1:0', padId: HAT },
      { time: '0:1:3', padId: HAT },
      { time: '0:2:0', padId: KICK },
      { time: '0:2:0', padId: HAT },
      { time: '0:2:3', padId: HAT },
      { time: '0:3:0', padId: SNARE },
      { time: '0:3:0', padId: HAT },
      { time: '0:3:3', padId: HAT },
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
      { time: '0:0:0', padId: KICK },
      { time: '0:1:2', padId: KICK },
      { time: '0:2:0', padId: KICK },
      { time: '0:3:2', padId: KICK },
      // Snare
      { time: '0:1:0', padId: SNARE },
      { time: '0:3:0', padId: SNARE },
      // Ghost snares
      { time: '0:0:2', padId: GHOST },
      { time: '0:2:2', padId: GHOST },
      { time: '0:2:3', padId: GHOST },
      // Hi-hat
      { time: '0:0:0', padId: HAT },
      { time: '0:0:2', padId: HAT },
      { time: '0:1:0', padId: HAT },
      { time: '0:1:2', padId: HAT },
      { time: '0:2:0', padId: HAT },
      { time: '0:2:2', padId: HAT },
      { time: '0:3:0', padId: HAT },
      { time: '0:3:2', padId: HAT },
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
      { time: '0:0:0', padId: BASS_KICK },
      { time: '0:2:2', padId: BASS_KICK },
      // Snare
      { time: '0:1:0', padId: SNARE },
      { time: '0:3:0', padId: SNARE },
      // Fast hi-hats
      { time: '0:0:0', padId: HAT },
      { time: '0:0:2', padId: HAT },
      { time: '0:1:0', padId: HAT },
      { time: '0:1:2', padId: HAT },
      { time: '0:2:0', padId: HAT },
      { time: '0:2:2', padId: HAT },
      { time: '0:3:0', padId: HAT },
      { time: '0:3:2', padId: HAT },
      // Extra kick hits for DnB flavor
      { time: '0:0:3', padId: BASS_KICK },
      { time: '0:3:2', padId: KICK },
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
      // Ride cymbal pattern (swing feel) — using hat 3 as ride
      { time: '0:0:0', padId: HAT3 },
      { time: '0:0:3', padId: HAT3 },
      { time: '0:1:0', padId: HAT3 },
      { time: '0:1:3', padId: HAT3 },
      { time: '0:2:0', padId: HAT3 },
      { time: '0:2:3', padId: HAT3 },
      { time: '0:3:0', padId: HAT3 },
      { time: '0:3:3', padId: HAT3 },
      // Hi-hat foot on 2 and 4
      { time: '0:1:0', padId: HAT },
      { time: '0:3:0', padId: HAT },
      // Kick (sparse)
      { time: '0:0:0', padId: KICK },
      { time: '0:2:2', padId: KICK },
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
      { time: '0:0:0', padId: KICK },
      // Snare on 3
      { time: '0:2:0', padId: SNARE },
      // Hi-hat 8ths
      { time: '0:0:0', padId: HAT },
      { time: '0:0:2', padId: HAT },
      { time: '0:1:0', padId: HAT },
      { time: '0:1:2', padId: HAT },
      { time: '0:2:0', padId: HAT },
      { time: '0:2:2', padId: HAT },
      { time: '0:3:0', padId: HAT },
      { time: '0:3:2', padId: HAT },
    ],
  },
];
