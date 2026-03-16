/* ================================================================== */
/*  SPARK Sound Engine — Master controller                             */
/*  All sound OFF by default. Respects sensory sensitivities.          */
/* ================================================================== */

import * as Tone from 'tone';

const STORAGE_KEY = 'spark-sound-enabled';
const VOLUME_KEY = 'spark-sound-volume';

class SoundEngine {
  private static _enabled = false;
  private static _volume = 0.5;
  private static _initialized = false;

  static get isEnabled(): boolean {
    return this._enabled && this._initialized;
  }

  static get isInitialized(): boolean {
    return this._initialized;
  }

  static get volume(): number {
    return this._volume;
  }

  /** Must be called from a user gesture (click/tap) */
  static async init(): Promise<void> {
    if (this._initialized) return;
    try {
      await Tone.start();
      this._initialized = true;
      this.applyVolume();
    } catch {
      // Audio context failed — silently continue without sound
    }
  }

  /** Load persisted state from localStorage */
  static loadState(): void {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'true') this._enabled = true;
      const vol = localStorage.getItem(VOLUME_KEY);
      if (vol) this._volume = parseFloat(vol);
    } catch { /* ok */ }
  }

  static async toggle(): Promise<boolean> {
    this._enabled = !this._enabled;
    if (this._enabled && !this._initialized) {
      await this.init();
    }
    if (!this._enabled) {
      // Mute everything immediately
      Tone.getDestination().volume.value = -Infinity;
    } else {
      this.applyVolume();
    }
    this.saveState();
    return this._enabled;
  }

  static setVolume(v: number): void {
    this._volume = Math.max(0, Math.min(1, v));
    this.applyVolume();
    this.saveState();
  }

  private static applyVolume(): void {
    if (!this._initialized) return;
    if (!this._enabled) {
      Tone.getDestination().volume.value = -Infinity;
    } else {
      Tone.getDestination().volume.value = Tone.gainToDb(this._volume);
    }
  }

  private static saveState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, String(this._enabled));
      localStorage.setItem(VOLUME_KEY, String(this._volume));
    } catch { /* ok */ }
  }
}

export default SoundEngine;
