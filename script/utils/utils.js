import { elements } from '../constants.js';

export const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

export const getRandomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

export const getRandomNumBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const transposeNotes = (input, semitoneShift) => {
  if (typeof input === 'string') {
    // For the key
    return Tone.Frequency(input).transpose(semitoneShift).toNote();
  }

  return input.map((item) => {
    if (item.note) {
      // For melody
      return {
        ...item,
        note: Tone.Frequency(item.note).transpose(semitoneShift).toNote(),
      };
    } else if (item.notes) {
      // For chords
      return {
        ...item,
        notes: item.notes.map((note) =>
          Tone.Frequency(note).transpose(semitoneShift).toNote(),
        ),
      };
    }
    return { ...item };
  });
};

const isNoteInChord = (note, chord) => {
  return chord.some((chordNote) => chordNote.charAt(0) === note.charAt(0));
};

export const getInOutScaleNotes = (scale, chord, chordTones = true) => {
  return scale.filter((note) => chordTones === isNoteInChord(note, chord));
};

export const getClosestAvailableNote = (
  targetNote,
  notesToUse,
  motherScaleToChooseFrom,
) => {
  // Find the index of the target note in array2
  let targetIndex = motherScaleToChooseFrom.indexOf(targetNote);

  if (targetIndex === -1) {
    //Edge case where lastNote was a G# and the chord changed so it isn't in the diatonic scale
    targetIndex = motherScaleToChooseFrom.indexOf(targetNote.replace('#', ''));
    if (!targetIndex) {
      //Stupid fallback
      console.error(' |||| UNKNOWN BUG ||||  DO NOT IGNORE |||| see below');
      console.log(
        'targetNote',
        targetNote,
        'notesToUse',
        notesToUse,
        'motherScaleToChooseFrom',
        motherScaleToChooseFrom,
      );

      return getRandomFromArray(notesToUse);
    }
  }

  // Helper function to find the closest note in a given direction
  const findInDirection = (startIndex, direction) => {
    let index = startIndex + direction; // Move up (1) or down (-1)
    while (index >= 0 && index < motherScaleToChooseFrom.length) {
      if (notesToUse.includes(motherScaleToChooseFrom[index])) {
        return motherScaleToChooseFrom[index];
      }
      index += direction;
    }
    return null; // No valid note found in this direction
  };

  // 50% chance to search up or down
  const searchUp = Math.random() < 0.5;

  // Search in the chosen direction, fallback to the opposite direction if not found
  const closestNote =
    findInDirection(targetIndex, searchUp ? 1 : -1) || // First attempt
    findInDirection(targetIndex, searchUp ? -1 : 1); // Opposite direction

  return closestNote || 'No valid note found'; // Fallback message
};

export const getNoteChordRelation = (chord, singleNote) => {
  if (!singleNote) return 'PAUSE';
  const extractNote = (note) => note.replace(/\d/g, '').charAt(0); //Removes numbers, then chooses only the letter

  const baseNote = extractNote(chord[0]);
  const noteOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const startIndex = noteOrder.indexOf(baseNote);

  const circularArray = [];
  for (let i = 0; i < noteOrder.length; i++) {
    circularArray.push(noteOrder[(startIndex + i) % noteOrder.length]);
  }

  const targetNote = extractNote(singleNote);
  const index = circularArray.indexOf(targetNote);

  return index !== -1 ? index + 1 : -1;
};

export const calculateBeatsAndMeasure = (notes, timeSignature) => {
  const beats = [];
  const beatDurationMap = {
    '4n': 1,
    '2n': 2,
    '8n': 0.5,
  };

  let totalBeats = 0;

  notes.forEach((note) => {
    const beatDuration = beatDurationMap[note.duration] || 0;
    totalBeats += beatDuration;

    const currentMeasure = Math.floor(totalBeats / timeSignature) + 1;
    const currentBeatInMeasure = totalBeats % timeSignature;

    beats.push({
      beat: currentBeatInMeasure,
      measure: currentMeasure,
    });
  });

  return beats;
};

export const appendTrackInfo = ({
  key,
  tempo,
  melodySynth,
  chords,
  timeSignature,
}) => {
  elements.tempo.textContent = `BPM: ${tempo}`;
  elements.timeSignature.textContent = `Time: ${timeSignature}/4`;
  elements.key.textContent = `Key: ${key}`;
  elements.melodySynth.textContent = `Synth: ${melodySynth}`;
  elements.chords.textContent = `Chords: ${chords.map((c) => c.name)}`;
};

export const calculateRecordingTime = (bpm, numberOfMeasures) => {
  //NOT USED FOR NOW
  const beatsPerMeasure = 4; // Assuming 4/4 time signature

  // Time per beat in seconds
  const timePerBeat = 60 / bpm;

  // Time per measure in seconds
  const timePerMeasure = timePerBeat * beatsPerMeasure;

  // Total time for the given number of measures
  const totalTimeInSeconds = timePerMeasure * numberOfMeasures;

  return totalTimeInSeconds;
};

export const createDrumSequence = (type, instrument, pattern, noteLength) => {
  if (type === 'snare') {
    return new Tone.Part((time) => {
      instrument.triggerAttackRelease(noteLength, time);
    }, pattern).start(0);
  }

  return new Tone.Part((time, event) => {
    instrument.triggerAttackRelease(event?.note, noteLength, time);
  }, pattern).start(0);
};

export const initializeSequence = (sequence, loopEnd) => {
  if (sequence) {
    sequence.loop = true;
    sequence.loopEnd = loopEnd;
  }
};
