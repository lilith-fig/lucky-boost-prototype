# Audio Files

This directory contains all audio files for the game, including sound effects (SFX) and background music (BGM).

## Directory Structure

```
public/audio/
├── bgm/          # Background music tracks
│   ├── main-theme.mp3
│   ├── pack-opening.mp3
│   └── card-reveal.mp3
└── sfx/          # Sound effects
    ├── pack-open.mp3
    ├── card-reveal.mp3
    ├── card-flip.mp3
    ├── button-click.mp3
    ├── sell-card.mp3
    ├── keep-card.mp3
    ├── meter-fill.mp3
    ├── meter-full.mp3
    ├── reward-popup.mp3
    ├── navigation.mp3
    └── error.mp3
```

## Required Audio Files

### Background Music (BGM)

1. **main-theme.mp3** - Main background music for home and pack detail screens
   - Should loop seamlessly
   - Recommended: Ambient, upbeat, or thematic music

2. **pack-opening.mp3** - Music for pack opening sequence
   - Can be non-looping (short track)
   - Recommended: Suspenseful or exciting music

3. **card-reveal.mp3** - Music for card reveal screen
   - Can be non-looping (short track)
   - Recommended: Dramatic or celebratory music

### Sound Effects (SFX)

1. **pack-open.mp3** - Sound when pack opening animation starts
   - Recommended: Rustling, tearing, or opening sound

2. **card-reveal.mp3** - Sound when card is revealed
   - Recommended: Shimmer, sparkle, or reveal sound

3. **card-flip.mp3** - Sound when card back is clicked to flip
   - Recommended: Card flip or whoosh sound

4. **button-click.mp3** - Sound for button interactions
   - Recommended: Click, tap, or beep sound

5. **sell-card.mp3** - Sound when card is sold
   - Recommended: Cash register, coin, or success sound

6. **keep-card.mp3** - Sound when card is kept
   - Recommended: Collection or inventory sound

7. **meter-fill.mp3** - Sound during lucky boost meter fill animation
   - Recommended: Charging, filling, or progress sound
   - Should be subtle (volume adjusted to 50% in code)

8. **meter-full.mp3** - Sound when meter reaches 100%
   - Recommended: Achievement, completion, or power-up sound

9. **reward-popup.mp3** - Sound when reward modal appears
   - Recommended: Celebration or reward sound

10. **navigation.mp3** - Sound for navigation/back button
    - Recommended: Menu or navigation sound

11. **error.mp3** - Sound for error states (insufficient balance, etc.)
    - Recommended: Error beep or alert sound

## Audio Settings

Audio settings (BGM/SFX enabled, volume levels) are stored in localStorage and persist across sessions.

## Adding Your Audio Files

1. Place your audio files in the appropriate directories (`bgm/` or `sfx/`)
2. Ensure file names match exactly (case-sensitive)
3. Supported formats: MP3, OGG, WAV (MP3 recommended for best browser compatibility)
4. For BGM, ensure looping tracks loop seamlessly
5. Keep file sizes reasonable for web performance

## Testing

The audio system will gracefully handle missing files - you'll see console warnings but the game will continue to function. This allows you to add audio files incrementally.
