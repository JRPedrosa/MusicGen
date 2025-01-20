export const allChords = {
  C: {
    I: ['C2', 'E2', 'C3', 'G3', 'B3'],
    ii: ['D2', 'A2', 'D3', 'F3', 'C4'],
    iii: ['E2', 'B2', 'E3', 'G3', 'D4'],
    IV: ['F2', 'C3', 'F3', 'A3', 'E4'],
    V: ['G2', 'D3', 'G3', 'B3', 'D4'],
    vi: ['A2', 'E3', 'A3', 'G4', 'C4'],
  },
  G: {
    I: ['G2', 'D3', 'G3', 'B3', 'F#4'],
    ii: ['A2', 'E3', 'A3', 'G4', 'C4'],
    iii: ['B2', 'F#2', 'B3', 'D3', 'A4'],
    IV: ['C2', 'E2', 'C3', 'G3', 'B3'],
    V: ['D2', 'A2', 'D3', 'F#3', 'A4'],
    vi: ['E2', 'B2', 'E3', 'G3', 'D4'],
  },
  D: {
    I: ['D2', 'A2', 'D3', 'F#3', 'C#4'],
    ii: ['E2', 'B2', 'E3', 'G3', 'D4'],
    iii: ['F#2', 'C#3', 'F#3', 'A3', 'E4'],
    IV: ['G2', 'D3', 'G3', 'B3', 'F#4'],
    V: ['A2', 'E2', 'A3', 'C#3', 'E4'],
    vi: ['B2', 'F#3', 'B3', 'D3', 'A4'],
  },
  A: {
    I: ['A2', 'E2', 'A3', 'C#3', 'G#4'],
    ii: ['B2', 'F#2', 'B3', 'D3', 'A4'],
    iii: ['C#2', 'G#2', 'C#3', 'E3', 'B4'],
    IV: ['D2', 'A2', 'D3', 'F#3', 'C#4'],
    V: ['E2', 'B2', 'E3', 'G#3', 'B4'],
    vi: ['F#2', 'C#2', 'F#3', 'A3', 'E4'],
  },
};

export const settings = {
  allScales: {
    C: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5'], // C Major
    G: [
      'G4',
      'A4',
      'B4',
      'C5',
      'D5',
      'E5',
      'F#5',
      'G5',
      'A5',
      'B5',
      'C6',
      'D6',
    ], // G Major
    D: [
      'D4',
      'E4',
      'F#4',
      'G4',
      'A4',
      'B4',
      'C#5',
      'D5',
      'E5',
      'F#5',
      'G5',
      'A5',
    ], // D Major
    A: [
      'A4',
      'B4',
      'C#5',
      'D5',
      'E5',
      'F#5',
      'G#5',
      'A5',
      'B5',
      'C#6',
      'D6',
      'E6',
    ], // A Major
  },
  durations: ['4n', '2n', '4n'],
};

export const commonProgressions = [
  ['I', 'vi', 'IV', 'V'],
  ['ii', 'V', 'I', 'vi'],
  ['vi', 'V', 'IV', 'V'],
  ['vi', 'IV', 'V', 'iii'],
  ['I', 'V', 'vi', 'IV'],
  ['vi', 'ii', 'V', 'iii'],
];

export const kickPattern = [
  { time: '0:0', note: 'C1' },
  { time: '0:2', note: 'C1' },
];

export const snarePattern = [
  { time: '0:1', note: 'D1' },
  { time: '0:3', note: 'D1' },
];

export const hiHatPattern = [
  { time: '0:0:2', note: 'G2' },
  { time: '0:1:2', note: 'G2' },
  { time: '0:2:2', note: 'G2' },
  { time: '0:3:2', note: 'G2' },
];
