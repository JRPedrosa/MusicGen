import { settings } from './constants.js';
// import { PROBABILITIES } from './state.js';
import {
  getRandomFromArray,
  getNoteChordRelation,
  getInOutScaleNotes,
  calculateBeatsAndMeasure,
  getClosestAvailableNote,
} from './utils.js';

const PROBABILITIES = {
  OUT_OF_CHORD: 0.7,
  CLOSEST_NOTE: 0.8,
  REST: 0.15,
};

const determineNextNote = (params) => {
  const { beats, lastNote, lastNoteWasOutOfChord, currentChord } = params;
  console.log('/////////////////////////////////////////////////////////');
  const currentBeatInMeasure = beats[beats.length - 1]?.beat;
  const isStrongBeat =
    currentBeatInMeasure === 0 &&
    currentBeatInMeasure === 1 &&
    currentBeatInMeasure === 2 &&
    currentBeatInMeasure === 3;

  let chosenNote;
  // If the chord changed and lastNote was OUT but now is IN. Let the chord change resolve it
  /* const lastNoteIsInTheCurrentChord = currentChord.filter(
    (note) => note.charAt(0) === lastNote?.charAt(0),
  ).length;
  if (lastNote && lastNoteWasOutOfChord && lastNoteIsInTheCurrentChord) {
    console.log('## keeping Old note');
    return {
      note: lastNote,
      isOutOfChord: false,
    };
  } */

  if (Math.random() < PROBABILITIES.REST && !lastNoteWasOutOfChord) {
    return {
      note: undefined,
      isOutOfChord: false, //Considering rests as IN chord. Only happens after an IN note
    };
  }

  // If last note was in, has xx% chance of choosing an out note
  const willChooseOutNote =
    !lastNoteWasOutOfChord &&
    // !isStrongBeat &&
    Math.random() < PROBABILITIES.OUT_OF_CHORD;

  const notesToUse = getInOutScaleNotes(
    settings.scale,
    currentChord,
    !willChooseOutNote,
  );

  const allThirdsAvailable = notesToUse.filter(
    (note) => note.charAt(0) === currentChord[1].charAt(0),
  );

  const notesToUseWithoutRoot = notesToUse.filter(
    (note) => note.charAt(0) !== currentChord[0].charAt(0),
  );
  console.log('## currentChord', currentChord);
  const useClosestNote =
    lastNoteWasOutOfChord || Math.random() < PROBABILITIES.CLOSEST_NOTE;

  /* if (lastNote && lastNoteWasOutOfChord && allThirdsAvailable.length) {
    chosenNote = getClosestAvailableNote(
      lastNote,
      allThirdsAvailable,
      settings.scale,
    );
  } else  */
  if (lastNote && useClosestNote) {
    chosenNote = getClosestAvailableNote(lastNote, notesToUse, settings.scale);
  } else {
    // Jump around
    chosenNote = getRandomFromArray(notesToUse);
  }

  const finalNoteIsInTheCurrentChord = currentChord.filter(
    (note) => note.charAt(0) === chosenNote.charAt(0),
  ).length;

  return {
    note: chosenNote,
    isOutOfChord: !finalNoteIsInTheCurrentChord,
  };
};

export const generateMelody = (chords, chordTime) => {
  const melody = [];
  let melodyTime = 0;
  let lastNoteWasOutOfChord = true;
  let lastNote;
  let beats = [];
  console.log(PROBABILITIES);
  const maxMelodyTime = chordTime * 2 - 3; //Ensures the melody doesn't surpass a double loop of the chords

  while (melodyTime < maxMelodyTime) {
    const currentChordIndex =
      Math.floor(melodyTime / Tone.Time('1n').toSeconds()) % chords.length;
    const currentChord = chords[currentChordIndex].notes;

    const { note, isOutOfChord } = determineNextNote({
      beats,
      lastNote,
      lastNoteWasOutOfChord,
      currentChord,
    });

    // console.log('##### currentMelody:', melody);

    const duration = isOutOfChord
      ? '8n'
      : settings.durations[
          Math.floor(Math.random() * settings.durations.length)
        ];

    const noteChordRelation = getNoteChordRelation(currentChord, note);
    console.log(
      '#### lastNote:',
      lastNote,
      'chosen note:',
      note,
      'relation:',
      noteChordRelation,
      'duration',
      duration,
    );

    melody.push({
      time: melodyTime,
      note,
      duration,
    });

    beats = calculateBeatsAndMeasure(melody);

    melodyTime += Tone.Time(duration).toSeconds();
    lastNote = note;
    lastNoteWasOutOfChord = isOutOfChord;
  }

  return { melody, melodyTime };
};
