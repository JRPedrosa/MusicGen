import { commonProgressions, allChords } from '../constants.js';

export const generateChords = () => {
  const selectedProgression = [
    ...commonProgressions[
      Math.floor(Math.random() * commonProgressions.length)
    ],
  ];

  const chords = [];
  let chordTime = 0;

  for (let i = 0; i < selectedProgression.length; i++) {
    const chordSymbol = selectedProgression[i];

    chords.push({
      time: chordTime,
      notes: allChords[chordSymbol],
      duration: '1n',
      name: chordSymbol,
    });

    chordTime += Tone.Time('1n').toSeconds();
  }

  return { chords, chordTime };
};
