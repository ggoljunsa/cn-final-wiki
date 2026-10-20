// ============================================================
// access_methods — FDMA / TDMA / CDMA: 시간–주파수–power(code) 공간을 어떻게 나누나
// CONTRACT §7. 슬라이드 L10 IS-95 장 오른쪽 3D 그림 (FDMA · TDMA · CDMA).
// 시간축(초): 0 빈 축 3개 → 1.5 FDMA: 주파수 띠 3개 → 4.5 TDMA: 시간 슬롯 3개
//   → 7.5 CDMA: 같은 시간·같은 주파수에 code 1·2·3 층이 쌓임 → 10.5 세대 태그 → 12 끝
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["access_methods"] = {
  title: "FDMA · TDMA · CDMA — 무엇으로 사용자를 나누나",
  desc: "[[FDMA]]는 주파수 띠로, [[TDMA]]는 시간 슬롯으로, [[CDMA]]는 같은 시간·같은 주파수에서 code 로 사용자를 나눈다 — 1G 는 FDMA, 2G 는 TDMA([[D-AMPS]]·[[GSM]]) 또는 CDMA([[IS-95]])",
  duration: 12,
  build: function () {
    var D = 12;
    var C = { a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", bL: "#dff3e4", c: "#e09a40", cL: "#fdeec2", dev: "#3b2f4a", devL: "#efe9f6", muted: "#777" };
    var COL = [[C.a, C.aL, "#174f8c"], [C.b, C.bL, "#237a3d"], [C.c, C.cL, "#b97a2c"]];
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

    // 사각 투영: P(f, t, p) — f 가로, t 오른쪽 위로 깊이, p 세로
    var FW = 150, KX = 40, KY = 40, PH = 108;
    function P(ox, oy, f, t, p) { return [+(ox + f * FW + t * KX).toFixed(1), +(oy - p * PH - t * KY).toFixed(1)]; }
    function poly(pts, fill, stroke, op) {
      return '<polygon points="' + pts.map(function (q) { return q.join(","); }).join(" ") + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.2"' + (op ? ' fill-opacity="' + op + '"' : "") + '/>';
    }
    // 직육면체: 뒤쪽 면부터 (side → top → front)
    function cuboid(ox, oy, f0, f1, t0, t1, p0, p1, col) {
      var s = "";
      s += poly([P(ox, oy, f1, t0, p0), P(ox, oy, f1, t1, p0), P(ox, oy, f1, t1, p1), P(ox, oy, f1, t0, p1)], col[2], col[2]);
      s += poly([P(ox, oy, f0, t0, p1), P(ox, oy, f1, t0, p1), P(ox, oy, f1, t1, p1), P(ox, oy, f0, t1, p1)], col[1], col[2]);
      s += poly([P(ox, oy, f0, t0, p0), P(ox, oy, f1, t0, p0), P(ox, oy, f1, t0, p1), P(ox, oy, f0, t0, p1)], col[0], col[2]);
      return s;
    }
    function axes(ox, oy, pLabel) {
      var s = "";
      var o = P(ox, oy, 0, 0, 0), fe = P(ox, oy, 1.12, 0, 0), te = P(ox, oy, 0, 1.15, 0), pe = P(ox, oy, 0, 0, 1.05);
      s += '<line x1="' + o[0] + '" y1="' + o[1] + '" x2="' + fe[0] + '" y2="' + fe[1] + '" stroke="#555" stroke-width="1.4" marker-end="url(#am_arr)"/>';
      s += '<line x1="' + o[0] + '" y1="' + o[1] + '" x2="' + te[0] + '" y2="' + te[1] + '" stroke="#555" stroke-width="1.4" marker-end="url(#am_arr)"/>';
      s += '<line x1="' + o[0] + '" y1="' + o[1] + '" x2="' + pe[0] + '" y2="' + pe[1] + '" stroke="#555" stroke-width="1.4" marker-end="url(#am_arr)"/>';
      s += txt(fe[0] - 4, fe[1] + 15, "frequency", 11, C.muted, ' text-anchor="end"');
      s += txt(te[0] + 4, te[1] + 2, "time", 11, C.muted, ' text-anchor="start"');
      s += txt(pe[0] - 4, pe[1] - 6, pLabel, 11, C.muted, ' text-anchor="start"');
      return s;
    }

    var s = '<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="FDMA TDMA CDMA 비교 애니메이션">';
    s += '<defs><marker id="am_arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#555"/></marker></defs>';

    // ---- 단계 자막 ----
    var caps = [
      [0, 1.5, "무선 채널이라는 자원 = 시간 × 주파수 (× code) — 여러 사용자가 어떻게 나눠 쓸까?"],
      [1.5, 4.5, "FDMA: 대역을 주파수 띠로 나눠 user 마다 하나씩 — 시간은 계속 쓴다"],
      [4.5, 7.5, "TDMA: 같은 주파수를 시간 슬롯으로 나눠 user 1 · 2 · 3 이 돌아가며 쓴다"],
      [7.5, 10.5, "CDMA: 같은 시간 · 같은 주파수 전체를 함께 쓰고, code 1 · 2 · 3 으로 구분한다"],
      [10.5, D, "1G = FDMA (AMPS) · 2G = TDMA (D-AMPS · GSM) / CDMA (IS-95)"]
    ];
    caps.forEach(function (c) { s += during(c[0], c[1], txt(380, 26, c[2], 14, "#222", ' font-weight="700"')); });

    // ---- 패널 3개 ----
    var PX = [14, 262, 510], PW = 236;
    var names = ["FDMA", "TDMA", "CDMA"];
    var sub = ["주파수 띠로 나눔", "시간 슬롯으로 나눔", "code 로 나눔 (겹쳐 쌓임)"];
    var hl = [[1.5, 4.5], [4.5, 7.5], [7.5, 10.5]];
    PX.forEach(function (px, i) {
      s += '<rect x="' + px + '" y="44" width="' + PW + '" height="262" rx="10" fill="#fafbfd" stroke="#dfe3ea"/>';
      s += during(hl[i][0], hl[i][1], '<rect x="' + px + '" y="44" width="' + PW + '" height="262" rx="10" fill="' + C.devL + '" stroke="' + C.dev + '" stroke-width="2"/>');
      s += txt(px + PW / 2, 66, names[i], 15, C.dev, ' font-weight="700"');
      s += axes(px + 30, 248, i === 2 ? "power / code" : "power");
      s += during(hl[i][0], D, txt(px + PW / 2, 276, sub[i], 12, C.dev, ' font-weight="700"'));
    });

    // FDMA: f 방향으로 띠 3개 (각각 시간 전체), 왼쪽부터
    var fb = [[0.04, 0.30], [0.37, 0.63], [0.70, 0.96]];
    fb.forEach(function (b, i) {
      var ox = PX[0] + 30, oy = 248;
      var g = cuboid(ox, oy, b[0], b[1], 0, 0.9, 0, 0.62, COL[i]);
      var lp = P(ox, oy, (b[0] + b[1]) / 2, 0, 0.31);
      g += txt(lp[0], lp[1] + 4, "u" + (i + 1), 12, "#fff", ' font-weight="700"');
      s += during(1.8 + i * 0.7, D, g);
    });
    // TDMA: t 방향 슬롯 3개 (각각 주파수 대부분), 뒤(user 3)부터 그리고 라벨은 맨 나중에
    var tb = [[0.04, 0.30], [0.37, 0.63], [0.70, 0.96]], tl = "";
    [2, 1, 0].forEach(function (i) {
      var ox = PX[1] + 30, oy = 248, b = tb[i];
      s += during(4.8 + i * 0.7, D, cuboid(ox, oy, 0, 0.72, b[0], b[1], 0, 0.62, COL[i]));
      var lp = P(ox, oy, 0.72, (b[0] + b[1]) / 2, 0.31), lx = P(ox, oy, 0.72, 0.96, 0)[0];
      tl += during(4.8 + i * 0.7, D, txt(lx + 6, lp[1] + 4, "user " + (i + 1), 11, COL[i][2], ' font-weight="700" text-anchor="start"'));
    });
    s += tl;
    // CDMA: 같은 f·t 전체에 층 3개, 아래(code 1)부터
    var pb = [[0, 0.2], [0.25, 0.45], [0.5, 0.7]];
    pb.forEach(function (b, i) {
      var ox = PX[2] + 30, oy = 248;
      var g = cuboid(ox, oy, 0, 0.8, 0, 0.75, b[0], b[1], COL[i]);
      var lp = P(ox, oy, 0.8, 0.75, (b[0] + b[1]) / 2);
      g += txt(lp[0] + 5, lp[1] + 4, "code " + (i + 1), 11, COL[i][2], ' font-weight="700" text-anchor="start"');
      s += during(7.8 + i * 0.7, D, g);
    });

    // ---- 세대 태그 ----
    var tags = ["1G · AMPS", "2G · D-AMPS · GSM", "2G · IS-95"];
    PX.forEach(function (px, i) {
      s += during(10.5, D, '<rect x="' + (px + 38) + '" y="284" width="' + (PW - 76) + '" height="18" rx="9" fill="' + C.dev + '"/>' + txt(px + PW / 2, 297, tags[i], 11, "#fff", ' font-weight="700"'));
    });

    // ---- 요점 ----
    s += txt(380, 328, "FDMA 는 주파수를, TDMA 는 시간을 쪼개 갖고, CDMA 는 둘 다 함께 쓰며 code 로 구분한다", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
