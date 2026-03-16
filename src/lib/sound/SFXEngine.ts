/* ================================================================== */
/*  SPARK SFX Engine — Sound effects for interactions                  */
/* ================================================================== */

import * as Tone from 'tone';
import SoundEngine from './SoundEngine';

function guard(): boolean {
  return SoundEngine.isEnabled;
}

const SFXEngine = {
  /** Soft button tap click */
  buttonTap() {
    if (!guard()) return;
    const s = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.03 }, volume: -15 }).toDestination();
    s.triggerAttackRelease('G5', '64n');
    setTimeout(() => s.dispose(), 200);
  },

  /** Page navigation whoosh */
  navigate() {
    if (!guard()) return;
    const n = new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.03, decay: 0.15, sustain: 0, release: 0.08 }, volume: -22 }).toDestination();
    n.triggerAttackRelease('16n');
    setTimeout(() => n.dispose(), 500);
  },

  /** Sparkle collect — ascending ding-ding-DING */
  sparkleCollect() {
    if (!guard()) return;
    const s = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.1 }, volume: -8 }).toDestination();
    s.triggerAttackRelease('E6', '16n');
    setTimeout(() => s.triggerAttackRelease('G6', '16n'), 80);
    setTimeout(() => s.triggerAttackRelease('C7', '8n'), 160);
    setTimeout(() => s.dispose(), 600);
  },

  /** Badge earned — triumphant 5-note fanfare */
  badgeEarn() {
    if (!guard()) return;
    const s = new Tone.PolySynth(Tone.Synth, { volume: -8 }).toDestination();
    const notes = ['C4', 'E4', 'G4', 'C5', 'E5'];
    notes.forEach((note, i) => {
      s.triggerAttackRelease(note, '8n', Tone.now() + i * 0.15);
    });
    setTimeout(() => s.dispose(), 2000);
  },

  /** Level up — ascending scale + final chord */
  levelUp() {
    if (!guard()) return;
    const s = new Tone.PolySynth(Tone.Synth, { volume: -6 }).toDestination();
    const scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    scale.forEach((note, i) => {
      s.triggerAttackRelease(note, '16n', Tone.now() + i * 0.1);
    });
    setTimeout(() => s.triggerAttackRelease(['C5', 'E5', 'G5'], '2n'), 900);
    setTimeout(() => s.dispose(), 3000);
  },

  /** Coin collect — ka-ching */
  coinCollect() {
    if (!guard()) return;
    const s = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.12, release: 0.08 }, volume: -14 }).toDestination();
    s.triggerAttackRelease('32n', Tone.now());
    setTimeout(() => {
      const s2 = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.1, release: 0.06 }, volume: -12 }).toDestination();
      s2.triggerAttackRelease('32n', Tone.now());
      setTimeout(() => s2.dispose(), 300);
    }, 50);
    setTimeout(() => s.dispose(), 400);
  },

  /** Daily reward — happy 4-note jingle */
  dailyReward() {
    if (!guard()) return;
    const s = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.02, decay: 0.2, sustain: 0.1, release: 0.3 }, volume: -8 }).toDestination();
    const notes: [string, string][] = [['G4', '8n'], ['C5', '8n'], ['E5', '8n'], ['G5', '4n']];
    notes.forEach(([note, dur], i) => {
      s.triggerAttackRelease(note, dur, Tone.now() + i * 0.2);
    });
    setTimeout(() => s.dispose(), 2000);
  },

  /** Story page turn — soft paper rustle */
  pageTurn() {
    if (!guard()) return;
    const n = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.01, decay: 0.06, sustain: 0, release: 0.04 }, volume: -28 }).toDestination();
    n.triggerAttackRelease('32n', Tone.now());
    setTimeout(() => n.dispose(), 300);
  },

  /** Breathing game — inhale rising tone */
  breatheIn() {
    if (!guard()) return;
    const s = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 1, decay: 0, sustain: 1, release: 1 }, volume: -16 }).toDestination();
    s.triggerAttack('C3');
    s.frequency.rampTo(Tone.Frequency('C4').toFrequency(), 4);
    setTimeout(() => { s.triggerRelease(); setTimeout(() => s.dispose(), 1500); }, 4000);
  },

  /** Breathing game — exhale falling tone */
  breatheOut() {
    if (!guard()) return;
    const s = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.5, decay: 0, sustain: 1, release: 1.5 }, volume: -16 }).toDestination();
    s.triggerAttack('G4');
    s.frequency.rampTo(Tone.Frequency('C3').toFrequency(), 6);
    setTimeout(() => { s.triggerRelease(); setTimeout(() => s.dispose(), 2000); }, 6000);
  },

  /** Dragon purr — low rumble */
  dragonPurr() {
    if (!guard()) return;
    const tremolo = new Tone.Tremolo(4, 0.5).toDestination().start();
    const s = new Tone.Synth({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.5, decay: 0, sustain: 1, release: 1 }, volume: -18 }).connect(tremolo);
    s.triggerAttackRelease('D2', '2n');
    setTimeout(() => { s.dispose(); tremolo.dispose(); }, 3000);
  },

  /** Game win celebration */
  gameWin() {
    if (!guard()) return;
    const bell = new Tone.MetalSynth({ volume: -16 }).toDestination();
    for (let i = 0; i < 8; i++) {
      bell.triggerAttackRelease('32n', Tone.now() + i * 0.05);
    }
    setTimeout(() => {
      const s = new Tone.PolySynth(Tone.Synth, { volume: -6 }).toDestination();
      s.triggerAttackRelease(['C5', 'E5', 'G5', 'C6'], '1n');
      setTimeout(() => s.dispose(), 3000);
    }, 500);
    setTimeout(() => bell.dispose(), 1000);
  },

  /** Oath line reveal — deep resonant bell */
  oathReveal() {
    if (!guard()) return;
    const s = new Tone.MetalSynth({
      envelope: { attack: 0.01, decay: 1.5, release: 1 },
      harmonicity: 5.1, modulationIndex: 16, resonance: 4000, volume: -15,
    }).toDestination();
    s.triggerAttackRelease('8n', Tone.now());
    setTimeout(() => s.dispose(), 3000);
  },

  /** Ember happy chirps */
  emberHappy() {
    if (!guard()) return;
    const s = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.08, sustain: 0, release: 0.04 }, volume: -10 }).toDestination();
    ['E5', 'G5', 'A5', 'C6'].forEach((note, i) => {
      s.triggerAttackRelease(note, '32n', Tone.now() + i * 0.06);
    });
    setTimeout(() => s.dispose(), 500);
  },

  /** Hotspot proximity — soft warm tone */
  hotspotNear() {
    if (!guard()) return;
    const s = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.3, decay: 0.5, sustain: 0, release: 0.3 }, volume: -22 }).toDestination();
    s.triggerAttackRelease('E5', '4n');
    setTimeout(() => s.dispose(), 1500);
  },

  /** Card flip */
  cardFlip() {
    if (!guard()) return;
    const n = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.005, decay: 0.04, sustain: 0, release: 0.02 }, volume: -24 }).toDestination();
    n.triggerAttackRelease('64n');
    setTimeout(() => n.dispose(), 200);
  },

  /** Correct answer */
  correct() {
    if (!guard()) return;
    const s = new Tone.Synth({ oscillator: { type: 'triangle' }, volume: -10 }).toDestination();
    s.triggerAttackRelease('C5', '16n');
    setTimeout(() => s.triggerAttackRelease('E5', '16n'), 100);
    setTimeout(() => s.triggerAttackRelease('G5', '8n'), 200);
    setTimeout(() => s.dispose(), 800);
  },

  /** Wrong answer (soft, never harsh) */
  wrong() {
    if (!guard()) return;
    const s = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.1, decay: 0.3, sustain: 0, release: 0.2 }, volume: -20 }).toDestination();
    s.triggerAttackRelease('E4', '8n');
    setTimeout(() => s.triggerAttackRelease('D4', '8n'), 200);
    setTimeout(() => s.dispose(), 800);
  },

  /** Crystal keeper power-up */
  crystalPower() {
    if (!guard()) return;
    const s = new Tone.PolySynth(Tone.Synth, { volume: -8 }).toDestination();
    ['E5', 'G#5', 'B5', 'E6'].forEach((note, i) => {
      s.triggerAttackRelease(note, '16n', Tone.now() + i * 0.06);
    });
    setTimeout(() => s.dispose(), 800);
  },

  /** Food eat pop */
  foodPop() {
    if (!guard()) return;
    const s = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.04 }, volume: -14 }).toDestination();
    s.triggerAttackRelease('A5', '32n');
    setTimeout(() => s.dispose(), 200);
  },
};

export default SFXEngine;
