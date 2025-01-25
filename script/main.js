import { generateNewTrack } from './trackGenerator.js';
import { bufferToWav } from './utils/audioUtils.js';
import { isMobileDevice } from './utils/utils.js';
import { OFFLINE_CONFIG, elements } from './constants.js';

const isDev =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

let isGenerating = false;
let intervalId = null;

const startOffline = () => {
  if (isGenerating) {
    return;
  }
  console.clear();
  isGenerating = true;
  elements.loading.textContent = ``;
  elements.offline.style.backgroundColor = 'grey';
  elements.loading.classList.add('loading-animation');

  // Remove the old audio element if it exists
  const existingWrapper = elements.audioDiv.querySelector('div');
  if (existingWrapper) {
    const oldAudioElement = existingWrapper.querySelector('audio');
    if (oldAudioElement) {
      const oldAudioUrl = oldAudioElement.src;
      URL.revokeObjectURL(oldAudioUrl);
    }
    elements.audioDiv.removeChild(existingWrapper);
  }

  const sampleRate = isDev
    ? 20000
    : isMobileDevice()
    ? OFFLINE_CONFIG.mobileSampleRate
    : OFFLINE_CONFIG.sampleRate;

  const time = Date.now();

  Tone.Offline(
    async (ctx) => {
      ctx.debug = true;
      generateNewTrack(ctx.transport);
      ctx.transport.start();

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
      elements.loadingMessage.textContent = `Generated in: ${(
        (Date.now() - time) /
        1000
      ).toFixed(1)}s`;
    })
    .catch((err) => {
      console.error('Error in offline rendering:', err);
    });
};

const playBuffer = (buffer) => {
  const audioContext = Tone.context.rawContext;
  const wavData = bufferToWav(buffer, audioContext);

  // Create a new audio blob and URL
  const audioBlob = new Blob([wavData], { type: 'audio/wav' });
  const audioUrl = URL.createObjectURL(audioBlob);

  // Create and append the new audio element
  const audioElement = new Audio(audioUrl);
  audioElement.controls = true;

  const wrapperDiv = document.createElement('div');
  wrapperDiv.appendChild(audioElement);
  elements.audioDiv.appendChild(wrapperDiv);

  // Reset UI and state
  isGenerating = false;
  clearAllTimeouts();
  elements.offline.style.backgroundColor = '#6200ea';
  elements.loading.classList.remove('loading-animation');
};

let timeoutIds = [];
const updateProgress = (progress, intervalId) => {
  elements.loadingMessage.textContent = `${Math.round(progress)}%`;
  if (Math.round(progress) > 85) {
    clearInterval(intervalId);
    elements.loading.textContent = ``;
    elements.loadingMessage.textContent = `Converting to WAV`;

    const messages = [
      { text: `Normalizing the buffer`, delay: 4000 },
      { text: `Finishing processing`, delay: 10000 },
      { text: `Almost there!`, delay: 15000 },
      { text: `Adding a cherry on top...`, delay: 20000 },
      { text: `I swear this is going to work`, delay: 27000 },
    ];

    messages.forEach(({ text, delay }) => {
      timeoutIds.push(
        setTimeout(() => {
          if (isGenerating) {
            elements.loadingMessage.textContent = text;
          }
        }, delay),
      );
    });
  }
};

const clearAllTimeouts = () => {
  timeoutIds.forEach((id) => clearTimeout(id));
  timeoutIds = []; // Reset the array
};

const setupEventListenersAndInit = () => {
  elements.offline.addEventListener('click', startOffline);

  window.addEventListener('beforeunload', async () => {
    Tone.context.close();
  });

  document.addEventListener('DOMContentLoaded', () => {
    window.onload = async () => {
      if (!window.Tone) {
        console.error('Tone.js failed to load');
        elements.warning.textContent = 'Error: Tone.js failed to load';
        return;
      }

      await Tone.start();
    };
  });
};

setupEventListenersAndInit();
