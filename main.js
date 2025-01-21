import { generateNewTrack, getRandomKey } from './trackGenerator.js';
import { isMobileDevice } from './utils.js';
import { generateMelody } from './melodyGen.js';
import { generateChords } from './chordGen.js';

let isGenerating = false;

const elements = {
  bench: document.querySelector('.bench'),
  isMobile: document.querySelector('.isMobile'),
  buttons: {
    newTrack: document.getElementById('new-track'),
    play: document.getElementById('play'),
    stop: document.getElementById('stop'),
    offline: document.getElementById('offlineGen'),
  },
  loading: document.getElementById('loading'),

  key: document.getElementById('key'),
  tempo: document.getElementById('tempo'),
  debug: document.getElementById('debug1'),
  debug2: document.getElementById('debug2'),
};

// Tone.js Configuration
const configureToneJs = () => {
  const context = Tone.getContext();
  context._latencyHint = 'playback';
  context._lookAhead = 0.5;
  context.updateInterval = 0.05;
  const bufferSize = 2048; // or 2048 for very slow devices
  Tone.context.rawContext.audioWorklet.bufferSize = bufferSize;

  if ('deviceMemory' in navigator) {
    const memory = navigator.deviceMemory;
    console.log(`This device has approximately ${memory}GB of RAM.`);
    elements.debug.textContent = `${memory}GB of RAM.`;
  } else {
    elements.debug.textContent = `?GB of RAM.`;
  }

  if (isMobileDevice()) {
    context._lookAhead = 1;
    context.updateInterval = 0.2;
  }

  const estimatePerformance = () => {
    const start = performance.now();
    // Example: Perform a large computation
    for (let i = 0; i < 100000000; i++) {
      Math.sqrt(i);
    }
    const end = performance.now();
    elements.debug2.textContent = `Performance Test Time: ${end - start}ms`;
    console.log(`Performance Test Time: ${Math.floor(end - start)}ms`);
  };

  estimatePerformance();

  if (isMobileDevice()) {
    elements.isMobile.textContent = 'isMobile';
    // context.sampleRate = 22100;
  }
};

const startTransport = () => {
  console.log('## Play');
  Tone.context.resume().then(() => {
    Tone.Transport.start('+0.5');
  });
};

const stopTransport = async () => {
  await Tone.Transport.stop();
  Tone.Transport.cancel(0); // Cancel scheduled events
  Tone.Transport.clear(); // Clear timeline events
  Tone.Transport.position = 0;
};

const disposeTransport = () => Tone.Transport.dispose();

const generateTrack = async () => {
  if (isGenerating) return;

  try {
    isGenerating = true;

    // Clean up existing audio properly
    await cleanupAudio();

    // Generate new track
    const { key, tempo } = generateNewTrack();
    // elements.key.textContent = `Key: ${key}`;
    // elements.tempo.textContent = `BPM: ${tempo}`;

    // Resume context if needed
    if (Tone.context.state !== 'running') {
      await Tone.context.resume();
    }
  } catch (error) {
    console.error('Error generating track:', error);
    elements.bench.textContent = 'Error generating track';
  } finally {
    isGenerating = false;
  }
};

const sequences1 = {
  melody: null,
  chord: null,
  kick: null,
  snare: null,
  hiHat: null,
};
let activePlayer = null;
const startOffline = () => {
  if (activePlayer) {
    activePlayer.stop(); // Stop the active player
    activePlayer.dispose(); // Dispose of the player to free up resources
    activePlayer = null;
    elements.buttons.offline.innerText = `offline gen (BETA)`;

    return;
  }
  elements.loading.textContent = `Generating... Please wait`;
  Tone.Offline(async ({ transport }) => {
    /* const melodySynth = new Tone.Synth().toDestination();
    const chordSynth = new Tone.Synth().toDestination();
    const reverb = new Tone.Reverb(2.5).toDestination();
    chordSynth.connect(reverb); */

    /* const { chords, melody } = await generateNewTrackOffline();

    melody.forEach((event, index) => {
      melodySynth.triggerAttackRelease(
        event.note,
        event.duration,
        event.time,
        event.velocity,
      );
    }); */
    /* const key = getRandomKey();

    const { chords, chordTime } = generateChords(key);
    const { melody, melodyTime } = generateMelody(chords, chordTime, key);

    // Create melody and chord sequences
    sequences1.melody = new Tone.Part((time, event) => {
      const velocity = Math.random() * 0.5 + 0.5;
      melodySynth.triggerAttackRelease(
        event.note,
        event.duration,
        time,
        velocity,
      );
    }, melody).start(0); */

    /* chords.forEach((event, index) => {
      chordSynth.triggerAttackRelease(
        event.notes,
        event.duration,
        event.time,
        event.velocity,
      );
    }); */
    generateNewTrack(transport);
    transport.start(0.2);
  }, 30)
    .then((buffer) => {
      // This buffer now contains all generated audio
      console.log('Generated Buffer:', buffer);
      playBuffer(buffer); // Play the generated buffer
    })
    .catch((err) => {
      console.error('Error in offline rendering:', err);
    });
};

const playBuffer = (buffer) => {
  activePlayer = new Tone.Player(buffer).toDestination();
  activePlayer.start();
  elements.loading.textContent = `Now playing!`;
  elements.buttons.offline.innerText = `Stop`;
};

const newTrack = async () => {
  await cleanupAudio();
  await generateTrack();
};

const cleanupAudio = async () => {
  await stopTransport();

  // Clean up any active sources or effects
  Tone.Transport.cancel();
  Tone.context.rawContext.resume();

  // Reset transport settings
  Tone.Transport.position = 0;
  Tone.Transport.loop = false;
};

// Event Listeners
const setupEventListeners = () => {
  elements.buttons.newTrack.addEventListener('click', newTrack);
  elements.buttons.play.addEventListener('click', startTransport);
  elements.buttons.offline.addEventListener('click', startOffline);

  window.addEventListener('beforeunload', async () => {
    await cleanupAudio();
    Tone.context.close(); // Only close context when unloading page
  });

  document.addEventListener('DOMContentLoaded', () => {
    window.onload = async () => {
      if (!window.Tone) {
        console.error('Tone.js failed to load');
        elements.bench.textContent = 'Error: Tone.js failed to load';
        return;
      }

      console.log('Tone.js is loaded');
      await Tone.start(); // Initialize Tone.js
      configureToneJs();
      generateTrack();
    };
  });
};

setupEventListeners();

const generateNewTrackOffline = async () => {
  // This function should return the chords and melody events, like the real generateNewTrack
  // but modified for offline rendering. For example:
  /* const chords = [
    { notes: ['C4', 'E4', 'G4'], duration: '1n', time: 0, velocity: 0.8 },
    { notes: ['F4', 'A4', 'C5'], duration: '1n', time: 1, velocity: 0.8 },
  ]; */

  const melody = [
    { note: 'C4', duration: '8n', time: 0, velocity: 0.7 },
    { note: 'D4', duration: '8n', time: 0.5, velocity: 0.7 },
  ];

  // Simulate other track details and return the events
  return { chords: null, melody };
};
