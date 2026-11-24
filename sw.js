// 오프라인용 service worker (build.py 생성 — 직접 편집 금지)
const VER = "28c222f083";
const CACHE = "cnf-wiki-" + VER;
const CORE = ["./", "./index.html", "./manifest.webmanifest"];
const KATEX = ["https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css", "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js", "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(CORE).then(function () {
      // KaTeX(CDN) 는 실패해도 설치는 진행 (폰트는 CSS 가 참조하는 것을 fetch 시점에 캐시)
      return Promise.all(KATEX.map(function (u) { return c.add(new Request(u, { mode: "cors" })).catch(function () {}); }));
    });
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf("cnf-wiki-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  // 위키 본문(루트 index.html)만 페이지로 다룬다. duo/ 같은 하위 앱 페이지는 가로채지 않는다
  // (예전 조건은 duo/index.html 응답을 ./index.html 캐시에 덮어쓸 수 있었다 — 11-23 수정)
  var root = new URL(self.registration.scope).pathname;
  var isPage = url.origin === location.origin && (url.pathname === root || url.pathname === root + "index.html");
  if (!isPage && req.mode === "navigate") return;
  if (isPage) {
    // 페이지: 네트워크 우선, 실패하면 캐시 (오프라인)
    e.respondWith(fetch(req).then(function (r) {
      var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put("./index.html", copy); }); return r;
    }).catch(function () { return caches.match("./index.html"); }));
    return;
  }
  // 이미지·KaTeX·폰트: 캐시 우선, 없으면 받아서 캐시
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
    if (hit) return hit;
    return fetch(req).then(function (r) {
      if (r && (r.ok || r.type === "opaque")) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return r;
    });
  }));
});
self.addEventListener("message", function (e) {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
