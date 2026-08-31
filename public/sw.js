// The service worker. Two jobs, and no more than two:
//
//   1. Chrome will only offer to install the app if a service worker is
//      handling fetches, so this is what makes the Start-menu and home-screen
//      entries possible at all.
//   2. It keeps the app's own files, so the app still opens when the phone has
//      no signal. It does NOT keep the operator's budget — that lives in
//      Google Drive, and reading it offline is ticket 13's problem.
//
// Every URL here is worked out from where this file is served, so nothing
// breaks if the repository is ever renamed.

const CACHE = 'budget-app-shell'
const START_URL = new URL('./', self.location).href

const SHELL = [
  './',
  './manifest.webmanifest',
  './favicon-32.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  // Opening the app: try the network so a new build is picked up promptly, and
  // fall back to the kept copy when there is no signal.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          keep(START_URL, response.clone())
          return response
        })
        .catch(() => caches.match(START_URL).then((cached) => cached ?? Response.error())),
    )
    return
  }

  // Everything else is a built file whose name contains a hash of its contents,
  // so a cached copy can never be the wrong copy.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        keep(request.url, response.clone())
        return response
      })
    }),
  )
})

function keep(url, response) {
  if (!response.ok || response.type !== 'basic') return
  caches.open(CACHE).then((cache) => cache.put(url, response))
}
