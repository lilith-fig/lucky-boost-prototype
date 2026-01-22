export interface Milestone {
  id: number;
  start: number;
  end: number;
  reward: {
    credits?: number;
    guaranteedPull?: {
      minValue: number;
    };
  };
}

export interface PackOpenResult {
  id: string;
  timestamp: number;
  packPrice: number;
  cardValue: number;
  isWin: boolean;
  progressAdded: number;
}

export interface LuckyBoostState {
  currentProgress: number;
  currentMilestoneIndex: number;
  credits: number;
  guaranteedPulls: number;
  history: PackOpenResult[];
  lastProgressAdded?: number;
}

export const MILESTONES: Milestone[] = [
  { id: 1, start: 0, end: 100, reward: { credits: 5 } },
  { id: 2, start: 100, end: 220, reward: { credits: 10 } },
  { id: 3, start: 220, end: 360, reward: { guaranteedPull: { minValue: 15 } } },
  { id: 4, start: 360, end: 540, reward: { credits: 25 } },
  { id: 5, start: 540, end: 800, reward: { guaranteedPull: { minValue: 25 } } },
];

export function calculateProgress(
  packPrice: number,
  cardValue: number
): number {
  const base = 6;
  const isWin = cardValue >= packPrice;
  
  if (isWin) {
    return base;
  }
  
  const lossExtra = Math.min(
    Math.floor(((packPrice - cardValue) / packPrice) * 40),
    40
  );
  
  return base + lossExtra;
}

export function getCurrentMilestone(progress: number): Milestone | null {
  return MILESTONES.find(
    (m) => progress >= m.start && progress < m.end
  ) || null;
}

export function getProgressInCurrentMilestone(progress: number): number {
  const milestone = getCurrentMilestone(progress);
  if (!milestone) return 0;
  return progress - milestone.start;
}

export function getProgressPercentage(progress: number): number {
  const milestone = getCurrentMilestone(progress);
  if (!milestone) return 0;
  const range = milestone.end - milestone.start;
  const current = progress - milestone.start;
  return (current / range) * 100;
}
