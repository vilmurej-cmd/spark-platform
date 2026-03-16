/* ================================================================== */
/*  Reusable Tone.js instrument definitions                            */
/* ================================================================== */

import * as Tone from 'tone';

/** Soft warm lead synth */
export function createLeadSynth(): Tone.Synth {
  return new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.8 },
  }).toDestination();
}

/** Warm pad for chords */
export function createPadSynth(): Tone.PolySynth {
  return new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.4, decay: 0.5, sustain: 0.6, release: 1.5 },
    volume: -12,
  }).toDestination();
}

/** Gentle bass */
export function createBassSynth(): Tone.Synth {
  return new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.1, decay: 0.4, sustain: 0.3, release: 0.6 },
    volume: -8,
  }).toDestination();
}

/** Bell/sparkle tones */
export function createBellSynth(): Tone.MetalSynth {
  return new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.4, release: 0.3 },
    harmonicity: 5.1,
    modulationIndex: 16,
    resonance: 4000,
    octaves: 1.5,
    volume: -20,
  }).toDestination();
}

/** Voice chirp synth (for character speech) */
export function createVoiceSynth(type: 'ember' | 'dragon' | 'crystal' | 'forest' | 'generic' = 'generic'): Tone.Synth {
  switch (type) {
    case 'ember':
      return new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.05 },
        volume: -10,
      }).toDestination();
    case 'dragon':
      return new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 0.3 },
        volume: -12,
      }).toDestination();
    case 'crystal':
      return new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
        volume: -14,
      }).toDestination();
    case 'forest':
      return new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.1, release: 0.5 },
        volume: -16,
      }).toDestination();
    default:
      return new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.02, decay: 0.15, sustain: 0, release: 0.08 },
        volume: -12,
      }).toDestination();
  }
}

/** Soft membrane for rhythmic elements */
export function createKickSynth(): Tone.MembraneSynth {
  return new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.3 },
    volume: -20,
  }).toDestination();
}

/** Shared reverb */
export function createReverb(decay = 2): Tone.Reverb {
  return new Tone.Reverb({ decay, wet: 0.3 }).toDestination();
}

/** Shared delay */
export function createDelay(time = 0.3, feedback = 0.3): Tone.FeedbackDelay {
  return new Tone.FeedbackDelay({ delayTime: time, feedback, wet: 0.2 }).toDestination();
}
