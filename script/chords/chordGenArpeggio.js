import { commonProgressions, allChords } from '../constants.js';

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

    chordsArpeggio.push({
      time: chordTimeArpeggio, // Offset after the first two notes
      notes: notes.slice(0, 2), // Remaining notes as a block
      duration: '1n',
      name: chordSymbol,
    });

    const eigthNoteTime = Tone.Time('8n').toSeconds();
    // let currentMeasureTime = 0;
    notes.slice(-3).forEach((note, i) => {
      chordsArpeggio.push({
        time: chordTimeArpeggio + eigthNoteTime * i,
        notes: [note],
        duration: `${4 - i * 0.5}n`,
        name: chordSymbol,
      });
      // currentMeasureTime += Tone.Time('8n').toSeconds();
    });

    chordTimeArpeggio += Tone.Time('1n').toSeconds();
  }

  return { chordsArpeggio, chordTimeArpeggio };
};
