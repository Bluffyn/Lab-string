export const NOTE_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const NOTE_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const DEGREE_LABELS = {
  0: "1",
  1: "b2",
  2: "2",
  3: "b3",
  4: "3",
  5: "4",
  6: "b5",
  7: "5",
  8: "b6",
  9: "6",
  10: "b7",
  11: "7"
};

export function mod(value, base = 12) {
  return ((value % base) + base) % base;
}

export function noteName(index, accidentals = "sharp") {
  return (accidentals === "flat" ? NOTE_FLAT : NOTE_SHARP)[mod(index)];
}

export function noteIndex(name) {
  const normalized = String(name).trim().replace("♭", "b").replace("♯", "#");
  const sharpIndex = NOTE_SHARP.findIndex((note) => note.toLowerCase() === normalized.toLowerCase());
  if (sharpIndex >= 0) return sharpIndex;
  const flatIndex = NOTE_FLAT.findIndex((note) => note.toLowerCase() === normalized.toLowerCase());
  return flatIndex >= 0 ? flatIndex : null;
}

export function midiToNoteIndex(midi) {
  return mod(midi);
}

export function intervalLabel(interval) {
  return DEGREE_LABELS[mod(interval)] || String(interval);
}

export function unique(values) {
  return Array.from(new Set(values));
}

export function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function randomItem(values) {
  return values[Math.floor(Math.random() * values.length)];
}

export function sortedNumbers(values) {
  return Array.from(values).sort((a, b) => a - b);
}
