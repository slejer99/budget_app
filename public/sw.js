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

// Files the build gives content-hashed names. A hashed name can only ever mean
// one set of bytes, so a cached copy of one can never be the wrong copy.
const HASHED_PREFIX = new URL('./assets/', self.location).href

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
      .then((names) =>
        Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name))),
      )
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

  // A hashed file never changes, so the kept copy is always right and the
  // network is never worth waiting for.
  if (request.url.startsWith(HASHED_PREFIX)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            keep(request.url, response.clone())
            return response
          }),
      ),
    )
    return
  }

  // Everything else — the manifest and the icons — keeps its own name from one
  // build to the next, so a kept copy can go stale. Answer from the cache to
  // stay fast and to work offline, and refresh it in the background so a
  // changed icon or app name arrives on the visit after next.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fromNetwork = fetch(request)
        .then((response) => {
          keep(request.url, response.clone())
          return response
        })
        .catch(() => cached ?? Response.error())
      return cached ?? fromNetwork
    }),
  )
})

function keep(url, response) {
  if (!response.ok || response.type !== 'basic') return
  caches.open(CACHE).then((cache) => cache.put(url, response))
}

// Superseded hashed files are kept rather than pruned. Each build leaves behind
// roughly 20 kB, and the app is rebuilt rarely, so this is not worth machinery
// to tidy. If it ever is, the fix is to drop entries under HASHED_PREFIX that
// the freshly fetched page no longer refers to.
