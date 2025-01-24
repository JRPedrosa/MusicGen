import { allChords, settings } from './constants.js';
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
  const { lastNote, lastNoteWasOutOfChord, currentChord, currentChordSymbol } =
    params;

  // const currentBeatInMeasure = beats[beats.length - 1]?.beat;
  /* const isStrongBeat =
    currentBeatInMeasure === 0 &&
    currentBeatInMeasure === 1 &&
    currentBeatInMeasure === 2 &&
    currentBeatInMeasure === 3; */

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

  console.log('## currentChord', currentChord);
  console.log('## notesToUse', notesToUse);

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

  console.log(
    '## current note is out of chord: ',
    !finalNoteIsInTheCurrentChord,
  );
  return {
    note: chosenNote,
    isOutOfChord: !finalNoteIsInTheCurrentChord,
  };
};

export const generateMelody = (chords, chordTime, timeSignature) => {
  const melody = [];
  let melodyTime = 0;
  let lastNoteWasOutOfChord = true;
  let lastNote;
  let beats = [];
  console.log(PROBABILITIES);
  const maxMelodyTime = chordTime * 2 - 3; //Ensures the melody doesn't surpass a double loop of the chords

  while (melodyTime < maxMelodyTime || lastNoteWasOutOfChord) {
    const currentChordIndex =
      Math.floor(melodyTime / Tone.Time('1n').toSeconds()) % chords.length;
    const currentChord = chords[currentChordIndex].notes;
    const currentChordSymbol = chords[currentChordIndex].name;
    console.log('/////////////////////////////////////////////////////////');
    //Here the beat is where the next note will land
    console.log('Beat for note to choose', beats[beats.length - 1]);
    const { note, isOutOfChord } = determineNextNote({
      beats,
      lastNote,
      lastNoteWasOutOfChord,
      currentChord,
      currentChordSymbol,
    });

    console.log('##note', note);
    //If is out of chord or current chord is from minor, note is G and we are at the end of the measure
    const noteShouldHaveShortDuration =
      isOutOfChord ||
      (note &&
        allChords.chordsFromMinorkey.includes(currentChordSymbol) &&
        note.charAt(0) === 'G' &&
        beats[beats.length - 1].beat >= 2);

    // const duration = isOutOfChord
    const duration = noteShouldHaveShortDuration
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

    beats = calculateBeatsAndMeasure(melody, timeSignature);

    melodyTime += Tone.Time(duration).toSeconds();
    lastNote = note;
    lastNoteWasOutOfChord = isOutOfChord;
  }

  console.log('!!! melodyTime ', melodyTime, 'chordTime', chordTime * 2);
  return { melody, melodyTime };
};
