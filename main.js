import { generateNewTrack } from './trackGenerator.js';
import { isMobileDevice } from './utils.js';

let isGenerating = false;

const elements = {
  bench: document.querySelector('.bench'),
  isMobile: document.querySelector('.isMobile'),
  buttons: {
    newTrack: document.getElementById('new-track'),
    play: document.getElementById('play'),
    stop: document.getElementById('stop'),
  },
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
