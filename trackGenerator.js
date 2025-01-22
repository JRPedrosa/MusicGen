import {
  kickPatterns,
  snarePatterns,
  hiHatPatterns,
  allChords,
} from './constants.js';
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
} from './synthSetup.js';
import { generateMelody } from './melodyGen.js';
import { generateChords } from './chordGen.js';

const sequences = {
  melody: null,
  chord: null,
  kick: null,
  snare: null,
  hiHat: null,
};

const TEMPO_RANGE = {
  MIN: 70,
  MAX: 140,
};

let createdMelodySynth;
let createdChordSynth;
let createdKick;
let createdSnare;
let createdHiHat;
let reverb;

const getRandomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

export const getRandomKey = () => {
  const keys = Object.keys(allChords);
  return getRandomFromArray(keys);
};

const createDrumSequence = (type, instrument, pattern, noteLength) => {
  if (type === 'snare') {
    return new Tone.Part((time) => {
      instrument.triggerAttackRelease(noteLength, time);
    }, pattern).start(0);
  }

  return new Tone.Part((time, event) => {
    instrument.triggerAttackRelease(event?.note, noteLength, time);
  }, pattern).start(0);
};

const initializeSequence = (sequence, loopEnd) => {
  if (sequence) {
    sequence.loop = true;
    sequence.loopEnd = loopEnd;
  }
};

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

  // Set BPM
  transport.bpm.value =
    Math.floor(Math.random() * (TEMPO_RANGE.MAX - TEMPO_RANGE.MIN)) +
    TEMPO_RANGE.MIN;

  // Generate musical content
  const key = getRandomKey();
  const { chords, chordTime } = generateChords(key);
  const { melody, melodyTime } = generateMelody(chords, chordTime, key);

  // Create melody sequence
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
  }, melody).start(0);

  // Create chord sequence
  const randomChordSynthName = getRandomFromArray(Object.keys(allChordSynths));
  createdChordSynth = createChordSynth(randomChordSynthName);
  sequences.chord = new Tone.Part((time, event) => {
    createdChordSynth.triggerAttackRelease(
      event.notes,
      event.duration,
      time,
      0.3,
    );
  }, chords).start(0);

  // --- Create drum sequences ---
  //Kick
  const randomKickName = getRandomFromArray(Object.keys(allKicks));
  createdKick = createKick(randomKickName);

  const randomKickPatternName = getRandomFromArray(Object.keys(kickPatterns));
  const selectedKickPattern = kickPatterns[randomKickPatternName];
  const selectedKickPatternName = randomKickPatternName;

  sequences.kick = createDrumSequence(
    'kick',
    createdKick,
    selectedKickPattern,
    '8n',
  );

  //Snare
  const randomSnareName = getRandomFromArray(Object.keys(allSnares));
  createdSnare = createSnare(randomSnareName);

  const randomSnarePatternName = getRandomFromArray(Object.keys(snarePatterns));
  const selectedSnarePattern = snarePatterns[randomSnarePatternName];
  const selectedSnarePatternName = randomSnarePatternName;

  sequences.snare = createDrumSequence(
    'snare',
    createdSnare,
    selectedSnarePattern,
    '8n',
  );

  //HiHat
  const randomHiHatName = getRandomFromArray(Object.keys(allHiHats));
  createdHiHat = createHiHat(randomHiHatName);

  const randomHiHatPatternName = getRandomFromArray(Object.keys(hiHatPatterns));
  const selectedHiHatPattern = hiHatPatterns[randomHiHatPatternName];
  const selectedHiHatPatternName = randomHiHatPatternName;

  sequences.hiHat = createDrumSequence(
    'hihat',
    createdHiHat,
    selectedHiHatPattern,
    '32n',
  );

  // Set reverb
  reverb = new Tone.Reverb(2.5).toDestination();
  createdMelodySynth.connect(reverb);
  createdChordSynth.connect(reverb);

  // Calculate and set loop lengths
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
    chordSynth: randomChordSynthName,
    chords,
    kick: randomKickName,
    snare: randomSnareName,
    hiHat: randomHiHatName,
    kickPattern: selectedKickPatternName,
    snarePattern: selectedSnarePatternName,
    hiHatPattern: selectedHiHatPatternName,
  });
};

const appendTrackInfo = ({
  key,
  tempo,
  melodySynth,
  chordSynth,
  chords,
  kick,
  snare,
  hiHat,
  kickPattern,
  snarePattern,
  hiHatPattern,
}) => {
  document.getElementById('key').textContent = `key: ${key}`;
  document.getElementById('tempo').textContent = `BPM: ${tempo}`;
  document.getElementById(
    'melodySynth',
  ).textContent = `melodySynth: ${melodySynth}`;
  document.getElementById(
    'chordSynth',
  ).textContent = `chordSynth: ${chordSynth}`;
  document.getElementById('chords').textContent = `chords: ${chords.map(
    (c) => c.name,
  )}`;
  document.getElementById('kick').textContent = `kick: ${kick}`;
  document.getElementById('snare').textContent = `snare: ${snare}`;
  document.getElementById('hiHat').textContent = `hiHat: ${hiHat}`;
  document.getElementById(
    'kickPattern',
  ).textContent = `kickPattern: ${kickPattern}`;
  document.getElementById(
    'snarePattern',
  ).textContent = `snarePattern: ${snarePattern}`;
  document.getElementById(
    'hiHatPattern',
  ).textContent = `hiHatPattern: ${hiHatPattern}`;
};
