import { GameState, PackOpenResult } from './types';
import { generateCard, PACKS } from './packs';
import { luckyBoostStore } from '../lucky-boost/store';
import { MILESTONES } from '../lucky-boost/types';

const STORAGE_KEY = 'gachaGameState';

const defaultState: GameState = {
  usdcBalance: 5000, // Starting USDC balance ($5,000.00)
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
      return { ...defaultState, ...parsed, currentScreen: 'home' }; // Always start at home
    }
  } catch (e) {
    console.error('Failed to load game state:', e);
  }
  return defaultState;
}

function saveState(state: GameState): void {
  try {
    // Don't save currentScreen to localStorage
    const { currentScreen, ...stateToSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
}

class GameStore {
  private state: GameState = loadState();
  private listeners: Set<() => void> = new Set();

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

  // Lucky Boost calculation (as per requirements)
  calculateLuckyBoostProgress(packPrice: number, cardValue: number): number {
    // Only losses can build up lucky boost progress
    const isWin = cardValue >= packPrice;
    
    if (isWin) {
      return 0; // Wins don't contribute to progress
    }
    
    // Loss bonus calculation
    const lossRatio = (packPrice - cardValue) / packPrice;
    const lossBonus = Math.min(12, Math.round(lossRatio * 12));
    
    return lossBonus;
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

    // Update Lucky Boost progress in the lucky boost store
    const { milestonesReached } = luckyBoostStore.addPackOpen(
      pack.price,
      card.value
    );
    
    // Update gameStore's luckyBoostProgress to match (for backward compatibility)
    const luckyBoostState = luckyBoostStore.getState();
    // Convert milestone-based progress to 0-100 scale for gameStore
    // This is a simple mapping: if progress is in first milestone (0-100), use it directly
    // Otherwise, calculate percentage within current milestone
    let newProgress = 0;
    if (luckyBoostState.currentProgress <= 100) {
      newProgress = luckyBoostState.currentProgress;
    } else {
      // For milestones beyond the first, map to 0-100 scale
      // Find current milestone and calculate percentage
      const milestoneIndex = luckyBoostState.currentMilestoneIndex;
      if (milestoneIndex < MILESTONES.length) {
        const current = MILESTONES[milestoneIndex];
        const range = current.end - current.start;
        const progressInMilestone = luckyBoostState.currentProgress - current.start;
        newProgress = Math.min(100, (progressInMilestone / range) * 100);
      } else {
        newProgress = 100;
      }
    }
    
    this.state.luckyBoostProgress = newProgress;
    
    // If we hit milestones, trigger reward popup
    if (milestonesReached.length > 0 && !this.state.showRewardPopup) {
      this.state.showRewardPopup = true;
    }

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
  sellCard(): void {
    if (this.state.lastResult) {
      this.state.usdcBalance += this.state.lastResult.card.value;
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

  // Claim reward (when Lucky Boost hits 100%)
  claimReward(rewardType: 'credits' | 'guaranteedPull'): void {
    if (rewardType === 'credits') {
      this.state.usdcBalance += 25;
    } else {
      // Guaranteed pull - for now just add a note, could implement later
      // For prototype, we'll just give USDC equivalent
      this.state.usdcBalance += 25;
    }
    
    // Apply overflow from previous 100% completion
    const overflow = (this.state as any).overflow || 0;
    this.state.luckyBoostProgress = overflow;
    delete (this.state as any).overflow;
    
    this.state.showRewardPopup = false;
    this.state.currentScreen = 'home';
    this.state.selectedPack = null;
    this.state.lastResult = null;
    
    saveState(this.state);
    this.notify();
  }

  // Claim reward credits only (e.g. after RewardModal in CardReveal). No navigation, keep lastResult.
  claimRewardCreditsOnly(): void {
    this.state.usdcBalance += 25;
    const overflow = (this.state as any).overflow || 0;
    this.state.luckyBoostProgress = overflow;
    delete (this.state as any).overflow;
    this.state.showRewardPopup = false;
    saveState(this.state);
    this.notify();
  }

  // Reset game (for testing)
  reset(): void {
    this.state = defaultState;
    saveState(this.state);
    this.notify();
  }

  // Top up USDC balance - add $5,000 to current balance
  topUp(): void {
    this.state.usdcBalance += 5000;
    saveState(this.state);
    this.notify();
  }
}

export const gameStore = new GameStore();
