// ============================================================
// satellite_orbits — L11 p.11–14 (Three categories of satellites)
// 왼쪽: 슬라이드의 고도축 그림을 아래에서 위로 쌓는다 (LEO → Lower Van Allen → MEO → Upper Van Allen → GEO)
// 오른쪽(9s~): 위에서 본 세 궤도. 같은 5초 동안 LEO 여러 바퀴, MEO 1바퀴, GEO 는 지구 자전과 같은 1/4 바퀴 → 정지해 보임
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["satellite_orbits"] = {
  title: "위성 세 범주 — LEO · MEO · GEO 와 Van Allen belt, 14초",
  desc: "고도에 따라 [[LEO]](500–2000 km) · [[MEO]](두 [[Van Allen belt]] 사이) · [[GEO]](35,786 km) 로 나뉜다. 높을수록 주기가 길어서([[Kepler's law]]) GEO 는 지구 자전과 같은 24 h → 지상에서 보면 멈춰 있다",
  duration: 14,
  build: function () {
    var D = 14;
    var C = {
      a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", bL: "#dff3e4", c: "#e09a40", cL: "#fdeec2",
      dev: "#3b2f4a", red: "#d6465f", muted: "#777", ink: "#222", pink: "#c2185b", pinkL: "#f7c8e0",
      leo: "#16a3c9", meo: "#7cbf1e"
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
    // 위성 아이콘: 중심 (x,y), 크기 배율 k
    function sat(x, y, k) {
      k = k || 1;
      var w = 9 * k, pw = 11 * k, ph = 5 * k;
      return '<g>' +
        '<rect x="' + r2(x - w / 2 - pw) + '" y="' + r2(y - ph / 2) + '" width="' + r2(pw) + '" height="' + r2(ph) + '" fill="' + C.pinkL + '" stroke="' + C.pink + '" stroke-width="0.9"/>' +
        '<rect x="' + r2(x + w / 2) + '" y="' + r2(y - ph / 2) + '" width="' + r2(pw) + '" height="' + r2(ph) + '" fill="' + C.pinkL + '" stroke="' + C.pink + '" stroke-width="0.9"/>' +
        '<rect x="' + r2(x - w / 2) + '" y="' + r2(y - w / 2) + '" width="' + r2(w) + '" height="' + r2(w) + '" fill="#fff" stroke="' + C.pink + '" stroke-width="1.2"/></g>';
    }

    var s = '<svg viewBox="0 0 760 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="위성 세 범주 LEO MEO GEO 애니메이션">';
    s += '<defs><marker id="so_ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,10 L5,0 L10,10 z" fill="#333"/></marker></defs>';

    s += caps([
      [0, 1.5, "위성 궤도는 고도(altitude)에 따라 세 범주로 나뉜다"],
      [1.5, 3, "LEO (Low Earth Orbit): 고도 500–2000 km — 가장 낮은 궤도"],
      [3, 4.5, "Lower Van Allen belt: 방사선이 강한 띠 — 위성은 이 띠를 피한다"],
      [4.5, 6, "MEO (Medium Earth Orbit): 두 Van Allen belt 사이에 위치"],
      [6, 7.5, "Upper Van Allen belt: 두 번째 방사선 띠"],
      [7.5, 9, "GEO (Geostationary): 35,786 km, 적도면(equatorial plane) 위"],
      [9, D, "높을수록 느리다: LEO 90–120 min, GEO 24 h = 지구 자전과 같아 정지해 보임"]
    ]);

    // ---------- 왼쪽: 고도축 (축척 아님, 슬라이드 그림 비율) ----------
    var X0 = 120, X1 = 400;            // 띠 영역
    var Y = { 0: 300, 2000: 282, 5000: 250, 15000: 175, 35786: 85 };
    s += '<rect x="' + X0 + '" y="300" width="' + (X1 - X0) + '" height="26" fill="#cfcfcf" stroke="#999"/>';
    s += txt((X0 + X1) / 2, 318, "Earth surface", 13, "#333");
    s += '<line x1="' + X0 + '" y1="330" x2="' + X0 + '" y2="58" stroke="#333" stroke-width="1.6" marker-end="url(#so_ar)"/>';
    s += txt(X0 - 8, 56, "Altitude (km)", 12, "#333", ' text-anchor="end"');
    s += txt(X0 - 8, Y[0] + 4, "0", 12, "#333", ' text-anchor="end"');

    // LEO 띠
    s += vis(1.5, D,
      '<rect x="' + X0 + '" y="' + Y[2000] + '" width="' + (X1 - X0) + '" height="' + (Y[0] - Y[2000]) + '" fill="' + C.leo + '" fill-opacity="0.85"/>' +
      [150, 190, 230, 270, 310, 370].map(function (x) { return sat(x, 291, 0.8); }).join("") +
      txt(X1 + 10, 295, "LEO", 14, C.leo, ' font-weight="700" text-anchor="start"') +
      txt(X1 + 46, 295, "500–2000", 11, C.muted, ' text-anchor="start"'));
    // Lower Van Allen belt
    s += vis(3, D, txt((X0 + X1) / 2, 271, "Lower Van Allen belt", 13, C.red) +
      txt(X0 - 8, Y[5000] + 4, "5000", 12, "#333", ' text-anchor="end"'));
    // MEO 띠
    s += vis(4.5, D,
      '<rect x="' + X0 + '" y="' + Y[15000] + '" width="' + (X1 - X0) + '" height="' + (Y[5000] - Y[15000]) + '" fill="' + C.meo + '" fill-opacity="0.85"/>' +
      [150, 195, 240, 370].map(function (x) { return sat(x, 205, 1); }).join("") +
      txt(X1 + 10, 217, "MEO", 14, "#4f8a0c", ' font-weight="700" text-anchor="start"') +
      txt(X1 + 50, 217, "GPS", 11, C.muted, ' text-anchor="start"') +
      txt(X0 - 8, Y[15000] + 4, "15,000", 12, "#333", ' text-anchor="end"'));
    // Upper Van Allen belt
    s += vis(6, D, txt((X0 + X1) / 2, 140, "Upper Van Allen belt", 13, C.red));
    // GEO 점선
    s += vis(7.5, D,
      '<line x1="' + X0 + '" y1="' + Y[35786] + '" x2="' + X1 + '" y2="' + Y[35786] + '" stroke="' + C.pink + '" stroke-width="1.5" stroke-dasharray="14 8"/>' +
      [190, 265, 340].map(function (x) { return sat(x, Y[35786], 1.3); }).join("") +
      txt(X1 + 10, Y[35786] + 5, "GEO", 14, C.pink, ' font-weight="700" text-anchor="start"') +
      txt(X0 - 8, Y[35786] + 4, "35,786", 12, "#333", ' text-anchor="end"'));

    // ---------- 오른쪽: 위에서 본 궤도, 9s~ ----------
    var cx = 600, cy = 200, rE = 30, rL = 46, rM = 80, rG = 122;
    var R0 = 9.5, RD = 4;    // 회전 구간
    function spin(deg) {
      return '<animateTransform attributeName="transform" type="rotate" values="0 ' + cx + ' ' + cy + ';' + deg + ' ' + cx + ' ' + cy + '" begin="' + R0 + 's" dur="' + RD + 's" fill="freeze"/>';
    }
    var right = '';
    right += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rG + '" fill="none" stroke="' + C.pink + '" stroke-dasharray="6 5" stroke-width="1.3"/>';
    right += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rM + '" fill="none" stroke="' + C.meo + '" stroke-width="1.3"/>';
    right += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rL + '" fill="none" stroke="' + C.leo + '" stroke-width="1.3"/>';
    // 지구 + 지상의 한 점(검정) — GEO 위성과 함께 같은 각도로 회전
    right += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rE + '" fill="' + C.aL + '" stroke="' + C.a + '" stroke-width="1.8"/>';
    right += '<g>' +
      '<line x1="' + cx + '" y1="' + (cy - rE) + '" x2="' + cx + '" y2="' + (cy - rG + 8) + '" stroke="' + C.pink + '" stroke-width="1" stroke-dasharray="2 3"/>' +
      '<circle cx="' + cx + '" cy="' + (cy - rE + 5) + '" r="4" fill="' + C.ink + '"/>' +
      sat(cx, cy - rG, 1.1) + spin(90) + '</g>';
    // LEO: 4초에 3바퀴, MEO: 1바퀴
    right += '<g>' + sat(cx + rL, cy, 0.7) + spin(1080) + '</g>';
    right += '<g>' + sat(cx - rM, cy, 0.9) + spin(360) + '</g>';
    right += txt(cx, cy + 4, "Earth", 11, C.a);
    // 범례
    var ly = 340;
    right += txt(462, ly - 18, "같은 4초 동안:", 11, C.muted, ' text-anchor="start"');
    right += txt(462, ly, "LEO 3바퀴", 12, C.leo, ' font-weight="700" text-anchor="start"');
    right += txt(538, ly, "MEO 1바퀴", 12, "#4f8a0c", ' font-weight="700" text-anchor="start"');
    right += txt(616, ly, "GEO = 지구와 함께 1/4", 12, C.pink, ' font-weight="700" text-anchor="start"');
    right += txt(cx, 70, "위에서 본 궤도 (축척 아님)", 11, C.muted);
    s += vis(9, D, right);

    // ---------- 요점 ----------
    s += txt(380, 362, "LEO(낮고 빠름) · MEO(Van Allen belt 사이, GPS) · GEO(35,786 km, 24 h → 정지) — 높을수록 주기가 길다", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
