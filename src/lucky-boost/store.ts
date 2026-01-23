import { LuckyBoostState, PackOpenResult, calculateProgress, MILESTONES, MAX_PROGRESS } from './types';

const STORAGE_KEY = 'luckyBoostState';

const defaultState: LuckyBoostState = {
  currentProgress: 0,
  currentMilestoneIndex: 0,
  credits: 0,
  guaranteedPulls: 0,
  history: [],
};

function loadState(): LuckyBoostState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure history is limited to last 10
      if (parsed.history && parsed.history.length > 10) {
        parsed.history = parsed.history.slice(-10);
      }
      
      // Migration: Normalize progress to be within bounds (0 to MAX_PROGRESS)
      if (parsed.currentProgress !== undefined) {
        // Cap progress at MAX_PROGRESS ($1000)
        if (parsed.currentProgress > MAX_PROGRESS) {
          parsed.currentProgress = MAX_PROGRESS;
        } else if (parsed.currentProgress < 0) {
          parsed.currentProgress = 0;
        }
        
        // Reset milestone index if past all milestones
        if (parsed.currentMilestoneIndex !== undefined) {
          const milestoneIndex = Math.min(parsed.currentMilestoneIndex, MILESTONES.length - 1);
          parsed.currentMilestoneIndex = milestoneIndex;
        }
      }
      
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load Lucky Boost state:', e);
  }
  return defaultState;
}

function saveState(state: LuckyBoostState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save Lucky Boost state:', e);
  }
}

class LuckyBoostStore {
  private state: LuckyBoostState = loadState();
  private listeners: Set<() => void> = new Set();

  getState(): LuckyBoostState {
    return { ...this.state };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  addPackOpen(packPrice: number, cardValue: number): {
    progressAdded: number;
    milestonesReached: number[];
  } {
    const progressAdded = calculateProgress(packPrice, cardValue);
    
    // If no progress added (win), return early
    if (progressAdded === 0) {
      return { progressAdded: 0, milestonesReached: [] };
    }
    
    // Get current milestone
    const currentMilestone = MILESTONES[this.state.currentMilestoneIndex];
    if (!currentMilestone) {
      // Past all milestones, don't add more progress
      return { progressAdded: 0, milestonesReached: [] };
    }
    
    // Check if we're already at or past the milestone end
    const isAlreadyAtMilestone = this.state.currentProgress >= currentMilestone.end;
    
    // Add progress (in dollars)
    const newProgress = this.state.currentProgress + progressAdded;
    
    // Check if we've reached the milestone (100% = $1000)
    const milestonesReached: number[] = [];
    let finalProgress = newProgress;
    let finalMilestoneIndex = this.state.currentMilestoneIndex;
    
    // Check if we've crossed the current milestone end (or are already past it)
    if (newProgress >= currentMilestone.end) {
      // If this is the first time reaching the milestone, mark it as reached
      if (!isAlreadyAtMilestone) {
        milestonesReached.push(currentMilestone.id);
      }
      
      // Calculate overflow (progress beyond milestone end)
      const overflow = newProgress - currentMilestone.end;
      
      // Store overflow to be added after reset when reward is claimed
      // For now, cap progress at milestone end
      finalProgress = currentMilestone.end;
      
      // Store overflow in state (will be applied when milestone is claimed)
      // Accumulate overflow if already past milestone, or set it if just reached
      this.state.overflow = (this.state.overflow || 0) + overflow;
    }

    const result: PackOpenResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      packPrice,
      cardValue,
      isWin: cardValue >= packPrice,
      progressAdded,
    };

    this.state = {
      ...this.state,
      currentProgress: finalProgress,
      currentMilestoneIndex: finalMilestoneIndex,
      history: [...this.state.history.slice(-9), result],
      lastProgressAdded: progressAdded,
    };

    saveState(this.state);
    this.notify();

    return { progressAdded, milestonesReached };
  }

  claimMilestone(milestoneId: number): void {
    const milestone = MILESTONES.find((m) => m.id === milestoneId);
    if (!milestone) return;

    // Reset progress to 0 and add any overflow
    const overflow = this.state.overflow || 0;
    
    this.state = {
      ...this.state,
      currentProgress: overflow, // Reset to 0 + overflow
      currentMilestoneIndex: 0, // Reset to first milestone
      credits: this.state.credits + (milestone.reward.credits || 0),
      guaranteedPulls:
        this.state.guaranteedPulls + (milestone.reward.guaranteedPull ? 1 : 0),
      overflow: undefined, // Clear overflow after applying
    };

    saveState(this.state);
    this.notify();
  }

  reset(): void {
    this.state = defaultState;
    saveState(this.state);
    this.notify();
  }

  // Demo mode: seeded random for deterministic testing
  addDemoPackOpen(seed: number): {
    progressAdded: number;
    milestonesReached: number[];
    packPrice: number;
    cardValue: number;
  } {
    // Simple seeded random
    const rng = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const packPrice = 10 + Math.floor(rng(seed) * 20); // $10-$30
    const isWin = rng(seed + 1) > 0.85; // 15% win rate
    const cardValue = isWin
      ? packPrice + Math.floor(rng(seed + 2) * 50) // Win: pack price to pack price + $50
      : Math.floor(rng(seed + 2) * packPrice * 0.8); // Loss: 0 to 80% of pack price

    const result = this.addPackOpen(packPrice, cardValue);
    return {
      ...result,
      packPrice,
      cardValue,
    };
  }
}

export const luckyBoostStore = new LuckyBoostStore();
