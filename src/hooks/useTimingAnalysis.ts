import { useCallback, useRef } from 'react';
import { audioEngine } from '../audio/AudioEngine';
import { useStore } from '../store';
import type { HitResult, TimingGrade } from '../types/practice';
import { TIMING_THRESHOLDS } from '../types/practice';

export function useTimingAnalysis() {
  const recordHit = useStore((s) => s.recordHit);
  const matchedEvents = useRef(new Set<string>());

  const gradeHit = useCallback((deltaMs: number): TimingGrade => {
    const abs = Math.abs(deltaMs);
    if (abs <= TIMING_THRESHOLDS.perfect) return 'perfect';
    if (abs <= TIMING_THRESHOLDS.good) return 'good';
    if (abs <= TIMING_THRESHOLDS.earlyLate) return deltaMs < 0 ? 'early' : 'late';
    return 'miss';
  }, []);

  const analyzeHit = useCallback(
    (padId: number) => {
      const currentTime = audioEngine.getCurrentTime();
      const transportPos = audioEngine.getTransportPosition();
      const player = audioEngine.getPatternPlayer();

      // Look for expected events within ±200ms window
      const windowSize = 0.2;
      const expectedEvents = player.getExpectedEventsForWindow(
        transportPos - windowSize,
        transportPos + windowSize
      );

      // Find closest matching event for this pad
      let closestEvent: { padId: number; absoluteTime: number } | null = null;
      let closestDelta = Infinity;

      for (const event of expectedEvents) {
        if (event.padId !== padId) continue;

        const key = `${event.padId}:${event.absoluteTime.toFixed(4)}`;
        if (matchedEvents.current.has(key)) continue;

        const delta = transportPos - event.absoluteTime;
        if (Math.abs(delta) < Math.abs(closestDelta)) {
          closestDelta = delta;
          closestEvent = event;
        }
      }

      if (closestEvent) {
        const key = `${closestEvent.padId}:${closestEvent.absoluteTime.toFixed(4)}`;
        matchedEvents.current.add(key);

        // Clean old matched events
        if (matchedEvents.current.size > 200) {
          const entries = Array.from(matchedEvents.current);
          matchedEvents.current = new Set(entries.slice(-100));
        }

        const deltaMs = closestDelta * 1000;
        const grade = gradeHit(deltaMs);

        const result: HitResult = {
          padId,
          expectedTime: closestEvent.absoluteTime,
          actualTime: currentTime,
          grade,
          deltaMs,
        };

        recordHit(result);
        return result;
      }

      // No matching event found - miss
      const result: HitResult = {
        padId,
        expectedTime: 0,
        actualTime: currentTime,
        grade: 'miss',
        deltaMs: 0,
      };

      recordHit(result);
      return result;
    },
    [gradeHit, recordHit]
  );

  const resetMatches = useCallback(() => {
    matchedEvents.current.clear();
  }, []);

  return { analyzeHit, resetMatches };
}
