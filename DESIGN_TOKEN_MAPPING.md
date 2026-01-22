# Design Token Mapping Report

This document maps Figma design tokens to the implemented design system tokens and components.

## Color Tokens

### Neutral Colors
| Figma Token | CSS Variable | Value | Usage |
|------------|-------------|-------|-------|
| `global/neutral/white` | `--global-neutral-white` | `#ffffff` | Primary text, backgrounds |
| `global/neutral/black` | `--global-neutral-black` | `#000000` | Text on light backgrounds |
| `global/neutral/grey/30` | `--global-neutral-grey-30` | `#7d7d7d` | Secondary text, labels |
| `global/neutral/grey/40` | `--global-neutral-grey-40` | `#646464` | Tertiary text |
| `global/neutral/grey/60` | `--global-neutral-grey-60` | `#323232` | Borders, dividers |
| `global/neutral/grey/70` | `--global-neutral-grey-70` | `#222222` | Progress bar backgrounds, borders |
| `global/neutral/grey/80` | `--global-neutral-grey-80` | `#171717` | Card backgrounds, secondary backgrounds |
| `global/neutral/grey/90` | `--global-neutral-grey-90` | `#101010` | Main background, modal backgrounds |

### Brand Colors
| Figma Token | CSS Variable | Value | Usage |
|------------|-------------|-------|-------|
| `global/brand/primary/10` | `--global-brand-primary-10` | `#ecff6f` | Gradient stops, highlights |
| `global/brand/primary/20` | `--global-brand-primary-20` | `#d3f015` | Primary accent, text highlights, borders |

### Status Colors
| Figma Token | CSS Variable | Value | Usage |
|------------|-------------|-------|-------|
| `global/red` | `--global-red` | `#ff1e1a` | Error states, loss indicators |

## Typography Tokens

| Figma Token | CSS Variable | Value | Usage |
|------------|-------------|-------|-------|
| Font Family | `--font-family` | `'Space Grotesk', sans-serif` | All text |
| Font Weight Regular | `--font-weight-regular` | `400` | Body text |
| Font Weight Bold | `--font-weight-bold` | `700` | Headings, emphasis |

### Font Sizes (from Figma measurements)
- **12px**: Small labels, tooltip text, history timestamps
- **14px**: Body text, tab labels, descriptions
- **16px**: Button text, milestone labels
- **18px**: Modal titles, section headings
- **20px**: Progress labels, animation text
- **24px**: Reward titles, app title

## Spacing Tokens

| Figma Token | CSS Variable | Value | Usage |
|------------|-------------|-------|-------|
| `spacing/xs` | `--spacing-xs` | `4px` | Tight spacing, icon padding |
| `spacing/sm` | `--spacing-sm` | `8px` | Small gaps, button padding |
| `spacing/md` | `--spacing-md` | `12px` | Medium gaps, card padding |
| `spacing/lg` | `--spacing-lg` | `16px` | Large gaps, section padding |
| `spacing/xl` | `--spacing-xl` | `24px` | Extra large gaps, modal padding |
| `spacing/2xl` | `--spacing-2xl` | `32px` | Maximum gaps, page padding |

## Border Radius Tokens

| Figma Token | CSS Variable | Value | Usage |
|------------|-------------|-------|-------|
| `radius/sm` | `--radius-sm` | `4px` | Small elements, badges |
| `radius/md` | `--radius-md` | `8px` | Buttons, cards, modals, progress bars |
| `radius/lg` | `--radius-lg` | `12px` | Large containers (if needed) |

## Shadow Tokens

| Figma Token | CSS Variable | Value | Usage |
|------------|-------------|-------|-------|
| `shadow/sm` | `--shadow-sm` | `0px 0px 4px 0px rgba(211, 255, 15, 1)` | Meter hover glow |
| `shadow/inset` | `--shadow-inset` | `inset 5px 5px 0px 0px rgba(255, 255, 255, 0.7)` | Button primary style |

## Gradient Tokens

| Figma Token | CSS Variable | Value | Usage |
|------------|-------------|-------|-------|
| `gradient/primary` | `--gradient-primary` | `linear-gradient(168.688deg, rgb(236, 255, 111) 33.847%, rgb(224, 251, 41) 24.074%, rgb(248, 255, 205) 55.405%, rgb(224, 251, 41) 75.907%, rgb(236, 255, 111) 118.46%)` | Button backgrounds, text gradients |
| `gradient/progress` | `--gradient-progress` | `linear-gradient(90deg, #ff6b00 0%, #d3f015 100%)` | Progress bar fills |

## Component Mappings

### Button Component
- **Primary Variant**: Uses `--gradient-primary` background, `--global-brand-primary-20` border, `--shadow-inset`
- **Secondary Variant**: Uses `--global-neutral-grey-80` background, `--global-neutral-grey-70` border
- **Sizes**: `small` (32px height), `medium` (40px height), `large` (48px height, full width)

### Modal Component
- Background: `--global-neutral-grey-90`
- Border: `1px solid var(--global-neutral-grey-80)`
- Border radius: `--radius-md`
- Padding: `--spacing-lg var(--spacing-2xl)`
- Max width: `800px`

### Tooltip Component
- Background: `--global-neutral-grey-90`
- Border: `1px solid var(--global-neutral-grey-70)`
- Border radius: `--radius-sm`
- Padding: `--spacing-md`
- Max width: `373px` (from Figma)

### Progress Bar Component
- Background: `--global-neutral-grey-70`
- Fill: `--gradient-progress`
- Height: `8px`
- Border radius: `--radius-md`

### Tabs Component
- Active tab: `--global-brand-primary-20` border bottom
- Inactive tab: `--global-neutral-grey-30` text
- Tab border: `1px solid var(--global-neutral-grey-70)`

## Missing/Approximated Tokens

The following tokens were not found in the Figma design but were approximated based on design patterns:

1. **Currency Icon Gradient**: `radial-gradient(circle, #ffd700 0%, #ffed4e 100%)`
   - Approximated for the gold currency icon appearance
   - Used in tooltips and reward popups

2. **Progress Ring Gradient**: `linear-gradient` from `#d3f015` to `#ff6b00`
   - Used for the circular progress indicator in the meter
   - Based on the progress bar gradient pattern

3. **Animation Shadows**: Custom rgba values for glow effects
   - `rgba(211, 240, 21, 0.5)` for meter hover
   - `rgba(211, 240, 21, 0.4)` for progress animation
   - `rgba(255, 215, 0, 0.5)` for currency icon

## Component Usage Notes

### Lucky Boost Meter
- Uses circular SVG progress indicator with gradient stroke
- Tooltip appears on hover with detailed progress information
- Click opens the full modal

### Lucky Boost Modal
- Three tabs: "Next Prize", "History", "Rules"
- Uses existing Tabs component with custom styling
- Progress section shows current milestone and upcoming rewards

### Milestone Reward Popup
- Centered modal with celebratory animations
- Uses gradient text for title
- Currency icon with gold gradient background

### Progress Animation
- Toast-like overlay that appears after pack opening
- Shows progress added with icon and text
- Auto-dismisses after 2 seconds

## Design System Compliance

All components use:
- ✅ Existing design system tokens (no custom colors)
- ✅ Existing component primitives (Button, Modal, Tooltip, Progress, Tabs)
- ✅ Consistent spacing and typography
- ✅ Proper border radius and shadows
- ✅ Gradient patterns from design system

No new styling primitives were introduced beyond what was necessary for the specific Lucky Boost feature requirements.
