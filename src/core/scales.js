import { mod, noteName } from "./notes.js";

export const SCALE_TYPES = [
  { id: "ionian", label: "Major / Ionian", formula: "1 2 3 4 5 6 7", intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: "lydian", label: "Lydian", formula: "1 2 3 #4 5 6 7", intervals: [0, 2, 4, 6, 7, 9, 11] },
  { id: "mixolydian", label: "Mixolydian", formula: "1 2 3 4 5 6 b7", intervals: [0, 2, 4, 5, 7, 9, 10] },
  { id: "dorian", label: "Dorian", formula: "1 2 b3 4 5 6 b7", intervals: [0, 2, 3, 5, 7, 9, 10] },
  { id: "aeolian", label: "Natural minor / Aeolian", formula: "1 2 b3 4 5 b6 b7", intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: "melodicMinor", label: "Melodic minor", formula: "1 2 b3 4 5 6 7", intervals: [0, 2, 3, 5, 7, 9, 11] },
  { id: "harmonicMinor", label: "Harmonic minor", formula: "1 2 b3 4 5 b6 7", intervals: [0, 2, 3, 5, 7, 8, 11] },
  { id: "phrygianDominant", label: "Phrygian dominant", formula: "1 b2 3 4 5 b6 b7", intervals: [0, 1, 4, 5, 7, 8, 10] },
  { id: "locrian", label: "Locrian", formula: "1 b2 b3 4 b5 b6 b7", intervals: [0, 1, 3, 5, 6, 8, 10] },
  { id: "locrianNat2", label: "Locrian natural 2", formula: "1 2 b3 4 b5 b6 b7", intervals: [0, 2, 3, 5, 6, 8, 10] },
  { id: "majorPent", label: "Major pentatonic", formula: "1 2 3 5 6", intervals: [0, 2, 4, 7, 9] },
  { id: "minorPent", label: "Minor pentatonic", formula: "1 b3 4 5 b7", intervals: [0, 3, 5, 7, 10] },
  { id: "dominantPent", label: "Dominant pentatonic", formula: "1 3 4 5 b7", intervals: [0, 4, 5, 7, 10] },
  { id: "majorBlues", label: "Major blues", formula: "1 2 b3 3 5 6", intervals: [0, 2, 3, 4, 7, 9] },
  { id: "minorBlues", label: "Blues", formula: "1 b3 4 b5 5 b7", intervals: [0, 3, 5, 6, 7, 10] },
  { id: "dimWH", label: "Diminished whole-half", formula: "1 2 b3 4 b5 b6 6 7", intervals: [0, 2, 3, 5, 6, 8, 9, 11] },
  { id: "dimHW", label: "Diminished half-whole", formula: "1 b2 b3 3 b5 5 6 b7", intervals: [0, 1, 3, 4, 6, 7, 9, 10] },
  { id: "susPent", label: "Suspended pentatonic", formula: "1 2 4 5 b7", intervals: [0, 2, 5, 7, 10] },
  { id: "mixolydianSus", label: "Mixolydian sus", formula: "1 2 4 5 6 b7", intervals: [0, 2, 5, 7, 9, 10] }
];

export const SCALE_BY_ID = Object.fromEntries(SCALE_TYPES.map((scale) => [scale.id, scale]));

export function scaleNotes(root, scale) {
  return scale.intervals.map((interval) => mod(root + interval));
}

export function scaleNoteNames(root, scale, accidentals = "sharp") {
  return scaleNotes(root, scale).map((note) => noteName(note, accidentals));
}
