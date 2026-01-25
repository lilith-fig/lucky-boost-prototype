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
// 5 additional milestones with increasing rewards
export const MILESTONES: Milestone[] = [
  { id: 1, start: 0, end: 1000, reward: { credits: 25 } },
  { id: 2, start: 0, end: 1000, reward: { credits: 25 } },
  { id: 3, start: 0, end: 1000, reward: { credits: 25 } },
  { id: 4, start: 0, end: 1000, reward: { credits: 25 } },
  { id: 5, start: 0, end: 1000, reward: { credits: 25 } },
  { id: 6, start: 0, end: 1000, reward: { credits: 50 } },
  { id: 7, start: 0, end: 1000, reward: { credits: 75 } },
  { id: 8, start: 0, end: 1000, reward: { credits: 100 } },
  { id: 9, start: 0, end: 1000, reward: { credits: 150 } },
  { id: 10, start: 0, end: 1000, reward: { credits: 200 } },
];

/**
 * Get a random milestone variant (1-10) with weighted probabilities
 * Lower rewards are more common, higher rewards are rarer (like a lottery)
 * First 5 variants: $25 (most common)
 * Next 5 variants: $50, $75, $100, $150, $200 (increasingly rare)
 */
export function getRandomMilestoneVariant(): number {
  const random = Math.random();
  
  // Weighted distribution:
  // 40% chance: $25 (ids 1-5) - most common
  // 25% chance: $50 (id 6)
  // 15% chance: $75 (id 7)
  // 10% chance: $100 (id 8)
  // 6% chance: $150 (id 9)
  // 4% chance: $200 (id 10) - rarest
  
  if (random < 0.40) {
    // 40% - $25 rewards (ids 1-5)
    return Math.floor(Math.random() * 5) + 1;
  } else if (random < 0.65) {
    // 25% - $50 reward (id 6)
    return 6;
  } else if (random < 0.80) {
    // 15% - $75 reward (id 7)
    return 7;
  } else if (random < 0.90) {
    // 10% - $100 reward (id 8)
    return 8;
  } else if (random < 0.96) {
    // 6% - $150 reward (id 9)
    return 9;
  } else {
    // 4% - $200 reward (id 10) - rarest
    return 10;
  }
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

/**
 * Get the reward range for display (since rewards are randomized)
 * Returns the min and max possible reward amounts
 */
export function getRewardRange(): { min: number; max: number } {
  const creditRewards = MILESTONES.filter(m => m.reward.credits).map(m => m.reward.credits!);
  return {
    min: Math.min(...creditRewards),
    max: Math.max(...creditRewards),
  };
}
