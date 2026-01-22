import { LuckyBoostState, PackOpenResult, calculateProgress, MILESTONES } from './types';

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
    const newProgress = this.state.currentProgress + progressAdded;
    
    // Check for milestones reached
    const milestonesReached: number[] = [];
    let currentMilestoneIndex = this.state.currentMilestoneIndex;
    
    // Check if we've crossed any milestones
    while (
      currentMilestoneIndex < MILESTONES.length &&
      newProgress >= MILESTONES[currentMilestoneIndex].end
    ) {
      milestonesReached.push(MILESTONES[currentMilestoneIndex].id);
      currentMilestoneIndex++;
    }
    
    // Handle overflow - carry to next milestone
    let finalProgress = newProgress;
    if (currentMilestoneIndex < MILESTONES.length) {
      const currentMilestone = MILESTONES[currentMilestoneIndex];
      if (finalProgress >= currentMilestone.end) {
        // Overflow to next milestone
        const overflow = finalProgress - currentMilestone.end;
        if (currentMilestoneIndex + 1 < MILESTONES.length) {
          finalProgress = MILESTONES[currentMilestoneIndex + 1].start + overflow;
          currentMilestoneIndex++;
        } else {
          // Last milestone, cap at end
          finalProgress = currentMilestone.end;
        }
      }
    } else {
      // Past all milestones, cap at last milestone end
      finalProgress = MILESTONES[MILESTONES.length - 1].end;
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
      currentMilestoneIndex,
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

    this.state = {
      ...this.state,
      credits: this.state.credits + (milestone.reward.credits || 0),
      guaranteedPulls:
        this.state.guaranteedPulls + (milestone.reward.guaranteedPull ? 1 : 0),
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
    const isWin = rng(seed + 1) > 0.7; // 30% win rate
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
