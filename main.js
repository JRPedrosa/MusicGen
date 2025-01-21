import { generateNewTrack, getRandomKey } from './trackGenerator.js';
import { isMobileDevice } from './utils.js';
import { generateMelody } from './melodyGen.js';
import { generateChords } from './chordGen.js';

let isGenerating = false;

const elements = {
  bench: document.querySelector('.bench'),
  isMobile: document.querySelector('.isMobile'),
  buttons: {
    newTrack: document.getElementById('new-track'),
    play: document.getElementById('play'),
    stop: document.getElementById('stop'),
    offline: document.getElementById('offlineGen'),
  },
  loading: document.getElementById('loading'),

  key: document.getElementById('key'),
  tempo: document.getElementById('tempo'),
  debug: document.getElementById('debug1'),
  debug2: document.getElementById('debug2'),
};

// Tone.js Configuration
const configureToneJs = () => {
  const context = Tone.getContext();
  context._latencyHint = 'playback';
  context._lookAhead = 0.5;
  context.updateInterval = 0.05;
  const bufferSize = 2048; // or 2048 for very slow devices
  Tone.context.rawContext.audioWorklet.bufferSize = bufferSize;

  if ('deviceMemory' in navigator) {
    const memory = navigator.deviceMemory;
    console.log(`This device has approximately ${memory}GB of RAM.`);
    elements.debug.textContent = `${memory}GB of RAM.`;
  } else {
    elements.debug.textContent = `?GB of RAM.`;
  }

  if (isMobileDevice()) {
    context._lookAhead = 1;
    context.updateInterval = 0.2;
  }

  const estimatePerformance = () => {
    const start = performance.now();
    // Example: Perform a large computation
    for (let i = 0; i < 100000000; i++) {
      Math.sqrt(i);
    }
    const end = performance.now();
    elements.debug2.textContent = `Performance Test Time: ${end - start}ms`;
    console.log(`Performance Test Time: ${Math.floor(end - start)}ms`);
  };

  estimatePerformance();

  if (isMobileDevice()) {
    elements.isMobile.textContent = 'isMobile';
    // context.sampleRate = 22100;
  }
};

const startTransport = () => {
  console.log('## Play');
  Tone.context.resume().then(() => {
    Tone.Transport.start('+0.5');
  });
};

const stopTransport = async () => {
  await Tone.Transport.stop();
  Tone.Transport.cancel(0); // Cancel scheduled events
  Tone.Transport.clear(); // Clear timeline events
  Tone.Transport.position = 0;
};

const disposeTransport = () => Tone.Transport.dispose();

const generateTrack = async () => {
  if (isGenerating) return;

  try {
    isGenerating = true;

    // Clean up existing audio properly
    await cleanupAudio();

    // Generate new track
    const { key, tempo } = generateNewTrack();
    // elements.key.textContent = `Key: ${key}`;
    // elements.tempo.textContent = `BPM: ${tempo}`;

    // Resume context if needed
    if (Tone.context.state !== 'running') {
      await Tone.context.resume();
    }
  } catch (error) {
    console.error('Error generating track:', error);
    elements.bench.textContent = 'Error generating track';
  } finally {
    isGenerating = false;
  }
};

const sequences1 = {
  melody: null,
  chord: null,
  kick: null,
  snare: null,
  hiHat: null,
};
let activePlayer = null;
const startOffline = () => {
  if (activePlayer) {
    activePlayer.stop(); // Stop the active player
    activePlayer.dispose(); // Dispose of the player to free up resources
    activePlayer = null;
    elements.buttons.offline.innerText = `offline gen (BETA)`;

    return;
  }
  elements.loading.textContent = `Generating... Please wait`;
  Tone.Offline(async ({ transport }) => {
    generateNewTrack(transport);
    transport.start(0.2);
  }, 30)
    .then((buffer) => {
      // This buffer now contains all generated audio
      console.log('Generated Buffer:', buffer);
      playBuffer(buffer); // Play the generated buffer
    })
    .catch((err) => {
      console.error('Error in offline rendering:', err);
    });
};

/* const playBuffer = (buffer) => {
  activePlayer = new Tone.Player(buffer).toDestination();
  activePlayer.start();
  elements.loading.textContent = `Now playing!`;
  elements.buttons.offline.innerText = `Stop`;
}; */

const playBuffer = (buffer) => {
  // Step 1: Convert Tone.Buffer to a Blob (WAV format)
  const audioContext = Tone.context.rawContext;
  const wavData = bufferToWav(buffer, audioContext);

  // Step 2: Create a Blob from the WAV data and an Object URL
  const audioBlob = new Blob([wavData], { type: 'audio/wav' });
  const audioUrl = URL.createObjectURL(audioBlob);

  // Step 3: Create a new <audio> element
  const audioElement = new Audio(audioUrl);

  // Step 4: Customize the audio element (no autoplay, user can play it)
  audioElement.controls = true; // Enable the controls (Play/Pause)

  // Step 5: Append the audio element to the body

  const controlsDiv = document.querySelector('.controls');
  controlsDiv.appendChild(audioElement);
};

function bufferToWav(buffer, context) {
  const numOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;

  // Create a new AudioBuffer for the WAV data
  const wavBuffer = context.createBuffer(numOfChannels, length, sampleRate);

  for (let channel = 0; channel < numOfChannels; channel++) {
    wavBuffer.copyToChannel(buffer.getChannelData(channel), channel);
  }

  // Encode the AudioBuffer into WAV format
  const wavEncoder = new WaveEncoder(wavBuffer);
  return wavEncoder.encode();
}

class WaveEncoder {
  constructor(audioBuffer) {
    this.audioBuffer = audioBuffer;
  }

  encode() {
    const channels = this.audioBuffer.numberOfChannels;
    const sampleRate = this.audioBuffer.sampleRate;
    const length = this.audioBuffer.length;

    // Calculate the buffer size (WAV header size + audio data size)
    const bufferSize = 44 + length * channels * 2; // 2 bytes per sample (16-bit PCM)
    const buffer = new ArrayBuffer(bufferSize);
    const view = new DataView(buffer);

    // Write the WAV header
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, bufferSize - 8, true); // File size excluding "RIFF" and size fields
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk size
    view.setUint16(20, 1, true); // Audio format (1 = PCM)
    view.setUint16(22, channels, true); // Number of channels
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, sampleRate * channels * 2, true); // Byte rate
    view.setUint16(32, channels * 2, true); // Block align (channels * bytes per sample)
    view.setUint16(34, 16, true); // Bits per sample (16 bits per sample)
    this.writeString(view, 36, 'data');
    view.setUint32(40, length * channels * 2, true); // Data size (number of samples * 2 bytes per sample)

    // Write the PCM data
    let offset = 44; // Start after the header
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < channels; channel++) {
        const sample = this.audioBuffer.getChannelData(channel)[i];
        view.setInt16(offset, sample * 32767, true); // Convert the sample to 16-bit PCM
        offset += 2; // Move to the next byte for the next sample
      }
    }

    return buffer;
  }

  writeString(view, offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }
}

const newTrack = async () => {
  await cleanupAudio();
  await generateTrack();
};

const cleanupAudio = async () => {
  await stopTransport();

  // Clean up any active sources or effects
  Tone.Transport.cancel();
  Tone.context.rawContext.resume();

  // Reset transport settings
  Tone.Transport.position = 0;
  Tone.Transport.loop = false;
};

// Event Listeners
const setupEventListeners = () => {
  elements.buttons.newTrack.addEventListener('click', newTrack);
  elements.buttons.play.addEventListener('click', startTransport);
  elements.buttons.offline.addEventListener('click', startOffline);

  window.addEventListener('beforeunload', async () => {
    await cleanupAudio();
    Tone.context.close(); // Only close context when unloading page
  });

  document.addEventListener('DOMContentLoaded', () => {
    window.onload = async () => {
      if (!window.Tone) {
        console.error('Tone.js failed to load');
        elements.bench.textContent = 'Error: Tone.js failed to load';
        return;
      }

      console.log('Tone.js is loaded');
      await Tone.start(); // Initialize Tone.js
      configureToneJs();
      generateTrack();
    };
  });
};

setupEventListeners();

const generateNewTrackOffline = async () => {
  // This function should return the chords and melody events, like the real generateNewTrack
  // but modified for offline rendering. For example:
  /* const chords = [
    { notes: ['C4', 'E4', 'G4'], duration: '1n', time: 0, velocity: 0.8 },
    { notes: ['F4', 'A4', 'C5'], duration: '1n', time: 1, velocity: 0.8 },
  ]; */

  const melody = [
    { note: 'C4', duration: '8n', time: 0, velocity: 0.7 },
    { note: 'D4', duration: '8n', time: 0.5, velocity: 0.7 },
  ];

  // Simulate other track details and return the events
  return { chords: null, melody };
};
