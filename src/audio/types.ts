export type SoundEffect = 
  | 'packOpen'
  | 'cardReveal'
  | 'cardFlip'
  | 'buttonClick'
  | 'sellCard'
  | 'keepCard'
  | 'meterFill'
  | 'meterFull'
  | 'rewardPopup'
  | 'navigation'
  | 'error';

export interface AudioState {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
  currentBGM: string | null;
}

export interface AudioManager {
  playSFX: (sound: SoundEffect, options?: { volume?: number }) => void;
  playBGM: (track: string, options?: { loop?: boolean; volume?: number }) => void;
  stopBGM: () => void;
  setBGMVolume: (volume: number) => void;
  setSFXVolume: (volume: number) => void;
  toggleBGM: () => void;
  toggleSFX: () => void;
  getState: () => AudioState;
}
