// ============================================================
// damps_tdma_anim — AMPS(음성 1개 = 30 kHz 채널 1개) vs D-AMPS(음성 3개를 TDMA 로 한 채널에)
// CONTRACT §7. 슬라이드 L10 "D-AMPS (2G): Transmission".
// 시간축(초): 0 두 방식 → 1.5 AMPS: 3 kHz 음성 → FM → 30 kHz 채널 하나 차지
//   → 4.5 D-AMPS: 음성 3개 → Digitizer → 7.95 kbps → 6.8 TDMA 슬롯 1 2 3 1 2 3 = 48.6 kbps
//   → 9.2 QPSK → 같은 30 kHz 채널 → 11.3 비교 → 13 끝
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["damps_tdma_anim"] = {
  title: "D-AMPS — 같은 30 kHz 채널에 음성 3개를 TDMA 로",
  desc: "[[AMPS]]는 3 kHz 음성 하나를 [[FM]]으로 30 kHz 채널 하나에 싣고, [[D-AMPS]]는 음성을 [[7.95 kbps 디지털 음성|7.95 kbps 로 digitize]] 해 3개를 [[TDMA]]로 묶어(48.6 kbps) [[QPSK]]로 같은 30 kHz 채널에 싣는다",
  duration: 13,
  build: function () {
    var D = 13;
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
    function phone(x, y, col, colL) {   // (x, y) = 왼쪽 위, 14×24
      return '<rect x="' + x + '" y="' + y + '" width="14" height="24" rx="3" fill="' + colL + '" stroke="' + col + '" stroke-width="1.6"/>' +
        '<rect x="' + (x + 3) + '" y="' + (y + 4) + '" width="8" height="7" fill="#fff" stroke="' + col + '" stroke-width="0.8"/>';
    }
    function boxT(x, y, w, h, label, fill, stroke) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>' + txt(x + w / 2, y + h / 2 + 4, label, 11, "#222", ' font-weight="700"');
    }
    function packet(path, col, a, dur) {   // 경로를 따라 움직이는 작은 사각형
      return '<rect x="-7" y="-5" width="14" height="10" rx="2" fill="' + col + '" opacity="0"><animateMotion begin="' + a + 's" dur="' + dur + 's" fill="freeze" path="' + path + '"/>' + show(a, a + dur) + '</rect>';
    }
    // FDMA 대역 띠: 혹(채널) 7개, 그중 filled 번째를 칠함
    var HUMP = "M0,0 C0,-16 4,-20 13,-20 C22,-20 26,-16 26,0 Z";
    function bandStrip(x0, y0, w, filledIdx, fillHtml, a) {
      var g = '<rect x="' + x0 + '" y="' + (y0 - 30) + '" width="' + w + '" height="44" fill="#f0f0f0" stroke="#999" stroke-dasharray="4 3"/>';
      g += txt(x0 + w - 4, y0 - 34, "FDMA", 11, C.muted, ' text-anchor="end"');
      g += '<line x1="' + (x0 + 6) + '" y1="' + y0 + '" x2="' + (x0 + w - 6) + '" y2="' + y0 + '" stroke="#555"/>';
      var xs = [];
      for (var i = 0; i < 7; i++) {
        var hx = x0 + 10 + i * ((w - 46) / 6);
        xs.push(hx);
        if (i === 3) { g += txt(hx + 13, y0 - 6, "…", 13, "#555"); continue; }
        g += '<path d="' + HUMP + '" transform="translate(' + hx + ' ' + y0 + ')" fill="#fff" stroke="#888" stroke-dasharray="3 2"/>';
      }
      g += txt(x0 + w / 2, y0 + 28, "25-MHz band", 11, C.muted);
      g += during(a, D, '<g transform="translate(' + xs[filledIdx] + ' ' + y0 + ')">' + fillHtml + '</g>');
      return { svg: g, x: xs[filledIdx] + 13 };
    }

    var s = '<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AMPS와 D-AMPS 전송 비교 애니메이션">';
    s += '<defs><marker id="da_arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#555"/></marker>' +
      '<clipPath id="da_hump"><path d="' + HUMP + '"/></clipPath></defs>';

    // ---- 단계 자막 ----
    var caps = [
      [0, 1.5, "같은 30 kHz 채널을 1G AMPS 와 2G D-AMPS 는 어떻게 쓰나"],
      [1.5, 4.5, "AMPS: 3 kHz 아날로그 음성 하나를 FM 으로 → 30 kHz 채널 하나를 혼자 차지 (FDMA)"],
      [4.5, 6.8, "D-AMPS: 음성 채널을 Digitizer 로 디지털화 → 7.95 kbps"],
      [6.8, 9.2, "디지털 음성 3 개를 TDMA 로 묶음 → 슬롯 1 2 3 1 2 3 … = 48.6 kbps (overhead 포함)"],
      [9.2, 11.3, "QPSK 로 변조 → AMPS 와 같은 30 kHz 채널, 같은 대역 (같은 bands and channels)"],
      [11.3, D, "30 kHz 채널 하나에 AMPS 는 1 명, D-AMPS 는 3 명"]
    ];
    caps.forEach(function (c) { s += during(c[0], c[1], txt(380, 24, c[2], 14, "#222", ' font-weight="700"')); });

    // ---- 패널 배경 ----
    s += '<rect x="8" y="38" width="288" height="304" rx="10" fill="#fafbfd" stroke="#dfe3ea"/>';
    s += '<rect x="304" y="38" width="448" height="304" rx="10" fill="#fafbfd" stroke="#dfe3ea"/>';
    s += during(1.5, 4.5, '<rect x="8" y="38" width="288" height="304" rx="10" fill="' + C.aL + '" fill-opacity="0.45" stroke="' + C.a + '" stroke-width="2"/>');
    s += during(4.5, 11.3, '<rect x="304" y="38" width="448" height="304" rx="10" fill="' + C.devL + '" fill-opacity="0.6" stroke="' + C.dev + '" stroke-width="2"/>');
    s += txt(152, 60, "AMPS (1G) — voice: analog", 13, C.dev, ' font-weight="700"');
    s += txt(528, 60, "D-AMPS (2G) — voice: digitized", 13, C.dev, ' font-weight="700"');

    // ================= AMPS (왼쪽) =================
    s += phone(26, 112, C.a, C.aL);
    s += txt(33, 152, "3 kHz", 11, "#222") + txt(33, 165, "Voice", 11, "#222");
    s += '<line x1="42" y1="124" x2="90" y2="124" stroke="#555" stroke-width="1.5" marker-end="url(#da_arr)"/>';
    s += boxT(92, 112, 50, 24, "FM", "#cfe8f3", "#4a8bb0");
    s += '<path d="M117,136 L117,268" fill="none" stroke="#555" stroke-width="1.5" marker-end="url(#da_arr)"/>';
    s += txt(126, 190, "30 kHz Analog", 11, "#222", ' text-anchor="start"');
    var fillA = '<path d="' + HUMP + '" fill="' + C.a + '" stroke="' + C.a + '"/>';
    var bA = bandStrip(24, 300, 256, 2, fillA, 3.4);   // 세 번째 혹(중심 x=117) — 위 세로선과 맞춤
    s += bA.svg;
    s += packet("M42,124 L90,124", C.a, 1.8, 0.6) + packet("M117,136 L117,268", C.a, 2.5, 0.9);
    s += during(3.4, D, txt(126, 240, "채널 하나 = 1 명", 12, C.a, ' font-weight="700" text-anchor="start"'));

    // ================= D-AMPS (오른쪽) =================
    var RY = [96, 136, 176];
    var SX = 500, SW = 32, SY = 210, SH = 22;      // TDMA 슬롯 6칸
    function slotC(k) { return SX + k * SW + SW / 2; }
    RY.forEach(function (y, i) {
      s += phone(318, y - 12, UC[i][0], UC[i][1]);
      s += txt(340, y - 2, "3 kHz", 10, "#222", ' text-anchor="start"') + txt(340, y + 10, "Voice", 10, "#222", ' text-anchor="start"');
      s += boxT(372, y - 12, 60, 24, "Digitizer", UC[i][1], UC[i][0]);
      s += txt(438, y - 5, "7.95 kbps", 11, UC[i][0], ' font-weight="700" text-anchor="start"');
      // 가로선 → 두 슬롯(i, i+3)으로 내려감
      var xa = slotC(i), xb = slotC(i + 3);
      s += '<path d="M432,' + y + ' L' + xb + ',' + y + '" fill="none" stroke="#555" stroke-width="1.3"/>';
      s += '<path d="M' + xa + ',' + y + ' L' + xa + ',' + (SY - 2) + '" fill="none" stroke="#555" stroke-width="1.3" marker-end="url(#da_arr)"/>';
      s += '<path d="M' + xb + ',' + y + ' L' + xb + ',' + (SY - 2) + '" fill="none" stroke="#555" stroke-width="1.3" marker-end="url(#da_arr)"/>';
      // 디지털 음성 패킷: 디지타이저 → 두 슬롯
      s += during(4.7 + i * 0.3, 6.8, '<rect x="372" y="' + (y - 12) + '" width="60" height="24" rx="4" fill="none" stroke="' + C.hot + '" stroke-width="2.5"/>');
      s += packet("M432," + y + " L" + xa + "," + y + " L" + xa + "," + (SY - 6), UC[i][0], 5.2 + i * 0.25, 1.2);
      s += packet("M432," + y + " L" + xb + "," + y + " L" + xb + "," + (SY - 6), UC[i][0], 5.4 + i * 0.25, 1.3);
    });
    // TDMA 프레임
    for (var k = 0; k < 6; k++) {
      var u = k % 3;
      s += '<rect x="' + (SX + k * SW) + '" y="' + SY + '" width="' + SW + '" height="' + SH + '" fill="#fff" stroke="#555"/>';
      s += during(6.9 + k * 0.3, D, '<rect x="' + (SX + k * SW) + '" y="' + SY + '" width="' + SW + '" height="' + SH + '" fill="' + UC[u][0] + '" stroke="#555"/>' +
        txt(slotC(k), SY + 16, String(u + 1), 12, "#fff", ' font-weight="700"'));
    }
    s += txt(SX + 6 * SW + 8, SY + 16, "TDMA", 12, C.hot, ' font-weight="700" text-anchor="start"');
    s += '<path d="M' + SX + ',' + (SY + SH + 6) + ' L' + SX + ',' + (SY + SH + 12) + ' L' + (SX + 6 * SW) + ',' + (SY + SH + 12) + ' L' + (SX + 6 * SW) + ',' + (SY + SH + 6) + '" fill="none" stroke="#333"/>';
    s += during(8.3, D, txt(SX + 3 * SW, SY + SH + 27, "48.6 kbps", 12, C.hot, ' font-weight="700"'));
    // 프레임 → QPSK → 대역
    s += '<path d="M' + SX + ',' + (SY + SH / 2) + ' L360,' + (SY + SH / 2) + ' L360,286 L372,286" fill="none" stroke="#555" stroke-width="1.5" marker-end="url(#da_arr)"/>';
    s += boxT(374, 274, 50, 24, "QPSK", "#efe9f6", C.dev);
    s += '<line x1="424" y1="286" x2="466" y2="286" stroke="#555" stroke-width="1.5" marker-end="url(#da_arr)"/>';
    s += txt(445, 278, "30 kHz", 11, "#222");
    // 3색 혹 (TDMA 로 공유)
    var fillD = '<g clip-path="url(#da_hump)"><rect x="0" y="-22" width="9" height="22" fill="' + C.a + '"/><rect x="9" y="-22" width="8" height="22" fill="' + C.b + '"/><rect x="17" y="-22" width="9" height="22" fill="' + C.c + '"/></g><path d="' + HUMP + '" fill="none" stroke="#555"/>';
    var bD = bandStrip(472, 300, 268, 0, fillD, 9.9);
    s += bD.svg;
    s += packet("M" + SX + "," + (SY + SH / 2) + " L360," + (SY + SH / 2) + " L360,286 L372,286", C.hot, 9.2, 0.7) + packet("M424,286 L" + (bD.x) + ",286", C.hot, 9.9, 0.4);

    // ---- 비교 배지 ----
    s += during(11.3, D, '<rect x="166" y="104" width="112" height="40" rx="6" fill="' + C.aL + '" stroke="' + C.a + '"/>' + txt(222, 120, "AMPS", 11, C.a, ' font-weight="700"') + txt(222, 136, "1 user / 30 kHz", 11, C.a, ' font-weight="700"'));
    s += during(11.3, D, '<rect x="316" y="304" width="140" height="34" rx="6" fill="#fdeef0" stroke="' + C.hot + '"/>' + txt(386, 318, "D-AMPS", 11, C.hot, ' font-weight="700"') + txt(386, 332, "3 users / 30 kHz", 11, C.hot, ' font-weight="700"'));

    // ---- 요점 ----
    s += txt(380, 366, "같은 대역·같은 30 kHz 채널에서 디지털화 + TDMA 로 3 배 사용자 — 2G 의 핵심", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
