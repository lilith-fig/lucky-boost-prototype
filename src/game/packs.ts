import { Pack } from './types';

// Pack definitions with odds
// Suggested win rate: ~30% (card value >= pack price)
// Suggested odds ensure balanced gameplay with 30% win rate
export const PACKS: Pack[] = [
  // Pokemon Packs
  {
    id: 'pokemon-starter',
    name: 'Pokémon Starter Pack',
    description: '',
    price: 25,
    theme: 'pokemon',
    tier: 'starter',
    // Suggested odds for ~30% win rate at $25:
    // Loss (70%): common/rare mostly, some epic
    // Win (30%): epic/legendary/mythic
    odds: [
      { rarity: 'common', probability: 0.60, minValue: 0.10, maxValue: 1.00 },
      { rarity: 'rare', probability: 0.25, minValue: 1.00, maxValue: 5.00 },
      { rarity: 'epic', probability: 0.10, minValue: 5.00, maxValue: 25.00 },
      { rarity: 'legendary', probability: 0.04, minValue: 25.00, maxValue: 150.00 },
      { rarity: 'mythic', probability: 0.01, minValue: 150.00, maxValue: 1200.00 },
    ],
  },
  {
    id: 'pokemon-collector',
    name: 'Pokémon Collector Pack',
    description: '',
    price: 50,
    theme: 'pokemon',
    tier: 'collector',
    // Suggested odds for ~30% win rate at $50:
    // Loss (70%): common/rare mostly, some epic
    // Win (30%): epic/legendary/mythic
    odds: [
      { rarity: 'common', probability: 0.50, minValue: 0.50, maxValue: 2.00 },
      { rarity: 'rare', probability: 0.30, minValue: 2.00, maxValue: 10.00 },
      { rarity: 'epic', probability: 0.15, minValue: 10.00, maxValue: 50.00 },
      { rarity: 'legendary', probability: 0.04, minValue: 50.00, maxValue: 300.00 },
      { rarity: 'mythic', probability: 0.01, minValue: 300.00, maxValue: 4000.00 },
    ],
  },
  {
    id: 'pokemon-elite',
    name: 'Pokémon Elite Pack',
    description: '',
    price: 100,
    theme: 'pokemon',
    tier: 'elite',
    // Suggested odds for ~30% win rate at $100:
    // Loss (70%): common/rare mostly, some epic
    // Win (30%): epic/legendary/mythic
    odds: [
      { rarity: 'common', probability: 0.40, minValue: 1.00, maxValue: 5.00 },
      { rarity: 'rare', probability: 0.30, minValue: 5.00, maxValue: 25.00 },
      { rarity: 'epic', probability: 0.20, minValue: 25.00, maxValue: 100.00 },
      { rarity: 'legendary', probability: 0.08, minValue: 100.00, maxValue: 500.00 },
      { rarity: 'mythic', probability: 0.02, minValue: 500.00, maxValue: 4000.00 },
    ],
  },
  {
    id: 'pokemon-master',
    name: 'Pokémon Master Pack',
    description: '',
    price: 250,
    theme: 'pokemon',
    tier: 'master',
    // Suggested odds for ~30% win rate at $250:
    // Loss (70%): epic mostly (values below $250)
    // Win (30%): legendary/mythic (values >= $250)
    odds: [
      { rarity: 'epic', probability: 0.50, minValue: 25.00, maxValue: 100.00 },
      { rarity: 'legendary', probability: 0.35, minValue: 100.00, maxValue: 500.00 },
      { rarity: 'mythic', probability: 0.15, minValue: 500.00, maxValue: 4000.00 },
    ],
  },
  // One-Piece Packs
  {
    id: 'onepiece-starter',
    name: 'One-Piece Starter Pack',
    description: '',
    price: 25,
    theme: 'onepiece',
    tier: 'starter',
    // Suggested odds for ~30% win rate at $25
    odds: [
      { rarity: 'common', probability: 0.60, minValue: 0.10, maxValue: 1.00 },
      { rarity: 'rare', probability: 0.25, minValue: 1.00, maxValue: 5.00 },
      { rarity: 'epic', probability: 0.10, minValue: 5.00, maxValue: 25.00 },
      { rarity: 'legendary', probability: 0.04, minValue: 25.00, maxValue: 150.00 },
      { rarity: 'mythic', probability: 0.01, minValue: 150.00, maxValue: 1200.00 },
    ],
  },
  {
    id: 'onepiece-collector',
    name: 'One-Piece Collector Pack',
    description: '',
    price: 50,
    theme: 'onepiece',
    tier: 'collector',
    // Suggested odds for ~30% win rate at $50
    odds: [
      { rarity: 'common', probability: 0.50, minValue: 0.50, maxValue: 2.00 },
      { rarity: 'rare', probability: 0.30, minValue: 2.00, maxValue: 10.00 },
      { rarity: 'epic', probability: 0.15, minValue: 10.00, maxValue: 50.00 },
      { rarity: 'legendary', probability: 0.04, minValue: 50.00, maxValue: 300.00 },
      { rarity: 'mythic', probability: 0.01, minValue: 300.00, maxValue: 4000.00 },
    ],
  },
  {
    id: 'onepiece-elite',
    name: 'One-Piece Elite Pack',
    description: '',
    price: 100,
    theme: 'onepiece',
    tier: 'elite',
    // Suggested odds for ~30% win rate at $100
    odds: [
      { rarity: 'common', probability: 0.40, minValue: 1.00, maxValue: 5.00 },
      { rarity: 'rare', probability: 0.30, minValue: 5.00, maxValue: 25.00 },
      { rarity: 'epic', probability: 0.20, minValue: 25.00, maxValue: 100.00 },
      { rarity: 'legendary', probability: 0.08, minValue: 100.00, maxValue: 500.00 },
      { rarity: 'mythic', probability: 0.02, minValue: 500.00, maxValue: 4000.00 },
    ],
  },
  {
    id: 'onepiece-master',
    name: 'One-Piece Master Pack',
    description: '',
    price: 250,
    theme: 'onepiece',
    tier: 'master',
    // Suggested odds for ~30% win rate at $250
    odds: [
      { rarity: 'epic', probability: 0.50, minValue: 25.00, maxValue: 100.00 },
      { rarity: 'legendary', probability: 0.35, minValue: 100.00, maxValue: 500.00 },
      { rarity: 'mythic', probability: 0.15, minValue: 500.00, maxValue: 4000.00 },
    ],
  },
];

// Card name pools by rarity
const CARD_NAMES: Record<string, string[]> = {
  common: [
    'Basic Warrior', 'Novice Mage', 'Young Scout', 'Apprentice Knight',
    'Rookie Guard', 'Trainee Archer', 'Fresh Recruit', 'Beginner Hero',
  ],
  rare: [
    'Veteran Warrior', 'Experienced Mage', 'Elite Scout', 'Seasoned Knight',
    'Skilled Guard', 'Master Archer', 'Battle Veteran', 'Heroic Warrior',
  ],
  epic: [
    'Champion Warrior', 'Archmage', 'Shadow Scout', 'Dragon Knight',
    'Royal Guard', 'Elite Archer', 'War Hero', 'Legendary Warrior',
  ],
  legendary: [
    'Dragon Slayer', 'Grand Archmage', 'Shadow Master', 'Dragon Lord',
    'Royal Champion', 'Elite Master', 'War Legend', 'Mythic Warrior',
  ],
  mythic: [
    'Ancient Dragon', 'God of War', 'Eternal Phoenix', 'Cosmic Guardian',
    'Divine Emperor', 'Infinite Void', 'Celestial Being', 'Primordial Force',
  ],
};

// Seeded random number generator
function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// Generate a random card based on pack odds
// Ensures 30% win rate (card value >= pack price)
export function generateCard(pack: Pack, seed?: number): import('./types').Card {
  const rng = seed !== undefined ? seededRandom(seed) : () => Math.random();
  
  // First determine if this is a win (30% chance)
  const winRoll = rng();
  const isWin = winRoll < 0.30;
  
  let selectedOdds;
  let value: number;
  
  if (isWin) {
    // WIN: Generate a card with value >= pack price
    // Filter odds that can produce wins (maxValue >= pack price)
    const winningOdds = pack.odds.filter(odds => odds.maxValue >= pack.price);
    
    if (winningOdds.length === 0) {
      // Fallback: use highest tier odds
      selectedOdds = pack.odds[pack.odds.length - 1];
    } else {
      // Select from winning odds based on their probabilities
      const rand = rng();
      let cumulative = 0;
      const totalWinProb = winningOdds.reduce((sum, odds) => sum + odds.probability, 0);
      
      for (const odds of winningOdds) {
        cumulative += odds.probability / totalWinProb;
        if (rand <= cumulative) {
          selectedOdds = odds;
          break;
        }
      }
      if (!selectedOdds) {
        selectedOdds = winningOdds[winningOdds.length - 1];
      }
    }
    
    // Generate value >= pack price
    const minValue = Math.max(selectedOdds.minValue, pack.price);
    const valueRange = selectedOdds.maxValue - minValue;
    const valueRand = rng();
    value = minValue + valueRange * valueRand;
  } else {
    // LOSS: Generate a card with value < pack price
    // Filter odds that can produce losses (minValue < pack price)
    const losingOdds = pack.odds.filter(odds => odds.minValue < pack.price);
    
    if (losingOdds.length === 0) {
      // Fallback: use lowest tier odds
      selectedOdds = pack.odds[0];
    } else {
      // Select from losing odds based on their probabilities
      const rand = rng();
      let cumulative = 0;
      const totalLossProb = losingOdds.reduce((sum, odds) => sum + odds.probability, 0);
      
      for (const odds of losingOdds) {
        cumulative += odds.probability / totalLossProb;
        if (rand <= cumulative) {
          selectedOdds = odds;
          break;
        }
      }
      if (!selectedOdds) {
        selectedOdds = losingOdds[0];
      }
    }
    
    // Generate value < pack price
    const maxValue = Math.min(selectedOdds.maxValue, pack.price * 0.99); // 99% of pack price to ensure loss
    const valueRange = maxValue - selectedOdds.minValue;
    const valueRand = rng();
    value = selectedOdds.minValue + valueRange * valueRand;
  }
  
  const roundedValue = Math.round(value * 100) / 100; // Round to 2 decimals

  // Select random name from pool
  const names = CARD_NAMES[selectedOdds.rarity] || ['Unknown Card'];
  const nameRand = rng();
  const name = names[Math.floor(nameRand * names.length)];

  return {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    rarity: selectedOdds.rarity,
    value: roundedValue,
  };
}
