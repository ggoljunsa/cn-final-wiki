// ============================================================
// fragmentation_anim — L13 p.42–46 Fragmentation
//   data 4,000 B datagram → R1(MTU 1,420) F1/F2/F3 → R2(MTU 820) F2 → F2.1/F2.2 → destination 만 reassemble
//   수치는 p.46 그림 (python 검산: offsets 0/175/350, 175/275, TL 1420/1420/1220, 820/620)
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["fragmentation_anim"] = {
  title: "Fragmentation — 라우터는 나누고, destination 만 합친다 (13초)",
  desc: "p.46 그림을 움직인다. R1 이 [[MTU]] 1,420 링크 앞에서 datagram 을 F1·F2·F3 로 나누고, R2 가 F2 를 다시 F2.1·F2.2 로 나눈다. [[fragmentation offset|offset]] 은 '''항상 원래 datagram 기준''', [[reassembly]] 는 '''destination host 만'''.",
  duration: 13,
  build: function () {
    var D = 13;
    var C = { a: "#1d65b3", aL: "#dbe8f7", g: "#2e9e4f", gL: "#dff3e4", o: "#e09a40", oL: "#fdeec2", r: "#3b2f4a", rL: "#efe9f6", red: "#d6465f", muted: "#777", ink: "#222", y: "#d6a017", yL: "#fff3bf" };
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function kt(times) { return times.map(function (t) { return r4(t / D); }).join(";"); }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var f = 0.15 / D, a = r4(from / D), b = r4(Math.min(from / D + f, (from + to) / 2 / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, to / D - f)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }
    // fragment 카드: 이름, bytes, offset, M, TL
    function card(x, y, w, nm, bytes, off, M, tl, fill) {
      var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="34" rx="3" fill="' + fill + '" stroke="' + C.o + '"/>';
      s += '<rect x="' + x + '" y="' + y + '" width="22" height="34" rx="3" fill="' + C.yL + '" stroke="' + C.y + '"/>' + txt(x + 11, y + 21, "H", 11, C.ink, ' font-weight="700"');
      s += txt(x + 24 + (w - 24) / 2, y + 14, nm + " · " + bytes, 10, C.ink, ' font-weight="700"');
      s += txt(x + 24 + (w - 24) / 2, y + 28, "off " + off + " · M " + M + " · TL " + tl, 10, C.red);
      return s;
    }

    var s = '<svg viewBox="0 0 760 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IPv4 fragmentation 과 reassembly 애니메이션">';

    // ---- 자막 ----
    [
      [0, 1.5, "Source 가 total 4,020 bytes datagram 을 보낸다 (data bytes 0–3999)"],
      [1.5, 3, "R1 다음 링크의 MTU 는 1,420 bytes — 그대로는 못 지나간다"],
      [3, 5.5, "R1 이 fragmentation: header 복사, offset = 첫 byte ÷ 8, 마지막만 M = 0"],
      [5.5, 8, "R2 가 F2 를 다시 나눈다(MTU 820) — offset 은 원래 datagram 기준"],
      [8, 10.5, "destination host 만 reassemble — 같은 identification 14,567 을 모은다"],
      [10.5, D, "offset 0 · 175 · 275 · 350 순으로 붙여 원래 datagram 복원"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 24, c[2], 14, C.ink, ' font-weight="700"')); });

    // ---- 노드 ----
    var NX = [60, 255, 475, 700], NY = 66;
    var NM = ["Source", "R1", "R2", "Destination"];
    NX.forEach(function (x, i) {
      if (i === 0 || i === 3) {
        s += '<rect x="' + (x - 46) + '" y="' + (NY - 16) + '" width="92" height="32" rx="4" fill="' + C.aL + '" stroke="' + C.a + '"/>';
      } else {
        s += '<circle cx="' + x + '" cy="' + NY + '" r="18" fill="' + C.rL + '" stroke="' + C.r + '"/>';
      }
      s += txt(x, NY + 5, NM[i], 12, C.ink, ' font-weight="700"');
    });
    s += '<line x1="106" y1="' + NY + '" x2="237" y2="' + NY + '" stroke="#999" stroke-width="2"/>';
    s += '<line x1="273" y1="' + NY + '" x2="457" y2="' + NY + '" stroke="#999" stroke-width="2"/>';
    s += '<line x1="493" y1="' + NY + '" x2="654" y2="' + NY + '" stroke="#999" stroke-width="2"/>';
    s += vis(1.5, D, txt(365, NY - 8, "MTU 1,420", 11, C.red, ' font-weight="700"'));
    s += vis(5.5, D, txt(573, NY - 8, "MTU 820 (F2 경로)", 11, C.red, ' font-weight="700"'));
    s += vis(3, D, txt(NX[1], NY + 34, "fragments", 11, C.muted));
    s += vis(5.5, D, txt(NX[2], NY + 34, "fragments again", 11, C.muted));
    s += vis(8, D, txt(NX[3], NY + 34, "reassembles", 11, C.a, ' font-weight="700"'));

    // ---- 원래 datagram: source → R1 ----
    var og = '<g>' + card(20, 112, 170, "원래", "0–3999", 0, 0, 4020, C.aL);
    og += '<animateTransform attributeName="transform" type="translate" values="0,0;0,0;150,0;150,0" keyTimes="' + kt([0, 1.5, 2.8, D]) + '" dur="' + D + 's" fill="freeze"/>';
    og += '<animate attributeName="opacity" values="1;1;0;0" keyTimes="' + kt([0, 2.9, 3.1, D]) + '" dur="' + D + 's" fill="freeze"/>';
    og += '</g>';
    s += og;
    s += vis(0, 3, txt(105, 164, "id 14,567 · D 0", 10, C.muted));

    // ---- R1 → F1 F2 F3 (link R1–R2 아래) ----
    var lx = 280, lw = 170;
    s += vis(3.1, D, card(lx, 112, lw, "F1", "0–1399", 0, 1, 1420, C.oL));
    s += vis(3.6, 5.6, card(lx, 152, lw, "F2", "1400–2799", 175, 1, 1420, C.oL));
    s += vis(5.6, D, '<g opacity="0.35">' + card(lx, 152, lw, "F2", "1400–2799", 175, 1, 1420, C.oL) + '</g>');
    s += vis(4.1, D, card(lx, 192, lw, "F3", "2800–3999", 350, 0, 1220, C.oL));
    s += vis(4.1, 8, txt(lx + lw / 2, 244, "id 14,567 을 모두 복사", 10, C.muted));

    // ---- R2 → F2.1 F2.2 (link R2–Dest 아래) ----
    var rx = 500, rw = 160;
    s += vis(5.8, D, card(rx, 112, rw, "F2.1", "1400–2199", 175, 1, 820, C.gL));
    s += vis(6.3, D, card(rx, 152, rw, "F2.2", "2200–2799", 275, 1, 620, C.gL));
    s += vis(6.8, 8, txt(rx + rw / 2, 204, "F2.2 도 M = 1 (원래 F2 가 중간이었으니)", 10, C.red, ' font-weight="700"'));
    s += vis(6.8, D, '<path d="M 452 170 L 498 132" fill="none" stroke="' + C.g + '" stroke-width="1.5"/><path d="M 452 170 L 498 170" fill="none" stroke="' + C.g + '" stroke-width="1.5"/>');

    // ---- destination: 도착 순서(뒤섞임) → 정렬 ----
    var by = 262;
    s += vis(8, 10.5, txt(380, by - 8, "도착 순서 (제각각): F2.2 · F2.1 · F3 · F1", 12, C.muted, ' font-weight="700"'));
    var arrive = [["F2.2", 275], ["F2.1", 175], ["F3", 350], ["F1", 0]];
    arrive.forEach(function (f, i) {
      s += vis(8.2 + i * 0.3, 10.5, '<rect x="' + (110 + i * 140) + '" y="' + by + '" width="120" height="30" rx="3" fill="' + C.oL + '" stroke="' + C.o + '"/>' + txt(170 + i * 140, by + 20, f[0] + " (off " + f[1] + ")", 11, C.ink, ' font-weight="700"'));
    });
    // 복원 막대: x = 80 + byte × 0.15
    function BX(b) { return 80 + b * 0.15; }
    var segs = [["F1", 0, 1399, C.oL], ["F2.1", 1400, 2199, C.gL], ["F2.2", 2200, 2799, C.gL], ["F3", 2800, 3999, C.oL]];
    segs.forEach(function (g, i) {
      var x = BX(g[1]), w = BX(g[2] + 1) - x;
      s += vis(10.6 + i * 0.35, D, '<rect x="' + x + '" y="' + by + '" width="' + w + '" height="30" fill="' + g[3] + '" stroke="' + C.o + '"/>' + txt(x + w / 2, by + 19, g[0], 11, C.ink, ' font-weight="700"') + txt(x, by + 46, String(g[1]), 10, C.muted));
    });
    s += vis(12, D, txt(BX(4000), by + 46, "3999", 10, C.muted) + txt(380, by - 8, "Reassembled: bytes 0–3999 (offset × 8 = 시작 byte)", 12, C.a, ' font-weight="700"'));

    // ---- 요점 ----
    s += txt(380, 360, "요점: source·라우터 누구나 나눌 수 있지만, 합치는 것은 destination host 만", 13, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
