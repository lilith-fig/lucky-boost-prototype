/**
 * Auto-detect card images from public/cards/pokemon and public/cards/onepiece.
 * Writes src/game/utils/cardImageManifest.json for use at runtime.
 * Run via: node scripts/list-card-images.js (or predev/prebuild).
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

function listImages(theme) {
  const dir = path.join(CARDS_DIR, theme);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return [];
  }
  const names = fs.readdirSync(dir);
  const files = names
    .filter((n) => IMG_EXT.has(path.extname(n).toLowerCase()))
    .sort();
  return files.map((f) => `/cards/${theme}/${f}`);
}

const manifest = {
  pokemon: listImages('pokemon'),
  onepiece: listImages('onepiece'),
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Card image manifest written to', OUT_PATH);
