import {
  settings,
  kickPattern1,
  snarePattern1,
  snarePattern2,
  hiHatPattern1,
  hiHatPattern2,
  allChords,
} from './constants.js';
import {
  allMelodySynths,
  allChordSynths,
  chordSynthMobile,
  kick,
  kick1,
  snare,
  snare1,
  hiHat,
  hiHat1,
} from './synthSetup.js';
import { generateMelody } from './melodyGen.js';
import { generateChords } from './chordGen.js';
import { isMobileDevice } from './utils.js';

const sequences = {
  melody: null,
  chord: null,
  kick: null,
  snare: null,
  hiHat: null,
};

let reverb;

let melodySynth = null;
let chordSynth = null;
let key = null;

const TEMPO_RANGE = {
  MIN: 80,
  MAX: 140,
};
const VOLUMES = {
  chord: -30,
  kick: -15,
  snare: {
    primary: -32,
    secondary: -30,
  },
  hiHat: -45,
};

const getRandomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

const getRandomKey = () => {
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
  melodySynth = null;
  reverb = null;
};

export const generateNewTrack = () => {
  disposeSequences();

  // Initialize track parameters
  Tone.Transport.bpm.value =
    Math.floor(Math.random() * (TEMPO_RANGE.MAX - TEMPO_RANGE.MIN)) +
    TEMPO_RANGE.MIN;
  key = getRandomKey();
  melodySynth = getRandomFromArray(allMelodySynths).sound;

  // Set volumes
  allChordSynths.forEach((c) => (c.sound.volume.value = VOLUMES.chord));
  [(kick, kick1)].forEach((k) => (k.volume.value = VOLUMES.kick));
  snare.volume.value = VOLUMES.snare.primary;
  snare1.volume.value = VOLUMES.snare.secondary;
  [hiHat, hiHat1].forEach((h) => (h.volume.value = VOLUMES.hiHat));
  Tone.Destination.volume.value = 10;

  // Generate musical content
  const { chords, chordTime } = generateChords(key);
  const { melody, melodyTime } = generateMelody(chords, chordTime, key);

  // Create melody and chord sequences
  sequences.melody = new Tone.Part((time, event) => {
    const velocity = Math.random() * 0.5 + 0.5;
    melodySynth.triggerAttackRelease(
      event.note,
      event.duration,
      time,
      velocity,
    );
  }, melody).start(0);

  chordSynth = getRandomFromArray(allChordSynths).sound;
  if (isMobileDevice()) {
    chordSynthMobile.volume.value = -30;
    chordSynth = chordSynthMobile;
  }

  sequences.chord = new Tone.Part((time, event) => {
    chordSynth.triggerAttackRelease(event.notes, event.duration, time, 0.3);
  }, chords).start(0);

  // Create drum sequences
  const randKick = Math.random() > 0.5;
  sequences.kick = createDrumSequence(
    'kick',
    randKick ? kick : kick1,
    kickPattern1,
    '8n',
  );

  sequences.snare = createDrumSequence(
    'snare',
    Math.random() > 0.5 ? snare : snare1,
    Math.random() > 0.4 ? snarePattern1 : snarePattern2,
    '8n',
  );

  sequences.hiHat = createDrumSequence(
    'hihat',
    Math.random() > 0.5 ? hiHat : hiHat1,
    Math.random() > 0.5 ? hiHatPattern1 : hiHatPattern2,
    '32n',
  );

  // Set reverb
  reverb = new Tone.Reverb(2.5).toDestination();
  if (!isMobileDevice()) {
    chordSynth.connect(reverb);
    melodySynth.connect(reverb);
  }

  // Calculate and set loop lengths
  const adjustedMelodyTime =
    melodyTime + (chordTime - (melodyTime % chordTime));

  // Initialize all sequences
  initializeSequence(sequences.melody, adjustedMelodyTime);
  initializeSequence(sequences.chord, chordTime);
  Object.entries(sequences)
    .filter(([name]) => ['kick', 'snare', 'hiHat'].includes(name))
    .forEach(([, sequence]) => initializeSequence(sequence, '1m'));

  console.log({
    key,
    tempo: Math.floor(Tone.Transport.bpm.value),
    melodySynth: allMelodySynths.find((s) => s.sound === melodySynth)?.name,
    chords: chords.map((c) => c.name),
  });

  Object.values(sequences).forEach((sequence) => {
    if (sequence && isMobileDevice()) {
      sequence.humanize = false; // Disable humanization for better performance
    }
  });

  document.getElementById('0').textContent = `key: ${key}`;
  document.getElementById('1').textContent = `tempo: ${Math.floor(
    Tone.Transport.bpm.value,
  )}`;
  document.getElementById('2').textContent = `melodySynth: ${
    allMelodySynths.find((s) => s.sound === melodySynth)?.name
  }`;
  document.getElementById('3').textContent = `chords: ${chords.map(
    (c) => c.name,
  )}`;
  document.getElementById('4').textContent = `chordSynth: ${
    allChordSynths.find((s) => s.sound === chordSynth)?.name
  }`;

  return {
    key,
    tempo: Math.floor(Tone.Transport.bpm.value),
  };
};
