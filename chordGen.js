import { commonProgressions, allChords } from './constants.js';

/* export const generateChords = (key) => {
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
      notes: allChords[key][chordSymbol],
      duration: '1n',
      name: chordSymbol,
    });

    chordTime += Tone.Time('1n').toSeconds();
  }

  return { chords, chordTime };
}; */

export const generateChords = (key, synth) => {
  const selectedProgression = [
    ...commonProgressions[
      Math.floor(Math.random() * commonProgressions.length)
    ],
  ];

  const chords = [];
  let chordTime = 0;

  // Pre-calculate time increment for better performance
  const measureLength = Tone.Time('1n').toSeconds();

  // Voice limiting function
  const limitVoices = (notes) => {
    // Ensure we don't exceed maxPolyphony
    if (notes.length > 5) {
      // Prioritize root, third, and fifth
      return notes.slice(0, 5);
    }
    return notes;
  };

  // Schedule chords with proper cleanup
  for (let i = 0; i < selectedProgression.length; i++) {
    const chordSymbol = selectedProgression[i];
    const notes = limitVoices(allChords[key][chordSymbol]);

    chords.push({
      time: chordTime,
      notes,
      duration: measureLength,
      name: chordSymbol,
      velocity: 0.8, // Add velocity for more natural sound
    });

    chordTime += measureLength;
  }

  return { chords, chordTime };
};
