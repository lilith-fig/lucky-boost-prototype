import { useEffect, useState } from 'react';
import { audioManager } from './audioManager';
import { audioStore } from './audioStore';
import type { SoundEffect, AudioState } from './types';

export function useAudio() {
  const [state, setState] = useState<AudioState>(audioStore.getState());

  useEffect(() => {
    const unsubscribe = audioStore.subscribe(() => {
      setState(audioStore.getState());
    });

    return unsubscribe;
  }, []);

  // Explicitly return methods to ensure they're available
  return {
    playBGM: (track: string, options?: { loop?: boolean; volume?: number }) => {
      audioManager.playBGM(track, options);
    },
    playSFX: (sound: SoundEffect, options?: { volume?: number }) => {
      audioManager.playSFX(sound, options);
    },
    stopBGM: () => {
      audioManager.stopBGM();
    },
    setBGMVolume: (volume: number) => {
      audioManager.setBGMVolume(volume);
    },
    setSFXVolume: (volume: number) => {
      audioManager.setSFXVolume(volume);
    },
    toggleBGM: () => {
      audioManager.toggleBGM();
    },
    toggleSFX: () => {
      audioManager.toggleSFX();
    },
    getState: () => {
      return audioManager.getState();
    },
    state,
  };
}

export function useSFX() {
  return {
    play: (sound: SoundEffect, options?: { volume?: number }) => {
      audioManager.playSFX(sound, options);
    },
  };
}
