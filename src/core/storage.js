export const STORAGE_KEY = "stringLab.progress.v1";
export const STORAGE_DB = "stringLab.pwa.v1";
const STORE = "kv";

const DEFAULT_PROGRESS = {
  score: 0,
  streak: 0,
  completedExercises: {},
  lastExerciseIds: [],
  lastPracticedDate: null
};

export function createAppStorage() {
  return openDb()
    .then((db) => createDbStorage(db))
    .catch(() => createLocalStorageAdapter());
}

export function loadProgress() {
  return readLegacyProgress();
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function createDbStorage(db) {
  async function get(key, defaultValue = null) {
    return new Promise((resolve, reject) => {
      const request = tx(db, "readonly").get(key);
      request.onsuccess = () => resolve(request.result?.value ?? defaultValue);
      request.onerror = () => reject(request.error);
    });
  }

  async function set(key, value) {
    return new Promise((resolve, reject) => {
      const request = tx(db, "readwrite").put({ key, value });
      request.onsuccess = () => resolve(value);
      request.onerror = () => reject(request.error);
    });
  }

  async function remove(key) {
    return new Promise((resolve, reject) => {
      const request = tx(db, "readwrite").delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  return createStorageApi({ get, set, remove, engine: "indexedDB" });
}

function createLocalStorageAdapter() {
  async function get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(storageKey(key));
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  async function set(key, value) {
    localStorage.setItem(storageKey(key), JSON.stringify(value));
    return value;
  }

  async function remove(key) {
    localStorage.removeItem(storageKey(key));
  }

  return createStorageApi({ get, set, remove, engine: "localStorage" });
}

function createStorageApi(adapter) {
  return {
    engine: adapter.engine,
    getSetting: async (key, defaultValue = null) => {
      const settings = await adapter.get("settings", {});
      return settings[key] ?? defaultValue;
    },
    setSetting: async (key, value) => {
      const settings = await adapter.get("settings", {});
      settings[key] = value;
      await adapter.set("settings", settings);
      return value;
    },
    loadProgress: async () => {
      const progress = await adapter.get("progress", null);
      if (progress) return { ...DEFAULT_PROGRESS, ...progress };
      const legacy = readLegacyProgress();
      await adapter.set("progress", legacy);
      return legacy;
    },
    saveProgress: async (progress) => {
      const merged = { ...DEFAULT_PROGRESS, ...progress };
      await adapter.set("progress", merged);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    },
    savePracticePlan: async (plan) => {
      const plans = await adapter.get("practicePlans", []);
      const normalized = { ...plan, id: plan.id || `plan-${Date.now()}`, updatedAt: new Date().toISOString() };
      const next = [normalized, ...plans.filter((item) => item.id !== normalized.id)].slice(0, 80);
      await adapter.set("practicePlans", next);
      return normalized;
    },
    listPracticePlans: async () => adapter.get("practicePlans", []),
    deletePracticePlan: async (id) => {
      const plans = await adapter.get("practicePlans", []);
      await adapter.set("practicePlans", plans.filter((item) => item.id !== id));
    },
    exportAllData: async () => ({
      app: "String Lab",
      version: "pwa-loop-companion-1",
      exportedAt: new Date().toISOString(),
      settings: await adapter.get("settings", {}),
      progress: await adapter.get("progress", readLegacyProgress()),
      practicePlans: await adapter.get("practicePlans", [])
    }),
    importAllData: async (json) => {
      const data = typeof json === "string" ? JSON.parse(json) : json;
      if (!data || typeof data !== "object") throw new Error("Backup JSON is not an object.");
      await adapter.set("settings", data.settings || {});
      await adapter.set("progress", { ...DEFAULT_PROGRESS, ...(data.progress || {}) });
      await adapter.set("practicePlans", Array.isArray(data.practicePlans) ? data.practicePlans : []);
      return true;
    },
    clearPracticePlans: async () => adapter.remove("practicePlans")
  };
}

function openDb() {
  if (!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB unavailable"));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(STORAGE_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

function storageKey(key) {
  return `stringLab.${key}.v1`;
}

function readLegacyProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved) return { ...DEFAULT_PROGRESS, ...saved };
    const guitar = JSON.parse(localStorage.getItem("fretboardLab.progress.v1") || "{}");
    const cuatro = JSON.parse(localStorage.getItem("cuatroLab.progress.v1") || "{}");
    return {
      ...DEFAULT_PROGRESS,
      score: Number(guitar.trainerScore || cuatro.trainerScore || 0),
      streak: Number(guitar.trainerStreak || cuatro.trainerStreak || 0)
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}
