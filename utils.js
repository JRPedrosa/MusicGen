export const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

export const getRandomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

export const getRandomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const transposeNotes = (input, semitoneShift) => {
  if (typeof input === 'string') {
    // For the key
    return Tone.Frequency(input).transpose(semitoneShift).toNote();
  }

  return input.map((item) => {
    if (item.note) {
      // For melody
      return {
        ...item,
        note: Tone.Frequency(item.note).transpose(semitoneShift).toNote(),
      };
    } else if (item.notes) {
      // For chords
      return {
        ...item,
        notes: item.notes.map((note) =>
          Tone.Frequency(note).transpose(semitoneShift).toNote(),
        ),
      };
    }
    return { ...item };
  });
};

export const appendTrackInfo = ({
  key,
  tempo,
  melodySynth,
  chords,
  kick,
  snare,
  hiHat,
  kickPattern,
  snarePattern,
  hiHatPattern,
}) => {
  document.getElementById('key').textContent = `key: ${key}`;
  document.getElementById('tempo').textContent = `BPM: ${tempo}`;
  document.getElementById(
    'melodySynth',
  ).textContent = `melodySynth: ${melodySynth}`;
  document.getElementById('chords').textContent = `chords: ${chords.map(
    (c) => c.name,
  )}`;
  document.getElementById('kick').textContent = `${kick} - ${kickPattern}`;
  document.getElementById('snare').textContent = `${snare} - ${snarePattern}`;
  document.getElementById('hiHat').textContent = `${hiHat} - ${hiHatPattern}`;
};
