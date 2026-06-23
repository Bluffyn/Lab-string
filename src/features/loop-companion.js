import { CHORD_BY_ID } from "../core/chords.js";
import { noteName, range, unique } from "../core/notes.js";
import { transposeProgression } from "../core/roman-numerals.js";
import { SCALE_BY_ID } from "../core/scales.js";
import { renderFretboard } from "../ui/fretboard-renderer.js";
import { chordMidiNotes, createProgressionPlayer, rhythmEventsForProgression } from "./progression-player.js";

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

export function initLoopCompanion({ instruments, storage, metronome = null }) {
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

export function generateLoopPlan(input = {}) {
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

export function midiBytesForPlan(plan) {
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
