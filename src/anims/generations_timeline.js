// ============================================================
// generations_timeline — 셀룰러 1G → 2G → 3G → 4G 가 왼쪽부터 쌓이고, 아래에 아날로그→디지털→데이터→all-IP
// CONTRACT §7. 슬라이드 L10 1G AMPS · 2G D-AMPS/GSM/IS-95 · 3G IMT-2000 · 4G.
// 시간축(초): 0 빈 카드 → 1.2 1G → 3.4 2G → 5.6 3G → 7.8 4G → 10 아래 화살표 완성 → 12 끝
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["generations_timeline"] = {
  title: "셀룰러 세대 1G → 4G — 아날로그에서 all-IP 까지",
  desc: "[[1G]]([[AMPS]], analog, [[FDMA]]) → [[2G]](digital: [[D-AMPS]]·[[GSM]] = [[TDMA]], [[IS-95]] = [[CDMA]]) → [[3G]]([[IMT-2000]]: 144 kbps / 384 kbps / 2 Mbps) → [[4G]](100 Mbps / 1 Gbps, [[all-IP]])",
  duration: 12,
  build: function () {
    var D = 12;
    var C = { a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", bL: "#dff3e4", c: "#e09a40", cL: "#fdeec2", d: "#8a5cc4", dL: "#efe6fa", dev: "#3b2f4a", devL: "#efe9f6", hot: "#d6465f", muted: "#777" };
    function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || "#222") + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + esc(s) + '</text>';
    }
    function show(a, b) {
      var k = [0], v = [a <= 0 ? 1 : 0];
      if (a > 0) { k.push(a / D, Math.min(1, (a + 0.15) / D)); v.push(0, 1); }
      if (b < D) { k.push(b / D, Math.min(1, (b + 0.15) / D)); v.push(1, 0); }
      if (k[k.length - 1] < 1) { k.push(1); v.push(v[v.length - 1]); }
      return '<animate attributeName="opacity" values="' + v.join(";") + '" keyTimes="' + k.map(function (x) { return +x.toFixed(4); }).join(";") + '" dur="' + D + 's" fill="freeze"/>';
    }
    function during(a, b, inner) { return '<g opacity="' + (a <= 0 ? 1 : 0) + '">' + inner + show(a, b) + '</g>'; }

    var s = '<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="셀룰러 세대 타임라인 애니메이션">';
    s += '<defs><marker id="gt_arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + C.dev + '"/></marker></defs>';

    // ---- 단계 자막 ----
    var caps = [
      [0, 1.2, "셀룰러 이동통신은 세대(generation)마다 무엇이 바뀌었나"],
      [1.2, 3.4, "1G: AMPS — analog 음성, FDMA (30 kHz 채널)"],
      [3.4, 5.6, "2G: digital 음성 — D-AMPS · GSM 은 TDMA, IS-95 는 CDMA"],
      [5.6, 7.8, "3G: IMT-2000 — 데이터: 144 kbps 차량 / 384 kbps 보행 / 2 Mbps 정지"],
      [7.8, 10, "4G: 100 Mbps 이동 / 1 Gbps 정지, all-IP packet-switched network"],
      [10, D, "아날로그 → 디지털 → 데이터 → all-IP"]
    ];
    caps.forEach(function (c) { s += during(c[0], c[1], txt(380, 26, c[2], 14, "#222", ' font-weight="700"')); });

    // ---- 카드 4장 ----
    var cards = [
      { g: "1G", sub: "AMPS", col: C.a, colL: C.aL, t: 1.2, lines: [["analog", 1], ["FDMA", 1], ["30 kHz 채널, FM", 0], ["voice 만", 0], ["북미 대표 시스템", 0]] },
      { g: "2G", sub: "D-AMPS · GSM · IS-95", col: C.b, colL: C.bL, t: 3.4, lines: [["digital", 1], ["D-AMPS · GSM", 0], ["→ TDMA", 1], ["IS-95", 0], ["→ CDMA (DSSS)", 1]] },
      { g: "3G", sub: "IMT-2000 (ITU)", col: C.c, colL: C.cL, t: 5.6, lines: [["144 kbps 차량", 1], ["384 kbps 보행", 1], ["2 Mbps 정지", 1], ["packet + circuit", 0], ["W-CDMA · CDMA 2000", 0]] },
      { g: "4G", sub: "all-IP", col: C.d, colL: C.dL, t: 7.8, lines: [["100 Mbps 이동", 1], ["1 Gbps 정지", 1], ["all-IP", 1], ["packet-switched", 0], ["smooth handoff", 0]] }
    ];
    var CW = 170, GAP = 14, X0 = 18, CY = 44, CH = 220;
    cards.forEach(function (c, i) {
      var x = X0 + i * (CW + GAP), cx = x + CW / 2;
      s += '<rect x="' + x + '" y="' + CY + '" width="' + CW + '" height="' + CH + '" rx="10" fill="#fafbfd" stroke="#dfe3ea" stroke-dasharray="5 4"/>';
      s += txt(cx, CY + CH / 2, c.g, 28, "#d9dde5", ' font-weight="700"');
      var g = '<rect x="' + x + '" y="' + CY + '" width="' + CW + '" height="' + CH + '" rx="10" fill="#fff" stroke="' + c.col + '" stroke-width="2"/>';
      g += '<path d="M' + (x + 10) + ',' + CY + ' L' + (x + CW - 10) + ',' + CY + ' Q' + (x + CW) + ',' + CY + ' ' + (x + CW) + ',' + (CY + 10) + ' L' + (x + CW) + ',' + (CY + 52) + ' L' + x + ',' + (CY + 52) + ' L' + x + ',' + (CY + 10) + ' Q' + x + ',' + CY + ' ' + (x + 10) + ',' + CY + ' Z" fill="' + c.colL + '" stroke="' + c.col + '" stroke-width="2"/>';
      g += txt(cx, CY + 26, c.g, 20, c.col, ' font-weight="700"');
      g += txt(cx, CY + 44, c.sub, 12, c.col, ' font-weight="700"');
      c.lines.forEach(function (L, k) {
        g += txt(cx, CY + 82 + k * 30, L[0], L[1] ? 13 : 12, L[1] ? "#222" : "#555", L[1] ? ' font-weight="700"' : "");
      });
      // 현재 세대 강조 테두리
      s += during(c.t, D, g);
      s += during(c.t, c.t + 2.2, '<rect x="' + (x - 3) + '" y="' + (CY - 3) + '" width="' + (CW + 6) + '" height="' + (CH + 6) + '" rx="12" fill="none" stroke="' + C.hot + '" stroke-width="2.5"/>');
      // 다음 카드로 화살표
      if (i < 3) s += during(c.t + 1.6, D, '<path d="M' + (x + CW + 2) + ',' + (CY + 26) + ' L' + (x + CW + GAP - 2) + ',' + (CY + 26) + '" stroke="' + C.dev + '" stroke-width="2" marker-end="url(#gt_arr)"/>');
    });

    // ---- 아래 진화 화살표 ----
    var stages = ["아날로그", "디지털", "데이터", "all-IP"];
    var AY = 282;
    s += during(1.4, D, '<path d="M' + X0 + ',' + (AY + 4) + ' L' + (X0 + 4 * CW + 3 * GAP - 18) + ',' + (AY + 4) + ' L' + (X0 + 4 * CW + 3 * GAP - 18) + ',' + (AY - 6) + ' L' + (X0 + 4 * CW + 3 * GAP) + ',' + (AY + 14) + ' L' + (X0 + 4 * CW + 3 * GAP - 18) + ',' + (AY + 34) + ' L' + (X0 + 4 * CW + 3 * GAP - 18) + ',' + (AY + 24) + ' L' + X0 + ',' + (AY + 24) + ' Z" fill="#f2eef7" stroke="' + C.dev + '" stroke-width="1.2"/>');
    var segCol = [C.a, C.b, C.c, C.d];
    stages.forEach(function (st, i) {
      var cx = X0 + i * (CW + GAP) + CW / 2;
      s += during(cards[i].t + 0.6, D, txt(cx, AY + 19, st, 13, segCol[i], ' font-weight="700"') +
        (i < 3 ? txt(X0 + (i + 1) * (CW + GAP) - GAP / 2, AY + 19, "→", 13, C.dev, ' font-weight="700"') : ""));
    });
    s += during(10, D, txt(380, 334, "다중접속: FDMA → TDMA / CDMA → W-CDMA · CDMA 2000 · 전송: circuit → packet + circuit → all-IP packet", 12, C.dev, ' font-weight="700"'));

    // ---- 요점 ----
    s += txt(380, 352, "세대가 올라갈수록 아날로그 음성 → 디지털 음성 → 데이터 → 모든 것을 IP 패킷으로", 11, C.muted);
    s += '</svg>';
    return s;
  }
};
