export const chordsInC = {
  C: {
    I: ['C2', 'E2', 'C3', 'E3', 'G3', 'B3'], // C major
    ii: ['D2', 'A2', 'D3', 'F3', 'A3', 'C4'], // D minor
    iii: ['E2', 'B2', 'E3', 'G3', 'B3', 'D4'], // E minor
    IV: ['F2', 'C3', 'F3', 'A3', 'C4', 'E4'], // F major
    V: ['G2', 'D3', 'G3', 'B3', 'D4'], // G major
    vi: ['A2', 'E3', 'A3', 'G4', 'C4'], // A minor
    /* vii: ['B3', 'D4', 'F4'], // B diminished */
  },
};

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
};

export const commonProgressions = [
  ['I', 'vi', 'IV', 'V'],
  ['ii', 'V', 'I', 'vi'],
  ['vi', 'V', 'IV', 'V'],
  ['vi', 'IV', 'V', 'iii'],
  ['I', 'IV', 'V', 'IV'],
];

export const kickPattern = [
  { time: '0:0', note: 'C1' },
  { time: '0:2', note: 'C1' },
  { time: '1:0', note: 'C1' },
  { time: '1:2', note: 'C1' },
];

export const snarePattern = [
  { time: '0:1', note: 'D1' },
  { time: '0:3', note: 'D1' },
  { time: '1:1', note: 'D1' },
  { time: '1:3', note: 'D1' },
];

export const hiHatPattern = [
  { time: '0:0:2', note: 'G2' },
  { time: '0:1:2', note: 'G2' },
  { time: '0:2:2', note: 'G2' },
  { time: '0:3:2', note: 'G2' },
  { time: '1:0:2', note: 'G2' },
  { time: '1:1:2', note: 'G2' },
  { time: '1:2:2', note: 'G2' },
  { time: '1:3:2', note: 'G2' },
];
