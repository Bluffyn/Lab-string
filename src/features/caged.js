import { CHORD_BY_ID, chordNotes } from "../core/chords.js";
import { noteName, range } from "../core/notes.js";
import { SCALE_BY_ID, SCALE_TYPES, scaleNotes } from "../core/scales.js";
import { CAGED_SHAPES, OPEN_GUITAR_CHORDS, guitar } from "../instruments/guitar.js";
import { renderChordDiagram } from "../ui/diagrams.js";
import { renderFretboard } from "../ui/fretboard-renderer.js";

export function initCaged() {
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

export function cagedPositions(shape, root) {
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
