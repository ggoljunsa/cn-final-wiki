// ============================================================
// gsm_multiframe_anim — GSM: 65 → 114 → 156.25 bits slot → 8 slot frame → 26 frame multiframe(120 ms) → 270.8 kbps
// CONTRACT §7. 슬라이드 L10 "GSM (2G): Transmission" · "Multiframe components".
// 시간축(초): 0 65 bits → 1.4 114 bits → 2.8 156.25 bits(slot) → 4.2 frame = 8 slots
//   → 6.2 multiframe = 26 frames → 8.2 120 ms → 9.6 식 조립 → 11.6 결과 유지 → 13 끝
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["gsm_multiframe_anim"] = {
  title: "GSM multiframe — 156.25 bits 슬롯에서 270.8 kbps 까지",
  desc: "[[GSM 프레임 구조]]: user data 65 bits → error control 붙여 114 bits → TDMA control 붙여 156.25 bits = slot 하나 → 8 slots = frame → 26 frames(24 traffic + 2 control) = [[GSM multiframe|multiframe]] 120 ms → [[GSM channel bit rate|channel bit rate]] 270.8 kbps",
  duration: 13,
  build: function () {
    var D = 13;
    var C = { a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", c: "#e09a40", dev: "#3b2f4a", devL: "#efe9f6", hot: "#d6465f", muted: "#777", slot: "#f9c6dc", slotS: "#b0587f", ctl: "#8a8a8a" };
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
    function rect(x, y, w, h, fill, stroke, extra) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"' + (extra || "") + '/>';
    }
    function hl(x, y, w, h, a, b) {   // 빨간 강조 테두리
      return during(a, b, '<rect x="' + (x - 3) + '" y="' + (y - 3) + '" width="' + (w + 6) + '" height="' + (h + 6) + '" rx="3" fill="none" stroke="' + C.hot + '" stroke-width="2.5"/>');
    }

    var s = '<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GSM multiframe 애니메이션">';
    s += '<defs><marker id="gm_arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#333"/></marker></defs>';

    // ---- 단계 자막 ----
    var caps = [
      [0, 1.4, "디지털화한 음성: user data 65 bits"],
      [1.4, 2.8, "error control bits 를 붙여 114 bits"],
      [2.8, 4.2, "TDMA control bits 까지 붙이면 156.25 bits — 이것이 slot 하나"],
      [4.2, 6.2, "slot 8 개 = frame 하나 (8 사용자가 TDMA 로 나눠 씀)"],
      [6.2, 8.2, "frame 26 개 = multiframe 하나 (24 traffic frames + 2 control frames)"],
      [8.2, 9.6, "multiframe 하나의 길이 = 120 ms"],
      [9.6, D, "channel bit rate = (1/120 ms) × 26 × 8 × 156.25 = 270.8 kbps"]
    ];
    caps.forEach(function (c) { s += during(c[0], c[1], txt(380, 24, c[2], 14, "#222", ' font-weight="700"')); });

    // ---- 비트 쌓기 (위) ----
    var CX = 250;
    var lv = [
      { w: 70, y: 42, lab: "65 bits", note: "User data", t: 0 },
      { w: 112, y: 76, lab: "114 bits", note: "User data + error control bits", t: 1.4 },
      { w: 154, y: 110, lab: "156.25 bits", note: "+ error control bits + TDMA control bits", t: 2.8 }
    ];
    lv.forEach(function (L, i) {
      var x = CX - L.w / 2;
      var g = rect(x, L.y, L.w, 26, i === 2 ? C.slot : "#fff", i === 2 ? C.slotS : "#333") + txt(CX, L.y + 18, L.lab, 13, "#222", ' font-weight="700"');
      g += txt(CX + 88, L.y + 18, L.note, 12, i === 0 ? C.a : (i === 1 ? C.b : C.c), ' font-weight="700" text-anchor="start"');
      if (i > 0) {   // 윗 상자 양끝에서 내려오는 연결선
        var pw = lv[i - 1].w;
        g += '<path d="M' + (CX - pw / 2) + ',' + (lv[i - 1].y + 26) + ' L' + (CX - pw / 2) + ',' + (L.y - 2) + ' M' + (CX + pw / 2) + ',' + (lv[i - 1].y + 26) + ' L' + (CX + pw / 2) + ',' + (L.y - 2) + '" stroke="#333" stroke-width="1.2"/>';
      }
      s += during(L.t, D, g);
    });
    s += hl(CX - 77, 110, 154, 26, 2.8, 4.2);

    // ---- frame = 8 slots ----
    var FX = 120, FY = 166, SW = 40, SH = 26;
    var fr = "";
    for (var k = 0; k < 8; k++) fr += during(4.3 + k * 0.18, D, rect(FX + k * SW, FY, SW, SH, C.slot, C.slotS) + txt(FX + k * SW + SW / 2, FY + 18, String(k + 1), 11, C.slotS, ' font-weight="700"'));
    s += fr;
    s += during(4.2, D, '<path d="M' + (CX - 77) + ',136 L' + FX + ',' + (FY - 2) + ' M' + (CX + 77) + ',136 L' + (FX + SW) + ',' + (FY - 2) + '" stroke="#333" stroke-dasharray="5 4" stroke-width="1.2"/>');
    s += during(5.8, D, txt(FX + 8 * SW + 12, FY + 18, "Frame = 8 slots", 12, "#222", ' font-weight="700" text-anchor="start"'));
    s += hl(FX, FY, 8 * SW, SH, 10.8, 11.6);

    // ---- multiframe = 26 frames ----
    var MX = 42, MY = 238, MW = 25, MH = 24, GAP = 1.5;
    var mf = "";
    for (var j = 0; j < 26; j++) {
      var isCtl = (j === 12 || j === 25);
      var x = +(MX + j * (MW + GAP)).toFixed(1);
      mf += during(6.3 + j * 0.06, D, rect(x, MY, MW, MH, isCtl ? C.ctl : C.slot, isCtl ? "#555" : C.slotS) + txt(x + MW / 2, MY + 16, String(j + 1), 10, isCtl ? "#fff" : C.slotS, ' font-weight="700"'));
    }
    s += mf;
    var MEND = +(MX + 26 * (MW + GAP) - GAP).toFixed(1);
    s += during(6.2, D, '<path d="M' + FX + ',' + (FY + SH) + ' L' + MX + ',' + (MY - 2) + ' M' + (FX + 8 * SW) + ',' + (FY + SH) + ' L' + (MX + MW) + ',' + (MY - 2) + '" stroke="#333" stroke-dasharray="5 4" stroke-width="1.2"/>');
    s += during(7.6, D, txt(MEND, MY - 8, "1 multiframe = 26 frames: 24 traffic + 2 control (회색)", 12, "#222", ' font-weight="700" text-anchor="end"'));
    s += hl(MX, MY, MEND - MX, MH, 10.3, 11.1);
    // 120 ms 화살표
    s += during(8.2, D, '<line x1="' + MX + '" y1="' + (MY + MH + 12) + '" x2="' + MEND + '" y2="' + (MY + MH + 12) + '" stroke="#333" stroke-width="1.5" marker-start="url(#gm_arr)" marker-end="url(#gm_arr)"/>' +
      '<rect x="' + ((MX + MEND) / 2 - 34) + '" y="' + (MY + MH + 3) + '" width="68" height="18" fill="#fff"/>' +
      txt((MX + MEND) / 2, MY + MH + 17, "120 ms", 13, C.hot, ' font-weight="700"'));
    // 156.25 강조 (식의 마지막 항)
    s += hl(CX - 77, 110, 154, 26, 11.3, 12.1);

    // ---- 식 조립 (아래) ----
    s += during(9.6, D, '<rect x="110" y="304" width="540" height="34" rx="8" fill="#fff6b0" stroke="#b9a520" stroke-width="1.5"/>');
    var parts = [
      ["(1/120 ms)", 229, 9.8], ["× 26", 307, 10.3], ["× 8", 347, 10.8], ["× 156.25", 379, 11.3], ["= 270.8 kbps", 445, 11.8]
    ];
    parts.forEach(function (p, i) {
      s += during(p[2], D, txt(p[1], 327, p[0], 15, i === 4 ? C.hot : "#222", ' font-weight="700" text-anchor="start"'));
    });

    // ---- 요점 ----
    s += txt(380, 364, "slot(156.25 bits) × 8 = frame, frame × 26 = multiframe(120 ms) → GSM channel 하나 = 270.8 kbps", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
