// ============================================================
// ipv6_transition_anim — L14 p.30–32: IPv4 → IPv6 전환 세 가지
//   시간축(초): 0–4.5 dual stack (IPv4 패킷 → IPv4 층, IPv6 패킷 → IPv6 층)
//   → 4.5–9.5 tunneling ([v6|data] → R1 에서 [v4|v6|data] → R2 에서 벗김)
//   → 9.5–14 header translation ([v6|data] → R 에서 [v4|data], IPv6 전용 기능 손실)
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["ipv6_transition_anim"] = {
  title: "IPv4 → IPv6 전환: dual stack · tunneling · header translation (14초)",
  desc: "세 장면을 차례로 본다. [[dual stack]] 은 장치 하나에 두 층, [[tunneling]] 은 IPv6 패킷을 IPv4 패킷에 넣어 IPv4 구간 통과, [[header translation]] 은 IPv6 header 를 IPv4 header 로 바꿔 씀.",
  duration: 14,
  build: function () {
    var D = 14;
    var C = { a: "#1d65b3", aL: "#dbe8f7", g: "#2e9e4f", gL: "#dff3e4", y: "#e09a40", yL: "#fdeec2", r: "#3b2f4a", rL: "#efe9f6", red: "#d6465f", muted: "#777", ink: "#222" };
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var a = r4(from / D), b = r4(Math.min(1, (from + 0.15) / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, (to - 0.15) / D)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }
    function box(x, y, w, h, fill, stroke, rx) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 4) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>';
    }
    // 패킷: 칸 목록 [[라벨, 색, 연한색, 폭]] 을 가운데 정렬로
    function pkt(cells) {
      var w = cells.reduce(function (a, c) { return a + c[3]; }, 0), x = -w / 2, out = "";
      cells.forEach(function (c) { out += box(x, -13, c[3], 26, c[2], c[1], 2) + txt(x + c[3] / 2, 5, c[0], 11, C.ink, ' font-weight="700"'); x += c[3]; });
      return out;
    }
    var V6 = ["IPv6 hdr", C.g, C.gL, 64], V4 = ["IPv4 hdr", C.a, C.aL, 64], DATA = ["data", "#999", "#fff", 48];
    function mover(from, to, cells, path, begin, dur) {
      return vis(from, to, '<g>' + pkt(cells) + '<animateMotion path="' + path + '" begin="' + begin + 's" dur="' + dur + 's" fill="freeze"/></g>');
    }
    function router(x, y) {
      return '<ellipse cx="' + x + '" cy="' + y + '" rx="22" ry="12" fill="' + C.rL + '" stroke="' + C.r + '" stroke-width="2"/>' + txt(x, y + 4, "R", 11, C.r, ' font-weight="700"');
    }
    function host(x, y, label, col) {
      return box(x - 40, y - 18, 80, 36, "#fff", col, 6) + txt(x, y + 5, label, 12, col, ' font-weight="700"');
    }

    var s = '<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IPv4 에서 IPv6 로의 전환 애니메이션">';
    [
      [0, 4.5, "① Dual stack (p.30): host 가 IPv4 와 IPv6 를 둘 다 돌린다"],
      [4.5, 9.5, "② Tunneling (p.31): IPv6 패킷을 IPv4 패킷에 넣어 IPv4 구간을 지나간다"],
      [9.5, D, "③ Header translation (p.32): 경계 router 가 IPv6 header 를 IPv4 header 로 바꾼다"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 26, c[2], 15, C.ink, ' font-weight="700"')); });

    // ---------- 장면 1: dual stack ----------
    var sc1 = "";
    sc1 += box(250, 60, 260, 40, "#fff", "#555", 4) + txt(380, 85, "Upper layers (TCP / UDP)", 13);
    sc1 += box(250, 108, 126, 40, C.aL, C.a, 4) + txt(313, 133, "IPv4", 14, C.a, ' font-weight="700"');
    sc1 += box(384, 108, 126, 40, C.gL, C.g, 4) + txt(447, 133, "IPv6", 14, C.g, ' font-weight="700"');
    sc1 += box(250, 156, 260, 40, C.yL, C.y, 4) + txt(380, 181, "Underlying LAN or WAN", 13);
    sc1 += txt(110, 250, "To and from IPv4 system", 12, C.a) + txt(650, 250, "To and from IPv6 system", 12, C.g);
    s += vis(0, 4.5, sc1);
    s += mover(0.4, 2.6, [V4, DATA], "M 110 225 L 313 225 L 313 128 L 313 80", 0.4, 2);
    s += mover(2.3, 4.5, [V6, DATA], "M 650 225 L 447 225 L 447 128 L 447 80", 2.3, 2);
    s += vis(0, 4.5, txt(380, 290, "version 을 보고 맞는 층으로 올린다 — \"simple … but very effective\" (11/10 41:38)", 12, C.muted));

    // ---------- 장면 2: tunneling ----------
    var y2 = 170, sc2 = "";
    sc2 += '<rect x="230" y="' + (y2 - 50) + '" width="300" height="100" fill="#fff7c2" stroke="#e0c84a"/>' + txt(380, y2 + 70, "IPv4 region", 13, "#8a7a10", ' font-weight="700"');
    sc2 += '<line x1="110" y1="' + y2 + '" x2="650" y2="' + y2 + '" stroke="#999" stroke-width="2"/>';
    sc2 += host(70, y2, "IPv6 host", C.g) + host(690, y2, "IPv6 host", C.g) + router(230, y2) + router(530, y2);
    sc2 += txt(230, y2 + 34, "encapsulate", 11, C.a) + txt(530, y2 + 34, "decapsulate", 11, C.a);
    s += vis(4.5, 9.5, sc2);
    s += mover(4.7, 6.2, [V6, DATA], "M 120 135 L 205 135", 4.7, 1.4);
    s += mover(6.1, 8.1, [V4, V6, DATA], "M 255 135 L 505 135", 6.1, 1.9);
    s += mover(8.0, 9.5, [V6, DATA], "M 555 135 L 640 135", 8.0, 1.4);
    s += vis(6.1, 9.5, txt(380, 95, "IPv4 router 들은 바깥 IPv4 header 만 본다", 12, C.muted));

    // ---------- 장면 3: header translation ----------
    var y3 = 170, sc3 = "";
    sc3 += '<rect x="120" y="' + (y3 - 50) + '" width="330" height="100" fill="#fff7c2" stroke="#e0c84a"/>' + txt(285, y3 + 70, "IPv6 region", 13, "#8a7a10", ' font-weight="700"');
    sc3 += '<rect x="490" y="' + (y3 - 50) + '" width="150" height="100" fill="#fde2c4" stroke="' + C.y + '"/>' + txt(565, y3 + 70, "IPv4 region", 13, "#a5650f", ' font-weight="700"');
    sc3 += '<line x1="110" y1="' + y3 + '" x2="650" y2="' + y3 + '" stroke="#999" stroke-width="2"/>';
    sc3 += host(70, y3, "IPv6 host", C.g) + host(690, y3, "IPv4 host", C.a) + router(470, y3);
    sc3 += txt(470, y3 + 34, "translation", 11, C.r, ' font-weight="700"');
    s += vis(9.5, D, sc3);
    s += mover(9.7, 11.7, [V6, DATA], "M 130 135 L 430 135", 9.7, 1.9);
    s += mover(11.6, D, [V4, DATA], "M 505 135 L 620 135", 11.6, 1.4);
    s += vis(11.6, D, txt(470, 92, "IPv6 전용 기능(flow label, extension header)은 빠진다", 12, C.red, ' font-weight="700"'));

    s += txt(380, 326, "요점: 둘 다 돌리기(dual stack) · 감싸서 지나가기(tunneling) · 바꿔 쓰기(header translation)", 13, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
