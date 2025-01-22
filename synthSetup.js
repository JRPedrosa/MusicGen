// MELODY SYNTHS
export const allMelodySynths = {
  melody1: () =>
    new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.3,
        release: 0.8,
      },
      volume: -30,
    }).toDestination(),

  melody2: () =>
    new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.3,
        release: 0.4,
      },
      volume: -28,
    }).toDestination(),

  melody3: () =>
    new Tone.DuoSynth({
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
      volume: -35,
    }).toDestination(),

  melody4: () =>
    new Tone.DuoSynth({
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
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.05,
          decay: 0.2,
          sustain: 0.3,
          release: 0.2,
        },
      },
      volume: -35,
    }).toDestination(),

  melody5: () =>
    new Tone.MonoSynth({
      // The best one?
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
      volume: -30,
    }).toDestination(),

  melody6: () =>
    new Tone.AMSynth({
      oscillator: { type: 'sine' },
      modulation: { type: 'sine' },
      envelope: {
        attack: 0.05,
        decay: 0.2,
        sustain: 0.3,
        release: 0.7,
      },
      volume: -20,
    }).toDestination(),
};

export const createMelodySynth = (name) => {
  const synthFactory = allMelodySynths[name];
  return synthFactory ? synthFactory() : null;
};

// CHORD SYNTHS
export const allChordSynths = {
  chordSynth1: () =>
    new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.2,
        decay: 0.2,
        sustain: 0.9,
        release: 0.1,
      },
      volume: -30,
    }).toDestination(),

  chordSynth2: () =>
    new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.2,
        decay: 0.2,
        sustain: 0.9,
        release: 0.1,
      },
      volume: -30,
    }).toDestination(),

  chordSynth3: () =>
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.5,
        release: 0.1,
      },
      volume: -30,
    }).toDestination(),
};

export const createChordSynth = (name) => {
  const synthFactory = allChordSynths[name];
  return synthFactory ? synthFactory() : null;
};

// ------ DRUMS ------
// KICKS
export const allKicks = {
  kick1: () =>
    new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 5,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.01,
        decay: 0.4,
        sustain: 0,
        release: 0,
      },
      volume: -15,
    }).toDestination(),

  kick2: () =>
    new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 5,
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0,
        release: 0,
      },
      volume: -15,
    }).toDestination(),
};

export const createKick = (name) => {
  const kickFactory = allKicks[name];
  return kickFactory ? kickFactory() : null;
};

// SNARES
export const allSnares = {
  snare1: () =>
    new Tone.NoiseSynth({
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
      volume: -32,
    }).toDestination(),

  snare2: () =>
    new Tone.NoiseSynth({
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
      volume: -32,
    }).toDestination(),
};

export const createSnare = (name) => {
  const snareFactory = allSnares[name];
  return snareFactory ? snareFactory() : null;
};

// HI-HATS
export const allHiHats = {
  hiHat1: () =>
    new Tone.MetalSynth({
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
      volume: -45,
    }).toDestination(),

  hiHat2: () =>
    new Tone.MetalSynth({
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
      volume: -45,
    }).toDestination(),
};

export const createHiHat = (name) => {
  const hiHatFactory = allHiHats[name];
  return hiHatFactory ? hiHatFactory() : null;
};
