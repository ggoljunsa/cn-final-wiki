// ============================================================
// roaming_anim — L10 p.17 (Operation: Roaming)
// 0–2 home(A) 에서 통신 → 2–6 A 의 cell 밖으로 이동(2.5–5.5 coverage 없음) → 6–8.5 B 의 cell 도착,
//   MSC B ↔ MSC A roaming contract → 8.5–12 B 가 A 가입자에게 서비스 계속
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["roaming_anim"] = {
  title: "Roaming — 이웃 provider 의 coverage 로 이어 쓰기, 12초",
  desc: "한 service provider 의 coverage 는 제한적이다. 이웃 provider 끼리 '''roaming contract''' 를 맺어 두면, home(A) 가입자가 B 의 cell 로 가도 B 의 network 로 통신할 수 있다([[roaming]])",
  duration: 12,
  build: function () {
    var D = 12;
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

    var s = '<svg viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="roaming 애니메이션">';
    s += '<defs>' + marker("ro_arR", C.red) + marker("ro_ar", "#555") + '</defs>';

    s += caps([
      [0, 2, "사용자(MS)는 home provider A 의 coverage 안에서 통신한다"],
      [2, 4, "한 service provider 의 coverage 는 제한적 — 사용자가 A 의 cell 밖으로 이동"],
      [4, 6, "A 의 coverage 밖: 연결 끊김 — 통신은 coverage 가 있는 곳에서만 가능"],
      [6, 8.5, "이웃 provider B 의 cell 에 도착 → MSC B 와 MSC A 사이의 roaming contract 확인"],
      [8.5, D, "B 의 network 가 A 의 가입자에게 서비스 → extended coverage (roaming)"]
    ]);

    var R = 40, W3 = R * Math.sqrt(3);
    function cluster(cx, fill, stroke) {
      var p = '', cs = [[cx, 150], [cx - W3 / 2, 210], [cx + W3 / 2, 210]];
      cs.forEach(function (c) { p += hex(c[0], c[1], R, fill, stroke, true); });
      cs.forEach(function (c) { p += tower(c[0], c[1] + 12, C.dev); });
      return p;
    }
    var AX = 185, BX = 570;

    // ---- MSC 와 cell 들 ----
    s += rbox(AX - 55, 52, 110, 30, C.aL, C.a, "MSC A", 14, C.a);
    s += rbox(BX - 55, 52, 110, 30, C.aL, C.a, "MSC B", 14, C.a);
    s += line(AX, 82, AX, 110, "#555", 1.6) + line(BX, 82, BX, 110, "#555", 1.6);
    s += cluster(AX, C.cellL, C.cell) + cluster(BX, C.bL, C.b);
    s += txt(AX, 280, "Provider A (home)", 14, "#8a6a10", ' font-weight="700"');
    s += txt(BX, 280, "Provider B (neighbor)", 14, "#1d6b2a", ' font-weight="700"');

    // ---- roaming contract (평소엔 흐린 점선, 6s 부터 빛남) ----
    s += '<line x1="242" y1="67" x2="513" y2="67" stroke="' + C.red + '" stroke-width="2" stroke-dasharray="6 4" marker-start="url(#ro_arR)" marker-end="url(#ro_arR)">' +
      '<animate attributeName="stroke-opacity" values="0.3;0.3;1;1" keyTimes="0;' + r4(6 / D) + ';' + r4(6.2 / D) + ';1" dur="' + D + 's" fill="freeze"/>' +
      '<animate attributeName="stroke-width" values="2;4.5;2" begin="6s" dur="0.8s" repeatCount="3"/></line>';
    s += '<g><rect x="322" y="44" width="112" height="18" rx="4" fill="#fff" stroke="' + C.red + '" stroke-width="1.5"/>' +
      txt(378, 57, "Roaming contract", 12, C.red, ' font-weight="700"') +
      '<animate attributeName="opacity" values="0.4;0.4;1;1" keyTimes="0;' + r4(6 / D) + ';' + r4(6.2 / D) + ';1" dur="' + D + 's" fill="freeze"/></g>';

    // ---- User moves ----
    s += vis(2, D, line(262, 258, 493, 258, "#555", 1.4, ' stroke-dasharray="4 3" marker-end="url(#ro_ar)"') + txt(378, 274, "User moves", 12, "#555"));

    // ---- MS 이동 (2→6s) + 무선 링크 ----
    var M0 = 240, M1 = 518, MY = 232;
    var aTx = AX + W3 / 2, bTx = BX - W3 / 2;           // A 오른쪽 아래 / B 왼쪽 아래 탑
    s += vis(0, 2.5, '<line x1="' + r2(aTx) + '" y1="' + (210 - 8) + '" x2="' + M0 + '" y2="' + (MY - 8) + '" stroke="' + C.cell + '" stroke-width="3" stroke-linecap="round">' +
      '<animate attributeName="x2" values="' + M0 + ';' + M1 + '" begin="2s" dur="4s" fill="freeze"/></line>');
    s += vis(6, D, line(bTx, 210 - 8, M1, MY - 8, C.b, 3, ' stroke-linecap="round"'));
    var ms = phone(M0, MY, C.a, C.aL);
    ms += vis(2.6, 5.5, '<circle cx="' + M0 + '" cy="' + MY + '" r="15" fill="none" stroke="' + C.red + '" stroke-width="2.5"/>');
    s += vis(2.6, 5.5, txt(378, 190, "✗ coverage 밖 — no service", 13, C.red, ' font-weight="700"'));
    s += vis(6.2, D, txt(378, 190, "✓ B 의 cell 에서 통신 계속", 13, C.b, ' font-weight="700"'));
    s += '<g>' + ms + '<animateTransform attributeName="transform" type="translate" values="0,0;' + (M1 - M0) + ',0" begin="2s" dur="4s" fill="freeze"/></g>';
    s += vis(6, D, txt(M1 - 10, MY + 4, "MS", 12, C.a, ' font-weight="700" text-anchor="end"'));

    // ---- contract 확인: MSC B → MSC A → MSC B ----
    s += dot("M513,72 L242,72", 6.3, 0.9, C.red, 5);
    s += dot("M242,72 L513,72", 7.3, 0.9, C.b, 5);
    s += vis(6.3, 8.5, txt(378, 96, "B: 이 사용자는 A 의 가입자? → A: 확인", 12, C.red, ' font-weight="700"'));
    // ---- 서비스: MS → BS(B) → MSC B → MSC A ----
    var svc = "M" + M1 + "," + (MY - 8) + " L" + r2(bTx) + ",202 L" + BX + ",110 L" + BX + ",82 L513,67 L242,67";
    s += vis(8.5, D, pth(svc, C.b, 3, ' stroke-opacity="0.35"'));
    s += dot(svc, 8.6, 1.8, C.b, 5);
    s += vis(8.6, D, txt(378, 96, "A 의 가입자가 B 의 network 로 통신 (extended coverage)", 12, C.b, ' font-weight="700"'));

    // ---- 요점 ----
    s += txt(380, 318, "roaming = 이웃 service provider 끼리 roaming contract 로 coverage 를 넓혀 주는 것", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
