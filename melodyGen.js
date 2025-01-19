import { settings } from './constants.js';

export const generateMelody = (chords, chordTime) => {
  let melodyTime = 0;
  const melody = [];
  let lastNoteWasOutOfChord = false;
  let lastNote;

  while (melodyTime < chordTime * 2 - 3) {
    // Find the current chord based on the time
    const currentChordIndex =
      Math.floor(melodyTime / Tone.Time('1n').toSeconds()) % chords.length;
    const currentChord = chords[currentChordIndex].notes;

    // Filter the scale to only include notes that share the same first letter as the current chord's notes
    const filteredScaleNotesInChord = settings.scale.filter((note) => {
      const noteRoot = note.charAt(0); // Get the first letter of the note (C, D, E, etc.)
      return currentChord.some((chordNote) => chordNote.charAt(0) === noteRoot); // Check if the note's root matches the chord's root
    });

    let note;
    let isOutOfChord = false;
    if (!lastNoteWasOutOfChord && Math.random() < 0.5) {
      const filteredScaleNotesOutChord = settings.scale.filter((note) => {
        const noteRoot = note.charAt(0); // Get the first letter of the note (C, D, E, etc.)
        return currentChord.every(
          (chordNote) => chordNote.charAt(0) !== noteRoot,
        ); // Check if the note's root matches the chord's root
      });

      note = getClosestNoteInChord(lastNote, filteredScaleNotesOutChord);

      isOutOfChord = true;
    } else {
      // If the note is in the chord or we are continuing the chord, pick a note from the chord
      //   note = currentChord[Math.floor(Math.random() * currentChord.length)];

      if (lastNoteWasOutOfChord || Math.random() < 0.8) {
        note = getClosestNoteInChord(lastNote, filteredScaleNotesInChord);
      } else {
        note =
          filteredScaleNotesInChord[
            Math.floor(Math.random() * filteredScaleNotesInChord.length)
          ];
      }

      isOutOfChord = false;
      lastNoteWasOutOfChord = false;
    }

    const duration = isOutOfChord
      ? '8n'
      : settings.durations[
          Math.floor(Math.random() * settings.durations.length)
        ];

    melody.push({
      time: melodyTime,
      note: note,
      duration: duration,
    });

    if (isOutOfChord) {
      lastNoteWasOutOfChord = true;
    }

    // Advance time by the actual duration of the note
    melodyTime += Tone.Time(duration).toSeconds();
    lastNote = note;
  }

  return { melody, melodyTime };
};

const getClosestNoteInChord = (lastNote, scaleToUse) => {
  let indexOfNote = scaleToUse.findIndex((ele) => ele === lastNote);
  const upOrDown = Math.random() < 0.5 ? -1 : 1;
  let finalIndex;
  if (lastNote === undefined) {
    finalIndex = 2;
    indexOfNote = 2;
  }

  if (Math.random() < 0.1) {
    return undefined;
  }

  if (indexOfNote === -1 && lastNote !== undefined) {
    let newIndex = settings.scale.findIndex((ele) => ele === lastNote);
    if (newIndex === 0) {
      finalIndex = 1;
    } else if (newIndex === settings.scale.length - 1) {
      finalIndex = settings.scale.length - 2;
    } else {
      finalIndex = newIndex + upOrDown;
    }
    return settings.scale[finalIndex];
  } else {
    if (indexOfNote === 0) {
      finalIndex = 1;
    } else if (indexOfNote === scaleToUse.length - 1) {
      finalIndex = scaleToUse.length - 2;
    } else {
      finalIndex = indexOfNote + upOrDown;
    }
    return scaleToUse[finalIndex];
  }
};
