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
// 100% = $1000 total losses
// 5 variants of the first milestone, all with $25 reward
export const MILESTONES: Milestone[] = [
  { id: 1, start: 0, end: 1000, reward: { credits: 25 } },
  { id: 2, start: 0, end: 1000, reward: { credits: 25 } },
  { id: 3, start: 0, end: 1000, reward: { credits: 25 } },
  { id: 4, start: 0, end: 1000, reward: { credits: 25 } },
  { id: 5, start: 0, end: 1000, reward: { credits: 25 } },
];

/**
 * Get a random milestone variant (1-5) for the first milestone
 * All variants have the same reward ($25), but this adds variety
 */
export function getRandomMilestoneVariant(): number {
  return Math.floor(Math.random() * 5) + 1; // Returns 1-5
}

// Maximum progress for 100% meter ($1000 = 100%)
export const MAX_PROGRESS = 1000;

/**
 * Calculate Lucky Boost progress from a pack open.
 * - Only losses add progress (card value < pack price)
 * - Lost amount = pack price - card value
 * - Progress added (dollars) = lost amount
 * - % gain = loss amount / $1000 * 100
 * - Meter: $1000 = 100%
 */
export function calculateProgress(
  packPrice: number,
  cardValue: number
): number {
  const isWin = cardValue >= packPrice;
  
  if (isWin) {
    return 0;
  }
  
  const lostAmount = packPrice - cardValue;
  return lostAmount;
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
  // % gain = loss amount / $1000 * 100
  const percentage = (progress / MAX_PROGRESS) * 100;
  return Math.min(100, Math.max(0, percentage));
}
