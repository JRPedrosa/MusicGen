import { commonProgressions, chordsInC } from './constants.js';

export const generateChords = () => {
  const selectedProgression = [
    ...commonProgressions[
      Math.floor(Math.random() * commonProgressions.length)
    ],
  ];
  console.log('Selected progression:', selectedProgression);

  const chords = [];
  let chordTime = 0;

  for (let i = 0; i < selectedProgression.length; i++) {
    const chordSymbol = selectedProgression[i];

    console.log(`Adding chord ${chordSymbol} at time ${chordTime}`);

    chords.push({
      time: chordTime,
      notes: chordsInC.C[chordSymbol],
      duration: '1n',
      name: chordSymbol,
    });

    chordTime += Tone.Time('1n').toSeconds();
  }

  return { chords, chordTime };
};
