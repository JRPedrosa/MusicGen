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
};

// Tone.js Configuration
const configureToneJs = () => {
  const context = Tone.getContext();
  // context._latencyHint = 'playback';
  context._lookAhead = 0.5;
  // context.updateInterval = 0.01;
  const bufferSize = 2048; // or 2048 for very slow devices
  Tone.context.rawContext.audioWorklet.bufferSize = bufferSize;

  if (isMobileDevice()) {
    elements.isMobile.textContent = 'isMobile';
    // context.sampleRate = 22100;
  }
};

// Transport Controls
const startTransport = () => {
  console.log('## Play');
  Tone.Transport.start('+0.5');
};

const stopTransport = () => {
  Tone.Transport.clear();
  Tone.Transport.stop();
  Tone.Transport.cancel();
};

const disposeTransport = () => Tone.Transport.dispose();

// Track Generation
const generateTrack = async () => {
  if (isGenerating) return;

  try {
    isGenerating = true;

    stopTransport();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const { key, tempo } = generateNewTrack();
    /* elements.key.textContent = `Key: ${key}`;
    elements.tempo.textContent = `BPM: ${tempo}`; */
  } catch (error) {
    console.error('Error generating track:', error);
    elements.bench.textContent = 'Error generating track';
  } finally {
    isGenerating = false;
  }
};

// Event Listeners
const setupEventListeners = () => {
  elements.buttons.newTrack.addEventListener('click', generateTrack);
  elements.buttons.play.addEventListener('click', startTransport);
  // elements.buttons.stop.addEventListener('click', stopTransport);

  window.addEventListener('beforeunload', disposeTransport);

  document.addEventListener('DOMContentLoaded', () => {
    window.onload = () => {
      if (!window.Tone) {
        console.error('Tone.js failed to load');
        elements.bench.textContent = 'Error: Tone.js failed to load';
        return;
      }

      console.log('Tone.js is loaded');
      configureToneJs();
      generateTrack();
    };
  });
};

setupEventListeners();
