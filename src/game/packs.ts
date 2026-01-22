import { Pack } from './types';

// Pack definitions with odds
export const PACKS: Pack[] = [
  // Pokemon Packs
  {
    id: 'pokemon-starter',
    name: 'Pokémon Starter Pack',
    description: '',
    price: 25,
    theme: 'pokemon',
    tier: 'starter',
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
export function generateCard(pack: Pack, seed?: number): import('./types').Card {
  const rng = seed !== undefined ? seededRandom(seed) : () => Math.random();
  
  const rand = rng();
  
  // Select rarity based on probabilities
  let cumulative = 0;
  let selectedOdds = pack.odds[0];
  for (const odds of pack.odds) {
    cumulative += odds.probability;
    if (rand <= cumulative) {
      selectedOdds = odds;
      break;
    }
  }

  // Generate value within range
  const valueRange = selectedOdds.maxValue - selectedOdds.minValue;
  const valueRand = rng();
  const value = selectedOdds.minValue + valueRange * valueRand;
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
