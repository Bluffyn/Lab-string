import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CHORD_BY_ID, chordNotes } from "../src/core/chords.js";
import { mod, noteIndex, noteName } from "../src/core/notes.js";
import { transposeProgression } from "../src/core/roman-numerals.js";
import { SCALE_BY_ID, scaleNotes } from "../src/core/scales.js";
import { groupVoicings } from "../src/core/voicings.js";
import { cuatro } from "../src/instruments/cuatro.js";
import { generateLoopPlan, midiBytesForPlan } from "../src/features/loop-companion.js";
import { recommendationsForProgression, recommendScalesForChord } from "../src/features/scale-over-chord.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

assert.equal(noteIndex("C#"), 1);
assert.equal(noteIndex("Db"), 1);
assert.equal(noteName(13), "C#");
assert.equal(mod(-1), 11);

assert.deepEqual(chordNotes(0, CHORD_BY_ID.maj7), [0, 4, 7, 11]);
assert.deepEqual(scaleNotes(2, SCALE_BY_ID.dorian), [2, 4, 5, 7, 9, 11, 0]);

const majorTwoFiveOne = transposeProgression(["ii7", "V7", "Imaj7"], 0);
assert.deepEqual(majorTwoFiveOne.map((chord) => chord.label), ["Dm7", "G7", "Cmaj7"]);

const popProgression = transposeProgression(["I", "V", "vi", "IV"], 7);
assert.deepEqual(popProgression.map((chord) => chord.label), ["G", "D", "Em", "C"]);

assert.equal(recommendScalesForChord({ root: 7, type: "dom7", label: "G7" }, { difficulty: "Beginner" })[0].scaleId, "mixolydian");
assert(recommendScalesForChord({ root: 11, type: "halfdim", label: "Bm7b5" }, { difficulty: "Advanced" }).some((item) => item.scaleId === "locrianNat2"));
assert(recommendScalesForChord({ root: 1, type: "dim7", label: "C#dim7" }, { difficulty: "Intermediate" }).some((item) => item.scaleId === "dimWH"));

const minorTwoFive = recommendationsForProgression(transposeProgression(["iiø", "V7", "i"], 9), { difficulty: "Advanced", minorKey: true });
assert(minorTwoFive[1].recommendations.some((item) => item.scaleId === "phrygianDominant"));

const blues = recommendationsForProgression(transposeProgression(["I7", "IV7", "V7"], 0), { genre: "Blues", difficulty: "Intermediate" });
assert(blues.every((item) => item.recommendations.some((rec) => rec.scaleId === "majorBlues" || rec.scaleId === "minorBlues")));

const reggaeMinor = recommendationsForProgression(transposeProgression(["i", "bVII", "bVI", "bVII"], 9), { genre: "Reggae", difficulty: "Beginner" });
assert.equal(reggaeMinor[0].recommendations[0].scaleId, "dorian");

const dominantVamp = recommendScalesForChord({ root: 4, type: "dom7", label: "E7" }, { difficulty: "Advanced" });
assert(dominantVamp.some((item) => item.scaleId === "dimHW"));

const loopPlan = generateLoopPlan({ genre: "Blues", key: 0, tempo: 88, difficulty: "Beginner", scaleFocus: "minorBlues", bars: 4, seed: "test" });
assert.equal(loopPlan.chords.length, 4);
assert.deepEqual(loopPlan.romanNumerals, ["I7", "IV7", "I7", "V7"]);
assert.equal(loopPlan.chords[0].label, "C7");
assert(loopPlan.targetNotes.every((item) => item.compact.includes("3rd")));
const midi = midiBytesForPlan(loopPlan);
assert.equal(String.fromCharCode(...midi.slice(0, 4)), "MThd");

const cuatroCmaj = groupVoicings(cuatro, chordNotes(0, CHORD_BY_ID.maj), 0, cuatro.voicingGroups, { requiredNotes: chordNotes(0, CHORD_BY_ID.maj) });
assert(cuatroCmaj.some((group) => group.voicings.length > 0));
cuatroCmaj.flatMap((group) => group.voicings).forEach((voicing) => {
  assert(voicing.lowToHigh.length === voicing.courseOrder.length);
  assert(voicing.lowToHigh.every((fret) => fret === null || (fret >= 0 && fret <= cuatro.maxFret)));
  assert(chordNotes(0, CHORD_BY_ID.maj).every((note) => voicing.covered.includes(note)));
});

const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "install-ipad.html",
  "INSTALL-IPAD.md",
  "icon.svg",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  ...walkJs(path.join(rootDir, "src")).map((file) => path.relative(rootDir, file).replaceAll("\\", "/"))
];
const serviceWorker = fs.readFileSync(path.join(rootDir, "service-worker.js"), "utf8");
requiredFiles.forEach((file) => {
  assert(serviceWorker.includes(`./${file}`), `${file} missing from service worker precache`);
  assert(fs.existsSync(path.join(rootDir, file)), `${file} missing from app folder`);
});

JSON.parse(fs.readFileSync(path.join(rootDir, "manifest.webmanifest"), "utf8"));

console.log("String Lab tests passed");

function walkJs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkJs(absolute);
    return entry.isFile() && entry.name.endsWith(".js") ? [absolute] : [];
  });
}
