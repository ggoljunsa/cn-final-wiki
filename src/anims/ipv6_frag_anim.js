// ============================================================
// ipv6_frag_anim — L14 p.26: 큰 패킷이 MTU 가 작은 링크를 만났을 때
//   위 IPv4: router 가 나눔 / 아래 IPv6: router 가 drop → source 가 처음부터 나눠 보냄
//   시간축(초): 0 두 줄 초기 → 0.5–3 큰 패킷 이동 → 3–4.5 IPv4 분할 / IPv6 drop → 4.5–7 IPv4 조각 도착
//   → 7–10.5 IPv6 source 가 작게 나눠 다시 → 12
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["ipv6_frag_anim"] = {
  title: "IPv4 router 는 나누고, IPv6 router 는 버린다 (12초)",
  desc: "같은 1,500 B 패킷이 다음 링크 MTU 1,000 B 인 router 를 만난다. IPv4 router 는 [[fragmentation]] 해서 보내고, IPv6 router 는 drop 한다. IPv6 에서는 source 만 나눈다 → [[IPv6 fragmentation]]",
  duration: 12,
  build: function () {
    var D = 12;
    var C = { a: "#1d65b3", aL: "#dbe8f7", r: "#3b2f4a", rL: "#efe9f6", g: "#2e9e4f", gL: "#dff3e4", y: "#e09a40", yL: "#fdeec2", red: "#d6465f", muted: "#777", ink: "#222" };
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
    function pkt(w, label, fill, stroke) {
      return box(-w / 2, -12, w, 24, fill, stroke, 3) + txt(0, 5, label, 11, C.ink, ' font-weight="700"');
    }
    function mover(from, to, w, label, fill, stroke, path, begin, dur) {
      return vis(from, to, '<g>' + pkt(w, label, fill, stroke) + '<animateMotion path="' + path + '" begin="' + begin + 's" dur="' + dur + 's" fill="freeze"/></g>');
    }

    var s = '<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IPv4 와 IPv6 의 fragmentation 비교 애니메이션">';
    [
      [0, 3, "Source 가 1,500 B 패킷을 보낸다. router 다음 링크의 MTU 는 1,000 B"],
      [3, 4.5, "router: 패킷이 next MTU 보다 크다 → IPv4 는 나누고, IPv6 는 버린다"],
      [4.5, 7, "IPv4 조각 F1·F2 는 destination 으로 가고, 거기서 합쳐진다"],
      [7, D, "IPv6 는 source 가 크기를 확인하고 처음부터 나눠 보낸다 → router 는 그대로 통과"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 24, c[2], 14, C.ink, ' font-weight="700"')); });

    // 두 줄 공통 배경
    [[0, "IPv4", 95], [1, "IPv6", 225]].forEach(function (row) {
      var y = row[2];
      s += txt(40, y + 5, row[1], 15, row[0] ? C.g : C.a, ' font-weight="700"');
      s += box(80, y - 22, 90, 44, C.aL, C.a, 6) + txt(125, y + 5, "Source", 13, C.a, ' font-weight="700"');
      s += '<line x1="170" y1="' + y + '" x2="350" y2="' + y + '" stroke="#999" stroke-width="3"/>';
      s += '<circle cx="380" cy="' + y + '" r="28" fill="' + C.rL + '" stroke="' + C.r + '" stroke-width="2"/>' + txt(380, y + 5, "Router", 12, C.r, ' font-weight="700"');
      s += '<line x1="408" y1="' + y + '" x2="590" y2="' + y + '" stroke="#999" stroke-width="1.5"/>';
      s += txt(500, y - 30, "next link MTU 1,000 B", 11, C.muted);
      s += box(590, y - 22, 110, 44, C.gL, C.g, 6) + txt(645, y + 5, "Destination", 13, C.g, ' font-weight="700"');
    });

    // IPv4 줄: 큰 패킷 → router → F1, F2
    s += mover(0.5, 3.1, 90, "1,500 B", C.yL, C.y, "M 170 95 L 340 95", 0.5, 2.5);
    s += vis(3, 4.6, txt(380, 140, "fragmentation!", 12, C.a, ' font-weight="700"'));
    s += vis(3.2, 4.6, txt(380, 62, "F1 · F2", 12, C.a, ' font-weight="700"'));
    s += mover(4.5, 7.2, 60, "F1", C.yL, C.y, "M 420 82 L 560 82", 4.5, 2.4);
    s += mover(4.7, 7.2, 60, "F2", C.yL, C.y, "M 420 108 L 560 108", 4.7, 2.3);
    s += vis(7, D, txt(645, 140, "reassemble ✓", 12, C.g, ' font-weight="700"'));

    // IPv6 줄: 큰 패킷 → router 에서 drop
    s += mover(0.5, 3.4, 90, "1,500 B", C.yL, C.y, "M 170 225 L 340 225", 0.5, 2.5);
    s += vis(3, 7, '<line x1="300" y1="200" x2="340" y2="250" stroke="' + C.red + '" stroke-width="5"/><line x1="340" y1="200" x2="300" y2="250" stroke="' + C.red + '" stroke-width="5"/>' +
      txt(380, 278, "drop (나누지 않음)", 13, C.red, ' font-weight="700"'));
    // IPv6 source 가 처음부터 나눔
    s += vis(7, 10.6, txt(125, 266, "source 가 나눔", 12, C.a, ' font-weight="700"'));
    s += mover(7.3, D, 60, "F1", C.yL, C.y, "M 180 212 L 560 212", 7.3, 3);
    s += mover(7.6, D, 60, "F2", C.yL, C.y, "M 180 238 L 560 238", 7.6, 3);
    s += vis(10.6, D, txt(645, 270, "reassemble ✓", 12, C.g, ' font-weight="700"'));

    s += txt(380, 316, "누가 나누나: IPv4 = source 또는 아무 router · IPv6 = source 만 / 합치는 쪽은 둘 다 destination", 13, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
