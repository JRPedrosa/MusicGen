import {
  settings,
  kickPattern,
  snarePattern,
  hiHatPattern,
  allChords,
} from './constants.js';
import {
  allMelodySynths,
  chordSynth,
  kick,
  snare,
  hiHat,
} from './synthSetup.js';
import { generateMelody } from './melodyGen.js';
import { generateChords } from './chordGen.js';
import { isMobileDevice } from './utils.js';

let melodySynth;
let melodySequence;
let chordSequence;
let drumSequence;
let kickSequence;
let snareSequence;
let hiHatSequence;
let key;

export const generateNewTrack = () => {
  disposeAll();
  if (melodySequence) melodySequence.dispose();
  if (chordSequence) chordSequence.dispose();
  if (drumSequence) drumSequence.dispose();
  if (kickSequence) kickSequence.dispose();
  if (snareSequence) snareSequence.dispose();
  if (hiHatSequence) hiHatSequence.dispose();

  //Set Tempo
  Tone.Transport.bpm.value = Math.floor(Math.random() * 60) + 80;

  //Choose key
  const randIndex = Math.floor(Math.random() * Object.keys(allChords).length);
  key = Object.keys(allChords)[randIndex];

  //Choose a melody synth
  const randIndex1 = Math.floor(Math.random() * allMelodySynths.length);
  melodySynth = allMelodySynths[randIndex1].sound;

  // Set Volumes
  chordSynth.volume.value = -12;
  kick.volume.value = -5;
  snare.volume.value = -20;
  hiHat.volume.value = -30;

  // Add effects
  const reverbDiv = document.querySelector('.reverb');
  if (!isMobileDevice()) {
    reverbDiv.textContent = `with reverb`;

    const reverb = new Tone.Reverb(2.5).toDestination();
    melodySynth.connect(reverb);
    chordSynth.connect(reverb);
  } else {
    reverbDiv.textContent = `no reverb`;
  }

  //Generate chords
  const { chords, chordTime } = generateChords(key);

  //Generate Melody
  const { melody, melodyTime } = generateMelody(chords, chordTime, key);

  console.log(chords.map((c) => c.name));
  console.log('melody', melody);

  // Create sequences
  melodySequence = new Tone.Part((time, event) => {
    const velocity = Math.random() * 0.5 + 0.5;
    melodySynth.triggerAttackRelease(
      event.note,
      event.duration,
      time,
      velocity,
    );
  }, melody).start(0);

  chordSequence = new Tone.Part((time, event) => {
    chordSynth.triggerAttackRelease(event.notes, event.duration, time, 0.3);
  }, chords).start(0);

  // Create separate sequences for each drum
  kickSequence = new Tone.Part((time, event) => {
    kick.triggerAttackRelease(event.note, '8n', time);
  }, kickPattern).start(0);

  snareSequence = new Tone.Part((time) => {
    snare.triggerAttackRelease('8n', time);
  }, snarePattern).start(0);

  hiHatSequence = new Tone.Part((time, event) => {
    hiHat.triggerAttackRelease(event.note, '32n', time);
  }, hiHatPattern).start(0);

  // Set loop points
  melodySequence.loop = true;
  chordSequence.loop = true;
  kickSequence.loop = true;
  snareSequence.loop = true;
  hiHatSequence.loop = true;

  const timeToAdd = chordTime - (melodyTime % chordTime);
  const adjustedMelodyTime = melodyTime + timeToAdd;

  // Set loop lengths in seconds
  melodySequence.loopEnd = adjustedMelodyTime; // Loop length matches our generated melody
  chordSequence.loopEnd = chordTime; // Loop length matches our chord progression
  kickSequence.loopEnd = '1m';
  snareSequence.loopEnd = '1m';
  hiHatSequence.loopEnd = '1m';

  console.log('New track generated:', settings);
  console.log('melodySynth', allMelodySynths[randIndex1].name);
  console.log('Tempo', Tone.Transport.bpm.value);
  console.log('## key', key);
};

function disposeAll() {
  if (melodySequence) melodySequence.dispose();
  if (chordSequence) chordSequence.dispose();
  if (drumSequence) drumSequence.dispose();
  if (kickSequence) kickSequence.dispose();
  if (snareSequence) snareSequence.dispose();
  if (hiHatSequence) hiHatSequence.dispose();

  chordSequence = null;
  kickSequence = null;
  snareSequence = null;
  hiHatSequence = null;
  melodySynth = null;
}
