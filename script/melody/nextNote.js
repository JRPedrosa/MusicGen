import { allChords, settings } from '../constants.js';
import {
  getRandomFromArray,
  getInOutScaleNotes,
  getClosestAvailableNote,
} from '../utils/utils.js';

export const determineNextNote = (params) => {
  const {
    beatWhereNoteWillLand,
    lastNote,
    lastNoteWasOutOfChord,
    currentChord,
    currentChordSymbol,
    PROBABILITIES,
    /* lastChord,
    chordChanged, */
  } = params;

  // const currentBeatInMeasure = beats[beats.length - 1]?.beat;
  /* const isStrongBeat =
    currentBeatInMeasure === 0 &&
    currentBeatInMeasure === 1 &&
    currentBeatInMeasure === 2 &&
    currentBeatInMeasure === 3; */

  let chosenNote;

  if (Math.random() < PROBABILITIES.REST && !lastNoteWasOutOfChord) {
    return {
      note: undefined,
      isOutOfChord: false, //Considering rests as IN chord. Only happens after an IN note
      duration:
        settings.durations[
          Math.floor(Math.random() * settings.durations.length)
        ],
    };
  }

  const currentChordisBorrowed =
    allChords.borrowedChords.includes(currentChordSymbol);

  // If last note was in, has xx% chance of choosing an out note
  const willChooseOutNote =
    !lastNoteWasOutOfChord &&
    !currentChordisBorrowed &&
    Math.random() < PROBABILITIES.OUT_OF_CHORD;

  let motherScaleToChooseFrom = settings.scale;
  if (currentChordisBorrowed) {
    // Revise when adding more borrowed chords
    motherScaleToChooseFrom = motherScaleToChooseFrom.map((note) => {
      return note.startsWith('G') ? note.replace('G', 'G#') : note;
    });
  }
  let notesToUse = getInOutScaleNotes(
    motherScaleToChooseFrom,
    currentChord,
    !willChooseOutNote,
  );

  // Probably add lastChord to the scope so if last chord borrowed
  // and this one isn't, we should use close and resolve
  const useClosestNote =
    lastNoteWasOutOfChord || Math.random() < PROBABILITIES.CLOSEST_NOTE;

  if (lastNote && useClosestNote) {
    chosenNote = getClosestAvailableNote(
      lastNote,
      notesToUse,
      motherScaleToChooseFrom,
    );
  } else {
    // Jump around
    chosenNote = getRandomFromArray(notesToUse);
  }

  const finalNoteIsInTheCurrentChord = currentChord.filter(
    (note) => note.charAt(0) === chosenNote.charAt(0),
  ).length;

  // If is out of chord or current chord is borrowed, note is G (in the future any note not part of the motherScale)
  // and we are at the end of the measure so it doesn't carry over to the next diatonic chord
  const noteShouldHaveShortDuration =
    !finalNoteIsInTheCurrentChord ||
    (chosenNote &&
      allChords.borrowedChords.includes(currentChordSymbol) &&
      chosenNote.charAt(0) === 'G' &&
      beatWhereNoteWillLand.beat >= 2);

  // const duration = isOutOfChord
  const duration = noteShouldHaveShortDuration
    ? '8n'
    : settings.durations[Math.floor(Math.random() * settings.durations.length)];

  return {
    note: chosenNote,
    isOutOfChord: !finalNoteIsInTheCurrentChord,
    duration,
  };
};
