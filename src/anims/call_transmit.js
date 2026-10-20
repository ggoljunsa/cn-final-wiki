// ============================================================
// call_transmit — L10 p.12 (Operation: Transmitting, making a call) ①–⑦
// 0–1 초기 → ① 1–2.8 → ② 2.8–4.4 → ③ 4.4–6 → ④ 6–7.6 → ⑤ 7.6–9.2 → ⑥ 9.2–10.8 → ⑦ 10.8–14
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["call_transmit"] = {
  title: "통화 발신 (making a call) ①–⑦ — 14초",
  desc: "MS 가 전화를 걸 때: setup channel 로 번호 → [[base station|BS]] → [[MSC]] → telephone central office → called party 연결 → 결과가 MSC 로 → MSC 가 unused voice channel 할당 → 통화. [[통화 수신 과정|수신]]과 달리 paging 이 없다",
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

    var s = '<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="셀룰러 통화 발신 7단계 애니메이션">';
    s += '<defs>' + marker("ct_ar", "#444") + marker("ct_arG", C.b) + '</defs>';

    var T = [1, 2.8, 4.4, 6, 7.6, 9.2, 10.8, D];
    s += caps([
      [0, T[0], "MS(휴대폰)가 전화를 건다 — 상대(called party)는 유선 전화망 쪽에 있다"],
      [T[0], T[1], "① MS 가 대역을 scan 해 가장 강한 setup channel 로 상대 번호를 보낸다"],
      [T[1], T[2], "② BS 가 그 번호를 MSC 로 중계(relay)한다"],
      [T[2], T[3], "③ MSC 가 번호를 telephone central office 로 전달(forward)한다"],
      [T[3], T[4], "④ central office 가 called party 를 연결한다 (받을 수 있으면)"],
      [T[4], T[5], "⑤ 연결 결과가 MSC 로 되돌아온다(relay back)"],
      [T[5], T[6], "⑥ MSC 가 쓰지 않는(unused) voice channel 을 할당 → MS 가 그 채널로 retune"],
      [T[6], D, "⑦ 할당된 voice channel 로 통화 시작 (communication begins)"]
    ]);

    // ---- 고정 그림 ----
    s += hex(150, 175, 72, C.cellL, C.cell, false);
    s += txt(104, 136, "Cell", 12, "#9a7a10");
    s += tower(178, 150, C.dev) + txt(204, 144, "BS", 13, C.dev, ' font-weight="700"');
    s += phone(118, 205, C.a, C.aL) + txt(102, 210, "MS", 13, C.a, ' font-weight="700" text-anchor="end"');
    s += rbox(290, 148, 120, 50, C.aL, C.a, "MSC", 15, C.a);
    s += rbox(490, 148, 150, 50, C.cL, C.c, ["Telephone", "central office"], 13, "#8a5a10");
    s += phone(700, 168, C.ink, "#fff") + txt(700, 146, "Called party", 12, C.ink);

    // ---- 화살표 + 번호 (단계마다 나타나 남는다) ----
    var A = [
      [126, 196, 171, 134, "①", 136, 160, ""],
      [190, 141, 287, 160, "②", 240, 139, ""],
      [413, 164, 487, 164, "③", 450, 156, ""],
      [643, 164, 687, 164, "④", 665, 182, ""],
      [487, 186, 413, 186, "⑤", 450, 205, ' stroke-dasharray="5 4"'],
      [289, 192, 129, 207, "⑥", 212, 216, ""]
    ];
    A.forEach(function (a, i) {
      s += vis(T[i], D, line(a[0], a[1], a[2], a[3], "#444", 1.8, ' marker-end="url(#ct_ar)"' + a[7]) +
        txt(a[5], a[6], a[4], 14, C.red, ' font-weight="700"'));
      s += dot("M" + a[0] + "," + a[1] + " L" + a[2] + "," + a[3], T[i], 1.1, C.red, 5);
    });

    // ① scan: MS 주변에 퍼지는 호
    s += vis(T[0], T[1],
      pth("M104,193 q-8,12 0,24", C.a, 1.6) + pth("M98,188 q-13,17 0,34", C.a, 1.4) +
      txt(150, 258, "strongest setup channel", 11, C.red, ' font-weight="700"'));
    // ④ 상대 전화가 울림
    s += vis(T[3] + 0.6, T[4], pth("M712,158 q6,10 0,20", C.ink, 1.5) + pth("M688,158 q-6,10 0,20", C.ink, 1.5));
    // ⑤ 결과
    s += vis(T[4], T[5], txt(565, 222, "연결 결과 (OK)", 11, "#8a5a10", ' font-weight="700"'));
    // ⑥ retune
    s += vis(T[5] + 0.5, T[6], txt(150, 258, "MS: voice channel 로 retune", 11, C.a, ' font-weight="700"'));

    // ⑦ voice channel (그려지는 초록 선)
    var L = 73 + 582 + 109;
    s += '<path d="M118,217 L118,290 L700,290 L700,181" fill="none" stroke="' + C.b + '" stroke-width="3.5" stroke-dasharray="' + L + '" stroke-dashoffset="' + L + '">' +
      '<animate attributeName="stroke-dashoffset" values="' + L + ';' + L + ';0;0" keyTimes="0;' + r4(T[6] / D) + ';' + r4((T[6] + 1) / D) + ';1" dur="' + D + 's" fill="freeze"/></path>';
    s += vis(T[6], D, txt(410, 308, "⑦ Voice channel", 13, C.b, ' font-weight="700"'));

    // ---- 진행 표시 ①–⑦ ----
    var nums = ["①", "②", "③", "④", "⑤", "⑥", "⑦"];
    nums.forEach(function (n, i) {
      var x = 380 + (i - 3) * 30;
      s += '<circle cx="' + x + '" cy="330" r="10" fill="#fff" stroke="#bbb" stroke-width="1.4"/>';
      s += vis(T[i], T[i + 1], '<circle cx="' + x + '" cy="330" r="10" fill="' + C.red + '"/>');
      s += txt(x, 334.5, String(i + 1), 11, "#555", ' font-weight="700"');
      s += vis(T[i], T[i + 1], txt(x, 334.5, String(i + 1), 11, "#fff", ' font-weight="700"'));
    });

    // ---- 요점 ----
    s += txt(380, 354, "발신: MS → BS → MSC → central office → 상대 → (결과) MSC → unused voice channel 할당 → 통화", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
