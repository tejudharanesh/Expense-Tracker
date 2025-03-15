// Cache name and version
const CACHE_NAME = `your-app-cache-v1`;

// Files to pre-cache (static assets)
const FILES_TO_CACHE = ["/offline.html", "/manifest.json", "/logo.png"];

// Install event: Pre-cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching static assets...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Fetch event: Handle requests for static and dynamic assets
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Handle dynamic caching for assets in /assets/images/ and /assets/svg/
  if (
    requestUrl.pathname.startsWith("/assets/images/") ||
    requestUrl.pathname.startsWith("/assets/svg/")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          return (
            cachedResponse ||
            fetch(event.request).then((networkResponse) => {
              // Cache the new response
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
          );
        });
      })
    );
    return; // Skip further fetch handling for these requests
  }

  // Default fetch handling
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        })
      );
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});
