import { CHORD_BY_ID } from "../core/chords.js";
import { unique } from "../core/notes.js";

export function createProgressionPlayer({ onStep = null, onStop = null } = {}) {
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

export function chordMidiNotes(chord, octave = 4) {
  const type = CHORD_BY_ID[chord.type] || CHORD_BY_ID.maj;
  const base = 12 * (octave + 1) + chord.root;
  const intervals = unique(type.intervals.map((interval) => interval % 12));
  const tones = intervals.map((interval) => base + interval);
  const sorted = [base - 12, ...tones].sort((a, b) => a - b);
  return sorted.filter((note) => note >= 36 && note <= 88);
}

export function rhythmEventsForProgression(chords, options = {}) {
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

export function rhythmTokens(rhythmPattern) {
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
