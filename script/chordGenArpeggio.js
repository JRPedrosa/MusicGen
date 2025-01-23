import { commonProgressions, allChords } from './constants.js';

export const generateChordsArpeggio = () => {
  const selectedProgression = [
    ...commonProgressions[
      Math.floor(Math.random() * commonProgressions.length)
    ],
  ];

  const chordsArpeggio = [];
  let chordTimeArpeggio = 0;

  for (let i = 0; i < selectedProgression.length; i++) {
    const chordSymbol = selectedProgression[i];
    const notes = allChords[chordSymbol];

    // Add individual note events
    notes.forEach((note, idx) => {
      chordsArpeggio.push({
        time: chordTimeArpeggio + idx * 0.2, // Add slight delay between notes for arpeggiation
        note: note,
        duration: '1n',
        name: chordSymbol,
      });
    });

    chordTimeArpeggio += Tone.Time('1n').toSeconds();
  }

  return { chordsArpeggio, chordTimeArpeggio };
};
