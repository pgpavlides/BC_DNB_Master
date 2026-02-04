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

  async init(): Promise<void> {
    if (this.initialized) return;

    const T = await getTone();
    await T.start();

    // Dynamic imports so Tone.js module-level code only runs after user gesture
    const { SampleLoader } = await import('./SampleLoader');
    const { Metronome } = await import('./Metronome');
    const { PatternPlayer } = await import('./PatternPlayer');

    this.sampleLoader = new SampleLoader();
    this.metronome = new Metronome();
    this.patternPlayer = new PatternPlayer();

    await this.sampleLoader.load();
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  triggerPad(padId: number): void {
    const player = this.sampleLoader?.getPlayer(padId);
    if (player) {
      player.stop();
      player.start();
    }
  }

  // Metronome
  startMetronome(bpm: number, beatsPerMeasure = 4): void {
    if (!Tone) return;
    this.metronome?.start(bpm, beatsPerMeasure);
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
    this.patternPlayer?.stop();
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
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
