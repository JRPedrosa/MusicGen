// MELODY SYNTHS
export const allMelodySynths = ['melody1', 'melody2', 'melody3', 'melody4'];
export const createMelodySynth = (name) => {
  switch (name) {
    case allMelodySynths[0]:
      return new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.05,
          decay: 0.1,
          sustain: 0.3,
          release: 0.4,
        },
        volume: -30,
      }).toDestination();

    case allMelodySynths[1]:
      return new Tone.FMSynth({
        harmonicity: 2,
        modulationIndex: 1,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0.2,
          release: 0.4,
        },
        volume: -15,
      }).toDestination();

    case allMelodySynths[2]:
      return new Tone.DuoSynth({
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
      }).toDestination();

    case allMelodySynths[3]:
      return new Tone.MonoSynth({
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
      }).toDestination();

    default:
      return null;
  }
};

// CHORD SYNTHS
export const allChordSynths = ['chordSynth1'];
export const createChordSynth = (name) => {
  switch (name) {
    case allChordSynths[0]:
      return new Tone.PolySynth(Tone.Synth, {
        // maxPolyphony: 1,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.2,
          decay: 0.2,
          sustain: 0.9,
          release: 0.1,
        },
        volume: -30,
      }).toDestination();
    default:
      return null;
  }
};

// DRUMS
export const allKicks = ['kick1', 'kick2'];
export const createKick = (name) => {
  switch (name) {
    case allKicks[0]:
      return new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 5,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.01,
          decay: 0.4,
          sustain: 0,
          release: 0,
        },
        volume: -30,
      }).toDestination();
    case allKicks[1]:
      return new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 5,
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.01,
          decay: 0.3,
          sustain: 0,
          release: 0,
        },
        volume: -30,
      }).toDestination();
    default:
      return null;
  }
};

export const allSnares = ['snare1', 'snare2'];
export const createSnare = (name) => {
  switch (name) {
    case allSnares[0]:
      return new Tone.NoiseSynth({
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
      }).toDestination();
    case allSnares[1]:
      return new Tone.NoiseSynth({
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
      }).toDestination();

    default:
      return null;
  }
};

export const allHiHats = ['hiHat1', 'hiHat2'];
export const createHiHat = (name) => {
  switch (name) {
    case allHiHats[0]:
      return new Tone.MetalSynth({
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
      }).toDestination();
    case allHiHats[1]:
      return new Tone.MetalSynth({
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
      }).toDestination();

    default:
      return null;
  }
};
