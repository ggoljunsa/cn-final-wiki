// ============================================================
// trilateration_anim — L11 p.19 (MEO / GPS: Trilateration 삼변측량)
// 왼쪽 a. 2D: A·B·C 에서 거리 원이 하나씩 커진다 → (A) 원 위 어딘가 → (A,B) 교점 2개 → (A,B,C) 한 점
// 오른쪽 b. 3D: 위성 3기의 구(sphere)가 커져 겹침 → 공통점 2개 → 우주 쪽은 버리고 지구 표면 쪽 = 내 위치
// 모든 원은 교점이 정확히 원 위에 오도록 build() 안에서 반지름을 계산한다.
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["trilateration_anim"] = {
  title: "Trilateration(삼변측량) — 거리 3개로 위치 1개 찾기, 14초",
  desc: "[[trilateration]] 은 위치를 아는 기준점들까지의 '''거리'''만으로 내 위치를 정한다. 2D 는 원 3개의 교점, 3D 는 위성 3기의 구가 겹치는 두 점 중 지구 표면 쪽 — [[GPS]]([[MEO]] 위성)가 쓰는 원리",
  duration: 14,
  build: function () {
    var D = 14;
    var C = {
      a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", bL: "#dff3e4", c: "#e09a40", cL: "#fdeec2",
      red: "#d6465f", muted: "#777", ink: "#222", pink: "#c2185b", pinkL: "#f7c8e0", mag: "#e8358f"
    };
    function r2(v) { return Math.round(v * 100) / 100; }
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + r2(x) + '" y="' + r2(y) + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var f = 0.15 / D, a = r4(from / D), b = r4(Math.min(from / D + f, (from + to) / 2 / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, to / D - f)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }
    function caps(list) {
      return list.map(function (c) { return vis(c[0], c[1], txt(380, 26, c[2], 14, C.ink, ' font-weight="700"')); }).join("");
    }
    function dist(p, q) { return Math.sqrt((p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1])); }
    // 반지름 0 → r 로 커지는 원
    function grow(cx, cy, r, b, d, style) {
      return '<circle cx="' + r2(cx) + '" cy="' + r2(cy) + '" r="0" ' + style + '>' +
        '<animate attributeName="r" values="0;' + r2(r) + '" begin="' + b + 's" dur="' + d + 's" fill="freeze"/></circle>';
    }
    // 두 원의 교점 (둘 다 반환)
    function inter(p, r0, q, r1) {
      var d = dist(p, q), a = (r0 * r0 - r1 * r1 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r0 * r0 - a * a));
      var mx = p[0] + a * (q[0] - p[0]) / d, my = p[1] + a * (q[1] - p[1]) / d;
      return [[mx + h * (q[1] - p[1]) / d, my - h * (q[0] - p[0]) / d], [mx - h * (q[1] - p[1]) / d, my + h * (q[0] - p[0]) / d]];
    }
    function satIcon(x, y) {
      return '<rect x="' + r2(x - 22) + '" y="' + r2(y - 3.5) + '" width="15" height="7" fill="' + C.pinkL + '" stroke="#333" stroke-width="0.9"/>' +
        '<rect x="' + r2(x + 7) + '" y="' + r2(y - 3.5) + '" width="15" height="7" fill="' + C.pinkL + '" stroke="#333" stroke-width="0.9"/>' +
        '<line x1="' + r2(x - 7) + '" y1="' + r2(y) + '" x2="' + r2(x + 7) + '" y2="' + r2(y) + '" stroke="#333" stroke-width="1"/>' +
        '<rect x="' + r2(x - 5) + '" y="' + r2(y - 5) + '" width="10" height="10" fill="#111"/>';
    }

    var s = '<svg viewBox="0 0 760 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="2D와 3D trilateration 애니메이션">';
    s += '<defs>' +
      '<clipPath id="tl_clip3"><rect x="396" y="48" width="350" height="272"/></clipPath>' +
      '<radialGradient id="tl_sph" cx="0.38" cy="0.35" r="0.7"><stop offset="0" stop-color="#ffffff" stop-opacity="0.75"/><stop offset="1" stop-color="#8a8a8a" stop-opacity="0.55"/></radialGradient>' +
      '</defs>';

    s += caps([
      [0, 1.5, "Trilateration(삼변측량): 기준점까지의 거리만으로 내 위치를 찾는다"],
      [1.5, 3.4, "A 까지의 거리만 알면 → 나는 A 를 중심으로 한 원 위 어딘가"],
      [3.4, 5.4, "B 까지의 거리를 더하면 → 두 원의 교점 2개로 좁혀진다"],
      [5.4, 7.6, "C 까지의 거리를 더하면 → 세 원이 한 점에서 만난다 = 내 위치"],
      [7.6, 9.8, "3D (GPS): 위성까지의 거리 → 위성을 중심으로 한 구(sphere)"],
      [9.8, 11.6, "위성 3기의 구가 모두 겹치는 점은 2개"],
      [11.6, D, "우주 쪽 점은 버리고, 지구 표면 쪽 하나 = 내 위치 (GPS, 보충)"]
    ]);

    // ---------- a. 2D ----------
    s += '<rect x="14" y="48" width="362" height="272" fill="#fff" stroke="#333" stroke-width="1.4"/>';
    var P = [190, 182];                          // 내 위치
    var A = [160, 244], B = [128, 132], Cc = [268, 212];
    var rA = dist(A, P), rB = dist(B, P), rC = dist(Cc, P);
    var dash = 'fill="none" stroke="#333" stroke-width="1.5" stroke-dasharray="6 4"';
    s += grow(A[0], A[1], rA, 1.6, 1.2, dash) + grow(B[0], B[1], rB, 3.5, 1.2, dash) + grow(Cc[0], Cc[1], rC, 5.5, 1.2, dash);
    // 반지름 선 (거리) — 원이 커지는 동안만
    function radius(p, col, b, e, label, lx, ly) {
      return vis(b, e, '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + P[0] + '" y2="' + P[1] + '" stroke="' + col + '" stroke-width="2"/>' + txt(lx, ly, label, 12, col, ' font-weight="700"'));
    }
    s += radius(A, C.a, 2.2, 3.4, "거리 r_A", A[0] - 40, A[1] - 30);
    s += radius(B, C.b, 4.1, 5.4, "거리 r_B", B[0] - 42, B[1] + 34);
    s += radius(Cc, C.c, 6.1, 7.6, "거리 r_C", Cc[0] + 36, Cc[1] + 34);
    // 기준점
    [[A, "A"], [B, "B"], [Cc, "C"]].forEach(function (q) {
      s += '<circle cx="' + q[0][0] + '" cy="' + q[0][1] + '" r="3.5" fill="#111"/>' + txt(q[0][0] + (q[1] === "C" ? 13 : -13), q[0][1] + 5, q[1], 14, "#111");
    });
    // A,B 교점 2개 (후보)
    var ab = inter(A, rA, B, rB);
    var other = dist(ab[0], P) > 1 ? ab[0] : ab[1];
    s += vis(4.8, 6.8,
      '<circle cx="' + r2(other[0]) + '" cy="' + r2(other[1]) + '" r="7" fill="none" stroke="' + C.mag + '" stroke-width="2.5"/>' +
      '<circle cx="' + P[0] + '" cy="' + P[1] + '" r="7" fill="none" stroke="' + C.mag + '" stroke-width="2.5"/>' +
      txt(other[0] + (other[0] < P[0] ? -12 : 12), other[1] - 12, "후보?", 12, C.mag, ' font-weight="700"'));
    s += vis(6.8, D, '<line x1="' + r2(other[0] - 6) + '" y1="' + r2(other[1] - 6) + '" x2="' + r2(other[0] + 6) + '" y2="' + r2(other[1] + 6) + '" stroke="' + C.red + '" stroke-width="2.5"/>' +
      '<line x1="' + r2(other[0] - 6) + '" y1="' + r2(other[1] + 6) + '" x2="' + r2(other[0] + 6) + '" y2="' + r2(other[1] - 6) + '" stroke="' + C.red + '" stroke-width="2.5"/>');
    s += vis(6.8, D, '<circle cx="' + P[0] + '" cy="' + P[1] + '" r="10" fill="' + C.mag + '"/>' +
      txt(306, 92, "세 원의 교점", 13, C.mag, ' font-weight="700"') + txt(306, 109, "= 내 위치", 13, C.mag, ' font-weight="700"'));
    s += txt(195, 338, "a. Two-dimensional trilateration", 13, "#333");

    // ---------- b. 3D ----------
    s += '<rect x="396" y="48" width="350" height="272" fill="#fff" stroke="#333" stroke-width="1.4"/>';
    // 세 위성은 한 평면(y=150) 위 → 공통점 2개는 그 평면에 대해 대칭: (571, 150∓60)
    var Q1 = [571, 90], Q2 = [571, 210];
    var S1 = [511, 150], S2 = [571, 150], S3 = [631, 150];
    var three = '';
    // 지구 (표면이 Q2 를 지남)
    var ER = 300, EC = [571, Q2[1] + ER];
    three += vis(7.6, D, '<circle cx="' + EC[0] + '" cy="' + EC[1] + '" r="' + ER + '" fill="' + C.aL + '" stroke="' + C.a + '" stroke-width="2"/>' +
      txt(700, 306, "Earth", 13, C.a, ' font-weight="700"'));
    three += grow(S1[0], S1[1], dist(S1, Q2), 8.0, 1.4, 'fill="url(#tl_sph)" stroke="#777" stroke-width="1"');
    three += grow(S3[0], S3[1], dist(S3, Q2), 8.4, 1.4, 'fill="url(#tl_sph)" stroke="#777" stroke-width="1"');
    three += grow(S2[0], S2[1], dist(S2, Q2), 8.8, 1.4, 'fill="url(#tl_sph)" stroke="#777" stroke-width="1"');
    three += vis(7.6, D, satIcon(S1[0], S1[1]) + satIcon(S2[0], S2[1]) + satIcon(S3[0], S3[1]));
    s += '<g clip-path="url(#tl_clip3)">' + three + '</g>';
    // 후보 2개
    s += vis(9.8, D, '<circle cx="' + Q1[0] + '" cy="' + Q1[1] + '" r="7" fill="none" stroke="' + C.mag + '" stroke-width="2.5"/>' +
      '<circle cx="' + Q2[0] + '" cy="' + Q2[1] + '" r="7" fill="none" stroke="' + C.mag + '" stroke-width="2.5"/>');
    s += vis(9.8, 11.6, txt(Q1[0] + 14, Q1[1] - 6, "점 1", 12, C.mag, ' font-weight="700" text-anchor="start" stroke="#fff" stroke-width="3" paint-order="stroke"') +
      txt(Q2[0] + 14, Q2[1] + 18, "점 2", 12, C.mag, ' font-weight="700" text-anchor="start" stroke="#fff" stroke-width="3" paint-order="stroke"'));
    s += vis(11.6, D,
      '<line x1="' + (Q1[0] - 7) + '" y1="' + (Q1[1] - 7) + '" x2="' + (Q1[0] + 7) + '" y2="' + (Q1[1] + 7) + '" stroke="' + C.red + '" stroke-width="2.5"/>' +
      '<line x1="' + (Q1[0] - 7) + '" y1="' + (Q1[1] + 7) + '" x2="' + (Q1[0] + 7) + '" y2="' + (Q1[1] - 7) + '" stroke="' + C.red + '" stroke-width="2.5"/>' +
      txt(Q1[0] + 14, Q1[1] - 4, "우주 쪽 ✗", 12, C.red, ' font-weight="700" text-anchor="start" stroke="#fff" stroke-width="3" paint-order="stroke"') +
      '<circle cx="' + Q2[0] + '" cy="' + Q2[1] + '" r="10" fill="' + C.mag + '"/>' +
      txt(Q2[0] + 16, Q2[1] + 22, "지구 표면 = 내 위치", 12, C.mag, ' font-weight="700" text-anchor="start" stroke="#fff" stroke-width="3" paint-order="stroke"'));
    s += txt(571, 338, "b. Three-dimensional trilateration", 13, "#333");

    // ---------- 요점 ----------
    s += txt(380, 362, "거리 3개 → 위치 1개 — GPS 는 MEO 위성들까지의 거리로 trilateration 한다", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
