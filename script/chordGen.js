import { commonProgressions, allChords } from './constants.js';

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
    console.log('||| notes', allChords[chordSymbol]);

    chords.push({
      time: chordTime,
      notes: allChords[chordSymbol],
      duration: '1n',
      name: chordSymbol,
    });

    console.log('||| chords', chords);

    chordTime += Tone.Time('1n').toSeconds();
    console.log('||| chordTime', chordTime);
  }

  return { chords, chordTime };
};
