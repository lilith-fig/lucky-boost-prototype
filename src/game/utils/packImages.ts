// Pack image management
// Images should be placed in /public/packs/ folder
// Format: {theme}.webp (e.g., pokemon.webp, onepiece.webp)

export function getPackImagePath(pack: { theme: string }): string {
  return `/packs/${pack.theme}.webp`;
}
