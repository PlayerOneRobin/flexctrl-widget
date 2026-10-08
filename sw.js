/* Windows 11 PWA widget provider. Requires Edge/PWA widget API on Windows 11. */
importScripts('./state.js');
const STATIC = 'flexctrl-widget-assets-v1';
const ASSETS = [
  './', './index.html', './app.js', './state.js', './sw.js', './manifest.webmanifest',
  './widgets/card.json', './widgets/default-data.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/widget-preview.png'
];
const TAG = 'flexctrl-mini';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC);
    await cache.addAll(ASSETS);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('flexctrl-widget-assets-') && name !== STATIC).map(name => caches.delete(name)));
    await self.clients.claim();
    await updateWidget();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try { return await fetch(event.request); }
    catch (_) { return (await caches.match('./index.html')) || Response.error(); }
  })());
});

async function updateWidget() {
  if (!self.widgets || typeof self.widgets.updateByTag !== 'function') return;
  const template = await (await fetch(new URL('./widgets/card.json', self.registration.scope))).text();
  const state = await FlexClock.read();
  const data = JSON.stringify({start: state.start, finish: FlexClock.finishTime(state.start), duration: '8 h 40 min'});
  try {
    await self.widgets.updateByTag(TAG, {template, data});
  } catch (error) {
    // On activation there might not be a pinned instance yet.
    console.warn('Widget could not be updated', error);
  }
}
self.addEventListener('widgetinstall', event => {
  event.waitUntil(updateWidget());
});
self.addEventListener('widgetresume', event => {
  event.waitUntil(updateWidget());
});
self.addEventListener('widgetclick', event => {
  event.waitUntil((async () => {
    if (!['now', 'minus5', 'plus5'].includes(event.action)) return;
    const current = await FlexClock.read();
    let time = FlexClock.parseTime(current.start);
    if (event.action === 'now') time = FlexClock.parseTime(FlexClock.nowTime());
    if (event.action === 'minus5') time -= 5;
    if (event.action === 'plus5') time += 5;
    await FlexClock.write(FlexClock.formatTime(time));
    await updateWidget();
  })());
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'FLEX_TIME_CHANGED') event.waitUntil(updateWidget());
});
