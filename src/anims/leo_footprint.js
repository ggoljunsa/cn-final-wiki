// ============================================================
// leo_footprint — L11 p.20–21 (LEO: footprint, UML/GWL, ISL, "Similar to the cellular telephone system")
// 위성 A·B 가 왼쪽→오른쪽으로 지나가고(1.5s→12.5s, 280px), 각 위성 아래 footprint 타원이 따라 움직인다.
// 폰(UML)은 x=380 고정: 처음엔 A 의 footprint 안 → t≈7s 에 A 를 벗어나 B 로 넘겨짐.
// gateway(GWL)는 x=520 고정, 계속 A 의 footprint 안 → B 의 트래픽은 ISL 로 A 를 거쳐 gateway 로.
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["leo_footprint"] = {
  title: "LEO — footprint 가 움직이는 셀룰러 (UML · GWL · ISL), 14초",
  desc: "[[LEO]] 위성은 낮게 빠르게 지나가므로 지상의 [[footprint]] 도 위성을 따라 움직인다. 폰은 [[UML과 GWL|UML]] 로, gateway 는 GWL 로 위성과 통신하고, 위성끼리는 [[ISL]] 로 중계한다 — footprint 가 지나가면 다음 위성으로 넘겨지는 '''Similar to the cellular telephone system'''",
  duration: 14,
  build: function () {
    var D = 14;
    var C = {
      a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", bL: "#dff3e4", c: "#e09a40", cL: "#fdeec2",
      dev: "#3b2f4a", devL: "#efe9f6", red: "#d6465f", muted: "#777", ink: "#222", pink: "#c2185b", pinkL: "#f7c8e0"
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
      var w = 12 * k, pw = 22 * k, ph = 8 * k;
      return '<g>' +
        '<rect x="' + r2(x - w / 2 - pw) + '" y="' + r2(y - ph / 2) + '" width="' + r2(pw) + '" height="' + r2(ph) + '" fill="' + C.pinkL + '" stroke="' + C.pink + '" stroke-width="1"/>' +
        '<rect x="' + r2(x + w / 2) + '" y="' + r2(y - ph / 2) + '" width="' + r2(pw) + '" height="' + r2(ph) + '" fill="' + C.pinkL + '" stroke="' + C.pink + '" stroke-width="1"/>' +
        '<rect x="' + r2(x - w / 2) + '" y="' + r2(y - w / 2) + '" width="' + r2(w) + '" height="' + r2(w) + '" fill="#fff" stroke="' + C.pink + '" stroke-width="1.4"/></g>';
    }
    function phone(x, y) {
      return '<rect x="' + (x - 7) + '" y="' + (y - 13) + '" width="14" height="26" rx="3" fill="' + C.aL + '" stroke="' + C.a + '" stroke-width="1.7"/>' +
        '<line x1="' + (x - 3) + '" y1="' + (y - 8) + '" x2="' + (x + 3) + '" y2="' + (y - 8) + '" stroke="' + C.a + '" stroke-width="1.4"/>';
    }
    function dish(x, y) {   // 접시 안테나: 밑변 가운데 (x,y)
      return '<path d="M' + (x - 14) + ',' + (y - 22) + ' Q' + x + ',' + (y - 2) + ' ' + (x + 14) + ',' + (y - 22) + ' Z" fill="' + C.pinkL + '" stroke="' + C.pink + '" stroke-width="1.5"/>' +
        '<line x1="' + x + '" y1="' + (y - 12) + '" x2="' + x + '" y2="' + y + '" stroke="' + C.dev + '" stroke-width="2"/>' +
        '<line x1="' + (x - 8) + '" y1="' + y + '" x2="' + (x + 8) + '" y2="' + y + '" stroke="' + C.dev + '" stroke-width="2"/>';
    }

    var T0 = 1.5, T1 = 12.5, SH = 280;        // 이동 시간·거리
    var SY = 92, GY = 272;                    // 위성 높이, 지면 높이
    var AX = 380, BX = 100, PX = 380, GX = 540, RX = 160;
    var HO = 7.0;                             // 폰이 A → B 로 넘겨지는 시각 (footprint 겹침 6.2~7.8s 사이)
    function xAt(x0, t) { return x0 + SH * Math.max(0, Math.min(1, (t - T0) / (T1 - T0))); }
    function move(extra) {
      return '<animateTransform attributeName="transform" type="translate" values="0,0;' + SH + ',0" begin="' + T0 + 's" dur="' + (T1 - T0) + 's" fill="freeze"' + (extra || "") + '/>';
    }
    // 위성(이동) ↔ 지상 고정점 링크: x1 이 위성을 따라간다
    function link(x0, gx, gy, col, from, to, label) {
      var l = '<line x1="' + x0 + '" y1="' + (SY + 10) + '" x2="' + gx + '" y2="' + gy + '" stroke="' + col + '" stroke-width="2.4">' +
        '<animate attributeName="x1" values="' + x0 + ';' + (x0 + SH) + '" begin="' + T0 + 's" dur="' + (T1 - T0) + 's" fill="freeze"/></line>';
      return vis(from, to, l);
    }

    var s = '<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LEO 위성 footprint 이동 애니메이션">';
    s += '<defs><clipPath id="lf_clip"><rect x="0" y="40" width="760" height="282"/></clipPath></defs>';

    s += caps([
      [0, 1.5, "LEO 위성(500–2000 km)은 낮게, 빠르게 지나간다 — 90 to 120 min 에 한 바퀴"],
      [1.5, 4.2, "위성이 닿는 지상 영역 = footprint. 위성을 따라 footprint 도 움직인다"],
      [4.2, 6.2, "UML: 폰 ↔ 위성 · GWL: 위성 ↔ gateway(지상국)"],
      [6.2, 8.2, "footprint 가 지나가면 폰은 다음 위성(B)으로 넘겨진다 — handoff 처럼"],
      [8.2, 11.2, "ISL(inter-satellite link): B 가 받은 신호를 A 로 중계해 gateway 까지"],
      [11.2, D, "Similar to the cellular telephone system — cell(footprint)이 움직이는 셀룰러"]
    ]);

    var body = '';
    // 지면
    body += '<line x1="0" y1="' + GY + '" x2="760" y2="' + GY + '" stroke="#bbb" stroke-width="1.2"/>';
    // footprint (이동)
    function fp(x0, col, name) {
      return '<g><ellipse cx="' + x0 + '" cy="' + GY + '" rx="' + RX + '" ry="24" fill="' + col + '" fill-opacity="0.12" stroke="#555" stroke-width="1.4" stroke-dasharray="7 5"/>' +
        txt(x0, GY + 40, "Footprint " + name, 12, "#444") + move() + '</g>';
    }
    body += fp(AX, C.c, "A") + fp(BX, C.b, "B");
    // ISL (두 위성 사이, 함께 이동)
    body += '<g><path d="M' + (BX + 40) + ',' + SY + ' L' + (BX + 128) + ',' + SY + ' L' + (BX + 136) + ',' + (SY - 8) + ' L' + (BX + 144) + ',' + (SY + 8) + ' L' + (BX + 152) + ',' + SY + ' L' + (AX - 40) + ',' + SY + '" fill="none" stroke="' + C.dev + '" stroke-width="2"/>' +
      txt((AX + BX) / 2, SY - 14, "ISL", 13, C.dev, ' font-weight="700"') + move() + '</g>';
    // 링크
    body += link(AX, PX, GY - 16, C.ink, 4.2, HO);              // UML: 폰 ↔ A
    body += link(BX, PX, GY - 16, C.ink, HO, D);                // UML: 폰 ↔ B
    body += link(AX, GX, GY - 22, C.pink, 4.2, D);              // GWL: A ↔ gateway
    // 링크 이름 (고정 위치 근처)
    body += vis(4.2, HO, txt(PX - 26, 195, "UML", 12, C.ink, ' font-weight="700"'));
    body += vis(HO, D, txt(PX - 52, 195, "UML", 12, C.ink, ' font-weight="700"'));
    body += vis(4.2, D, txt(GX + 34, 195, "GWL", 12, C.pink, ' font-weight="700"'));
    // 넘겨짐 표시
    body += vis(6.3, 8.2, '<circle cx="' + PX + '" cy="' + (GY - 14) + '" r="20" fill="none" stroke="' + C.b + '" stroke-width="2.5"/>' +
      txt(PX, GY - 42, "A → B", 12, C.b, ' font-weight="700"'));
    // 데이터 흐름: 폰 → B → (ISL) → A → gateway
    function hop(x1, y1, x2, y2, b, d, col) {
      return '<circle r="5" fill="' + col + '" opacity="0"><animateMotion begin="' + b + 's" dur="' + d + 's" fill="freeze" path="M' + r2(x1) + ',' + r2(y1) + ' L' + r2(x2) + ',' + r2(y2) + '"/>' + show(b, b + d) + '</circle>';
    }
    // 1차(4.6~6.0): 폰 → A → gateway
    body += hop(PX, GY - 16, xAt(AX, 4.9), SY + 10, 4.6, 0.7, C.a) + hop(xAt(AX, 5.4), SY + 10, GX, GY - 22, 5.3, 0.7, C.a);
    // 2차(8.4~10.8): 폰 → B → ISL → A → gateway
    body += hop(PX, GY - 16, xAt(BX, 8.8), SY + 10, 8.4, 0.8, C.a);
    body += hop(xAt(BX, 9.4), SY, xAt(AX, 9.6), SY, 9.2, 0.8, C.dev);
    body += hop(xAt(AX, 10.2), SY + 10, GX, GY - 22, 10.0, 0.8, C.a);
    // 지상 장비 (고정)
    body += phone(PX, GY - 2) + txt(PX + 12, GY + 4, "폰 (user)", 11, C.a, ' text-anchor="start"');
    body += dish(GX, GY) + txt(GX + 18, GY - 4, "gateway", 11, C.pink, ' text-anchor="start"');
    // 위성 (이동)
    body += '<g>' + sat(AX, SY) + txt(AX, SY - 18, "위성 A", 12, C.pink, ' font-weight="700"') + move() + '</g>';
    body += '<g>' + sat(BX, SY) + txt(BX, SY - 18, "위성 B", 12, C.pink, ' font-weight="700"') + move() + '</g>';
    // 이동 방향
    body += txt(700, 60, "이동 방향 →", 11, C.muted);
    s += '<g clip-path="url(#lf_clip)">' + body + '</g>';

    // 비유 상자 (끝)
    s += vis(11.2, D,
      '<rect x="14" y="128" width="190" height="62" rx="6" fill="#fff" stroke="' + C.b + '" stroke-width="1.6"/>' +
      txt(109, 148, "footprint ≈ cell", 12, "#1d6b2a", ' font-weight="700"') +
      txt(109, 165, "위성 ≈ BS (움직이는 기지국)", 12, "#1d6b2a", ' font-weight="700"') +
      txt(109, 182, "다음 위성으로 ≈ handoff", 12, "#1d6b2a", ' font-weight="700"'));

    // ---------- 요점 ----------
    s += txt(380, 350, "LEO = cell 이 움직이는 셀룰러: footprint ≈ cell, 위성 ≈ BS — 대표 예 Starlink", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
