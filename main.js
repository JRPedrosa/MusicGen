// Tone.setContext(new Tone.Context({ latencyHint: 'playback' }));

import { generateNewTrack } from './trackGenerator.js';
import { isMobileDevice } from './utils.js';

let isGenerating = false;
// Tone.setContext(new Tone.Context({ latencyHint: 'playback' }), true);

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
  const regexDiv = document.querySelector('.regex');
  const functionDiv = document.querySelector('.function');

  const isMobileRegEx = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isMobileFunction = isMobileDevice();

  regexDiv.textContent = `regex: ${isMobileRegEx}`;
  functionDiv.textContent = `function: ${isMobileFunction}`;

  if (isMobileRegEx || isMobileFunction) {
    isMobileTextDiv.textContent = 'Using a mobile device.';
    // Tone.setContext(new Tone.Context({ latencyHint: 'playback' }));
    // window.Tone.context.latencyHint = 'playback';
  } else {
    isMobileTextDiv.textContent = 'Using a desktop device.';
  }

  window.onload = () => {
    if (window.Tone) {
      console.log('Tone.js is loaded');
      // Tone.setContext(new Tone.Context({ latencyHint: 'playback' }));
      // window.Tone.context.latencyHint = 'playback';7
      // isMobileTextDiv.textContent = 'Using a mobile device. onLoad()';
      const context = Tone.getContext();
      console.log('## context', context);
      // Tone.setContext(context({ latencyHint: 'playback' }));
      context._latencyHint = 'playback';
      context._lookAhead = 0.5;
      context.updateInterval = 0.1;

      generateNewTrack();
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

// Initialize first track on page load
// generateNewTrack();
