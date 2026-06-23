import { mod, noteName } from "./notes.js";
import { CHORD_BY_ID, chordLabel } from "./chords.js";

export const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
export const ROMAN_DEGREES = { I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6 };

export const PROGRESSION_SETS = [
  {
    genre: "Blues",
    progressions: [
      { name: "12-bar blues", numerals: ["I7", "I7", "I7", "I7", "IV7", "IV7", "I7", "I7", "V7", "IV7", "I7", "V7"], cue: "One chord per bar. Aim for clean changes before fills." },
      { name: "Quick-change blues", numerals: ["I7", "IV7", "I7", "I7", "IV7", "IV7", "I7", "I7", "V7", "IV7", "I7", "V7"], cue: "Hear the early IV in bar 2." },
      { name: "Minor blues", numerals: ["i7", "i7", "i7", "i7", "iv7", "iv7", "i7", "i7", "bVI7", "V7", "i7", "V7"], cue: "Keep the tonic minor dark; make the V7 clear." }
    ]
  },
  {
    genre: "Rock",
    progressions: [
      { name: "I-V-vi-IV", numerals: ["I", "V", "vi", "IV"], cue: "Start with even downstrokes, then add accents." },
      { name: "vi-IV-I-V", numerals: ["vi", "IV", "I", "V"], cue: "Listen for the lift into I." },
      { name: "I-bVII-IV", numerals: ["I", "bVII", "IV", "I"], cue: "Keep the flat VII punchy." }
    ]
  },
  {
    genre: "Reggae",
    progressions: [
      { name: "One-drop major", numerals: ["I", "V", "vi", "IV"], cue: "Short offbeat stabs." },
      { name: "Minor skank", numerals: ["i", "bVII", "bVI", "V"], cue: "Clip every chord and leave space." },
      { name: "Lovers rock", numerals: ["Imaj7", "vi7", "IVmaj7", "V7"], cue: "Light voicings, steady pulse." }
    ]
  },
  {
    genre: "Ska",
    progressions: [
      { name: "Upstroke I-IV-V", numerals: ["I", "IV", "V", "IV"], cue: "Short upstrokes on the offbeats." },
      { name: "Ska turnaround", numerals: ["I", "vi", "ii", "V"], cue: "Keep it bright and clipped." }
    ]
  },
  {
    genre: "Jazz",
    progressions: [
      { name: "Major ii-V-I", numerals: ["ii7", "V7", "Imaj7"], cue: "Target 3rds and 7ths." },
      { name: "Rhythm changes A", numerals: ["Imaj7", "vi7", "ii7", "V7"], cue: "Loop until the voice-leading feels automatic." },
      { name: "Minor ii-V-i", numerals: ["iiø7", "V7", "i7"], cue: "Aim for smooth half-step movement into minor." },
      { name: "Backdoor cadence", numerals: ["IVmaj7", "bVII7", "Imaj7", "Imaj7"], cue: "Hear bVII7 soften into I." }
    ]
  },
  {
    genre: "Funk",
    progressions: [
      { name: "Dominant vamp", numerals: ["I7", "IV7", "I7", "IV7"], cue: "Mute tightly between stabs." },
      { name: "Minor groove", numerals: ["i7", "iv7", "i7", "bVII7"], cue: "Keep the fretting hand relaxed." },
      { name: "Soul lift", numerals: ["Imaj7", "iii7", "vi7", "IVmaj7"], cue: "Use small upper-string fragments." }
    ]
  }
];

export function romanToChordDescriptor(numeral, key) {
  const match = String(numeral).match(/^([b#]*)([ivIV]+)(.*)$/);
  if (!match) return { numeral, root: key, type: "maj", label: String(numeral) };
  const accidentalText = match[1];
  const roman = match[2];
  const suffix = match[3] || "";
  const degree = ROMAN_DEGREES[roman.toUpperCase()];
  const accidental = accidentalText.split("").reduce((total, mark) => total + (mark === "#" ? 1 : -1), 0);
  const root = mod(key + MAJOR_SCALE_INTERVALS[degree] + accidental);
  const type = chordTypeForRoman(roman, suffix);
  return { numeral, root, type, label: chordLabel(root, type) };
}

export function transposeProgression(numerals, key) {
  return numerals.map((numeral) => romanToChordDescriptor(numeral, key));
}

function chordTypeForRoman(roman, suffix) {
  const lower = roman === roman.toLowerCase();
  if (/maj9/i.test(suffix)) return "maj9";
  if (/maj7/i.test(suffix)) return "maj7";
  if (/ø|m7b5/i.test(suffix)) return "halfdim";
  if (/°|dim/i.test(suffix)) return /7/.test(suffix) ? "dim7" : "dim";
  if (/13/.test(suffix)) return "thirteen";
  if (/11/.test(suffix)) return "eleven";
  if (/9/.test(suffix)) return lower ? "min9" : "nine";
  if (/7/.test(suffix)) return lower ? "min7" : "dom7";
  if (/6/.test(suffix)) return lower ? "min6" : "maj6";
  if (/sus4/i.test(suffix)) return "sus4";
  if (/sus2/i.test(suffix)) return "sus2";
  if (/m/i.test(suffix)) return "min";
  return lower ? "min" : "maj";
}
