import { CHORD_BY_ID, CHORD_TYPES, chordEssentialNotes, chordNotes, parseChordSymbol } from "../core/chords.js";
import { DEGREE_LABELS, noteName, range } from "../core/notes.js";
import { SCALE_BY_ID, SCALE_TYPES } from "../core/scales.js";
import { groupVoicings, inversionName, voicingNoteNames } from "../core/voicings.js";
import { cuatro } from "../instruments/cuatro.js";
import { renderVoicingCard } from "../ui/diagrams.js";
import { renderFretboard } from "../ui/fretboard-renderer.js";

export function initCuatroEncyclopedia() {
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
