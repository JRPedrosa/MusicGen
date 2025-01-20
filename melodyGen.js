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

const determineNextNote = (params) => {
  const { lastNote, lastNoteWasOutOfChord, currentChord, key } = params;

  // If last note was in, has 50% chance of choosing an out note
  if (!lastNoteWasOutOfChord && Math.random() < PROBABILITIES.OUT_OF_CHORD) {
    const outOfChordNotes = getFilteredScaleNotes(
      settings.allScales[key],
      currentChord,
      false,
    );
    return {
      note: getClosestNoteInChord(lastNote, outOfChordNotes, key),
      isOutOfChord: true,
    };
  }

  // Else choose note within chord
  const inChordNotes = getFilteredScaleNotes(
    settings.allScales[key],
    currentChord,
    true,
  );
  const useClosestNote =
    lastNoteWasOutOfChord || Math.random() < PROBABILITIES.CLOSEST_NOTE; // If last note was out will always resolve to the closest, else has 20% chance to jump around
  const note = useClosestNote
    ? getClosestNoteInChord(lastNote, inChordNotes, key)
    : inChordNotes[Math.floor(Math.random() * inChordNotes.length)];

  return {
    note,
    isOutOfChord: false,
  };
};

const getClosestNoteInChord = (lastNote, scaleToUse, key) => {
  if (Math.random() < PROBABILITIES.REST) {
    return undefined;
  }

  if (!lastNote) {
    return scaleToUse[2]; // Default to third note in scale
  }

  const scale = lastNote === undefined ? settings.allScales[key] : scaleToUse;
  const currentIndex = scale.findIndex((note) => note === lastNote);

  if (currentIndex === -1) {
    return handleOutOfScaleNote(lastNote, key);
  }

  return getAdjacentNote(currentIndex, scale);
};

const handleOutOfScaleNote = (lastNote, key) => {
  const scale = settings.allScales[key];
  const index = scale.findIndex((note) => note === lastNote);
  return getAdjacentNote(index, scale);
};

const getAdjacentNote = (index, scale) => {
  const upOrDown = Math.random() < 0.5 ? -1 : 1;
  if (index === 0) return scale[1];
  if (index === scale.length - 1) return scale[scale.length - 2];
  return scale[index + upOrDown];
};

export const generateMelody = (chords, chordTime, key) => {
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
      key,
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
