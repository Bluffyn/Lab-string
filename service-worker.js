const CACHE_NAME = "string-lab-pwa-loop-v20260622-no-mac-deploy";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./install-ipad.html",
  "./DEPLOY-IPAD-NO-MAC.md",
  "./icon.svg",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./INSTALL-IPAD.md",
  "./src/main.js",
  "./src/core/chords.js",
  "./src/core/notes.js",
  "./src/core/roman-numerals.js",
  "./src/core/scales.js",
  "./src/core/storage.js",
  "./src/core/voicings.js",
  "./src/features/aerobics.js",
  "./src/features/aerobics-ui.js",
  "./src/features/caged.js",
  "./src/features/cuatro-encyclopedia.js",
  "./src/features/loop-companion.js",
  "./src/features/metronome.js",
  "./src/features/progression-player.js",
  "./src/features/progressions.js",
  "./src/features/scale-over-chord.js",
  "./src/features/trainer.js",
  "./src/instruments/cuatro.js",
  "./src/instruments/guitar.js",
  "./src/ui/diagrams.js",
  "./src/ui/fretboard-renderer.js",
  "./src/ui/tabs.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fresh = fetch(request).then((response) => {
        if (response && response.status === 200 && response.type !== "opaque") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
