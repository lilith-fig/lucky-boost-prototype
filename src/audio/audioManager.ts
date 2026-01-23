import { audioStore } from './audioStore';
import type { SoundEffect, AudioManager } from './types';

// Map sound effects to their file paths
const SFX_PATHS: Record<SoundEffect, string> = {
  packOpen: '/audio/sfx/pack-rip.mp3',
  cardReveal: '/audio/sfx/card-reveal.mp3',
  cardFlip: '/audio/sfx/card-flip.mp3',
  buttonClick: '/audio/sfx/button-click.mp3',
  sellCard: '/audio/sfx/card-sold.mp3',
  keepCard: '/audio/sfx/card-kept.mp3',
  meterFill: '/audio/sfx/meter-fill.mp3',
  meterFull: '/audio/sfx/meter-full.mp3',
  rewardPopup: '/audio/sfx/reward-popup.mp3',
  navigation: '/audio/sfx/navigation.mp3',
  error: '/audio/sfx/error.mp3',
};

// BGM tracks
const BGM_TRACKS: Record<string, string> = {
  main: '/audio/bgm/flg4.mp3',
  packOpening: '/audio/bgm/flg4.mp3',
  cardReveal: '/audio/bgm/flg4.mp3',
};

class AudioManagerImpl implements AudioManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxCache: Map<SoundEffect, HTMLAudioElement> = new Map();

  constructor() {
    // Preload audio files (optional, can be done lazily)
    this.preloadSFX();
  }

  private preloadSFX(): void {
    // Preload commonly used sounds
    const commonSounds: SoundEffect[] = ['buttonClick', 'cardReveal', 'packOpen'];
    commonSounds.forEach((sound) => {
      const audio = new Audio(SFX_PATHS[sound]);
      audio.preload = 'auto';
      this.sfxCache.set(sound, audio);
    });
  }

  private getSFXAudio(sound: SoundEffect): HTMLAudioElement {
    if (this.sfxCache.has(sound)) {
      const cached = this.sfxCache.get(sound)!;
      // Clone the audio element to allow overlapping sounds
      return cached.cloneNode() as HTMLAudioElement;
    }

    const audio = new Audio(SFX_PATHS[sound]);
    audio.preload = 'auto';
    this.sfxCache.set(sound, audio);
    return audio.cloneNode() as HTMLAudioElement;
  }

  playSFX(sound: SoundEffect, options?: { volume?: number }): void {
    const state = audioStore.getState();
    if (!state.sfxEnabled) return;

    try {
      const audio = this.getSFXAudio(sound);
      const volume = options?.volume ?? state.sfxVolume;
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.play().catch((error) => {
        // Handle autoplay restrictions gracefully
        console.warn(`Failed to play SFX ${sound}:`, error);
      });
    } catch (error) {
      console.warn(`Failed to play SFX ${sound}:`, error);
    }
  }

  playBGM(track: string, options?: { loop?: boolean; volume?: number }): void {
    const state = audioStore.getState();
    
    // If BGM is already playing the same track, don't restart it
    if (this.bgmAudio && !this.bgmAudio.paused && state.currentBGM === track) {
      return;
    }

    const trackPath = BGM_TRACKS[track];
    if (!trackPath) {
      console.warn(`BGM track not found: ${track}`);
      return;
    }

    // Only stop if switching to a different track
    if (this.bgmAudio && state.currentBGM !== track) {
      this.stopBGM();
    }

    try {
      // If BGM is already playing, just update the current track reference
      if (this.bgmAudio && !this.bgmAudio.paused) {
        audioStore.setCurrentBGM(track);
        return;
      }

      this.bgmAudio = new Audio(trackPath);
      this.bgmAudio.loop = options?.loop ?? true;
      // Always use 5% volume (0.05) for flg4.mp3
      const volume = options?.volume !== undefined ? options.volume : 0.05;
      this.bgmAudio.volume = Math.max(0, Math.min(1, volume));
      audioStore.setCurrentBGM(track);

      this.bgmAudio.play().catch((error) => {
        console.warn(`Failed to play BGM ${track}:`, error);
      });

      // Update volume when store changes - but always keep at 5% for flg4.mp3
      const unsubscribe = audioStore.subscribe(() => {
        if (this.bgmAudio) {
          // Always play at 5% volume, regardless of bgmEnabled state
          this.bgmAudio.volume = 0.05;
          if (this.bgmAudio.paused) {
            this.bgmAudio.play().catch(() => {});
          }
        }
      });

      // Cleanup subscription when audio ends (if not looping)
      if (!this.bgmAudio.loop) {
        this.bgmAudio.addEventListener('ended', () => {
          unsubscribe();
        });
      }
    } catch (error) {
      console.warn(`Failed to play BGM ${track}:`, error);
    }
  }

  stopBGM(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
      this.bgmAudio = null;
      audioStore.setCurrentBGM(null);
    }
  }

  setBGMVolume(volume: number): void {
    audioStore.setBGMVolume(volume);
    if (this.bgmAudio) {
      this.bgmAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  setSFXVolume(volume: number): void {
    audioStore.setSFXVolume(volume);
  }

  toggleBGM(): void {
    audioStore.toggleBGM();
    const state = audioStore.getState();
    if (state.bgmEnabled && state.currentBGM) {
      // Resume BGM if it was playing
      this.playBGM(state.currentBGM);
    } else if (!state.bgmEnabled && this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  toggleSFX(): void {
    audioStore.toggleSFX();
  }

  getState(): AudioState {
    return audioStore.getState();
  }
}

export const audioManager = new AudioManagerImpl();
