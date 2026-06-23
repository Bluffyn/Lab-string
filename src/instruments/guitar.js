export const guitar = {
  id: "guitar",
  label: "Guitar",
  maxFret: 24,
  stringLabel: "String",
  strings: [
    { name: "E", label: "E4", midi: 64, gauge: 1 },
    { name: "B", label: "B3", midi: 59, gauge: 1.5 },
    { name: "G", label: "G3", midi: 55, gauge: 2 },
    { name: "D", label: "D3", midi: 50, gauge: 2.7 },
    { name: "A", label: "A2", midi: 45, gauge: 3.4 },
    { name: "E", label: "E2", midi: 40, gauge: 4.2 }
  ],
  lowToHigh: [5, 4, 3, 2, 1, 0],
  markerFrets: [3, 5, 7, 9, 15, 17, 19, 21],
  doubleMarkerFrets: [12, 24],
  voicingGroups: [
    { id: "low", title: "Low / open", detail: "Lowest fret 0-4", min: 0, max: 4, limit: 4 },
    { id: "middle", title: "Middle neck", detail: "Lowest fret 5-8", min: 5, max: 8, limit: 4 },
    { id: "upper", title: "Upper neck", detail: "Lowest fret 9-12", min: 9, max: 12, limit: 4 },
    { id: "high", title: "High register", detail: "Lowest fret 13-24", min: 13, max: 24, limit: 4 }
  ]
};

export const OPEN_GUITAR_CHORDS = [
  { name: "C", root: 0, type: "maj", frets: [null, 3, 2, 0, 1, 0] },
  { name: "A", root: 9, type: "maj", frets: [null, 0, 2, 2, 2, 0] },
  { name: "G", root: 7, type: "maj", frets: [3, 2, 0, 0, 0, 3] },
  { name: "E", root: 4, type: "maj", frets: [0, 2, 2, 1, 0, 0] },
  { name: "D", root: 2, type: "maj", frets: [null, null, 0, 2, 3, 2] },
  { name: "Am", root: 9, type: "min", frets: [null, 0, 2, 2, 1, 0] },
  { name: "Em", root: 4, type: "min", frets: [0, 2, 2, 0, 0, 0] },
  { name: "Dm", root: 2, type: "min", frets: [null, null, 0, 2, 3, 1] },
  { name: "A7", root: 9, type: "dom7", frets: [null, 0, 2, 0, 2, 0] },
  { name: "E7", root: 4, type: "dom7", frets: [0, 2, 0, 1, 0, 0] },
  { name: "D7", root: 2, type: "dom7", frets: [null, null, 0, 2, 1, 2] },
  { name: "G7", root: 7, type: "dom7", frets: [3, 2, 0, 0, 0, 1] },
  { name: "Cmaj7", root: 0, type: "maj7", frets: [null, 3, 2, 0, 0, 0] }
];

export const CAGED_SHAPES = [
  { id: "C", label: "C shape", baseRoot: 0, frets: [null, 3, 2, 0, 1, 0], windowBefore: 1 },
  { id: "A", label: "A shape", baseRoot: 9, frets: [null, 0, 2, 2, 2, 0], windowBefore: 0 },
  { id: "G", label: "G shape", baseRoot: 7, frets: [3, 2, 0, 0, 0, 3], windowBefore: 1 },
  { id: "E", label: "E shape", baseRoot: 4, frets: [0, 2, 2, 1, 0, 0], windowBefore: 0 },
  { id: "D", label: "D shape", baseRoot: 2, frets: [null, null, 0, 2, 3, 2], windowBefore: 1 }
];
