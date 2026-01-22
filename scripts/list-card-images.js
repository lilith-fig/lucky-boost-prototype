/**
 * Auto-detect card images from public/cards/pokemon and public/cards/op.
 * Writes src/game/utils/cardImageManifest.json for use at runtime.
 * Run via: node scripts/list-card-images.js (or predev/prebuild).
 * Note: onepiece theme uses the 'op' directory.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CARDS_DIR = path.join(ROOT, 'public', 'cards');
const OUT_PATH = path.join(ROOT, 'src', 'game', 'utils', 'cardImageManifest.json');

const THEMES = ['pokemon', 'onepiece'];
const IMG_EXT = new Set(['.avif', '.png', '.jpg', '.jpeg', '.webp', '.gif']);

// Map theme names to directory names (onepiece theme uses 'op' directory)
const THEME_DIR_MAP = {
  pokemon: 'pokemon',
  onepiece: 'op',
};

function listImages(theme) {
  const dirName = THEME_DIR_MAP[theme] || theme;
  const dir = path.join(CARDS_DIR, dirName);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return [];
  }
  const names = fs.readdirSync(dir);
  const files = names
    .filter((n) => IMG_EXT.has(path.extname(n).toLowerCase()))
    .sort();
  return files.map((f) => `/cards/${dirName}/${f}`);
}

const manifest = {
  pokemon: listImages('pokemon'),
  onepiece: listImages('onepiece'),
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Card image manifest written to', OUT_PATH);
