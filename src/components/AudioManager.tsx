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
    // Play flg4.mp3 at 5% volume (0.05), always looping
    playBGM('main', { loop: true, volume: 0.05 });
  }, [playBGM]);

  useEffect(() => {
    // Ensure BGM continues playing always (flg4.mp3 should always be on at 5% volume)
    // The audioManager will keep it playing regardless of bgmEnabled state
    if (!state.currentBGM) {
      // Ensure it's playing (in case it wasn't started)
      playBGM('main', { loop: true, volume: 0.05 });
    }
  }, [state.currentBGM, playBGM]);

  // This component doesn't render anything
  return null;
}
