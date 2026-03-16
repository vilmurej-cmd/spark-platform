/* ================================================================== */
/*  SPARK Music Engine — "Songs they'll hum when they leave"           */
/*  Plays composed ThemeScore data through themed instruments           */
/* ================================================================== */

import * as Tone from 'tone';
import SoundEngine from './SoundEngine';
import {
  createSparkLead, createSquareLead, createCrystalLead, createEchoLead,
  createLullabySine, createWhisperSine, createCosmicLead,
  createPadSynth, createBassSynth, createHeartbeatDrum, createKickSynth,
} from './instruments';
import {
  SPARK_THEME, MAP_THEME, LAND_THEMES, STORY_THEME,
  type ThemeScore, type NoteEvent,
} from './melodies';

let leadSynth: Tone.Synth | null = null;
let padSynth: Tone.PolySynth | null = null;
let bassSynth: Tone.Synth | null = null;
let drumSynth: Tone.MembraneSynth | null = null;
let leadPart: Tone.Part | null = null;
let chordPart: Tone.Part | null = null;
let bassPart: Tone.Part | null = null;
let drumPart: Tone.Part | null = null;
let currentThemeId: string | null = null;

function disposeAll() {
  [leadPart, chordPart, bassPart, drumPart].forEach(p => {
    if (p) { try { p.stop(); p.dispose(); } catch { /* ok */ } }
  });
  [leadSynth, padSynth, bassSynth, drumSynth].forEach(s => {
    if (s) { try { s.dispose(); } catch { /* ok */ } }
  });
  leadPart = chordPart = bassPart = drumPart = null;
  leadSynth = padSynth = bassSynth = drumSynth = null;
  currentThemeId = null;
}

function createLeadForType(type: ThemeScore['leadType']): Tone.Synth {
  switch (type) {
    case 'spark': return createSparkLead();
    case 'square': return createSquareLead();
    case 'crystal': return createCrystalLead();
    case 'echo': return createEchoLead();
    case 'lullaby': return createLullabySine();
    case 'whisper': return createWhisperSine();
    case 'cosmic': return createCosmicLead();
    default: return createSparkLead();
  }
}

/** Convert NoteEvent array to timed Tone.Part events */
function buildNoteEvents(notes: NoteEvent[]): [number, { note: string; dur: string }][] {
  const events: [number, { note: string; dur: string }][] = [];
  let time = 0;
  for (const n of notes) {
    events.push([time, { note: n.note, dur: n.dur }]);
    time += Tone.Time(n.dur).toSeconds();
  }
  return events;
}

function getLoopLength(events: [number, { note: string; dur: string }][]): number {
  if (events.length === 0) return 4;
  const last = events[events.length - 1];
  return last[0] + Tone.Time(last[1].dur).toSeconds();
}

function buildTheme(score: ThemeScore, isNight = false) {
  disposeAll();

  const tempo = isNight && score.nightTempo ? score.nightTempo : score.tempo;
  Tone.getTransport().bpm.value = tempo;

  // Lead melody
  leadSynth = createLeadForType(isNight ? 'lullaby' : score.leadType);
  if (isNight) leadSynth.volume.value = -18;

  const leadEvents = buildNoteEvents(score.lead);
  const leadLength = getLoopLength(leadEvents);
  const silenceGap = score.silenceBetweenLoops || 0;
  const totalLoopLength = leadLength + silenceGap;

  leadPart = new Tone.Part((t, val) => {
    if (!SoundEngine.isEnabled || !leadSynth) return;
    leadSynth.triggerAttackRelease(val.note, val.dur, t);
  }, leadEvents);
  leadPart.loop = true;
  leadPart.loopEnd = totalLoopLength;

  // Pad chords
  padSynth = createPadSynth();
  if (isNight) padSynth.volume.value = -22;

  const chordEvents: [number, { notes: string[]; dur: string }][] = [];
  let chordTime = 0;
  for (const c of score.chords) {
    chordEvents.push([chordTime, c]);
    chordTime += Tone.Time(c.dur).toSeconds();
  }
  const chordLength = chordTime || leadLength;

  chordPart = new Tone.Part((t, val) => {
    if (!SoundEngine.isEnabled || !padSynth) return;
    padSynth.triggerAttackRelease(val.notes, val.dur, t);
  }, chordEvents);
  chordPart.loop = true;
  chordPart.loopEnd = Math.max(chordLength, totalLoopLength);

  // Bass
  const skipBass = isNight && score.noBassDuringNight;
  if (score.bass && !skipBass) {
    bassSynth = createBassSynth();
    if (isNight) bassSynth.volume.value = -16;
    const bassEvents = buildNoteEvents(score.bass);
    const bassLength = getLoopLength(bassEvents);

    bassPart = new Tone.Part((t, val) => {
      if (!SoundEngine.isEnabled || !bassSynth) return;
      bassSynth.triggerAttackRelease(val.note, val.dur, t);
    }, bassEvents);
    bassPart.loop = true;
    bassPart.loopEnd = Math.max(bassLength, totalLoopLength);
  }

  // Drums (heartbeat / kick)
  if (score.drums && !isNight) {
    drumSynth = score.id === 'brave-heart' ? createHeartbeatDrum() : createKickSynth();
    const drumEvents = buildNoteEvents(score.drums);
    const drumLength = getLoopLength(drumEvents);

    drumPart = new Tone.Part((t, val) => {
      if (!SoundEngine.isEnabled || !drumSynth) return;
      drumSynth.triggerAttackRelease(val.note, val.dur, t);
    }, drumEvents);
    drumPart.loop = true;
    drumPart.loopEnd = drumLength; // drums loop independently at their own rate
  }
}

function startParts() {
  if (leadPart) leadPart.start(0);
  if (chordPart) chordPart.start(0);
  if (bassPart) bassPart.start(0);
  if (drumPart) drumPart.start(0);
  Tone.getTransport().start();
}

function resolveScore(themeId: string): ThemeScore | null {
  if (themeId === 'home') return SPARK_THEME;
  if (themeId === 'map') return MAP_THEME;
  if (themeId === 'story') return STORY_THEME;
  if (LAND_THEMES[themeId]) return LAND_THEMES[themeId];
  return null;
}

/** Play a theme by ID — crossfades if something is already playing */
function playTheme(themeId: string, isNight = false) {
  if (!SoundEngine.isEnabled) return;
  if (currentThemeId === themeId) return;

  const score = resolveScore(themeId);
  if (!score) return;

  Tone.getTransport().stop();
  Tone.getTransport().cancel();

  buildTheme(score, isNight);
  currentThemeId = themeId;
  startParts();
}

/** Stop all music */
function stopMusic() {
  Tone.getTransport().stop();
  Tone.getTransport().cancel();
  disposeAll();
}

function getCurrentTheme(): string | null {
  return currentThemeId;
}

const MusicEngine = {
  playTheme,
  stopMusic,
  getCurrentTheme,
  cleanup: disposeAll,
};

export default MusicEngine;
