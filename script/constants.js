export const allChords = {
  // 7ths - OUT_OF_CHORD to 0.5
  /* I: ['C2', 'G2', 'C3', 'E3', 'B3'],
  ii: ['D2', 'A2', 'D3', 'F3', 'C4'],
  iii: ['E2', 'B2', 'E3', 'G3', 'D4'],
  IV: ['F2', 'C3', 'F3', 'A3', 'E4'],
  V: ['G2', 'D3', 'G3', 'B3', 'D4'],
  vi: ['A2', 'E3', 'A3', 'C4', 'G4'], */

  // Fuller triads - OUT_OF_CHORD to 0.8/0.7
  /* I: ['C2', 'G2', 'C3', 'E3', 'G3'],
  ii: ['D2', 'A2', 'D3', 'F3', 'A3'],
  iii: ['E2', 'B2', 'E3', 'G3', 'B3'],
  IV: ['F2', 'C3', 'F3', 'A3', 'C4'],
  V: ['G2', 'D3', 'G3', 'B3', 'D4'],
  vi: ['A2', 'E3', 'A3', 'C4', 'E4'], */

  I: ['C2', 'G2', 'C3', 'E3', 'G3'],
  ii: ['D2', 'A2', 'D3', 'F3', 'A3'],
  iii: ['E2', 'B2', 'E3', 'G3', 'B3'],
  IV: ['F2', 'C3', 'F3', 'A3', 'C4'],
  V: ['G2', 'D3', 'G3', 'B3', 'D4'],
  vi: ['A2', 'E3', 'A3', 'C4', 'E4'],

  //Chords borrowed from minor key - always put in the array below so melodyGen.js can adapt
  III: ['E2', 'B2', 'E3', 'G#3', 'B3'],
  // III7: ['G#2', 'B2', 'E3', 'G#3', 'D4'],

  // vii7: ['B1', 'F2', 'A2', 'D3', 'F3'], //one octave down
  // viidim: ['G#2', 'F3', 'B3', 'D4', 'F4'],
  chordsFromMinorkey: ['III', 'III7', 'vii7', 'viidim'],

  // Close triads - OUT_OF_CHORD to 0.8
  /* I: ['C3', 'E3', 'G3'],
  ii: ['D3', 'F3', 'A3'],
  iii: ['E3', 'G3', 'B3'],
  IV: ['F3', 'A3', 'C4'],
  V: ['G3', 'B3', 'D4'],
  vi: ['A3', 'C4', 'E4'], */
};

export const commonProgressions = [
  ['I', 'V', 'vi', 'IV'],
  ['I', 'vi', 'IV', 'V'],
  ['vi', 'V', 'IV', 'V'],
  ['vi', 'IV', 'V', 'iii'],
  ['vi', 'ii', 'V', 'iii'],
  ['ii', 'V', 'I', 'vi'],
  ['ii', 'IV', 'I', 'V'],
  ['iii', 'IV', 'vi', 'V'],
  ['IV', 'V', 'vi', 'iii'],
  ['V', 'IV', 'I', 'IV'],

  //Progressions with chords from the minor key
  ['vi', 'V', 'IV', 'III'],
  ['vi', 'IV', 'I', 'III'],
  ['I', 'III', 'IV', 'V'],

  ['vi', 'III', 'vi', 'III'],
];

export const settings = {
  scale: [
    'C4',
    'D4',
    'E4',
    'F4',
    'G4',
    'A4',
    'B4',
    'C5',
    'D5',
    'E5',
    'F5',
    'G5',
  ],
  durations: ['4n', '2n', '4n'],
  // durations: ['4n', '2n', '4n', '8n', '8n', '8n', '8n', '8n'],
};

export const kickPatterns = {
  4: {
    1: [
      { time: '0:0', note: 'C1' },
      { time: '0:2', note: 'C1' },
    ],
    2: [
      { time: '0:0', note: 'C1' },
      { time: '0:2', note: 'C1' },
      { time: '0:3:2', note: 'C1' },
    ],
    3: [
      { time: '0:0', note: 'C1' },
      { time: '0:2', note: 'C1' },
      { time: '0:2:2', note: 'C1' },
    ],
    4: [
      { time: '0:0', note: 'C1' },
      { time: '0:1', note: 'C1' },
      { time: '0:2', note: 'C1' },
      { time: '0:3', note: 'C1' },
    ],
  },
  3: {
    1: [
      { time: '0:0', note: 'C1' },
      { time: '0:2:2', note: 'C1' },
    ],
    2: [
      { time: '0:0', note: 'C1' },
      { time: '0:1:2', note: 'C1' },
      { time: '0:2:2', note: 'C1' },
    ],
  },
};

export const snarePatterns = {
  4: {
    1: [
      { time: '0:1', note: 'D1' },
      { time: '0:3', note: 'D1' },
    ],
    2: [
      { time: '0:1', note: 'D1' },
      { time: '0:3', note: 'D1' },
      { time: '0:3:1', note: 'D1' },
    ],
  },
  3: {
    1: [{ time: '0:1', note: 'D1' }],
    2: [{ time: '0:2', note: 'D1' }],
  },
};

export const hiHatPatterns = {
  4: {
    1: [
      { time: '0:0:2', note: 'G2' },
      { time: '0:1:2', note: 'G2' },
      { time: '0:2:2', note: 'G2' },
      { time: '0:3:2', note: 'G2' },
    ],
    2: [
      { time: '0:0', note: 'G2' },
      { time: '0:0:2', note: 'G2' },
      { time: '0:1:0', note: 'G2' },
      { time: '0:1:2', note: 'G2' },
      { time: '0:2:0', note: 'G2' },
      { time: '0:2:2', note: 'G2' },
      { time: '0:3:0', note: 'G2' },
      { time: '0:3:2', note: 'G2' },
    ],
    3: [
      { time: '0:0', note: 'G2' },
      { time: '0:0:2', note: 'G2' },
      { time: '0:1:0', note: 'G2' },
      { time: '0:1:2', note: 'G2' },
      { time: '0:1:3', note: 'G2' },
      { time: '0:2:0', note: 'G2' },
      { time: '0:2:2', note: 'G2' },
      { time: '0:3:0', note: 'G2' },
      { time: '0:3:2', note: 'G2' },
    ],
    4: [
      { time: '0:0:2', note: 'G2' },
      { time: '0:1:2', note: 'G2' },
      { time: '0:1:3', note: 'G2' },
      { time: '0:2:2', note: 'G2' },
      { time: '0:3:2', note: 'G2' },
    ],
  },
  3: {
    1: [
      { time: '0:0', note: 'G2' },
      { time: '0:0:2', note: 'G2' },
      { time: '0:1', note: 'G2' },
      { time: '0:1:2', note: 'G2' },
      { time: '0:2', note: 'G2' },
      { time: '0:2:2', note: 'G2' },
    ],
  },
};
