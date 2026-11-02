// ============================================================
// load_curves — L12 p.37–38 Packet delay and throughput as a function of load
//   load 커서가 0 → capacity → 그 너머로 움직이며 두 그래프가 함께 그려진다.
//   near capacity, delay shoots up / beyond capacity, throughput collapses (congestion)
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["load_curves"] = {
  title: "Load 가 늘면 — delay 는 capacity 근처에서 치솟고, throughput 은 capacity 를 넘으면 무너진다 (12초)",
  desc: "p.38 그래프 두 개를 load 를 늘려 가며 그린다. No-congestion area 에서는 throughput 이 load 에 비례해 오르고 delay 는 거의 일정하다. '''Near capacity, delay shoots up; beyond capacity, throughput collapses''' — 라우터가 패킷을 버리고([[congestion control|congestion]]) 재전송이 쌓이기 때문 → [[load와 성능]]",
  duration: 12,
  build: function () {
    var D = 12;
    var C = { line: "#d6465f", area: "#dbe8f7", ax: "#333", muted: "#777", ink: "#222", cur: "#1d65b3" };
    function r1(v) { return Math.round(v * 10) / 10; }
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var f = 0.12 / D, a = r4(from / D), b = r4(Math.min(from / D + f, (from + to) / 2 / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, to / D - f)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }

    // load 진행: 정규화 u (0 … 1), capacity = 0.7
    var KT = [0, 1.5, 6, 8.5, 11, D];
    var U = [0, 0, 0.55, 0.74, 1, 1];
    var kts = KT.map(function (t) { return r4(t / D); }).join(";");
    var CAP = 0.7;

    // 그래프 틀: (ox, oy) 원점, 폭 W, 높이 H
    function frame(ox, oy, W, H, ylab, title) {
      var g = '';
      g += '<rect x="' + ox + '" y="' + (oy - H) + '" width="' + r1(W * CAP) + '" height="' + H + '" fill="' + C.area + '"/>';
      g += txt(ox + W * CAP / 2, oy - H + 18, "No-congestion area", 12, C.ink);
      g += vis(6, D, txt(r1(ox + W * CAP + 6), oy - H + 18, "Congestion area", 11, C.line, ' text-anchor="start" font-weight="700"'));
      g += '<line x1="' + ox + '" y1="' + oy + '" x2="' + (ox + W + 12) + '" y2="' + oy + '" stroke="' + C.ax + '" stroke-width="1.5" marker-end="url(#lc_ar)"/>';
      g += '<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + (oy - H - 12) + '" stroke="' + C.ax + '" stroke-width="1.5" marker-end="url(#lc_ar)"/>';
      g += '<line x1="' + r1(ox + W * CAP) + '" y1="' + oy + '" x2="' + r1(ox + W * CAP) + '" y2="' + (oy - H) + '" stroke="' + C.muted + '" stroke-dasharray="4 3"/>';
      g += txt(r1(ox + W * CAP), oy + 18, "Capacity", 12, C.ink);
      g += txt(ox + W + 6, oy + 18, "Load", 12, C.ink);
      g += txt(ox - 4, oy - H - 18, ylab, 12, C.ink, ' text-anchor="start" font-weight="700"');
      g += txt(ox + W / 2, oy + 40, title, 12, C.muted);
      return g;
    }
    function reveal(id, ox, oy, W, H) {
      var vals = U.map(function (u) { return r1(W * u + 2); }).join(";");
      return '<clipPath id="' + id + '"><rect x="' + (ox - 2) + '" y="' + (oy - H - 30) + '" width="0" height="' + (H + 34) + '"><animate attributeName="width" values="' + vals + '" keyTimes="' + kts + '" dur="' + D + 's" fill="freeze"/></rect></clipPath>';
    }
    function cursor(ox, oy, W, H) {
      var vals = U.map(function (u) { return r1(W * u) + ",0"; }).join(";");
      return '<g><line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + (oy - H) + '" stroke="' + C.cur + '" stroke-width="1.5" stroke-opacity="0.7"/>' +
        '<animateTransform attributeName="transform" type="translate" values="' + vals + '" keyTimes="' + kts + '" dur="' + D + 's" fill="freeze"/></g>';
    }

    var s = '<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="load 에 따른 delay 와 throughput 그래프 애니메이션">';
    s += '<defs><marker id="lc_ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + C.ax + '"/></marker>';
    var L = { ox: 70, oy: 250, W: 270, H: 170 }, R = { ox: 440, oy: 250, W: 280, H: 170 };
    s += reveal("lc_clipL", L.ox, L.oy, L.W, L.H) + reveal("lc_clipR", R.ox, R.oy, R.W, R.H) + '</defs>';

    [
      [0, 1.5, "Packet delay 와 throughput 을 load(보내려는 양)의 함수로 본다"],
      [1.5, 6, "No-congestion area: throughput 은 load 에 비례해 오르고, delay 는 조금씩만 는다"],
      [6, 8.5, "Near capacity, delay shoots up — 라우터 queue 가 가득 차 queuing delay 폭증"],
      [8.5, 11, "Beyond capacity, throughput collapses — 라우터가 버리고, 재전송이 더 쌓인다"],
      [11, D, "load 를 capacity 아래로 유지하는 것 = congestion control (IP 는 안 함 → TCP)"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 24, c[2], 14, C.ink, ' font-weight="700"')); });

    // ---- 왼쪽: delay ----
    s += frame(L.ox, L.oy, L.W, L.H, "Delay", "a. Delay as a function of load");
    var pts = [], x, u, d;
    for (var i = 0; i <= 60; i++) {
      u = i / 60 * (CAP - 0.004);
      d = 22 + 3.2 / (CAP - u);                          // 개념 곡선: capacity 에서 발산
      if (d > L.H) d = L.H;
      pts.push((i ? "L" : "M") + r1(L.ox + L.W * u) + "," + r1(L.oy - d));
      if (d >= L.H) break;
    }
    s += '<path d="' + pts.join(" ") + '" fill="none" stroke="' + C.line + '" stroke-width="3" clip-path="url(#lc_clipL)"/>';
    s += cursor(L.ox, L.oy, L.W, L.H);
    s += vis(8.5, D, txt(L.ox + L.W * 0.86, L.oy - L.H + 50, "delay → ∞", 13, C.line, ' font-weight="700"') + txt(L.ox + L.W * 0.86, L.oy - L.H + 68, "(packets dropped)", 11, C.muted));

    // ---- 오른쪽: throughput ----
    s += frame(R.ox, R.oy, R.W, R.H, "Throughput", "b. Throughput as a function of load");
    var tp = [];
    for (i = 0; i <= 80; i++) {
      u = i / 80;
      var t;
      if (u <= 0.62) t = u / 0.62 * 135;                                  // 직선 상승
      else if (u <= 0.74) { var v = (u - 0.62) / 0.12; t = 135 + 15 * Math.sin(v * Math.PI / 2); }  // 꼭대기
      else { var w = (u - 0.74) / 0.26; t = 150 * Math.exp(-3.2 * w * w) + 6 * w; }                  // 붕괴
      tp.push((i ? "L" : "M") + r1(R.ox + R.W * u) + "," + r1(R.oy - t));
    }
    s += '<path d="' + tp.join(" ") + '" fill="none" stroke="' + C.line + '" stroke-width="3" clip-path="url(#lc_clipR)"/>';
    s += cursor(R.ox, R.oy, R.W, R.H);
    s += vis(9.5, D, txt(R.ox + R.W * 0.9, R.oy - 90, "collapses", 13, C.line, ' font-weight="700"'));

    s += txt(380, 330, "요점: near capacity, delay shoots up; beyond capacity, throughput collapses (congestion)", 13, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
