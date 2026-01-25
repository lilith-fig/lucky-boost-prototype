// Pack image management
// Images should be placed in /public/packs/ folder
// Format: pack-{theme}-{tierNumber}.webp (e.g., pack-pokemon-1.webp, pack-onepiece-4.webp)
// Tier numbers: 1 = starter (cheapest), 2 = collector, 3 = elite, 4 = master (most expensive)

const tierToNumber: Record<string, number> = {
  starter: 1,
  collector: 2,
  elite: 3,
  master: 4,
};

export function getPackImagePath(pack: { theme: string; tier: string }): string {
  const tierNumber = tierToNumber[pack.tier] || 1;
  return `/packs/pack-${pack.theme}-${tierNumber}.webp`;
}
