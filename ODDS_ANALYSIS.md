# Odds and Win/Loss Logic Analysis

## Current Implementation Summary

### 1. Win/Loss Odds in `generateCard()` (src/game/packs.ts)

**Overall Win Rate: 20%** (80% loss rate)

The function uses a two-stage roll:
1. First roll determines win/loss: `winLossRoll >= 0.80` = WIN (20% chance)

#### Win Breakdown (20% of total packs):
- **80% of wins (16% of total packs)**: Epic cards
  - Value range: 100-109% of pack price
  - Formula: `packPrice * 1.00` to `packPrice * 1.09`
  - Example for $25 pack: $25.00 - $27.25

- **10% of wins (2% of total packs)**: Legendary cards
  - Value range: 110-180% of pack price
  - Formula: `packPrice * 1.10` to `packPrice * 1.80`
  - Example for $25 pack: $27.50 - $45.00

- **10% of wins (2% of total packs)**: Mythic cards
  - Value range: 190-300% of pack price
  - Formula: `packPrice * 1.90` to `packPrice * 3.00`
  - Example for $25 pack: $47.50 - $75.00

#### Loss Breakdown (80% of total packs):
- **60% of losses (48% of total packs)**: Common cards
  - Value range: 0-15% of pack price
  - Formula: `packPrice * 0.00` to `packPrice * 0.15`
  - Example for $25 pack: $0.00 - $3.75

- **20% of losses (16% of total packs)**: Rare cards
  - Value range: 25-40% of pack price
  - Formula: `packPrice * 0.25` to `packPrice * 0.40`
  - Example for $25 pack: $6.25 - $10.00

- **20% of losses (16% of total packs)**: Epic cards
  - Value range: 50-70% of pack price
  - Formula: `packPrice * 0.50` to `packPrice * 0.70`
  - Example for $25 pack: $12.50 - $17.50

### 2. Win/Loss Determination Logic

**Consistent across all files:**
- Win condition: `card.value >= pack.price`
- Loss condition: `card.value < pack.price`

**Files using this logic:**
- `src/game/packs.ts` (line 187): Initial determination in `generateCard()`
- `src/game/store.ts` (line 124, 183): Used in `openPack()` and result creation
- `src/lucky-boost/types.ts` (line 66): Used in `calculateProgress()`
- `src/lucky-boost/store.ts` (line 127): Used in `addPackOpen()`

**✅ Verification:**
- All win cases generate values >= pack price (100-300% range)
- All loss cases generate values < pack price (0-70% range)
- The logic is consistent and correct

### 3. Lucky Boost Progress Calculation

**Current Implementation** (`src/lucky-boost/types.ts`, `calculateProgress()`):
```typescript
const isWin = cardValue >= packPrice;
if (isWin) {
  return 0; // Wins don't add progress
}
const lostAmount = packPrice - cardValue;
return lostAmount; // Progress = lost dollars
```

**Progress System:**
- Only losses add progress
- Progress = `packPrice - cardValue` (in dollars)
- Maximum progress = $1000 = 100% meter
- Formula: `percentage = (progress / 1000) * 100`

**Milestones:**
- 5 variants, all identical: $0 to $1000, reward $25 credits
- When milestone reached, progress resets to 0 + overflow
- Overflow carries over to next milestone

### 4. Issues Found

#### ⚠️ Issue 1: Outdated Documentation in LuckyBoostModal
**Location:** `src/lucky-boost/LuckyBoostModal.tsx` (lines 169-180)

**Problem:** The modal shows an outdated formula:
- Claims: "Base progress: 6 (every pack open)"
- Claims: "Loss bonus: floor((packPrice - cardValue) / packPrice × 40), capped at 40"

**Reality:** The actual implementation is:
- Progress = `packPrice - cardValue` (only for losses)
- No base progress, no formula with floor/40

**Fix Needed:** Update the modal documentation to match actual implementation.

#### ⚠️ Issue 2: Comment Mismatch in packs.ts
**Location:** `src/game/packs.ts` (lines 15-17, 33-35, etc.)

**Problem:** Comments say "~30% win rate" but code implements 20% win rate.

**Fix Needed:** Update comments to reflect 20% win rate, or verify if 30% was intended.

#### ✅ Issue 3: Pack Odds Arrays Unused
**Location:** `src/game/packs.ts` (lines 18-24, etc.)

**Status:** The `odds` arrays in pack definitions are defined but not used in `generateCard()`. The function uses a hardcoded 20/80 split with pack-price-based ranges instead.

**Note:** This is not necessarily a bug - the odds arrays may be legacy or for display purposes only.

### 5. Edge Cases Checked

✅ **Boundary Conditions:**
- Cards at exactly pack price: Handled correctly (>= means win)
- Cards at 0 value: Handled correctly (loss, adds full pack price to progress)
- Cards at 100% of pack price: Handled correctly (win, no progress)

✅ **Rounding:**
- Values rounded to 2 decimals: `Math.round(value * 100) / 100`
- This ensures no floating-point precision issues

✅ **Progress Overflow:**
- Overflow beyond milestone end is stored and applied after reset
- Logic in `lucky-boost/store.ts` handles this correctly

### 6. Summary

**Current Odds:**
- ✅ 20% win rate, 80% loss rate (as implemented)
- ✅ Win/loss determination is consistent across all files
- ✅ Lucky boost progress calculation is correct
- ⚠️ Documentation in modal is outdated
- ⚠️ Comments mention 30% but code uses 20%

**Recommendations:**
1. Update `LuckyBoostModal.tsx` to show correct formula: "Progress = pack price - card value (for losses only)"
2. Update comments in `packs.ts` to reflect 20% win rate
3. Consider removing or documenting the unused `odds` arrays in pack definitions
