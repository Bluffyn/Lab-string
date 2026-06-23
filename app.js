/* Generated fallback bundle for file:// Chrome use. Edit src/ modules, then regenerate. */
(function () {

/* src/core/notes.js */
const NOTE_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const DEGREE_LABELS = {
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

function mod(value, base = 12) {
  return ((value % base) + base) % base;
}

function noteName(index, accidentals = "sharp") {
  return (accidentals === "flat" ? NOTE_FLAT : NOTE_SHARP)[mod(index)];
}

function noteIndex(name) {
  const normalized = String(name).trim().replace("♭", "b").replace("♯", "#");
  const sharpIndex = NOTE_SHARP.findIndex((note) => note.toLowerCase() === normalized.toLowerCase());
  if (sharpIndex >= 0) return sharpIndex;
  const flatIndex = NOTE_FLAT.findIndex((note) => note.toLowerCase() === normalized.toLowerCase());
  return flatIndex >= 0 ? flatIndex : null;
}

function midiToNoteIndex(midi) {
  return mod(midi);
}

function intervalLabel(interval) {
  return DEGREE_LABELS[mod(interval)] || String(interval);
}

function unique(values) {
  return Array.from(new Set(values));
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function randomItem(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function sortedNumbers(values) {
  return Array.from(values).sort((a, b) => a - b);
}

/* src/core/chords.js */
const CHORD_TYPES = [
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

const CHORD_BY_ID = Object.fromEntries(CHORD_TYPES.map((chord) => [chord.id, chord]));

function chordNotes(root, chord) {
  return unique(chord.intervals.map((interval) => mod(root + interval)));
}

function chordEssentialNotes(root, chord) {
  return unique((chord.essential || chord.intervals).map((interval) => mod(root + interval)));
}

function chordLabel(root, typeId, accidentals = "sharp") {
  const chord = CHORD_BY_ID[typeId] || CHORD_BY_ID.maj;
  return noteName(root, accidentals) + chord.suffix;
}

function parseChordSymbol(symbol) {
  const cleaned = String(symbol).trim().replace("Δ", "maj").replace("ø", "m7b5").replace("−", "m");
  const match = cleaned.match(/^([A-G](?:#|b)?)(.*)$/i);
  if (!match) return null;
  const root = noteIndex(match[1]);
  const suffix = match[2].trim();
  return { root, type: chordTypeFromSuffix(suffix), label: chordLabel(root, chordTypeFromSuffix(suffix)) };
}

function chordTypeFromSuffix(suffix) {
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

/* src/core/scales.js */
const SCALE_TYPES = [
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

const SCALE_BY_ID = Object.fromEntries(SCALE_TYPES.map((scale) => [scale.id, scale]));

function scaleNotes(root, scale) {
  return scale.intervals.map((interval) => mod(root + interval));
}

function scaleNoteNames(root, scale, accidentals = "sharp") {
  return scaleNotes(root, scale).map((note) => noteName(note, accidentals));
}

/* src/core/roman-numerals.js */
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const ROMAN_DEGREES = { I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6 };

const PROGRESSION_SETS = [
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

function romanToChordDescriptor(numeral, key) {
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

function transposeProgression(numerals, key) {
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

/* src/core/voicings.js */
function generateVoicings(instrument, notes, root, options = {}) {
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

function groupVoicings(instrument, notes, root, groups, options = {}) {
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

function voicingNoteNames(instrument, voicing, accidentals = "sharp") {
  return voicing.lowToHigh.map((fret, lowIndex) => {
    if (fret === null) return "x";
    const stringIndex = voicing.courseOrder[lowIndex];
    return noteName(midiToNoteIndex(instrument.strings[stringIndex].midi + fret), accidentals);
  });
}

function inversionName(instrument, voicing, root) {
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

function nearbyVoicings(instrument, notes, root, centerFret, count = 8, options = {}) {
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

/* src/core/storage.js */
const STORAGE_KEY = "stringLab.progress.v1";
const STORAGE_DB = "stringLab.pwa.v1";
const STORE = "kv";

const DEFAULT_PROGRESS = {
  score: 0,
  streak: 0,
  completedExercises: {},
  lastExerciseIds: [],
  lastPracticedDate: null
};

function createAppStorage() {
  return openDb()
    .then((db) => createDbStorage(db))
    .catch(() => createLocalStorageAdapter());
}

function loadProgress() {
  return readLegacyProgress();
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function createDbStorage(db) {
  async function get(key, defaultValue = null) {
    return new Promise((resolve, reject) => {
      const request = tx(db, "readonly").get(key);
      request.onsuccess = () => resolve(request.result?.value ?? defaultValue);
      request.onerror = () => reject(request.error);
    });
  }

  async function set(key, value) {
    return new Promise((resolve, reject) => {
      const request = tx(db, "readwrite").put({ key, value });
      request.onsuccess = () => resolve(value);
      request.onerror = () => reject(request.error);
    });
  }

  async function remove(key) {
    return new Promise((resolve, reject) => {
      const request = tx(db, "readwrite").delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  return createStorageApi({ get, set, remove, engine: "indexedDB" });
}

function createLocalStorageAdapter() {
  async function get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(storageKey(key));
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  async function set(key, value) {
    localStorage.setItem(storageKey(key), JSON.stringify(value));
    return value;
  }

  async function remove(key) {
    localStorage.removeItem(storageKey(key));
  }

  return createStorageApi({ get, set, remove, engine: "localStorage" });
}

function createStorageApi(adapter) {
  return {
    engine: adapter.engine,
    getSetting: async (key, defaultValue = null) => {
      const settings = await adapter.get("settings", {});
      return settings[key] ?? defaultValue;
    },
    setSetting: async (key, value) => {
      const settings = await adapter.get("settings", {});
      settings[key] = value;
      await adapter.set("settings", settings);
      return value;
    },
    loadProgress: async () => {
      const progress = await adapter.get("progress", null);
      if (progress) return { ...DEFAULT_PROGRESS, ...progress };
      const legacy = readLegacyProgress();
      await adapter.set("progress", legacy);
      return legacy;
    },
    saveProgress: async (progress) => {
      const merged = { ...DEFAULT_PROGRESS, ...progress };
      await adapter.set("progress", merged);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    },
    savePracticePlan: async (plan) => {
      const plans = await adapter.get("practicePlans", []);
      const normalized = { ...plan, id: plan.id || `plan-${Date.now()}`, updatedAt: new Date().toISOString() };
      const next = [normalized, ...plans.filter((item) => item.id !== normalized.id)].slice(0, 80);
      await adapter.set("practicePlans", next);
      return normalized;
    },
    listPracticePlans: async () => adapter.get("practicePlans", []),
    deletePracticePlan: async (id) => {
      const plans = await adapter.get("practicePlans", []);
      await adapter.set("practicePlans", plans.filter((item) => item.id !== id));
    },
    exportAllData: async () => ({
      app: "String Lab",
      version: "pwa-loop-companion-1",
      exportedAt: new Date().toISOString(),
      settings: await adapter.get("settings", {}),
      progress: await adapter.get("progress", readLegacyProgress()),
      practicePlans: await adapter.get("practicePlans", [])
    }),
    importAllData: async (json) => {
      const data = typeof json === "string" ? JSON.parse(json) : json;
      if (!data || typeof data !== "object") throw new Error("Backup JSON is not an object.");
      await adapter.set("settings", data.settings || {});
      await adapter.set("progress", { ...DEFAULT_PROGRESS, ...(data.progress || {}) });
      await adapter.set("practicePlans", Array.isArray(data.practicePlans) ? data.practicePlans : []);
      return true;
    },
    clearPracticePlans: async () => adapter.remove("practicePlans")
  };
}

function openDb() {
  if (!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB unavailable"));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(STORAGE_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

function storageKey(key) {
  return `stringLab.${key}.v1`;
}

function readLegacyProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved) return { ...DEFAULT_PROGRESS, ...saved };
    const guitar = JSON.parse(localStorage.getItem("fretboardLab.progress.v1") || "{}");
    const cuatro = JSON.parse(localStorage.getItem("cuatroLab.progress.v1") || "{}");
    return {
      ...DEFAULT_PROGRESS,
      score: Number(guitar.trainerScore || cuatro.trainerScore || 0),
      streak: Number(guitar.trainerStreak || cuatro.trainerStreak || 0)
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

/* src/instruments/guitar.js */
const guitar = {
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

const OPEN_GUITAR_CHORDS = [
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

const CAGED_SHAPES = [
  { id: "C", label: "C shape", baseRoot: 0, frets: [null, 3, 2, 0, 1, 0], windowBefore: 1 },
  { id: "A", label: "A shape", baseRoot: 9, frets: [null, 0, 2, 2, 2, 0], windowBefore: 0 },
  { id: "G", label: "G shape", baseRoot: 7, frets: [3, 2, 0, 0, 0, 3], windowBefore: 1 },
  { id: "E", label: "E shape", baseRoot: 4, frets: [0, 2, 2, 1, 0, 0], windowBefore: 0 },
  { id: "D", label: "D shape", baseRoot: 2, frets: [null, null, 0, 2, 3, 2], windowBefore: 1 }
];

/* src/instruments/cuatro.js */
const cuatro = {
  id: "cuatro",
  label: "Puerto Rican Cuatro",
  maxFret: 20,
  stringLabel: "Course",
  courseOrderText: "B E A D G",
  pairingText: "B/E octave courses; A/D/G unison courses",
  strings: [
    { name: "G", label: "G4/G4", pairing: "unison", midi: 67, gauge: 1.2 },
    { name: "D", label: "D4/D4", pairing: "unison", midi: 62, gauge: 1.7 },
    { name: "A", label: "A3/A3", pairing: "unison", midi: 57, gauge: 2.3 },
    { name: "E", label: "E4/E3", pairing: "octave", midi: 52, gauge: 3.1 },
    { name: "B", label: "B3/B2", pairing: "octave", midi: 47, gauge: 4 }
  ],
  lowToHigh: [4, 3, 2, 1, 0],
  markerFrets: [3, 5, 7, 9, 15, 17, 19],
  doubleMarkerFrets: [12],
  voicingGroups: [
    { id: "upper", title: "Upper set", detail: "A D G courses", courseOrder: [2, 1, 0], threeCourse: true, limit: 6 },
    { id: "lower", title: "Lower set", detail: "B E A courses", courseOrder: [4, 3, 2], threeCourse: true, limit: 6 },
    { id: "full", title: "Full five-course", detail: "B E A D G", courseOrder: [4, 3, 2, 1, 0], threeCourse: false, limit: 6 },
    { id: "compact", title: "Compact movable", detail: "Shortest complete grips", courseOrder: [4, 3, 2, 1, 0], threeCourse: false, limit: 8, compact: true }
  ]
};

/* src/ui/fretboard-renderer.js */
function renderFretboard(container, instrument, options = {}) {
  const frets = options.frets || range(0, instrument.maxFret);
  const shouldSplit = options.split !== false && frets.length > 18 && frets.includes(12);
  if (shouldSplit) {
    container.innerHTML = "";
    const first = frets.filter((fret) => fret <= 12);
    const second = frets.filter((fret) => fret >= 12);
    renderFretboardSection(container, instrument, first, options, "Frets 0-12");
    renderFretboardSection(container, instrument, second, options, `Frets 12-${Math.max(...second)}`);
    return;
  }
  container.innerHTML = "";
  renderFretboardGrid(container, instrument, frets, options);
}

function renderFretboardSection(container, instrument, frets, options, label) {
  const section = document.createElement("section");
  section.className = "fretboard-section";
  const heading = document.createElement("div");
  heading.className = "fretboard-section-label";
  heading.textContent = label;
  section.append(heading);
  renderFretboardGrid(section, instrument, frets, options);
  container.append(section);
}

function renderFretboardGrid(container, instrument, frets, options = {}) {
  const root = options.root ?? 0;
  const scaleIntervals = options.scaleIntervals || [];
  const chordNotes = new Set(options.chordNotes || []);
  const chordToneKeys = new Set(options.chordToneKeys || []);
  const limitChordTonesToKeys = options.chordToneKeys !== undefined;
  const activeKeys = new Set(options.activeKeys || []);
  const markers = new Set(instrument.markerFrets || []);
  const doubles = new Set(instrument.doubleMarkerFrets || []);

  const grid = document.createElement("div");
  grid.className = "fretboard-grid";
  grid.style.setProperty("--fret-count", String(frets.length));
  grid.style.setProperty("--string-count", String(instrument.strings.length));

  const corner = document.createElement("div");
  corner.className = "corner-cell";
  grid.append(corner);
  frets.forEach((fret) => {
    const label = document.createElement("div");
    label.className = "fret-label" + (fret === 0 ? " open-fret" : "") + (markers.has(fret) ? " marker" : "") + (doubles.has(fret) ? " double-marker" : "");
    label.textContent = String(fret);
    grid.append(label);
  });

  instrument.strings.forEach((string, stringIndex) => {
    const stringLabel = document.createElement("div");
    stringLabel.className = "string-label";
    stringLabel.textContent = string.label;
    grid.append(stringLabel);
    frets.forEach((fret) => {
      const note = midiToNoteIndex(string.midi + fret);
      const interval = mod(note - root);
      const key = `${stringIndex}:${fret}`;
      const cell = document.createElement("button");
      const classes = ["note-cell"];
      if (fret === 0) classes.push("open-fret");
      if (chordNotes.has(note) && (!limitChordTonesToKeys || chordToneKeys.has(key))) classes.push(note === root ? "chord-root" : "chord-tone");
      if (scaleIntervals.includes(interval)) classes.push(note === root ? "scale-root" : "scale-tone");
      const isActiveShape = activeKeys.has(key);
      if (isActiveShape) classes.push(options.activeClass || "selected");
      if (options.muted && !chordNotes.has(note) && !scaleIntervals.includes(interval)) classes.push("muted");
      cell.className = classes.join(" ");
      cell.type = "button";
      cell.style.setProperty("--string-size", `${string.gauge}px`);
      const isHighlighted = chordNotes.has(note) || scaleIntervals.includes(interval) || isActiveShape;
      cell.dataset.label = labelForCell({
        note,
        interval,
        mode: options.labelMode,
        showNames: options.showNames || options.showAllNotes || isHighlighted,
        showAllNotes: options.showAllNotes,
        root
      });
      if (!cell.dataset.label) cell.classList.add("empty");
      cell.title = `${string.label} fret ${fret}: ${noteName(note)}`;
      cell.addEventListener("click", () => options.onClick?.({ stringIndex, fret, note, key }));
      grid.append(cell);
    });
  });

  container.append(grid);
}

function labelForCell({ note, interval, mode, showNames, showAllNotes }) {
  if (showAllNotes) return noteName(note);
  if (mode === "degree") return showNames ? DEGREE_LABELS[interval] || "" : "";
  if (mode === "note") return showNames ? noteName(note) : "";
  if (showNames) return noteName(note);
  return "";
}

/* src/ui/diagrams.js */
function renderVoicingCard(instrument, voicing, options = {}) {
  const card = document.createElement(options.button ? "button" : "div");
  card.className = "voicing-card";
  if (options.button) card.type = "button";
  if (options.onClick) card.addEventListener("click", options.onClick);

  if (options.title) {
    const title = document.createElement("strong");
    title.textContent = options.title;
    card.append(title);
  }
  const frets = document.createElement("div");
  frets.className = "voicing-frets";
  frets.style.setProperty("--voicing-count", String(voicing.lowToHigh.length));
  voicing.lowToHigh.forEach((fret) => {
    const item = document.createElement("span");
    item.textContent = fret === null ? "x" : String(fret);
    frets.append(item);
  });
  const notes = document.createElement("div");
  notes.className = "voicing-note-row";
  notes.style.setProperty("--voicing-count", String(voicing.lowToHigh.length));
  voicingNoteNames(instrument, voicing).forEach((name) => {
    const item = document.createElement("span");
    item.textContent = name;
    notes.append(item);
  });
  if (options.meta) {
    const meta = document.createElement("p");
    meta.textContent = options.meta;
    card.append(meta);
  }
  card.append(frets, notes);
  return card;
}

function renderChordDiagram(instrument, voicing) {
  const fretted = voicing.lowToHigh.filter((fret) => fret !== null && fret > 0);
  const minFret = fretted.length ? Math.min(...fretted) : 1;
  const maxFret = fretted.length ? Math.max(...fretted) : 4;
  const firstFret = minFret <= 4 ? 1 : minFret;
  const rows = Math.max(4, maxFret - firstFret + 1);
  const diagram = document.createElement("span");
  diagram.className = "chord-diagram";
  diagram.style.setProperty("--diagram-frets", String(rows));
  diagram.style.setProperty("--diagram-strings", String(voicing.lowToHigh.length));

  const fretLabel = document.createElement("span");
  fretLabel.className = "diagram-fret-label";
  fretLabel.textContent = firstFret === 1 ? "" : `${firstFret}fr`;
  diagram.append(fretLabel);
  voicing.lowToHigh.forEach((fret) => {
    const marker = document.createElement("span");
    marker.className = "diagram-open-marker" + (fret === 0 ? " is-open" : fret === null ? " is-muted" : "");
    marker.textContent = fret === null ? "x" : fret === 0 ? "0" : "";
    diagram.append(marker);
  });

  for (let row = 0; row < rows; row += 1) {
    const fretNumber = firstFret + row;
    const label = document.createElement("span");
    label.className = "diagram-fret-label";
    label.textContent = row === 0 && firstFret !== 1 ? String(firstFret) : "";
    diagram.append(label);
    voicing.lowToHigh.forEach((fret, lowIndex) => {
      const cell = document.createElement("span");
      cell.className = "diagram-cell";
      if (fret === fretNumber) {
        const stringIndex = voicing.courseOrder[lowIndex];
        cell.classList.add("has-dot");
        cell.dataset.label = noteName(midiToNoteIndex(instrument.strings[stringIndex].midi + fret));
      }
      diagram.append(cell);
    });
  }
  return diagram;
}

/* src/ui/tabs.js */
function bindTabs(storage = null) {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activateTab(button.dataset.tab);
      storage?.setSetting("lastTab", button.dataset.tab);
    });
  });
  return storage?.getSetting("lastTab", "practice").then((tab) => {
    if (document.getElementById(tab)) activateTab(tab);
  });
}

function activateTab(tab) {
  document.querySelectorAll("[data-tab]").forEach((item) => item.classList.toggle("is-active", item.dataset.tab === tab));
  document.querySelectorAll(".workspace").forEach((panel) => panel.classList.toggle("is-active", panel.id === tab));
}

/* src/features/scale-over-chord.js */
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

function recommendScalesForChord(chordDescriptor, context = {}) {
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

function recommendationsForProgression(chords, context = {}) {
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

/* src/features/progression-player.js */
function createProgressionPlayer({ onStep = null, onStop = null } = {}) {
  const state = { audio: null, playing: false, timers: [], releaseTimers: [], nodes: [], step: -1 };

  function play(chords, options = {}) {
    if (!chords?.length) return;
    stop(false);
    ensureAudio();
    const tempo = clamp(Number(options.tempo || 90), 40, 220);
    const repeats = Math.max(1, Number(options.repeats || 1));
    const events = rhythmEventsForProgression(chords, { ...options, tempo, repeats });
    state.playing = true;
    state.step = -1;
    events.forEach((event) => {
      const timer = setTimeout(() => {
        state.step = event.chordIndex;
        onStep?.(state.step);
        playChord(event.chord, event.durationSeconds, { ...options, velocity: event.velocity });
      }, event.atSeconds * 1000);
      state.timers.push(timer);
    });
    const endAt = events.length ? Math.max(...events.map((event) => event.atSeconds + event.durationSeconds)) : 0;
    state.timers.push(setTimeout(() => stop(true), endAt * 1000 + 160));
  }

  function stop(notify = true) {
    state.timers.forEach((timer) => clearTimeout(timer));
    state.releaseTimers.forEach((timer) => clearTimeout(timer));
    state.timers = [];
    state.releaseTimers = [];
    state.nodes.forEach(({ oscillator, gain }) => {
      try {
        const now = state.audio?.currentTime || 0;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(0.0001, now, 0.025);
        oscillator.stop(now + 0.08);
      } catch {
        // Already stopped.
      }
    });
    state.nodes = [];
    state.playing = false;
    state.step = -1;
    if (notify) onStop?.();
  }

  function ensureAudio() {
    if (!state.audio) state.audio = new (window.AudioContext || window.webkitAudioContext)();
    if (state.audio.state === "suspended") state.audio.resume();
  }

  function playChord(chord, duration, options) {
    if (!state.audio) return;
    const now = state.audio.currentTime;
    const notes = chordMidiNotes(chord, options.octave || 4).slice(0, options.maxNotes || 5);
    const velocity = options.velocity || 1;
    notes.forEach((midi, index) => {
      const oscillator = state.audio.createOscillator();
      const gain = state.audio.createGain();
      const filter = state.audio.createBiquadFilter();
      oscillator.type = index === 0 ? "triangle" : "sine";
      oscillator.frequency.value = midiToHz(midi);
      filter.type = "lowpass";
      filter.frequency.value = 1800;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime((index === 0 ? 0.11 : 0.075) * velocity, now + 0.018);
      gain.gain.setTargetAtTime(0.0001, now + duration, 0.06);
      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(state.audio.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.18);
      state.nodes.push({ oscillator, gain });
    });
    state.releaseTimers.push(setTimeout(() => {
      state.nodes = state.nodes.filter((node) => {
        if (!notes.some((midi) => Math.abs(midiToHz(midi) - node.oscillator.frequency.value) < 0.1)) return true;
        return false;
      });
    }, (duration + 0.25) * 1000));
  }

  return { state, play, stop };
}

function chordMidiNotes(chord, octave = 4) {
  const type = CHORD_BY_ID[chord.type] || CHORD_BY_ID.maj;
  const base = 12 * (octave + 1) + chord.root;
  const intervals = unique(type.intervals.map((interval) => interval % 12));
  const tones = intervals.map((interval) => base + interval);
  const sorted = [base - 12, ...tones].sort((a, b) => a - b);
  return sorted.filter((note) => note >= 36 && note <= 88);
}

function rhythmEventsForProgression(chords, options = {}) {
  const tempo = clamp(Number(options.tempo || 90), 40, 220);
  const repeats = Math.max(1, Number(options.repeats || 1));
  const secondsPerBar = (60 / tempo) * 4;
  const tokens = rhythmTokens(options.rhythmPattern);
  const stepSeconds = secondsPerBar / tokens.length;
  const events = [];
  for (let repeat = 0; repeat < repeats; repeat += 1) {
    chords.forEach((chord, chordIndex) => {
      const barStart = (repeat * chords.length + chordIndex) * secondsPerBar;
      tokens.forEach((token, tokenIndex) => {
        if (!isHit(token)) return;
        let tiedSteps = 0;
        for (let next = tokenIndex + 1; next < tokens.length && isTie(tokens[next]); next += 1) tiedSteps += 1;
        const durationSeconds = stepSeconds * (1 + tiedSteps) * (isAccent(token) ? 0.82 : 0.58);
        events.push({
          atSeconds: barStart + tokenIndex * stepSeconds,
          durationSeconds: Math.max(0.08, durationSeconds),
          chord,
          chordIndex,
          velocity: isAccent(token) ? 1 : 0.64
        });
      });
    });
  }
  if (!events.length) {
    const fallbackSeconds = secondsPerBar * 0.82;
    chords.forEach((chord, chordIndex) => events.push({ atSeconds: chordIndex * secondsPerBar, durationSeconds: fallbackSeconds, chord, chordIndex, velocity: 1 }));
  }
  return events;
}

function rhythmTokens(rhythmPattern) {
  const pattern = typeof rhythmPattern === "string" ? rhythmPattern : rhythmPattern?.pattern;
  const tokens = String(pattern || "X").trim().split(/\s+/).filter(Boolean);
  return tokens.length ? tokens : ["X"];
}

function isHit(token) {
  return /x/i.test(token);
}

function isAccent(token) {
  return token.includes("X") || token.includes(">");
}

function isTie(token) {
  return token === "_" || token === "~";
}

function midiToHz(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/* src/features/loop-companion.js */
const APP_VERSION = "pwa-loop-companion-1";
const GENRES = ["Blues", "Rock", "Pop", "Funk", "Jazz", "Latin", "Folk", "Ambient", "Neo-soul", "Random"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const SCALE_FOCUS = [
  ["ionian", "Major / Ionian"],
  ["aeolian", "Natural minor / Aeolian"],
  ["minorPent", "Minor pentatonic"],
  ["majorPent", "Major pentatonic"],
  ["minorBlues", "Blues scale"],
  ["dorian", "Dorian"],
  ["mixolydian", "Mixolydian"],
  ["phrygian", "Phrygian"],
  ["lydian", "Lydian"],
  ["harmonicMinor", "Harmonic minor"],
  ["melodicMinor", "Melodic minor"],
  ["random", "Random compatible focus"]
];
const BARS = [2, 4, 8, 12, 16];
const SUBDIVISIONS = [["1", "Quarter"], ["2", "Eighth"], ["3", "Triplet"], ["4", "Sixteenth"]];

const SCALE_ALIASES = {
  phrygian: { id: "phrygian", label: "Phrygian", intervals: [0, 1, 3, 5, 7, 8, 10], formula: "1 b2 b3 4 5 b6 b7" }
};

const TEMPLATES = {
  Blues: [
    { min: "Beginner", numerals: ["I7", "IV7", "I7", "V7"], name: "four-bar blues" },
    { min: "Beginner", numerals: ["I7", "I7", "I7", "I7", "IV7", "IV7", "I7", "I7", "V7", "IV7", "I7", "V7"], name: "12-bar blues" },
    { min: "Intermediate", numerals: ["i7", "iv7", "i7", "bVI7", "V7", "i7"], name: "minor blues turn" }
  ],
  Rock: [
    { min: "Beginner", numerals: ["I", "V", "vi", "IV"], name: "anthem loop" },
    { min: "Intermediate", numerals: ["i", "bVII", "bVI", "bVII"], name: "minor rock loop" },
    { min: "Advanced", numerals: ["i7", "bVII", "iv7", "bVI"], name: "modal rock color" }
  ],
  Pop: [
    { min: "Beginner", numerals: ["I", "V", "vi", "IV"], name: "pop axis" },
    { min: "Beginner", numerals: ["vi", "IV", "I", "V"], name: "minor lift" },
    { min: "Intermediate", numerals: ["Imaj7", "V", "vi7", "IVmaj7"], name: "warm pop" }
  ],
  Funk: [
    { min: "Beginner", numerals: ["i7", "i7", "IV7", "i7"], name: "minor funk vamp" },
    { min: "Intermediate", numerals: ["I9", "IV9", "I9", "bVII9"], name: "dominant ninth vamp" },
    { min: "Advanced", numerals: ["i9", "IV13", "i9", "bVII13"], name: "extended funk" }
  ],
  Jazz: [
    { min: "Beginner", numerals: ["ii7", "V7", "Imaj7", "Imaj7"], name: "major ii-V-I" },
    { min: "Intermediate", numerals: ["ii7", "V7", "Imaj7", "VI7"], name: "turnaround" },
    { min: "Advanced", numerals: ["iiø7", "V7", "i7", "bVI7"], name: "minor ii-V" }
  ],
  Latin: [
    { min: "Beginner", numerals: ["i", "iv", "V7", "i"], name: "minor clave loop" },
    { min: "Intermediate", numerals: ["i7", "iv7", "V7", "i7"], name: "montuno minor" },
    { min: "Advanced", numerals: ["i9", "iv9", "V7", "bVImaj7"], name: "latin color" }
  ],
  Folk: [
    { min: "Beginner", numerals: ["I", "IV", "V", "I"], name: "open-position folk" },
    { min: "Beginner", numerals: ["I", "vi", "IV", "V"], name: "song circle" },
    { min: "Intermediate", numerals: ["I", "bVII", "IV", "I"], name: "modal folk" }
  ],
  Ambient: [
    { min: "Beginner", numerals: ["I", "I", "IV", "I"], name: "slow drone" },
    { min: "Intermediate", numerals: ["Imaj7", "ii", "IVmaj7", "Imaj7"], name: "lydian wash" },
    { min: "Advanced", numerals: ["iadd9", "bVII", "ivadd9", "bVImaj7"], name: "minor drift" }
  ],
  "Neo-soul": [
    { min: "Beginner", numerals: ["Imaj7", "vi7", "IVmaj7", "V7"], name: "soul lift" },
    { min: "Intermediate", numerals: ["Imaj9", "iii7", "vi9", "IVmaj9"], name: "upper extensions" },
    { min: "Advanced", numerals: ["Imaj9", "bVII13", "vi9", "IVmaj9"], name: "borrowed color" }
  ]
};

function initLoopCompanion({ instruments, storage, metronome = null }) {
  const state = { plan: null, currentChord: 0, tapTimes: [], metro: loopMetronome(), player: null, range: "12" };
  state.player = createProgressionPlayer({
    onStep: (index) => {
      state.currentChord = index;
      renderProgression(state.plan);
      renderFretboardMap(state.plan);
      document.querySelector("#loopPlaybackStatus").textContent = `Playing ${state.plan.chords[index]?.label || ""}`;
    },
    onStop: () => {
      document.querySelector("#loopPlaybackStatus").textContent = "";
      if (state.plan) renderProgression(state.plan);
    }
  });
  populate("#loopCompInstrument", [["guitar", "Guitar"], ["cuatro", "Puerto Rican Cuatro"]]);
  populate("#loopCompGenre", GENRES.map((item) => [item, item]));
  populate("#loopCompKey", noteOptions());
  populate("#loopCompDifficulty", DIFFICULTIES.map((item) => [item, item]));
  populate("#loopCompScale", SCALE_FOCUS);
  populate("#loopCompBars", BARS.map((item) => [String(item), String(item)]));
  populate("#loopCompSubdivision", SUBDIVISIONS);

  bindControls();
  storage?.getSetting("loopCompanion", null).then((saved) => {
    if (saved) applySavedSettings(saved);
    syncGlobalTempo();
    generate("all");
    renderSavedPlans();
  });

  function bindControls() {
    ["#loopCompInstrument", "#loopCompGenre", "#loopCompKey", "#loopCompDifficulty", "#loopCompScale", "#loopCompBars"].forEach((selector) => {
      document.querySelector(selector).addEventListener("change", () => {
        saveSettings();
        generate("all");
      });
    });
    document.querySelector("#loopCompTempo").addEventListener("input", () => {
      saveSettings();
      syncGlobalTempo();
      state.metro.setBpm(Number(document.querySelector("#loopCompTempo").value));
    });
    document.querySelector("#loopTempoMinus").addEventListener("click", () => nudgeTempo(-1));
    document.querySelector("#loopTempoPlus").addEventListener("click", () => nudgeTempo(1));
    document.querySelector("#loopTapTempo").addEventListener("click", tapTempo);
    document.querySelector("#loopGenerate").addEventListener("click", () => generate("all"));
    document.querySelector("#loopRegenProgression").addEventListener("click", () => generate("progression"));
    document.querySelector("#loopRegenRhythm").addEventListener("click", () => generate("rhythm"));
    document.querySelector("#loopRegenLead").addEventListener("click", () => generate("lead"));
    document.querySelector("#loopSave").addEventListener("click", savePlan);
    document.querySelector("#loopPlayProgression").addEventListener("click", playProgression);
    document.querySelector("#loopStopProgression").addEventListener("click", () => state.player.stop());
    document.querySelector("#loopExportCard").addEventListener("click", exportCard);
    document.querySelector("#loopExportJson").addEventListener("click", exportJson);
    document.querySelector("#loopExportMidi").addEventListener("click", exportMidi);
    document.querySelector("#loopMetroToggle").addEventListener("click", () => state.metro.toggle());
    document.querySelector("#loopCompSubdivision").addEventListener("change", () => {
      state.metro.setSubdivision(Number(document.querySelector("#loopCompSubdivision").value));
      saveSettings();
    });
    document.querySelectorAll("[data-loop-frets]").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-loop-frets]").forEach((item) => item.classList.toggle("is-active", item === button));
        state.range = button.dataset.loopFrets;
        saveSettings();
        render();
      });
    });
    document.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.tab !== "loop-companion") {
          state.metro.stop();
          state.player.stop();
        }
      });
    });
  }

  function generate(part) {
    const input = getInput();
    const previous = state.plan;
    state.player.stop();
    if (part === "rhythm" && previous) {
      state.plan = { ...previous, compingPattern: compingPatternFor(input.genre, input.difficulty, Date.now()) };
    } else if (part === "lead" && previous) {
      state.plan = { ...previous, leadExercise: leadExerciseFor(previous, Date.now()) };
    } else {
      state.plan = generateLoopPlan({ ...input, seed: Date.now() });
    }
    state.currentChord = 0;
    state.metro.setBpm(input.tempo);
    state.metro.setSubdivision(Number(document.querySelector("#loopCompSubdivision").value));
    saveSettings();
    render();
  }

  function render() {
    if (!state.plan) return;
    const plan = state.plan;
    document.querySelector("#loopPlanTitle").textContent = `${noteName(plan.key)} ${plan.genre} - ${plan.templateName}`;
    document.querySelector("#loopPlanMeta").textContent = `${plan.tempo} BPM | ${plan.difficulty} | ${plan.bars} bars | ${plan.instrument === "cuatro" ? "Cuatro" : "Guitar"}`;
    document.querySelector("#loopSuggestedScale").textContent = `${noteName(plan.key)} ${plan.suggestedScale.label}`;
    document.querySelector("#loopScaleHint").textContent = plan.scaleHint;
    renderProgression(plan);
    renderTargets(plan);
    renderFretboardMap(plan);
    renderRhythm(plan);
    renderLead(plan);
    renderJsonPreview(plan);
    state.metro.render();
  }

  function playProgression() {
    if (!state.plan?.chords?.length) return;
    state.metro.stop();
    metronome?.stop();
    document.querySelector("#loopPlaybackStatus").textContent = "Starting MIDI preview...";
    state.player.play(state.plan.chords, { tempo: state.plan.tempo, repeats: 1, maxNotes: 5, octave: 4, rhythmPattern: state.plan.compingPattern });
  }

  function renderProgression(plan) {
    const box = document.querySelector("#loopProgressionCards");
    box.innerHTML = "";
    plan.chords.forEach((chord, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `progression-chord${index === state.currentChord ? " is-selected" : ""}`;
      card.innerHTML = `<strong>${chord.label}</strong><span>${plan.romanNumerals[index]}</span>`;
      card.addEventListener("click", () => {
        state.currentChord = index;
        render();
      });
      box.append(card);
    });
  }

  function renderTargets(plan) {
    const box = document.querySelector("#loopTargets");
    box.innerHTML = "";
    plan.targetNotes.forEach((item) => {
      const row = document.createElement("div");
      row.className = "target-row";
      row.innerHTML = `<strong>${item.chord}</strong><span>${item.compact}</span>`;
      box.append(row);
    });
  }

  function renderFretboardMap(plan) {
    const instrument = instruments[plan.instrument] || instruments.guitar;
    const active = plan.chords[state.currentChord] || plan.chords[0];
    const targets = targetNoteIndexes(active);
    renderFretboard(document.querySelector("#loopFretboard"), instrument, {
      frets: visibleFrets(instrument, state.range),
      split: false,
      root: plan.key,
      scaleIntervals: plan.suggestedScale.intervals,
      chordNotes: targets,
      labelMode: "degree",
      showAllNotes: document.querySelector("#loopShowAllNotes").checked,
      activeClass: "caged-shape",
      muted: true
    });
  }

  function renderRhythm(plan) {
    document.querySelector("#loopCompingPattern").innerHTML = `
      <strong>${plan.compingPattern.count}</strong>
      <code>${plan.compingPattern.pattern}</code>
      <span>${plan.compingPattern.hint}</span>`;
  }

  function renderLead(plan) {
    const lead = plan.leadExercise;
    document.querySelector("#loopLeadExercise").innerHTML = `
      <strong>${lead.position}</strong>
      <span>${lead.rule}</span>
      <ol>${lead.bars.map((bar) => `<li>${bar}</li>`).join("")}</ol>`;
  }

  function renderJsonPreview(plan) {
    document.querySelector("#loopPlanJsonPreview").textContent = JSON.stringify(planForExport(plan), null, 2);
  }

  async function savePlan() {
    if (!state.plan) return;
    const saved = await storage.savePracticePlan(planForExport(state.plan));
    document.querySelector("#loopSaveStatus").textContent = `Saved ${new Date(saved.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    renderSavedPlans();
  }

  async function renderSavedPlans() {
    const box = document.querySelector("#loopSavedPlans");
    if (!box || !storage) return;
    const plans = await storage.listPracticePlans();
    box.innerHTML = "";
    if (!plans.length) {
      box.innerHTML = `<p class="hint">No saved loop plans yet.</p>`;
      return;
    }
    plans.slice(0, 6).forEach((plan) => {
      const row = document.createElement("div");
      row.className = "saved-plan-row";
      const keyLabel = plan.keyName || (typeof plan.key === "number" ? noteName(plan.key) : plan.key || "C");
      row.innerHTML = `<button type="button">${keyLabel} ${plan.genre} ${plan.bars} bars</button><button type="button" aria-label="Delete saved plan">Delete</button>`;
      row.children[0].addEventListener("click", () => {
        state.plan = hydratePlan(plan);
        document.querySelector("#loopCompInstrument").value = state.plan.instrument;
        document.querySelector("#loopCompTempo").value = String(state.plan.tempo);
        render();
      });
      row.children[1].addEventListener("click", async () => {
        await storage.deletePracticePlan(plan.id);
        renderSavedPlans();
      });
      box.append(row);
    });
  }

  function exportJson() {
    if (!state.plan) return;
    downloadBlob(`string-lab-loop-plan-${state.plan.id}.json`, JSON.stringify(planForExport(state.plan), null, 2), "application/json");
  }

  function exportCard() {
    if (!state.plan) return;
    const plan = state.plan;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>String Lab Practice Card</title><style>
      body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:28px;color:#1f2522;background:#fff}
      h1{font-size:24px;margin:0 0 8px} h2{font-size:15px;margin:18px 0 8px}
      .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.card{border:1px solid #bbb;padding:8px;border-radius:6px}
      code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.targets{display:grid;gap:6px}
      @media print{body{margin:14mm}.no-print{display:none}}
    </style></head><body>
      <button class="no-print" onclick="window.print()">Print</button>
      <h1>String Lab: ${noteName(plan.key)} ${plan.genre}</h1>
      <p>${new Date(plan.createdAt).toLocaleDateString()} | ${plan.tempo} BPM | ${plan.difficulty} | ${plan.bars} bars | ${plan.instrument}</p>
      <h2>Progression</h2><div class="grid">${plan.chords.map((chord, index) => `<div class="card"><strong>${chord.label}</strong><br>${plan.romanNumerals[index]}</div>`).join("")}</div>
      <h2>Scale</h2><p>${noteName(plan.key)} ${plan.suggestedScale.label}. ${plan.scaleHint}</p>
      <h2>Target Notes</h2><div class="targets">${plan.targetNotes.map((item) => `<div><strong>${item.chord}</strong> ${item.compact}</div>`).join("")}</div>
      <h2>Rhythm</h2><p><code>${plan.compingPattern.count}</code><br><code>${plan.compingPattern.pattern}</code><br>${plan.compingPattern.hint}</p>
      <h2>Lead Exercise</h2><ol>${plan.leadExercise.bars.map((bar) => `<li>${bar}</li>`).join("")}</ol>
    </body></html>`;
    downloadBlob(`string-lab-practice-card-${plan.id}.html`, html, "text/html");
  }

  function exportMidi() {
    if (!state.plan) return;
    const bytes = midiBytesForPlan(state.plan);
    downloadBlob(`string-lab-loop-${state.plan.id}.mid`, bytes, "audio/midi");
  }

  function getInput() {
    const tempo = clamp(Number(document.querySelector("#loopCompTempo").value || 90), 40, 220);
    document.querySelector("#loopCompTempo").value = String(tempo);
    return {
      instrument: document.querySelector("#loopCompInstrument").value,
      genre: document.querySelector("#loopCompGenre").value,
      key: Number(document.querySelector("#loopCompKey").value),
      tempo,
      difficulty: document.querySelector("#loopCompDifficulty").value,
      scaleFocus: document.querySelector("#loopCompScale").value,
      bars: Number(document.querySelector("#loopCompBars").value),
      range: state.range
    };
  }

  function saveSettings() {
    storage?.setSetting("loopCompanion", getInput());
  }

  function applySavedSettings(saved) {
    setValue("#loopCompInstrument", saved.instrument);
    setValue("#loopCompGenre", saved.genre);
    setValue("#loopCompKey", saved.key);
    setValue("#loopCompTempo", saved.tempo);
    setValue("#loopCompDifficulty", saved.difficulty);
    setValue("#loopCompScale", saved.scaleFocus);
    setValue("#loopCompBars", saved.bars);
    state.range = saved.range || state.range;
    document.querySelectorAll("[data-loop-frets]").forEach((button) => button.classList.toggle("is-active", button.dataset.loopFrets === state.range));
  }

  function syncGlobalTempo() {
    const tempo = Number(document.querySelector("#loopCompTempo").value || 90);
    document.querySelector("#metroSlider").value = String(tempo);
    document.querySelector("#metroBpm").textContent = String(tempo);
    metronome?.setBpm(tempo);
  }

  function nudgeTempo(delta) {
    const input = document.querySelector("#loopCompTempo");
    input.value = String(clamp(Number(input.value) + delta, 40, 220));
    input.dispatchEvent(new Event("input"));
  }

  function tapTempo() {
    const now = performance.now();
    state.tapTimes = [...state.tapTimes.filter((time) => now - time < 2200), now].slice(-5);
    if (state.tapTimes.length >= 2) {
      const gaps = state.tapTimes.slice(1).map((time, index) => time - state.tapTimes[index]);
      const avg = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
      document.querySelector("#loopCompTempo").value = String(clamp(Math.round(60000 / avg), 40, 220));
      document.querySelector("#loopCompTempo").dispatchEvent(new Event("input"));
    }
  }

  document.querySelector("#loopShowAllNotes").addEventListener("change", render);
}

function generateLoopPlan(input = {}) {
  const seed = input.seed || 1;
  const rng = mulberry32(hashSeed(seed));
  const genre = input.genre === "Random" || !input.genre ? randomFrom(Object.keys(TEMPLATES), rng) : input.genre;
  const difficulty = input.difficulty || "Beginner";
  const bars = Number(input.bars || 4);
  const key = Number.isFinite(input.key) ? input.key : 0;
  const template = chooseTemplate(genre, difficulty, bars, rng);
  const numerals = fitBars(template.numerals, bars);
  const chords = transposeProgression(numerals, key);
  const scale = chooseScale(input.scaleFocus, genre, difficulty, chords, rng);
  const plan = {
    id: `loop-${Date.now()}-${Math.floor(rng() * 10000)}`,
    createdAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    instrument: input.instrument || "guitar",
    genre,
    key,
    keyName: noteName(key),
    tempo: clamp(Number(input.tempo || tempoFor(genre, difficulty)), 40, 220),
    difficulty,
    scaleFocus: scale.id,
    bars,
    templateName: template.name,
    chords,
    romanNumerals: numerals,
    suggestedScale: scale,
    scaleHint: scaleHint(scale, genre, chords),
    targetNotes: chords.map((chord) => targetNotesForChord(chord)),
    compingPattern: compingPatternFor(genre, difficulty, seed),
    leadExercise: null,
    fretboardSettings: { range: input.range || "12", instrument: input.instrument || "guitar" },
    notes: `${noteName(key)} ${scale.label}: ${scale.intervals.map((interval) => noteName(key + interval)).join(" ")}`
  };
  plan.leadExercise = leadExerciseFor(plan, seed);
  return plan;
}

function midiBytesForPlan(plan) {
  const ticks = 480;
  const tempo = Math.round(60000000 / clamp(Number(plan.tempo || 90), 40, 220));
  const track = [];
  pushMetaTempo(track, tempo);
  pushTimeSignature(track);
  const bpm = clamp(Number(plan.tempo || 90), 40, 220);
  const secondsPerTick = (60 / bpm) / ticks;
  let currentTick = 0;
  rhythmEventsForProgression(plan.chords, { tempo: bpm, rhythmPattern: plan.compingPattern, repeats: 1 }).forEach((event) => {
    const startTick = Math.max(currentTick, Math.round(event.atSeconds / secondsPerTick));
    const duration = Math.max(24, Math.round(event.durationSeconds / secondsPerTick));
    const notes = chordMidiNotes(event.chord).slice(0, 5);
    notes.forEach((note, index) => pushMidi(track, index === 0 ? startTick - currentTick : 0, 0x90, note, event.velocity > 0.8 ? 78 : 58));
    currentTick = startTick;
    notes.forEach((note, index) => pushMidi(track, index === 0 ? duration : 0, 0x80, note, 0));
    currentTick += duration;
  });
  pushBytes(track, [0x00, 0xff, 0x2f, 0x00]);
  return new Uint8Array([
    ...ascii("MThd"), 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x01, (ticks >> 8) & 255, ticks & 255,
    ...ascii("MTrk"), ...u32(track.length), ...track
  ]);
}

function chooseTemplate(genre, difficulty, bars, rng) {
  const level = DIFFICULTIES.indexOf(difficulty);
  const templates = (TEMPLATES[genre] || TEMPLATES.Pop).filter((item) => DIFFICULTIES.indexOf(item.min) <= level);
  if (genre === "Blues" && bars === 12) return templates.find((item) => item.numerals.length === 12) || templates[0];
  return randomFrom(templates, rng);
}

function chooseScale(focus, genre, difficulty, chords, rng) {
  const compatible = compatibleScales(genre, difficulty, chords);
  const id = focus === "random" || !focus ? randomFrom(compatible, rng) : focus;
  return scaleById(id) || scaleById(compatible[0]) || SCALE_BY_ID.ionian;
}

function compatibleScales(genre, difficulty, chords) {
  const minor = chords[0]?.type?.startsWith("min") || chords[0]?.numeral?.startsWith("i");
  if (genre === "Blues") return ["minorBlues", "majorBlues", "mixolydian"];
  if (genre === "Funk") return minor ? ["dorian", "minorPent", "minorBlues"] : ["mixolydian", "dominantPent", "majorPent"];
  if (genre === "Jazz" && difficulty !== "Beginner") return minor ? ["melodicMinor", "harmonicMinor", "dorian"] : ["ionian", "mixolydian", "lydian"];
  if (genre === "Ambient") return ["lydian", "ionian", "aeolian"];
  if (minor || genre === "Latin") return ["aeolian", "dorian", "minorPent", "harmonicMinor"];
  return ["ionian", "majorPent", "mixolydian"];
}

function scaleHint(scale, genre, chords) {
  const first = chords[0];
  if (genre === "Blues") return "Blend major and minor blues, then land on chord tones.";
  if (scale.id === "dorian") return `Use ${noteName(first.root)} Dorian color and target the 3rd of each chord.`;
  if (scale.id === "mixolydian") return "Lean on b7 over dominant chords and resolve to roots.";
  if (scale.id === "lydian") return "Let #4 shimmer, then resolve phrases calmly.";
  return "Keep the scale simple and land phrases on target tones.";
}

function targetNotesForChord(chord) {
  const targets = targetIntervals(chord);
  const compact = targets.map((item) => `${item.label} ${noteName(chord.root + item.interval)}`).join(" | ");
  return {
    chord: chord.label,
    compact,
    notes: targets.map((item) => ({ label: item.label, note: noteName(chord.root + item.interval), interval: item.interval }))
  };
}

function targetIntervals(chord) {
  const type = CHORD_BY_ID[chord.type] || CHORD_BY_ID.maj;
  const ints = type.intervals;
  const items = [];
  addTarget(items, ints, [3, 4], "3rd");
  addTarget(items, ints, [7, 6, 8], "5th");
  addTarget(items, ints, [10, 11], "7th");
  addTarget(items, ints, [2, 5, 9, 1, 6, 8], "color");
  return items.length ? items : [{ label: "root", interval: 0 }];
}

function addTarget(items, intervals, candidates, label) {
  const found = candidates.find((interval) => intervals.some((item) => (item % 12) === interval));
  if (found !== undefined && !items.some((item) => item.interval === found)) items.push({ label, interval: found });
}

function targetNoteIndexes(chord) {
  return unique(targetIntervals(chord).map((item) => (chord.root + item.interval) % 12));
}

function compingPatternFor(genre, difficulty, seed) {
  const rng = mulberry32(hashSeed(`${genre}-${difficulty}-${seed}`));
  const patterns = {
    Blues: [["1 & 2 & 3 & 4 &", "X - x - X - x -", "Swing the weak hits."], ["1 & 2 & 3 & 4 &", "X _ x X - x X -", "Accent beats 2 and 4."]],
    Funk: [["1 e & a 2 e & a 3 e & a 4 e & a", "X - x X - x X - X - x - - x X -", "Mute on weak sixteenths."], ["1 e & a 2 e & a 3 e & a 4 e & a", "X x - x X - x - X - - x - x X -", "Keep the fretting hand loose."]],
    Latin: [["1 & 2 & 3 & 4 &", "X - - X - X - -", "Keep the offbeats crisp."], ["1 e & a 2 e & a 3 e & a 4 e & a", "X - x - - X - x X - - x - X - -", "Think clave, not volume."]],
    Jazz: [["1 & 2 & 3 & 4 &", "X - - X - - X -", "Feather the changes."], ["1 & 2 & 3 & 4 &", "X - X - - X - X", "Keep chords short."]],
    Pop: [["1 & 2 & 3 & 4 &", "X - - X - X - -", "Let beat 1 ring."], ["1 & 2 & 3 & 4 &", "X - X - - X - -", "Stay even."]],
    Rock: [["1 & 2 & 3 & 4 &", "X X - X - X X -", "Drive the downbeats."], ["1 & 2 & 3 & 4 &", "X - X X - X - X", "Palm mute lightly."]],
    Ambient: [["1 & 2 & 3 & 4 &", "X _ _ _ - _ _ _", "Let it breathe."], ["1 & 2 & 3 & 4 &", "X _ - _ X _ - _", "Leave space after each hit."]],
    Folk: [["1 & 2 & 3 & 4 &", "X - X - X - X -", "Keep it gentle."], ["1 & 2 & 3 & 4 &", "X - - X X - - X", "Bass then treble."]],
    "Neo-soul": [["1 e & a 2 e & a 3 e & a 4 e & a", "X - x - - X x - X - - x - X - -", "Ghost the soft hits."], ["1 & 2 & 3 & 4 &", "X - - x X - x -", "Lay back slightly."]]
  };
  const picked = randomFrom(patterns[genre] || patterns.Pop, rng);
  return { count: picked[0], pattern: picked[1], hint: picked[2] };
}

function leadExerciseFor(plan, seed) {
  const rng = mulberry32(hashSeed(`lead-${seed}-${plan.genre}`));
  const starts = ["root", "5th", "low 3rd"];
  const endings = ["3rd", "7th", "root"];
  return {
    position: `${noteName(plan.key)} ${plan.suggestedScale.label}, frets ${plan.fretboardSettings.range === "5" ? "0-5" : plan.fretboardSettings.range === "all" ? "0-12 first, then shift" : "0-12"}`,
    rule: `Start on ${randomFrom(starts, rng)} and land on the ${randomFrom(endings, rng)}.`,
    bars: fitBars([
      "Bar 1: state a two-note motif.",
      "Bar 2: repeat it and land on the next 3rd.",
      "Bar 3: add one passing tone.",
      "Bar 4: resolve to root or 7th."
    ], Math.min(4, plan.bars))
  };
}

function planForExport(plan) {
  return {
    id: plan.id,
    createdAt: plan.createdAt,
    appVersion: plan.appVersion,
    genre: plan.genre,
    key: noteName(plan.key),
    tempo: plan.tempo,
    difficulty: plan.difficulty,
    scaleFocus: plan.scaleFocus,
    bars: plan.bars,
    chords: plan.chords.map((chord) => chord.label),
    romanNumerals: plan.romanNumerals,
    suggestedScale: `${noteName(plan.key)} ${plan.suggestedScale.label}`,
    targetNotes: plan.targetNotes,
    compingPattern: plan.compingPattern,
    leadExercise: plan.leadExercise,
    fretboardSettings: plan.fretboardSettings,
    instrument: plan.instrument,
    notes: plan.notes
  };
}

function hydratePlan(saved) {
  if (saved.chords?.[0] && typeof saved.chords[0] === "string") {
    const key = noteIndexFromName(saved.key);
    const chords = transposeProgression(saved.romanNumerals || ["I"], key);
    return generateLoopPlan({ ...saved, key, chords, seed: Date.now() });
  }
  return saved;
}

function fitBars(values, bars) {
  return Array.from({ length: bars }, (_, index) => values[index % values.length]);
}

function tempoFor(genre, difficulty) {
  const base = { Blues: 82, Rock: 104, Pop: 96, Funk: 92, Jazz: 112, Latin: 98, Folk: 84, Ambient: 62, "Neo-soul": 76 }[genre] || 90;
  return difficulty === "Beginner" ? base - 10 : difficulty === "Advanced" ? base + 14 : base;
}

function visibleFrets(instrument, rangeMode) {
  const end = rangeMode === "all" ? instrument.maxFret : Math.min(instrument.maxFret, Number(rangeMode));
  return range(0, end);
}

function scaleById(id) {
  return SCALE_BY_ID[id] || SCALE_ALIASES[id];
}

function noteOptions() {
  return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map((note, index) => [String(index), note]);
}

function populate(selector, options) {
  const select = document.querySelector(selector);
  select.innerHTML = "";
  options.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
}

function setValue(selector, value) {
  if (value === undefined || value === null) return;
  const element = document.querySelector(selector);
  if (element) element.value = String(value);
}

function randomFrom(values, rng) {
  return values[Math.floor(rng() * values.length)];
}

function hashSeed(seed) {
  return String(seed).split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) >>> 0, 2166136261);
}

function mulberry32(seed) {
  return function () {
    let value = seed += 0x6d2b79f5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function noteIndexFromName(name) {
  const index = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].indexOf(String(name).replace("Db", "C#").replace("Eb", "D#").replace("Gb", "F#").replace("Ab", "G#").replace("Bb", "A#"));
  return index >= 0 ? index : 0;
}

function downloadBlob(filename, content, type) {
  const blob = content instanceof Uint8Array ? new Blob([content], { type }) : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function loopMetronome() {
  const state = { bpm: 90, subdivision: 1, meter: 4, step: 0, playing: false, timer: null, audio: null };
  function toggle() {
    state.playing ? stop() : start();
  }
  function start() {
    ensureAudio();
    state.playing = true;
    state.step = 0;
    tick();
    restart();
    render();
  }
  function stop() {
    if (state.timer) clearInterval(state.timer);
    state.playing = false;
    state.timer = null;
    state.step = 0;
    render();
  }
  function restart() {
    if (state.timer) clearInterval(state.timer);
    if (state.playing) state.timer = setInterval(tick, 60000 / state.bpm / state.subdivision);
  }
  function setBpm(value) {
    state.bpm = clamp(value, 40, 220);
    restart();
    render();
  }
  function setSubdivision(value) {
    state.subdivision = Number(value || 1);
    restart();
    render();
  }
  function tick() {
    const accent = state.step % (state.meter * state.subdivision) === 0;
    click(accent);
    state.step += 1;
    render();
  }
  function ensureAudio() {
    if (!state.audio) state.audio = new (window.AudioContext || window.webkitAudioContext)();
    if (state.audio.state === "suspended") state.audio.resume();
  }
  function click(accent) {
    if (!state.audio) return;
    const oscillator = state.audio.createOscillator();
    const gain = state.audio.createGain();
    const now = state.audio.currentTime;
    oscillator.frequency.value = accent ? 1540 : 920;
    oscillator.type = "square";
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(accent ? 0.18 : 0.08, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    oscillator.connect(gain);
    gain.connect(state.audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.055);
  }
  function render() {
    const toggle = document.querySelector("#loopMetroToggle");
    const dots = document.querySelector("#loopBeatDots");
    if (!toggle || !dots) return;
    toggle.textContent = state.playing ? "Stop click" : "Start click";
    toggle.setAttribute("aria-pressed", String(state.playing));
    dots.innerHTML = "";
    for (let beat = 0; beat < state.meter; beat += 1) {
      const dot = document.createElement("span");
      const activeBeat = Math.floor((state.step - 1) / state.subdivision) % state.meter;
      dot.className = "metro-dot" + (state.playing && beat === activeBeat ? " is-active" : "") + (beat === 0 ? " is-accent" : "");
      dot.textContent = String(beat + 1);
      dots.append(dot);
    }
  }
  return { toggle, stop, setBpm, setSubdivision, render };
}

function pushMetaTempo(track, tempo) {
  pushBytes(track, [0x00, 0xff, 0x51, 0x03, (tempo >> 16) & 255, (tempo >> 8) & 255, tempo & 255]);
}

function pushTimeSignature(track) {
  pushBytes(track, [0x00, 0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08]);
}

function pushMidi(track, delta, status, data1, data2) {
  pushBytes(track, varLen(delta));
  pushBytes(track, [status, data1 & 255, data2 & 255]);
}

function pushBytes(target, bytes) {
  bytes.forEach((byte) => target.push(byte));
}

function varLen(value) {
  let buffer = value & 0x7f;
  const bytes = [];
  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= ((value & 0x7f) | 0x80);
  }
  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8;
    else break;
  }
  return bytes;
}

function ascii(value) {
  return value.split("").map((char) => char.charCodeAt(0));
}

function u32(value) {
  return [(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255];
}

/* src/features/aerobics.js */
const EXERCISE_BANK = [
  {
    id: "chromatic-1234",
    category: "Chromatic independence",
    name: "1-2-3-4 Ladder",
    difficulty: "Beginner",
    bpm: 70,
    goal: "Even fretting and relaxed finger independence.",
    tab: "e|----------------1-2-3-4-|\nB|----------1-2-3-4-------|\nG|----1-2-3-4-------------|\nD|1-2-3-4-----------------|\nA|------------------------|\nE|------------------------|\nF: 1 2 3 4 1 2 3 4 ...",
    picking: "D U D U throughout.",
    mistake: "Flying fingers too far from the fretboard."
  },
  {
    id: "alternate-burst",
    category: "Alternate picking",
    name: "Two-String Burst",
    difficulty: "Intermediate",
    bpm: 84,
    goal: "Keep pick motion small when crossing strings.",
    tab: "e|-------------5-7-8-7-5-|\nB|-----5-6-8-------------|\nG|-5-7-------------------|\nD|-----------------------|\nA|-----------------------|\nE|-----------------------|\nF: 1 3 1 2 4 1 3 4 3 1",
    picking: "Strict alternate picking.",
    mistake: "Digging in harder on string changes."
  },
  {
    id: "string-skip-triads",
    category: "String skipping",
    name: "Skipped Triad Echo",
    difficulty: "Intermediate",
    bpm: 76,
    goal: "Clean leaps without extra string noise.",
    tab: "e|---------5---------8-|\nB|---------------------|\nG|-----5---------9-----|\nD|---------------------|\nA|-7---------10--------|\nE|---------------------|\nF: 3 1 1 4 3 4",
    picking: "Down on low notes, up on high notes.",
    mistake: "Letting skipped strings ring."
  },
  {
    id: "legato-hammer-pull",
    category: "Legato",
    name: "Hammer Pull Cell",
    difficulty: "Beginner",
    bpm: 66,
    goal: "Even volume without picking every note.",
    tab: "e|-5h7p5---5h8p5---|\nB|-------8-------8-|\nG|-----------------|\nD|-----------------|\nA|-----------------|\nE|-----------------|\nF: 1 3 1 4 1 4",
    picking: "Pick only the first note of each group.",
    mistake: "Pulling down too hard and bending the pitch."
  },
  {
    id: "position-shift",
    category: "Position shifts",
    name: "Guide-Finger Shift",
    difficulty: "Intermediate",
    bpm: 72,
    goal: "Shift positions without losing time.",
    tab: "e|----------------5-7-9-|\nB|----------5-7-8-------|\nG|----4-6-7-------------|\nD|-4-6------------------|\nA|----------------------|\nE|----------------------|\nF: 1 3 1 3 4 1 3 4 1 3 4",
    picking: "Alternate picking.",
    mistake: "Rushing the shift."
  },
  {
    id: "caged-connect",
    category: "CAGED transitions",
    name: "CAGED Position Link",
    difficulty: "Intermediate",
    bpm: 80,
    goal: "Move between adjacent chord shapes with one shared tone.",
    tab: "e|---------3-5-|\nB|-----3-5-----|\nG|-2-4---------|\nD|-------------|\nA|-------------|\nE|-------------|\nF: 1 3 1 3 1 3",
    picking: "D U D U.",
    mistake: "Changing position before the shared tone is clean."
  },
  {
    id: "major-sequence",
    category: "Major scale sequences",
    name: "Major 123 Sequence",
    difficulty: "Intermediate",
    bpm: 84,
    goal: "Hear scale degrees as small groups.",
    tab: "e|-------------------------|\nB|-----------------5-6-8---|\nG|---------4-5-7-----------|\nD|-3-5-7-------------------|\nA|-------------------------|\nE|-------------------------|\nF: 1 3 4 1 2 4 1 2 4",
    picking: "Alternate picking.",
    mistake: "Accent drifting away from beat 1."
  },
  {
    id: "minor-pent-box",
    category: "Minor pentatonic sequences",
    name: "Pentatonic Four",
    difficulty: "Beginner",
    bpm: 78,
    goal: "Make the box musical and even.",
    tab: "e|----------------5-8-|\nB|------------5-8-----|\nG|--------5-7---------|\nD|----5-7-------------|\nA|-5-7----------------|\nE|--------------------|\nF: 1 3 1 3 1 3 1 4 1 4",
    picking: "D U on each string.",
    mistake: "Letting the hand tense on the top strings."
  },
  {
    id: "arpeggio-triad",
    category: "Arpeggios",
    name: "Triad Sweep Prep",
    difficulty: "Advanced",
    bpm: 68,
    goal: "Separate arpeggio notes without smearing.",
    tab: "e|---------8-12-8---------|\nB|------10--------10------|\nG|----9--------------9----|\nD|-10------------------10-|\nA|------------------------|\nE|------------------------|\nF: 2 1 3 1 4 1 3 1 2",
    picking: "Economy strokes allowed; keep notes separate.",
    mistake: "Holding every note like a chord."
  },
  {
    id: "three-note-string",
    category: "Three-notes-per-string patterns",
    name: "3NPS Climb",
    difficulty: "Advanced",
    bpm: 92,
    goal: "Keep groupings even across strings.",
    tab: "e|----------------7-8-10-|\nB|----------6-8-10-------|\nG|----5-7-9--------------|\nD|-5-7-9-----------------|\nA|-----------------------|\nE|-----------------------|\nF: 1 2 4 1 2 4 1 3 4 1 2 4",
    picking: "D U D / U D U groupings.",
    mistake: "Accent only the first note of each string."
  },
  {
    id: "funk-sixteenths",
    category: "Rhythm muting / funk-style sixteenth notes",
    name: "Muted Sixteenth Grid",
    difficulty: "Intermediate",
    bpm: 88,
    goal: "Keep the wrist loose and the mute tight.",
    tab: "e|-x-x-7-x-x-7-x-|\nB|-x-x-7-x-x-7-x-|\nG|-x-x-7-x-x-7-x-|\nD|---------------|\nA|---------------|\nE|---------------|\nF: bar 1st finger at 7",
    picking: "D U D U sixteenths.",
    mistake: "Pressing too hard during muted hits."
  },
  {
    id: "cuatro-course-crossing",
    instrument: "cuatro",
    category: "Cuatro course crossing",
    name: "B-E-A-D-G Course Ladder",
    difficulty: "Beginner",
    bpm: 66,
    goal: "Move through the five courses with even pick depth.",
    tab: "G|----------------0-2-4-|\nD|----------0-2-4-------|\nA|----0-2-4-------------|\nE|0-2-------------------|\nB|----------------------|\nF: 0 1 3 0 1 3 0 1 3",
    picking: "Alternate picking, small wrist motion.",
    mistake: "Catching both strings in a course unevenly."
  },
  {
    id: "cuatro-upper-triads",
    instrument: "cuatro",
    category: "Upper three-course voicings",
    name: "A-D-G Triad Walk",
    difficulty: "Intermediate",
    bpm: 74,
    goal: "Practice clean upper-set chord fragments for comping.",
    tab: "G|-0---2---4---5-|\nD|-0---2---4---5-|\nA|-2---4---5---7-|\nE|---------------|\nB|---------------|\nF: 1   1   1   1",
    picking: "Light downstrokes, release pressure after each hit.",
    mistake: "Letting upper-course chords ring too long."
  },
  {
    id: "cuatro-lower-voicings",
    instrument: "cuatro",
    category: "Lower three-course voicings",
    name: "B-E-A Grip Shift",
    difficulty: "Intermediate",
    bpm: 70,
    goal: "Build lower-set grip strength without squeezing.",
    tab: "G|---------------|\nD|---------------|\nA|-0---2---4---5-|\nE|-1---3---5---7-|\nB|-1---3---5---6-|\nF: 1   1   1   1",
    picking: "Downstroke each grip, mute before shifting.",
    mistake: "Dragging the hand instead of releasing between grips."
  },
  {
    id: "cuatro-tremolo-control",
    instrument: "cuatro",
    category: "Tremolo control",
    name: "Single-Course Tremolo Pulse",
    difficulty: "Advanced",
    bpm: 82,
    goal: "Keep tremolo even across accented beats.",
    tab: "G|-0-0-0-0-2-2-2-2-4-4-4-4-5-5-5-5-|\nD|-------------------------------------|\nA|-------------------------------------|\nE|-------------------------------------|\nB|-------------------------------------|\nF: 0       1       3       4",
    picking: "D U D U with accent on every fourth note.",
    mistake: "Tensing the forearm during longer tremolo bursts."
  }
];

function randomExercise(progress = {}, options = {}) {
  const recent = new Set(progress.lastExerciseIds || []);
  const instrument = options.instrument || "all";
  const instrumentPool = EXERCISE_BANK.filter((exercise) => matchesInstrument(exercise, instrument));
  const pool = instrumentPool.filter((exercise) => !recent.has(exercise.id));
  return randomItem(pool.length ? pool : instrumentPool.length ? instrumentPool : EXERCISE_BANK);
}

function generateWorkout(minutes = 20, progress = {}, options = {}) {
  const count = minutes <= 10 ? 3 : minutes <= 20 ? 5 : 7;
  const picked = [];
  const used = new Set();
  const poolLimit = EXERCISE_BANK.filter((exercise) => matchesInstrument(exercise, options.instrument || "all")).length || EXERCISE_BANK.length;
  while (picked.length < count && used.size < poolLimit) {
    const exercise = randomExercise({ lastExerciseIds: [...used, ...(progress.lastExerciseIds || [])] }, options);
    if (!used.has(exercise.id)) {
      used.add(exercise.id);
      picked.push(exercise);
    }
  }
  return picked;
}

function tempoLadder(base) {
  return [base, base + 5, base + 10, base + 15].join(" / ");
}

function matchesInstrument(exercise, instrument) {
  if (instrument === "all") return true;
  const exerciseInstrument = exercise.instrument || "guitar";
  return exerciseInstrument === instrument;
}

/* src/features/metronome.js */
function createMetronome(storage = null) {
  const state = { bpm: 90, meter: 4, beat: 0, playing: false, timer: null, audio: null };

  async function bind() {
    const toggle = document.querySelector("#metroToggle");
    const bpm = document.querySelector("#metroBpm");
    const slider = document.querySelector("#metroSlider");
    const minus = document.querySelector("#metroMinus");
    const plus = document.querySelector("#metroPlus");
    const meter = document.querySelector("#metroSignature");
    const saved = await storage?.getSetting("metronome", null);
    if (saved) {
      state.bpm = Number(saved.bpm || state.bpm);
      state.meter = Number(saved.meter || state.meter);
      slider.value = String(state.bpm);
      meter.value = String(state.meter);
    }
    toggle.addEventListener("click", () => (state.playing ? stop() : start()));
    slider.addEventListener("input", () => setBpm(Number(slider.value)));
    minus.addEventListener("click", () => setBpm(state.bpm - 1));
    plus.addEventListener("click", () => setBpm(state.bpm + 1));
    meter.addEventListener("change", () => {
      state.meter = Number(meter.value);
      state.beat = 0;
      savePrefs();
      restart();
      render();
    });
    render();
  }

  function start() {
    ensureAudio();
    state.playing = true;
    state.beat = 0;
    tick();
    restart();
    render();
  }

  function stop() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
    state.playing = false;
    state.beat = 0;
    render();
  }

  function restart() {
    if (state.timer) clearInterval(state.timer);
    if (state.playing) state.timer = setInterval(tick, 60000 / state.bpm);
  }

  function setBpm(value) {
    state.bpm = Math.max(40, Math.min(220, Math.round(value)));
    savePrefs();
    restart();
    render();
  }

  function tick() {
    state.beat = (state.beat % state.meter) + 1;
    click(state.beat === 1);
    render();
  }

  function ensureAudio() {
    if (!state.audio) state.audio = new (window.AudioContext || window.webkitAudioContext)();
    if (state.audio.state === "suspended") state.audio.resume();
  }

  function click(accent) {
    if (!state.audio) return;
    const oscillator = state.audio.createOscillator();
    const gain = state.audio.createGain();
    const now = state.audio.currentTime;
    oscillator.frequency.value = accent ? 1320 : 880;
    oscillator.type = "square";
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(accent ? 0.22 : 0.12, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    oscillator.connect(gain);
    gain.connect(state.audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.065);
  }

  function render() {
    document.querySelector("#metroBpm").textContent = String(state.bpm);
    document.querySelector("#metroSlider").value = String(state.bpm);
    document.querySelector("#metroToggle").textContent = state.playing ? "Stop" : "Play";
    document.querySelector("#metroToggle").setAttribute("aria-pressed", String(state.playing));
    const dots = document.querySelector("#metroDots");
    dots.innerHTML = "";
    for (let beat = 1; beat <= state.meter; beat += 1) {
      const dot = document.createElement("span");
      dot.className = "metro-dot" + (state.playing && beat === state.beat ? " is-active" : "") + (beat === 1 ? " is-accent" : "");
      dot.textContent = String(beat);
      dots.append(dot);
    }
  }

  function savePrefs() {
    storage?.setSetting("metronome", { bpm: state.bpm, meter: state.meter });
  }

  return { state, bind, start, stop, setBpm };
}

/* src/features/trainer.js */
function initPractice({ instruments, progress, save }) {
  const state = { instrument: instruments.guitar, mode: "notes", target: 0, score: progress.score || 0, streak: progress.streak || 0, selected: new Set(), showAllNotes: false, fretRange: "all" };
  populateSelect("#practiceInstrument", Object.values(instruments).map((item) => [item.id, item.label]));
  populateSelect("#practiceRoot", noteOptions());
  populateSelect("#practiceChord", CHORD_TYPES.map((chord) => [chord.id, chord.label]));
  populateSelect("#practiceScale", SCALE_TYPES.map((scale) => [scale.id, scale.label]));

  document.querySelector("#practiceInstrument").addEventListener("change", (event) => {
    state.instrument = instruments[event.target.value];
    state.selected.clear();
    render();
  });
  document.querySelectorAll("[data-practice-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-practice-mode]").forEach((item) => item.classList.toggle("is-active", item === button));
      state.mode = button.dataset.practiceMode;
      state.selected.clear();
      render();
    });
  });
  document.querySelectorAll("[data-practice-frets]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-practice-frets]").forEach((item) => item.classList.toggle("is-active", item === button));
      state.fretRange = button.dataset.practiceFrets;
      render();
    });
  });
  ["#practiceRoot", "#practiceChord", "#practiceScale"].forEach((selector) => {
    document.querySelector(selector).addEventListener("change", () => {
      state.selected.clear();
      render();
    });
  });
  document.querySelector("#practiceShowAllNotes").addEventListener("change", (event) => {
    state.showAllNotes = event.target.checked;
    render();
  });
  document.querySelector("#practiceNew").addEventListener("click", () => {
    state.target = Math.floor(Math.random() * 12);
    state.selected.clear();
    render();
  });
  document.querySelector("#practiceReveal").addEventListener("click", () => {
    if (state.mode !== "chords") state.selected.clear();
    render(state.mode !== "chords");
  });
  document.querySelector("#practiceCheck").addEventListener("click", () => check());
  state.target = Math.floor(Math.random() * 12);
  render();

  function render(reveal = false) {
    const root = Number(document.querySelector("#practiceRoot").value);
    const chord = CHORD_BY_ID[document.querySelector("#practiceChord").value];
    const scale = SCALE_BY_ID[document.querySelector("#practiceScale").value];
    document.querySelector("#practiceScore").textContent = String(state.score);
    document.querySelector("#practiceStreak").textContent = String(state.streak);
    document.querySelector("#practiceTarget").textContent = state.mode === "notes" ? noteName(state.target) : state.mode === "chords" ? chord.label : scale.label;
    const chordToneIndexes = state.mode === "chords" ? chordNotes(root, chord) : [];
    const scaleIntervals = state.mode === "scales" ? scale.intervals : [];
    const shouldShowChordShape = state.mode === "chords" && state.selected.size > 0;
    renderFretboard(document.querySelector("#practiceBoard"), state.instrument, {
      frets: visibleFrets(state.instrument, state.fretRange),
      split: false,
      root,
      chordNotes: shouldShowChordShape ? chordToneIndexes : [],
      chordToneKeys: shouldShowChordShape ? state.selected : [],
      scaleIntervals: reveal || state.mode === "scales" ? scaleIntervals : [],
      labelMode: state.mode === "scales" ? "degree" : "note",
      showNames: reveal,
      showAllNotes: state.showAllNotes,
      activeKeys: state.selected,
      activeClass: state.mode === "chords" ? "caged-shape" : "selected",
      muted: state.mode === "scales",
      onClick: (position) => {
        state.selected.add(position.key);
        if (state.mode === "notes" && position.note === state.target) score(true);
        render();
      }
    });
    renderPracticeVoicings(root, chord);
  }

  function renderPracticeVoicings(root, chord) {
    const box = document.querySelector("#practiceVoicings");
    box.innerHTML = "";
    if (state.mode !== "chords") return;
    const notes = chordNotes(root, chord);
    const groups = state.instrument.voicingGroups || [];
    groupVoicings(state.instrument, notes, root, groups, { requiredNotes: notes }).forEach(({ group, voicings }) => {
      if (!voicings.length) return;
      const section = document.createElement("section");
      section.className = "mini-section";
      const head = document.createElement("strong");
      head.textContent = group.title;
      section.append(head);
      voicings.slice(0, 4).forEach((voicing, index) => {
        section.append(renderVoicingCard(state.instrument, voicing, {
          button: true,
          title: `Shape ${index + 1}`,
          meta: "Tap to highlight",
          onClick: () => {
            state.selected = new Set(voicing.positions.map((position) => `${position.stringIndex}:${position.fret}`));
            render();
          }
        }));
      });
      box.append(section);
    });
  }

  function check() {
    if (!state.selected.size) return;
    score(true);
    render();
  }

  function score(ok) {
    state.score += ok ? 1 : 0;
    state.streak = ok ? state.streak + 1 : 0;
    progress.score = state.score;
    progress.streak = state.streak;
    save();
  }
}

function visibleFrets(instrument, rangeMode) {
  const end = rangeMode === "all" ? instrument.maxFret : Math.min(instrument.maxFret, Number(rangeMode));
  return range(0, end);
}

function noteOptions() {
  return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map((note, index) => [String(index), note]);
}

function populateSelect(selector, options) {
  const select = document.querySelector(selector);
  select.innerHTML = "";
  options.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
}

/* src/features/progressions.js */
function initProgressions({ instruments, metronome }) {
  const state = { instrument: instruments.guitar, genre: "Blues", key: 0, difficulty: "Intermediate", chords: [], playingIndex: -1, player: null };
  state.player = createProgressionPlayer({
    onStep: (index) => {
      state.playingIndex = index;
      renderChordStrip(state.chords);
      document.querySelector("#progressionPlaybackStatus").textContent = `Playing ${state.chords[index]?.label || ""}`;
    },
    onStop: () => {
      state.playingIndex = -1;
      document.querySelector("#progressionPlaybackStatus").textContent = "";
      renderChordStrip(state.chords);
    }
  });
  populate("#loopInstrument", Object.values(instruments).map((item) => [item.id, item.label]));
  populate("#progressionGenre", PROGRESSION_SETS.map((set) => [set.genre, set.genre]));
  populate("#progressionKey", noteOptions());
  populate("#loopDifficulty", ["Beginner", "Intermediate", "Advanced"].map((item) => [item, item]));
  refreshProgressions();
  ["#loopInstrument", "#progressionGenre", "#progressionKey", "#progressionSelect", "#loopDifficulty", "#customProgression"].forEach((selector) => {
    document.querySelector(selector).addEventListener("input", render);
  });
  document.querySelector("#progressionPlay").addEventListener("click", playProgression);
  document.querySelector("#progressionStop").addEventListener("click", () => state.player.stop());
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.tab !== "progressions") state.player.stop();
    });
  });
  document.querySelector("#progressionGenre").addEventListener("change", refreshProgressions);
  render();

  function render() {
    state.instrument = instruments[document.querySelector("#loopInstrument").value];
    state.genre = document.querySelector("#progressionGenre").value;
    state.key = Number(document.querySelector("#progressionKey").value);
    state.difficulty = document.querySelector("#loopDifficulty").value;
    const progression = getProgression();
    const custom = document.querySelector("#customProgression").value.trim();
    const chords = custom ? parseCustomProgression(custom) : transposeProgression(progression.numerals, state.key);
    state.chords = chords;
    state.playingIndex = -1;
    state.player.stop();
    if (!chords.length) {
      document.querySelector("#progressionTitle").textContent = "Custom progression";
      document.querySelector("#progressionRoman").textContent = "";
      document.querySelector("#progressionPlaybackStatus").textContent = "";
      ["#progressionChords", "#scaleSuggestions", "#progressionVoicingGroups"].forEach((selector) => document.querySelector(selector).innerHTML = "");
      return;
    }
    document.querySelector("#progressionTitle").textContent = custom ? "Custom progression" : progression.name;
    document.querySelector("#progressionRoman").textContent = custom ? chords.map((chord) => chord.label).join(" - ") : progression.numerals.join(" - ");
    renderChordStrip(chords);
    renderSuggestions(chords);
    renderVoicingGroups(chords);
  }

  function refreshProgressions() {
    const set = PROGRESSION_SETS.find((item) => item.genre === document.querySelector("#progressionGenre").value) || PROGRESSION_SETS[0];
    populate("#progressionSelect", set.progressions.map((item, index) => [String(index), item.name]));
  }

  function getProgression() {
    const set = PROGRESSION_SETS.find((item) => item.genre === document.querySelector("#progressionGenre").value) || PROGRESSION_SETS[0];
    return set.progressions[Number(document.querySelector("#progressionSelect").value)] || set.progressions[0];
  }

  function renderChordStrip(chords) {
    const box = document.querySelector("#progressionChords");
    box.innerHTML = "";
    chords.forEach((chord, index) => {
      const card = document.createElement("div");
      card.className = `progression-chord${index === state.playingIndex ? " is-playing" : ""}`;
      card.innerHTML = `<strong>${chord.label}</strong><span>${chord.numeral || ""}</span>`;
      box.append(card);
    });
  }

  function renderSuggestions(chords) {
    const suggestions = recommendationsForProgression(chords, { genre: state.genre, difficulty: state.difficulty });
    const box = document.querySelector("#scaleSuggestions");
    box.innerHTML = "";
    suggestions.forEach(({ chord, recommendations }) => {
      const best = recommendations[0];
      const card = document.createElement("div");
      card.className = "suggestion-card";
      card.innerHTML = `<strong>${chord.label}</strong><span>${chord.numeral || ""}</span><span>${best.chordTones.join(" ")} | Target ${best.emphasize.join(" ")}</span>`;
      box.append(card);
    });
  }

  function renderVoicingGroups(chords) {
    const unique = uniqueChords(chords);
    const box = document.querySelector("#progressionVoicingGroups");
    box.innerHTML = "";
    state.instrument.voicingGroups.forEach((group) => {
      const diagrams = unique.map((chord) => {
        const chordType = CHORD_BY_ID[chord.type] || CHORD_BY_ID.maj;
        const notes = chordNotes(chord.root, chordType);
        const voicing = groupVoicings(state.instrument, notes, chord.root, [group], { requiredNotes: notes })[0].voicings[0];
        return voicing ? { chord, voicing } : null;
      });
      if (diagrams.some((item) => !item)) return;
      const section = document.createElement("section");
      section.className = "voicing-group";
      section.innerHTML = `<div class="voicing-group-head"><strong>${group.title}</strong><span>${group.detail}</span></div>`;
      const grid = document.createElement("div");
      grid.className = "diagram-grid";
      diagrams.forEach(({ chord, voicing }) => {
        const card = document.createElement("div");
        card.className = "diagram-card";
        const title = document.createElement("strong");
        title.textContent = chord.label;
        card.append(title, renderChordDiagram(state.instrument, voicing));
        grid.append(card);
      });
      section.append(grid);
      box.append(section);
    });
  }

  function playProgression() {
    if (!state.chords.length) return;
    metronome?.stop();
    document.querySelector("#progressionPlaybackStatus").textContent = "Starting MIDI preview...";
    state.player.play(state.chords, { tempo: metronome?.state?.bpm || 90, repeats: 1, maxNotes: 5, octave: 4 });
  }
}

function parseCustomProgression(text) {
  return text.split(/[\s,|-]+/).filter(Boolean).map((token) => parseChordSymbol(token)).filter(Boolean);
}

function uniqueChords(chords) {
  const seen = new Set();
  return chords.filter((chord) => {
    const key = `${chord.root}:${chord.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function noteOptions() {
  return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map((note, index) => [String(index), note]);
}

function populate(selector, options) {
  const select = document.querySelector(selector);
  select.innerHTML = "";
  options.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
}

/* src/features/caged.js */
function initCaged() {
  const state = { root: 0, shapeId: "C", mode: "chord", scaleId: "majorPent", positionIndex: 0, fretRange: "all" };
  populate("#cagedRoot", noteOptions());
  populate("#cagedShape", CAGED_SHAPES.map((shape) => [shape.id, shape.label]));
  populate("#cagedMode", [["chord", "Chord shape"], ["scale", "Scale overlay"], ["both", "Chord + scale"]]);
  populate("#cagedScale", SCALE_TYPES.map((scale) => [scale.id, scale.label]));
  document.querySelector("#cagedScale").value = state.scaleId;

  ["#cagedRoot", "#cagedShape", "#cagedMode", "#cagedScale"].forEach((selector) => {
    document.querySelector(selector).addEventListener("input", () => {
      state.root = Number(document.querySelector("#cagedRoot").value);
      state.shapeId = document.querySelector("#cagedShape").value;
      state.mode = document.querySelector("#cagedMode").value;
      state.scaleId = document.querySelector("#cagedScale").value;
      state.positionIndex = 0;
      render();
    });
  });
  document.querySelector("#cagedShowAllNotes").addEventListener("change", render);
  document.querySelectorAll("[data-caged-frets]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-caged-frets]").forEach((item) => item.classList.toggle("is-active", item === button));
      state.fretRange = button.dataset.cagedFrets;
      render();
    });
  });
  render();

  function render() {
    const shape = CAGED_SHAPES.find((item) => item.id === state.shapeId) || CAGED_SHAPES[0];
    const positions = cagedPositions(shape, state.root);
    const chordToneIndexes = state.mode !== "scale" ? chordNotes(state.root, CHORD_BY_ID.maj) : [];
    const scale = SCALE_BY_ID[state.scaleId] || SCALE_BY_ID.majorPent;
    const activeScale = state.mode !== "chord" ? scale.intervals : [];
    const activeKeys = positions.flatMap((position) => position.keys);
    document.querySelector("#cagedTitle").textContent = `${noteName(state.root)} ${shape.label}`;
    document.querySelector("#cagedRangeLabel").textContent = rangeLabel(guitar, state.fretRange);
    renderFretboard(document.querySelector("#cagedBoard"), guitar, {
      frets: visibleFrets(guitar, state.fretRange),
      split: false,
      root: state.root,
      chordNotes: chordToneIndexes,
      scaleIntervals: activeScale,
      activeKeys,
      activeClass: "caged-shape",
      labelMode: state.mode === "chord" ? "note" : "degree",
      showAllNotes: document.querySelector("#cagedShowAllNotes").checked,
      muted: true
    });
    renderPositionCards();
    renderOpenChords();
  }

  function renderPositionCards() {
    const box = document.querySelector("#cagedPositions");
    box.innerHTML = "";
    CAGED_SHAPES.forEach((shape) => {
      const positions = cagedPositions(shape, state.root);
      const position = positions[0];
      const button = document.createElement("button");
      button.className = "caged-card" + (shape.id === state.shapeId ? " is-active" : "");
      button.type = "button";
      button.innerHTML = `<span class="caged-card-title">${shape.label}</span><span class="caged-card-range">${position ? rangeText(position) : "out of range"}</span><span class="caged-fret-row">${position ? position.frets.map((fret) => `<span${fret === 0 ? " class=\"is-open\"" : ""}>${fret === null ? "x" : fret}</span>`).join("") : ""}</span>`;
      button.addEventListener("click", () => {
        state.shapeId = shape.id;
        document.querySelector("#cagedShape").value = shape.id;
        state.positionIndex = 0;
        render();
      });
      box.append(button);
    });
  }
}

function visibleFrets(instrument, rangeMode) {
  const end = rangeMode === "all" ? instrument.maxFret : Math.min(instrument.maxFret, Number(rangeMode));
  return range(0, end);
}

function rangeLabel(instrument, rangeMode) {
  const end = rangeMode === "all" ? instrument.maxFret : Math.min(instrument.maxFret, Number(rangeMode));
  return `Frets 0-${end}`;
}

function rangeText(position) {
  return `${position.minFret === 0 ? "open" : `${position.minFret}fr`} to ${position.maxFret}fr`;
}

function renderOpenChords() {
  const box = document.querySelector("#cagedOpenChords");
  if (box.dataset.rendered === "true") return;
  box.dataset.rendered = "true";
  box.innerHTML = "";
  OPEN_GUITAR_CHORDS.forEach((chord) => {
    const card = document.createElement("div");
    card.className = "diagram-card";
    const title = document.createElement("strong");
    title.textContent = chord.name;
    const voicing = {
      lowToHigh: chord.frets,
      courseOrder: guitar.lowToHigh,
      positions: chord.frets.flatMap((fret, lowIndex) => fret === null ? [] : [{ stringIndex: guitar.lowToHigh[lowIndex], fret }])
    };
    card.append(title, renderChordDiagram(guitar, voicing));
    box.append(card);
  });
}

function cagedPositions(shape, root) {
  const positions = [];
  for (let offset = 0; offset <= guitar.maxFret; offset += 1) {
    if ((shape.baseRoot + offset) % 12 !== root) continue;
    const frets = shape.frets.map((fret) => fret === null ? null : fret + offset);
    if (frets.some((fret) => fret !== null && fret > guitar.maxFret)) continue;
    const used = frets.filter((fret) => fret !== null);
    const keys = frets.flatMap((fret, lowIndex) => fret === null ? [] : `${guitar.lowToHigh[lowIndex]}:${fret}`);
    positions.push({ offset, frets, keys, minFret: Math.min(...used), maxFret: Math.max(...used) });
  }
  return positions;
}

function noteOptions() {
  return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map((note, index) => [String(index), note]);
}

function populate(selector, options) {
  const select = document.querySelector(selector);
  select.innerHTML = "";
  options.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
}

/* src/features/cuatro-encyclopedia.js */
function initCuatroEncyclopedia() {
  const state = { root: 0, chordId: "maj", scaleId: "ionian", fretRange: "all", inversion: "all", selected: new Set() };
  populate("#cuatroRoot", noteOptions());
  populate("#cuatroChord", CHORD_TYPES.map((chord) => [chord.id, chord.label]));
  populate("#cuatroScale", SCALE_TYPES.map((scale) => [scale.id, scale.label]));
  populate("#cuatroInversion", [["all", "All inversions"], ["Root", "Root position"], ["First", "First inversion"], ["Second", "Second inversion"], ["Third", "Third inversion"]]);

  ["#cuatroRoot", "#cuatroChord", "#cuatroScale", "#cuatroInversion", "#cuatroShowAllNotes"].forEach((selector) => {
    document.querySelector(selector).addEventListener("input", () => {
      if (selector !== "#cuatroShowAllNotes") state.selected.clear();
      state.root = Number(document.querySelector("#cuatroRoot").value);
      state.chordId = document.querySelector("#cuatroChord").value;
      state.scaleId = document.querySelector("#cuatroScale").value;
      state.inversion = document.querySelector("#cuatroInversion").value;
      render();
    });
  });
  document.querySelectorAll("[data-cuatro-frets]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-cuatro-frets]").forEach((item) => item.classList.toggle("is-active", item === button));
      state.fretRange = button.dataset.cuatroFrets;
      render();
    });
  });
  document.querySelector("#translateChord").addEventListener("input", renderTranslate);
  render();
  renderTranslate();

  function render() {
    const chord = CHORD_BY_ID[state.chordId] || CHORD_BY_ID.maj;
    const notes = chordNotes(state.root, chord);
    const scale = SCALE_BY_ID[state.scaleId] || SCALE_BY_ID.ionian;
    document.querySelector("#cuatroChordName").textContent = `${noteName(state.root)}${chord.suffix}`;
    document.querySelector("#cuatroFormula").textContent = chord.formula;
    document.querySelector("#cuatroTones").textContent = notes.map((note, index) => `${noteName(note)} ${DEGREE_LABELS[chord.intervals[index] % 12] || ""}`).join("  ");
    document.querySelector("#cuatroCourseInfo").textContent = `${cuatro.courseOrderText} | ${cuatro.pairingText}`;
    renderFretboard(document.querySelector("#cuatroBoard"), cuatro, {
      frets: visibleFrets(cuatro, state.fretRange),
      split: false,
      root: state.root,
      chordNotes: notes,
      scaleIntervals: scale.intervals,
      labelMode: "degree",
      showAllNotes: document.querySelector("#cuatroShowAllNotes").checked,
      activeKeys: state.selected,
      activeClass: "caged-shape",
      muted: true
    });
    renderVoicings(chord, notes);
  }

  function renderVoicings(chord, notes) {
    const box = document.querySelector("#cuatroVoicings");
    box.innerHTML = "";
    const required = requiredForCuatro(chord, state.root);
    const groups = visibleGroupsForChord(chord);
    groupVoicings(cuatro, notes, state.root, groups, {
      requiredNotes: required,
      requireRoot: chord.intervals.length <= 5
    }).forEach(({ group, voicings }) => {
      const filtered = filterInversion(voicings, state.inversion, state.root);
      const section = document.createElement("section");
      section.className = "voicing-group";
      section.innerHTML = `<div class="voicing-group-head"><strong>${group.title}</strong><span>${group.detail}</span></div>`;
      if (!filtered.length) {
        const empty = document.createElement("p");
        empty.className = "hint";
        empty.textContent = "No clean, compact shapes found here. Try a nearby fret area or a simpler chord type.";
        section.append(empty);
      } else {
        const grid = document.createElement("div");
        grid.className = "voicing-card-grid";
        filtered.forEach((voicing) => grid.append(renderCuatroVoicingCard(voicing, chord, state.root, "", () => selectVoicing(voicing))));
        section.append(grid);
      }
      box.append(section);
    });
    if (chord.intervals.length > 3) {
      const note = document.createElement("p");
      note.className = "inline-note";
      note.textContent = chord.intervals.length > 5
        ? "Extended chords show practical complete shells: root, guide tones, and color tones. Extra fifths or duplicate colors are optional."
        : "Three-course shapes are hidden for this chord so incomplete grips are not labeled as full voicings.";
      box.prepend(note);
    }
  }

  function renderTranslate() {
    const raw = document.querySelector("#translateChord").value.trim() || "G7";
    const parsed = parseChordSymbol(raw);
    const box = document.querySelector("#translateResults");
    box.innerHTML = "";
    if (!parsed) {
      box.textContent = "Enter a chord like C, Am7, G7, F#m7b5, or D9.";
      return;
    }
    const chord = CHORD_BY_ID[parsed.type] || CHORD_BY_ID.maj;
    const notes = chordNotes(parsed.root, chord);
    const required = requiredForCuatro(chord, parsed.root);
    const groups = visibleGroupsForChord(chord);
    const title = document.createElement("strong");
    title.textContent = `Cuatro options for ${parsed.label}`;
    box.append(title);
    groupVoicings(cuatro, notes, parsed.root, groups, { requiredNotes: required })
      .flatMap(({ voicings }) => voicings.slice(0, 2))
      .slice(0, 8)
      .forEach((voicing) => box.append(renderCuatroVoicingCard(voicing, chord, parsed.root, "", () => {
        state.root = parsed.root;
        state.chordId = parsed.type;
        document.querySelector("#cuatroRoot").value = String(parsed.root);
        document.querySelector("#cuatroChord").value = parsed.type;
        selectVoicing(voicing);
      })));
  }

  function selectVoicing(voicing) {
    state.selected = new Set(voicing.positions.map((position) => `${position.stringIndex}:${position.fret}`));
    render();
  }
}

function renderCuatroVoicingCard(voicing, chord, root, tag = "", onClick = null) {
  const names = voicingNoteNames(cuatro, voicing);
  const metaParts = [
    inversionName(cuatro, voicing, root),
    `frets ${voicing.lowToHigh.map((fret) => fret === null ? "x" : fret).join("-")}`,
    names.join(" ")
  ];
  const card = renderVoicingCard(cuatro, voicing, {
    button: Boolean(onClick),
    title: tag ? tag : "",
    meta: metaParts.filter(Boolean).join(" | "),
    onClick
  });
  const intervals = document.createElement("div");
  intervals.className = "interval-row";
  intervals.textContent = `Intervals: ${voicing.covered.map((note) => intervalName(note, chord, root)).join(" ")}`;
  card.append(intervals);
  return card;
}

function visibleFrets(instrument, rangeMode) {
  const end = rangeMode === "all" ? instrument.maxFret : Math.min(instrument.maxFret, Number(rangeMode));
  return range(0, end);
}

function requiredForCuatro(chord, root) {
  return chord.intervals.length > 5 ? chordEssentialNotes(root, chord) : chordNotes(root, chord);
}

function visibleGroupsForChord(chord) {
  if (chord.intervals.length <= 3) return cuatro.voicingGroups;
  return cuatro.voicingGroups.filter((group) => !group.threeCourse);
}

function filterInversion(voicings, wanted, root) {
  if (wanted === "all") return voicings;
  return voicings.filter((voicing) => inversionName(cuatro, voicing, root).startsWith(wanted));
}

function intervalName(note, chord, root) {
  const relative = (note - root + 12) % 12;
  const found = chord.intervals.find((interval) => (interval % 12) === relative);
  return found === undefined ? "" : DEGREE_LABELS[found % 12] || "";
}

function noteOptions() {
  return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map((note, index) => [String(index), note]);
}

function populate(selector, options) {
  const select = document.querySelector(selector);
  select.innerHTML = "";
  options.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
}

/* src/features/aerobics-ui.js */
function initAerobics({ progress, save }) {
  progress.aerobics ||= { completed: {}, lastExerciseIds: [], lastPracticed: "" };
  const state = { current: randomExercise(progress.aerobics), workout: [], minutes: 10, instrument: "all" };

  document.querySelector("#aerobicsRandom").addEventListener("click", () => {
    state.current = randomExercise(progress.aerobics, { instrument: state.instrument });
    render();
  });
  document.querySelector("#aerobicsInstrument").addEventListener("change", (event) => {
    state.instrument = event.target.value;
    state.current = randomExercise(progress.aerobics, { instrument: state.instrument });
    state.workout = generateWorkout(state.minutes, progress.aerobics, { instrument: state.instrument });
    render();
    renderWorkout(state.minutes);
  });
  [10, 20, 30].forEach((minutes) => {
    document.querySelector(`#workout${minutes}`).addEventListener("click", () => {
      state.minutes = minutes;
      state.workout = generateWorkout(minutes, progress.aerobics, { instrument: state.instrument });
      renderWorkout(minutes);
    });
  });
  document.querySelector("#markComplete").addEventListener("click", () => {
    const today = new Date().toISOString().slice(0, 10);
    progress.aerobics.completed[state.current.id] = (progress.aerobics.completed[state.current.id] || 0) + 1;
    progress.aerobics.lastPracticed = today;
    progress.aerobics.lastExerciseIds = [state.current.id, ...(progress.aerobics.lastExerciseIds || [])].slice(0, 5);
    save();
    renderProgress();
  });
  render();
  state.workout = generateWorkout(10, progress.aerobics, { instrument: state.instrument });
  renderWorkout(10);

  function render() {
    document.querySelector("#aerobicExercise").innerHTML = exerciseHtml(state.current, true);
    renderProgress();
  }

  function renderWorkout(minutes) {
    state.workout = state.workout.length ? state.workout : generateWorkout(minutes, progress.aerobics, { instrument: state.instrument });
    const box = document.querySelector("#dailyWorkout");
    box.innerHTML = `<strong>${minutes}-minute workout</strong>`;
    state.workout.forEach((exercise, index) => {
      const card = document.createElement("article");
      card.className = "workout-item";
      card.innerHTML = `<span>${index + 1}</span><div class="workout-content">${exerciseHtml(exercise, false)}</div>`;
      card.addEventListener("click", () => {
        state.current = exercise;
        render();
      });
      box.append(card);
    });
  }

  function renderProgress() {
    const completed = Object.values(progress.aerobics.completed).reduce((sum, value) => sum + value, 0);
    document.querySelector("#aerobicsProgress").textContent = `${completed} completed | Last practiced: ${progress.aerobics.lastPracticed || "not yet"}`;
  }
}

function exerciseHtml(exercise, full) {
  return `
    <div class="exercise-head">
      <strong>${exercise.name}</strong>
      <span>${instrumentLabel(exercise)} | ${exercise.category} | ${exercise.difficulty} | ${exercise.bpm} BPM</span>
    </div>
    <p>${exercise.goal}</p>
    <pre class="tab-block">${exercise.tab}</pre>
    <div class="detail-grid">
      <span><b>Tempo ladder</b>${tempoLadder(exercise.bpm)}</span>
      <span><b>Picking</b>${exercise.picking}</span>
      ${full ? `<span><b>Common mistake</b>${exercise.mistake}</span><span><b>Safety</b>Stop if pain or sharp tension appears.</span>` : ""}
    </div>`;
}

function instrumentLabel(exercise) {
  return (exercise.instrument || "guitar") === "cuatro" ? "Puerto Rican Cuatro" : "Guitar";
}

/* src/main.js */
const instruments = { guitar, cuatro };

boot();

async function boot() {
  const storage = await createAppStorage();
  const progress = await storage.loadProgress();
  const save = () => storage.saveProgress(progress);

  await bindTabs(storage);
  const metronome = createMetronome(storage);
  await metronome.bind();
  initPractice({ instruments, progress, save });
  initProgressions({ instruments, metronome });
  initLoopCompanion({ instruments, storage, metronome });
  initCaged();
  initCuatroEncyclopedia();
  initAerobics({ progress, save });
  bindNetworkStatus();
  bindDataTools(storage);
  bindControlSettings(storage);
  registerServiceWorker();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const register = () => {
      navigator.serviceWorker.register("./service-worker.js").catch((error) => {
        console.info("Service worker registration skipped:", error.message);
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register);
  }
}

function bindNetworkStatus() {
  const status = document.querySelector("#networkStatus");
  const render = () => {
    status.classList.toggle("is-offline", !navigator.onLine);
    status.textContent = navigator.onLine ? "Online" : "Offline mode";
  };
  window.addEventListener("online", render);
  window.addEventListener("offline", render);
  render();
}

function bindDataTools(storage) {
  const exportButton = document.querySelector("#exportData");
  const importButton = document.querySelector("#importData");
  const fileInput = document.querySelector("#importDataFile");
  exportButton.addEventListener("click", async () => {
    const data = await storage.exportAllData();
    downloadBlob(`string-lab-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), "application/json");
  });
  importButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!confirm("Import this backup and overwrite saved String Lab data on this iPad?")) return;
    await storage.importAllData(await file.text());
    location.reload();
  });
}

function bindControlSettings(storage) {
  const controls = [
    ["practiceInstrument", "lastInstrument"],
    ["practiceRoot", "lastPracticeKey"],
    ["practiceScale", "lastPracticeScale"],
    ["progressionKey", "lastProgressionKey"],
    ["loopInstrument", "lastProgressionInstrument"],
    ["cagedRoot", "lastCagedKey"],
    ["cagedScale", "lastCagedScale"],
    ["cuatroRoot", "lastCuatroKey"],
    ["cuatroScale", "lastCuatroScale"]
  ];
  controls.forEach(([id, key]) => {
    const element = document.getElementById(id);
    if (!element) return;
    storage.getSetting(key, null).then((value) => {
      if (value !== null && Array.from(element.options || []).some((option) => option.value === String(value))) {
        element.value = String(value);
        element.dispatchEvent(new Event("change", { bubbles: true }));
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    element.addEventListener("change", () => storage.setSetting(key, element.value));
    element.addEventListener("input", () => storage.setSetting(key, element.value));
  });
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
})();
