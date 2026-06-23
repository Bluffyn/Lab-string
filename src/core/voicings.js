import { midiToNoteIndex, mod, noteName, unique } from "./notes.js";

export function generateVoicings(instrument, notes, root, options = {}) {
  const order = options.courseOrder || instrument.lowToHigh;
  const maxFret = options.maxFret ?? instrument.maxFret;
  const minStart = options.minStart ?? 0;
  const maxStart = options.maxStart ?? Math.max(0, maxFret - 3);
  const windowSize = options.windowSize ?? 4;
  const required = new Set(options.requiredNotes || notes);
  const noteSet = new Set(notes);
  const candidates = [];

  for (let start = minStart; start <= maxStart; start += 1) {
    const end = Math.min(start + windowSize, maxFret);
    const choices = order.map((stringIndex) => {
      const values = options.threeCourse ? [] : [null];
      for (let fret = start; fret <= end; fret += 1) {
        if (noteSet.has(midiToNoteIndex(instrument.strings[stringIndex].midi + fret))) values.push(fret);
      }
      return values.slice(0, 5);
    });
    walk(choices, 0, [], (shape) => {
      const fretted = shape.filter((fret) => fret !== null);
      if (fretted.length < Math.min(3, required.size)) return;
      if (options.threeCourse && fretted.length !== order.length) return;
      const positions = shape.flatMap((fret, lowIndex) => (fret === null ? [] : [{ stringIndex: order[lowIndex], fret }]));
      const covered = new Set(positions.map((position) => midiToNoteIndex(instrument.strings[position.stringIndex].midi + position.fret)));
      if (![...required].every((note) => covered.has(note))) return;
      if (options.requireRoot !== false && options.threeCourse && !covered.has(root)) return;
      const minFret = Math.min(...fretted);
      const maxUsedFret = Math.max(...fretted);
      const spread = maxUsedFret - minFret;
      if (spread > (options.maxStretch ?? 5)) return;
      const mutedCount = order.length - fretted.length;
      const lowest = positions[0];
      const hasRootBass = lowest && midiToNoteIndex(instrument.strings[lowest.stringIndex].midi + lowest.fret) === root;
      const openBonus = fretted.includes(0) ? -0.45 : 0;
      const awkwardPenalty = isolatedHighPenalty(fretted);
      const score = spread * 1.2 + mutedCount * 2 + (hasRootBass ? 0 : 0.9) + minFret * 0.06 + awkwardPenalty + openBonus;
      candidates.push({ lowToHigh: [...shape], positions, courseOrder: order, covered: [...covered], minFret, maxFret: maxUsedFret, score });
    });
  }

  return candidates
    .sort((a, b) => a.score - b.score)
    .filter((candidate, index, all) => all.findIndex((other) => other.lowToHigh.join("-") === candidate.lowToHigh.join("-")) === index);
}

export function groupVoicings(instrument, notes, root, groups, options = {}) {
  return groups.map((group) => {
    const groupOptions = {
      ...options,
      courseOrder: group.courseOrder || instrument.lowToHigh,
      threeCourse: group.threeCourse,
      minStart: group.min ?? 0,
      maxStart: group.max ?? instrument.maxFret,
      requiredNotes: group.threeCourse && notes.length <= 3 ? notes : options.requiredNotes || notes,
      maxStretch: group.compact ? 3 : options.maxStretch,
      windowSize: group.compact ? 3 : options.windowSize
    };
    const voicings = generateVoicings(instrument, notes, root, groupOptions).filter((voicing) => {
      if (group.min === undefined) return true;
      return voicing.minFret >= group.min && voicing.minFret <= group.max;
    });
    return { group, voicings: voicings.slice(0, group.limit || 6) };
  });
}

export function voicingNoteNames(instrument, voicing, accidentals = "sharp") {
  return voicing.lowToHigh.map((fret, lowIndex) => {
    if (fret === null) return "x";
    const stringIndex = voicing.courseOrder[lowIndex];
    return noteName(midiToNoteIndex(instrument.strings[stringIndex].midi + fret), accidentals);
  });
}

export function inversionName(instrument, voicing, root) {
  const lowest = voicing.positions[0];
  if (!lowest) return "Muted";
  const bass = midiToNoteIndex(instrument.strings[lowest.stringIndex].midi + lowest.fret);
  const interval = mod(bass - root);
  if (interval === 0) return "Root position";
  if (interval === 3 || interval === 4) return "First inversion";
  if (interval === 6 || interval === 7 || interval === 8) return "Second inversion";
  if (interval === 9 || interval === 10 || interval === 11) return "Third inversion";
  return "Color bass";
}

export function nearbyVoicings(instrument, notes, root, centerFret, count = 8, options = {}) {
  return generateVoicings(instrument, notes, root, {
    minStart: Math.max(0, centerFret - 3),
    maxStart: Math.min(instrument.maxFret, centerFret + 3),
    requiredNotes: options.requiredNotes || notes,
    requireRoot: options.requireRoot
  }).slice(0, count);
}

function walk(options, index, current, emit) {
  if (index === options.length) {
    emit(current);
    return;
  }
  options[index].forEach((value) => {
    current.push(value);
    walk(options, index + 1, current, emit);
    current.pop();
  });
}

function isolatedHighPenalty(frets) {
  const fretted = frets.filter((fret) => fret !== null && fret > 0);
  if (fretted.length < 2) return 0;
  const max = Math.max(...fretted);
  const others = fretted.filter((fret) => fret !== max);
  return max - Math.max(...others) > 5 ? 3 : 0;
}
