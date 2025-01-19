let melodySynth;
let chordSynth;
let sequence;
let chordSequence;
let drumSequence;
let kick;
let snare;
let hiHat;

// Define chord progressions in C major
const chordsInC = {
  C: {
    I: ['C2', 'E2', 'C3', 'E3', 'G3', 'B3'], // C major
    ii: ['D2', 'A2', 'D3', 'F3', 'A3', 'C4'], // D minor
    iii: ['E2', 'B2', 'E3', 'G3', 'B3', 'D4'], // E minor
    IV: ['F2', 'C3', 'F3', 'A3', 'C4', 'E4'], // F major
    V: ['G2', 'D3', 'G3', 'B3', 'D4'], // G major
    vi: ['A2', 'E3', 'A3', 'G4', 'C4'], // A minor
    /* vii: ['B3', 'D4', 'F4'], // B diminished */
  },
};

function generateNewTrack() {
  if (sequence) sequence.dispose();
  if (chordSequence) chordSequence.dispose();
  if (drumSequence) drumSequence.dispose();

  const settings = {
    scale: [
      'C4',
      'D4',
      'E4',
      'F4',
      'G4',
      'A4',
      'B4',
      'C5',
      'D5',
      'E5',
      'F5',
      'G5',
    ],
    durations: ['4n', '2n', '4n'],
    tempo: Math.floor(Math.random() * 70) + 70,
    pattern: ['up', 'down', 'upDown', 'random'].sort(
      () => Math.random() - 0.5,
    )[0],
  };

  Tone.Transport.bpm.value = settings.tempo;

  // Melody synth setup
  const old = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.3,
      release: 1,
    },
  }).toDestination();

  const new1 = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: {
      attack: 0.05,
      decay: 0.4,
      sustain: 0.1,
      release: 0.3,
    },
  }).toDestination();

  melodySynth = Math.random() < 0.5 ? old : new1;

  // Chord synth setup - using a softer sound
  chordSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.4,
      release: 2,
    },
  }).toDestination();

  // Set volumes
  melodySynth.volume.value = -8;
  chordSynth.volume.value = -12; // Chords slightly quieter

  kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0 },
  }).toDestination();

  snare = new Tone.MembraneSynth({
    pitchDecay: 0.1,
    octaves: 3,
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.2 },
  }).toDestination();

  hiHat = new Tone.MetalSynth({
    frequency: 800,
    envelope: { attack: 0.01, decay: 0.1, sustain: 0 },
    harmonicity: 1.0,
    modulationIndex: 10,
  }).toDestination();
  hiHat.volume.value = -20;
  snare.volume.value = -20;
  kick.volume.value = -20;
  const drumPattern = [
    { time: '0:0', note: 'C1', synth: kick },
    { time: '0:2', note: 'C1', synth: kick },
    { time: '0:1', note: 'D1', synth: snare },
    { time: '0:3', note: 'D1', synth: snare },
    { time: '0:0', note: 'G2', synth: hiHat },
    { time: '0:2', note: 'G2', synth: hiHat },
    { time: '0:1', note: 'G2', synth: hiHat },
    { time: '0:3', note: 'G2', synth: hiHat },
  ];

  drumSequence = new Tone.Part((time, event) => {
    event.synth.triggerAttackRelease(event.note, '8n', time);
  }, drumPattern).start(0);

  // Add effects
  const reverb = new Tone.Reverb(2.5).toDestination();
  melodySynth.connect(reverb);
  chordSynth.connect(reverb);

  const commonProgressions = [
    ['I', 'vi', 'IV', 'V'],
    ['ii', 'V', 'I', 'vi'],
    ['vi', 'V', 'IV', 'V'],
    ['vi', 'IV', 'V', 'iii'],
    ['I', 'IV', 'V', 'IV'],
  ];

  // First, select one complete progression
  const selectedProgression = [
    ...commonProgressions[
      Math.floor(Math.random() * commonProgressions.length)
    ],
  ];
  console.log('Selected progression:', selectedProgression); // Debug log

  const chords = [];
  let chordTime = 0;

  // Now use the selected progression to create the chord sequence
  for (let i = 0; i < selectedProgression.length; i++) {
    const chordSymbol = selectedProgression[i];

    // Debug log to check each chord being added
    console.log(`Adding chord ${chordSymbol} at time ${chordTime}`);

    chords.push({
      time: chordTime,
      notes: chordsInC.C[chordSymbol],
      duration: '1n',
      name: chordSymbol,
    });

    chordTime += Tone.Time('1n').toSeconds();
  }

  console.log('chords', chords);

  function getClosestNoteInChord(lastNote, chord, scaleToUse) {
    let indexOfNote = scaleToUse.findIndex((ele) => ele === lastNote);
    const upOrDown = Math.random() < 0.5 ? -1 : 1;
    let finalIndex;
    console.log('## lastNote', lastNote);
    if (lastNote === undefined) {
      console.log('## lastNote 2', lastNote);
      finalIndex = 2;
      indexOfNote = 2;
    }

    if (Math.random() < 0.1) {
      console.log('### UNDEFINED PURPOSE');
      return undefined;
    }

    if (indexOfNote === -1 && lastNote !== undefined) {
      let newIndex = settings.scale.findIndex((ele) => ele === lastNote);
      if (newIndex === 0) {
        finalIndex = 1;
      } else if (newIndex === settings.scale.length - 1) {
        finalIndex = settings.scale.length - 2;
      } else {
        finalIndex = newIndex + upOrDown;
      }
      return settings.scale[finalIndex];
    } else {
      if (indexOfNote === 0) {
        finalIndex = 1;
      } else if (indexOfNote === scaleToUse.length - 1) {
        finalIndex = scaleToUse.length - 2;
      } else {
        finalIndex = indexOfNote + upOrDown;
      }
      return scaleToUse[finalIndex];
    }
  }
  let melodyTime = 0;
  const melody = [];
  const melodyLength = 32;
  let lastNoteWasOutOfChord = false;
  let lastNote;
  //   for (let i = 0; i <= melodyLength; i++) {
  while (melodyTime < chordTime * 2 - 2) {
    // Find the current chord based on the time
    const currentChordIndex =
      Math.floor(melodyTime / Tone.Time('1n').toSeconds()) % chords.length;
    const currentChord = chords[currentChordIndex].notes;

    // Filter the scale to only include notes that share the same first letter as the current chord's notes
    const filteredScaleNotesInChord = settings.scale.filter((note) => {
      const noteRoot = note.charAt(0); // Get the first letter of the note (C, D, E, etc.)
      return currentChord.some((chordNote) => chordNote.charAt(0) === noteRoot); // Check if the note's root matches the chord's root
    });

    let note;
    let isOutOfChord = false;
    console.log('---- --- currentChordIndex ---- --- -- ', currentChordIndex);
    console.log('lastNoteWasOutOfChord', lastNoteWasOutOfChord);
    if (!lastNoteWasOutOfChord && Math.random() < 0.5) {
      const filteredScaleNotesOutChord = settings.scale.filter((note) => {
        const noteRoot = note.charAt(0); // Get the first letter of the note (C, D, E, etc.)
        return currentChord.every(
          (chordNote) => chordNote.charAt(0) !== noteRoot,
        ); // Check if the note's root matches the chord's root
      });

      note = getClosestNoteInChord(
        lastNote,
        currentChord,
        filteredScaleNotesOutChord,
      );

      isOutOfChord = true;
    } else {
      // If the note is in the chord or we are continuing the chord, pick a note from the chord
      //   note = currentChord[Math.floor(Math.random() * currentChord.length)];

      if (lastNoteWasOutOfChord || Math.random() < 0.8) {
        note = getClosestNoteInChord(
          lastNote,
          currentChord,
          filteredScaleNotesInChord,
        );
      } else {
        note =
          filteredScaleNotesInChord[
            Math.floor(Math.random() * filteredScaleNotesInChord.length)
          ];
      }

      isOutOfChord = false;
      lastNoteWasOutOfChord = false;
    }

    const duration = isOutOfChord
      ? '8n'
      : settings.durations[
          Math.floor(Math.random() * settings.durations.length)
        ];

    melody.push({
      time: melodyTime,
      note: note,
      duration: duration,
    });

    console.log(currentChord);
    console.log('note', note);
    console.log('isOutOfChord', isOutOfChord);
    console.log('duration', duration);

    if (isOutOfChord) {
      console.log('setting lastNoteWasOutOfChord to true');
      lastNoteWasOutOfChord = true;
    }

    // Advance time by the actual duration of the note
    melodyTime += Tone.Time(duration).toSeconds();
    lastNote = note;
  }

  console.log('melodyTime', melodyTime);
  console.log('chordTime', chordTime);
  console.log(chords.map((c) => c.name));
  console.log('melody', melody);

  // Create sequences
  sequence = new Tone.Part((time, event) => {
    const velocity = Math.random() * 0.5 + 0.5;
    melodySynth.triggerAttackRelease(
      event.note,
      event.duration,
      time,
      velocity,
    );
  }, melody).start(0);

  chordSequence = new Tone.Part((time, event) => {
    chordSynth.triggerAttackRelease(event.notes, event.duration, time, 0.3);
  }, chords).start(0);

  // Set loop points
  sequence.loop = true;
  chordSequence.loop = true;
  drumSequence.loop = true;
  const timeToAdd = chordTime - (melodyTime % chordTime);

  // Adjust melodyTime to the nearest multiple of chordTime
  const adjustedMelodyTime = melodyTime + timeToAdd;
  // Set loop lengths in seconds
  sequence.loopEnd = adjustedMelodyTime; // Loop length matches our generated melody
  chordSequence.loopEnd = chordTime; // Loop length matches our chord progression

  console.log('New track generated:', settings);
}

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
