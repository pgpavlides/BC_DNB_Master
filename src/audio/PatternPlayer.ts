import * as Tone from 'tone';
import type { Pattern, PatternEvent } from '../types/pattern';

export class PatternPlayer {
  private part: Tone.Part | null = null;
  private pattern: Pattern | null = null;
  private onEventCallback: ((event: PatternEvent) => void) | null = null;
  // onLoopCallback reserved for future use

  loadPattern(pattern: Pattern): void {
    this.dispose();
    this.pattern = pattern;

    const events = pattern.events.map((e) => ({
      time: e.time,
      padId: e.padId,
    }));

    this.part = new Tone.Part((time, event: { padId: number; time: string }) => {
      const patternEvent: PatternEvent = { time: event.time, padId: event.padId };

      Tone.getDraw().schedule(() => {
        this.onEventCallback?.(patternEvent);
      }, time);
    }, events);

    this.part.loop = true;
    this.part.loopEnd = `${pattern.lengthInBars}m`;
  }

  start(): void {
    if (!this.part || !this.pattern) return;

    Tone.getTransport().bpm.value = this.pattern.bpm;
    this.part.start(0);
  }

  stop(): void {
    if (this.part) {
      this.part.stop();
    }
  }

  onEvent(callback: (event: PatternEvent) => void): void {
    this.onEventCallback = callback;
  }

getPattern(): Pattern | null {
    return this.pattern;
  }

  getExpectedEventsForWindow(
    startTime: number,
    endTime: number
  ): { padId: number; absoluteTime: number }[] {
    if (!this.pattern) return [];

    const transport = Tone.getTransport();
    const bpm = transport.bpm.value;
    const secondsPerBeat = 60 / bpm;
    const secondsPerBar = secondsPerBeat * this.pattern.timeSignature[0];
    const patternDuration = secondsPerBar * this.pattern.lengthInBars;

    const results: { padId: number; absoluteTime: number }[] = [];

    for (const event of this.pattern.events) {
      const eventTimeInPattern = this.parseTimeToSeconds(event.time, bpm, this.pattern.timeSignature[0]);

      // Figure out which loop iterations fall within the window
      const firstLoop = Math.floor((startTime - eventTimeInPattern) / patternDuration);
      const lastLoop = Math.ceil((endTime - eventTimeInPattern) / patternDuration);

      for (let loop = firstLoop; loop <= lastLoop; loop++) {
        const absoluteTime = eventTimeInPattern + loop * patternDuration;
        if (absoluteTime >= startTime && absoluteTime <= endTime) {
          results.push({ padId: event.padId, absoluteTime });
        }
      }
    }

    return results;
  }

  private parseTimeToSeconds(
    timeStr: string,
    bpm: number,
    beatsPerBar: number
  ): number {
    const parts = timeStr.split(':').map(Number);
    const bars = parts[0] || 0;
    const quarters = parts[1] || 0;
    const sixteenths = parts[2] || 0;

    const secondsPerBeat = 60 / bpm;
    const secondsPerSixteenth = secondsPerBeat / 4;

    return (
      bars * beatsPerBar * secondsPerBeat +
      quarters * secondsPerBeat +
      sixteenths * secondsPerSixteenth
    );
  }

  dispose(): void {
    if (this.part) {
      try { this.part.stop(0); } catch { /* Tone.js can throw on tiny negative transport times */ }
      try { this.part.dispose(); } catch { /* safe cleanup */ }
      this.part = null;
    }
    this.pattern = null;
    this.onEventCallback = null;
  }
}
