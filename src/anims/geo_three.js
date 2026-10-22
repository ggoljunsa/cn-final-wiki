// ============================================================
// geo_three — L11 p.16–17 (GEO: line-of-sight, 최소 3기 = full global transmission)
// 가운데: 북극 위에서 내려다본 적도면. GEO 위성 1기 → 닿는 호(파랑) / 곡률로 가려진 호(빨강)
//        → 120° 간격 3기로 빨간 호가 사라짐 → 세 위성이 지구와 같이 돈다(geostationary)
// 왼쪽: 슬라이드 p.17 a. Equatorial-orbit satellite (옆에서 본 모습)
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["geo_three"] = {
  title: "GEO — 위성 1기의 line-of-sight 와 최소 3기의 전 지구 커버, 12초",
  desc: "[[GEO]] 위성은 적도면 위 높은 궤도에서 넓은 지역과 [[line-of-sight]] 로 통신하지만, 지구 곡률 때문에 1기로는 반대편이 가려진다 → 서로 같은 간격(120°)의 '''최소 3기'''로 full global transmission",
  duration: 12,
  build: function () {
    var D = 12;
    var C = {
      a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", bL: "#dff3e4", c: "#e09a40",
      red: "#d6465f", muted: "#777", ink: "#222", pink: "#c2185b", pinkL: "#f7c8e0"
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
    function sat(x, y, k) {
      k = k || 1;
      var w = 9 * k, pw = 11 * k, ph = 5 * k;
      return '<g>' +
        '<rect x="' + r2(x - w / 2 - pw) + '" y="' + r2(y - ph / 2) + '" width="' + r2(pw) + '" height="' + r2(ph) + '" fill="' + C.pinkL + '" stroke="' + C.pink + '" stroke-width="0.9"/>' +
        '<rect x="' + r2(x + w / 2) + '" y="' + r2(y - ph / 2) + '" width="' + r2(pw) + '" height="' + r2(ph) + '" fill="' + C.pinkL + '" stroke="' + C.pink + '" stroke-width="0.9"/>' +
        '<rect x="' + r2(x - w / 2) + '" y="' + r2(y - w / 2) + '" width="' + r2(w) + '" height="' + r2(w) + '" fill="#fff" stroke="' + C.pink + '" stroke-width="1.2"/></g>';
    }

    var cx = 380, cy = 195, R = 56, G = 128;          // 지구 반지름, GEO 궤도 반지름 (개념도)
    var ALPHA = Math.acos(R / G);                      // 접선점까지의 중심각
    function pt(rad, ang) { return [cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)]; }
    function arc(rad, a0, a1, col, w, extra) {
      var p0 = pt(rad, a0), p1 = pt(rad, a1), large = (a1 - a0) > Math.PI ? 1 : 0;
      return '<path d="M' + r2(p0[0]) + ',' + r2(p0[1]) + ' A' + rad + ',' + rad + ' 0 ' + large + ' 1 ' + r2(p1[0]) + ',' + r2(p1[1]) + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="butt"' + (extra || "") + '/>';
    }
    // 위성 하나(각도 th): 빔(접선 삼각형) + 닿는 호 + 아이콘
    function geoSat(th) {
      var sp = pt(G, th), t1 = pt(R, th - ALPHA), t2 = pt(R, th + ALPHA);
      return '<polygon points="' + r2(sp[0]) + ',' + r2(sp[1]) + ' ' + r2(t1[0]) + ',' + r2(t1[1]) + ' ' + r2(t2[0]) + ',' + r2(t2[1]) + '" fill="' + C.pink + '" fill-opacity="0.16" stroke="' + C.pink + '" stroke-opacity="0.5" stroke-width="1"/>' +
        arc(R + 5, th - ALPHA, th + ALPHA, C.a, 6) +
        sat(sp[0], sp[1], 1.3);
    }

    var s = '<svg viewBox="0 0 760 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GEO 위성 3기로 전 지구 커버 애니메이션">';

    s += caps([
      [0, 1.5, "GEO 궤도는 적도면(equatorial plane) 위, 지표에서 약 35,786 km"],
      [1.5, 3.8, "위성 1기: line-of-sight 로 보이는 넓은 지역(파랑)에 직접 닿는다"],
      [3.8, 6, "그러나 지구 곡률(curvature)이 반대편(빨강)을 가린다 — 1기로는 부족"],
      [6, 8.6, "서로 같은 간격(equidistant, 120°)으로 위성 3기를 두면 가려진 곳이 사라진다"],
      [8.6, D, "세 위성은 지구 자전과 함께 돈다 → 지상에서는 늘 같은 자리 (geostationary)"]
    ]);

    // ---------- 왼쪽: 옆에서 본 적도 궤도 (p.17 a) ----------
    var ex = 112, ey = 200;
    var side = '';
    side += '<ellipse cx="' + ex + '" cy="' + ey + '" rx="88" ry="17" fill="none" stroke="#333" stroke-width="1.4"/>';
    side += '<circle cx="' + ex + '" cy="' + ey + '" r="48" fill="#d6d6d6" stroke="' + C.pink + '" stroke-width="1.6"/>';
    // 궤도 앞쪽 반은 지구 위로 다시 그림
    side += '<path d="M' + (ex - 88) + ',' + ey + ' A88,17 0 0 0 ' + (ex + 88) + ',' + ey + '" fill="none" stroke="#333" stroke-width="1.4"/>';
    side += txt(ex, ey - 6, "Earth", 12, "#333");
    side += txt(ex - 70, ey - 26, "Orbit", 11, "#333");
    side += '<circle r="6" fill="' + C.pinkL + '" stroke="' + C.pink + '" stroke-width="1.6">' +
      '<animateMotion path="M' + (ex + 88) + ',' + ey + ' A88,17 0 1 1 ' + (ex - 88) + ',' + ey + ' A88,17 0 1 1 ' + (ex + 88) + ',' + ey + '" begin="0s" dur="' + D + 's" fill="freeze"/></circle>';
    side += txt(ex, ey + 70, "옆에서 본 모습:", 11, C.muted);
    side += txt(ex, ey + 85, "Equatorial-orbit satellite", 11, C.muted);
    s += side;

    // ---------- 가운데: 위에서 본 적도면 ----------
    var mid = '';
    mid += '<circle cx="' + cx + '" cy="' + cy + '" r="' + G + '" fill="none" stroke="' + C.pink + '" stroke-dasharray="6 5" stroke-width="1.2"/>';
    mid += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="#d6d6d6" stroke="#888" stroke-width="1.5"/>';
    mid += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="' + C.ink + '"/>';
    mid += txt(cx, cy + 20, "North pole", 10, "#444");
    mid += txt(cx + G - 6, cy + G - 18, "GEO orbit", 11, C.pink, ' text-anchor="start"');
    s += mid;

    var TH1 = -Math.PI / 2;                       // 위쪽
    var TH2 = TH1 + 2 * Math.PI / 3, TH3 = TH1 + 4 * Math.PI / 3;
    var rot = '';
    // 1기 + 가려진 호
    rot += vis(1.5, D, geoSat(TH1));
    rot += vis(3.8, 7.4, arc(R + 5, TH1 + ALPHA, TH1 + 2 * Math.PI - ALPHA, C.red, 6) +
      txt(cx, cy + R + 32, "out of sight", 12, C.red, ' font-weight="700"'));
    // 2·3기
    rot += vis(6, D, geoSat(TH2));
    rot += vis(6.8, D, geoSat(TH3));
    // 지상의 한 점(서울 같은) — 회전해도 위쪽 위성 아래에 머문다
    var gp = pt(R - 9, TH1);
    rot += '<circle cx="' + r2(gp[0]) + '" cy="' + r2(gp[1]) + '" r="3.5" fill="' + C.b + '"/>';
    s += '<g>' + rot + '<animateTransform attributeName="transform" type="rotate" values="0 ' + cx + ' ' + cy + ';80 ' + cx + ' ' + cy + '" begin="8.8s" dur="3s" fill="freeze"/></g>';

    // ---------- 오른쪽: 범례 / 결과 ----------
    var lx = 572;
    s += '<line x1="' + lx + '" y1="98" x2="' + (lx + 26) + '" y2="98" stroke="' + C.a + '" stroke-width="6"/>' + txt(lx + 34, 102, "line-of-sight 로 닿음", 12, C.ink, ' text-anchor="start"');
    s += vis(3.8, D, '<line x1="' + lx + '" y1="122" x2="' + (lx + 26) + '" y2="122" stroke="' + C.red + '" stroke-width="6"/>' + txt(lx + 34, 126, "곡률로 가려짐", 12, C.ink, ' text-anchor="start"'));
    s += '<circle cx="' + (lx + 13) + '" cy="146" r="3.5" fill="' + C.b + '"/>' + txt(lx + 34, 150, "지상의 한 지점", 12, C.ink, ' text-anchor="start"');
    s += vis(1.5, 6, txt(lx, 196, "1기 → 지구의 일부만", 14, C.red, ' font-weight="700" text-anchor="start"'));
    s += vis(6, D,
      '<rect x="' + (lx - 6) + '" y="176" width="180" height="58" rx="6" fill="' + C.bL + '" stroke="' + C.b + '" stroke-width="1.6"/>' +
      txt(lx + 84, 199, "최소 3기 (120° 간격)", 14, "#1d6b2a", ' font-weight="700"') +
      txt(lx + 84, 220, "= full global transmission", 12, "#1d6b2a", ' font-weight="700"'));
    s += vis(8.6, D, txt(lx + 84, 262, "지구와 같이 돌아서", 12, C.muted) + txt(lx + 84, 278, "초록 점 위의 위성은 그대로", 12, C.muted));
    s += txt(lx + 84, 318, "(축척 아님 — 실제 GEO 궤도는", 10, C.muted) + txt(lx + 84, 332, "지구 반지름의 약 6.6배)", 10, C.muted);

    // ---------- 요점 ----------
    s += txt(380, 362, "GEO: 적도면 위 · 24 h 주기로 정지해 보임 · 최소 3기 = full global transmission", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
