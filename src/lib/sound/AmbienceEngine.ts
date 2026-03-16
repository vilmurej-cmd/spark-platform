/* ================================================================== */
/*  SPARK Ambience Engine — Continuous ambient soundscapes per land     */
/* ================================================================== */

import * as Tone from 'tone';
import SoundEngine from './SoundEngine';

let activeNodes: (Tone.ToneAudioNode | Tone.NoiseSynth | Tone.Synth | Tone.MembraneSynth | Tone.MetalSynth | Tone.Oscillator)[] = [];
let activeIntervals: ReturnType<typeof setInterval>[] = [];
let activeLandId: string | null = null;

function cleanup() {
  for (const interval of activeIntervals) clearInterval(interval);
  activeIntervals = [];
  for (const node of activeNodes) {
    try { node.dispose(); } catch { /* already disposed */ }
  }
  activeNodes = [];
  activeLandId = null;
}

function addNode<T extends Tone.ToneAudioNode>(node: T): T {
  activeNodes.push(node);
  return node;
}

/** Start ambient soundscape for a land */
function startAmbience(landId: string): void {
  if (!SoundEngine.isEnabled) return;
  if (activeLandId === landId) return;
  cleanup();
  activeLandId = landId;

  switch (landId) {
    case 'dragons-breath':
      dragonsBreathAmbience();
      break;
    case 'sugar-crystals':
      sugarCrystalsAmbience();
      break;
    case 'thunder-wheels':
      thunderWheelsAmbience();
      break;
    case 'quiet-forest':
      quietForestAmbience();
      break;
    case 'echo-chamber':
      echoChamberAmbience();
      break;
    case 'spark-tower':
      sparkTowerAmbience();
      break;
    case 'kaleidoscope':
      kaleidoscopeAmbience();
      break;
    case 'giants-garden':
      giantsGardenAmbience();
      break;
    case 'shield-fortress':
      shieldFortressAmbience();
      break;
    case 'brave-heart':
      braveHeartAmbience();
      break;
    case 'thought-weaver':
      thoughtWeaverAmbience();
      break;
    case 'star-lungs':
      starLungsAmbience();
      break;
  }
}

function stopAmbience(): void {
  cleanup();
}

/* ---- Land-specific ambience ---- */

function dragonsBreathAmbience() {
  // Crackling fire: filtered noise
  const fire = addNode(new Tone.NoiseSynth({ noise: { type: 'brown' }, envelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }, volume: -28 }));
  const filter = addNode(new Tone.Filter({ frequency: 600, type: 'bandpass' }).toDestination());
  fire.connect(filter);
  fire.triggerAttack();

  // Random dragon rumbles
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    const rumble = new Tone.MembraneSynth({ volume: -30, pitchDecay: 0.1, octaves: 2 }).toDestination();
    rumble.triggerAttackRelease('C1', '4n');
    setTimeout(() => rumble.dispose(), 2000);
  }, 15000 + Math.random() * 15000));
}

function sugarCrystalsAmbience() {
  // Crystal hum
  const hum = addNode(new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 2, decay: 0, sustain: 1, release: 2 }, volume: -32 }).toDestination());
  const vibrato = addNode(new Tone.Vibrato({ frequency: 2, depth: 0.1 }).toDestination());
  hum.connect(vibrato);
  hum.triggerAttack('E4');

  // Cave drip
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    const drip = new Tone.MetalSynth({ volume: -28, envelope: { attack: 0.001, decay: 0.08, release: 0.05 } }).toDestination();
    drip.triggerAttackRelease('32n', Tone.now());
    setTimeout(() => drip.dispose(), 500);
  }, 3000 + Math.random() * 5000));
}

function thunderWheelsAmbience() {
  // Crowd murmur
  const crowd = addNode(new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 1, decay: 0, sustain: 1, release: 1 }, volume: -34 }).toDestination());
  crowd.triggerAttack();

  // Occasional cheer
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    const cheer = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.05, decay: 0.3, sustain: 0, release: 0.2 }, volume: -30 }).toDestination();
    cheer.triggerAttackRelease('8n');
    setTimeout(() => cheer.dispose(), 800);
  }, 10000 + Math.random() * 10000));
}

function quietForestAmbience() {
  // This is the CALMEST soundscape — mostly silence
  // Gentle stream
  const stream = addNode(new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 2, decay: 0, sustain: 1, release: 2 }, volume: -40 }));
  const bandpass = addNode(new Tone.Filter({ frequency: 300, type: 'bandpass', Q: 2 }).toDestination());
  stream.connect(bandpass);
  stream.triggerAttack();

  // Bird song every 5-10 seconds
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    const bird = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }, volume: -24 }).toDestination();
    const notes = ['E6', 'G6', 'A6'];
    notes.forEach((n, i) => {
      bird.triggerAttackRelease(n, '32n', Tone.now() + i * 0.12);
    });
    setTimeout(() => bird.dispose(), 1000);
  }, 5000 + Math.random() * 5000));
}

function echoChamberAmbience() {
  // Resonant drone
  const reverb = addNode(new Tone.Reverb({ decay: 6, wet: 0.8 }).toDestination());
  const drone = addNode(new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 3, decay: 0, sustain: 1, release: 3 }, volume: -30 }));
  drone.connect(reverb);
  drone.triggerAttack('Bb2');

  // Random echoing tones
  const delay = addNode(new Tone.FeedbackDelay({ delayTime: 0.4, feedback: 0.6, wet: 0.5 }).toDestination());
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    const tone = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.05, decay: 0.3, sustain: 0, release: 0.2 }, volume: -22 });
    tone.connect(delay);
    const notes = ['Bb4', 'D5', 'F5', 'Bb5'];
    tone.triggerAttackRelease(notes[Math.floor(Math.random() * notes.length)], '8n');
    setTimeout(() => tone.dispose(), 3000);
  }, 4000 + Math.random() * 4000));
}

function sparkTowerAmbience() {
  // Electrical hum
  const hum = addNode(new Tone.Oscillator({ type: 'sawtooth', frequency: 60, volume: -38 }).toDestination());
  hum.start();

  // Random zaps
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    const zap = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 }, volume: -24 }).toDestination();
    zap.triggerAttackRelease('64n');
    setTimeout(() => zap.dispose(), 300);
  }, 5000 + Math.random() * 10000));
}

function kaleidoscopeAmbience() {
  // Shifting tones — multiple oscillators slowly detuning
  const osc1 = addNode(new Tone.Oscillator({ type: 'sine', frequency: 440, volume: -34 }).toDestination());
  const osc2 = addNode(new Tone.Oscillator({ type: 'sine', frequency: 442, volume: -34 }).toDestination());
  osc1.start();
  osc2.start();

  // Slowly shift frequencies
  activeIntervals.push(setInterval(() => {
    const f = 440 + Math.random() * 20 - 10;
    osc2.frequency.rampTo(f, 3);
  }, 4000));

  // Random bell tones
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    const bell = new Tone.MetalSynth({ volume: -26 }).toDestination();
    bell.triggerAttackRelease('32n', Tone.now());
    setTimeout(() => bell.dispose(), 500);
  }, 3000 + Math.random() * 4000));
}

function giantsGardenAmbience() {
  // Deep earth hum
  const earth = addNode(new Tone.Oscillator({ type: 'sine', frequency: 40, volume: -36 }).toDestination());
  earth.start();

  // Birdsong
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    const bird = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.08, sustain: 0, release: 0.08 }, volume: -20 }).toDestination();
    const songs = [['D6', 'F#6', 'A6'], ['G5', 'B5', 'D6'], ['E6', 'G6']];
    const song = songs[Math.floor(Math.random() * songs.length)];
    song.forEach((n, i) => bird.triggerAttackRelease(n, '32n', Tone.now() + i * 0.1));
    setTimeout(() => bird.dispose(), 800);
  }, 4000 + Math.random() * 4000));
}

function shieldFortressAmbience() {
  // Shield pulse
  const pulse = addNode(new Tone.MembraneSynth({ volume: -30, pitchDecay: 0.05, octaves: 2 }).toDestination());
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    pulse.triggerAttackRelease('C2', '8n');
  }, 2000));

  // Wind against walls
  const wind = addNode(new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 2, decay: 0, sustain: 1, release: 2 }, volume: -36 }).toDestination());
  wind.triggerAttack();
}

function braveHeartAmbience() {
  // Heartbeat
  const heart = addNode(new Tone.MembraneSynth({ volume: -28, pitchDecay: 0.03, octaves: 3 }).toDestination());
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    heart.triggerAttackRelease('C2', '16n');
    setTimeout(() => heart.triggerAttackRelease('C2', '16n'), 200); // double beat
  }, 833)); // ~72 BPM

  // Warm ambient pad
  const pad = addNode(new Tone.PolySynth(Tone.Synth, { volume: -36 }).toDestination());
  pad.triggerAttack(['Ab2', 'C3', 'Eb3']);
}

function thoughtWeaverAmbience() {
  // Almost silence — the most minimal soundscape
  // Very distant wind
  const wind = addNode(new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 3, decay: 0, sustain: 1, release: 3 }, volume: -42 }).toDestination());
  wind.triggerAttack();

  // One single note every 20-30 seconds with long reverb
  const reverb = addNode(new Tone.Reverb({ decay: 8, wet: 0.9 }).toDestination());
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    const note = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.5, decay: 1, sustain: 0, release: 2 }, volume: -24 });
    note.connect(reverb);
    const notes = ['Db4', 'F4', 'Ab4', 'Db5'];
    note.triggerAttackRelease(notes[Math.floor(Math.random() * notes.length)], '2n');
    setTimeout(() => note.dispose(), 10000);
  }, 20000 + Math.random() * 10000));
}

function starLungsAmbience() {
  // Space drone
  const drone1 = addNode(new Tone.Oscillator({ type: 'sine', frequency: 55, volume: -34 }).toDestination());
  const drone2 = addNode(new Tone.Oscillator({ type: 'sine', frequency: 55.5, volume: -34 }).toDestination());
  drone1.start();
  drone2.start();

  // Slow pitch wobble
  activeIntervals.push(setInterval(() => {
    drone2.frequency.rampTo(55 + Math.random() * 2, 4);
  }, 5000));

  // Station beeps
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    const beep = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 }, volume: -26 }).toDestination();
    beep.triggerAttackRelease('A5', '32n');
    setTimeout(() => beep.dispose(), 400);
  }, 15000 + Math.random() * 10000));

  // Breathing rhythm (filtered noise)
  const breathFilter = addNode(new Tone.Filter({ frequency: 400, type: 'lowpass' }).toDestination());
  const breath = addNode(new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 2, decay: 0, sustain: 1, release: 2 }, volume: -34 }));
  breath.connect(breathFilter);

  // Inhale/exhale cycle
  let breathing = true;
  activeIntervals.push(setInterval(() => {
    if (!SoundEngine.isEnabled) return;
    if (breathing) {
      breath.triggerAttack();
      breathFilter.frequency.rampTo(600, 4);
    } else {
      breathFilter.frequency.rampTo(200, 4);
      setTimeout(() => { try { breath.triggerRelease(); } catch { /* ok */ } }, 3500);
    }
    breathing = !breathing;
  }, 4000));
}

const AmbienceEngine = {
  startAmbience,
  stopAmbience,
  cleanup,
};

export default AmbienceEngine;
