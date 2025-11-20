// Minimal service worker to satisfy browser requests and avoid 404 logs.
// This SW does nothing unless explicitly registered in code.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Pass-through all requests
});
