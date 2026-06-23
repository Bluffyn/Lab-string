import { CHORD_BY_ID, chordNotes, parseChordSymbol } from "../core/chords.js";
import { PROGRESSION_SETS, transposeProgression } from "../core/roman-numerals.js";
import { groupVoicings } from "../core/voicings.js";
import { renderChordDiagram } from "../ui/diagrams.js";
import { recommendationsForProgression } from "./scale-over-chord.js";
import { createProgressionPlayer } from "./progression-player.js";

export function initProgressions({ instruments, metronome }) {
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
