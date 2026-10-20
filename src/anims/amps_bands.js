// ============================================================
// amps_bands — AMPS 의 두 대역: mobile station band (uplink) / base station band (downlink)
// CONTRACT §7. 슬라이드 L10 "AMPS (1G): Bands".
// 시간축(초): 0 두 대역 → 2 각 25 MHz = 832 × 30 kHz → 4.5 reverse(uplink) MS→BS
//   → 7 forward(downlink) BS→MS → 9.5 두 채널이 한 쌍 = duplex, 사업자당 416 채널 → 12 끝
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["amps_bands"] = {
  title: "AMPS 대역 — 824–849 MHz 로 올리고, 869–894 MHz 로 내린다",
  desc: "[[AMPS 대역과 채널|AMPS]] 는 mobile station band 824–849 MHz(reverse = [[uplink와 downlink|uplink]]) 와 base station band 869–894 MHz(forward = downlink) 두 대역을 쓴다. 각 대역 25 MHz = 832 개의 30 kHz 채널([[FDMA]])",
  duration: 12,
  build: function () {
    var D = 12;
    var C = { a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", bL: "#dff3e4", dev: "#3b2f4a", devL: "#efe9f6", hot: "#d6465f", muted: "#777", ch: "#5b9bd5" };
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
    // 선이 그려지는 효과 (stroke-dashoffset)
    // 화살촉은 선이 다 그려진 뒤(tip: 마지막 짧은 구간)에만 보인다
    function drawLine(d, len, col, a, b, tip) {
      return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="2.5" stroke-dasharray="' + len + '" stroke-dashoffset="' + len + '">' +
        '<animate attributeName="stroke-dashoffset" values="' + len + ';' + len + ';0;0" keyTimes="0;' + (+(a / D).toFixed(4)) + ';' + (+(b / D).toFixed(4)) + ';1" dur="' + D + 's" fill="freeze"/></path>' +
        during(b, D, '<path d="' + tip + '" fill="none" stroke="' + col + '" stroke-width="2.5" marker-end="url(#ab_arr_' + (col === C.hot ? "r" : "g") + ')"/>');
    }

    var s = '<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AMPS 대역 애니메이션">';
    s += '<defs>' +
      '<marker id="ab_arr_r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + C.hot + '"/></marker>' +
      '<marker id="ab_arr_g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + C.b + '"/></marker>' +
      '<marker id="ab_arr_k" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#555"/></marker></defs>';

    // ---- 단계 자막 ----
    var caps = [
      [0, 2, "AMPS 는 대역을 두 개 쓴다: mobile station band 와 base station band"],
      [2, 4.5, "각 대역은 25 MHz, 30 kHz 아날로그 채널 832 개로 나뉜다 (FDMA)"],
      [4.5, 7, "Reverse communication (uplink): mobile → base, 824–849 MHz 의 채널로"],
      [7, 9.5, "Forward communication (downlink): base → mobile, 869–894 MHz 의 채널로"],
      [9.5, D, "uplink 채널 하나 + downlink 채널 하나 = 통화 하나 → 두 대역으로 duplex"]
    ];
    caps.forEach(function (c) { s += during(c[0], c[1], txt(380, 26, c[2], 14, "#222", ' font-weight="700"')); });

    // ---- MS (왼쪽 폰) ----
    s += '<rect x="34" y="150" width="26" height="46" rx="5" fill="' + C.aL + '" stroke="' + C.a + '" stroke-width="2"/>' +
      '<rect x="39" y="157" width="16" height="14" rx="2" fill="#fff" stroke="' + C.a + '"/>' +
      '<line x1="54" y1="150" x2="54" y2="140" stroke="' + C.a + '" stroke-width="2"/>';
    s += txt(47, 214, "MS", 13, C.a, ' font-weight="700"');
    // ---- BS (오른쪽 탑) ----
    s += '<path d="M706,200 L716,146 L726,200 Z" fill="' + C.devL + '" stroke="' + C.dev + '" stroke-width="2"/>' +
      '<line x1="716" y1="146" x2="716" y2="134" stroke="' + C.dev + '" stroke-width="2"/>' +
      '<path d="M706,140 Q716,128 726,140" fill="none" stroke="' + C.dev + '" stroke-width="1.5"/>';
    s += txt(716, 214, "BS", 13, C.dev, ' font-weight="700"');

    // ---- 대역 2개 ----
    function band(x0, lo, hi, name, col, colL) {
      var g = '<rect x="' + x0 + '" y="150" width="240" height="40" rx="3" fill="#fff" stroke="#555" stroke-width="1.5"/>';
      [10, 52, 94, 196].forEach(function (dx) { g += '<rect x="' + (x0 + dx) + '" y="156" width="34" height="28" fill="' + C.ch + '"/>'; });
      g += txt(x0 + 158, 175, "…", 15, "#333", ' font-weight="700"');
      g += txt(x0, 142, lo, 12, "#222", ' font-weight="700"');
      g += txt(x0 + 240, 142, hi, 12, "#222", ' font-weight="700"');
      g += txt(x0 + 120, 208, name, 12, col, ' font-weight="700"');
      return g;
    }
    s += band(110, "824 MHz", "849 MHz", "Mobile station band", C.a);
    s += band(410, "869 MHz", "894 MHz", "Base station band", C.dev);

    // 25 MHz 괄호 (2–4.5 강조)
    [110, 410].forEach(function (x0) {
      s += during(2, 4.5, '<path d="M' + (x0 + 34) + ',132 L' + (x0 + 34) + ',126 L' + (x0 + 206) + ',126 L' + (x0 + 206) + ',132" fill="none" stroke="' + C.hot + '" stroke-width="2"/>' +
        txt(x0 + 120, 120, "25 MHz", 13, C.hot, ' font-weight="700"'));
    });
    // 30 kHz 괄호 (계속 보임, BS 대역 둘째 채널 아래)
    s += '<path d="M462,218 L462,224 L496,224 L496,218" fill="none" stroke="#333" stroke-width="1.5"/>' + txt(479, 238, "30 kHz", 11, "#333", ' font-weight="700"');
    // 832 채널 상자
    s += during(2, D, '<rect x="230" y="284" width="300" height="40" rx="6" fill="#fff6b0" stroke="#b9a520" stroke-width="1.5"/>' +
      txt(380, 300, "Each band is 25 MHz,", 12, "#222", ' font-weight="700"') +
      txt(380, 317, "made of 832 30-kHz analog channels", 12, "#222", ' font-weight="700"'));

    // ---- uplink: MS 대역 채널 3 → BS ----
    var upCh = '<rect x="204" y="156" width="34" height="28" fill="none" stroke="' + C.hot + '" stroke-width="3.5"/>';
    s += during(4.5, D, upCh);
    var upD = "M221,190 L221,256 L716,256 L716,224";
    s += drawLine(upD, 600, C.hot, 4.7, 6.2, "M716,236 L716,224");
    s += during(4.6, D, txt(468, 274, "Reverse (uplink): mobile → base", 12, C.hot, ' font-weight="700"'));
    s += '<circle r="6" fill="' + C.hot + '" opacity="0"><animateMotion begin="4.7s" dur="1.5s" fill="freeze" path="' + upD + '"/>' + show(4.7, 6.3) + '</circle>';

    // ---- downlink: BS 대역 채널 3 → MS ----
    var dnCh = '<rect x="504" y="156" width="34" height="28" fill="none" stroke="' + C.b + '" stroke-width="3.5"/>';
    s += during(7, D, dnCh);
    var dnD = "M521,150 L521,96 L47,96 L47,132";
    s += drawLine(dnD, 600, C.b, 7.2, 8.7, "M47,120 L47,132");
    s += during(7.1, D, txt(284, 88, "Forward (downlink): base → mobile", 12, C.b, ' font-weight="700"'));
    s += '<circle r="6" fill="' + C.b + '" opacity="0"><animateMotion begin="7.2s" dur="1.5s" fill="freeze" path="' + dnD + '"/>' + show(7.2, 8.8) + '</circle>';

    // ---- duplex 쌍 + 사업자 메모 ----
    s += during(9.5, D, '<rect x="560" y="284" width="186" height="40" rx="6" fill="' + C.devL + '" stroke="' + C.dev + '"/>' +
      txt(653, 300, "사업자 2 개가 나눠 → 각 416 채널", 11, C.dev, ' font-weight="700"') +
      txt(653, 317, "(그중 21 개는 control)", 11, C.dev));
    s += during(9.5, D, '<rect x="14" y="284" width="200" height="40" rx="6" fill="#fdeef0" stroke="' + C.hot + '"/>' +
      txt(114, 300, "uplink 1 + downlink 1", 12, C.hot, ' font-weight="700"') +
      txt(114, 317, "= duplex 통화 1 개", 12, C.hot, ' font-weight="700"'));

    // ---- 요점 ----
    s += txt(380, 348, "두 대역을 써서 duplex, 대역 안의 채널은 FDMA (30 kHz 씩) — reverse = uplink, forward = downlink", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
