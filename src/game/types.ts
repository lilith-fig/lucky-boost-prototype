export interface Card {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  value: number;
  imageUrl?: string;
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  theme: 'pokemon' | 'onepiece';
  tier: 'starter' | 'collector' | 'elite' | 'master';
  imageUrl?: string;
  odds: {
    rarity: Card['rarity'];
    probability: number; // 0-1
    minValue: number;
    maxValue: number;
  }[];
}

export interface PackOpenResult {
  card: Card;
  packPrice: number;
  isWin: boolean; // cardValue >= packPrice
  timestamp: number;
  theme: 'pokemon' | 'onepiece';
}

export interface GameState {
  usdcBalance: number; // USDC balance (used for pack purchases)
  credits: number; // Credits balance (legacy, may be used for other features)
  packsOpened: number;
  luckyBoostProgress: number; // 0-100, with overflow
  currentScreen: 'home' | 'packDetail' | 'opening' | 'cardBack' | 'cardReveal' | 'reward';
  selectedPack: Pack | null;
  lastResult: PackOpenResult | null;
  showRewardPopup: boolean;
  inventory: Card[]; // Collection of kept cards
  showCreditsDropdown?: boolean; // Show credits dropdown when credits are awarded
  creditsStartBalance?: number; // Starting balance for count-up animation
  pendingLuckyBoostUpdate?: {
    packPrice: number;
    cardValue: number;
    milestonesReached: number[];
    selectedMilestoneVariant?: number; // The randomly selected milestone variant ID (1-5)
  };
}

export type Screen = GameState['currentScreen'];
