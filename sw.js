/* Lehrwerk Hörtraining A1 — offline cache.
   Every file name below carries ?v=<content hash>, so a new upload only
   re-downloads the files that actually changed. Audio is fetched whole
   (the page plays it from memory), so no range requests reach this worker. */
const VERSION = 'bded7e3a64';
const PREFIX = 'soda-hoertraining-a1-';
const CACHE = PREFIX + VERSION;
const CORE = [
  "manifest.webmanifest?v=0378ccc29a",
  "icons/icon-192.png?v=2124df1ec7",
  "icons/icon-512.png?v=842667b7e1",
  "icons/icon-maskable-512.png?v=1a2b39ad20",
  "icons/apple-touch-icon.png?v=ce3b40081e"
];
const AUDIO = [
  "audio/a1-08-a.mp3?v=1d9eddbef1",
  "audio/a1-09-a.mp3?v=3ccaf77367",
  "audio/a1-10-a.mp3?v=2501034678",
  "audio/a1-11-a.mp3?v=d29ce17566",
  "audio/a1-12-a.mp3?v=da464ef2ff",
  "audio/a1-13-a.mp3?v=7e1c654c9f"
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const page = await fetch(new Request('index.html?sw=' + VERSION, { cache: 'reload' }));
    if (!page.ok) throw new Error('index.html ' + page.status);
    await cache.put('index.html', page);
    for (const url of CORE.concat(AUDIO)) {
      const kept = await caches.match(url);
      if (kept) { await cache.put(url, kept); continue; }
      if (AUDIO.includes(url)) continue; // fetched later by warm() or when a passage is opened
      const res = await fetch(url);
      if (!res.ok) throw new Error(url + ' ' + res.status);
      await cache.put(url, res);
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
  else if (event.data === 'warm') event.waitUntil(warm());
});

/* download every passage's audio once, so the app works without internet */
async function warm() {
  const cache = await caches.open(CACHE);
  for (const url of AUDIO) {
    if (await cache.match(url)) continue;
    try {
      const res = await fetch(url);
      if (res.ok) await cache.put(url, res);
    } catch (e) {
      return; // offline: try again on the next visit
    }
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const page = await caches.match('index.html', { cacheName: CACHE }) || await caches.match('index.html');
      return page || fetch(req);
    })());
    return;
  }

  if (req.headers.has('range')) return; // let the browser handle partial requests itself

  event.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.status === 200 && res.type === 'basic' && url.search.startsWith('?v=')) {
      const cache = await caches.open(CACHE);
      cache.put(req, res.clone());
    }
    return res;
  })());
});
