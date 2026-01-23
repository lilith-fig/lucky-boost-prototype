import { Pack } from './types';

// Pack definitions with odds
// New odds system: 80% loss rate, 20% win rate
// Odds are now calculated dynamically in generateCard() based on pack price
export const PACKS: Pack[] = [
  // Pokemon Packs
  {
    id: 'pokemon-starter',
    name: 'Pokémon Starter Pack',
    description: '',
    price: 25,
    theme: 'pokemon',
    tier: 'starter',
    // Odds: 20% win rate, 80% loss rate
    // Loss (80%): common/rare/epic with values below pack price
    // Win (20%): epic/legendary/mythic with values >= pack price
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
    // Odds: 20% win rate, 80% loss rate
    // Loss (80%): common/rare/epic with values below pack price
    // Win (20%): epic/legendary/mythic with values >= pack price
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
    // Odds: 20% win rate, 80% loss rate
    // Loss (80%): common/rare/epic with values below pack price
    // Win (20%): epic/legendary/mythic with values >= pack price
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
    // Odds: 20% win rate, 80% loss rate
    // Loss (80%): epic mostly (values below pack price)
    // Win (20%): legendary/mythic (values >= pack price)
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
    // Odds: 20% win rate, 80% loss rate
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
    // Odds: 20% win rate, 80% loss rate
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
    // Odds: 20% win rate, 80% loss rate
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
    // Odds: 20% win rate, 80% loss rate
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

// Generate a random card based on new odds system
// 80% loss rate, 20% win rate with specific value ranges
export function generateCard(pack: Pack, seed?: number): import('./types').Card {
  const rng = seed !== undefined ? seededRandom(seed) : () => Math.random();
  
  const packPrice = pack.price;
  let value: number;
  let rarity: string;
  
  // First determine if this is a win (20% chance) or loss (80% chance)
  const winLossRoll = rng();
  const isWin = winLossRoll >= 0.80; // 20% win rate
  
  if (isWin) {
    // WIN (20% of total):
    const winTypeRoll = rng();
    
    if (winTypeRoll < 0.80) {
      // 80% of wins (16% of total): 100-109% of pack value
      const minValue = packPrice * 1.00;
      const maxValue = packPrice * 1.09;
      value = minValue + (maxValue - minValue) * rng();
      rarity = 'epic';
    } else if (winTypeRoll < 0.90) {
      // 10% of wins (2% of total): 110-180% of pack value
      const minValue = packPrice * 1.10;
      const maxValue = packPrice * 1.80;
      value = minValue + (maxValue - minValue) * rng();
      rarity = 'legendary';
    } else {
      // 10% of wins (2% of total): 190-300% of pack value
      const minValue = packPrice * 1.90;
      const maxValue = packPrice * 3.00;
      value = minValue + (maxValue - minValue) * rng();
      rarity = 'mythic';
    }
  } else {
    // LOSS (80% of total):
    const lossTypeRoll = rng();
    
    if (lossTypeRoll < 0.60) {
      // 60% of losses (48% of total): 0-15% of pack value
      const minValue = packPrice * 0.00;
      const maxValue = packPrice * 0.15;
      value = minValue + (maxValue - minValue) * rng();
      rarity = 'common';
    } else if (lossTypeRoll < 0.80) {
      // 20% of losses (16% of total): 25-40% of pack value
      const minValue = packPrice * 0.25;
      const maxValue = packPrice * 0.40;
      value = minValue + (maxValue - minValue) * rng();
      rarity = 'rare';
    } else {
      // 20% of losses (16% of total): 50-70% of pack value
      const minValue = packPrice * 0.50;
      const maxValue = packPrice * 0.70;
      value = minValue + (maxValue - minValue) * rng();
      rarity = 'epic';
    }
  }
  
  const roundedValue = Math.round(value * 100) / 100; // Round to 2 decimals

  // Select random name from pool based on rarity
  const names = CARD_NAMES[rarity] || ['Unknown Card'];
  const nameRand = rng();
  const name = names[Math.floor(nameRand * names.length)];

  return {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    rarity: rarity as 'common' | 'rare' | 'epic' | 'legendary' | 'mythic',
    value: roundedValue,
  };
}
