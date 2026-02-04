import type { Pattern, PatternEvent } from '../types/pattern';
import type { SampleLoader } from './SampleLoader';
import type { Metronome } from './Metronome';
import type { PatternPlayer } from './PatternPlayer';

// Tone.js is loaded dynamically to avoid creating an AudioContext before user gesture
let Tone: typeof import('tone') | null = null;

async function getTone() {
  if (!Tone) {
    Tone = await import('tone');
  }
  return Tone;
}

class AudioEngine {
  private sampleLoader: SampleLoader | null = null;
  private metronome: Metronome | null = null;
  private patternPlayer: PatternPlayer | null = null;
  private initialized = false;
  private _isPlaying = false;
  private rawCtx: AudioContext | null = null;
  private bufferCache: Map<number, AudioBuffer> = new Map();

  async init(): Promise<void> {
    if (this.initialized) return;

    // Create a low-latency AudioContext and hand it to Tone.js
    this.rawCtx = new AudioContext({ latencyHint: 'interactive', sampleRate: 44100 });
    await this.rawCtx.resume();

    const T = await getTone();
    T.setContext(this.rawCtx);
    T.getContext().lookAhead = 0;

    // Dynamic imports so Tone.js module-level code only runs after user gesture
    const { SampleLoader } = await import('./SampleLoader');
    const { Metronome } = await import('./Metronome');
    const { PatternPlayer } = await import('./PatternPlayer');

    this.sampleLoader = new SampleLoader();
    this.metronome = new Metronome();
    this.patternPlayer = new PatternPlayer();

    await this.sampleLoader.load();

    // Pre-cache raw AudioBuffers so triggerPad has zero overhead
    for (const [padId, player] of this.sampleLoader.getAllPlayers()) {
      if (player.buffer.loaded) {
        const buf = player.buffer.get() as AudioBuffer;
        if (buf) this.bufferCache.set(padId, buf);
      }
    }

    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  triggerPad(padId: number): void {
    const buf = this.bufferCache.get(padId);
    if (!buf || !this.rawCtx) return;

    // Pure Web Audio API — no Tone.js in the hot path
    const source = this.rawCtx.createBufferSource();
    source.buffer = buf;
    source.connect(this.rawCtx.destination);
    source.start();
  }

  // Metronome
  startMetronome(bpm: number, beatsPerMeasure = 4, preset?: string, volume?: number, noteValue?: number, grouping?: number[]): void {
    if (!Tone) return;
    this.metronome?.start(bpm, beatsPerMeasure, preset, volume, noteValue, grouping);
    Tone.getTransport().start();
    this._isPlaying = true;
  }

  stopMetronome(): void {
    if (!Tone) return;
    this.metronome?.stop();
    if (!this.patternPlayer?.getPattern()) {
      Tone.getTransport().stop();
      Tone.getTransport().position = 0;
      this._isPlaying = false;
    }
  }

  setMetronomeBpm(bpm: number): void {
    this.metronome?.setBpm(bpm);
  }

  setMetronomeVolume(vol: number): void {
    this.metronome?.setVolume(vol);
  }

  setMetronomePreset(preset: string): void {
    this.metronome?.setPreset(preset);
  }

  muteMetronome(): void {
    this.metronome?.mute();
  }

  unmuteMetronome(): void {
    this.metronome?.unmute();
  }

  onMetronomeBeat(callback: (beat: number) => void): void {
    this.metronome?.onBeat(callback);
  }

  // Pattern
  loadPattern(pattern: Pattern): void {
    this.patternPlayer?.loadPattern(pattern);
  }

  startPattern(playAudio = true): void {
    if (!Tone || !this.patternPlayer) return;
    if (playAudio) {
      this.patternPlayer.onEvent((event: PatternEvent) => {
        this.triggerPad(event.padId);
      });
    }
    this.patternPlayer.start();
    Tone.getTransport().start();
    this._isPlaying = true;
  }

  stopPattern(): void {
    if (!Tone) return;
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
    try { this.patternPlayer?.stop(); } catch { /* guard Tone.js range errors */ }
    this._isPlaying = false;
  }

  onPatternEvent(callback: (event: PatternEvent) => void): void {
    this.patternPlayer?.onEvent(callback);
  }

  getPatternPlayer(): PatternPlayer {
    if (!this.patternPlayer) {
      throw new Error('AudioEngine not initialized');
    }
    return this.patternPlayer;
  }

  isPlaying(): boolean {
    return this._isPlaying;
  }

  getCurrentTime(): number {
    if (!Tone) return 0;
    return Tone.getContext().currentTime;
  }

  getTransportPosition(): number {
    if (!Tone) return 0;
    return Tone.getTransport().seconds;
  }

  dispose(): void {
    this.metronome?.dispose();
    this.patternPlayer?.dispose();
    this.sampleLoader?.dispose();
    this.initialized = false;
  }
}

// Singleton — nothing from Tone.js is loaded until init() is called on first user gesture
export const audioEngine = new AudioEngine();
