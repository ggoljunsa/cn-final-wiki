// ============================================================
// lsp_flooding_anim — L15 p.17–19: A 의 LSP 가 flooding 으로 7 node 전체에 퍼진다
//   hop 1: A → B, D
//   hop 2: B → C, E / D → E (E 는 같은 LSP 를 두 번 받음 → 두 번째는 discard)
//   hop 3: C → F, G / E → D(이미 있음 discard), E → F(같은 시각 두 번째 discard)
//   hop 4: F → E, G / G → F → 전부 이미 있음 → discard. 이후 모든 node 의 LSDB 에 A 행이 같다
//   시간축(초): 0–1.5 초기 → 1.5–3.5 hop1 → 3.5–5.5 hop2 → 5.5–7.5 hop3 → 7.5–9.5 hop4 → 9.5–13 LSDB 결과
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["lsp_flooding_anim"] = {
  title: "Flooding — A 의 LSP 가 퍼지는 13초",
  desc: "A 가 자기 link 정보(B 2, D 3)를 [[flooding과 LSP|LSP]] 에 담아 모든 interface 로 보낸다. 받은 node 는 새것이면 보관하고 다시 내보내고, 이미 가진 것이면 버린다. 결국 모든 node 의 [[LSDB]] 에 같은 A 행이 생긴다.",
  duration: 13,
  build: function () {
    var D = 13;
    var C = { a: "#1d65b3", aL: "#dbe8f7", r: "#3b2f4a", rL: "#efe9f6", g: "#2e9e4f", gL: "#dff3e4", red: "#d6465f", muted: "#777", ink: "#222", y: "#e09a40", yL: "#fdeec2" };
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var a = r4(from / D), b = r4(Math.min(1, (from + 0.12) / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, (to - 0.12) / D)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }

    var P = { A: [120, 90], B: [290, 90], C: [460, 90], D: [120, 230], E: [290, 230], F: [460, 230], G: [600, 160] };
    var EDGES = [["A", "B", 2], ["A", "D", 3], ["B", "C", 5], ["B", "E", 4], ["C", "F", 4], ["C", "G", 3], ["D", "E", 5], ["E", "F", 2], ["F", "G", 1]];
    var s = '<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LSP flooding 애니메이션">';
    s += '<rect x="0" y="0" width="760" height="340" fill="#fff"/>';
    [
      [0, 1.5, "A 가 이웃에게 인사해서 link cost 를 안다: B 2, D 3"],
      [1.5, 3.5, "① A 가 LSP(A: B 2, D 3)를 모든 interface 로 보낸다"],
      [3.5, 5.5, "② 받은 B·D 는 새것이니 보관하고, 받은 쪽을 뺀 interface 로 다시 보낸다"],
      [5.5, 7.5, "③ E 는 같은 LSP 를 B 와 D 에게서 받았다 → 두 번째는 discard (빨강)"],
      [7.5, 9.5, "④ 마지막 forward 는 전부 이미 가진 node 에 도착 → discard"],
      [9.5, D, "모든 node 의 LSDB 에 같은 A 행. 7 node 가 다 하면 LSDB 가 완성된다"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 26, c[2], 14, C.ink, ' font-weight="700"')); });

    EDGES.forEach(function (e) {
      var p = P[e[0]], q = P[e[1]];
      s += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" stroke="#ccc" stroke-width="2"/>';
      s += txt((p[0] + q[0]) / 2 + 8, (p[1] + q[1]) / 2 - 6, e[2], 11, C.muted);
    });
    // node 가 LSP 를 받은 시각 → 색 바뀜
    var got = { A: 0, B: 3.5, D: 3.5, C: 5.5, E: 5.5, F: 7.5, G: 7.5 };
    Object.keys(P).forEach(function (n) {
      var p = P[n];
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="20" fill="' + C.rL + '" stroke="' + C.r + '" stroke-width="2"/>';
      s += vis(got[n], D, '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="20" fill="' + C.gL + '" stroke="' + C.g + '" stroke-width="2.5"/>');
      s += txt(p[0], p[1] + 5, n, 14, C.ink, ' font-weight="700"');
    });
    // 메시지 점: [from, to, hop, dup]
    var M = [
      ["A", "B", 1, 0], ["A", "D", 1, 0],
      ["B", "C", 2, 0], ["B", "E", 2, 0], ["D", "E", 2, 1],
      ["C", "F", 3, 0], ["C", "G", 3, 0], ["E", "D", 3, 1], ["E", "F", 3, 1],
      ["F", "E", 4, 1], ["F", "G", 4, 1], ["G", "F", 4, 1]
    ];
    M.forEach(function (m) {
      var p = P[m[0]], q = P[m[1]], t0 = 1.5 + (m[2] - 1) * 2, t1 = t0 + 1.6;
      var dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy);
      var x1 = p[0] + dx / L * 22, y1 = p[1] + dy / L * 22, x2 = q[0] - dx / L * 30, y2 = q[1] - dy / L * 30;
      var col = m[3] ? C.red : C.y;
      s += vis(t0, t1 + 0.35, '<g><rect x="-17" y="-9" width="34" height="18" rx="3" fill="' + (m[3] ? "#fde2e4" : C.yL) + '" stroke="' + col + '" stroke-width="1.5"/>' + txt(0, 4, "LSP", 10, col, ' font-weight="700"') +
        '<animateMotion path="M' + r4(x1) + ',' + r4(y1) + ' L' + r4(x2) + ',' + r4(y2) + '" begin="' + t0 + 's" dur="1.6s" fill="freeze"/></g>');
      if (m[3]) s += vis(t1, t1 + 0.4 < D ? t1 + 0.4 : D, txt(x2, y2 - 12, "✗ discard", 11, C.red, ' font-weight="700"'));
    });
    // A 의 LSP 표
    s += '<rect x="30" y="268" width="150" height="56" rx="4" fill="' + C.yL + '" stroke="' + C.y + '"/>';
    s += txt(105, 286, "A 의 LSP", 12, C.ink, ' font-weight="700"') + txt(105, 304, "B 2 · D 3", 13, C.ink) + txt(105, 319, "(newer 면 keep &amp; forward)", 10, C.muted);
    // 결과 LSDB 한 줄
    s += vis(9.5, D, '<rect x="220" y="282" width="520" height="40" rx="4" fill="' + C.gL + '" stroke="' + C.g + '"/>' +
      txt(480, 300, "모든 node 의 LSDB, A 행: A 0 · B 2 · C ∞ · D 3 · E ∞ · F ∞ · G ∞", 13, C.ink, ' font-weight="700"') +
      txt(480, 316, "메시지 12 개 중 6 개는 버려졌다 → flooding 은 traffic 이 많다", 11, C.red));
    s += '</svg>';
    return s;
  }
};
