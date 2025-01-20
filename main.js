import { generateNewTrack } from './trackGenerator.js';

let isGenerating = false;

const elements = {
  bench: document.querySelector('.bench'),
  cpu: document.querySelector('.cpu'),
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
  context._latencyHint = 'playback';
  context._lookAhead = 0.5;
  context.updateInterval = 0.0005;
};

// Transport Controls
const startTransport = () => Tone.Transport.start('+0.2');

const stopTransport = () => {
  Tone.Transport.clear();
  Tone.Transport.stop();
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
    elements.key.textContent = `Key: ${key}`;
    elements.tempo.textContent = `BPM: ${tempo}`;
  } catch (error) {
    console.error('Error generating track:', error);
    elements.bench.textContent = 'Error generating track';
  } finally {
    isGenerating = false;
  }
};

// CPU Monitoring
const setupCPUMonitoring = () => {
  setInterval(() => {
    const usage = Tone.context.currentTime - Tone.context.currentTime;
    elements.cpu.textContent = usage > 0.1 ? 'High CPU load!' : '';
  }, 1000);
};

// Event Listeners
const setupEventListeners = () => {
  elements.buttons.newTrack.addEventListener('click', generateTrack);
  elements.buttons.play.addEventListener('click', startTransport);
  elements.buttons.stop.addEventListener('click', stopTransport);

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
setupCPUMonitoring();
