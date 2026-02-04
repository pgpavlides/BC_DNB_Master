import * as Tone from 'tone';
import {
  METRONOME_PRESETS,
  getGroupAccentBeats,
} from './metronomeConstants';

/** Map a note-value denominator (2, 4, 8, 16) to a Tone.js subdivision string */
function noteValueToSubdivision(noteValue: number): string {
  const map: Record<number, string> = { 2: '2n', 4: '4n', 8: '8n', 16: '16n' };
  return map[noteValue] ?? '4n';
}

function volumeToDb(vol: number): number {
  if (vol <= 0) return -Infinity;
  return -40 + (vol / 100) * 40;
}

export class Metronome {
  private synth: Tone.Synth | null = null;
  private noiseSynth: Tone.NoiseSynth | null = null;
  private loop: Tone.Loop | null = null;
  private beatCallback: ((beat: number) => void) | null = null;
  private beatsPerMeasure = 4;
  private noteValue = 4;
  private beatCounter = 0;
  private currentPreset: string = 'classic';
  private currentVolume: number = 70;
  private currentGrouping: number[] = [4];
  private groupAccents: Set<number> = new Set();
  private _isMuted = false;
  private storedVolume: number = 70;

  private buildSynth(presetName: string, volume: number): void {
    this.disposeSynth();
    const preset = METRONOME_PRESETS[presetName] ?? METRONOME_PRESETS.classic;
    const dbVolume = volumeToDb(volume);

    if (presetName === 'hihat') {
      this.noiseSynth = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: preset.envelope.attack,
          decay: preset.envelope.decay,
          sustain: preset.envelope.sustain,
          release: preset.envelope.release,
        },
        volume: dbVolume,
      }).toDestination();
    } else {
      this.synth = new Tone.Synth({
        oscillator: { type: preset.oscillatorType as Tone.ToneOscillatorType },
        envelope: preset.envelope,
        volume: dbVolume,
      }).toDestination();
    }
  }

  private disposeSynth(): void {
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    if (this.noiseSynth) {
      this.noiseSynth.dispose();
      this.noiseSynth = null;
    }
  }

  private computeTransportBpm(userBpm: number): number {
    return userBpm * (4 / this.noteValue);
  }

  start(
    bpm: number,
    beatsPerMeasure = 4,
    preset?: string,
    volume?: number,
    noteValue?: number,
    grouping?: number[],
  ): void {
    this.stop();
    this.beatsPerMeasure = beatsPerMeasure;
    if (preset !== undefined) this.currentPreset = preset;
    if (volume !== undefined) this.currentVolume = volume;
    if (noteValue !== undefined) this.noteValue = noteValue;
    if (grouping !== undefined) this.currentGrouping = grouping;
    this.beatCounter = 0;
    this.groupAccents = getGroupAccentBeats(this.currentGrouping);

    this.buildSynth(this.currentPreset, this.currentVolume);

    Tone.getTransport().bpm.value = this.computeTransportBpm(bpm);

    const subdivision = noteValueToSubdivision(this.noteValue);
    const presetConfig = METRONOME_PRESETS[this.currentPreset] ?? METRONOME_PRESETS.classic;

    this.loop = new Tone.Loop((time) => {
      const beat = this.beatCounter % this.beatsPerMeasure;
      this.beatCounter++;

      const isAccent = beat === 0 || this.groupAccents.has(beat);

      if (this.currentPreset === 'hihat' && this.noiseSynth) {
        const dbOffset = isAccent ? 0 : -8;
        this.noiseSynth.volume.value = volumeToDb(this.currentVolume) + dbOffset;
        this.noiseSynth.triggerAttackRelease('32n', time);
      } else if (this.synth) {
        const cfg = METRONOME_PRESETS[this.currentPreset] ?? presetConfig;
        const note = isAccent ? cfg.downbeatNote : cfg.offbeatNote;
        const vel = isAccent ? cfg.downbeatVelocity : cfg.offbeatVelocity;
        this.synth.triggerAttackRelease(note, '32n', time, vel);
      }

      Tone.getDraw().schedule(() => {
        this.beatCallback?.(beat);
      }, time);
    }, subdivision);

    this.loop.start(0);
  }

  stop(): void {
    if (this.loop) {
      this.loop.stop();
      this.loop.dispose();
      this.loop = null;
    }
    this.beatCounter = 0;
  }

  setBpm(bpm: number): void {
    Tone.getTransport().bpm.value = this.computeTransportBpm(bpm);
  }

  setVolume(vol: number): void {
    this.currentVolume = vol;
    const db = volumeToDb(vol);
    if (this.synth) {
      this.synth.volume.value = db;
    }
    if (this.noiseSynth) {
      this.noiseSynth.volume.value = db;
    }
  }

  setPreset(presetName: string): void {
    if (presetName === this.currentPreset) return;
    this.currentPreset = presetName;
    if (this.loop) {
      this.buildSynth(this.currentPreset, this.currentVolume);
    }
  }

  onBeat(callback: (beat: number) => void): void {
    this.beatCallback = callback;
  }

  mute(): void {
    if (this._isMuted) return;
    this._isMuted = true;
    this.storedVolume = this.currentVolume;
    if (this.synth) this.synth.volume.value = -Infinity;
    if (this.noiseSynth) this.noiseSynth.volume.value = -Infinity;
  }

  unmute(): void {
    if (!this._isMuted) return;
    this._isMuted = false;
    const db = volumeToDb(this.storedVolume);
    if (this.synth) this.synth.volume.value = db;
    if (this.noiseSynth) this.noiseSynth.volume.value = db;
  }

  isMuted(): boolean {
    return this._isMuted;
  }

  dispose(): void {
    this.stop();
    this.disposeSynth();
  }
}
