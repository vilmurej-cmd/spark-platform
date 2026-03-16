/* ================================================================== */
/*  SPARK Voice Engine — Character speech sounds (Animal Crossing style)*/
/* ================================================================== */

import * as Tone from 'tone';
import SoundEngine from './SoundEngine';
import { createVoiceSynth } from './instruments';

type VoiceType = 'ember' | 'dragon' | 'crystal' | 'forest' | 'generic';

/** Base pitches for each voice type */
const BASE_NOTES: Record<VoiceType, string> = {
  ember: 'C5',
  dragon: 'C2',
  crystal: 'C6',
  forest: 'C4',
  generic: 'C4',
};

/** Chirp speeds (seconds between chirps) */
const CHIRP_SPEED: Record<VoiceType, number> = {
  ember: 0.08,
  dragon: 0.15,
  crystal: 0.06,
  forest: 0.12,
  generic: 0.09,
};

/**
 * Play a character voice babble when dialogue appears.
 * Creates rapid musical chirps that feel like talking.
 */
function speak(text: string, voiceType: VoiceType = 'generic'): void {
  if (!SoundEngine.isEnabled) return;

  const synth = createVoiceSynth(voiceType);
  const baseFreq = Tone.Frequency(BASE_NOTES[voiceType]).toFrequency();
  const speed = CHIRP_SPEED[voiceType];

  // Generate pitch variations from the text content
  const chirpCount = Math.min(text.length, 15);
  const notes: number[] = [];
  for (let i = 0; i < chirpCount; i++) {
    const charCode = text.charCodeAt(i % text.length);
    const semitoneOffset = (charCode % 7) - 3; // -3 to +3 semitones
    notes.push(baseFreq * Math.pow(2, semitoneOffset / 12));
  }

  // Play the chirps
  for (let i = 0; i < chirpCount; i++) {
    synth.triggerAttackRelease(
      notes[i],
      '32n',
      Tone.now() + i * speed
    );
  }

  // Dispose after all chirps finish
  setTimeout(() => synth.dispose(), chirpCount * speed * 1000 + 500);
}

/** Ember speaks */
function emberSpeak(text: string): void {
  speak(text, 'ember');
}

/** Dragon NPC speaks */
function dragonSpeak(text: string): void {
  speak(text, 'dragon');
}

/** Crystal NPC speaks */
function crystalSpeak(text: string): void {
  speak(text, 'crystal');
}

/** Forest NPC speaks */
function forestSpeak(text: string): void {
  speak(text, 'forest');
}

/** Get voice type for a land */
function getVoiceForLand(landId: string): VoiceType {
  switch (landId) {
    case 'dragons-breath': return 'dragon';
    case 'sugar-crystals': return 'crystal';
    case 'quiet-forest': return 'forest';
    default: return 'generic';
  }
}

const VoiceEngine = {
  speak,
  emberSpeak,
  dragonSpeak,
  crystalSpeak,
  forestSpeak,
  getVoiceForLand,
};

export default VoiceEngine;
