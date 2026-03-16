/* ================================================================== */
/*  SPARK — The Composer's Score                                       */
/*  "Songs they'll hum when they leave the hospital."                  */
/*                                                                     */
/*  THE SPARK MOTIF: G4 → C5 → E5 → G5                               */
/*  Four notes. A child's courage. Hummable in 3 seconds.             */
/*                                                                     */
/*  q = quarter, h = half, w = whole, e = eighth, r = rest            */
/* ================================================================== */

export interface NoteEvent {
  note: string;
  dur: string;   // Tone.js duration: '4n', '8n', '2n', '1n'
}

export interface ThemeScore {
  id: string;
  tempo: number;
  nightTempo?: number;
  leadType: 'spark' | 'square' | 'crystal' | 'echo' | 'lullaby' | 'whisper' | 'cosmic';
  lead: NoteEvent[];
  chords: { notes: string[]; dur: string }[];
  bass?: NoteEvent[];
  bells?: NoteEvent[];          // sparkle accent notes
  drums?: NoteEvent[];          // kick/heartbeat hits
  noBassDuringNight?: boolean;
  silenceBetweenLoops?: number; // seconds of silence between repeats
}

/* ============================================================ */
/*  THE SPARK THEME — "You Already Are"                         */
/*  Key: C Major | Tempo: 92 BPM | 32 bars                     */
/* ============================================================ */

export const SPARK_THEME: ThemeScore = {
  id: 'home',
  tempo: 92,
  nightTempo: 68,
  leadType: 'spark',
  noBassDuringNight: true,
  lead: [
    // Section A — "The Spark" (bars 1-8): gentle, wondering
    { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },     // Bar 1: THE MOTIF
    { note: 'F5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'C5', dur: '2n' },     // Bar 2: gentle descent
    { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },     // Bar 3: motif repeats
    { note: 'A5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'F5', dur: '4n' }, { note: 'E5', dur: '2n' },     // Bar 4: reaches higher, settles
    { note: 'E5', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'D5', dur: '2n' },     // Bar 5: exploring
    { note: 'E5', dur: '4n' }, { note: 'F5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'A5', dur: '2n' },     // Bar 6: climbing
    { note: 'G5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'D5', dur: '2n' },     // Bar 7: coming home
    { note: 'C5', dur: '1n' },                                                                                         // Bar 8: home

    // Section B — "The Brave One" (bars 9-16): brighter, confident
    { note: 'C5', dur: '8n' }, { note: 'D5', dur: '8n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'C5', dur: '4n' },  // Bar 9
    { note: 'D5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'F5', dur: '4n' }, { note: 'A5', dur: '4n' }, { note: 'G5', dur: '2n' },                                // Bar 10
    { note: 'C5', dur: '8n' }, { note: 'D5', dur: '8n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'A5', dur: '4n' }, { note: 'G5', dur: '4n' },  // Bar 11
    { note: 'B5', dur: '4n' }, { note: 'A5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'E5', dur: '2n' },                                                          // Bar 12: highest!
    { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },     // Bar 13: MOTIF RETURNS triumphant
    { note: 'A5', dur: '4n' }, { note: 'B5', dur: '4n' }, { note: 'C6', dur: '2n+4n' },                               // Bar 14: THE PEAK — C6!
    { note: 'B5', dur: '4n' }, { note: 'A5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'E5', dur: '2n' },     // Bar 15: satisfied descent
    { note: 'C5', dur: '1n' },                                                                                         // Bar 16: home

    // Section C — "You Already Are" (bars 17-24): tender, intimate (the emotional core)
    { note: 'E5', dur: '2n' }, { note: 'D5', dur: '2n' },   // Bar 17
    { note: 'C5', dur: '2n' }, { note: 'G4', dur: '2n' },   // Bar 18: like a whisper
    { note: 'A4', dur: '2n' }, { note: 'B4', dur: '2n' },   // Bar 19: gently rising
    { note: 'C5', dur: '1n' },                                 // Bar 20: resting
    { note: 'E5', dur: '2n' }, { note: 'F5', dur: '2n' },   // Bar 21: something new
    { note: 'G5', dur: '2n' }, { note: 'A5', dur: '2n' },   // Bar 22: building
    { note: 'G5', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '4n' },  // Bar 23: MOTIF marching
    { note: 'G5', dur: '1n' },                                 // Bar 24: held... the bloom moment

    // Section D — "The Hero" (bars 25-32): full, triumphant
    { note: 'G4', dur: '8n' }, { note: 'C5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'G5', dur: '8n' }, { note: 'C6', dur: '2n' },  // Bar 25: MOTIF DOUBLE-TIME+HIGHER
    { note: 'B5', dur: '4n' }, { note: 'A5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'E5', dur: '4n' },                               // Bar 26: cascading sparkles
    { note: 'F5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'A5', dur: '4n' }, { note: 'B5', dur: '4n' },                               // Bar 27: climbing back
    { note: 'C6', dur: '2n' }, { note: 'G5', dur: '2n' },                                                                                       // Bar 28: peak and breathe
    { note: 'E5', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'D5', dur: '4n' },                               // Bar 29: gentle
    { note: 'E5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'C6', dur: '2n' },                                                           // Bar 30: one more peak
    { note: 'G5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'G4', dur: '4n' },                               // Bar 31: motif descending home
    { note: 'C5', dur: '1n' },                                                                                                                   // Bar 32: home
  ],
  chords: [
    // Section A (8 bars, 1 chord per bar)
    { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
    { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
    { notes: ['G3', 'B3', 'D4'], dur: '1n' }, { notes: ['A3', 'C4', 'E4'], dur: '1n' },
    { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
    // Section B
    { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['D3', 'F3', 'A3'], dur: '1n' },
    { notes: ['E3', 'G3', 'B3'], dur: '1n' }, { notes: ['G3', 'B3', 'D4'], dur: '1n' },
    { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['G3', 'B3', 'D4'], dur: '1n' },
    { notes: ['A3', 'C4', 'E4'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
    // Section C
    { notes: ['A3', 'C4', 'E4'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
    { notes: ['G3', 'B3', 'D4'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
    { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['A3', 'C4', 'E4'], dur: '1n' },
    { notes: ['G3', 'B3', 'D4'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
    // Section D
    { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['G3', 'B3', 'D4'], dur: '1n' },
    { notes: ['A3', 'C4', 'E4'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
    { notes: ['D3', 'F3', 'A3'], dur: '1n' }, { notes: ['G3', 'B3', 'D4'], dur: '1n' },
    { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
  ],
  bass: [
    // Section A
    { note: 'C2', dur: '1n' }, { note: 'C2', dur: '1n' }, { note: 'F2', dur: '1n' }, { note: 'F2', dur: '1n' },
    { note: 'G2', dur: '1n' }, { note: 'A2', dur: '1n' }, { note: 'F2', dur: '1n' }, { note: 'C2', dur: '1n' },
    // Section B
    { note: 'C2', dur: '1n' }, { note: 'D2', dur: '1n' }, { note: 'E2', dur: '1n' }, { note: 'G2', dur: '1n' },
    { note: 'F2', dur: '1n' }, { note: 'G2', dur: '1n' }, { note: 'A2', dur: '1n' }, { note: 'C2', dur: '1n' },
    // Section C
    { note: 'A2', dur: '1n' }, { note: 'F2', dur: '1n' }, { note: 'G2', dur: '1n' }, { note: 'C2', dur: '1n' },
    { note: 'F2', dur: '1n' }, { note: 'A2', dur: '1n' }, { note: 'G2', dur: '1n' }, { note: 'C2', dur: '1n' },
    // Section D — walking bass on bars 25-26
    { note: 'C2', dur: '4n' }, { note: 'E2', dur: '4n' }, { note: 'G2', dur: '4n' }, { note: 'C3', dur: '4n' },
    { note: 'G2', dur: '1n' }, { note: 'A2', dur: '1n' }, { note: 'F2', dur: '1n' },
    { note: 'D2', dur: '1n' }, { note: 'G2', dur: '1n' }, { note: 'F2', dur: '1n' }, { note: 'C2', dur: '1n' },
  ],
  bells: [
    // Sparkle accents — bar 23 motif echo and bar 32 ending
    // (timed to appear at specific offsets, handled by MusicEngine)
  ],
};

/* ============================================================ */
/*  MAP THEME — "The Explorer's March"                          */
/*  Key: G Major | Tempo: 120 BPM                              */
/* ============================================================ */

export const MAP_THEME: ThemeScore = {
  id: 'map',
  tempo: 120,
  leadType: 'spark',
  lead: [
    { note: 'G4', dur: '4n' }, { note: 'A4', dur: '4n' }, { note: 'B4', dur: '4n' }, { note: 'D5', dur: '2n' },
    { note: 'B4', dur: '4n' }, { note: 'A4', dur: '4n' }, { note: 'G4', dur: '4n' }, { note: 'E4', dur: '2n' },
    { note: 'D4', dur: '4n' }, { note: 'E4', dur: '4n' }, { note: 'G4', dur: '4n' }, { note: 'A4', dur: '2n' },
    { note: 'B4', dur: '4n' }, { note: 'A4', dur: '4n' }, { note: 'G4', dur: '2n+4n' },
    // Spark motif quote
    { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },
    { note: 'F#5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'B4', dur: '2n' },
    { note: 'A4', dur: '4n' }, { note: 'B4', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'G5', dur: '2n' },
    { note: 'G5', dur: '2n' }, { note: 'D5', dur: '2n' },
  ],
  chords: [
    { notes: ['G3', 'B3', 'D4'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
    { notes: ['D3', 'F#3', 'A3'], dur: '1n' }, { notes: ['G3', 'B3', 'D4'], dur: '1n' },
    { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['E3', 'G3', 'B3'], dur: '1n' },
    { notes: ['D3', 'F#3', 'A3'], dur: '1n' }, { notes: ['G3', 'B3', 'D4'], dur: '1n' },
  ],
  bass: [
    { note: 'G2', dur: '1n' }, { note: 'C2', dur: '1n' }, { note: 'D2', dur: '1n' }, { note: 'G2', dur: '1n' },
    { note: 'C2', dur: '1n' }, { note: 'E2', dur: '1n' }, { note: 'D2', dur: '1n' }, { note: 'G2', dur: '1n' },
  ],
};

/* ============================================================ */
/*  LAND THEMES — Each a hummable song                          */
/* ============================================================ */

export const LAND_THEMES: Record<string, ThemeScore> = {
  /* Dragon's Breath Valley — "The Dragon's Song" (D Dorian, 84 BPM, folk warmth) */
  'dragons-breath': {
    id: 'dragons-breath', tempo: 84, leadType: 'spark',
    lead: [
      { note: 'D4', dur: '4n' }, { note: 'F4', dur: '4n' }, { note: 'A4', dur: '4n' }, { note: 'D5', dur: '2n' },     // DRAGON HOOK
      { note: 'C5', dur: '4n' }, { note: 'A4', dur: '4n' }, { note: 'F4', dur: '4n' }, { note: 'D4', dur: '2n' },     // mirrored descent
      { note: 'D4', dur: '4n' }, { note: 'F4', dur: '4n' }, { note: 'A4', dur: '4n' }, { note: 'D5', dur: '2n' },     // hook repeats
      { note: 'E5', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'A4', dur: '2n' },     // gentle turn
      { note: 'D4', dur: '4n' }, { note: 'E4', dur: '4n' }, { note: 'F4', dur: '4n' }, { note: 'A4', dur: '2n' },     // variation
      { note: 'G4', dur: '4n' }, { note: 'A4', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'C5', dur: '2n' },
      { note: 'A4', dur: '4n' }, { note: 'G4', dur: '4n' }, { note: 'F4', dur: '4n' }, { note: 'E4', dur: '2n' },
      { note: 'D4', dur: '1n' },
      // Spark motif quote
      { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },
      { note: 'F5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'C5', dur: '2n' },
      // Return to dragon hook
      { note: 'D4', dur: '4n' }, { note: 'F4', dur: '4n' }, { note: 'A4', dur: '4n' }, { note: 'D5', dur: '2n' },
      { note: 'C5', dur: '4n' }, { note: 'A4', dur: '4n' }, { note: 'F4', dur: '4n' }, { note: 'D4', dur: '2n' },
      { note: 'A4', dur: '2n' }, { note: 'F4', dur: '2n' },
      { note: 'D4', dur: '1n' },
    ],
    chords: [
      { notes: ['D3', 'F3', 'A3'], dur: '1n' }, { notes: ['D3', 'F3', 'A3'], dur: '1n' },
      { notes: ['Bb3', 'D4', 'F4'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
      { notes: ['D3', 'F3', 'A3'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
      { notes: ['G3', 'Bb3', 'D4'], dur: '1n' }, { notes: ['D3', 'F3', 'A3'], dur: '1n' },
      { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
      { notes: ['D3', 'F3', 'A3'], dur: '1n' }, { notes: ['D3', 'F3', 'A3'], dur: '1n' },
      { notes: ['Bb3', 'D4', 'F4'], dur: '1n' }, { notes: ['A3', 'C#4', 'E4'], dur: '1n' },
      { notes: ['D3', 'F3', 'A3'], dur: '1n' }, { notes: ['D3', 'F3', 'A3'], dur: '1n' },
    ],
    bass: [
      { note: 'D2', dur: '1n' }, { note: 'D2', dur: '1n' }, { note: 'Bb2', dur: '1n' }, { note: 'C2', dur: '1n' },
      { note: 'D2', dur: '1n' }, { note: 'F2', dur: '1n' }, { note: 'G2', dur: '1n' }, { note: 'D2', dur: '1n' },
      { note: 'C2', dur: '1n' }, { note: 'F2', dur: '1n' }, { note: 'D2', dur: '1n' }, { note: 'D2', dur: '1n' },
      { note: 'Bb2', dur: '1n' }, { note: 'A2', dur: '1n' }, { note: 'D2', dur: '1n' }, { note: 'D2', dur: '1n' },
    ],
  },

  /* Sugar Crystal Caves — "Crystal Lullaby" (E Major, 76 BPM, music box) */
  'sugar-crystals': {
    id: 'sugar-crystals', tempo: 76, leadType: 'crystal',
    lead: [
      { note: 'E5', dur: '8n' }, { note: 'G#5', dur: '8n' }, { note: 'B5', dur: '4n' }, { note: 'E6', dur: '2n' },
      { note: 'D#6', dur: '4n' }, { note: 'B5', dur: '4n' }, { note: 'G#5', dur: '4n' }, { note: 'E5', dur: '2n' },
      { note: 'E5', dur: '8n' }, { note: 'G#5', dur: '8n' }, { note: 'B5', dur: '4n' }, { note: 'E6', dur: '2n' },
      { note: 'C#6', dur: '4n' }, { note: 'B5', dur: '4n' }, { note: 'A5', dur: '4n' }, { note: 'G#5', dur: '2n' },
      { note: 'E5', dur: '2n' }, { note: 'G#5', dur: '2n' }, { note: 'B5', dur: '2n' }, { note: 'E6', dur: '2n' },
      // Spark motif
      { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },
      { note: 'E5', dur: '8n' }, { note: 'G#5', dur: '8n' }, { note: 'B5', dur: '4n' }, { note: 'E6', dur: '2n' },
      { note: 'E5', dur: '1n' },
    ],
    chords: [
      { notes: ['E3', 'G#3', 'B3'], dur: '1n' }, { notes: ['E3', 'G#3', 'B3'], dur: '1n' },
      { notes: ['A3', 'C#4', 'E4'], dur: '1n' }, { notes: ['B3', 'D#4', 'F#4'], dur: '1n' },
      { notes: ['C#3', 'E3', 'G#3'], dur: '1n' }, { notes: ['A3', 'C#4', 'E4'], dur: '1n' },
      { notes: ['E3', 'G#3', 'B3'], dur: '1n' }, { notes: ['E3', 'G#3', 'B3'], dur: '1n' },
    ],
  },

  /* Thunder Wheel Speedway — "Roll Thunder" (A Major, 138 BPM, racing anthem) */
  'thunder-wheels': {
    id: 'thunder-wheels', tempo: 138, leadType: 'square',
    lead: [
      { note: 'A4', dur: '8n' }, { note: 'A4', dur: '8n' }, { note: 'C#5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'A5', dur: '2n' },
      { note: 'G#5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'C#5', dur: '8n' }, { note: 'A4', dur: '8n' }, { note: 'B4', dur: '2n' },
      { note: 'A4', dur: '8n' }, { note: 'A4', dur: '8n' }, { note: 'C#5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'A5', dur: '2n' },
      { note: 'B5', dur: '4n' }, { note: 'A5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'C#5', dur: '4n' },
      { note: 'A4', dur: '8n' }, { note: 'B4', dur: '8n' }, { note: 'C#5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'F#5', dur: '4n' }, { note: 'E5', dur: '4n' },
      // Spark motif
      { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },
      { note: 'A4', dur: '8n' }, { note: 'A4', dur: '8n' }, { note: 'C#5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'A5', dur: '2n' },
      { note: 'A5', dur: '1n' },
    ],
    chords: [
      { notes: ['A3', 'C#4', 'E4'], dur: '1n' }, { notes: ['D3', 'F#3', 'A3'], dur: '1n' },
      { notes: ['A3', 'C#4', 'E4'], dur: '1n' }, { notes: ['E3', 'G#3', 'B3'], dur: '1n' },
      { notes: ['F#3', 'A3', 'C#4'], dur: '1n' }, { notes: ['D3', 'F#3', 'A3'], dur: '1n' },
      { notes: ['E3', 'G#3', 'B3'], dur: '1n' }, { notes: ['A3', 'C#4', 'E4'], dur: '1n' },
    ],
    bass: [
      { note: 'A2', dur: '8n' }, { note: 'A2', dur: '8n' }, { note: 'E2', dur: '8n' }, { note: 'A2', dur: '8n' },
      { note: 'D2', dur: '8n' }, { note: 'D2', dur: '8n' }, { note: 'A2', dur: '8n' }, { note: 'D2', dur: '8n' },
      { note: 'A2', dur: '8n' }, { note: 'A2', dur: '8n' }, { note: 'E2', dur: '8n' }, { note: 'A2', dur: '8n' },
      { note: 'E2', dur: '4n' }, { note: 'E2', dur: '4n' }, { note: 'A2', dur: '2n' },
      { note: 'F#2', dur: '4n' }, { note: 'F#2', dur: '4n' }, { note: 'D2', dur: '2n' },
      { note: 'C2', dur: '2n' }, { note: 'G2', dur: '2n' },
      { note: 'A2', dur: '8n' }, { note: 'A2', dur: '8n' }, { note: 'E2', dur: '8n' }, { note: 'A2', dur: '8n' },
      { note: 'A2', dur: '1n' },
    ],
    drums: [
      // Kick on 1 and 3, snare on 2 and 4
      { note: 'C2', dur: '4n' }, { note: 'C2', dur: '4n' }, { note: 'C2', dur: '4n' }, { note: 'C2', dur: '4n' },
    ],
  },

  /* The Quiet Forest — "Ember's Lullaby" (F Major, 60 BPM, the one parents cry to) */
  'quiet-forest': {
    id: 'quiet-forest', tempo: 60, leadType: 'lullaby',
    silenceBetweenLoops: 8,
    lead: [
      { note: 'F4', dur: '2n' }, { note: 'A4', dur: '2n' },     // Bar 1: just two notes
      { note: 'C5', dur: '2n' }, { note: 'C5', dur: '2n' },     // Bar 2: one note then space (rest becomes held note)
      { note: 'A4', dur: '2n' }, { note: 'G4', dur: '2n' },     // Bar 3: gentle descent
      { note: 'F4', dur: '1n' },                                   // Bar 4: home, hold it...
      { note: 'F4', dur: '2n' }, { note: 'A4', dur: '2n' },     // Bar 5: repeat (familiar)
      { note: 'C5', dur: '2n' }, { note: 'C5', dur: '2n' },     // Bar 6
      { note: 'A4', dur: '2n' }, { note: 'G4', dur: '2n' },     // Bar 7
      { note: 'F4', dur: '1n' },                                   // Bar 8
      // Spark motif fragment (partial, gentle)
      { note: 'G4', dur: '2n' }, { note: 'C5', dur: '2n' },     // Bar 9: motif starts
      { note: 'E5', dur: '1n' },                                   // Bar 10: held... then silence
      { note: 'F4', dur: '1n' },                                   // Bar 11
      { note: 'F4', dur: '1n' },                                   // Bar 12: peace
    ],
    chords: [
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
      { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
    ],
    // NO bass. NO drums. This is the lullaby.
  },

  /* The Echo Chamber — "Sound Made Visible" (Bb Major, 88 BPM, melody talks to its echo) */
  'echo-chamber': {
    id: 'echo-chamber', tempo: 88, leadType: 'echo',
    lead: [
      { note: 'Bb4', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'F5', dur: '4n' }, { note: 'F5', dur: '4n' },  // play 3 notes... echo fills
      { note: 'A5', dur: '2n' }, { note: 'F5', dur: '2n' },
      { note: 'Eb5', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'Bb4', dur: '2n+4n' },
      { note: 'Bb4', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'F5', dur: '4n' }, { note: 'Bb5', dur: '2n' },
      { note: 'A5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'F5', dur: '4n' }, { note: 'D5', dur: '2n' },
      // Spark motif (echoed)
      { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },
      { note: 'F5', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'Bb4', dur: '2n+4n' },
      { note: 'Bb4', dur: '1n' },
    ],
    chords: [
      { notes: ['Bb3', 'D4', 'F4'], dur: '1n' }, { notes: ['Eb3', 'G3', 'Bb3'], dur: '1n' },
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['Bb3', 'D4', 'F4'], dur: '1n' },
      { notes: ['Bb3', 'D4', 'F4'], dur: '1n' }, { notes: ['G3', 'Bb3', 'D4'], dur: '1n' },
      { notes: ['Eb3', 'G3', 'Bb3'], dur: '1n' }, { notes: ['Bb3', 'D4', 'F4'], dur: '1n' },
    ],
  },

  /* Spark Tower — "Electric Dreams" (C Major, 132 BPM, 8-bit hero) */
  'spark-tower': {
    id: 'spark-tower', tempo: 132, leadType: 'square',
    lead: [
      { note: 'C5', dur: '8n' }, { note: 'C5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'G5', dur: '8n' }, { note: 'C6', dur: '4n' },
      { note: 'G5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'D5', dur: '8n' }, { note: 'C5', dur: '8n' }, { note: 'D5', dur: '4n' }, { note: 'E5', dur: '4n' },
      { note: 'C5', dur: '8n' }, { note: 'C5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'G5', dur: '8n' }, { note: 'C6', dur: '4n' },
      { note: 'D5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'F5', dur: '8n' }, { note: 'G5', dur: '8n' }, { note: 'A5', dur: '4n' }, { note: 'G5', dur: '4n' },
      // Spark motif 8-bit style
      { note: 'G4', dur: '8n' }, { note: 'C5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'G5', dur: '8n' }, { note: 'G5', dur: '2n' },
      { note: 'C5', dur: '8n' }, { note: 'C5', dur: '8n' }, { note: 'E5', dur: '8n' }, { note: 'G5', dur: '8n' }, { note: 'C6', dur: '2n' },
      { note: 'C6', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'C5', dur: '4n' },
      { note: 'C5', dur: '1n' },
    ],
    chords: [
      { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
      { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['G3', 'B3', 'D4'], dur: '1n' },
      { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
    ],
    bass: [
      { note: 'C2', dur: '8n' }, { note: 'C2', dur: '8n' }, { note: 'G2', dur: '8n' }, { note: 'C2', dur: '8n' },
      { note: 'F2', dur: '8n' }, { note: 'F2', dur: '8n' }, { note: 'C2', dur: '8n' }, { note: 'F2', dur: '8n' },
      { note: 'C2', dur: '8n' }, { note: 'C2', dur: '8n' }, { note: 'G2', dur: '8n' }, { note: 'C2', dur: '8n' },
      { note: 'G2', dur: '4n' }, { note: 'G2', dur: '4n' }, { note: 'C2', dur: '2n' },
      { note: 'C2', dur: '2n' }, { note: 'G2', dur: '2n' },
      { note: 'C2', dur: '4n' }, { note: 'E2', dur: '4n' }, { note: 'G2', dur: '4n' }, { note: 'C3', dur: '4n' },
      { note: 'F2', dur: '2n' }, { note: 'G2', dur: '2n' },
      { note: 'C2', dur: '1n' },
    ],
  },

  /* The Kaleidoscope — "Rainbow Spin" (key-cycling, 108 BPM, playful) */
  'kaleidoscope': {
    id: 'kaleidoscope', tempo: 108, leadType: 'spark',
    lead: [
      // C major pattern
      { note: 'C4', dur: '8n' }, { note: 'D4', dur: '8n' }, { note: 'E4', dur: '4n' }, { note: 'D4', dur: '8n' }, { note: 'C4', dur: '8n' }, { note: 'E4', dur: '4n' }, { note: 'G4', dur: '2n' },
      { note: 'G4', dur: '4n' }, { note: 'E4', dur: '4n' }, { note: 'C4', dur: '2n' },
      // D major pattern (same rhythm, transposed)
      { note: 'D4', dur: '8n' }, { note: 'E4', dur: '8n' }, { note: 'F#4', dur: '4n' }, { note: 'E4', dur: '8n' }, { note: 'D4', dur: '8n' }, { note: 'F#4', dur: '4n' }, { note: 'A4', dur: '2n' },
      { note: 'A4', dur: '4n' }, { note: 'F#4', dur: '4n' }, { note: 'D4', dur: '2n' },
      // E major (higher, brighter)
      { note: 'E4', dur: '8n' }, { note: 'F#4', dur: '8n' }, { note: 'G#4', dur: '4n' }, { note: 'F#4', dur: '8n' }, { note: 'E4', dur: '8n' }, { note: 'G#4', dur: '4n' }, { note: 'B4', dur: '2n' },
      // Spark motif resolving back to C
      { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },
      { note: 'E5', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'G4', dur: '2n' },
    ],
    chords: [
      { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
      { notes: ['D3', 'F#3', 'A3'], dur: '1n' }, { notes: ['D3', 'F#3', 'A3'], dur: '1n' },
      { notes: ['E3', 'G#3', 'B3'], dur: '1n' },
      { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['G3', 'B3', 'D4'], dur: '1n' },
    ],
  },

  /* Giant's Garden — "Growing Song" (Eb Major, 72 BPM, grand and warm) */
  'giants-garden': {
    id: 'giants-garden', tempo: 72, leadType: 'spark',
    lead: [
      { note: 'Eb3', dur: '2n' }, { note: 'Eb4', dur: '2n' }, { note: 'Eb5', dur: '1n' },  // GROWING! 3 octaves
      { note: 'Bb4', dur: '4n' }, { note: 'Ab4', dur: '4n' }, { note: 'G4', dur: '4n' }, { note: 'Eb4', dur: '2n+4n' },  // giant sits
      { note: 'Eb4', dur: '4n' }, { note: 'G4', dur: '4n' }, { note: 'Bb4', dur: '4n' }, { note: 'Eb5', dur: '2n' },
      { note: 'Db5', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'Bb4', dur: '4n' }, { note: 'Ab4', dur: '2n' },
      { note: 'G4', dur: '2n' }, { note: 'Ab4', dur: '2n' },
      { note: 'Bb4', dur: '1n' },
      // Spark motif
      { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },
      { note: 'Eb5', dur: '2n' }, { note: 'Bb4', dur: '2n' },
      { note: 'Eb4', dur: '1n' },
    ],
    chords: [
      { notes: ['Eb3', 'G3', 'Bb3'], dur: '1n' }, { notes: ['Eb3', 'G3', 'Bb3'], dur: '1n' },
      { notes: ['Ab3', 'C4', 'Eb4'], dur: '1n' }, { notes: ['Eb3', 'G3', 'Bb3'], dur: '1n' },
      { notes: ['Ab3', 'C4', 'Eb4'], dur: '1n' }, { notes: ['Bb3', 'D4', 'F4'], dur: '1n' },
      { notes: ['Eb3', 'G3', 'Bb3'], dur: '1n' },
      { notes: ['C3', 'E3', 'G3'], dur: '1n' },
      { notes: ['Eb3', 'G3', 'Bb3'], dur: '1n' },
    ],
    bass: [
      { note: 'Eb2', dur: '1n' }, { note: 'Eb2', dur: '1n' },
      { note: 'Ab2', dur: '1n' }, { note: 'Eb2', dur: '1n' },
      { note: 'Ab2', dur: '1n' }, { note: 'Bb2', dur: '1n' },
      { note: 'Eb2', dur: '1n' }, { note: 'C2', dur: '1n' }, { note: 'Eb2', dur: '1n' },
    ],
  },

  /* Shield Fortress — "The Guardian" (F Major, 96 BPM, doubled notes = strength) */
  'shield-fortress': {
    id: 'shield-fortress', tempo: 96, leadType: 'spark',
    lead: [
      { note: 'F4', dur: '8n' }, { note: 'F4', dur: '8n' }, { note: 'A4', dur: '8n' }, { note: 'A4', dur: '8n' }, { note: 'C5', dur: '4n' }, { note: 'F5', dur: '4n' },
      { note: 'F5', dur: '8n' }, { note: 'F5', dur: '8n' }, { note: 'E5', dur: '4n' }, { note: 'D5', dur: '4n' }, { note: 'C5', dur: '4n' },
      { note: 'F4', dur: '8n' }, { note: 'F4', dur: '8n' }, { note: 'A4', dur: '8n' }, { note: 'A4', dur: '8n' }, { note: 'C5', dur: '4n' }, { note: 'F5', dur: '4n' },
      { note: 'G5', dur: '4n' }, { note: 'F5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'C5', dur: '4n' },
      // Spark motif
      { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },
      { note: 'F5', dur: '8n' }, { note: 'F5', dur: '8n' }, { note: 'C5', dur: '8n' }, { note: 'C5', dur: '8n' }, { note: 'A4', dur: '4n' }, { note: 'F4', dur: '4n' },
      { note: 'F4', dur: '1n' },
    ],
    chords: [
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['Bb3', 'D4', 'F4'], dur: '1n' },
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
      { notes: ['C3', 'E3', 'G3'], dur: '1n' },
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
    ],
    bass: [
      { note: 'F2', dur: '1n' }, { note: 'Bb2', dur: '1n' }, { note: 'F2', dur: '1n' }, { note: 'C2', dur: '1n' },
      { note: 'C2', dur: '1n' }, { note: 'F2', dur: '1n' }, { note: 'F2', dur: '1n' },
    ],
  },

  /* Brave Heart Castle — "Every Beat" (Ab Major, 72 BPM, heartbeat rhythm) */
  'brave-heart': {
    id: 'brave-heart', tempo: 72, leadType: 'spark',
    lead: [
      // da-DUM da-DUM then melody
      { note: 'Ab4', dur: '8n' }, { note: 'Eb5', dur: '4n+8n' }, { note: 'Ab4', dur: '8n' }, { note: 'Eb5', dur: '4n+8n' },
      { note: 'F5', dur: '4n' }, { note: 'Eb5', dur: '4n' }, { note: 'Db5', dur: '4n' }, { note: 'C5', dur: '2n+4n' },
      { note: 'Ab4', dur: '8n' }, { note: 'Eb5', dur: '4n+8n' }, { note: 'Ab4', dur: '8n' }, { note: 'Eb5', dur: '4n+8n' },
      { note: 'F5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'Ab5', dur: '2n+4n' },
      { note: 'Ab5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'F5', dur: '4n' }, { note: 'Eb5', dur: '2n' },
      { note: 'Db5', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'Bb4', dur: '4n' }, { note: 'Ab4', dur: '2n' },
      // Spark motif
      { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },
      { note: 'Ab4', dur: '1n' },
    ],
    chords: [
      { notes: ['Ab3', 'C4', 'Eb4'], dur: '1n' }, { notes: ['Db3', 'F3', 'Ab3'], dur: '1n' },
      { notes: ['Ab3', 'C4', 'Eb4'], dur: '1n' }, { notes: ['Eb3', 'G3', 'Bb3'], dur: '1n' },
      { notes: ['F3', 'Ab3', 'C4'], dur: '1n' }, { notes: ['Db3', 'F3', 'Ab3'], dur: '1n' },
      { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['Ab3', 'C4', 'Eb4'], dur: '1n' },
    ],
    // Heartbeat drum
    drums: [
      { note: 'C2', dur: '8n' }, { note: 'C2', dur: '4n+8n' },  // da-DUM pattern repeats
    ],
  },

  /* Thought Weaver's Loom — "Untangle" (Db Major, 54 BPM, mostly silence) */
  'thought-weaver': {
    id: 'thought-weaver', tempo: 54, leadType: 'whisper',
    silenceBetweenLoops: 12,
    lead: [
      { note: 'Db5', dur: '1n' },           // one note...
      { note: 'Db5', dur: '1n' },           // long rest (same note held = effective rest)
      { note: 'Ab4', dur: '1n' },           // another note...
      { note: 'Ab4', dur: '1n' },           // rest
      { note: 'Eb4', dur: '1n' },           // descending...
      { note: 'Eb4', dur: '1n' },           // rest
      { note: 'Db4', dur: '1n' },           // home
      { note: 'Db4', dur: '1n' },           // held... silence is safe
    ],
    chords: [
      { notes: ['Db3', 'F3', 'Ab3'], dur: '1n' }, { notes: ['Db3', 'F3', 'Ab3'], dur: '1n' },
      { notes: ['Db3', 'F3', 'Ab3'], dur: '1n' }, { notes: ['Db3', 'F3', 'Ab3'], dur: '1n' },
      { notes: ['Db3', 'F3', 'Ab3'], dur: '1n' }, { notes: ['Db3', 'F3', 'Ab3'], dur: '1n' },
      { notes: ['Db3', 'F3', 'Ab3'], dur: '1n' }, { notes: ['Db3', 'F3', 'Ab3'], dur: '1n' },
    ],
    // NO bass. NO drums. Silence is the design.
  },

  /* Star Lungs Station — "Cosmic Breath" (C Major high, 76 BPM, weightless) */
  'star-lungs': {
    id: 'star-lungs', tempo: 76, leadType: 'cosmic',
    lead: [
      { note: 'C5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'C6', dur: '2n' },     // ascending into space
      { note: 'C6', dur: '2n' }, { note: 'C6', dur: '2n' },                                   // breathing pause
      { note: 'C6', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'C5', dur: '2n' },     // descending home
      { note: 'D5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'C6', dur: '2n+4n' },
      { note: 'B5', dur: '4n' }, { note: 'A5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'E5', dur: '2n' },
      // Spark motif
      { note: 'G4', dur: '4n' }, { note: 'C5', dur: '4n' }, { note: 'E5', dur: '4n' }, { note: 'G5', dur: '2n' },
      { note: 'C5', dur: '4n' }, { note: 'G5', dur: '4n' }, { note: 'C6', dur: '2n' },
      { note: 'C5', dur: '1n' },
    ],
    chords: [
      { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['G3', 'B3', 'D4'], dur: '1n' },
      { notes: ['A3', 'C4', 'E4'], dur: '1n' },
      { notes: ['C3', 'E3', 'G3'], dur: '1n' },
      { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
    ],
    bass: [
      { note: 'C2', dur: '1n' }, { note: 'C2', dur: '1n' },
      { note: 'F2', dur: '1n' }, { note: 'G2', dur: '1n' },
      { note: 'A2', dur: '1n' }, { note: 'C2', dur: '1n' },
      { note: 'F2', dur: '1n' }, { note: 'C2', dur: '1n' },
    ],
  },
};

/* ============================================================ */
/*  STORY READING — Gentle background                           */
/* ============================================================ */

export const STORY_THEME: ThemeScore = {
  id: 'story',
  tempo: 72,
  nightTempo: 60,
  leadType: 'lullaby',
  noBassDuringNight: true,
  lead: [
    { note: 'C4', dur: '2n' }, { note: 'E4', dur: '2n' },
    { note: 'G4', dur: '2n' }, { note: 'C5', dur: '2n' },
    { note: 'G4', dur: '2n' }, { note: 'E4', dur: '2n' },
    { note: 'F4', dur: '2n' }, { note: 'E4', dur: '2n' },
    { note: 'D4', dur: '2n' }, { note: 'F4', dur: '2n' },
    { note: 'A4', dur: '2n' }, { note: 'G4', dur: '2n' },
    { note: 'F4', dur: '2n' }, { note: 'E4', dur: '2n' },
    { note: 'D4', dur: '2n' }, { note: 'C4', dur: '1n' },
  ],
  chords: [
    { notes: ['C3', 'E3', 'G3'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
    { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['F3', 'A3', 'C4'], dur: '1n' },
    { notes: ['G3', 'B3', 'D4'], dur: '1n' }, { notes: ['G3', 'B3', 'D4'], dur: '1n' },
    { notes: ['F3', 'A3', 'C4'], dur: '1n' }, { notes: ['C3', 'E3', 'G3'], dur: '1n' },
  ],
};
