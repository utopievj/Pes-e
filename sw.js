const CACHE_NAME = "pesee-pwa-v1";

const ASSETS = [
  "/Pes-e/pesee",
  "/Pes-e/manifest.json",
  "/Pes-e/sw.js",
  "/Pes-e/icon-192.png",
  "/Pes-e/icon-512.png",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req)
        .then(resp => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return resp;
        })
        .catch(() => {
          if (req.mode === "navigate") {
            return caches.match("/Pes-e/pesee");
          }
        });
    })
  );
});
