import { generateWorkout, randomExercise, tempoLadder } from "./aerobics.js";

export function initAerobics({ progress, save }) {
  progress.aerobics ||= { completed: {}, lastExerciseIds: [], lastPracticed: "" };
  const state = { current: randomExercise(progress.aerobics), workout: [], minutes: 10, instrument: "all" };

  document.querySelector("#aerobicsRandom").addEventListener("click", () => {
    state.current = randomExercise(progress.aerobics, { instrument: state.instrument });
    render();
  });
  document.querySelector("#aerobicsInstrument").addEventListener("change", (event) => {
    state.instrument = event.target.value;
    state.current = randomExercise(progress.aerobics, { instrument: state.instrument });
    state.workout = generateWorkout(state.minutes, progress.aerobics, { instrument: state.instrument });
    render();
    renderWorkout(state.minutes);
  });
  [10, 20, 30].forEach((minutes) => {
    document.querySelector(`#workout${minutes}`).addEventListener("click", () => {
      state.minutes = minutes;
      state.workout = generateWorkout(minutes, progress.aerobics, { instrument: state.instrument });
      renderWorkout(minutes);
    });
  });
  document.querySelector("#markComplete").addEventListener("click", () => {
    const today = new Date().toISOString().slice(0, 10);
    progress.aerobics.completed[state.current.id] = (progress.aerobics.completed[state.current.id] || 0) + 1;
    progress.aerobics.lastPracticed = today;
    progress.aerobics.lastExerciseIds = [state.current.id, ...(progress.aerobics.lastExerciseIds || [])].slice(0, 5);
    save();
    renderProgress();
  });
  render();
  state.workout = generateWorkout(10, progress.aerobics, { instrument: state.instrument });
  renderWorkout(10);

  function render() {
    document.querySelector("#aerobicExercise").innerHTML = exerciseHtml(state.current, true);
    renderProgress();
  }

  function renderWorkout(minutes) {
    state.workout = state.workout.length ? state.workout : generateWorkout(minutes, progress.aerobics, { instrument: state.instrument });
    const box = document.querySelector("#dailyWorkout");
    box.innerHTML = `<strong>${minutes}-minute workout</strong>`;
    state.workout.forEach((exercise, index) => {
      const card = document.createElement("article");
      card.className = "workout-item";
      card.innerHTML = `<span>${index + 1}</span><div class="workout-content">${exerciseHtml(exercise, false)}</div>`;
      card.addEventListener("click", () => {
        state.current = exercise;
        render();
      });
      box.append(card);
    });
  }

  function renderProgress() {
    const completed = Object.values(progress.aerobics.completed).reduce((sum, value) => sum + value, 0);
    document.querySelector("#aerobicsProgress").textContent = `${completed} completed | Last practiced: ${progress.aerobics.lastPracticed || "not yet"}`;
  }
}

function exerciseHtml(exercise, full) {
  return `
    <div class="exercise-head">
      <strong>${exercise.name}</strong>
      <span>${instrumentLabel(exercise)} | ${exercise.category} | ${exercise.difficulty} | ${exercise.bpm} BPM</span>
    </div>
    <p>${exercise.goal}</p>
    <pre class="tab-block">${exercise.tab}</pre>
    <div class="detail-grid">
      <span><b>Tempo ladder</b>${tempoLadder(exercise.bpm)}</span>
      <span><b>Picking</b>${exercise.picking}</span>
      ${full ? `<span><b>Common mistake</b>${exercise.mistake}</span><span><b>Safety</b>Stop if pain or sharp tension appears.</span>` : ""}
    </div>`;
}

function instrumentLabel(exercise) {
  return (exercise.instrument || "guitar") === "cuatro" ? "Puerto Rican Cuatro" : "Guitar";
}
