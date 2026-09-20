/* Service worker: aplikasi tetap bisa dibuka tanpa internet.
   Naikkan VERSI setiap kali index.html diganti supaya HP memakai versi terbaru. */
var VERSI = 'rekap-arisan-v1';
var FILE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'icon-180.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSI).then(function (c) { return c.addAll(FILE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSI; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return; /* font & gambar Drive lewat jaringan biasa */
  e.respondWith(
    fetch(r).then(function (res) {
      if (res && res.ok) { var salin = res.clone(); caches.open(VERSI).then(function (c) { c.put(r, salin); }); }
      return res;
    }).catch(function () {
      return caches.match(r).then(function (hit) { return hit || (r.mode === 'navigate' ? caches.match('index.html') : undefined); });
    })
  );
});
