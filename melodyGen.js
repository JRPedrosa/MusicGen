import { settings } from './constants.js';

const PROBABILITIES = {
  OUT_OF_CHORD: 0.5,
  CLOSEST_NOTE: 0.8,
  REST: 0.1,
};

const isNoteInChord = (note, chord) => {
  return chord.some((chordNote) => chordNote.charAt(0) === note.charAt(0));
};

const getFilteredScaleNotes = (scale, chord, includeChordNotes = true) => {
  return scale.filter(
    (note) => includeChordNotes === isNoteInChord(note, chord),
  );
};

const getNoteChordRelation = (chord, singleNote) => {
  if (!singleNote) return 'pause';
  // Helper function to extract only the letters (note names) from the notes
  const extractNote = (note) => note.replace(/\d/g, '');

  // Extract the first note from the chord and construct the circular array
  const baseNote = extractNote(chord[0]);
  const noteOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const startIndex = noteOrder.indexOf(baseNote);

  // Create the circular array starting from the base note
  const circularArray = [];
  for (let i = 0; i < noteOrder.length; i++) {
    circularArray.push(noteOrder[(startIndex + i) % noteOrder.length]);
  }

  // Extract the letter from the singleNote and find its index in the circular array
  const targetNote = extractNote(singleNote);
  const index = circularArray.indexOf(targetNote);

  // Return the index + 1 (or -1 if the note is not found)
  return index !== -1 ? index + 1 : -1;
};

const determineNextNote = (params) => {
  const { lastNote, lastNoteWasOutOfChord, currentChord } = params;
  console.log('## ------- currentChord -------', currentChord);

  // If last note was in, has 50% chance of choosing an out note
  if (!lastNoteWasOutOfChord && Math.random() < PROBABILITIES.OUT_OF_CHORD) {
    console.log('## Choosing an OUT note');
    const outOfChordNotes = getFilteredScaleNotes(
      settings.scale,
      currentChord,
      false,
    );

    const chosenNote = getClosestNoteInChord(lastNote, outOfChordNotes);

    const noteChordRelation = getNoteChordRelation(currentChord, chosenNote);

    console.log('## note chosen: ', chosenNote);
    console.log('### noteChordRelation', noteChordRelation);

    return {
      note: chosenNote,
      isOutOfChord: true,
    };
  }

  console.log('## Choosing an IN note');

  // Else choose note within chord
  const inChordNotes = getFilteredScaleNotes(
    settings.scale,
    currentChord,
    true,
  );
  const useClosestNote =
    lastNoteWasOutOfChord || Math.random() < PROBABILITIES.CLOSEST_NOTE; // If last note was out will always resolve to the closest, else has 20% chance to jump around

  const note = useClosestNote
    ? getClosestNoteInChord(lastNote, inChordNotes)
    : inChordNotes[Math.floor(Math.random() * inChordNotes.length)];

  const noteChordRelation = getNoteChordRelation(currentChord, note);

  console.log('## note chosen: ', note);
  console.log('## noteChordRelation: ', noteChordRelation);

  return {
    note,
    isOutOfChord: false,
  };
};

const getClosestNoteInChord = (lastNote, notesToUse) => {
  console.log('## notesToUse', notesToUse);

  if (Math.random() < PROBABILITIES.REST) {
    return undefined;
  }

  if (!lastNote) {
    return notesToUse[2]; // Default to third note in scale
  }

  const scale = lastNote === undefined ? settings.scale : notesToUse;
  const currentIndex = scale.findIndex((note) => note === lastNote);

  if (currentIndex === -1) {
    return handleOutOfScaleNote(lastNote);
  }

  const chosenNote = getAdjacentNote(currentIndex, scale);

  return chosenNote;
};

const handleOutOfScaleNote = (lastNote) => {
  const scale = settings.scale;
  const index = scale.findIndex((note) => note === lastNote);
  return getAdjacentNote(index, scale);
};

const getAdjacentNote = (index, scale) => {
  const upOrDown = Math.random() < 0.5 ? -1 : 1;
  if (index === 0) return scale[1];
  if (index === scale.length - 1) return scale[scale.length - 2];
  return scale[index + upOrDown];
};

export const generateMelody = (chords, chordTime) => {
  const melody = [];
  let melodyTime = 0;
  let lastNoteWasOutOfChord = false;
  let lastNote;

  const maxMelodyTime = chordTime * 2 - 3; //Ensures the melody doesn't surpass a double loop of the chords

  while (melodyTime < maxMelodyTime) {
    const currentChordIndex =
      Math.floor(melodyTime / Tone.Time('1n').toSeconds()) % chords.length;
    const currentChord = chords[currentChordIndex].notes;

    const { note, isOutOfChord } = determineNextNote({
      lastNote,
      lastNoteWasOutOfChord,
      currentChord,
    });

    const duration = isOutOfChord
      ? '8n'
      : settings.durations[
          Math.floor(Math.random() * settings.durations.length)
        ];

    melody.push({
      time: melodyTime,
      note,
      duration,
    });

    melodyTime += Tone.Time(duration).toSeconds();
    lastNote = note;
    lastNoteWasOutOfChord = isOutOfChord;
  }

  return { melody, melodyTime };
};
