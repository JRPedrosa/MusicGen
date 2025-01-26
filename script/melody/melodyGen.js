import { allChords } from "../constants.js";
import {
  getNoteChordRelation,
  calculateBeatsAndMeasure,
  // getRandomDecimalBetween,
} from "../utils/utils.js";
import { determineNextNote } from "./nextNote.js";

export const generateMelody = (chords, chordTime, timeSignature) => {
  const quarterNoteInSeconds = chords[1].time / 4;
  const maxMelodyTime = chordTime * 2 - quarterNoteInSeconds; //Ensures the melody doesn't surpass a double loop of the chords
  const melody = [];
  let beats = [];
  let melodyTime = 0;
  let lastNoteWasOutOfChord = true;
  let lastNote;
  let lastChordSymbol;

  /* const PROBABILITIES = {
    OUT_OF_CHORD: getRandomDecimalBetween(0.4, 0.8),
    CLOSEST_NOTE: getRandomDecimalBetween(0.5, 0.9),
    REST: getRandomDecimalBetween(0.05, 0.25),
  }; */

  const PROBABILITIES = {
    OUT_OF_CHORD: 0.5, //0.7 or 0.5BETTER
    CLOSEST_NOTE: 0.8, //0.8
    REST: 0.15, // 0.15
  };

  while (melodyTime < maxMelodyTime) {
    if (melodyTime > maxMelodyTime * 2) {
      alert(
        "Error: Melody time exceeded the allowed limit. Please refresh the app.",
      );
      throw new Error(
        "Melody time exceeded the allowed limit. Stopping execution.",
      );
    }
    /* const currentChordIndex =
      Math.floor(melodyTime / Tone.Time('1n').toSeconds()) % chords.length; */
    const beatWhereNoteWillLand = beats[beats.length - 1] || { measure: 1 }; //For the first pass
    const currentChordIndex =
      (beatWhereNoteWillLand?.measure - 1) % chords.length;
    const currentChord = chords[currentChordIndex].notes;
    const currentChordSymbol = chords[currentChordIndex].name;
    const chordChanged = currentChordSymbol !== lastChordSymbol;
    const currentChordisBorrowed =
      allChords.borrowedChords.includes(currentChordSymbol);
    const lastChordWasBorrowed =
      allChords.borrowedChords.includes(lastChordSymbol);
    const isLastQuarterNote =
      beatWhereNoteWillLand.measure === 8 &&
      beatWhereNoteWillLand.beat >= timeSignature - 1;

    console.warn(currentChordSymbol);
    console.log(beatWhereNoteWillLand);
    const { note, isOutOfChord, duration } = determineNextNote({
      beatWhereNoteWillLand,
      lastNote,
      lastNoteWasOutOfChord,
      currentChord,
      currentChordSymbol,
      currentChordisBorrowed,
      lastChordWasBorrowed,
      chordChanged,
      isLastQuarterNote,
      PROBABILITIES,
    });

    const noteChordRelation = getNoteChordRelation(currentChord, note);
    console.log(
      `${note} - ${isOutOfChord ? "OUT - " : "IN - "}`,
      noteChordRelation,
      " - ",
      duration,
    );

    melody.push({
      time: melodyTime,
      note,
      duration,
      isOutOfChord,
      noteChordRelation,
      currentChordSymbol,
      measure: beatWhereNoteWillLand.measure,
    });

    beats = calculateBeatsAndMeasure(melody, timeSignature);
    melodyTime += Tone.Time(duration).toSeconds();
    lastNote = note;
    lastNoteWasOutOfChord = isOutOfChord;
    lastChordSymbol = currentChordSymbol;
  }

  logInfo({ melody, chords, PROBABILITIES, melodyTime, chordTime });
  return { melody, melodyTime };
};

const logInfo = ({ melody, chords, PROBABILITIES, melodyTime, chordTime }) => {
  console.log("chords", chords, "melody", melody);
  console.log(
    Object.fromEntries(
      Object.entries(PROBABILITIES).map(([key, value]) => [
        key,
        (value * 100).toFixed(1) + "%",
      ]),
    ),
  );
  const totalNotes = melody.length;

  // Calculate the percentage of isOutOfChord notes
  const outOfChordCount = melody.filter((item) => item.isOutOfChord).length;
  const outOfChordPercentage = (outOfChordCount / totalNotes) * 100;

  // Calculate the percentage of undefined notes
  const undefinedNoteCount = melody.filter(
    (item) => item.note === undefined,
  ).length;
  const undefinedNotePercentage = (undefinedNoteCount / totalNotes) * 100;

  // Log the results
  console.log(
    `Percentage of out of chord notes: ${outOfChordPercentage.toFixed(2)}%`,
  );
  console.log(`Percentage of pauses: ${undefinedNotePercentage.toFixed(2)}%`);

  let measures = {};

  // Process the input data
  melody.forEach((item) => {
    // If this measure doesn't exist in the measures object, create it
    if (!measures[item.measure]) {
      measures[item.measure] = {
        chordSymbol: item.currentChordSymbol,
        relations: [],
      };
    }
    // Add the noteChordRelation to the relations array
    // if (item.noteChordRelation !== 'PAUSE') {
    measures[item.measure].relations.push(item.noteChordRelation);
    // }
  });

  // Now log the results
  for (let measure in measures) {
    console.log(
      `Bar ${measure}:`,
      `Chord: ${measures[measure].chordSymbol} - `,
      `${measures[measure].relations.join(", ")}`,
    );
  }
  console.log("chordTime", chordTime, "melodyTime", melodyTime);
};
