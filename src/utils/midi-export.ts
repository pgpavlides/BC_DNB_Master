import type { Pattern } from '../types/pattern';

/**
 * Minimal MIDI file encoder — produces a Format 0 (single-track) .mid file
 * with drum events on channel 9 (GM percussion).
 */

const TICKS_PER_QUARTER = 96;

// Pad ID → GM Drum note number
const PAD_TO_MIDI_NOTE: Record<number, number> = {
  0: 36,  // Bass Kick 3 → Bass Drum 1
  1: 35,  // Bass Kick 2 → Bass Drum 2
  2: 36,  // Bass Kick   → Bass Drum 1
  6: 36,  // Kick        → Bass Drum 1
  7: 38,  // Ghost Snare → Snare
  9: 40,  // Snare 2     → Electric Snare
  11: 38, // Snare 1     → Snare
  10: 42, // Hat 1       → Closed Hi-Hat
  14: 44, // Hat 2       → Pedal Hi-Hat
  15: 46, // Hat 3       → Open Hi-Hat
};

/** Write a big-endian 16-bit value */
function u16(v: number): number[] {
  return [(v >> 8) & 0xff, v & 0xff];
}

/** Write a big-endian 32-bit value */
function u32(v: number): number[] {
  return [(v >> 24) & 0xff, (v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
}

/** Encode a MIDI variable-length quantity */
function vlq(value: number): number[] {
  if (value < 0) value = 0;
  if (value < 0x80) return [value];
  const bytes: number[] = [];
  bytes.unshift(value & 0x7f);
  value >>= 7;
  while (value > 0) {
    bytes.unshift((value & 0x7f) | 0x80);
    value >>= 7;
  }
  return bytes;
}

/**
 * Build a standard MIDI file (Format 0) from a Pattern.
 * Returns raw bytes suitable for saving as .mid.
 */
export function patternToMidi(pattern: Pattern): Uint8Array {
  const [beatsPerBar, beatNoteValue] = pattern.timeSignature;
  const ticksPerQuarter = TICKS_PER_QUARTER;

  // --- Build track data ---
  const track: number[] = [];

  // Tempo meta-event: FF 51 03 tt tt tt (microseconds per quarter note)
  const usPerQuarter = Math.round(60_000_000 / pattern.bpm);
  track.push(0x00); // delta = 0
  track.push(0xff, 0x51, 0x03);
  track.push((usPerQuarter >> 16) & 0xff, (usPerQuarter >> 8) & 0xff, usPerQuarter & 0xff);

  // Time signature meta-event: FF 58 04 nn dd cc bb
  // nn = numerator, dd = log2(denominator), cc = MIDI clocks per metronome click,
  // bb = 32nd notes per quarter note
  const dd = Math.log2(beatNoteValue);
  track.push(0x00); // delta = 0
  track.push(0xff, 0x58, 0x04);
  track.push(beatsPerBar, dd, 24, 8);

  // Collect note events
  interface NoteEvent {
    tick: number;
    note: number;
    velocity: number;
    on: boolean;
  }

  const noteEvents: NoteEvent[] = [];
  const noteDuration = Math.round(ticksPerQuarter / 4); // 16th note duration

  // Recompute ticks from time string using the actual time signature
  // The time string format is "bar:quarter:sixteenth" where quarter counts
  // beats within the bar based on 16th-note subdivisions grouped by 4
  for (const event of pattern.events) {
    const midiNote = PAD_TO_MIDI_NOTE[event.padId];
    if (midiNote === undefined) continue;

    // Parse time string
    const parts = event.time.split(':').map(Number);
    const bar = parts[0] || 0;
    const quarterGroup = parts[1] || 0;
    const sixteenth = parts[2] || 0;

    // Each step is a 16th note. Steps per bar = beatsPerBar * (16/beatNoteValue)
    const stepsPerBar = beatsPerBar * (16 / beatNoteValue);
    const stepIndex = bar * stepsPerBar + quarterGroup * 4 + sixteenth;
    const tick = stepIndex * (ticksPerQuarter / 4); // each 16th = ticksPerQuarter/4

    noteEvents.push({ tick, note: midiNote, velocity: 100, on: true });
    noteEvents.push({ tick: tick + noteDuration - 1, note: midiNote, velocity: 0, on: false });
  }

  // Sort by tick, then note-off before note-on at the same tick
  noteEvents.sort((a, b) => {
    if (a.tick !== b.tick) return a.tick - b.tick;
    if (a.on !== b.on) return a.on ? 1 : -1; // off before on
    return a.note - b.note;
  });

  // Write note events with delta times
  let lastTick = 0;
  const DRUM_CHANNEL = 9; // 0-indexed channel 9 = GM drums

  for (const ev of noteEvents) {
    const delta = ev.tick - lastTick;
    track.push(...vlq(delta));
    if (ev.on) {
      track.push(0x90 | DRUM_CHANNEL, ev.note, ev.velocity);
    } else {
      track.push(0x80 | DRUM_CHANNEL, ev.note, 0);
    }
    lastTick = ev.tick;
  }

  // End-of-track meta-event
  track.push(0x00, 0xff, 0x2f, 0x00);

  // --- Assemble file ---
  const header = [
    // "MThd"
    0x4d, 0x54, 0x68, 0x64,
    // Header length = 6
    ...u32(6),
    // Format 0
    ...u16(0),
    // 1 track
    ...u16(1),
    // Ticks per quarter note
    ...u16(ticksPerQuarter),
  ];

  const trackHeader = [
    // "MTrk"
    0x4d, 0x54, 0x72, 0x6b,
    // Track length
    ...u32(track.length),
  ];

  const file = new Uint8Array(header.length + trackHeader.length + track.length);
  file.set(header, 0);
  file.set(trackHeader, header.length);
  file.set(track, header.length + trackHeader.length);

  return file;
}
