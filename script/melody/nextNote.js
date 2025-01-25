import { settings } from '../constants.js';
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
    currentChordisBorrowed,
    /* lastChordWasBorrowed,
    chordChanged, */
    PROBABILITIES,
    isLastQuarterNote,
  } = params;
  let diatonicScale = settings.scale;
  let possibleDurations = settings.durations;

  // const currentBeatInMeasure = beats[beats.length - 1]?.beat;
  /* const isStrongBeat =
    currentBeatInMeasure === 0 &&
    currentBeatInMeasure === 1 &&
    currentBeatInMeasure === 2 &&
    currentBeatInMeasure === 3; */

  let chosenNote;

  if (
    Math.random() < PROBABILITIES.REST &&
    !lastNoteWasOutOfChord
    /* &&
    !chordChanged */
  ) {
    return {
      note: undefined,
      isOutOfChord: false, //Considering rests as IN chord. Only happens after an IN note
      duration:
        possibleDurations[
          Math.floor(Math.random() * settings.durations.length)
        ],
    };
  }

  // If last note was in, has xx% chance of choosing an out note
  const willChooseOutNote =
    !lastNoteWasOutOfChord &&
    // !currentChordisBorrowed &&
    // !chordChanged &&
    Math.random() < PROBABILITIES.OUT_OF_CHORD;

  if (currentChordisBorrowed) {
    // Revise when adding more borrowed chords - Is this correct?? should we change the mother scale to input into getInOutScaleNotes()
    diatonicScale = diatonicScale.map((note) => {
      return note.startsWith('G') ? note.replace('G', 'G#') : note;
    });
  }
  let notesToUse = getInOutScaleNotes(
    diatonicScale,
    currentChord,
    !willChooseOutNote,
  );

  // Probably add lastChord to the scope so if last chord borrowed
  // and this one isn't, we should use close and resolve
  const useClosestNote =
    lastNoteWasOutOfChord ||
    // lastChordWasBorrowed ||
    Math.random() < PROBABILITIES.CLOSEST_NOTE;

  if (lastNote && useClosestNote) {
    chosenNote = getClosestAvailableNote(lastNote, notesToUse, diatonicScale);
  } else {
    // Jump around
    chosenNote = getRandomFromArray(notesToUse);
  }

  const chosenNoteIsOutOfChord = !currentChord.filter(
    (note) => note.charAt(0) === chosenNote.charAt(0),
  ).length;

  // If is out of chord or current chord is borrowed, note is G (in the future any note not part of the motherScale)
  // and we are at the end of the measure so it doesn't carry over to the next diatonic chord
  const noteShouldHaveShortDuration =
    chosenNoteIsOutOfChord ||
    isLastQuarterNote ||
    (chosenNote &&
      currentChordisBorrowed &&
      chosenNote.charAt(0) === 'G' &&
      beatWhereNoteWillLand.beat >= 2);

  // const duration = isOutOfChord
  const duration = noteShouldHaveShortDuration
    ? '8n'
    : possibleDurations[Math.floor(Math.random() * settings.durations.length)];

  return {
    note: chosenNote,
    isOutOfChord: chosenNoteIsOutOfChord,
    duration,
  };
};
