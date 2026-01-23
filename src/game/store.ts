import { GameState, PackOpenResult } from './types';
import { generateCard, PACKS } from './packs';
import { luckyBoostStore } from '../lucky-boost/store';
import { MILESTONES, calculateProgress, MAX_PROGRESS, getRandomMilestoneVariant } from '../lucky-boost/types';

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
      // Clear credits toast state on load - it should only show when explicitly triggered
      loadedState.showCreditsDropdown = false;
      loadedState.creditsStartBalance = undefined;
      return loadedState;
    }
  } catch (e) {
    console.error('Failed to load game state:', e);
  }
  return defaultState;
}

function saveState(state: GameState): void {
  try {
    // Don't save currentScreen, usdcBalance, showCreditsDropdown, or creditsStartBalance to localStorage
    // Balance resets each session, so we don't persist it
    // Credits toast state should not persist - it should only show when explicitly triggered
    const { currentScreen, usdcBalance, showCreditsDropdown, creditsStartBalance, ...stateToSave } = state;
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
    
    // ALWAYS clear credits toast state on initialization
    // It should only be set when user explicitly clicks "Claim" after meter fills
    this.state.showCreditsDropdown = false;
    this.state.creditsStartBalance = undefined;
    
    // Reset balance when user leaves the session (beforeunload)
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        // Balance will reset on next session start since it's not persisted
        this.state.usdcBalance = defaultState.usdcBalance;
        // Clear toast state on unload
        this.state.showCreditsDropdown = false;
        this.state.creditsStartBalance = undefined;
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
    // CRITICAL DEFENSIVE CHECK: If showCreditsDropdown is true but credits didn't actually increase, clear it
    // This prevents the toast from showing when it shouldn't - runs on EVERY notify
    if (this.state.showCreditsDropdown === true) {
      const hasValidIncrease = this.state.creditsStartBalance !== undefined &&
                               typeof this.state.creditsStartBalance === 'number' &&
                               this.state.credits > this.state.creditsStartBalance &&
                               (this.state.credits - this.state.creditsStartBalance) >= 0.01 &&
                               !(this.state.credits === 0 && this.state.creditsStartBalance === 0);
      
      if (!hasValidIncrease) {
        // Invalid state detected - clear it immediately before notifying
        this.state.showCreditsDropdown = false;
        this.state.creditsStartBalance = undefined;
      }
    }
    
    this.listeners.forEach((listener) => listener());
  }

  // Navigation
  navigateTo(screen: GameState['currentScreen']): void {
    // ALWAYS clear credits toast state when navigating
    // The toast should only show when user clicks "Claim" after meter fills
    // We'll set it again in claimRewardCreditsOnly if needed
    this.state.showCreditsDropdown = false;
    this.state = { ...this.state, currentScreen: screen };
    this.notify();
  }

  selectPack(pack: GameState['selectedPack']): void {
    this.state = { ...this.state, selectedPack: pack };
    this.notify();
  }

  // Lucky Boost calculation (for display purposes)
  // Uses the same formula as calculateProgress in lucky-boost/types.ts
  // Loss: progress = pack price - card value; $1000 = 100%
  calculateLuckyBoostProgress(packPrice: number, cardValue: number): number {
    const isWin = cardValue >= packPrice;
    if (isWin) return 0;
    return packPrice - cardValue;
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

    // Only calculate progress and update meter if it's a loss (card value < pack price)
    // Wins (20% of packs) don't add to meter and don't show meter UI
    const isWin = card.value >= pack.price;
    
    // Clear any previous reward popup state when opening a new pack
    // This ensures we don't show the popup incorrectly
    this.state.showRewardPopup = false;
    
    // ALWAYS clear credits toast state when opening a new pack
    // This prevents the toast from showing randomly when meter bar hasn't loaded
    // The toast should ONLY show when user clicks "Claim" after meter fills
    this.state.showCreditsDropdown = false;
    this.state.creditsStartBalance = undefined;
    
    if (!isWin) {
      // Calculate what the progress update would be, but don't apply it yet
      // Store it as pending to avoid spoiling the result in the header
      const progressAdded = calculateProgress(pack.price, card.value);
      
      // Calculate what milestones would be reached (without actually updating stores)
      // IMPORTANT: Get fresh state to ensure we're using the reset progress after claiming
      const currentState = luckyBoostStore.getState();
      const currentMilestone = MILESTONES[currentState.currentMilestoneIndex];
      let milestonesReached: number[] = [];
      
      if (currentMilestone && progressAdded > 0) {
        const newProgress = currentState.currentProgress + progressAdded;
        
        // Check if we've reached the milestone (100% = $1000)
        // Only mark as reached if we're NOT already at/past the milestone
        // This prevents showing popup again if progress wasn't properly reset
        if (newProgress >= currentMilestone.end && currentState.currentProgress < currentMilestone.end) {
          // Randomly select one of the 5 milestone variants (ids 1-5)
          const selectedVariant = getRandomMilestoneVariant();
          milestonesReached.push(selectedVariant);
        }
      }
      
      // Store pending update (will be applied after card reveal sequence)
      const selectedVariant = milestonesReached.length > 0 ? milestonesReached[0] : undefined;
      this.state.pendingLuckyBoostUpdate = {
        packPrice: pack.price,
        cardValue: card.value,
        milestonesReached,
        selectedMilestoneVariant: selectedVariant,
      };
      
      // Calculate what the new progress would be for display purposes (but don't update stores)
      // Progress is tracked in dollars, 100% = $1000
      const luckyBoostState = luckyBoostStore.getState();
      const newProgressDollars = luckyBoostState.currentProgress + progressAdded;
      const newProgress = Math.min(100, Math.max(0, (newProgressDollars / MAX_PROGRESS) * 100));
      
      // Update local progress for calculation purposes (stores will be updated later)
      this.state.luckyBoostProgress = newProgress;
    } else {
      // Win: don't add to meter, clear any pending update
      this.state.pendingLuckyBoostUpdate = undefined;
      // Keep current progress unchanged
      const luckyBoostState = luckyBoostStore.getState();
      const currentProgress = Math.min(100, Math.max(0, (luckyBoostState.currentProgress / MAX_PROGRESS) * 100));
      this.state.luckyBoostProgress = currentProgress;
    }

    const result: PackOpenResult = {
      card,
      packPrice: pack.price,
      isWin: card.value >= pack.price,
      timestamp: Date.now(),
      theme: pack.theme,
    };

    // Ensure state and result are properly defined before proceeding
    if (!this.state) {
      throw new Error('Game state is undefined.');
    }
    if (!result) {
      throw new Error('Result is undefined.');
    }

    this.state.lastResult = result;
    saveState(this.state);
    this.notify();

    return result;
  }

  // Keep card (add to inventory and return to home)
  keepCard(options?: { stayOnReveal?: boolean }): void {
    if (this.state.lastResult) {
      // Add card to inventory
      this.state.inventory = [...this.state.inventory, { ...this.state.lastResult.card }];
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
      // Add card value to USDC balance
      this.state.usdcBalance += this.state.lastResult.card.value;

      // Optionally clear lastResult so card can't be sold again
      if (!options?.stayOnReveal) {
        this.state.lastResult = null;
      }
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
    
    // Show credits toast ONLY if:
    // 1. creditsStartBalance is set (milestone was reached and credits were awarded)
    // 2. Credits actually increased by at least 0.01 (credits > creditsStartBalance) - validates it's not stale
    // 3. This is called when user clicks "Keep playing" button
    const hasValidCreditsIncrease = this.state.creditsStartBalance !== undefined && 
                                    typeof this.state.creditsStartBalance === 'number' &&
                                    this.state.credits > this.state.creditsStartBalance &&
                                    (this.state.credits - this.state.creditsStartBalance) >= 0.01;
    
    if (hasValidCreditsIncrease) {
      // User clicked "Keep playing" - show the toast
      this.state.showCreditsDropdown = true;
    } else {
      // No valid credits to show - clear state immediately
      this.state.showCreditsDropdown = false;
      this.state.creditsStartBalance = undefined;
    }
    
    saveState(this.state);
    this.notify();
  }

  // Clear reward popup (used when showing RewardModal in CardRevealScreen instead)
  clearRewardPopup(): void {
    this.state.showRewardPopup = false;
    saveState(this.state);
    this.notify();
  }

  // Clear credits dropdown flag (used after animation completes)
  clearCreditsDropdown(): void {
    this.state.showCreditsDropdown = false;
    this.state.creditsStartBalance = undefined;
    saveState(this.state);
    this.notify();
  }

  // Claim reward credits only (e.g. after RewardModal in CardReveal). No navigation, keep lastResult.
  // Note: Credits are already added when milestones are reached in openPack(), so this just resets progress.
  // THIS IS THE ONLY PLACE WHERE showCreditsDropdown SHOULD BE SET TO TRUE
  claimRewardCreditsOnly(): void {
    // Credits were already added when milestones were reached in openPack()
    // Progress reset is handled in luckyBoostStore.claimMilestone()
    
    // Update gameStore's luckyBoostProgress to match the reset progress
    const luckyBoostState = luckyBoostStore.getState();
    const newProgress = Math.min(100, Math.max(0, (luckyBoostState.currentProgress / MAX_PROGRESS) * 100));
    this.state.luckyBoostProgress = newProgress;
    
    this.state.showRewardPopup = false;
    
    // Show credits toast ONLY if:
    // 1. creditsStartBalance is set (milestone was reached and credits were awarded)
    // 2. Credits actually increased by at least 0.01 (credits > creditsStartBalance) - validates it's not stale
    // 3. This is called when user clicks "Claim" button
    const hasValidCreditsIncrease = this.state.creditsStartBalance !== undefined && 
                                    typeof this.state.creditsStartBalance === 'number' &&
                                    this.state.credits > this.state.creditsStartBalance &&
                                    (this.state.credits - this.state.creditsStartBalance) >= 0.01;
    
    if (hasValidCreditsIncrease) {
      // User clicked "Claim" - show the toast
      this.state.showCreditsDropdown = true;
    } else {
      // No valid credits to show - clear state immediately
      this.state.showCreditsDropdown = false;
      this.state.creditsStartBalance = undefined;
    }
    
    saveState(this.state);
    this.notify();
  }

  // Apply pending Lucky Boost update (called after card reveal sequence to avoid spoiling result)
  applyPendingLuckyBoostUpdate(): void {
    if (!this.state.pendingLuckyBoostUpdate) {
      return;
    }

    const { packPrice, cardValue, milestonesReached } = this.state.pendingLuckyBoostUpdate;

    // Check if we're about to reach a milestone BEFORE adding progress
    const wasAboutToReachMilestone = milestonesReached.length > 0;
    
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
    if (totalCreditsAwarded > 0 && totalCreditsAwarded >= 0.01) {
      // Store the starting balance before adding credits
      // Don't show toast yet - it will be shown when user clicks "Claim" button
      this.state.creditsStartBalance = this.state.credits;
      this.state.credits += totalCreditsAwarded;
      // Note: showCreditsDropdown will be set to true when user clicks "Claim" button
      // Make sure it's false here - only set to true when user explicitly claims
      this.state.showCreditsDropdown = false;
    } else {
      // No credits awarded or amount is too small, clear any stale state
      this.state.creditsStartBalance = undefined;
      this.state.showCreditsDropdown = false;
    }
    
    // Update gameStore's luckyBoostProgress to match (for backward compatibility)
    // Progress is tracked in dollars, 100% = $1000
    const luckyBoostState = luckyBoostStore.getState();
    const newProgress = Math.min(100, Math.max(0, (luckyBoostState.currentProgress / MAX_PROGRESS) * 100));
    
    this.state.luckyBoostProgress = newProgress;
    
    // Only trigger reward popup if we JUST reached 100% in THIS pack open
    // We check this BEFORE claiming the milestone, because after claiming, progress is reset
    // NOTE: Don't set showRewardPopup here if we're on cardReveal screen - CardRevealScreen
    // will handle showing RewardModal itself to avoid duplicate popups
    if (wasAboutToReachMilestone && !this.state.showRewardPopup && this.state.currentScreen !== 'cardReveal') {
      // We reached 100% in this pack open, show the reward popup
      this.state.showRewardPopup = true;
    } else if (wasAboutToReachMilestone && this.state.currentScreen === 'cardReveal') {
      // On cardReveal screen, ensure the popup flag is cleared so RewardPopup doesn't show
      // CardRevealScreen will show RewardModal instead
      this.state.showRewardPopup = false;
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
