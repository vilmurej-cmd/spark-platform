/* ================================================================== */
/*  Reusable Tone.js instrument definitions                            */
/*  "Songs they'll hum when they leave the hospital."                   */
/* ================================================================== */

import * as Tone from 'tone';

/** The SPARK lead — warm triangle with chorus (music box meets warm flute) */
export function createSparkLead(): Tone.Synth {
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.08, decay: 0.3, sustain: 0.6, release: 0.8 },
    volume: -8,
  });
  const chorus = new Tone.Chorus({ frequency: 4, delayTime: 2.5, depth: 0.5 }).start();
  const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.25 });
  synth.chain(chorus, reverb, Tone.getDestination());
  return synth;
}

/** Warm harmony pad — the blanket under the melody */
export function createPadSynth(): Tone.PolySynth {
  return new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.5, decay: 0.3, sustain: 0.8, release: 2.0 },
    volume: -14,
  }).toDestination();
}

/** Heartbeat bass — simple sine */
export function createBassSynth(): Tone.Synth {
  return new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.5 },
    volume: -10,
  }).toDestination();
}

/** Sparkle bells */
export function createBellSynth(): Tone.MetalSynth {
  return new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.6, release: 0.3 },
    harmonicity: 12,
    modulationIndex: 8,
    resonance: 3000,
    octaves: 1.5,
    volume: -22,
  }).toDestination();
}

/** 8-bit square lead for Spark Tower / Thunder Wheels */
export function createSquareLead(): Tone.Synth {
  return new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.4, release: 0.3 },
    volume: -10,
  }).toDestination();
}

/** Crystal/cave lead — bell-like with reverb */
export function createCrystalLead(): Tone.Synth {
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 1.0 },
    volume: -8,
  });
  const reverb = new Tone.Reverb({ decay: 5, wet: 0.5 });
  synth.chain(reverb, Tone.getDestination());
  return synth;
}

/** Echo lead — with feedback delay baked in */
export function createEchoLead(): Tone.Synth {
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.6 },
    volume: -8,
  });
  const delay = new Tone.FeedbackDelay({ delayTime: '4n', feedback: 0.4, wet: 0.35 });
  const reverb = new Tone.Reverb({ decay: 3, wet: 0.3 });
  synth.chain(delay, reverb, Tone.getDestination());
  return synth;
}

/** Lullaby sine — the softest possible tone (Quiet Forest / Thought Weaver) */
export function createLullabySine(): Tone.Synth {
  const synth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.3, decay: 0.5, sustain: 0.5, release: 2.0 },
    volume: -14,
  });
  const reverb = new Tone.Reverb({ decay: 6, wet: 0.6 });
  synth.chain(reverb, Tone.getDestination());
  return synth;
}

/** Ultra-quiet lullaby sine (Thought Weaver — 8s reverb) */
export function createWhisperSine(): Tone.Synth {
  const synth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.5, decay: 0.8, sustain: 0.3, release: 3.0 },
    volume: -18,
  });
  const reverb = new Tone.Reverb({ decay: 8, wet: 0.8 });
  synth.chain(reverb, Tone.getDestination());
  return synth;
}

/** Cosmic lead — airy with chorus (Star Lungs) */
export function createCosmicLead(): Tone.Synth {
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.15, decay: 0.4, sustain: 0.5, release: 1.2 },
    volume: -10,
  });
  const chorus = new Tone.Chorus({ frequency: 2, delayTime: 3, depth: 0.4 }).start();
  const reverb = new Tone.Reverb({ decay: 4, wet: 0.4 });
  synth.chain(chorus, reverb, Tone.getDestination());
  return synth;
}

/** Heartbeat drum for Brave Heart */
export function createHeartbeatDrum(): Tone.MembraneSynth {
  return new Tone.MembraneSynth({
    pitchDecay: 0.03,
    octaves: 3,
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 },
    volume: -18,
  }).toDestination();
}

/** Kick for rhythm sections */
export function createKickSynth(): Tone.MembraneSynth {
  return new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.3 },
    volume: -20,
  }).toDestination();
}

/** Voice chirp synth (for character speech) */
export function createVoiceSynth(type: 'ember' | 'dragon' | 'crystal' | 'forest' | 'generic' = 'generic'): Tone.Synth {
  switch (type) {
    case 'ember':
      return new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.05 }, volume: -10 }).toDestination();
    case 'dragon':
      return new Tone.Synth({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 0.3 }, volume: -12 }).toDestination();
    case 'crystal':
      return new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 }, volume: -14 }).toDestination();
    case 'forest':
      return new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.1, release: 0.5 }, volume: -16 }).toDestination();
    default:
      return new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.02, decay: 0.15, sustain: 0, release: 0.08 }, volume: -12 }).toDestination();
  }
}

export function createReverb(decay = 2): Tone.Reverb {
  return new Tone.Reverb({ decay, wet: 0.3 }).toDestination();
}

export function createDelay(time = 0.3, feedback = 0.3): Tone.FeedbackDelay {
  return new Tone.FeedbackDelay({ delayTime: time, feedback, wet: 0.2 }).toDestination();
}
