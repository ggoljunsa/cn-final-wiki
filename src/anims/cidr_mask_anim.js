// ============================================================
// cidr_mask_anim — L13 p.11–18: 167.199.170.82/27 의 32비트에 mask 를 대고
//   AND → first (167.199.170.64), NOT(mask) 와 OR → last (167.199.170.95), N = NOT(mask)+1 = 32
//   시간축(초): 0 주소 → 1.5 prefix|suffix → 3 mask → 4.5–7 AND → 7–9.5 NOT·OR → 9.5–12 요약
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["cidr_mask_anim"] = {
  title: "Address mask — AND 로 first, OR NOT 으로 last (12초)",
  desc: "Example 7.1 167.199.170.82/27: [[address mask]](앞 27 개 1)와 AND 하면 suffix 가 0 이 되어 '''first = [[network address]]''', NOT(mask) 와 OR 하면 suffix 가 1 이 되어 '''last''' → [[block의 세 가지 정보]]",
  duration: 12,
  build: function () {
    var D = 12;
    var C = { a: "#1d65b3", aL: "#dbe8f7", s: "#c27a12", sL: "#fdeec2", red: "#d6465f", muted: "#777", ink: "#222", g: "#2e9e4f", gL: "#dff3e4" };
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var a = r4(from / D), b = r4(Math.min(1, (from + 0.1) / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, (to - 0.1) / D)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }
    function bits(x) { var s = ""; for (var i = 0; i < 4; i++) { var b = x[i].toString(2); while (b.length < 8) b = "0" + b; s += b; } return s; }

    var N = 27, X0 = 132, CW = 19;
    var ADDR = bits([167, 199, 170, 82]), MASK = "", FIRST = "", NOTM = "", LAST = "";
    for (var i = 0; i < 32; i++) {
      MASK += i < N ? "1" : "0";
      NOTM += i < N ? "0" : "1";
      FIRST += (ADDR[i] === "1" && MASK[i] === "1") ? "1" : "0";
      LAST += (ADDR[i] === "1" || NOTM[i] === "1") ? "1" : "0";
    }
    // 한 행: 32칸. sweep=true 이면 왼쪽부터 칸이 차례로 나타난다
    function row(y, b, from, sweep, label, val, valColor) {
      var g = vis(from, D, txt(X0 - 10, y + 15, label, 12, C.ink, ' text-anchor="end" font-weight="700"'));
      g += vis(from + (sweep ? 1.9 : 0.2), D, txt(X0 - 10, y + 30, val, 11, valColor || C.muted, ' text-anchor="end"'));
      for (var k = 0; k < 32; k++) {
        var x = X0 + k * CW, pre = k < N;
        var cell = '<rect x="' + x + '" y="' + y + '" width="' + (CW - 1) + '" height="22" fill="' + (pre ? C.aL : C.sL) + '" stroke="' + (k % 8 === 7 ? "#555" : "#bbb") + '"/>' +
          txt(x + CW / 2 - 0.5, y + 16, b[k], 13, pre ? C.a : C.s, ' font-family="monospace" font-weight="700"');
        g += vis(sweep ? from + k * 0.06 : from, D, cell);
      }
      return g;
    }

    var s = '<svg viewBox="0 0 760 350" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="address mask 애니메이션">';
    [
      [0, 1.5, "주어진 주소 167.199.170.82/27 을 32비트 2진수로 쓴다"],
      [1.5, 3, "/27 → 앞 27 비트 = prefix (network), 뒤 5 비트 = suffix (node)"],
      [3, 4.5, "Address mask: 앞 n = 27 개는 1, 뒤 32 − n = 5 개는 0 → 255.255.255.224"],
      [4.5, 7, "② address AND mask → prefix 는 그대로, suffix 는 전부 0 → first address"],
      [7, 9.5, "③ address OR NOT(mask) → suffix 는 전부 1 → last address"],
      [9.5, D, "① N = NOT(mask) + 1 = 31 + 1 = 32 → Block .64 ~ .95 (32 addresses)"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 24, c[2], 14, C.ink, ' font-weight="700"')); });

    // prefix | suffix 경계
    var bx = X0 + N * CW - 0.5;
    s += vis(1.5, D, '<line x1="' + bx + '" y1="44" x2="' + bx + '" y2="292" stroke="' + C.red + '" stroke-width="2" stroke-dasharray="5 4"/>' +
      txt(X0 + N * CW / 2, 54, "prefix: n = 27 bits", 12, C.a, ' font-weight="700"') + txt(bx + 5 * CW / 2, 54, "suffix 5", 12, C.s, ' font-weight="700"'));

    s += row(62, ADDR, 0.2, false, "address", "167.199.170.82");
    s += row(104, MASK, 3, false, "mask", "255.255.255.224");
    s += vis(4.5, 7, txt(X0 - 10, 160, "AND ↓", 12, C.red, ' text-anchor="end" font-weight="700"'));
    s += row(170, FIRST, 4.6, true, "first", "167.199.170.64", C.a);
    s += vis(7, D, row(212, NOTM, 7, false, "NOT(mask)", "0.0.0.31"));
    s += vis(7.6, 9.5, txt(X0 - 10, 266, "OR ↓", 12, C.red, ' text-anchor="end" font-weight="700"'));
    s += row(254, LAST, 7.4, true, "last", "167.199.170.95", C.a);

    // 요약 상자
    s += vis(9.5, D, '<rect x="160" y="298" width="440" height="26" rx="6" fill="' + C.gL + '" stroke="' + C.g + '"/>' +
      txt(380, 316, "Block: 167.199.170.64/27 ~ 167.199.170.95/27 · N = 2^5 = 32", 13, C.g, ' font-weight="700"'));
    s += txt(380, 342, "요점: first = (any address) AND mask · last = (any address) OR NOT(mask) · N = NOT(mask) + 1", 12, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
