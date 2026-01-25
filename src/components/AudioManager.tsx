import { useEffect } from 'react';
import { useAudio } from '../audio/useAudio';

/**
 * AudioManager component that handles BGM - plays flg4.mp3 continuously at 5% volume
 * Should be mounted once in the App component
 */
export function AudioManager() {
  const { playBGM, state } = useAudio();

  useEffect(() => {
    // Start BGM immediately when component mounts (on site visit)
    // Only if BGM is enabled
    if (state.bgmEnabled) {
      playBGM('main', { loop: true, volume: 0.05 });
    }
  }, [playBGM, state.bgmEnabled]);

  useEffect(() => {
    // Ensure BGM continues playing if enabled and not already playing
    // Respect bgmEnabled state - don't auto-start if muted
    if (state.bgmEnabled && !state.currentBGM) {
      playBGM('main', { loop: true, volume: 0.05 });
    }
  }, [state.currentBGM, state.bgmEnabled, playBGM]);

  // This component doesn't render anything
  return null;
}
