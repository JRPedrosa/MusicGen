export const bufferToWav = (buffer, context) => {
  const numOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;

  // Create a new AudioBuffer for the WAV data
  const wavBuffer = context.createBuffer(numOfChannels, length, sampleRate);

  // Copy the audio data
  for (let channel = 0; channel < numOfChannels; channel++) {
    wavBuffer.copyToChannel(buffer.getChannelData(channel), channel);
  }

  // Encode the AudioBuffer into WAV format
  const wavEncoder = new WaveEncoder(wavBuffer);
  return wavEncoder.encode();
};

class WaveEncoder {
  constructor(audioBuffer) {
    this.audioBuffer = audioBuffer;
    this.gainValue = 1; // Default gain boost
    this.normalize = true; // Enable normalization by default
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

    // Process and write the audio data with volume adjustment
    let offset = 44;
    let maxSample = 0;

    if (this.normalize) {
      for (let channel = 0; channel < channels; channel++) {
        const channelData = this.audioBuffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          maxSample = Math.max(maxSample, Math.abs(channelData[i]));
        }
      }
    }

    // Calculate normalization factor
    const normalizeGain = this.normalize ? (1 / maxSample) * 0.5 : 1; // 0.9 to leave headroom
    const totalGain = normalizeGain * this.gainValue;

    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < channels; channel++) {
        const sample = this.audioBuffer.getChannelData(channel)[i];
        const adjustedSample = Math.max(-1, Math.min(1, sample * totalGain));
        view.setInt16(offset, adjustedSample * 32767, true);
        offset += 2;
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
