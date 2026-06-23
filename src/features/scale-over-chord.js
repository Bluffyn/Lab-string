import { CHORD_BY_ID, chordNotes } from "../core/chords.js";
import { noteName, intervalLabel } from "../core/notes.js";
import { SCALE_BY_ID, scaleNotes } from "../core/scales.js";

const RULES = {
  maj: ["ionian", "lydian", "majorPent"],
  maj6: ["ionian", "lydian", "majorPent"],
  maj7: ["ionian", "lydian", "majorPent"],
  dom7: ["mixolydian", "dominantPent", "minorBlues", "dimHW"],
  nine: ["mixolydian", "dominantPent", "minorBlues", "dimHW"],
  min: ["dorian", "aeolian", "minorPent", "minorBlues"],
  min7: ["dorian", "aeolian", "minorPent", "minorBlues"],
  min9: ["dorian", "aeolian", "minorPent", "minorBlues"],
  min6: ["dorian", "melodicMinor"],
  mmaj7: ["melodicMinor"],
  halfdim: ["locrian", "locrianNat2"],
  dim7: ["dimWH"],
  sus2: ["susPent", "mixolydianSus"],
  sus4: ["susPent", "mixolydianSus"],
  sevenSus4: ["susPent", "mixolydianSus"],
  dim: ["locrian"],
  aug: ["lydian"],
  add9: ["ionian", "majorPent"],
  minadd9: ["dorian", "minorPent"],
  maj9: ["ionian", "lydian"]
};

export function recommendScalesForChord(chordDescriptor, context = {}) {
  const chord = CHORD_BY_ID[chordDescriptor.type] || CHORD_BY_ID.maj;
  const chordToneIndexes = chordNotes(chordDescriptor.root, chord);
  let scaleIds = [...(RULES[chordDescriptor.type] || ["ionian"])];

  if (/blues/i.test(context.genre || "")) {
    if (chordDescriptor.type === "dom7" || chordDescriptor.type === "nine") scaleIds = ["mixolydian", "majorBlues", "minorBlues", "dominantPent"];
    if (chordDescriptor.type === "min" || chordDescriptor.type === "min7") scaleIds = ["minorBlues", "minorPent", "dorian"];
  }
  if (context.minorKey && chordDescriptor.type === "dom7" && chordDescriptor.numeral && /V/.test(chordDescriptor.numeral)) {
    scaleIds.push("phrygianDominant");
  }
  if (context.difficulty === "Beginner") scaleIds = scaleIds.filter((id) => !["dimHW", "dimWH", "locrianNat2", "phrygianDominant"].includes(id));
  if (context.difficulty === "Advanced" && chordDescriptor.type === "dom7") scaleIds.push("dimHW");

  const uniqueIds = Array.from(new Set(scaleIds)).filter((id) => SCALE_BY_ID[id]);
  return uniqueIds.map((scaleId, index) => {
    const scale = SCALE_BY_ID[scaleId];
    const scaleToneIndexes = scaleNotes(chordDescriptor.root, scale);
    const targets = targetIntervals(chordDescriptor.type, chord).map((interval) => ({
      interval,
      label: intervalLabel(interval),
      note: noteName(chordDescriptor.root + interval)
    }));
    return {
      chord: chordDescriptor.label,
      roman: chordDescriptor.numeral || "",
      chordTones: chordToneIndexes.map((note) => noteName(note)),
      scale: scale.label,
      scaleId,
      priority: index === 0 ? "Primary" : index < 3 ? "Option" : "Advanced",
      why: whyScaleWorks(chordDescriptor.type, scaleId),
      targetTones: targets,
      emphasize: targets.slice(0, 3).map((tone) => tone.note),
      warning: warningFor(scaleId, chordDescriptor.type),
      scaleTones: scaleToneIndexes.map((note) => noteName(note))
    };
  });
}

export function recommendationsForProgression(chords, context = {}) {
  return chords.map((chord) => ({
    chord,
    recommendations: recommendScalesForChord(chord, context)
  }));
}

function targetIntervals(type, chord) {
  if (["dom7", "nine", "min7", "min9", "maj7", "maj9", "mmaj7", "halfdim"].includes(type)) {
    return chord.intervals.filter((interval) => [0, 3, 4, 10, 11, 6].includes(interval));
  }
  return chord.intervals.slice(0, 3);
}

function whyScaleWorks(type, scaleId) {
  if (scaleId.includes("Blues")) return "Blues color over the chord; keep chord tones as landing notes.";
  if (scaleId === "majorPent" || scaleId === "minorPent" || scaleId === "dominantPent") return "Lean, easy-to-hear tones with fewer avoid notes.";
  if (scaleId === "dimHW" || scaleId === "dimWH") return "Adds tension for dominant or diminished movement.";
  if (scaleId === "lydian") return "Major color with a brighter #4.";
  if (scaleId === "dorian") return "Minor sound with a strong natural 6.";
  if (scaleId === "locrian" || scaleId === "locrianNat2") return "Matches the b5 sound; resolve carefully.";
  if (scaleId === "phrygianDominant") return "Harmonic minor dominant color for a stronger pull to minor.";
  if (type.includes("sus")) return "Keeps the third out of the way and supports the suspended sound.";
  return "Contains the chord tones and gives stable passing notes.";
}

function warningFor(scaleId, type) {
  if (scaleId === "lydian") return "#4 is bright; resolve it with intent.";
  if (scaleId === "dimHW" || scaleId === "dimWH") return "Tense color; use short phrases first.";
  if (scaleId === "locrian" || scaleId === "locrianNat2") return "b5 wants careful resolution.";
  if (type === "dom7" && scaleId === "minorBlues") return "Minor third against major third is gritty.";
  return "";
}
