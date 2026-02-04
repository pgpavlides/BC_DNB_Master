import type { Pattern } from '../types/pattern';

/**
 * Reverse mapping: GM drum note → canonical pad ID.
 * When multiple pads share the same GM note, one canonical pad is chosen.
 */
const MIDI_NOTE_TO_PAD: Record<number, number> = {
  35: 1,   // Bass Drum 2
  36: 2,   // Bass Drum 1
  38: 11,  // Snare
  40: 9,   // Electric Snare
  42: 10,  // Closed Hi-Hat
  44: 14,  // Pedal Hi-Hat
  46: 15,  // Open Hi-Hat
};

/** Read a big-endian 16-bit unsigned integer */
function readU16(data: Uint8Array, offset: number): number {
  return (data[offset] << 8) | data[offset + 1];
}

/** Read a big-endian 32-bit unsigned integer */
function readU32(data: Uint8Array, offset: number): number {
  return (
    ((data[offset] << 24) >>> 0) +
    (data[offset + 1] << 16) +
    (data[offset + 2] << 8) +
    data[offset + 3]
  );
}

/** Read a MIDI variable-length quantity; returns [value, bytesConsumed] */
function readVLQ(data: Uint8Array, offset: number): [number, number] {
  let value = 0;
  let bytesRead = 0;
  let byte: number;
  do {
    byte = data[offset + bytesRead];
    value = (value << 7) | (byte & 0x7f);
    bytesRead++;
  } while (byte & 0x80);
  return [value, bytesRead];
}

/** Check that bytes at `offset` match the expected ASCII string */
function matchChunk(data: Uint8Array, offset: number, id: string): boolean {
  for (let i = 0; i < id.length; i++) {
    if (data[offset + i] !== id.charCodeAt(i)) return false;
  }
  return true;
}

/**
 * Parse a standard MIDI file and return a Pattern.
 * Supports Format 0 and Format 1 files.
 */
export function midiToPattern(bytes: Uint8Array, fileName: string): Pattern {
  // --- Validate MThd header ---
  if (!matchChunk(bytes, 0, 'MThd')) {
    throw new Error('Not a valid MIDI file (missing MThd header)');
  }

  const headerLen = readU32(bytes, 4);
  const format = readU16(bytes, 8);
  const numTracks = readU16(bytes, 10);
  const ticksPerQuarter = readU16(bytes, 12);

  if (format > 1) {
    throw new Error(`Unsupported MIDI format ${format} (only 0 and 1 supported)`);
  }

  // --- Parse all tracks ---
  let bpm = 120;
  let numerator = 4;
  let denominator = 4;
  const collectedNotes: { tick: number; midiNote: number }[] = [];

  let pos = 8 + headerLen; // skip MThd + header data

  for (let t = 0; t < numTracks; t++) {
    if (!matchChunk(bytes, pos, 'MTrk')) {
      throw new Error(`Expected MTrk at offset ${pos}`);
    }
    const trackLen = readU32(bytes, pos + 4);
    const trackStart = pos + 8;
    const trackEnd = trackStart + trackLen;
    pos = trackEnd; // advance for next track

    let cursor = trackStart;
    let absoluteTick = 0;
    let runningStatus = 0;

    while (cursor < trackEnd) {
      // Read delta time
      const [delta, dLen] = readVLQ(bytes, cursor);
      cursor += dLen;
      absoluteTick += delta;

      let statusByte = bytes[cursor];

      // Meta event
      if (statusByte === 0xff) {
        const metaType = bytes[cursor + 1];
        const [metaLen, mLen] = readVLQ(bytes, cursor + 2);
        const metaDataStart = cursor + 2 + mLen;

        if (metaType === 0x51 && metaLen === 3) {
          // Tempo: microseconds per quarter note
          const usPerQuarter =
            (bytes[metaDataStart] << 16) |
            (bytes[metaDataStart + 1] << 8) |
            bytes[metaDataStart + 2];
          bpm = Math.round(60_000_000 / usPerQuarter);
        } else if (metaType === 0x58 && metaLen >= 2) {
          // Time signature
          numerator = bytes[metaDataStart];
          denominator = Math.pow(2, bytes[metaDataStart + 1]);
        }

        cursor = metaDataStart + metaLen;
        continue;
      }

      // SysEx events
      if (statusByte === 0xf0 || statusByte === 0xf7) {
        const [sysLen, sLen] = readVLQ(bytes, cursor + 1);
        cursor = cursor + 1 + sLen + sysLen;
        continue;
      }

      // Channel message
      if (statusByte & 0x80) {
        runningStatus = statusByte;
        cursor++;
      } else {
        // Running status — use previous status byte
        statusByte = runningStatus;
      }

      const msgType = statusByte & 0xf0;
      const channel = statusByte & 0x0f;

      // Determine number of data bytes for this message type
      if (msgType === 0xc0 || msgType === 0xd0) {
        // Program change / channel pressure — 1 data byte
        cursor += 1;
      } else {
        // All other channel messages — 2 data bytes
        const data1 = bytes[cursor];
        const data2 = bytes[cursor + 1];
        cursor += 2;

        // Note-on on channel 9 (GM drums) with velocity > 0
        if (msgType === 0x90 && channel === 9 && data2 > 0) {
          collectedNotes.push({ tick: absoluteTick, midiNote: data1 });
        }
      }
    }
  }

  // --- Convert collected notes to pattern events ---
  const ticksPerSixteenth = ticksPerQuarter / 4;
  const stepsPerBar = numerator * (16 / denominator);

  const events: { time: string; padId: number }[] = [];
  let maxStep = 0;

  for (const note of collectedNotes) {
    const padId = MIDI_NOTE_TO_PAD[note.midiNote];
    if (padId === undefined) continue;

    const step = Math.round(note.tick / ticksPerSixteenth);
    if (step > maxStep) maxStep = step;

    const bar = Math.floor(step / stepsPerBar);
    const remainder = step % stepsPerBar;
    const quarter = Math.floor(remainder / 4);
    const sixteenth = remainder % 4;

    events.push({ time: `${bar}:${quarter}:${sixteenth}`, padId });
  }

  const lengthInBars = Math.max(1, Math.ceil((maxStep + 1) / stepsPerBar));

  // Derive a clean name from the file name (strip extension)
  const name = fileName.replace(/\.(mid|midi)$/i, '');

  return {
    id: crypto.randomUUID(),
    name,
    category: 'custom',
    bpm,
    timeSignature: [numerator, denominator] as [number, number],
    lengthInBars,
    difficulty: 1,
    events,
  };
}
