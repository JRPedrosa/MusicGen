import {
  getNoteChordRelation,
  calculateBeatsAndMeasure,
} from '../utils/utils.js';
import { determineNextNote } from './nextNote.js';

export const generateMelody = (chords, chordTime, timeSignature) => {
  const maxMelodyTime = chordTime * 2 - 3; //Ensures the melody doesn't surpass a double loop of the chords
  const melody = [];
  let beats = [];
  let melodyTime = 0;
  let lastNoteWasOutOfChord = true;
  let lastNote;
  let lastChord;
  let lastChordSymbol;

  while (melodyTime < maxMelodyTime || lastNoteWasOutOfChord) {
    /* const currentChordIndex =
      Math.floor(melodyTime / Tone.Time('1n').toSeconds()) % chords.length; */
    const beatWhereNoteWillLand = beats[beats.length - 1] || { measure: 1 }; //For the first pass
    const currentChordIndex =
      (beatWhereNoteWillLand?.measure - 1) % chords.length;
    const currentChord = chords[currentChordIndex].notes;
    const currentChordSymbol = chords[currentChordIndex].name;
    const chordChanged = currentChordSymbol !== lastChordSymbol;

    console.warn(currentChordSymbol);
    console.log(beatWhereNoteWillLand);
    const { note, isOutOfChord, duration } = determineNextNote({
      beatWhereNoteWillLand,
      lastNote,
      lastNoteWasOutOfChord,
      currentChord,
      currentChordSymbol,
      lastChord,
      chordChanged,
    });

    const noteChordRelation = getNoteChordRelation(currentChord, note);
    console.log(
      `${note} - ${isOutOfChord ? 'OUT - ' : 'IN - '}`,
      noteChordRelation,
      ' - ',
      duration,
    );

    melody.push({
      time: melodyTime,
      note,
      duration,
    });

    beats = calculateBeatsAndMeasure(melody, timeSignature);
    melodyTime += Tone.Time(duration).toSeconds();
    lastNote = note;
    lastNoteWasOutOfChord = isOutOfChord;
    lastChord = currentChord;
    lastChordSymbol = currentChordSymbol;
  }

  console.log('chords', chords, 'melody', melody);

  return { melody, melodyTime };
};
