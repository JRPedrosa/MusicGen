import { generateNewTrack } from './trackGenerator.js';
import { bufferToWav } from './audioUtils.js';
import { isMobileDevice } from './utils.js';
let isGenerating = false;

const elements = {
  warning: document.querySelector('.warning'),
  buttons: {
    newTrack: document.getElementById('new-track'),
    play: document.getElementById('play'),
    stop: document.getElementById('stop'),
    offline: document.getElementById('offlineGen'),
  },
  loading: document.getElementById('loading'),
  loadingMessage: document.getElementById('loadingMessage'),
  key: document.getElementById('key'),
  tempo: document.getElementById('tempo'),
};

const OFFLINE_CONFIG = {
  maxDuration: 20,
  sampleRate: 22050,
  blockSize: 128,
  bufferSize: 1024,
  channels: 2,
};

const configureToneJs = () => {
  const context = Tone.getContext();
  context._latencyHint = 'playback';
  context._lookAhead = 0.1;
  context.updateInterval = 0.05;
  // const bufferSize = 2048; // or 2048 for very slow devices
  // Tone.context.rawContext.audioWorklet.bufferSize = bufferSize;
};

let intervalId = null;

const startOffline = () => {
  if (isGenerating) {
    return;
  }
  isGenerating = true;
  elements.loading.textContent = ``;
  elements.buttons.offline.style.backgroundColor = 'grey';
  elements.loading.classList.add('loading-animation');

  const sampleRate = isMobileDevice()
    ? OFFLINE_CONFIG.sampleRate
    : OFFLINE_CONFIG.sampleRate * 2;

  Tone.Offline(
    async (ctx) => {
      const { key, tempo, melodySynth, chordSynth, kick, snare, hiHat } =
        generateNewTrack(ctx.transport);
      ctx.transport.start(0.3);

      intervalId = setInterval(() => {
        const progress =
          (ctx.transport.seconds / OFFLINE_CONFIG.maxDuration) * 102;
        updateProgress(progress, intervalId, ctx);
        console.log('## ctx', ctx);
      }, 200);
    },
    OFFLINE_CONFIG.maxDuration,
    OFFLINE_CONFIG.channels,
    sampleRate,
  )
    .then((buffer) => {
      console.log('Generated Buffer:', buffer);
      playBuffer(buffer); // Play the generated buffer
    })
    .catch((err) => {
      console.error('Error in offline rendering:', err);
    });
};

const playBuffer = (buffer) => {
  const audioContext = Tone.context.rawContext;
  const wavData = bufferToWav(buffer, audioContext);

  const audioBlob = new Blob([wavData], { type: 'audio/wav' });
  const audioUrl = URL.createObjectURL(audioBlob);

  const audioElement = new Audio(audioUrl);
  audioElement.controls = true;

  const audioDiv = document.querySelector('.audio');
  audioDiv.appendChild(audioElement);

  isGenerating = false;
  clearAllTimeouts();
  elements.buttons.offline.style.backgroundColor = '#6200ea';
  elements.loadingMessage.textContent = `Ready!`;
  elements.loading.classList.remove('loading-animation');
};

let timeoutIds = [];
const updateProgress = (progress, intervalId) => {
  elements.loadingMessage.textContent = `${Math.round(progress)}%`;
  if (Math.round(progress) > 95) {
    clearInterval(intervalId);
    elements.loading.textContent = ``;

    elements.loadingMessage.textContent = `Converting to WAV..`;

    timeoutIds.push(
      setTimeout(() => {
        if (isGenerating) {
          elements.loadingMessage.textContent = `Normalizing the buffer`;
        }
      }, 4000),
      setTimeout(() => {
        if (isGenerating) {
          elements.loadingMessage.textContent = `Finishing processing`;
        }
      }, 10000),
      setTimeout(() => {
        if (isGenerating) {
          elements.loadingMessage.textContent = `Almost there!`;
        }
      }, 15000),
      setTimeout(() => {
        if (isGenerating) {
          elements.loadingMessage.textContent = `Adding a cherry on top`;
        }
      }, 20000),
      setTimeout(() => {
        if (isGenerating) {
          elements.loadingMessage.textContent = `I swear this is going to work`;
        }
      }, 27000),
    );
  }
};

const clearAllTimeouts = () => {
  timeoutIds.forEach((id) => clearTimeout(id));
  timeoutIds = []; // Reset the array
};

// Event Listeners
const setupEventListeners = () => {
  elements.buttons.offline.addEventListener('click', startOffline);

  window.addEventListener('beforeunload', async () => {
    Tone.context.close(); // Only close context when unloading page
  });

  document.addEventListener('DOMContentLoaded', () => {
    window.onload = async () => {
      if (!window.Tone) {
        console.error('Tone.js failed to load');
        elements.warning.textContent = 'Error: Tone.js failed to load';
        return;
      }

      console.log('Tone.js is loaded');
      await Tone.start(); // Initialize Tone.js
      configureToneJs();
    };
  });
};

setupEventListeners();
