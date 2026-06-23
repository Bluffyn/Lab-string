import { DEGREE_LABELS, midiToNoteIndex, mod, noteName, range } from "../core/notes.js";

export function renderFretboard(container, instrument, options = {}) {
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
