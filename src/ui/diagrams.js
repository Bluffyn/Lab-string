import { midiToNoteIndex, noteName } from "../core/notes.js";
import { voicingNoteNames } from "../core/voicings.js";

export function renderVoicingCard(instrument, voicing, options = {}) {
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

export function renderChordDiagram(instrument, voicing) {
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
