export const elements = {
  warning: document.querySelector('.warning'),
  offline: document.getElementById('offlineGen'),
  loading: document.getElementById('loading'),
  loadingMessage: document.getElementById('loadingMessage'),
  outOfChordSlider: document.getElementById('outOfChord'),
  closestNoteSlider: document.getElementById('closestNote'),
  restSlider: document.getElementById('rest'),
  outOfChordValue: document.getElementById('outOfChordValue'),
  closestNoteValue: document.getElementById('closestNoteValue'),
  restValue: document.getElementById('restValue'),
  timeToGenerate: document.getElementById('timeToGenerate'),
};

export const PROBABILITIES = {
  /* OUT_OF_CHORD: parseFloat(elements.outOfChordSlider.value),
  CLOSEST_NOTE: parseFloat(elements.closestNoteSlider.value),
  REST: parseFloat(elements.restSlider.value), */
};
