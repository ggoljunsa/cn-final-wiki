// ============================================================
// subnet_split_anim — L13 p.23–26 Example 7.5: 14.24.74.0/24 (256) 을
//   120 → 128 (/25, .0), 60 → 64 (/26, .128), 10 → 16 (/28, .192), 나머지 48 reserve (.208–.255)
//   시간축(초): 0 원래 block → 1.5 need 세 개(점선) → 3 a 128 → 5 b 64 → 7 c 16 → 9 reserve 48 → 10.5–13 검산
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["subnet_split_anim"] = {
  title: "Subnetting — 큰 것부터 2^k 블록으로 자르기 (Example 7.5, 13초)",
  desc: "need 120 · 60 · 10 을 각각 '''128 · 64 · 16''' 으로 올려 '''큰 것부터''' 놓으면 시작 주소 0 · 128 · 192 가 저절로 블록 크기로 나누어떨어진다 → [[subnetting]] · [[Example 7.5 subnet 설계]]",
  duration: 13,
  build: function () {
    var D = 13;
    var C = { a: "#1d65b3", aL: "#dbe8f7", b: "#c27a12", bL: "#fdeec2", c: "#2e9e4f", cL: "#dff3e4", red: "#d6465f", muted: "#777", ink: "#222", dark: "#333" };
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var a = r4(from / D), b = r4(Math.min(1, (from + 0.15) / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, (to - 0.1) / D)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }
    function rect(x, y, w, h, fill, stroke, extra) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"' + (extra || "") + '/>';
    }
    // 폭이 0 → 최종 폭으로 자라는 막대
    function grow(x, y, w, h, fill, stroke, t0, dur) {
      return '<rect x="' + x + '" y="' + y + '" width="0" height="' + h + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2">' +
        '<animate attributeName="width" from="0" to="' + w + '" begin="' + t0 + 's" dur="' + dur + 's" fill="freeze"/></rect>';
    }

    var X0 = 60, W = 640, SC = W / 256;
    function X(k) { return X0 + k * SC; }

    var s = '<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="subnetting 애니메이션">';
    [
      [0, 1.5, "Block 14.24.74.0/24 → 2^(32−24) = 256 addresses (.0 … .255)"],
      [1.5, 3, "need: a 120 · b 60 · c 10 → 2 의 거듭제곱으로 올림: 128 · 64 · 16"],
      [3, 5, "가장 큰 a: 128 = 2^7 → /25, 시작 .0 (0 ÷ 128 ✓)"],
      [5, 7, "다음 b: 64 = 2^6 → /26, 시작 .128 (128 ÷ 64 = 2 ✓)"],
      [7, 9, "마지막 c: 16 = 2^4 → /28, 시작 .192 (192 ÷ 16 = 12 ✓)"],
      [9, 10.5, "used = 128 + 64 + 16 = 208 → 48 addresses reserve (.208 – .255)"],
      [10.5, D, "큰 것부터 놓았기 때문에 모든 시작 주소가 블록 크기로 나누어떨어진다"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 26, c[2], 14, C.ink, ' font-weight="700"')); });

    // 원래 block
    s += txt(X0, 58, "a. Original block  14.24.74.0/24  (N = 256)", 12, C.muted, ' text-anchor="start"');
    s += rect(X0, 66, W, 34, "#f4f4f4", "#888");
    s += txt(X0, 116, "14.24.74.0", 11, C.red, ' font-weight="700"') + txt(X0 + W, 116, "14.24.74.255", 11, C.dark, ' font-weight="700"');

    // need (점선, 실제 비율) — 1.5~3 초
    var needs = [[0, 120, "120"], [128, 60, "60"], [192, 10, "10"]];
    s += vis(1.5, 3, txt(X0, 146, "need (원래 크기 — 2 의 거듭제곱이 아님)", 12, C.red, ' text-anchor="start"'));
    needs.forEach(function (n) {
      s += vis(1.5, 3, rect(X(n[0]), 154, n[1] * SC, 30, "#fff", C.red, ' stroke-dasharray="5 3"') + txt(X(n[0] + n[1] / 2), 174, n[2], 12, C.red, ' font-weight="700"'));
    });

    // subblocks
    s += vis(3, D, txt(X0, 146, "b. Subblocks (largest first)", 12, C.muted, ' text-anchor="start"'));
    var subs = [
      [0, 128, "a  n = 25", "128", C.aL, C.a, 3.2, "14.24.74.0/25"],
      [128, 64, "b  n = 26", "64", C.bL, C.b, 5.2, "14.24.74.128/26"],
      [192, 16, "c /28", "16", C.cL, C.c, 7.2, "14.24.74.192/28"]
    ];
    subs.forEach(function (u) {
      s += vis(u[6], D, grow(X(u[0]), 154, u[1] * SC, 30, u[4], u[5], u[6], 1.0));
      s += vis(u[6] + 1, D, txt(X(u[0] + u[1] / 2), 174, u[2], 12, u[5], ' font-weight="700"'));
      s += vis(u[6] + 1, D, txt(X(u[0] + u[1] / 2), 146, u[3], 11, u[5], ' font-weight="700"'));
      s += vis(u[6] + 1, D, '<line x1="' + X(u[0]) + '" y1="186" x2="' + X(u[0]) + '" y2="200" stroke="' + u[5] + '" stroke-width="2"/>' +
        txt(X(u[0]) + (u[0] === 192 ? -8 : 2), u[0] === 192 ? 226 : 212, u[7], 11, u[5], ' text-anchor="' + (u[0] === 192 ? "end" : "start") + '" font-weight="700"'));
    });
    // reserve
    s += vis(9, D, rect(X(208), 154, 48 * SC, 30, C.dark, C.dark) + txt(X(232), 174, "Unused 48", 12, "#fff", ' font-weight="700"'));
    s += vis(9, D, txt(X(256), 212, ".208 – .255", 11, C.dark, ' text-anchor="end" font-weight="700"'));

    // 검산 표
    var ty = 250;
    s += vis(10.5, D, '<rect x="60" y="' + (ty - 18) + '" width="640" height="60" rx="6" fill="#fafafa" stroke="#ddd"/>' +
      txt(380, ty, "Check: 0 ÷ 128 = 0 ✓   128 ÷ 64 = 2 ✓   192 ÷ 16 = 12 ✓", 13, C.ink, ' font-weight="700"') +
      txt(380, ty + 24, "(작은 것부터 빈틈없이 놓으면 b 가 .16 에서 시작 → 16 ÷ 64 ✗)", 12, C.red));

    s += txt(380, 330, "요점: ① N_sub = 2^k  ② n_sub = 32 − log2 N_sub  ③ 시작 주소는 N_sub 로 나누어떨어진다 → 큰 것부터", 12, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
