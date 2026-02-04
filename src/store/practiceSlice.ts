import type { StateCreator } from 'zustand';
import type { HitResult, PracticeStats, TimingGrade } from '../types/practice';

export interface PracticeSlice {
  practiceStats: PracticeStats;
  lastHitResult: HitResult | null;
  isPracticing: boolean;
  hitHistory: HitResult[];
  recordHit: (result: HitResult) => void;
  startPractice: () => void;
  stopPractice: () => void;
  resetStats: () => void;
}

const initialStats: PracticeStats = {
  totalHits: 0,
  perfectCount: 0,
  goodCount: 0,
  earlyCount: 0,
  lateCount: 0,
  missCount: 0,
  currentStreak: 0,
  bestStreak: 0,
  accuracyPercent: 0,
};

function calculateAccuracy(stats: PracticeStats): number {
  if (stats.totalHits === 0) return 0;
  const goodHits = stats.perfectCount + stats.goodCount;
  return Math.round((goodHits / stats.totalHits) * 100);
}

function updateStatsWithGrade(stats: PracticeStats, grade: TimingGrade): PracticeStats {
  const next = { ...stats, totalHits: stats.totalHits + 1 };

  switch (grade) {
    case 'perfect':
      next.perfectCount++;
      next.currentStreak++;
      break;
    case 'good':
      next.goodCount++;
      next.currentStreak++;
      break;
    case 'early':
      next.earlyCount++;
      next.currentStreak = 0;
      break;
    case 'late':
      next.lateCount++;
      next.currentStreak = 0;
      break;
    case 'miss':
      next.missCount++;
      next.currentStreak = 0;
      break;
  }

  next.bestStreak = Math.max(next.bestStreak, next.currentStreak);
  next.accuracyPercent = calculateAccuracy(next);

  return next;
}

export const createPracticeSlice: StateCreator<PracticeSlice> = (set) => ({
  practiceStats: { ...initialStats },
  lastHitResult: null,
  isPracticing: false,
  hitHistory: [],
  recordHit: (result) =>
    set((state) => ({
      practiceStats: updateStatsWithGrade(state.practiceStats, result.grade),
      lastHitResult: result,
      hitHistory: [...state.hitHistory.slice(-49), result],
    })),
  startPractice: () =>
    set({
      isPracticing: true,
      practiceStats: { ...initialStats },
      hitHistory: [],
      lastHitResult: null,
    }),
  stopPractice: () => set({ isPracticing: false }),
  resetStats: () =>
    set({
      practiceStats: { ...initialStats },
      hitHistory: [],
      lastHitResult: null,
    }),
});
