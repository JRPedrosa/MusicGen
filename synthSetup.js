// Melody synth setup
const melody0 = new Tone.Synth({
  oscillator: { type: 'triangle' },
  envelope: {
    attack: 0.05,
    decay: 0.1,
    sustain: 0.3,
    release: 0.4,
  },
}).toDestination();

const melody1 = new Tone.FMSynth({
  // FM synthesis for a bell-like tone
  harmonicity: 2,
  modulationIndex: 1,
  oscillator: { type: 'sine' },
  envelope: {
    attack: 0.01,
    decay: 0.2,
    sustain: 0.2,
    release: 0.4,
  },
}).toDestination();

const melody2 = new Tone.DuoSynth({
  // Dual oscillator for a thick, detuned sound
  vibratoAmount: 0.5,
  vibratoRate: 5,
  harmonicity: 1.5,
  voice0: {
    oscillator: { type: 'sawtooth' },
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.4,
      release: 0.4,
    },
  },
  voice1: {
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.05,
      decay: 0.2,
      sustain: 0.3,
      release: 0.2,
    },
  },
}).toDestination();

const melody3 = new Tone.MonoSynth({
  // Monophonic synth with filter sweep
  oscillator: { type: 'sawtooth' },
  envelope: {
    attack: 0.05,
    decay: 0.3,
    sustain: 0.4,
    release: 0.4,
  },
  filterEnvelope: {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.3,
    release: 0.2,
    baseFrequency: 200,
    octaves: 3,
  },
}).toDestination();

melody0.volume.value = -30;
melody1.volume.value = -15;
melody2.volume.value = -35;
melody3.volume.value = -30;

export const allMelodySynths = [
  { sound: melody0, name: 'melody0' },
  { sound: melody1, name: 'melody1' },
  { sound: melody2, name: 'melody2' },
  { sound: melody3, name: 'melody3' },
];

export const chordSynth1 = new Tone.PolySynth(Tone.Synth, {
  // maxPolyphony: 1,
  oscillator: { type: 'sine' },
  envelope: {
    attack: 0.2,
    decay: 0.2,
    sustain: 0.9,
    release: 0.1,
  },
}).toDestination();

export const chordSynth2 = new Tone.PolySynth(Tone.Synth, {
  maxPolyphony: 5, // Match the max number of notes in your chords
  voice: Tone.Synth,
  options: {
    oscillator: {
      type: 'sine4', // More efficient than pure sine
      partialCount: 2, // Reduce harmonics for better performance
    },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.9,
      release: 0.1,
    },
    // volume: -12, // Prevent clipping
  },
}).toDestination();

export const chordSynth3 = new Tone.PolySynth(Tone.FMSynth, {
  maxPolyphony: 5,
  voice: Tone.FMSynth,
  options: {
    harmonicity: 1,
    modulationIndex: 1,
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.8,
      release: 0.1,
    },
    modulation: {
      type: 'square',
    },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0,
      sustain: 1,
      release: 0.5,
    },
  },
}).toDestination();

export const allChordSynths = [
  { sound: chordSynth1, name: 'chordSynth1' },
  { sound: chordSynth2, name: 'chordSynth2' },
  { sound: chordSynth3, name: 'chordSynth3' },
];

// DRUMS
export const kick = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 5,
  oscillator: { type: 'sine' },
  envelope: {
    attack: 0.01,
    decay: 0.4,
    sustain: 0,
    release: 0,
  },
  volume: -10,
}).toDestination();

export const kick1 = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 5,
  oscillator: { type: 'triangle' },
  envelope: {
    attack: 0.01,
    decay: 0.3,
    sustain: 0,
    release: 0,
  },
  volume: -10,
}).toDestination();

export const snare = new Tone.NoiseSynth({
  noise: {
    type: 'white',
    playbackRate: 3,
    volume: 5,
  },
  envelope: {
    attack: 0.005,
    decay: 0.2,
    sustain: 0,
    release: 0,
  },
}).toDestination();

export const snare1 = new Tone.NoiseSynth({
  noise: {
    type: 'pink',
    playbackRate: 3,
    volume: 10,
  },
  envelope: {
    attack: 0.01,
    decay: 0.2,
    sustain: 0,
    release: 0,
  },
}).toDestination();

export const hiHat = new Tone.MetalSynth({
  frequency: 200,
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0,
    release: 0,
  },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5,
}).toDestination();

export const hiHat1 = new Tone.MetalSynth({
  frequency: 100,
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0,
    release: 0,
  },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 3000,
  octaves: 1,
}).toDestination();
