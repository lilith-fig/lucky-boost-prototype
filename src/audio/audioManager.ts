import { audioStore } from './audioStore';
import type { SoundEffect, AudioManager, AudioState } from './types';

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
  private bgmUnsubscribe: (() => void) | null = null;

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
    
    // Don't play if BGM is disabled
    if (!state.bgmEnabled) {
      return;
    }
    
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

      // If we have paused audio for the same track, only resume if BGM is enabled
      if (this.bgmAudio && this.bgmAudio.paused && state.currentBGM === track) {
        if (state.bgmEnabled) {
          this.bgmAudio.play().catch((error) => {
            console.warn(`Failed to resume BGM ${track}:`, error);
          });
        }
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

      // Clean up any existing subscription before creating a new one
      if (this.bgmUnsubscribe) {
        this.bgmUnsubscribe();
        this.bgmUnsubscribe = null;
      }

      // Update volume when store changes - respect bgmEnabled state
      // Don't auto-resume here - let toggleBGM handle resume/pause
      this.bgmUnsubscribe = audioStore.subscribe(() => {
        if (!this.bgmAudio) return;
        const s = audioStore.getState();
        // Only set volume to 5% if BGM is enabled, otherwise keep at 0
        this.bgmAudio.volume = s.bgmEnabled ? 0.05 : 0;
      });

      // Cleanup subscription when audio ends (if not looping)
      if (!this.bgmAudio.loop) {
        this.bgmAudio.addEventListener('ended', () => {
          if (this.bgmUnsubscribe) {
            this.bgmUnsubscribe();
            this.bgmUnsubscribe = null;
          }
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
    // Clean up subscription when stopping BGM
    if (this.bgmUnsubscribe) {
      this.bgmUnsubscribe();
      this.bgmUnsubscribe = null;
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
    const state = audioStore.getState();
    const newEnabled = !state.bgmEnabled;
    
    // Update store state first (this notifies subscribers, button will update)
    audioStore.setBGMEnabled(newEnabled);
    
    // Then control audio directly (don't rely on subscription)
    if (this.bgmAudio) {
      if (newEnabled) {
        // Unmute: resume existing BGM from current position (don't restart)
        this.bgmAudio.volume = 0.05; // Restore volume
        this.bgmAudio.play().catch(() => {});
      } else {
        // Mute: pause BGM and set volume to 0 as backup
        this.bgmAudio.pause();
        this.bgmAudio.volume = 0; // Set to 0 as additional safeguard
      }
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
