import type { AudioState } from './types';

const STORAGE_KEY = 'audioSettings';

const defaultState: AudioState = {
  bgmEnabled: false,
  sfxEnabled: false,
  bgmVolume: 1.0, // Store full volume, but actual playback will be 5% (0.05)
  sfxVolume: 0.7,
  currentBGM: null,
};

function loadState(): AudioState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultState, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load audio state:', e);
  }
  return defaultState;
}

function saveState(state: AudioState): void {
  try {
    // Don't save currentBGM to localStorage (runtime state)
    const { currentBGM, ...stateToSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (e) {
    console.error('Failed to save audio state:', e);
  }
}

class AudioStore {
  private state: AudioState = loadState();
  private listeners: Set<() => void> = new Set();

  getState(): AudioState {
    return { ...this.state };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  setBGMEnabled(enabled: boolean): void {
    this.state.bgmEnabled = enabled;
    saveState(this.state);
    this.notify();
  }

  setSFXEnabled(enabled: boolean): void {
    this.state.sfxEnabled = enabled;
    saveState(this.state);
    this.notify();
  }

  setBGMVolume(volume: number): void {
    this.state.bgmVolume = Math.max(0, Math.min(1, volume));
    saveState(this.state);
    this.notify();
  }

  setSFXVolume(volume: number): void {
    this.state.sfxVolume = Math.max(0, Math.min(1, volume));
    saveState(this.state);
    this.notify();
  }

  setCurrentBGM(track: string | null): void {
    this.state.currentBGM = track;
    this.notify();
  }

  toggleBGM(): void {
    this.setBGMEnabled(!this.state.bgmEnabled);
  }

  toggleSFX(): void {
    this.setSFXEnabled(!this.state.sfxEnabled);
  }
}

export const audioStore = new AudioStore();
