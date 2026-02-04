import * as Tone from 'tone';

export class Metronome {
  private synth: Tone.Synth;
  private loop: Tone.Loop | null = null;
  private beatCallback: ((beat: number) => void) | null = null;
  private beatsPerMeasure = 4;

  constructor() {
    this.synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 },
      volume: -10,
    }).toDestination();
  }

  start(bpm: number, beatsPerMeasure = 4): void {
    this.stop();
    this.beatsPerMeasure = beatsPerMeasure;

    Tone.getTransport().bpm.value = bpm;

    this.loop = new Tone.Loop((time) => {
      // Derive beat from transport position so it's always correct
      const posSeconds = Tone.getTransport().seconds;
      const secondsPerBeat = 60 / Tone.getTransport().bpm.value;
      const totalBeats = Math.round(posSeconds / secondsPerBeat);
      const beat = totalBeats % this.beatsPerMeasure;

      const isDownbeat = beat === 0;
      this.synth.triggerAttackRelease(
        isDownbeat ? 'C6' : 'C5',
        '32n',
        time,
        isDownbeat ? 0.8 : 0.4
      );

      Tone.getDraw().schedule(() => {
        this.beatCallback?.(beat);
      }, time);
    }, '4n');

    this.loop.start(0);
  }

  stop(): void {
    if (this.loop) {
      this.loop.stop();
      this.loop.dispose();
      this.loop = null;
    }
  }

  setBpm(bpm: number): void {
    Tone.getTransport().bpm.value = bpm;
  }

  onBeat(callback: (beat: number) => void): void {
    this.beatCallback = callback;
  }

  dispose(): void {
    this.stop();
    this.synth.dispose();
  }
}
