// ============================================================
// delay_four_parts — L12 p.28–33 네 가지 지연
//   A → (link1) → Router → (link2) → B, 라우터 n = 1, 링크 n + 1 = 2
//   비트 6개가 0.3 s 간격으로 나가고(transmission), 각 비트가 링크를 건너며(propagation),
//   라우터 input queue 대기(queuing) → process(processing) → output queue(queuing) → 다시 tr+pg → B processing
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["delay_four_parts"] = {
  title: "Delay 네 가지 — transmission · propagation · queuing · processing (13초)",
  desc: "[[transmission delay]](모든 비트를 링크에 밀어 넣는 시간)와 [[propagation delay]](비트 하나가 링크를 건너는 시간)는 '''링크마다''', [[processing delay]] 는 라우터와 목적지에서, [[queuing delay]] 는 '''라우터에서만''' 생긴다 → [[total delay 공식]]",
  duration: 13,
  build: function () {
    var D = 13;
    var C = { a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", bL: "#dff3e4", r: "#3b2f4a", rL: "#efe9f6", q: "#e09a40", qL: "#fdeec2", red: "#d6465f", muted: "#777", ink: "#222", bit: "#f6d77a" };
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var f = 0.1 / D, a = r4(from / D), b = r4(Math.min(from / D + f, (from + to) / 2 / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, to / D - f)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }
    // 0 부터 보이다가 to 에 사라짐
    function until(to, inner) {
      return '<g>' + inner + '<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;' + r4(to / D) + ';' + r4(Math.min(1, (to + 0.05) / D)) + ';1" dur="' + D + 's" fill="freeze"/></g>';
    }
    function rect(x, y, w, h, fill, stroke, rx) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 4) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>';
    }
    function bit(x, y) { return '<rect x="' + x + '" y="' + y + '" width="9" height="14" fill="' + C.bit + '" stroke="#b08a1a" stroke-width="1"/>'; }

    var NB = 6, GAP = 0.3, T0 = 1.2, PG1 = 1.6;
    var T2 = 7.6, PG2 = 1.4;
    var trEnd1 = T0 + (NB - 1) * GAP + GAP;      // 2.9
    var arr1 = T0 + (NB - 1) * GAP + PG1;         // 4.3 (마지막 비트 도착)
    var arr2 = T2 + (NB - 1) * GAP + PG2;         // 10.5

    var s = '<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="네 가지 지연 애니메이션">';
    s += '<defs><marker id="df_ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + C.a + '"/></marker></defs>';

    [
      [0, T0, "A 가 패킷(비트 6개)을 Router 를 거쳐 B 로 — 라우터 n = 1, 링크 n + 1 = 2"],
      [T0, trEnd1, "Transmission delay: 패킷의 모든 비트를 링크에 밀어 넣는 시간 = L / R"],
      [trEnd1, arr1, "Propagation delay: 비트 하나가 링크를 건너는 시간 = d / s"],
      [arr1, 5.8, "Queuing delay: 라우터의 input queue 에서 차례를 기다린다 (load 가 크면 길어짐)"],
      [5.8, 6.8, "Processing delay: 받아서 header 확인·오류 검사 → output port 로"],
      [6.8, T2, "다시 queuing: output queue 에서 내보낼 차례를 기다린다"],
      [T2, arr2, "두 번째 링크: 다시 transmission + propagation"],
      [arr2, 11.3, "목적지 B: processing 만 — queuing 은 라우터에서만 생긴다"],
      [11.3, D, "Total = (n+1)(tr + pg + pr) + n·qu   →   n = 1: 2(tr + pg + pr) + 1·qu"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 26, c[2], 14, C.ink, ' font-weight="700"')); });

    // ---- 그림 ----
    var Y = 140;
    s += rect(30, Y - 30, 80, 60, C.aL, C.a) + txt(70, Y - 38, "Host A", 13, C.a, ' font-weight="700"');
    s += rect(650, Y - 30, 80, 60, C.bL, C.b) + txt(690, Y - 38, "Host B", 13, C.b, ' font-weight="700"');
    s += '<line x1="110" y1="' + Y + '" x2="300" y2="' + Y + '" stroke="#888" stroke-width="3"/>';
    s += '<line x1="480" y1="' + Y + '" x2="650" y2="' + Y + '" stroke="#888" stroke-width="3"/>';
    s += txt(205, Y + 30, "link 1", 11, C.muted) + txt(565, Y + 30, "link 2", 11, C.muted);
    s += rect(296, Y - 32, 188, 74, C.rL, C.r, 6) + txt(390, Y - 40, "Router (n = 1)", 13, C.r, ' font-weight="700"');
    s += rect(308, Y - 12, 46, 24, "#fff", C.q, 2) + txt(331, Y + 30, "input queue", 10, C.q);
    s += rect(366, Y - 14, 48, 28, "#fff", C.r, 4) + txt(390, Y + 4, "Process", 11, C.r, ' font-weight="700"');
    s += rect(426, Y - 12, 46, 24, "#fff", C.q, 2) + txt(449, Y + 30, "output queue", 10, C.q);
    s += '<rect x="366" y="' + (Y - 14) + '" width="48" height="28" rx="4" fill="' + C.r + '" fill-opacity="0.25" opacity="0">' + show(5.8, 6.8) + '</rect>';
    s += '<rect x="650" y="' + (Y - 30) + '" width="80" height="60" rx="4" fill="' + C.b + '" fill-opacity="0.25" opacity="0">' + show(arr2, 11.3) + '</rect>';
    s += vis(arr2, 11.3, txt(690, Y + 48, "processing", 11, C.b, ' font-weight="700"'));

    // A 안의 비트 (오른쪽 것부터 나간다)
    for (var i = 0; i < NB; i++) {
      s += until(T0 + i * GAP, bit(94 - i * 11, Y - 7));
    }
    // link1 위를 가는 비트
    for (i = 0; i < NB; i++) {
      var st = T0 + i * GAP;
      s += vis(st, st + PG1, '<g>' + bit(110, Y - 7) + '<animateTransform attributeName="transform" type="translate" from="0,0" to="180,0" begin="' + r4(st) + 's" dur="' + PG1 + 's" fill="freeze"/></g>');
    }
    // 라우터 안 패킷 덩어리
    var blk = function (x) { var g = ''; for (var j = 0; j < NB; j++) g += '<rect x="' + (x + j * 6.5) + '" y="' + (Y - 6) + '" width="6" height="12" fill="' + C.bit + '" stroke="#b08a1a" stroke-width="0.6"/>'; return g; };
    s += vis(arr1, 5.8, blk(312));
    s += vis(5.8, 6.8, blk(371));
    s += vis(6.8, T2 + (NB - 1) * GAP, blk(430));
    // link2 위를 가는 비트
    for (i = 0; i < NB; i++) {
      var st2 = T2 + i * GAP;
      s += vis(st2, st2 + PG2, '<g>' + bit(480, Y - 7) + '<animateTransform attributeName="transform" type="translate" from="0,0" to="160,0" begin="' + r4(st2) + 's" dur="' + PG2 + 's" fill="freeze"/></g>');
    }
    s += vis(arr2, D, blk(670));

    // 설명 표시: tr / pg 화살표
    s += vis(T0, trEnd1, txt(112, Y - 22, "tr: push all bits out", 12, C.a, ' text-anchor="start" font-weight="700"'));
    s += vis(trEnd1, arr1, '<line x1="115" y1="' + (Y + 44) + '" x2="295" y2="' + (Y + 44) + '" stroke="' + C.a + '" stroke-width="2" marker-end="url(#df_ar)"/>' + txt(205, Y + 60, "pg: one bit crosses the link", 12, C.a, ' font-weight="700"'));
    s += vis(arr1, 5.8, txt(331, Y + 58, "Delay_qu", 12, C.q, ' font-weight="700"'));
    s += vis(5.8, 6.8, txt(390, Y + 58, "Delay_pr", 12, C.r, ' font-weight="700"'));
    s += vis(6.8, T2, txt(449, Y + 58, "Delay_qu", 12, C.q, ' font-weight="700"'));
    s += vis(T2, arr2, txt(565, Y - 22, "tr + pg (link 2)", 12, C.a, ' font-weight="700"'));

    // ---- 아래 집계 ----
    var by = 240;
    s += '<rect x="20" y="' + (by - 22) + '" width="720" height="86" rx="6" fill="#fafafa" stroke="#ddd"/>';
    var rows = [
      [arr1, C.a, "링크마다 tr + pg", "link 1 ✓", arr2, "link 2 ✓", "→ (n + 1) = 2 번"],
      [6.8, C.r, "processing", "Router ✓", 11.3, "Host B ✓", "→ (n + 1) = 2 번"],
      [T2, C.q, "queuing (input + output queue)", "Router ✓", null, "Host B 없음", "→ n = 1 번 (라우터만)"]
    ];
    rows.forEach(function (r, k) {
      var y = by + k * 24;
      s += txt(40, y, r[2], 12, r[1], ' text-anchor="start" font-weight="700"');
      s += vis(r[0], D, txt(330, y, r[3], 12, C.ink, ' text-anchor="start"'));
      s += vis(r[4] === null ? 10.8 : r[4], D, txt(430, y, r[5], 12, r[4] === null ? C.red : C.ink, ' text-anchor="start"'));
      s += vis(r[4] === null ? 10.8 : r[4], D, txt(560, y, r[6], 12, r[1], ' text-anchor="start" font-weight="700"'));
    });

    s += txt(380, 332, "요점: Total delay = (n + 1)(Delay_tr + Delay_pg + Delay_pr) + (n)(Delay_qu)", 13, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
