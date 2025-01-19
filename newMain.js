let scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

let note = 'v4';
function getClosestNoteInChord(lastNote, chord, scaleToUse) {
  let indexOfNote = scaleToUse.findIndex((ele) => ele === lastNote);
  const upOrDown = Math.random() < 0.5 ? -1 : 1;
  if (indexOfNote === -1) {
    let newIndex = settings.scale.findIndex((ele) => ele === lastNote);
    note = scale[newIndex + upOrDown];
  } else {
    note = scaleToUse[indexOfNote + upOrDown];
  }
}
getClosestNoteInChord(note, null, scale);
