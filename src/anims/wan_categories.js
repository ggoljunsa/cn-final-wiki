// ============================================================
// wan_categories — L10 p.5–7 (WAN 의 두 갈래: wired / wireless, 이번 강의 focus)
// 0–1.5 WAN 정의 → 1.5–3.5 wired·wireless 두 갈래 → 3.5–6 wired 자식(telephone·cable)
//   → 6–8.5 wireless 자식(cellular 4G/5G · satellite Starlink/Starshield) → 8.5–12 focus: wireless WAN
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["wan_categories"] = {
  title: "WAN 의 두 갈래 — wired 와 wireless, 12초",
  desc: "[[WAN]] 은 '''wired WAN'''(telephone network · cable network) 과 '''wireless WAN'''([[cellular telephony]] 4G/5G · satellite network Starlink/Starshield) 으로 나뉜다. CH05 의 focus 는 wireless WAN",
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

    var s = '<svg viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WAN 분류 트리 애니메이션">';

    s += caps([
      [0, 1.5, "WAN = LAN 보다 넓은 지역(town · state · country · world)을 잇는 네트워크"],
      [1.5, 3.5, "WAN 은 크게 두 갈래: wired WAN 과 wireless WAN"],
      [3.5, 6, "Wired WAN: telephone network(전화망) · cable network(케이블망)"],
      [6, 8.5, "Wireless WAN: cellular telephony(4G / 5G) · satellite network(Starlink / Starshield)"],
      [8.5, D, "이번 강의(CH05)의 focus: wireless WAN — 그중 cellular telephony"]
    ]);

    // ---- 뿌리 ----
    s += rbox(320, 50, 120, 38, C.devL, C.dev, "WAN", 16, C.dev);
    s += txt(380, 104, "(Wide Area Network)", 11, C.muted);

    // ---- 두 갈래 ----
    s += vis(1.5, D,
      line(380, 108, 380, 118, C.dev, 2) + line(190, 118, 570, 118, C.dev, 2) +
      line(190, 118, 190, 132, C.dev, 2) + line(570, 118, 570, 132, C.dev, 2));

    // wired 쪽 (focus 때 흐려짐)
    var wired = '';
    wired += vis(1.5, D, rbox(120, 132, 140, 34, "#f2f2f2", "#555", "Wired WAN", 14, "#333"));
    wired += vis(3.5, D,
      line(190, 166, 190, 178, "#555", 1.6) + line(105, 178, 280, 178, "#555", 1.6) +
      line(105, 178, 105, 192, "#555", 1.6) + line(280, 178, 280, 192, "#555", 1.6) +
      rbox(30, 192, 150, 34, "#fff", "#555", "Telephone network", 13, "#333") +
      rbox(205, 192, 150, 34, "#fff", "#555", "Cable network", 13, "#333") +
      txt(105, 244, "local loop → end office", 11, C.muted) +
      txt(105, 259, "→ trunk → tandem office", 11, C.muted) +
      txt(105, 274, "→ regional office", 11, C.muted) +
      txt(280, 244, "(cable TV 망 활용)", 11, C.muted));
    s += '<g>' + wired + '<animate attributeName="opacity" values="1;1;0.35;0.35" keyTimes="0;' + r4(8.5 / D) + ';' + r4(9 / D) + ';1" dur="' + D + 's" fill="freeze"/></g>';

    // wireless 쪽
    s += vis(1.5, D, rbox(500, 132, 140, 34, C.aL, C.a, "Wireless WAN", 14, C.a));
    s += vis(6, D,
      line(570, 166, 570, 178, C.a, 1.6) + line(480, 178, 660, 178, C.a, 1.6) +
      line(480, 178, 480, 192, C.a, 1.6) + line(660, 178, 660, 192, C.a, 1.6) +
      rbox(400, 192, 160, 34, "#fff", C.a, "Cellular telephony", 13, C.a) +
      rbox(585, 192, 150, 34, "#fff", C.a, "Satellite network", 13, C.a) +
      txt(480, 244, "4G / 5G cellular systems", 12, C.ink) +
      txt(660, 244, "Starlink / Starshield", 12, C.ink));
    // 작은 그림: 기지국 탑 / 위성
    s += vis(6, D, tower(480, 286, C.a) + phone(505, 276, C.a) +
      pth("M488,262 q6,-4 12,0", C.a, 1.4) +
      '<rect x="652" y="262" width="16" height="10" fill="' + C.aL + '" stroke="' + C.a + '" stroke-width="1.5"/>' +
      line(636, 267, 652, 267, C.a, 3) + line(668, 267, 684, 267, C.a, 3));

    // ---- focus 박스 ----
    s += vis(8.5, D,
      '<rect x="390" y="126" width="355" height="168" rx="10" fill="none" stroke="' + C.red + '" stroke-width="2.5" stroke-dasharray="7 4"/>' +
      '<rect x="392" y="182" width="176" height="52" rx="8" fill="none" stroke="' + C.red + '" stroke-width="2.5"/>' +
      rbox(470, 52, 270, 32, "#fde7eb", C.red, "이번 강의 focus: wireless WAN", 13, C.red));
    s += vis(8.5, D, line(605, 84, 605, 124, C.red, 2, ' marker-end="url(#wc_arR)"'));

    s += '<defs>' + marker("wc_arR", C.red) + '</defs>';

    // ---- 요점 ----
    s += txt(380, 318, "WAN = wired(telephone · cable) + wireless(cellular · satellite) — CH05 는 wireless WAN 의 cellular telephony 부터", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
