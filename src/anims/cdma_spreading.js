// ============================================================
// cdma_spreading — CDMA 원리: d × Walsh code → 채널에서 합 → 수신자가 자기 code 로 곱해 평균
// CONTRACT §7. Forouzan 보충 (+ 슬라이드 L10 IS-95 장의 CDMA 그림). Walsh code:
//   c1=[+1 +1 +1 +1], c2=[+1 −1 +1 −1], c3=[+1 +1 −1 −1]; d1=+1, d2=−1, d3=+1
//   합 = [+1 +3 −1 +1]; 합·c2 = [+1 −3 −1 −1] → Σ=−4 → ÷4 = −1 = d2
// 시간축(초): 0 비트 → 1.5 d·c (행별) → 4.5 채널 합 → 7 수신자 2 가 c2 곱함 → 10 Σ÷4 → 12.5 요점 → 14 끝
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["cdma_spreading"] = {
  title: "CDMA — 같은 주파수·같은 시간에 섞어 보내고 code 로 꺼낸다",
  desc: "(Forouzan 보충) 스테이션마다 데이터 비트(+1/−1)에 자기 [[Walsh code]] 칩열을 곱해 보내면 채널에서 더해진다. 수신자는 자기 code 를 곱해 평균 내면 자기 비트만 남고 나머지는 0 으로 상쇄 — [[CDMA]] · [[DSSS]] · [[IS-95]]",
  duration: 14,
  build: function () {
    var D = 14;
    var C = { a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", bL: "#dff3e4", c: "#e09a40", cL: "#fdeec2", dev: "#3b2f4a", devL: "#efe9f6", hot: "#d6465f", muted: "#777" };
    var UC = [[C.a, C.aL], [C.b, C.bL], [C.c, C.cL]];
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
    function sg(v) { return v > 0 ? "+" + v : "−" + (-v); }
    // 칩 파형(계단): 칩 값 배열, 시작 x, 칩 폭, 기준선 y, 단위 높이
    function step(vals, x0, cw, y, sc, col, colL) {
      var d = "M" + x0 + "," + y;
      vals.forEach(function (v, i) { d += " L" + (x0 + i * cw) + "," + (y - v * sc) + " L" + (x0 + (i + 1) * cw) + "," + (y - v * sc); });
      d += " L" + (x0 + vals.length * cw) + "," + y + " Z";
      var g = '<line x1="' + (x0 - 4) + '" y1="' + y + '" x2="' + (x0 + vals.length * cw + 4) + '" y2="' + y + '" stroke="#999" stroke-dasharray="3 3"/>';
      g += '<path d="' + d + '" fill="' + colL + '" stroke="' + col + '" stroke-width="2"/>';
      return g;
    }
    function cells(vals, x0, y, w, h, col, colL, size) {
      var g = "";
      vals.forEach(function (v, i) {
        g += '<rect x="' + (x0 + i * w) + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + colL + '" stroke="' + col + '"/>' +
          txt(x0 + i * w + w / 2, y + h / 2 + 4, sg(v), size || 12, col, ' font-weight="700"');
      });
      return g;
    }

    var codes = [[1, 1, 1, 1], [1, -1, 1, -1], [1, 1, -1, -1]];
    var data = [1, -1, 1];
    var prod = codes.map(function (c, i) { return c.map(function (x) { return x * data[i]; }); });
    var sum = [0, 1, 2, 3].map(function (k) { return prod[0][k] + prod[1][k] + prod[2][k]; });      // [1, 3, -1, 1]
    var r2 = sum.map(function (v, k) { return v * codes[1][k]; });                                 // [1, -3, -1, -1]
    var tot = r2.reduce(function (a, b) { return a + b; }, 0);                                      // -4

    var s = '<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CDMA 확산과 복원 애니메이션">';
    s += '<defs><marker id="cd_arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#555"/></marker></defs>';

    // ---- 단계 자막 ----
    var caps = [
      [0, 1.5, "세 스테이션이 같은 주파수 · 같은 시간에 보낸다 — 각자 데이터 비트 d (+1 / −1)"],
      [1.5, 4.5, "각 비트에 자기 Walsh code (칩 4 개)를 곱한다 → d · c = 칩열"],
      [4.5, 7, "채널에서 세 신호가 더해진다 → 합성 신호 [+1 +3 −1 +1] 하나"],
      [7, 10, "수신자 2 는 자기 code c₂ 를 칩마다 곱한다 → [+1 −3 −1 −1]"],
      [10, 12.5, "다 더해서 칩 수 4 로 나누면 −4 / 4 = −1 = d₂ — 다른 스테이션 몫은 0"],
      [12.5, D, "같은 주파수 · 같은 시간이지만 code 가 직교라서 각자 자기 비트만 꺼낸다"]
    ];
    caps.forEach(function (c) { s += during(c[0], c[1], txt(380, 24, c[2], 14, "#222", ' font-weight="700"')); });
    s += '<rect x="676" y="38" width="76" height="18" rx="9" fill="' + C.devL + '" stroke="' + C.dev + '"/>' + txt(714, 51, "Forouzan 보충", 10, C.dev, ' font-weight="700"');

    // ---- 열 제목 ----
    s += txt(66, 56, "데이터 비트 d", 11, C.muted, ' font-weight="700"');
    s += txt(205, 56, "Walsh code c₁ · c₂ · c₃", 11, C.muted, ' font-weight="700"');
    s += txt(355, 56, "d · c (칩열)", 11, C.muted, ' font-weight="700"');
    s += txt(560, 56, "채널 (합)", 11, C.muted, ' font-weight="700"');

    // ---- 스테이션 3 행 ----
    var RY = [86, 142, 198];
    RY.forEach(function (y, i) {
      var col = UC[i][0], colL = UC[i][1];
      s += '<rect x="14" y="' + (y - 20) + '" width="104" height="40" rx="6" fill="' + colL + '" stroke="' + col + '" stroke-width="1.6"/>';
      s += txt(66, y - 4, "Station " + (i + 1), 12, col, ' font-weight="700"');
      s += txt(66, y + 13, "d" + "₁₂₃".charAt(i) + " = " + sg(data[i]), 12, col, ' font-weight="700"');
      s += txt(131, y + 5, "×", 15, "#333", ' font-weight="700"');
      s += cells(codes[i], 145, y - 11, 30, 22, col, "#fff", 11);
      var ta = 1.8 + i * 0.9;
      s += during(ta - 0.2, ta + 0.8, '<rect x="141" y="' + (y - 15) + '" width="128" height="30" rx="4" fill="none" stroke="' + C.hot + '" stroke-width="2"/>');
      s += during(ta, D, txt(280, y + 5, "=", 15, "#333", ' font-weight="700"') + step(prod[i], 296, 30, y + 2, 15, col, colL) +
        prod[i].map(function (v, k) { return txt(296 + k * 30 + 15, v > 0 ? y + 16 : y - 4, sg(v), 10, col, ' font-weight="700"'); }).join(""));
      // 채널로 가는 화살표
      s += during(4.6, D, '<path d="M422,' + (y + 2) + ' C446,' + (y + 2) + ' 446,142 470,142" fill="none" stroke="' + col + '" stroke-width="1.8" marker-end="url(#cd_arr)"/>');
    });

    // ---- 채널 합 ----
    var CX0 = 480, CW = 40, CBY = 160, CSC = 14;
    s += '<rect x="' + (CX0 - 10) + '" y="66" width="' + (4 * CW + 20) + '" height="130" rx="8" fill="#fafbfd" stroke="#dfe3ea"/>';
    s += during(5.2, D, step(sum, CX0, CW, CBY, CSC, C.dev, C.devL) +
      sum.map(function (v, k) { return txt(CX0 + k * CW + CW / 2, v > 0 ? CBY - v * CSC - 5 : CBY - v * CSC + 13, sg(v), 12, C.dev, ' font-weight="700"'); }).join(""));
    s += during(5.6, D, txt(CX0 + 2 * CW, 212, "+1·c₁ − 1·c₂ + 1·c₃ 가 겹친 것", 11, C.dev));

    // ---- 수신자 2 ----
    s += '<line x1="14" y1="222" x2="746" y2="222" stroke="#e3e3e3"/>';
    s += during(7, D, '<path d="M560,216 C560,232 470,232 392,244" fill="none" stroke="#555" stroke-width="1.6" marker-end="url(#cd_arr)"/>');
    s += '<rect x="14" y="238" width="104" height="40" rx="6" fill="' + C.bL + '" stroke="' + C.b + '" stroke-width="1.6"/>';
    s += txt(66, 254, "수신자 2", 12, C.b, ' font-weight="700"') + txt(66, 271, "(c₂ 를 안다)", 11, C.b);
    var RX = 200, RW = 44, RH = 22;
    s += during(7.2, D, txt(RX - 8, 250, "채널", 12, C.dev, ' font-weight="700" text-anchor="end"') + cells(sum, RX, 234, RW, RH, C.dev, C.devL));
    s += during(7.9, D, txt(RX - 8, 276, "× c₂", 12, C.b, ' font-weight="700" text-anchor="end"') + cells(codes[1], RX, 260, RW, RH, C.b, "#fff"));
    s += during(8.8, D, txt(RX - 8, 302, "=", 13, "#333", ' font-weight="700" text-anchor="end"') + cells(r2, RX, 286, RW, RH, C.hot, "#fdeef0"));
    s += during(8.8, D, '<line x1="' + RX + '" y1="283" x2="' + (RX + 4 * RW) + '" y2="283" stroke="#333" stroke-width="1.2"/>');
    // Σ 와 ÷4
    s += during(10.2, D, txt(RX + 4 * RW + 14, 302, "Σ = " + sg(tot), 14, C.hot, ' font-weight="700" text-anchor="start"'));
    s += during(11, D, '<rect x="470" y="282" width="270" height="28" rx="6" fill="' + C.bL + '" stroke="' + C.b + '" stroke-width="1.6"/>' +
      txt(605, 301, "÷ 4 (칩 수) = −1 = d₂ ✓", 14, C.b, ' font-weight="700"'));
    s += during(11.8, D, txt(470, 252, "c₁ 로 하면 +4/4 = +1 = d₁,  c₃ 로 하면 +4/4 = +1 = d₃", 11, "#333", ' text-anchor="start"') +
      txt(470, 270, "c₁·c₂ = c₂·c₃ = 0 (직교) → 남의 몫은 0 으로 상쇄", 11, "#333", ' text-anchor="start"'));

    // ---- 요점 ----
    s += txt(380, 344, "CDMA: 모두가 같은 주파수 · 같은 시간을 쓰고, 직교하는 code 로 분리한다 (IS-95 의 기반, DSSS)", 12, C.muted);
    s += txt(380, 364, "수신: 합성 신호 × 내 code → 더하고 칩 수로 나누기 = 내 데이터 비트", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
