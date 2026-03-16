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

  /** Oath spark appearance — singing bowl bell */
  oathSparkAppear() {
    if (!guard()) return;
    const bell = new Tone.MetalSynth({
      envelope: { attack: 0.01, decay: 3, release: 1.5 },
      harmonicity: 12, modulationIndex: 8, resonance: 3000, volume: -12,
    }).toDestination();
    bell.triggerAttackRelease('4n', Tone.now());
    setTimeout(() => bell.dispose(), 5000);
  },

  /** Oath intro line tap — ascending piano notes */
  oathIntroTap(lineIndex: number) {
    if (!guard()) return;
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4'];
    const note = notes[Math.min(lineIndex, notes.length - 1)];
    const s = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 0.6 }, volume: -10 }).toDestination();
    s.triggerAttackRelease(note, '8n');
    setTimeout(() => s.dispose(), 1500);
  },

  /** Oath line reveal — builds the Spark Motif G-C-E-G progressively.
   *  lineIndex 0-7 maps to increasing musical intensity. */
  oathReveal(lineIndex = 0) {
    if (!guard()) return;
    // Bell strike (deeper = later lines, by adjusting decay)
    const bell = new Tone.MetalSynth({
      envelope: { attack: 0.01, decay: 1.5 + lineIndex * 0.2, release: 1 },
      harmonicity: 5.1, modulationIndex: 16, resonance: 4000, volume: -14 + lineIndex,
    }).toDestination();
    bell.triggerAttackRelease('8n', Tone.now());
    setTimeout(() => bell.dispose(), 4000);

    // Build the Spark Motif note by note: G4, C5, E5, G5
    const motifNotes = ['G4', 'C5', 'E5', 'G5'];
    const motifSynth = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.08, decay: 0.4, sustain: 0.5, release: 1.0 }, volume: -8 }).toDestination();

    if (lineIndex === 0) {
      // Line 1 "I am [Name]": just G4
      motifSynth.triggerAttackRelease('G4', '2n', Tone.now() + 0.2);
    } else if (lineIndex === 1) {
      // Line 2 "I am brave": G4 → C5
      motifSynth.triggerAttackRelease('G4', '4n', Tone.now() + 0.2);
      motifSynth.triggerAttackRelease('C5', '2n', Tone.now() + 0.8);
    } else if (lineIndex === 2) {
      // Line 3 "I am strong": G4 → C5 → E5
      motifSynth.triggerAttackRelease('G4', '4n', Tone.now() + 0.15);
      motifSynth.triggerAttackRelease('C5', '4n', Tone.now() + 0.6);
      motifSynth.triggerAttackRelease('E5', '2n', Tone.now() + 1.05);
    } else if (lineIndex === 3) {
      // Line 4 "I am exactly who I'm supposed to be": G4 → C5 → E5 sustained
      motifSynth.triggerAttackRelease('G4', '4n', Tone.now() + 0.15);
      motifSynth.triggerAttackRelease('C5', '4n', Tone.now() + 0.6);
      motifSynth.triggerAttackRelease('E5', '1n', Tone.now() + 1.05);
    } else if (lineIndex === 4) {
      // Line 5 "MIGHTY": FULL MOTIF completes! G4 → C5 → E5 → G5
      ['G4', 'C5', 'E5', 'G5'].forEach((n, i) => {
        motifSynth.triggerAttackRelease(n, '4n', Tone.now() + 0.15 + i * 0.4);
      });
      // Add pad swell
      const pad = new Tone.PolySynth(Tone.Synth, { volume: -14 }).toDestination();
      pad.triggerAttackRelease(['C3', 'E3', 'G3'], '1n', Tone.now() + 0.5);
      setTimeout(() => pad.dispose(), 4000);
    } else if (lineIndex === 5) {
      // Line 6 "SUPERPOWER": motif DOUBLE SPEED
      ['G4', 'C5', 'E5', 'G5'].forEach((n, i) => {
        motifSynth.triggerAttackRelease(n, '8n', Tone.now() + 0.1 + i * 0.2);
      });
      // Drum enters
      const drum = new Tone.MembraneSynth({ volume: -16 }).toDestination();
      drum.triggerAttackRelease('C2', '4n', Tone.now() + 0.1);
      setTimeout(() => drum.dispose(), 2000);
    } else if (lineIndex === 6) {
      // Line 7 "I am not alone": full chord opens up
      const pad = new Tone.PolySynth(Tone.Synth, { volume: -10 }).toDestination();
      pad.triggerAttackRelease(['C3', 'E3', 'G3', 'C4', 'E4', 'G4'], '1n', Tone.now() + 0.2);
      // Sparkle cascade
      const sparkle = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 }, volume: -10 }).toDestination();
      ['E5', 'G5', 'C6', 'E6'].forEach((n, i) => {
        sparkle.triggerAttackRelease(n, '16n', Tone.now() + 0.4 + i * 0.12);
      });
      setTimeout(() => { pad.dispose(); sparkle.dispose(); }, 5000);
    } else if (lineIndex >= 7) {
      // FINAL LINE "I am a HERO": EVERYTHING
      // Full motif FORTISSIMO to C6
      const heroSynth = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 1.0 }, volume: -4 }).toDestination();
      ['G4', 'C5', 'E5', 'G5', 'C6'].forEach((n, i) => {
        heroSynth.triggerAttackRelease(n, '4n', Tone.now() + 0.1 + i * 0.25);
      });
      // Thundering bass
      const bass = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.05, decay: 0.5, sustain: 0.8, release: 1.5 }, volume: -6 }).toDestination();
      bass.triggerAttackRelease('C2', '1n', Tone.now() + 0.1);
      // Full chord across 4 octaves
      const pad = new Tone.PolySynth(Tone.Synth, { volume: -8 }).toDestination();
      pad.triggerAttackRelease(['C2', 'C3', 'E3', 'G3', 'C4', 'E4', 'G4', 'C5'], '1n', Tone.now() + 0.3);
      // Ascending scale run
      const run = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.05 }, volume: -8 }).toDestination();
      const scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
      scale.forEach((n, i) => {
        run.triggerAttackRelease(n, '32n', Tone.now() + 1.5 + i * 0.07);
      });
      // Sparkle explosion
      const sparkle = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.3, release: 0.2 }, volume: -14 }).toDestination();
      for (let i = 0; i < 10; i++) {
        sparkle.triggerAttackRelease('32n', Tone.now() + 2.5 + i * 0.06);
      }
      setTimeout(() => { heroSynth.dispose(); bass.dispose(); pad.dispose(); run.dispose(); sparkle.dispose(); }, 6000);
    }
    setTimeout(() => motifSynth.dispose(), 5000);
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
