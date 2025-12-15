const CACHE_NAME = "pesee-pwa-v1";
const ASSETS = [
  "/",
  "/pesee.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

// Stratégie: cache d'abord, puis réseau (et on met en cache ce qui marche)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => {
        // fallback hors-ligne: renvoyer la page principale si navigation
        if (req.mode === "navigate") return caches.match("/pesee.html");
        throw new Error("Offline");
      });
    })
  );
});
