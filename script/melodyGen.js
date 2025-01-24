import { allChords, settings } from './constants.js';
// import { PROBABILITIES } from './state.js';
import {
  getRandomFromArray,
  getNoteChordRelation,
  getInOutScaleNotes,
  calculateBeatsAndMeasure,
  getClosestAvailableNote,
} from './utils/utils.js';

const PROBABILITIES = {
  OUT_OF_CHORD: 0.7,
  CLOSEST_NOTE: 0.8,
  REST: 0.15,
};

const determineNextNote = (params) => {
  const {
    beatWhereNoteWillLand,
    lastNote,
    lastNoteWasOutOfChord,
    currentChord,
    currentChordSymbol,
    lastChord,
    chordChanged,
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

  const currentChordisFromMinorKey =
    allChords.chordsFromMinorkey.includes(currentChordSymbol);

  // If last note was in, has xx% chance of choosing an out note
  const willChooseOutNote =
    !lastNoteWasOutOfChord &&
    !currentChordisFromMinorKey &&
    Math.random() < PROBABILITIES.OUT_OF_CHORD;

  let motherScaleToChooseFrom = settings.scale;
  if (currentChordisFromMinorKey) {
    /* notesToUse = notesToUse.map((note) => {
        return note.startsWith('G') ? note.replace('G', 'G#') : note;
      }); */

    motherScaleToChooseFrom = motherScaleToChooseFrom.map((note) => {
      return note.startsWith('G') ? note.replace('G', 'G#') : note;
    });
  }
  let notesToUse = getInOutScaleNotes(
    // settings.scale,
    motherScaleToChooseFrom,
    currentChord,
    !willChooseOutNote,
  );

  //Probably add lastChord to the scope so if last chord was from minor
  //  and this one isn't we should use close and resolve
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

  //If is out of chord or current chord is from minor, note is G and we are at the end of the measure so it doesn't carry over to the next diatonic chord
  const noteShouldHaveShortDuration =
    !finalNoteIsInTheCurrentChord ||
    (chosenNote &&
      allChords.chordsFromMinorkey.includes(currentChordSymbol) &&
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
