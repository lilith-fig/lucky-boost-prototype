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
  overflow?: number; // Progress overflow beyond milestone end (to be added after reset)
}

// Milestones are now based on dollar amounts
// 100% = $500 total losses
export const MILESTONES: Milestone[] = [
  { id: 1, start: 0, end: 500, reward: { credits: 5 } },
];

// Maximum progress for 100% meter
export const MAX_PROGRESS = 500;

/**
 * Calculate Lucky Boost progress based on pack price.
 * - Only losses can add progress
 * - Progress = 10% of pack price spent
 * - 100% meter = $500 total losses
 * 
 * Examples:
 * - $25 pack loss: $2.50 progress
 * - $50 pack loss: $5.00 progress
 * - $100 pack loss: $10.00 progress
 * - $250 pack loss: $25.00 progress
 */
export function calculateProgress(
  packPrice: number,
  cardValue: number
): number {
  const isWin = cardValue >= packPrice;
  
  // Wins give no progress
  if (isWin) {
    return 0;
  }
  
  // Only losses add progress: 10% of pack price
  const progress = packPrice * 0.1;
  
  return progress;
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
  // Calculate percentage based on $500 max (100% = $500)
  const percentage = (progress / MAX_PROGRESS) * 100;
  return Math.min(100, Math.max(0, percentage));
}
