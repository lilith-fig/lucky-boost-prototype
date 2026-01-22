import { GameState, PackOpenResult } from './types';
import { generateCard, PACKS } from './packs';
import { luckyBoostStore } from '../lucky-boost/store';
import { MILESTONES, calculateProgress, MAX_PROGRESS } from '../lucky-boost/types';

const STORAGE_KEY = 'gachaGameState';

const defaultState: GameState = {
  usdcBalance: 500, // Starting USDC balance ($500.00) - resets each session
  credits: 0, // Starting credits (separate from USDC)
  packsOpened: 0,
  luckyBoostProgress: 0,
  currentScreen: 'home',
  selectedPack: null,
  lastResult: null,
  showRewardPopup: false,
  inventory: [], // Collection of kept cards
};

function loadState(): GameState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration: if usdcBalance doesn't exist, initialize it from old credits value
      if (parsed.usdcBalance === undefined && parsed.credits !== undefined) {
        parsed.usdcBalance = parsed.credits; // Migrate old credits to USDC
        parsed.credits = 0; // Reset credits to 0
      }
      // Reset balance to default on each session (don't persist balance between sessions)
      const loadedState = { ...defaultState, ...parsed, currentScreen: 'home', usdcBalance: defaultState.usdcBalance };
      return loadedState;
    }
  } catch (e) {
    console.error('Failed to load game state:', e);
  }
  return defaultState;
}

function saveState(state: GameState): void {
  try {
    // Don't save currentScreen or usdcBalance to localStorage
    // Balance resets each session, so we don't persist it
    const { currentScreen, usdcBalance, ...stateToSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
}

class GameStore {
  private state: GameState = loadState();
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Reset balance to default on session start
    this.state.usdcBalance = defaultState.usdcBalance;
    
    // Reset balance when user leaves the session (beforeunload)
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        // Balance will reset on next session start since it's not persisted
        this.state.usdcBalance = defaultState.usdcBalance;
      });
    }
  }

  getState(): GameState {
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

  // Navigation
  navigateTo(screen: GameState['currentScreen']): void {
    this.state = { ...this.state, currentScreen: screen };
    this.notify();
  }

  selectPack(pack: GameState['selectedPack']): void {
    this.state = { ...this.state, selectedPack: pack };
    this.notify();
  }

  // Lucky Boost calculation (for display purposes)
  // Uses the same formula as calculateProgress in lucky-boost/types.ts
  calculateLuckyBoostProgress(packPrice: number, cardValue: number): number {
    const isWin = cardValue >= packPrice;
    
    // Wins give no progress
    if (isWin) {
      return 0;
    }
    
    // Only losses add progress: 10% of pack price
    return packPrice * 0.1;
  }

  // Open a pack
  openPack(packId: string, seed?: number): PackOpenResult {
    const pack = PACKS.find((p) => p.id === packId);
    if (!pack) {
      throw new Error(`Pack not found: ${packId}`);
    }

    // Check if user has enough USDC balance
    if (this.state.usdcBalance < pack.price) {
      throw new Error('Insufficient USDC balance');
    }

    // Generate card
    const card = generateCard(pack, seed);
    
    // Deduct pack price from USDC balance
    this.state.usdcBalance -= pack.price;
    this.state.packsOpened += 1;

    // Calculate what the progress update would be, but don't apply it yet
    // Store it as pending to avoid spoiling the result in the header
    const progressAdded = calculateProgress(pack.price, card.value);
    
    // Calculate what milestones would be reached (without actually updating stores)
    const currentState = luckyBoostStore.getState();
    const currentMilestone = MILESTONES[currentState.currentMilestoneIndex];
    let milestonesReached: number[] = [];
    
    if (currentMilestone && progressAdded > 0) {
      const newProgress = currentState.currentProgress + progressAdded;
      
      // Check if we've reached the milestone (100% = $500)
      if (newProgress >= currentMilestone.end) {
        milestonesReached.push(currentMilestone.id);
      }
    }
    
    // Store pending update (will be applied after card reveal sequence)
    this.state.pendingLuckyBoostUpdate = {
      packPrice: pack.price,
      cardValue: card.value,
      milestonesReached,
    };
    
    // Calculate what the new progress would be for display purposes (but don't update stores)
    // Progress is tracked in dollars, 100% = $500
    const luckyBoostState = luckyBoostStore.getState();
    const newProgressDollars = luckyBoostState.currentProgress + progressAdded;
    const newProgress = Math.min(100, Math.max(0, (newProgressDollars / MAX_PROGRESS) * 100));
    
    // Update local progress for calculation purposes (stores will be updated later)
    this.state.luckyBoostProgress = newProgress;

    const result: PackOpenResult = {
      card,
      packPrice: pack.price,
      isWin: card.value >= pack.price,
      timestamp: Date.now(),
      theme: pack.theme,
    };

    this.state.lastResult = result;
    saveState(this.state);
    this.notify();

    return result;
  }

  // Keep card (add to inventory and return to home)
  keepCard(): void {
    if (this.state.lastResult) {
      // Add card to inventory
      this.state.inventory = [...this.state.inventory, { ...this.state.lastResult.card }];
    }
    
    if (this.state.luckyBoostProgress >= 100) {
      this.state.currentScreen = 'reward';
    } else {
      this.state.currentScreen = 'home';
      this.state.selectedPack = null;
      this.state.lastResult = null;
    }
    saveState(this.state);
    this.notify();
  }

  // Sell card (add value to USDC balance)
  sellCard(options?: { stayOnReveal?: boolean }): void {
    if (this.state.lastResult) {
      this.state.usdcBalance += this.state.lastResult.card.value;
    }

    if (options?.stayOnReveal) {
      // Stay on card reveal; do not navigate or clear lastResult (UI swaps to Flex / Pull another)
      saveState(this.state);
      this.notify();
      return;
    }

    if (this.state.luckyBoostProgress >= 100) {
      this.state.currentScreen = 'reward';
    } else {
      if (this.state.selectedPack) {
        this.state.currentScreen = 'packDetail';
      } else {
        this.state.currentScreen = 'home';
      }
      this.state.lastResult = null;
    }
    saveState(this.state);
    this.notify();
  }

  // Claim reward (when Lucky Boost hits 100%)
  // Note: Credits are already added when milestones are reached in openPack(), so this just resets progress.
  claimReward(_rewardType: 'credits' | 'guaranteedPull'): void {
    // Credits were already added when milestones were reached in openPack()
    // Progress reset is handled in luckyBoostStore.claimMilestone()
    
    // Update gameStore's luckyBoostProgress to match the reset progress
    const luckyBoostState = luckyBoostStore.getState();
    const newProgress = Math.min(100, Math.max(0, (luckyBoostState.currentProgress / MAX_PROGRESS) * 100));
    this.state.luckyBoostProgress = newProgress;
    
    this.state.showRewardPopup = false;
    this.state.currentScreen = 'home';
    this.state.selectedPack = null;
    this.state.lastResult = null;
    
    saveState(this.state);
    this.notify();
  }

  // Claim reward credits only (e.g. after RewardModal in CardReveal). No navigation, keep lastResult.
  // Note: Credits are already added when milestones are reached in openPack(), so this just resets progress.
  claimRewardCreditsOnly(): void {
    // Credits were already added when milestones were reached in openPack()
    // Progress reset is handled in luckyBoostStore.claimMilestone()
    
    // Update gameStore's luckyBoostProgress to match the reset progress
    const luckyBoostState = luckyBoostStore.getState();
    const newProgress = Math.min(100, Math.max(0, (luckyBoostState.currentProgress / MAX_PROGRESS) * 100));
    this.state.luckyBoostProgress = newProgress;
    
    this.state.showRewardPopup = false;
    saveState(this.state);
    this.notify();
  }

  // Apply pending Lucky Boost update (called after card reveal sequence to avoid spoiling result)
  applyPendingLuckyBoostUpdate(): void {
    if (!this.state.pendingLuckyBoostUpdate) {
      return;
    }

    const { packPrice, cardValue, milestonesReached } = this.state.pendingLuckyBoostUpdate;

    // Now actually update the lucky boost store
    luckyBoostStore.addPackOpen(packPrice, cardValue);
    
    // Automatically claim milestones and add credits to gameStore
    let totalCreditsAwarded = 0;
    for (const milestoneId of milestonesReached) {
      const milestone = MILESTONES.find((m) => m.id === milestoneId);
      if (milestone && milestone.reward.credits) {
        // Claim milestone in lucky boost store
        luckyBoostStore.claimMilestone(milestoneId);
        // Add credits to gameStore
        totalCreditsAwarded += milestone.reward.credits;
      } else if (milestone && milestone.reward.guaranteedPull) {
        // Claim milestone for guaranteed pulls (no credits)
        luckyBoostStore.claimMilestone(milestoneId);
      }
    }
    
    // Add total credits awarded to gameStore credits balance
    if (totalCreditsAwarded > 0) {
      this.state.credits += totalCreditsAwarded;
    }
    
    // Update gameStore's luckyBoostProgress to match (for backward compatibility)
    // Progress is tracked in dollars, 100% = $500
    const luckyBoostState = luckyBoostStore.getState();
    const newProgress = Math.min(100, Math.max(0, (luckyBoostState.currentProgress / MAX_PROGRESS) * 100));
    
    this.state.luckyBoostProgress = newProgress;
    
    // If we hit milestones, trigger reward popup
    if (milestonesReached.length > 0 && !this.state.showRewardPopup) {
      this.state.showRewardPopup = true;
    }

    // Clear pending update
    delete this.state.pendingLuckyBoostUpdate;
    saveState(this.state);
    this.notify();
  }

  // Reset game (for testing)
  reset(): void {
    this.state = defaultState;
    saveState(this.state);
    this.notify();
  }

  // Top up USDC balance - add $1,000 to current balance
  topUp(): void {
    this.state.usdcBalance += 1000;
    saveState(this.state);
    this.notify();
  }
}

export const gameStore = new GameStore();
