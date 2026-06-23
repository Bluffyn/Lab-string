import { CHORD_BY_ID, CHORD_TYPES, chordNotes } from "../core/chords.js";
import { noteName, randomItem, range } from "../core/notes.js";
import { SCALE_BY_ID, SCALE_TYPES, scaleNotes } from "../core/scales.js";
import { generateVoicings, groupVoicings } from "../core/voicings.js";
import { renderFretboard } from "../ui/fretboard-renderer.js";
import { renderVoicingCard } from "../ui/diagrams.js";

export function initPractice({ instruments, progress, save }) {
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
