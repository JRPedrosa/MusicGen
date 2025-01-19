// Melody synth setup
export const melody1 = new Tone.Synth({
  oscillator: { type: 'triangle' },
  envelope: {
    attack: 0.05,
    decay: 0.1,
    sustain: 0.3,
    release: 1,
  },
}).toDestination();

export const melody2 = new Tone.Synth({
  oscillator: { type: 'triangle' },
  envelope: {
    attack: 0.05,
    decay: 0.4,
    sustain: 0.1,
    release: 0.3,
  },
}).toDestination();

// Chord synth setup - using a softer sound
export const chordSynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: 'sine' },
  envelope: {
    attack: 0.1,
    decay: 0.3,
    sustain: 0.4,
    release: 2,
  },
}).toDestination();

// DRUMS
export const kick = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 5,
  oscillator: { type: 'sine' }, // Changed to sine for deeper sound
  envelope: {
    attack: 0.001,
    decay: 0.4,
    sustain: 0.01,
    release: 0.4,
  },
}).toDestination();

export const snareDrum = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 4,
  oscillator: { type: 'triangle' },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0,
    release: 0.2,
  },
}).toDestination();

export const snareNoise = new Tone.NoiseSynth({
  noise: {
    type: 'white',
    playbackRate: 3,
  },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0,
    release: 0.2,
  },
}).toDestination();

// Combine them into a single instrument
export const snare = {
  triggerAttackRelease: (note, duration, time, velocity = 1) => {
    snareDrum.triggerAttackRelease(note, duration, time, velocity * 0.5);
    snareNoise.triggerAttackRelease(duration, time, velocity * 0.5);
  },
  volume: { value: -10 },
};

export const hiHat = new Tone.MetalSynth({
  frequency: 200,
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0,
    release: 0.05,
  },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5,
}).toDestination();
