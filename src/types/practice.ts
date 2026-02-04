export type TimingGrade = 'perfect' | 'good' | 'early' | 'late' | 'miss';

export interface HitResult {
  padId: number;
  expectedTime: number;
  actualTime: number;
  grade: TimingGrade;
  deltaMs: number;
}

export interface PracticeStats {
  totalHits: number;
  perfectCount: number;
  goodCount: number;
  earlyCount: number;
  lateCount: number;
  missCount: number;
  currentStreak: number;
  bestStreak: number;
  accuracyPercent: number;
}

export const TIMING_THRESHOLDS = {
  perfect: 25,
  good: 50,
  earlyLate: 100,
} as const;
