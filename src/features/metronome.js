export function createMetronome(storage = null) {
  const state = { bpm: 90, meter: 4, beat: 0, playing: false, timer: null, audio: null };

  async function bind() {
    const toggle = document.querySelector("#metroToggle");
    const bpm = document.querySelector("#metroBpm");
    const slider = document.querySelector("#metroSlider");
    const minus = document.querySelector("#metroMinus");
    const plus = document.querySelector("#metroPlus");
    const meter = document.querySelector("#metroSignature");
    const saved = await storage?.getSetting("metronome", null);
    if (saved) {
      state.bpm = Number(saved.bpm || state.bpm);
      state.meter = Number(saved.meter || state.meter);
      slider.value = String(state.bpm);
      meter.value = String(state.meter);
    }
    toggle.addEventListener("click", () => (state.playing ? stop() : start()));
    slider.addEventListener("input", () => setBpm(Number(slider.value)));
    minus.addEventListener("click", () => setBpm(state.bpm - 1));
    plus.addEventListener("click", () => setBpm(state.bpm + 1));
    meter.addEventListener("change", () => {
      state.meter = Number(meter.value);
      state.beat = 0;
      savePrefs();
      restart();
      render();
    });
    render();
  }

  function start() {
    ensureAudio();
    state.playing = true;
    state.beat = 0;
    tick();
    restart();
    render();
  }

  function stop() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
    state.playing = false;
    state.beat = 0;
    render();
  }

  function restart() {
    if (state.timer) clearInterval(state.timer);
    if (state.playing) state.timer = setInterval(tick, 60000 / state.bpm);
  }

  function setBpm(value) {
    state.bpm = Math.max(40, Math.min(220, Math.round(value)));
    savePrefs();
    restart();
    render();
  }

  function tick() {
    state.beat = (state.beat % state.meter) + 1;
    click(state.beat === 1);
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
    oscillator.frequency.value = accent ? 1320 : 880;
    oscillator.type = "square";
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(accent ? 0.22 : 0.12, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    oscillator.connect(gain);
    gain.connect(state.audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.065);
  }

  function render() {
    document.querySelector("#metroBpm").textContent = String(state.bpm);
    document.querySelector("#metroSlider").value = String(state.bpm);
    document.querySelector("#metroToggle").textContent = state.playing ? "Stop" : "Play";
    document.querySelector("#metroToggle").setAttribute("aria-pressed", String(state.playing));
    const dots = document.querySelector("#metroDots");
    dots.innerHTML = "";
    for (let beat = 1; beat <= state.meter; beat += 1) {
      const dot = document.createElement("span");
      dot.className = "metro-dot" + (state.playing && beat === state.beat ? " is-active" : "") + (beat === 1 ? " is-accent" : "");
      dot.textContent = String(beat);
      dots.append(dot);
    }
  }

  function savePrefs() {
    storage?.setSetting("metronome", { bpm: state.bpm, meter: state.meter });
  }

  return { state, bind, start, stop, setBpm };
}
