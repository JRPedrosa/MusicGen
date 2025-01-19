import { generateNewTrack } from './trackGenerator.js';

// Button actions
document.getElementById('new-track').addEventListener('click', () => {
  Tone.Transport.stop();
  generateNewTrack();
});

document.getElementById('play').addEventListener('click', () => {
  Tone.Transport.start();
});

document.getElementById('stop').addEventListener('click', () => {
  Tone.Transport.stop();
});

// Initialize first track on page load
generateNewTrack();
