import * as Tone from 'tone';
import { SampleLoader } from './SampleLoader';
import { Metronome } from './Metronome';
import { PatternPlayer } from './PatternPlayer';
import type { Pattern, PatternEvent } from '../types/pattern';

class AudioEngine {
  private sampleLoader: SampleLoader | null = null;
  private metronome: Metronome | null = null;
  private patternPlayer: PatternPlayer | null = null;
  private initialized = false;
  private _isPlaying = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    await Tone.start();

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
    this.metronome?.start(bpm, beatsPerMeasure);
    Tone.getTransport().start();
    this._isPlaying = true;
  }

  stopMetronome(): void {
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
    if (!this.patternPlayer) return;
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
    return Tone.getContext().currentTime;
  }

  getTransportPosition(): number {
    return Tone.getTransport().seconds;
  }

  dispose(): void {
    this.metronome?.dispose();
    this.patternPlayer?.dispose();
    this.sampleLoader?.dispose();
    this.initialized = false;
  }
}

// Singleton — no Tone.js objects created until init() is called
export const audioEngine = new AudioEngine();
