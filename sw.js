// Ôn luyện Tin — lưu app trên máy để mở được khi mất mạng. Bản: 20261027-2054
const BAN = "olt-20261027-2054", TEP = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-180.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(BAN).then(c => c.addAll(TEP))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== BAN).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;           // sổ điểm Google Sheet, Google Form đi thẳng, không qua đây
  if (r.mode === "navigate") {                                               // có mạng: lấy bản mới nhất của cô; mất mạng: dùng bản đã lưu
    e.respondWith(fetch(r).then(x => { const y = x.clone(); caches.open(BAN).then(c => c.put("index.html", y)); return x; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(x => x || fetch(r)));
});
