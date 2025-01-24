import { kickPatterns, snarePatterns, hiHatPatterns } from './constants.js';
import {
  getRandomNumBetween,
  getRandomFromArray,
  transposeNotes,
  appendTrackInfo,
  createDrumSequence,
  initializeSequence,
} from './utils/utils.js';
import { generateMelody } from './melody/melodyGen.js';
import { generateChords } from './chords/chordGen.js';
import { generateChordsArpeggio } from './chords/chordGenArpeggio.js';
import {
  allMelodySynths,
  allChordSynths,
  createChordSynth,
  createMelodySynth,
  createHiHat,
  createKick,
  createSnare,
  allKicks,
  allSnares,
  allHiHats,
} from './utils/synthSetup.js';

const sequences = {
  melody: null,
  chord: null,
  kick: null,
  snare: null,
  hiHat: null,
};

const TEMPO_RANGE = {
  MIN: 80,
  MAX: 140,
};

const arpeggiatedChords = false; //To come

let createdMelodySynth;
let createdChordSynth;
let createdKick;
let createdSnare;
let createdHiHat;
let reverb;

const cleanUpAudio = () => {
  Object.values(sequences).forEach((sequence) => {
    if (sequence) {
      sequence.dispose();
    }
  });
  Object.keys(sequences).forEach((key) => (sequences[key] = null));
  createdMelodySynth && createdMelodySynth.dispose();
  createdChordSynth && createdChordSynth.dispose();
  createdKick && createdKick.dispose();
  createdSnare && createdSnare.dispose();
  createdHiHat && createdHiHat.dispose();
  reverb && reverb.dispose();
  createdMelodySynth = null;
  createdChordSynth = null;
  createdKick = null;
  createdSnare = null;
  createdHiHat = null;
  reverb = null;
};

export const generateNewTrack = (transport) => {
  //Clean-up
  cleanUpAudio();

  // Define time signature and key
  const timeSignature = getRandomFromArray([3, 4, 4]); //Twice as likely to be 4/4
  const randomPitchShift = getRandomNumBetween(0, 11); // All keys - C to B
  // const randomPitchShift = 0;

  // Set BPM, timesignature and key
  const key = transposeNotes('C4', randomPitchShift).slice(0, -1);
  transport.bpm.value =
    Math.floor(Math.random() * (TEMPO_RANGE.MAX - TEMPO_RANGE.MIN)) +
    TEMPO_RANGE.MIN;
  transport.timeSignature = timeSignature;

  // -------- Generate musical content --------
  const { chords, chordTime } = generateChords(key); //We need block chord for the melody, so even with arpeggio this has to stay (?)
  const { chordsArpeggio } = generateChordsArpeggio(key);
  const { melody, melodyTime } = generateMelody(
    chords,
    chordTime,
    timeSignature,
  );

  // -------- Create melody sequence --------
  const transposedMelody = transposeNotes(melody, randomPitchShift);
  const randomMelodySynthName = getRandomFromArray(
    Object.keys(allMelodySynths),
  );
  createdMelodySynth = createMelodySynth(randomMelodySynthName);
  sequences.melody = new Tone.Part((time, event) => {
    const velocity = Math.random() * 0.5 + 0.5;
    createdMelodySynth.triggerAttackRelease(
      event.note,
      event.duration,
      time,
      velocity,
    );
  }, transposedMelody).start(0);

  // -------- Create chord sequence --------
  const transposedChords = transposeNotes(
    arpeggiatedChords ? chordsArpeggio : chords,
    randomPitchShift,
  );
  const randomChordSynthName = getRandomFromArray(Object.keys(allChordSynths));
  createdChordSynth = createChordSynth(randomChordSynthName);
  sequences.chord = new Tone.Part((time, event) => {
    createdChordSynth.triggerAttackRelease(
      event.notes,
      event.duration,
      time,
      0.3,
    );
  }, transposedChords).start(0);

  // -------- Create drum sequences --------
  //Kick
  const randomKickName = getRandomFromArray(Object.keys(allKicks));
  createdKick = createKick(randomKickName);

  const randomKickPatternName = getRandomFromArray(
    Object.keys(kickPatterns[timeSignature]),
  );
  const selectedKickPattern =
    kickPatterns[timeSignature][randomKickPatternName];

  sequences.kick = createDrumSequence(
    'kick',
    createdKick,
    selectedKickPattern,
    '4n',
  );

  //Snare
  const randomSnareName = getRandomFromArray(Object.keys(allSnares));
  createdSnare = createSnare(randomSnareName);

  const randomSnarePatternName = getRandomFromArray(
    Object.keys(snarePatterns[timeSignature]),
  );
  const selectedSnarePattern =
    snarePatterns[timeSignature][randomSnarePatternName];

  sequences.snare = createDrumSequence(
    'snare',
    createdSnare,
    selectedSnarePattern,
    '8n',
  );

  //HiHat
  const randomHiHatName = getRandomFromArray(Object.keys(allHiHats));
  createdHiHat = createHiHat(randomHiHatName);

  const randomHiHatPatternName = getRandomFromArray(
    Object.keys(hiHatPatterns[timeSignature]),
  );
  const selectedHiHatPattern =
    hiHatPatterns[timeSignature][randomHiHatPatternName];

  sequences.hiHat = createDrumSequence(
    'hihat',
    createdHiHat,
    selectedHiHatPattern,
    '32n',
  );

  // Set reverb
  reverb = new Tone.Reverb(5).toDestination();
  createdMelodySynth.connect(reverb);
  createdChordSynth.connect(reverb);

  // Calculate and set loop lengths - Do I need this?
  const adjustedMelodyTime =
    melodyTime + (chordTime - (melodyTime % chordTime));

  // Initialize all sequences
  initializeSequence(sequences.melody, adjustedMelodyTime);
  initializeSequence(sequences.chord, chordTime);
  Object.entries(sequences)
    .filter(([name]) => ['kick', 'snare', 'hiHat'].includes(name))
    .forEach(([, sequence]) => initializeSequence(sequence, '1m'));

  appendTrackInfo({
    key,
    tempo: Math.floor(transport.bpm.value),
    melodySynth: randomMelodySynthName,
    chords,
    kick: randomKickName,
    snare: randomSnareName,
    hiHat: randomHiHatName,
    kickPattern: randomKickPatternName,
    snarePattern: randomSnarePatternName,
    hiHatPattern: randomHiHatPatternName,
    timeSignature,
  });
};
