// ============================================================
// cellular_architecture — L10 p.9–10 (cell = BS + MS, MSC, PSTN, stationary phone)
// 0–2 cell 깔기 → 2–4 BS·MS 등장(무선) → 4–6.5 BS→MSC 유선 → 6.5–8.5 MSC–PSTN
//   → 8.5–10 stationary phone → 10–12 유선 전화에서 MS 까지 경로가 한 번 흐름
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["cellular_architecture"] = {
  title: "셀룰러 시스템의 구성 — cell · BS · MS · MSC · PSTN, 12초",
  desc: "서비스 지역을 [[cell]] 로 나누고, 각 cell 에 [[base station|BS]] 와 [[mobile station|MS]]. 모든 BS 는 유선으로 [[MSC]] 에 묶이고, MSC 가 [[PSTN]] 의 central office 와 연결돼 유선 전화와도 통화한다",
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

    var s = '<svg viewBox="0 0 760 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="셀룰러 시스템 구성 애니메이션">';
    s += '<defs>' + marker("ca_ar", "#555") + '</defs>';

    s += caps([
      [0, 2, "셀룰러 서비스 지역은 cell 이라는 작은 영역들로 나뉜다"],
      [2, 4, "각 cell = Base Station(BS, 기지국) + Mobile Station(MS, 휴대폰) — 둘 사이는 무선"],
      [4, 6.5, "모든 BS 는 유선으로 Mobile Switching Center(MSC) 에 연결된다"],
      [6.5, 8.5, "MSC 는 PSTN(public switched telephone network)의 central office 와 연결"],
      [8.5, 10, "그래서 stationary phone(유선 전화)도 휴대폰(MS)과 통화할 수 있다"],
      [10, D, "stationary phone → PSTN → MSC → BS → MS : 무선 구간은 BS–MS 한 홉뿐"]
    ]);

    // ---- 좌표 ----
    var R = 46;
    var cells = [[560, 100], [560, 180], [629, 140], [629, 220], [698, 180]];
    var MX = 300, MY = 150, MW = 140, MH = 50;

    // ---- BS → MSC 유선 (cell 밑에 깔아서 cell 안쪽은 흐리게 보인다) ----
    cells.forEach(function (c, i) {
      var d = "M" + (MX + MW) + "," + (MY + 13 + i * 6) + " L" + (c[0] - 10) + "," + (c[1] + 6);
      s += vis(4.2 + i * 0.3, D, pth(d, "#555", 1.6));
    });
    s += vis(4.5, D, txt(530, 238, "유선(wired)", 11, C.muted));

    // ---- cell 들 (flat-top) ----
    cells.forEach(function (c, i) {
      s += vis(0.2 + i * 0.3, D, hex(c[0], c[1], R, C.cellL, C.cell, false, ' fill-opacity="0.85"'));
    });
    s += vis(0.4, D, txt(698, 122, "cell", 13, "#9a7a10", ' font-weight="700"'));

    // ---- BS·MS ----
    cells.forEach(function (c, i) {
      var tx = c[0] - 10, ty = c[1] + 6, mx = c[0] + 18, my = c[1] + 12;
      s += vis(2 + i * 0.15, D, tower(tx, ty, C.dev) + phone(mx, my, C.a, C.aL) +
        pth("M" + (tx + 6) + "," + (ty - 22) + " l5,4 l-3,3 l6,4", C.a, 1.4));
    });
    // 범례
    s += vis(2.2, D, tower(592, 312, C.dev) + txt(604, 307, "BS (Base Station)", 11, C.dev, ' font-weight="700" text-anchor="start"') +
      phone(592, 330, C.a, C.aL) + txt(604, 334, "MS (Mobile Station)", 11, C.a, ' font-weight="700" text-anchor="start"'));

    // ---- MSC ----
    s += vis(4, D, rbox(MX, MY, MW, MH, C.aL, C.a, ["Mobile Switching", "Center (MSC)"], 13, C.a));

    // ---- PSTN ----
    s += vis(6.5, D, line(370, 200, 370, 244, "#555", 1.8) +
      '<ellipse cx="370" cy="272" rx="105" ry="28" fill="#f4f4f4" stroke="#555" stroke-width="1.8"/>' +
      txt(370, 267, "Public switched telephone", 12, C.ink, ' font-weight="700"') +
      txt(370, 283, "network (PSTN)", 12, C.ink, ' font-weight="700"') +
      txt(378, 226, "central office 와 연결", 11, "#8a5a10", ' font-weight="700" text-anchor="start"'));

    // ---- stationary phone ----
    var px = 110, py = 272;
    s += vis(8.5, D, line(140, 272, 265, 272, "#555", 1.8) +
      '<rect x="' + (px - 26) + '" y="' + (py - 8) + '" width="52" height="24" rx="5" fill="' + C.cL + '" stroke="' + C.c + '" stroke-width="1.8"/>' +
      pth("M" + (px - 30) + "," + (py - 8) + " q30,-22 60,0", C.c, 6, ' stroke-linecap="round"') +
      txt(px, py + 36, "Stationary phone", 12, C.ink, ' font-weight="700"'));

    // ---- 경로 흐름 (10–12) ----
    var route = "M136,268 L265,272 L370,244 L370,200 M440,163 L550,106 L578,112";
    s += vis(10, D, pth(route, C.b, 3, ' stroke-dasharray="6 4" stroke-opacity="0.85"'));
    s += dot(route, 10, 1.6, C.b, 6);
    s += vis(11.6, D, '<circle cx="578" cy="112" r="15" fill="none" stroke="' + C.b + '" stroke-width="2.5"/>');

    // ---- 요점 ----
    s += txt(380, 360, "MSC = 모든 BS 와 central office 사이의 통신을 조정하는 coordinator", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
