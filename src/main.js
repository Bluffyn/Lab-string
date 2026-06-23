import { createAppStorage } from "./core/storage.js";
import { initAerobics } from "./features/aerobics-ui.js";
import { initCaged } from "./features/caged.js";
import { initCuatroEncyclopedia } from "./features/cuatro-encyclopedia.js";
import { initLoopCompanion } from "./features/loop-companion.js";
import { createMetronome } from "./features/metronome.js";
import { initPractice } from "./features/trainer.js";
import { initProgressions } from "./features/progressions.js";
import { guitar } from "./instruments/guitar.js";
import { cuatro } from "./instruments/cuatro.js";
import { bindTabs } from "./ui/tabs.js";

const instruments = { guitar, cuatro };

boot();

async function boot() {
  const storage = await createAppStorage();
  const progress = await storage.loadProgress();
  const save = () => storage.saveProgress(progress);

  await bindTabs(storage);
  const metronome = createMetronome(storage);
  await metronome.bind();
  initPractice({ instruments, progress, save });
  initProgressions({ instruments, metronome });
  initLoopCompanion({ instruments, storage, metronome });
  initCaged();
  initCuatroEncyclopedia();
  initAerobics({ progress, save });
  bindNetworkStatus();
  bindDataTools(storage);
  bindControlSettings(storage);
  registerServiceWorker();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const register = () => {
      navigator.serviceWorker.register("./service-worker.js").catch((error) => {
        console.info("Service worker registration skipped:", error.message);
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register);
  }
}

function bindNetworkStatus() {
  const status = document.querySelector("#networkStatus");
  const render = () => {
    status.classList.toggle("is-offline", !navigator.onLine);
    status.textContent = navigator.onLine ? "Online" : "Offline mode";
  };
  window.addEventListener("online", render);
  window.addEventListener("offline", render);
  render();
}

function bindDataTools(storage) {
  const exportButton = document.querySelector("#exportData");
  const importButton = document.querySelector("#importData");
  const fileInput = document.querySelector("#importDataFile");
  exportButton.addEventListener("click", async () => {
    const data = await storage.exportAllData();
    downloadBlob(`string-lab-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), "application/json");
  });
  importButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!confirm("Import this backup and overwrite saved String Lab data on this iPad?")) return;
    await storage.importAllData(await file.text());
    location.reload();
  });
}

function bindControlSettings(storage) {
  const controls = [
    ["practiceInstrument", "lastInstrument"],
    ["practiceRoot", "lastPracticeKey"],
    ["practiceScale", "lastPracticeScale"],
    ["progressionKey", "lastProgressionKey"],
    ["loopInstrument", "lastProgressionInstrument"],
    ["cagedRoot", "lastCagedKey"],
    ["cagedScale", "lastCagedScale"],
    ["cuatroRoot", "lastCuatroKey"],
    ["cuatroScale", "lastCuatroScale"]
  ];
  controls.forEach(([id, key]) => {
    const element = document.getElementById(id);
    if (!element) return;
    storage.getSetting(key, null).then((value) => {
      if (value !== null && Array.from(element.options || []).some((option) => option.value === String(value))) {
        element.value = String(value);
        element.dispatchEvent(new Event("change", { bubbles: true }));
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    element.addEventListener("change", () => storage.setSetting(key, element.value));
    element.addEventListener("input", () => storage.setSetting(key, element.value));
  });
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
