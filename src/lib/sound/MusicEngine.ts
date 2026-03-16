/* ================================================================== */
/*  SPARK Music Engine — Background music generator                    */
/* ================================================================== */

import * as Tone from 'tone';
import SoundEngine from './SoundEngine';
import { createLeadSynth, createPadSynth, createBassSynth } from './instruments';
import { HOME_THEME, MAP_THEME, LAND_THEMES, STORY_THEME, type ThemeConfig } from './melodies';

let leadSynth: Tone.Synth | null = null;
let padSynth: Tone.PolySynth | null = null;
let bassSynth: Tone.Synth | null = null;
let leadPart: Tone.Part | null = null;
let chordPart: Tone.Part | null = null;
let bassPart: Tone.Part | null = null;
let currentThemeId: string | null = null;
let isPlaying = false;

function cleanup() {
  if (leadPart) { leadPart.stop(); leadPart.dispose(); leadPart = null; }
  if (chordPart) { chordPart.stop(); chordPart.dispose(); chordPart = null; }
  if (bassPart) { bassPart.stop(); bassPart.dispose(); bassPart = null; }
  if (leadSynth) { leadSynth.dispose(); leadSynth = null; }
  if (padSynth) { padSynth.dispose(); padSynth = null; }
  if (bassSynth) { bassSynth.dispose(); bassSynth = null; }
  isPlaying = false;
  currentThemeId = null;
}

function buildTheme(config: ThemeConfig, isNight = false) {
  cleanup();

  const tempo = isNight && config.nightTempo ? config.nightTempo : config.tempo;
  Tone.getTransport().bpm.value = tempo;

  // Lead
  leadSynth = createLeadSynth();
  if (isNight) leadSynth.volume.value = -18;
  else leadSynth.volume.value = -10;

  const leadEvents: [number, { note: string; dur: string }][] = [];
  let time = 0;
  for (let i = 0; i < config.lead.notes.length; i++) {
    leadEvents.push([time, { note: config.lead.notes[i], dur: config.lead.durations[i] }]);
    time += Tone.Time(config.lead.durations[i]).toSeconds();
  }

  leadPart = new Tone.Part((t, val) => {
    if (!SoundEngine.isEnabled || !leadSynth) return;
    leadSynth.triggerAttackRelease(val.note, val.dur, t);
  }, leadEvents);
  leadPart.loop = true;
  leadPart.loopEnd = time;

  // Pad chords
  padSynth = createPadSynth();
  if (isNight) padSynth.volume.value = -20;

  const chordDur = time / config.chords.length;
  const chordEvents: [number, string[]][] = config.chords.map((chord, i) => [i * chordDur, chord]);

  chordPart = new Tone.Part((t, chord) => {
    if (!SoundEngine.isEnabled || !padSynth) return;
    padSynth.triggerAttackRelease(chord, chordDur * 0.9, t);
  }, chordEvents);
  chordPart.loop = true;
  chordPart.loopEnd = time;

  // Bass
  if (config.bass && !isNight) {
    bassSynth = createBassSynth();
    const bassEvents: [number, { note: string; dur: string }][] = [];
    let bt = 0;
    for (let i = 0; i < config.bass.notes.length; i++) {
      bassEvents.push([bt, { note: config.bass.notes[i], dur: config.bass.durations[i] }]);
      bt += Tone.Time(config.bass.durations[i]).toSeconds();
    }
    bassPart = new Tone.Part((t, val) => {
      if (!SoundEngine.isEnabled || !bassSynth) return;
      bassSynth.triggerAttackRelease(val.note, val.dur, t);
    }, bassEvents);
    bassPart.loop = true;
    bassPart.loopEnd = bt;
  }
}

function startParts() {
  const t = Tone.getTransport();
  if (leadPart) leadPart.start(0);
  if (chordPart) chordPart.start(0);
  if (bassPart) bassPart.start(0);
  t.start();
  isPlaying = true;
}

/** Play a specific theme by ID */
function playTheme(themeId: string, isNight = false) {
  if (!SoundEngine.isEnabled) return;
  if (currentThemeId === themeId) return; // already playing

  let config: ThemeConfig;
  if (themeId === 'home') config = HOME_THEME;
  else if (themeId === 'map') config = MAP_THEME;
  else if (themeId === 'story') config = STORY_THEME;
  else if (LAND_THEMES[themeId]) config = LAND_THEMES[themeId];
  else return;

  // Stop transport for rebuild
  Tone.getTransport().stop();
  Tone.getTransport().cancel();

  buildTheme(config, isNight);
  currentThemeId = themeId;
  startParts();
}

/** Stop all music */
function stopMusic() {
  Tone.getTransport().stop();
  Tone.getTransport().cancel();
  cleanup();
}

/** Check if a theme is currently playing */
function getCurrentTheme(): string | null {
  return currentThemeId;
}

const MusicEngine = {
  playTheme,
  stopMusic,
  getCurrentTheme,
  cleanup,
};

export default MusicEngine;
