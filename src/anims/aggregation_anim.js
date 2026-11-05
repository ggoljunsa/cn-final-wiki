// ============================================================
// aggregation_anim — L13 p.27–28 Example 7.6: 160.70.14.0/26 · .64/26 · .128/26 · .192/26
//   → ISP 가 하나로 묶어 160.70.14.0/24 만 광고. 바깥 라우터 표 4 줄 → 1 줄.
//   시간축(초): 0 블록 4개 → 2 비트로 보면 앞 24 비트 같음 → 4.5 표 4줄 → 6 1줄로 합침 → 8 패킷 .130 → Block 3 → 12
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["aggregation_anim"] = {
  title: "Address aggregation — /26 네 개를 /24 하나로 광고 (12초)",
  desc: "네 block 의 '''앞 24 비트가 같고''' 25–26 번째 비트만 00·01·10·11 로 다르다 → ISP 는 바깥 세상에 '''160.70.14.0/24 하나만''' 알리고, 들어온 패킷을 안에서 맞는 block 으로 보낸다 → [[address aggregation]] · [[Example 7.6]]",
  duration: 12,
  build: function () {
    var D = 12;
    var C = { y: "#e09a40", yL: "#fdeec2", a: "#1d65b3", aL: "#dbe8f7", r: "#3b2f4a", rL: "#efe9f6", red: "#d6465f", g: "#2e9e4f", gL: "#dff3e4", muted: "#777", ink: "#222" };
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var a = r4(from / D), b = r4(Math.min(1, (from + 0.15) / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, (to - 0.15) / D)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }
    function box(x, y, w, h, fill, stroke, rx) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 4) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>';
    }

    var s = '<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="address aggregation 애니메이션">';
    s += '<defs><marker id="ag_ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="' + C.a + '"/></marker></defs>';
    [
      [0, 2, "ISP 아래에 고객 block 네 개: 160.70.14.0/26 · .64/26 · .128/26 · .192/26"],
      [2, 4.5, "비트로 보면 앞 24 비트(160.70.14)가 같고, 25–26 번째 비트만 00 · 01 · 10 · 11"],
      [4.5, 6, "합치지 않으면 바깥 라우터는 네 줄을 따로 알아야 한다"],
      [6, 8, "Aggregation: 네 줄을 160.70.14.0/24 한 줄로 → 바깥에는 이것만 광고"],
      [8, 10.5, "목적지 160.70.14.130 → 바깥은 /24 만 보고 ISP 로, ISP 가 Block 3 (.128/26) 으로"],
      [10.5, D, "바깥 라우터의 표가 작아진다 = address summarization (route summarization)"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 24, c[2], 14, C.ink, ' font-weight="700"')); });

    // 블록 4개 (왼쪽)
    var blocks = [["Block 1", "160.70.14.0/26", "00"], ["Block 2", "160.70.14.64/26", "01"], ["Block 3", "160.70.14.128/26", "10"], ["Block 4", "160.70.14.192/26", "11"]];
    blocks.forEach(function (b, i) {
      var y = 52 + i * 58;
      s += box(20, y, 170, 40, C.yL, C.y) + txt(105, y + 17, b[0], 11, C.muted) + txt(105, y + 33, b[1], 13, C.ink, ' font-weight="700"');
      s += '<line x1="190" y1="' + (y + 20) + '" x2="300" y2="168" stroke="#999" stroke-width="1.5"/>';
      // 비트 표시 (2 ~ 4.5 초 강조, 이후 작게 유지)
      s += vis(2, 6, box(194, y + 6, 104, 28, "#fff", C.a, 3) +
        txt(246, y + 18, "…14 | " + b[2] + "xxxxxx", 10, C.a, ' font-family="monospace" font-weight="700"') + txt(246, y + 31, "24 같음 | 다름", 9, C.muted));
    });
    // ISP 라우터
    s += '<circle cx="330" cy="168" r="30" fill="' + C.aL + '" stroke="' + C.a + '" stroke-width="2"/>' + txt(330, 173, "ISP", 14, C.a, ' font-weight="700"');
    // 인터넷 + 바깥 라우터
    s += '<line x1="360" y1="168" x2="470" y2="168" stroke="' + C.a + '" stroke-width="2"/>';
    s += '<ellipse cx="610" cy="100" rx="130" ry="58" fill="#f4f4f4" stroke="#aaa"/>' + txt(610, 60, "Internet (바깥 라우터)", 12, C.muted);
    s += box(486, 70, 248, 90, "#fff", C.r);
    s += txt(610, 86, "forwarding table (바깥)", 11, C.r, ' font-weight="700"');
    // 4줄 버전
    blocks.forEach(function (b, i) { s += vis(4.5, 6.2, txt(610, 104 + i * 15, b[1] + "  → ISP", 12, C.ink, ' font-family="monospace"')); });
    // 1줄 버전
    s += vis(6.2, D, box(500, 104, 220, 26, C.gL, C.g) + txt(610, 122, "160.70.14.0/24  → ISP", 13, C.g, ' font-family="monospace" font-weight="700"'));
    s += vis(6.2, D, txt(610, 150, "4 줄 → 1 줄", 12, C.red, ' font-weight="700"'));
    s += '<line x1="470" y1="168" x2="520" y2="168" stroke="' + C.a + '" stroke-width="2"/>';
    s += vis(6, D, txt(470, 196, "Advertised: 160.70.14.0/24 only", 12, C.a, ' font-weight="700"'));

    // 패킷 이동: 바깥 → ISP → Block 3
    var pk = '<g>' + box(-34, -11, 68, 22, "#fff3bf", "#b08a1a", 3) + txt(0, 4, ".14.130", 11, C.ink, ' font-weight="700"') +
      '<animateMotion path="M 600 190 L 330 200 L 120 222" begin="8s" dur="2.5s" fill="freeze"/></g>';
    s += vis(8, D, pk);
    s += vis(9.6, D, '<rect x="18" y="166" width="174" height="44" rx="5" fill="none" stroke="' + C.red + '" stroke-width="3"/>');

    s += txt(380, 300, "Block 1–4 의 범위: .0–.63 · .64–.127 · .128–.191 · .192–.255  →  합치면 .0–.255 = /24", 12, C.muted);
    s += txt(380, 328, "요점: 작은 block 여러 개를 큰 block 하나로 — 바깥 라우터는 큰 block 의 prefix 만 알면 된다", 13, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
