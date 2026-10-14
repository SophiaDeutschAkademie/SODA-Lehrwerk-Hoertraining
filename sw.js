/* Lehrwerk Hörtraining — offline cache.
   Every file name below carries ?v=<content hash>, so a new upload only
   re-downloads the files that actually changed. Audio is fetched whole
   (the page plays it from memory), so no range requests reach this worker.
   Audio is downloaded per level: when a student picks a level on Wi-Fi,
   the page asks for that level's files only. */
const VERSION = '367c4703d4';
const PREFIX = 'soda-hoertraining-web-';
const CACHE = PREFIX + VERSION;
const CORE = [
  "manifest.webmanifest?v=2938738ebf",
  "icons/icon-192.png?v=6741d0ebce",
  "icons/icon-512.png?v=48d5b62eb0",
  "icons/icon-maskable-512.png?v=823493397b",
  "icons/apple-touch-icon.png?v=26b41a8789"
];
const AUDIO = [
  "audio/a1-08-a.mp3?v=1d9eddbef1",
  "audio/a1-09-a.mp3?v=3ccaf77367",
  "audio/a1-10-a.mp3?v=2501034678",
  "audio/a1-11-a.mp3?v=d29ce17566",
  "audio/a1-12-a.mp3?v=da464ef2ff",
  "audio/a1-13-a.mp3?v=7e1c654c9f",
  "audio/a1-14-a.mp3?v=4a9f3046a3",
  "audio/a2-01-a1.mp3?v=ef32ffb2eb",
  "audio/a2-01-a2.mp3?v=5c962a89b0",
  "audio/a2-01-b.mp3?v=6cc4d300f8",
  "audio/a2-02-a.mp3?v=c606462ca4",
  "audio/a2-02-b.mp3?v=75cf3a4d72",
  "audio/a2-03-a.mp3?v=c7ab1733aa",
  "audio/a2-03-b.mp3?v=e1c60fa279",
  "audio/a2-04-a.mp3?v=f1416cba0e",
  "audio/a2-04-b.mp3?v=d4a0491321",
  "audio/a2-05-a.mp3?v=1ca825585b",
  "audio/a2-06-a.mp3?v=0b35687839",
  "audio/a2-07-a.mp3?v=60baab323f",
  "audio/a2-08-a.mp3?v=7ba8200b4b",
  "audio/a2-09-a.mp3?v=bd682f3d2f",
  "audio/a2-10-a.mp3?v=1d4deb6f85",
  "audio/a2-11-a.mp3?v=b970691a37",
  "audio/a2-12-a.mp3?v=60c5a5f425",
  "audio/a2-13-a.mp3?v=25e4b9b456",
  "audio/a2-14-a.mp3?v=41121748a7",
  "audio/b1-01-a.mp3?v=677981c24d",
  "audio/b1-01-b.mp3?v=fb4df90dcf",
  "audio/b1-02-a.mp3?v=8d3af55aae",
  "audio/b1-02-b.mp3?v=756ee4c1a1",
  "audio/b1-03-a.mp3?v=142b8e2685",
  "audio/b1-03-b.mp3?v=f04c752d32",
  "audio/b1-04-a.mp3?v=3db105894f",
  "audio/b1-04-b.mp3?v=fb8ebe8461",
  "audio/b1-05-a.mp3?v=1bd5d6119c",
  "audio/b1-06-a.mp3?v=54d371a417",
  "audio/b1-07-a.mp3?v=fa21256cdd",
  "audio/b1-08-a.mp3?v=a56867b58e",
  "audio/b1-09-a.mp3?v=6c99be71fc",
  "audio/b1-10-a.mp3?v=87fc2f5184",
  "audio/b1-11-a.mp3?v=b540392f28",
  "audio/b1-12-a.mp3?v=05801d8347",
  "audio/b1-13-a.mp3?v=29708d24df",
  "audio/b1-14-a.mp3?v=8bc2d0f5cc",
  "audio/b2-01-a.mp3?v=b6f637a1a7",
  "audio/b2-01-b.mp3?v=69789b2204",
  "audio/b2-02-a.mp3?v=3ff4b49dec",
  "audio/b2-02-b.mp3?v=e409160acd",
  "audio/b2-03-a.mp3?v=d4c2951226",
  "audio/b2-03-b.mp3?v=68255cb321",
  "audio/b2-04-a.mp3?v=56c1ac5644",
  "audio/b2-04-b.mp3?v=8162ec8c85",
  "audio/b2-05-a.mp3?v=e5de1b95d8",
  "audio/b2-06-a.mp3?v=9e3e6c7176",
  "audio/b2-07-a.mp3?v=1f31c9eb51",
  "audio/b2-08-a.mp3?v=fc925cb1f4",
  "audio/b2-09-a.mp3?v=5c8a9f0eff",
  "audio/b2-10-a.mp3?v=c45b75e24d",
  "audio/b2-11-a.mp3?v=bd56191a53",
  "audio/b2-12-a.mp3?v=46003872eb",
  "audio/b2-13-a.mp3?v=1fae4a07de",
  "audio/b2-14-a.mp3?v=1377eca6e1",
  "audio/c1-01-a.mp3?v=50b956e154",
  "audio/c1-02-a.mp3?v=f822610248",
  "audio/c1-03-a.mp3?v=b771173a11",
  "audio/c1-04-a.mp3?v=9a832bae4d",
  "audio/c1-05-a.mp3?v=9d0302520c",
  "audio/c1-06-a.mp3?v=c0e36571cf",
  "audio/c1-07-a.mp3?v=4b328c4a4b",
  "audio/c1-08-a.mp3?v=5da8dc5282",
  "audio/c1-09-a.mp3?v=128ea022aa",
  "audio/c1-10-a.mp3?v=743df20f3a",
  "audio/c1-11-a.mp3?v=63e0d7ca02",
  "audio/c1-12-a.mp3?v=22aa9b940a",
  "audio/c1-13-a.mp3?v=8c21648723",
  "audio/c1-14-a.mp3?v=cce9bd8ab1"
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
  const d = event.data;
  if (d === 'skip-waiting') self.skipWaiting();
  else if (d === 'warm') event.waitUntil(warm(AUDIO));
  else if (d && d.type === 'warm' && Array.isArray(d.urls)) event.waitUntil(warm(d.urls.filter((u) => AUDIO.includes(u))));
});

/* download the given audio files once, so the app works without internet */
async function warm(list) {
  const cache = await caches.open(CACHE);
  for (const url of list) {
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
