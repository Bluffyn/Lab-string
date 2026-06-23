import { randomItem } from "../core/notes.js";

export const EXERCISE_BANK = [
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

export function randomExercise(progress = {}, options = {}) {
  const recent = new Set(progress.lastExerciseIds || []);
  const instrument = options.instrument || "all";
  const instrumentPool = EXERCISE_BANK.filter((exercise) => matchesInstrument(exercise, instrument));
  const pool = instrumentPool.filter((exercise) => !recent.has(exercise.id));
  return randomItem(pool.length ? pool : instrumentPool.length ? instrumentPool : EXERCISE_BANK);
}

export function generateWorkout(minutes = 20, progress = {}, options = {}) {
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

export function tempoLadder(base) {
  return [base, base + 5, base + 10, base + 15].join(" / ");
}

function matchesInstrument(exercise, instrument) {
  if (instrument === "all") return true;
  const exerciseInstrument = exercise.instrument || "guitar";
  return exerciseInstrument === instrument;
}
