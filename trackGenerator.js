import {
  kickPattern1,
  kickPattern2,
  snarePattern1,
  snarePattern2,
  hiHatPattern1,
  hiHatPattern2,
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
  MIN: 80,
  MAX: 140,
};

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

const disposeSequences = () => {
  Object.values(sequences).forEach((sequence) => {
    if (sequence) {
      sequence.dispose();
    }
  });
  Object.keys(sequences).forEach((key) => (sequences[key] = null));
};

export const generateNewTrack = (transport) => {
  //Clean-up
  disposeSequences();

  // Set BPM
  transport.bpm.value =
    Math.floor(Math.random() * (TEMPO_RANGE.MAX - TEMPO_RANGE.MIN)) +
    TEMPO_RANGE.MIN;

  // Generate musical content
  const key = getRandomKey();
  const { chords, chordTime } = generateChords(key);
  const { melody, melodyTime } = generateMelody(chords, chordTime, key);

  // Create melody sequence
  const randomMelodySynthName = getRandomFromArray(allMelodySynths);
  const createdMelodySynth = createMelodySynth(randomMelodySynthName);
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
  const randomChordSynthName = getRandomFromArray(allChordSynths);
  const createdChordSynth = createChordSynth(randomChordSynthName);
  sequences.chord = new Tone.Part((time, event) => {
    createdChordSynth.triggerAttackRelease(
      event.notes,
      event.duration,
      time,
      0.3,
    );
  }, chords).start(0);

  // Create drum sequences
  //Kick
  const randomKickName = getRandomFromArray(allKicks);
  const createdKick = createKick(randomKickName);
  sequences.kick = createDrumSequence(
    'kick',
    createdKick,
    Math.random() > 0.4 ? kickPattern1 : kickPattern2,
    '8n',
  );

  //Snare
  const randomSnareName = getRandomFromArray(allSnares);
  const createdSnare = createSnare(randomSnareName);
  sequences.snare = createDrumSequence(
    'snare',
    createdSnare,
    Math.random() > 0.4 ? snarePattern1 : snarePattern2,
    '8n',
  );

  //HiHat
  const randomHiHatName = getRandomFromArray(allHiHats);
  const createdHiHat = createHiHat(randomHiHatName);
  sequences.hiHat = createDrumSequence(
    'hihat',
    createdHiHat,
    Math.random() > 0.5 ? hiHatPattern1 : hiHatPattern2,
    '32n',
  );

  // Set reverb
  const reverb = new Tone.Reverb(2.5).toDestination();
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
  });

  return {
    key,
    tempo: Math.floor(transport.bpm.value),
    melodySynth: randomMelodySynthName,
    chordSynth: randomChordSynthName,
    kick: randomKickName,
    snare: randomSnareName,
    hiHat: randomHiHatName,
  };
};

const appendTrackInfo = ({ key, tempo, melodySynth, chordSynth, chords }) => {
  document.getElementById('0').textContent = `key: ${key}`;
  document.getElementById('1').textContent = `tempo: ${tempo}`;
  document.getElementById('2').textContent = `melodySynth: ${melodySynth}`;
  document.getElementById('3').textContent = `chordSynth: ${chordSynth}`;
  document.getElementById('4').textContent = `chords: ${chords.map(
    (c) => c.name,
  )}`;
};
