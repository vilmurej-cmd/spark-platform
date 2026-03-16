/* ================================================================== */
/*  Musical phrases and patterns for each area                         */
/* ================================================================== */

export interface ThemeConfig {
  tempo: number;
  lead: { notes: string[]; durations: string[] };
  chords: string[][];
  bass?: { notes: string[]; durations: string[] };
  nightTempo?: number;
}

/** Home Screen — "The Brave World Theme" (C Major, warm, hopeful) */
export const HOME_THEME: ThemeConfig = {
  tempo: 100,
  lead: {
    notes: ['C4', 'E4', 'G4', 'A4', 'G4', 'E4', 'F4', 'E4',
            'D4', 'F4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'],
    durations: ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n',
                '4n', '4n', '4n', '4n', '4n', '4n', '4n', '2n'],
  },
  chords: [
    ['C3', 'E3', 'G3'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'],
    ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C3', 'E3', 'G3'], ['C3', 'E3', 'G3'],
  ],
  bass: {
    notes: ['C2', 'F2', 'G2', 'A2', 'F2', 'G2', 'C2', 'C2'],
    durations: ['1n', '1n', '1n', '1n', '1n', '1n', '1n', '1n'],
  },
  nightTempo: 72,
};

/** Brave World Map — "The Explorer's March" (G Major, adventurous) */
export const MAP_THEME: ThemeConfig = {
  tempo: 120,
  lead: {
    notes: ['G4', 'A4', 'B4', 'D5', 'B4', 'A4', 'G4', 'E4',
            'D4', 'E4', 'G4', 'A4', 'B4', 'A4', 'G4', 'G4'],
    durations: ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n',
                '4n', '4n', '4n', '4n', '4n', '4n', '4n', '2n'],
  },
  chords: [
    ['G3', 'B3', 'D4'], ['C3', 'E3', 'G3'], ['D3', 'F#3', 'A3'], ['G3', 'B3', 'D4'],
    ['E3', 'G3', 'B3'], ['C3', 'E3', 'G3'], ['D3', 'F#3', 'A3'], ['G3', 'B3', 'D4'],
  ],
  bass: {
    notes: ['G2', 'C2', 'D2', 'G2', 'E2', 'C2', 'D2', 'G2'],
    durations: ['1n', '1n', '1n', '1n', '1n', '1n', '1n', '1n'],
  },
};

/** Land themes — each with unique musical identity */
export const LAND_THEMES: Record<string, ThemeConfig> = {
  'dragons-breath': {
    tempo: 90,
    lead: {
      notes: ['D4', 'F4', 'A4', 'D5', 'C5', 'A4', 'G4', 'F4',
              'D4', 'E4', 'F4', 'A4', 'G4', 'F4', 'E4', 'D4'],
      durations: ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n',
                  '4n', '4n', '4n', '4n', '4n', '4n', '4n', '2n'],
    },
    chords: [
      ['D3', 'F3', 'A3'], ['Bb3', 'D4', 'F4'], ['C3', 'E3', 'G3'], ['D3', 'F#3', 'A3'],
      ['G3', 'Bb3', 'D4'], ['A3', 'C#4', 'E4'], ['D3', 'F#3', 'A3'], ['D3', 'F#3', 'A3'],
    ],
  },
  'sugar-crystals': {
    tempo: 88,
    lead: {
      notes: ['E5', 'G#5', 'B5', 'E6', 'B5', 'G#5', 'E5', 'C#5',
              'B4', 'E5', 'G#5', 'B5', 'A5', 'G#5', 'F#5', 'E5'],
      durations: ['8n', '8n', '8n', '8n', '8n', '8n', '8n', '8n',
                  '8n', '8n', '8n', '8n', '8n', '8n', '8n', '4n'],
    },
    chords: [
      ['E3', 'G#3', 'B3'], ['A3', 'C#4', 'E4'], ['B3', 'D#4', 'F#4'], ['E3', 'G#3', 'B3'],
      ['C#3', 'E3', 'G#3'], ['A3', 'C#4', 'E4'], ['B3', 'D#4', 'F#4'], ['E3', 'G#3', 'B3'],
    ],
  },
  'thunder-wheels': {
    tempo: 140,
    lead: {
      notes: ['A4', 'C#5', 'E5', 'A5', 'E5', 'C#5', 'A4', 'F#4',
              'E4', 'F#4', 'A4', 'B4', 'C#5', 'B4', 'A4', 'A4'],
      durations: ['8n', '8n', '8n', '8n', '8n', '8n', '8n', '8n',
                  '8n', '8n', '8n', '8n', '8n', '8n', '8n', '4n'],
    },
    chords: [
      ['A3', 'C#4', 'E4'], ['D3', 'F#3', 'A3'], ['E3', 'G#3', 'B3'], ['A3', 'C#4', 'E4'],
      ['F#3', 'A3', 'C#4'], ['D3', 'F#3', 'A3'], ['E3', 'G#3', 'B3'], ['A3', 'C#4', 'E4'],
    ],
    bass: {
      notes: ['A2', 'D2', 'E2', 'A2', 'F#2', 'D2', 'E2', 'A2'],
      durations: ['2n', '2n', '2n', '2n', '2n', '2n', '2n', '2n'],
    },
  },
  'quiet-forest': {
    tempo: 66,
    lead: {
      notes: ['F4', 'A4', 'C5', 'F5', 'C5', 'A4', 'G4', 'F4',
              'E4', 'F4', 'A4', 'C5', 'Bb4', 'A4', 'G4', 'F4'],
      durations: ['2n', '2n', '2n', '2n', '2n', '2n', '2n', '2n',
                  '2n', '2n', '2n', '2n', '2n', '2n', '2n', '1n'],
    },
    chords: [
      ['F3', 'A3', 'C4'], ['Bb3', 'D4', 'F4'], ['C3', 'E3', 'G3'], ['F3', 'A3', 'C4'],
      ['Dm3', 'F3', 'A3'], ['Bb3', 'D4', 'F4'], ['C3', 'E3', 'G3'], ['F3', 'A3', 'C4'],
    ],
  },
  'echo-chamber': {
    tempo: 96,
    lead: {
      notes: ['Bb4', 'D5', 'F5', 'Bb5', 'F5', 'D5', 'C5', 'Bb4',
              'A4', 'Bb4', 'D5', 'Eb5', 'D5', 'C5', 'Bb4', 'Bb4'],
      durations: ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n',
                  '4n', '4n', '4n', '4n', '4n', '4n', '4n', '2n'],
    },
    chords: [
      ['Bb3', 'D4', 'F4'], ['Eb3', 'G3', 'Bb3'], ['F3', 'A3', 'C4'], ['Bb3', 'D4', 'F4'],
      ['G3', 'Bb3', 'D4'], ['Eb3', 'G3', 'Bb3'], ['F3', 'A3', 'C4'], ['Bb3', 'D4', 'F4'],
    ],
  },
  'spark-tower': {
    tempo: 110,
    lead: {
      notes: ['C5', 'E5', 'G5', 'C6', 'G5', 'E5', 'D5', 'C5',
              'B4', 'C5', 'E5', 'F5', 'E5', 'D5', 'C5', 'C5'],
      durations: ['8n', '8n', '8n', '8n', '8n', '8n', '8n', '8n',
                  '8n', '8n', '8n', '8n', '8n', '8n', '8n', '4n'],
    },
    chords: [
      ['C3', 'E3', 'G3'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C3', 'E3', 'G3'],
      ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C3', 'E3', 'G3'],
    ],
  },
  'kaleidoscope': {
    tempo: 108,
    lead: {
      notes: ['C5', 'E5', 'G5', 'D5', 'F#5', 'A5', 'E5', 'G#5',
              'B5', 'F5', 'A5', 'C6', 'G5', 'B5', 'D6', 'C5'],
      durations: ['8n', '8n', '8n', '8n', '8n', '8n', '8n', '8n',
                  '8n', '8n', '8n', '8n', '8n', '8n', '8n', '4n'],
    },
    chords: [
      ['C3', 'E3', 'G3'], ['D3', 'F#3', 'A3'], ['E3', 'G#3', 'B3'], ['F3', 'A3', 'C4'],
      ['G3', 'B3', 'D4'], ['A3', 'C#4', 'E4'], ['B3', 'D#4', 'F#4'], ['C3', 'E3', 'G3'],
    ],
  },
  'giants-garden': {
    tempo: 80,
    lead: {
      notes: ['Eb4', 'G4', 'Bb4', 'Eb5', 'Bb4', 'G4', 'F4', 'Eb4',
              'D4', 'Eb4', 'G4', 'Ab4', 'G4', 'F4', 'Eb4', 'Eb4'],
      durations: ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n',
                  '4n', '4n', '4n', '4n', '4n', '4n', '4n', '2n'],
    },
    chords: [
      ['Eb3', 'G3', 'Bb3'], ['Ab3', 'C4', 'Eb4'], ['Bb3', 'D4', 'F4'], ['Eb3', 'G3', 'Bb3'],
      ['C3', 'Eb3', 'G3'], ['Ab3', 'C4', 'Eb4'], ['Bb3', 'D4', 'F4'], ['Eb3', 'G3', 'Bb3'],
    ],
  },
  'shield-fortress': {
    tempo: 96,
    lead: {
      notes: ['F4', 'A4', 'C5', 'F5', 'C5', 'A4', 'G4', 'F4',
              'E4', 'F4', 'A4', 'Bb4', 'A4', 'G4', 'F4', 'F4'],
      durations: ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n',
                  '4n', '4n', '4n', '4n', '4n', '4n', '4n', '2n'],
    },
    chords: [
      ['F3', 'A3', 'C4'], ['Bb3', 'D4', 'F4'], ['C3', 'E3', 'G3'], ['F3', 'A3', 'C4'],
      ['D3', 'F3', 'A3'], ['Bb3', 'D4', 'F4'], ['C3', 'E3', 'G3'], ['F3', 'A3', 'C4'],
    ],
  },
  'brave-heart': {
    tempo: 72,
    lead: {
      notes: ['Ab4', 'C5', 'Eb5', 'Ab5', 'Eb5', 'C5', 'Bb4', 'Ab4',
              'G4', 'Ab4', 'C5', 'Db5', 'C5', 'Bb4', 'Ab4', 'Ab4'],
      durations: ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n',
                  '4n', '4n', '4n', '4n', '4n', '4n', '4n', '2n'],
    },
    chords: [
      ['Ab3', 'C4', 'Eb4'], ['Db3', 'F3', 'Ab3'], ['Eb3', 'G3', 'Bb3'], ['Ab3', 'C4', 'Eb4'],
      ['F3', 'Ab3', 'C4'], ['Db3', 'F3', 'Ab3'], ['Eb3', 'G3', 'Bb3'], ['Ab3', 'C4', 'Eb4'],
    ],
  },
  'thought-weaver': {
    tempo: 60,
    lead: {
      notes: ['Db4', 'F4', 'Ab4', 'Db5', 'Ab4', 'F4', 'Eb4', 'Db4',
              'C4', 'Db4', 'F4', 'Gb4', 'F4', 'Eb4', 'Db4', 'Db4'],
      durations: ['1n', '1n', '1n', '1n', '1n', '1n', '1n', '1n',
                  '1n', '1n', '1n', '1n', '1n', '1n', '1n', '1m'],
    },
    chords: [
      ['Db3', 'F3', 'Ab3'], ['Gb3', 'Bb3', 'Db4'], ['Ab3', 'C4', 'Eb4'], ['Db3', 'F3', 'Ab3'],
      ['Bb3', 'Db4', 'F4'], ['Gb3', 'Bb3', 'Db4'], ['Ab3', 'C4', 'Eb4'], ['Db3', 'F3', 'Ab3'],
    ],
  },
  'star-lungs': {
    tempo: 84,
    lead: {
      notes: ['C5', 'E5', 'G5', 'C6', 'G5', 'E5', 'D5', 'C5',
              'B4', 'C5', 'E5', 'F5', 'E5', 'D5', 'C5', 'C5'],
      durations: ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n',
                  '4n', '4n', '4n', '4n', '4n', '4n', '4n', '2n'],
    },
    chords: [
      ['C3', 'E3', 'G3'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C3', 'E3', 'G3'],
      ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C3', 'E3', 'G3'],
    ],
  },
};

/** Story reading background */
export const STORY_THEME: ThemeConfig = {
  tempo: 72,
  lead: {
    notes: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'F4', 'E4',
            'D4', 'F4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'],
    durations: ['2n', '2n', '2n', '2n', '2n', '2n', '2n', '2n',
                '2n', '2n', '2n', '2n', '2n', '2n', '2n', '1n'],
  },
  chords: [
    ['C3', 'E3', 'G3'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C3', 'E3', 'G3'],
    ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C3', 'E3', 'G3'],
  ],
};
