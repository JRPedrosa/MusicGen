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
  Tone.Transport.start('+0.2');
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
  } else {
    isMobileTextDiv.textContent = 'Using a desktop device.';
  }

  window.onload = () => {
    if (window.Tone) {
      console.log('Tone.js is loaded');
      const latencyDiv = document.querySelector('.latency');
      const context = Tone.getContext();
      console.log('## context', context);

      context._latencyHint = 'playback';
      context._lookAhead = 0.5;
      context.updateInterval = 0.1;
      latencyDiv.textContent = `LookAhead: ${context._lookAhead} Interval: ${context.updateInterval}`;

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
