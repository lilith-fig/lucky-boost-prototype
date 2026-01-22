# Lucky Boost Prototype

An interactive prototype for the "Lucky Boost" feature in a pack-opening web app. This prototype demonstrates the complete Lucky Boost system with realistic numbers, smooth animations, and full persistence.

## Features

- **Header Meter**: Always-visible compact view with hover tooltip and click-to-open modal
- **Progress System**: Base progress for wins, bonus progress for losses (bigger losses = more progress)
- **Milestone Rewards**: Credits and guaranteed pulls at specific progress thresholds
- **History Tracking**: Last 10 pack opens with detailed information
- **Persistence**: All progress saved to localStorage
- **Animations**: Smooth progress animations and celebratory milestone popups

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

### Demo Mode

The prototype includes a demo page with controls to:

1. **Open Pack**: Simulates a pack opening with deterministic results
2. **View Progress**: Hover over the Lucky Boost meter to see detailed progress
3. **Open Modal**: Click the meter to see the full Lucky Boost interface
4. **Claim Rewards**: When milestones are reached, claim rewards from the popup
5. **Reset**: Clear all progress and start fresh

### Progress Formula

- **Base Progress**: 6 (every pack open)
- **Loss Bonus**: `floor((packPrice - cardValue) / packPrice × 40)`, capped at 40
- **Total**: base + lossBonus (if loss) or just base (if win)

### Milestones

1. **0 → 100**: $5 credits
2. **100 → 220**: $10 credits
3. **220 → 360**: 1 guaranteed pull ≥ $15
4. **360 → 540**: $25 credits
5. **540 → 800**: 1 guaranteed pull ≥ $25

## Project Structure

```
src/
├── design-system/          # Base design system components
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── Tooltip.tsx
│   ├── Progress.tsx
│   └── Tabs.tsx
├── lucky-boost/            # Lucky Boost feature components
│   ├── types.ts            # Type definitions and milestones
│   ├── store.ts            # State management with localStorage
│   ├── useLuckyBoost.ts    # React hook for state
│   ├── LuckyBoostMeter.tsx # Header meter component
│   ├── LuckyBoostModal.tsx # Main modal with tabs
│   ├── MilestoneRewardPopup.tsx # Reward claim popup
│   └── ProgressAnimation.tsx   # Progress toast animation
├── App.tsx                 # Main demo page
├── main.tsx                # Entry point
└── index.css               # Global styles and design tokens
```

## Design System

All components use the existing design system tokens defined in `src/index.css`. See `DESIGN_TOKEN_MAPPING.md` for a complete mapping of Figma tokens to CSS variables.

### Key Design Tokens

- **Colors**: Neutral greys, brand primary (neon yellow), status colors
- **Typography**: Space Grotesk font family
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, 2xl)
- **Border Radius**: Small (4px), Medium (8px), Large (12px)
- **Gradients**: Primary gradient for buttons, progress gradient for bars

## Integration

To integrate this into an existing pack-opening app:

1. Import the `LuckyBoostMeter` component into your header
2. Call `luckyBoostStore.addPackOpen(packPrice, cardValue)` after each pack reveal
3. Handle milestone rewards by listening to the store's state changes
4. Show `ProgressAnimation` after pack opens
5. Show `MilestoneRewardPopup` when milestones are reached

Example:

```tsx
import { luckyBoostStore } from './lucky-boost/store';
import { ProgressAnimation } from './lucky-boost/ProgressAnimation';

// After pack reveal
const result = luckyBoostStore.addPackOpen(packPrice, cardValue);
// Show progress animation
// Check for milestones in result.milestonesReached
```

## Edge Cases Handled

- **Multiple Cards**: Uses highest value card for win/loss determination
- **Progress Overflow**: Excess progress carries to next milestone
- **Multiple Milestones**: All rewards granted sequentially
- **Session Persistence**: Progress persists across browser sessions
- **History Limit**: Only last 10 pack opens stored

## Browser Support

Modern browsers with ES2020 support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This is a prototype for demonstration purposes.
