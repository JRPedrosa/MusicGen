import { generateNewTrack } from './trackGenerator.js';
import { bufferToWav } from './audioUtils.js';
import { isMobileDevice } from './utils.js';
let isGenerating = false;

const elements = {
  warning: document.querySelector('.warning'),
  offline: document.getElementById('offlineGen'),
  loading: document.getElementById('loading'),
  loadingMessage: document.getElementById('loadingMessage'),
};

const OFFLINE_CONFIG = {
  maxDuration: 20,
  mobileSampleRate: 22050,
  sampleRate: 48000,
  channels: 2,
};

let intervalId = null;

const startOffline = () => {
  if (isGenerating) {
    return;
  }
  isGenerating = true;
  elements.loading.textContent = ``;
  elements.offline.style.backgroundColor = 'grey';
  elements.loading.classList.add('loading-animation');

  const sampleRate = isMobileDevice()
    ? OFFLINE_CONFIG.mobileSampleRate
    : OFFLINE_CONFIG.sampleRate;

  const time = Date.now();
  Tone.Offline(
    async (ctx) => {
      generateNewTrack(ctx.transport);
      ctx.transport.start(0.2);

      intervalId = setInterval(() => {
        const progress =
          (ctx.transport.seconds / OFFLINE_CONFIG.maxDuration) * 102;
        updateProgress(progress, intervalId, ctx);
      }, 200);
    },
    OFFLINE_CONFIG.maxDuration,
    OFFLINE_CONFIG.channels,
    sampleRate,
  )
    .then((buffer) => {
      playBuffer(buffer); // Play the generated buffer
      console.log('timeToGenerate: ', Date.now() - time);
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

  const audioDiv = document.querySelector('.audioDiv');
  const wrapperDiv = document.createElement('div');

  wrapperDiv.appendChild(audioElement);
  audioDiv.appendChild(wrapperDiv);

  isGenerating = false;
  clearAllTimeouts();
  elements.offline.style.backgroundColor = '#6200ea';
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
          elements.loadingMessage.textContent = `Normalizing the buffer..`;
        }
      }, 4000),
      setTimeout(() => {
        if (isGenerating) {
          elements.loadingMessage.textContent = `Finishing processing..`;
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
  elements.offline.addEventListener('click', startOffline);

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
    };
  });
};

setupEventListeners();
