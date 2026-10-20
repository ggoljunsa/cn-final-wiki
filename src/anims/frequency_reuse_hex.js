// ============================================================
// frequency_reuse_hex — L10 p.11 (frequency reuse principle, reuse factor N=4 / N=7) + IS-95 의 N=1
// 0–1.5 빈 cell 격자 → 1.5–4 모두 같은 주파수 → 경계 interference ✗ → 4–7 N=4 색칠
//   → 7–10 N=7 색칠 → 10–14 IS-95: 모두 같은 주파수(N=1), 사용자는 code 로 구분
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["frequency_reuse_hex"] = {
  title: "Frequency reuse — 이웃 cell 은 다른 주파수, N 개마다 재사용, 14초",
  desc: "인접 cell 이 같은 주파수를 쓰면 경계의 사용자에게 [[co-channel interference|interference]]. 그래서 N 개 cell 을 한 pattern 으로 묶어 주파수를 나눠 쓰고, pattern 마다 재사용한다 — N 이 [[reuse factor]]. [[IS-95 frequency reuse|IS-95]] 는 CDMA 라서 N=1",
  duration: 14,
  build: function () {
    var D = 14;
    var C = {
      a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", bL: "#dff3e4", c: "#e09a40", cL: "#fdeec2",
      dev: "#3b2f4a", devL: "#efe9f6", red: "#d6465f", muted: "#777", ink: "#222",
      cell: "#c9a227", cellL: "#fdf3c4"
    };
    function r2(v) { return Math.round(v * 100) / 100; }
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + r2(x) + '" y="' + r2(y) + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    // from~to 초에만 보이기 (0.12s 페이드)
    function show(from, to) {
      var f = 0.12 / D, a = r4(from / D), b = r4(Math.min(from / D + f, (from + to) / 2 / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, to / D - f)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }
    function caps(list) {
      return list.map(function (c) { return vis(c[0], c[1], txt(380, 26, c[2], 14, C.ink, ' font-weight="700"')); }).join("");
    }
    function hexPts(cx, cy, r, pointy) {
      var p = [];
      for (var i = 0; i < 6; i++) {
        var a = Math.PI / 180 * (60 * i + (pointy ? 30 : 0));
        p.push(r2(cx + r * Math.cos(a)) + "," + r2(cy + r * Math.sin(a)));
      }
      return p.join(" ");
    }
    function hex(cx, cy, r, fill, stroke, pointy, extra) {
      return '<polygon points="' + hexPts(cx, cy, r, pointy) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"' + (extra || "") + '/>';
    }
    function rbox(x, y, w, h, fill, stroke, lines, size, col) {
      var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.8"/>';
      lines = [].concat(lines || []);
      var n = lines.length, fs = size || 13;
      lines.forEach(function (l, i) { s += txt(x + w / 2, y + h / 2 + (i - (n - 1) / 2) * (fs + 3) + fs * 0.36, l, fs, col || C.ink, ' font-weight="700"'); });
      return s;
    }
    // 기지국 탑: (x, y) = 밑변 가운데, 높이 26
    function tower(x, y, col) {
      col = col || C.dev;
      return '<path d="M' + r2(x - 7) + ',' + r2(y) + ' L' + r2(x) + ',' + r2(y - 26) + ' L' + r2(x + 7) + ',' + r2(y) + ' Z" fill="#fff" stroke="' + col + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<line x1="' + r2(x - 4) + '" y1="' + r2(y - 10) + '" x2="' + r2(x + 4) + '" y2="' + r2(y - 10) + '" stroke="' + col + '" stroke-width="1.4"/>';
    }
    // 휴대폰(MS): 중심 (x, y), 12×22
    function phone(x, y, col, fill) {
      col = col || C.ink;
      return '<rect x="' + r2(x - 6) + '" y="' + r2(y - 11) + '" width="12" height="22" rx="2.5" fill="' + (fill || "#fff") + '" stroke="' + col + '" stroke-width="1.6"/>' +
        '<line x1="' + r2(x - 2.5) + '" y1="' + r2(y - 7) + '" x2="' + r2(x + 2.5) + '" y2="' + r2(y - 7) + '" stroke="' + col + '" stroke-width="1.4"/>';
    }
    function line(x1, y1, x2, y2, col, w, extra) {
      return '<line x1="' + r2(x1) + '" y1="' + r2(y1) + '" x2="' + r2(x2) + '" y2="' + r2(y2) + '" stroke="' + col + '" stroke-width="' + (w || 2) + '"' + (extra || "") + '/>';
    }
    function pth(d, col, w, extra) {
      return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + (w || 2) + '"' + (extra || "") + '/>';
    }
    // 경로를 따라 움직이는 점 (begin~begin+dur 동안만 보임)
    function dot(d, begin, dur, col, rad) {
      return '<circle r="' + (rad || 5) + '" fill="' + col + '" opacity="0"><animateMotion begin="' + begin + 's" dur="' + dur + 's" fill="freeze" path="' + d + '"/>' + show(begin, begin + dur) + '</circle>';
    }
    function marker(id, col) {
      return '<marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + col + '"/></marker>';
    }

    var s = '<svg viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="frequency reuse 패턴 N=4, N=7, IS-95 N=1 애니메이션">';
    s += '<defs>' + marker("fr_arR", C.red) + '</defs>';

    s += caps([
      [0, 1.5, "서비스 지역을 cell 로 나누고, cell 마다 주파수 묶음(frequency set)을 준다"],
      [1.5, 4, "인접 cell 이 같은 주파수를 쓰면 → cell 경계의 사용자에게 interference"],
      [4, 7, "reuse factor N=4: 4개 cell 이 한 pattern — 같은 번호(같은 주파수) cell 은 떨어져 있다"],
      [7, 10, "N=7: pattern 이 클수록 같은 주파수 cell 사이가 멀다 → 간섭 ↓, 대신 cell 당 채널 ↓"],
      [10, D, "IS-95(CDMA): 모든 cell 이 같은 주파수(N=1) — 사용자마다 다른 code 로 구분"]
    ]);

    var R = 27, SQ = Math.sqrt(3), X0 = 112, Y0 = 82;
    var PAL = ["#fff3b0", "#cdeac0", "#f8c8d8", "#cfe0f5", "#fde0c2", "#e3d4f2", "#c9efe9"];
    var SAME = "#fff3b0";
    function md(a, n) { return ((a % n) + n) % n; }
    var cells = [];
    for (var c = 0; c < 9; c++) {
      for (var k = 0; k < 4; k++) {
        var q = c, r = k - (c - (c & 1)) / 2;
        cells.push({ x: X0 + 1.5 * R * c, y: Y0 + SQ * R * (k + (c & 1) / 2), n4: md(q, 2) + 2 * md(r, 2), n7: md(q + 3 * r, 7) });
      }
    }
    var kt = '0;' + r4(1.5 / D) + ';' + r4(4 / D) + ';' + r4(7 / D) + ';' + r4(10 / D);
    var d4 = '', d7 = '', h4 = '', h7 = '';
    cells.forEach(function (e) {
      s += '<polygon points="' + hexPts(e.x, e.y, R, false) + '" fill="#fafafa" stroke="#9a8a4a" stroke-width="1.3">' +
        '<animate attributeName="fill" calcMode="discrete" values="#fafafa;' + SAME + ';' + PAL[e.n4] + ';' + PAL[e.n7] + ';' + SAME + '" keyTimes="' + kt + '" dur="' + D + 's" fill="freeze"/></polygon>';
      d4 += txt(e.x, e.y + 5, e.n4 + 1, 13, "#444", ' font-weight="700"');
      d7 += txt(e.x, e.y + 5, e.n7 + 1, 13, "#444", ' font-weight="700"');
      if (e.n4 === 0) h4 += '<polygon points="' + hexPts(e.x, e.y, R - 2, false) + '" fill="none" stroke="' + C.dev + '" stroke-width="3"/>';
      if (e.n7 === 0) h7 += '<polygon points="' + hexPts(e.x, e.y, R - 2, false) + '" fill="none" stroke="' + C.dev + '" stroke-width="3"/>';
    });
    s += vis(4, 7, d4) + vis(7, 10, d7);
    s += vis(5.4, 7, h4) + vis(8.4, 10, h7);

    // ---- 같은 주파수 → interference (1.5–4) ----
    var A = cells[3 * 4 + 1], B = cells[4 * 4 + 1];   // (c=3,k=1) 과 (c=4,k=1) 은 인접
    var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
    function xmark(x, y, sz) {
      return line(x - sz, y - sz, x + sz, y + sz, C.red, 3.2, ' stroke-linecap="round"') + line(x - sz, y + sz, x + sz, y - sz, C.red, 3.2, ' stroke-linecap="round"');
    }
    s += vis(2.3, 4, xmark(mx, my, 7));
    var P = cells[1 * 4 + 2], Q = cells[2 * 4 + 2], U = cells[6 * 4 + 0], V = cells[7 * 4 + 0];
    s += vis(2.8, 4, xmark((P.x + Q.x) / 2, (P.y + Q.y) / 2, 6) + xmark((U.x + V.x) / 2, (U.y + V.y) / 2, 6));

    // ---- IS-95: code 로 구분 (10–14) ----
    var users = [[0, 1], [2, 2], [3, 0], [5, 3], [6, 1], [8, 2]];
    var ucol = [C.a, C.b, C.c, C.red, C.dev, "#0f8a8a"];
    var u = '';
    users.forEach(function (p, i) {
      var e = cells[p[0] * 4 + p[1]];
      u += phone(e.x - 8, e.y + 2, ucol[i], "#fff") + txt(e.x + 10, e.y - 6, "c" + (i + 1), 11, ucol[i], ' font-weight="700"');
    });
    s += vis(10.4, D, u);

    // ---- 오른쪽 설명 패널 ----
    var PX = 610;
    s += '<rect x="495" y="56" width="250" height="218" rx="10" fill="#fff" stroke="#ddd" stroke-width="1.5"/>';
    s += vis(0, 1.5, txt(PX, 150, "cell 마다", 15, C.ink, ' font-weight="700"') + txt(PX, 172, "frequency set 하나", 15, C.ink, ' font-weight="700"'));
    // 확대 그림: 같은 f1 을 쓰는 이웃 cell 둘, 경계의 사용자
    var Z1x = 578, Z1y = 160, Z2x = 640, Z2y = 194.64, zmx = (Z1x + Z2x) / 2, zmy = (Z1y + Z2y) / 2;
    s += vis(1.5, 4,
      txt(PX, 86, "모든 cell 이 같은 f 라면?", 15, C.red, ' font-weight="700"') +
      hex(Z1x, Z1y, 40, SAME, "#9a8a4a", false) + hex(Z2x, Z2y, 40, SAME, "#9a8a4a", false) +
      txt(Z1x - 14, Z1y - 18, "f1", 13, "#444", ' font-weight="700"') + txt(Z2x + 16, Z2y + 30, "f1", 13, "#444", ' font-weight="700"') +
      tower(Z1x - 6, Z1y + 8, C.dev) + tower(Z2x + 6, Z2y + 8, C.dev) +
      line(Z1x, Z1y - 6, zmx - 9, zmy - 3, C.red, 2, ' stroke-dasharray="4 3" marker-end="url(#fr_arR)"') +
      line(Z2x, Z2y - 6, zmx + 9, zmy + 1, C.red, 2, ' stroke-dasharray="4 3" marker-end="url(#fr_arR)"') +
      phone(zmx, zmy + 4, C.a, C.aL) +
      txt(PX, 262, "경계의 사용자 → interference ✗", 13, C.red, ' font-weight="700"'));
    s += vis(4, 7,
      txt(PX, 110, "N = 4", 28, C.dev, ' font-weight="700"') +
      txt(PX, 148, "번호 = 주파수 묶음", 13, C.ink) +
      txt(PX, 172, "같은 번호는 이웃하지 않음", 13, C.ink) +
      txt(PX, 212, "cell 당 채널 = 전체 / 4", 13, C.a, ' font-weight="700"') +
      txt(PX, 240, "굵은 테두리 = 1번 묶음", 11, C.muted));
    s += vis(7, 10,
      txt(PX, 110, "N = 7", 28, C.dev, ' font-weight="700"') +
      txt(PX, 148, "같은 번호 cell 사이가 더 멂", 13, C.ink) +
      txt(PX, 172, "→ 간섭 ↓", 13, C.b, ' font-weight="700"') +
      txt(PX, 212, "cell 당 채널 = 전체 / 7 ↓", 13, C.a, ' font-weight="700"') +
      txt(PX, 240, "(AMPS 의 reuse factor = 7)", 11, C.muted));
    s += vis(10, D,
      txt(PX, 106, "N = 1", 28, C.dev, ' font-weight="700"') +
      txt(PX, 132, "(IS-95, CDMA)", 13, C.muted) +
      txt(PX, 168, "모든 cell 이 같은 주파수", 13, C.ink) +
      txt(PX, 192, "사용자는 code(c1, c2 …)로 구분", 13, C.ink) +
      txt(PX, 232, "→ 전체 대역을 모든 cell 이 사용", 13, C.b, ' font-weight="700"'));

    // ---- 요점 ----
    s += txt(380, 318, "N(reuse factor) = 한 frequency reuse pattern 의 cell 수 — 인접 cell 은 다른 주파수, 떨어진 cell 은 재사용", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
