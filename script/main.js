import { generateNewTrack } from './trackGenerator.js';
import { bufferToWav } from './audioUtils.js';
import { isMobileDevice } from './utils.js';
import { elements } from './state.js';

const isDev =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

let isGenerating = false;

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
  console.clear();
  isGenerating = true;
  elements.loading.textContent = ``;
  elements.offline.style.backgroundColor = 'grey';
  elements.loading.classList.add('loading-animation');

  // Remove the old audio element if it exists
  const audioDiv = document.querySelector('.audioDiv');
  const existingWrapper = audioDiv.querySelector('div');
  if (existingWrapper) {
    const oldAudioElement = existingWrapper.querySelector('audio');
    if (oldAudioElement) {
      const oldAudioUrl = oldAudioElement.src;
      // Revoke the old audio URL
      URL.revokeObjectURL(oldAudioUrl);
    }
    // Remove the wrapper div containing the old audio element
    audioDiv.removeChild(existingWrapper);
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
      console.log(
        '##WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      );
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
    20000,
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
  const audioDiv = document.querySelector('.audioDiv');
  const audioElement = new Audio(audioUrl);
  audioElement.controls = true;
  // audioElement.loop = true;

  const wrapperDiv = document.createElement('div');
  wrapperDiv.appendChild(audioElement);
  audioDiv.appendChild(wrapperDiv);

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

  /* elements.outOfChordSlider.addEventListener('input', (event) => {
    PROBABILITIES.OUT_OF_CHORD = parseFloat(event.target.value);
    outOfChordValue.textContent = event.target.value;
  });

  elements.closestNoteSlider.addEventListener('input', (event) => {
    PROBABILITIES.CLOSEST_NOTE = parseFloat(event.target.value);
    closestNoteValue.textContent = event.target.value;
  });

  elements.restSlider.addEventListener('input', (event) => {
    PROBABILITIES.REST = parseFloat(event.target.value);
    restValue.textContent = event.target.value;
  });
 */
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

      await Tone.start(); // Initialize Tone.js
    };
  });
};

setupEventListeners();
