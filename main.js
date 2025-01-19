import { generateNewTrack } from './trackGenerator.js';
import { isMobileDevice } from './utils.js';

let isGenerating = false;

// Button actions
document.getElementById('new-track').addEventListener('click', async () => {
  const time = Date.now();
  if (isGenerating) return;
  isGenerating = true;

  Tone.Transport.clear();
  Tone.Transport.stop();
  Tone.Transport.cancel(0);

  await new Promise((resolve) => setTimeout(resolve, 100));

  generateNewTrack();

  isGenerating = false;
  const bench = Date.now() - time;

  const benchDiv = document.querySelector('.bench');
  benchDiv.textContent = `TimeToGenerate: ${bench}ms`;
});

document.getElementById('play').addEventListener('click', () => {
  // Tone.Transport.start();
  Tone.Transport.start('+0.1');
});

document.getElementById('stop').addEventListener('click', () => {
  Tone.Transport.clear();
  Tone.Transport.stop();
});

window.addEventListener('beforeunload', () => {
  console.log('### UNLOAD');
  Tone.Transport.dispose();
});

document.addEventListener('DOMContentLoaded', () => {
  const isMobileTextDiv = document.querySelector('.ismobile');

  if (isMobileDevice()) {
    isMobileTextDiv.textContent = 'Using a mobile device.';
    optimizeForMobile();
  } else {
    isMobileTextDiv.textContent = 'Using a desktop device.';
  }

  window.onload = () => {
    if (window.Tone) {
      console.log('Tone.js is loaded');
      optimizeForMobile();
    } else {
      console.error('Tone.js failed to load');
    }
  };
});

setInterval(() => {
  const usage = Tone.context.currentTime - Tone.context.currentTime;
  if (usage > 0.1) {
    const cpuDiv = document.querySelector('.cpu');
    cpuDiv.textContent = `High CPU load!`;
  }
}, 1000);

const optimizeForMobile = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isMobileTextDiv = document.querySelector('.ismobile');
  console.log('isMobile', isMobile);
  console.log('window.Tone', window.Tone);

  if (isMobile && window.Tone) {
    // Reduce polyphony and complexity
    window.Tone.context.latencyHint = 'playback';
    isMobileTextDiv.textContent = 'optimized for mobile';

    console.log('Mobile optimizations applied.');
  } else {
    isMobileTextDiv.textContent = 'NOT optimized for mobile';
    console.log('Not a mobile device or Tone not loaded.');
  }
};

// Initialize first track on page load
generateNewTrack();
