import {
  settings,
  kickPattern,
  snarePattern,
  hiHatPattern,
} from './constants.js';
import {
  allMelodySynths,
  chordSynth,
  kick,
  snare,
  snareNoise,
  snareDrum,
  hiHat,
} from './synthSetup.js';
import { generateMelody } from './melodyGen.js';
import { generateChords } from './chordGen.js';

let melodySynth;
let melodySequence;
let chordSequence;
let drumSequence;
let kickSequence;
let snareSequence;
let hiHatSequence;

export const generateNewTrack = () => {
  if (melodySequence) melodySequence.dispose();
  if (chordSequence) chordSequence.dispose();
  if (drumSequence) drumSequence.dispose();
  if (kickSequence) kickSequence.dispose();
  if (snareSequence) snareSequence.dispose();
  if (hiHatSequence) hiHatSequence.dispose();

  //Set Tempo
  Tone.Transport.bpm.value = Math.floor(Math.random() * 70) + 70; // Tempo between 70/140 bpm

  //Choose a melody synth
  const randIndex = Math.floor(Math.random() * allMelodySynths.length);
  melodySynth = allMelodySynths[randIndex].sound;

  // Set Volumes
  chordSynth.volume.value = -12;
  kick.volume.value = -6;
  snareNoise.volume.value = -10;
  snareDrum.volume.value = -15;
  hiHat.volume.value = -30;

  // Add effects
  const reverb = new Tone.Reverb(2.5).toDestination();
  melodySynth.connect(reverb);
  chordSynth.connect(reverb);

  //Generate chords
  const { chords, chordTime } = generateChords();
  console.log('chords', chords);

  //Generate Melody
  const { melody, melodyTime } = generateMelody(chords, chordTime);

  console.log('melodyTime', melodyTime);
  console.log('chordTime', chordTime);
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

  snareSequence = new Tone.Part((time, event) => {
    snare.triggerAttackRelease(event.note, '8n', time);
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
  kickSequence.loopEnd = '2m';
  snareSequence.loopEnd = '2m';
  hiHatSequence.loopEnd = '2m';

  console.log('New track generated:', settings);
  console.log('melodySynth', allMelodySynths[randIndex].name);
  console.log('Tempo', Tone.Transport.bpm.value);
};
