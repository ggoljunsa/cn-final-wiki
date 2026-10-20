// ============================================================
// call_receive — L10 p.13 (Operation: Receiving) ①–⑦
// 0–1 초기 → ① 1–2.6 → ② paging 2.6–5 → ③ 5–6.6 → ④ 6.6–8.2 → ⑤ 8.2–9.6 → ⑥ 9.6–11 → ⑦ 11–14
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["call_receive"] = {
  title: "통화 수신 (receiving a call) ①–⑦ — 14초",
  desc: "유선 전화(caller)가 휴대폰에 걸 때: central office → [[MSC]] → '''모든 cell 에 [[paging]]''' → MS 응답·위치 확인 → ringing → MS answer → voice channel 할당 → 통화. [[통화 발신 과정|발신]]과 달리 MS 의 위치를 모르니 paging 이 필요하다",
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

    var s = '<svg viewBox="0 0 760 376" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="셀룰러 통화 수신 7단계 애니메이션">';
    s += '<defs>' + marker("cr_ar", "#444") + marker("cr_arR", C.red) + '</defs>';

    var T = [1, 2.6, 5, 6.6, 8.2, 9.6, 11, D];
    s += caps([
      [0, T[0], "유선 전화(caller)가 휴대폰(MS) 번호로 전화를 건다"],
      [T[0], T[1], "① telephone central office 가 called number 를 MSC 로 보낸다"],
      [T[1], T[2], "② MSC 가 모든 cell 에 query signal 을 보낸다 = paging (MS 위치를 모르니까)"],
      [T[2], T[3], "③ MS 가 응답한다 → MS 의 위치(어느 cell 인지)가 확인된다"],
      [T[3], T[4], "④ MSC 가 그 MS 로 ringing signal 을 보낸다"],
      [T[4], T[5], "⑤ MS 가 응답(answer)한다 — 사용자가 전화를 받음"],
      [T[5], T[6], "⑥ MSC 가 voice channel 을 할당한다"],
      [T[6], D, "⑦ 할당된 voice channel 로 통화 시작 (communication begins)"]
    ]);

    // ---- cell 3개 (세로로 쌓은 flat-top) ----
    var R = 46, cy = [100, 180, 260], CX = 130;
    cy.forEach(function (y) { s += hex(CX, y, R, C.cellL, C.cell, false); });
    var tw = [[150, 112], [150, 175], [150, 272]];          // 탑 밑변
    tw.forEach(function (t) { s += tower(t[0], t[1], C.dev); });
    s += txt(172, 98, "BS", 12, C.dev, ' font-weight="700"');
    var MSX = 105, MSY = 197;
    s += phone(MSX, MSY, C.a, C.aL) + txt(92, 201, "MS", 13, C.a, ' font-weight="700" text-anchor="end"');

    s += rbox(300, 160, 120, 50, C.aL, C.a, "MSC", 15, C.a);
    s += rbox(500, 160, 140, 50, C.cL, C.c, ["Telephone", "central office"], 13, "#8a5a10");
    s += phone(700, 185, C.ink, "#fff") + txt(700, 162, "Caller", 12, C.ink);
    s += line(688, 185, 643, 185, "#444", 1.8, ' marker-end="url(#cr_ar)"');

    // ① CO → MSC
    s += vis(T[0], D, line(498, 185, 423, 185, "#444", 1.8, ' marker-end="url(#cr_ar)"') + txt(460, 177, "①", 14, C.red, ' font-weight="700"'));
    s += dot("M498,185 L423,185", T[0], 1.1, C.red);

    // ② paging: MSC → 모든 cell (빨간 점선 + 퍼지는 파동)
    var pg = '';
    tw.forEach(function (t) {
      pg += line(300, 172, t[0] + 9, t[1] - 16, C.red, 1.8, ' stroke-dasharray="5 4" marker-end="url(#cr_arR)"');
    });
    s += vis(T[1], T[2] + 0.4, pg +
      '<rect x="218" y="104" width="62" height="22" rx="4" fill="#fff" stroke="' + C.red + '" stroke-width="1.8"/>' +
      txt(249, 120, "Paging", 13, C.red, ' font-weight="700"') + txt(232, 150, "②", 14, C.red, ' font-weight="700"'));
    tw.forEach(function (t, i) {
      s += dot("M300,172 L" + (t[0] + 9) + "," + (t[1] - 16), T[1] + 0.1, 0.8, C.red, 4);
      s += '<circle cx="' + CX + '" cy="' + cy[i] + '" r="0" fill="none" stroke="' + C.red + '" stroke-width="2">' +
        '<animate attributeName="r" values="4;40" begin="' + (T[1] + 0.9) + 's" dur="1s" repeatCount="2"/>' +
        '<animate attributeName="stroke-opacity" values="1;0" begin="' + (T[1] + 0.9) + 's" dur="1s" repeatCount="2"/></circle>';
    });

    // ③⑤ MS → MSC (위 선), ④⑥ MSC → MS (아래 선)
    s += vis(T[2], D, line(113, 191, 298, 191, "#444", 1.8, ' marker-end="url(#cr_ar)"'));
    s += vis(T[3], D, line(298, 203, 113, 203, "#444", 1.8, ' marker-end="url(#cr_ar)"'));
    s += vis(T[2], D, txt(208, 184, "③", 14, C.red, ' font-weight="700"'));
    s += vis(T[4], D, txt(232, 184, "⑤", 14, C.red, ' font-weight="700"'));
    s += vis(T[3], D, txt(208, 220, "④", 14, C.red, ' font-weight="700"'));
    s += vis(T[5], D, txt(232, 220, "⑥", 14, C.red, ' font-weight="700"'));
    s += dot("M113,191 L298,191", T[2], 1.1, C.red);
    s += dot("M298,203 L113,203", T[3], 1.1, C.red);
    s += dot("M113,191 L298,191", T[4], 1.1, C.red);
    s += dot("M298,203 L113,203", T[5], 1.1, C.red);

    // ③ 위치 확인
    s += vis(T[2] + 0.5, D, hex(CX, cy[1], R - 3, "none", C.a, false, ' stroke-width="3"') +
      txt(246, 250, "MS 위치 확인: 이 cell", 12, C.a, ' font-weight="700"'));
    // ④ ringing / ⑤ answer
    s += vis(T[3] + 0.4, T[4], pth("M" + (MSX + 10) + "," + (MSY - 8) + " q5,8 0,16", C.ink, 1.5) + pth("M" + (MSX - 10) + "," + (MSY - 8) + " q-5,8 0,16", C.ink, 1.5) +
      txt(360, 232, "ringing signal", 12, C.red, ' font-weight="700"'));
    s += vis(T[4], T[5], txt(360, 150, "answer (받음)", 12, C.red, ' font-weight="700"'));
    s += vis(T[5], T[6], txt(360, 232, "voice channel 할당", 12, C.b, ' font-weight="700"'));

    // ⑦ voice channel
    var L = 115 + 595 + 126;
    s += '<path d="M105,208 L105,323 L700,323 L700,197" fill="none" stroke="' + C.b + '" stroke-width="3.5" stroke-dasharray="' + L + '" stroke-dashoffset="' + L + '">' +
      '<animate attributeName="stroke-dashoffset" values="' + L + ';' + L + ';0;0" keyTimes="0;' + r4(T[6] / D) + ';' + r4((T[6] + 1) / D) + ';1" dur="' + D + 's" fill="freeze"/></path>';
    s += vis(T[6], D, txt(410, 316, "⑦ Voice channel", 13, C.b, ' font-weight="700"'));

    // ---- 진행 표시 ①–⑦ ----
    for (var i = 0; i < 7; i++) {
      var x = 380 + (i - 3) * 30;
      s += '<circle cx="' + x + '" cy="344" r="10" fill="#fff" stroke="#bbb" stroke-width="1.4"/>';
      s += vis(T[i], T[i + 1], '<circle cx="' + x + '" cy="344" r="10" fill="' + C.red + '"/>');
      s += txt(x, 348.5, String(i + 1), 11, "#555", ' font-weight="700"');
      s += vis(T[i], T[i + 1], txt(x, 348.5, String(i + 1), 11, "#fff", ' font-weight="700"'));
    }

    // ---- 요점 ----
    s += txt(380, 369, "발신과 달리 MSC 는 MS 가 어디 있는지 모른다 → 모든 cell 에 paging 이 필요", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
