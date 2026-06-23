import { mod, noteIndex, noteName, unique } from "./notes.js";

export const CHORD_TYPES = [
  { id: "maj", label: "Major", suffix: "", formula: "1 3 5", intervals: [0, 4, 7], essential: [0, 4, 7] },
  { id: "min", label: "Minor", suffix: "m", formula: "1 b3 5", intervals: [0, 3, 7], essential: [0, 3, 7] },
  { id: "dim", label: "Diminished", suffix: "dim", formula: "1 b3 b5", intervals: [0, 3, 6], essential: [0, 3, 6] },
  { id: "aug", label: "Augmented", suffix: "aug", formula: "1 3 #5", intervals: [0, 4, 8], essential: [0, 4, 8] },
  { id: "sus2", label: "Sus2", suffix: "sus2", formula: "1 2 5", intervals: [0, 2, 7], essential: [0, 2, 7] },
  { id: "sus4", label: "Sus4", suffix: "sus4", formula: "1 4 5", intervals: [0, 5, 7], essential: [0, 5, 7] },
  { id: "maj6", label: "Major 6", suffix: "6", formula: "1 3 5 6", intervals: [0, 4, 7, 9], essential: [0, 4, 9] },
  { id: "min6", label: "Minor 6", suffix: "m6", formula: "1 b3 5 6", intervals: [0, 3, 7, 9], essential: [0, 3, 9] },
  { id: "dom7", label: "Dominant 7", suffix: "7", formula: "1 3 5 b7", intervals: [0, 4, 7, 10], essential: [0, 4, 10] },
  { id: "maj7", label: "Major 7", suffix: "maj7", formula: "1 3 5 7", intervals: [0, 4, 7, 11], essential: [0, 4, 11] },
  { id: "min7", label: "Minor 7", suffix: "m7", formula: "1 b3 5 b7", intervals: [0, 3, 7, 10], essential: [0, 3, 10] },
  { id: "mmaj7", label: "Minor major 7", suffix: "mMaj7", formula: "1 b3 5 7", intervals: [0, 3, 7, 11], essential: [0, 3, 11] },
  { id: "halfdim", label: "Half-diminished", suffix: "m7b5", formula: "1 b3 b5 b7", intervals: [0, 3, 6, 10], essential: [0, 3, 6, 10] },
  { id: "dim7", label: "Diminished 7", suffix: "dim7", formula: "1 b3 b5 bb7", intervals: [0, 3, 6, 9], essential: [0, 3, 6, 9] },
  { id: "add9", label: "Add 9", suffix: "add9", formula: "1 3 5 9", intervals: [0, 4, 7, 2], essential: [0, 4, 7, 2] },
  { id: "minadd9", label: "Minor add 9", suffix: "madd9", formula: "1 b3 5 9", intervals: [0, 3, 7, 2], essential: [0, 3, 7, 2] },
  { id: "nine", label: "9", suffix: "9", formula: "1 3 5 b7 9", intervals: [0, 4, 7, 10, 2], essential: [0, 4, 10, 2] },
  { id: "min9", label: "Minor 9", suffix: "m9", formula: "1 b3 5 b7 9", intervals: [0, 3, 7, 10, 2], essential: [0, 3, 10, 2] },
  { id: "maj9", label: "Major 9", suffix: "maj9", formula: "1 3 5 7 9", intervals: [0, 4, 7, 11, 2], essential: [0, 4, 11, 2] },
  { id: "sevenSus4", label: "7sus4", suffix: "7sus4", formula: "1 4 5 b7", intervals: [0, 5, 7, 10], essential: [0, 5, 10] },
  { id: "eleven", label: "11", suffix: "11", formula: "1 3 5 b7 9 11", intervals: [0, 4, 7, 10, 2, 5], essential: [0, 4, 10, 5] },
  { id: "thirteen", label: "13", suffix: "13", formula: "1 3 5 b7 9 13", intervals: [0, 4, 7, 10, 2, 9], essential: [0, 4, 10, 9] }
];

export const CHORD_BY_ID = Object.fromEntries(CHORD_TYPES.map((chord) => [chord.id, chord]));

export function chordNotes(root, chord) {
  return unique(chord.intervals.map((interval) => mod(root + interval)));
}

export function chordEssentialNotes(root, chord) {
  return unique((chord.essential || chord.intervals).map((interval) => mod(root + interval)));
}

export function chordLabel(root, typeId, accidentals = "sharp") {
  const chord = CHORD_BY_ID[typeId] || CHORD_BY_ID.maj;
  return noteName(root, accidentals) + chord.suffix;
}

export function parseChordSymbol(symbol) {
  const cleaned = String(symbol).trim().replace("Δ", "maj").replace("ø", "m7b5").replace("−", "m");
  const match = cleaned.match(/^([A-G](?:#|b)?)(.*)$/i);
  if (!match) return null;
  const root = noteIndex(match[1]);
  const suffix = match[2].trim();
  return { root, type: chordTypeFromSuffix(suffix), label: chordLabel(root, chordTypeFromSuffix(suffix)) };
}

export function chordTypeFromSuffix(suffix) {
  const s = String(suffix || "").trim();
  if (/^maj9|^M9/i.test(s)) return "maj9";
  if (/^maj7|^M7/i.test(s)) return "maj7";
  if (/m7b5|half/i.test(s)) return "halfdim";
  if (/dim7|°7/i.test(s)) return "dim7";
  if (/dim|°/i.test(s)) return "dim";
  if (/mMaj7|m\(maj7\)/i.test(s)) return "mmaj7";
  if (/m9/i.test(s)) return "min9";
  if (/^9/i.test(s)) return "nine";
  if (/m7/i.test(s)) return "min7";
  if (/^7sus4/i.test(s)) return "sevenSus4";
  if (/^7/i.test(s)) return "dom7";
  if (/m6/i.test(s)) return "min6";
  if (/^6/i.test(s)) return "maj6";
  if (/madd9/i.test(s)) return "minadd9";
  if (/add9/i.test(s)) return "add9";
  if (/sus2/i.test(s)) return "sus2";
  if (/sus4/i.test(s)) return "sus4";
  if (/aug|\+/i.test(s)) return "aug";
  if (/^13/i.test(s)) return "thirteen";
  if (/^11/i.test(s)) return "eleven";
  if (/m/i.test(s)) return "min";
  return "maj";
}
