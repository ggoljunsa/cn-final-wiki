// ============================================================
// fast_retransmit_anim — L16 p.74, p.77: segment 301–400 이 사라지고 duplicate ACK 301 이 세 번 오면 time-out 전에 다시 보낸다
//   0–1.5 101–200, 201–300 → ACK 301 → 1.5–4 301–400(✗ lost), 401–500 → 4–8 501–600, 601–700 마다 ACK 301(dup 1·2·3)
//   → 8–10 fast retransmission 301–400 → 10–12 ACK 701 (out-of-order 로 쌓아 둔 것까지 한 번에) → 12–13 결과
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["fast_retransmit_anim"] = {
  title: "Fast retransmission — duplicate ACK 세 번이면 바로 다시 보내는 13초",
  desc: "p.77: 301–400 이 사라졌다. 뒤 segment 들은 도착하니 receiver 는 계속 ACK 301 을 보낸다. 원래 ACK + 똑같은 ACK 3 개가 오면 sender 는 time-out 을 기다리지 않고 301–400 을 다시 보낸다. [[RTO와 fast retransmission]]",
  duration: 13,
  build: function () {
    var D = 13;
    var C = { a: "#1d65b3", aL: "#dbe8f7", g: "#2e9e4f", gL: "#dff3e4", red: "#d6465f", o: "#e09a40", muted: "#777", ink: "#222" };
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var a = r4(from / D), b = r4(Math.min(1, (from + 0.12) / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, (to - 0.12) / D)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }
    var XL = 170, XR = 560;
    function line(x1, y1, x2, y2, col, mk, t0, t1, dash) {
      var len = Math.round(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
      var s = '<g opacity="0"><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + col + '" stroke-width="2"' + (mk ? ' marker-end="url(#frt_' + mk + ')"' : '') + ' stroke-dasharray="' + len + '" stroke-dashoffset="' + len + '">';
      s += '<animate attributeName="stroke-dashoffset" values="' + len + ';' + len + ';0;0" keyTimes="0;' + r4(t0 / D) + ';' + r4(t1 / D) + ';1" dur="' + D + 's" fill="freeze"/></line>' + show(t0, D) + '</g>';
      return s;
    }
    function seg(y, label, t0, lost, col) {
      col = col || C.a;
      var s = '';
      if (lost) {
        s += line(XL, y, XL + 200, y + 10, C.red, "", t0, t0 + 0.7);
        s += vis(t0 + 0.7, D, txt(XL + 212, y + 16, "✗ lost", 13, C.red, ' font-weight="700"'));
      } else {
        s += line(XL, y, XR, y + 18, col, col === C.o ? "o" : "a", t0, t0 + 0.8);
      }
      s += vis(t0, D, txt(XL - 8, y + 4, label, 11, col, ' text-anchor="end" font-weight="700"'));
      return s;
    }
    function ack(y, label, t0, dup) {
      return line(XR, y, XL, y + 18, dup ? C.red : C.g, dup ? "r" : "g", t0, t0 + 0.7) + vis(t0, D, txt(XR + 8, y + 4, label, 11, dup ? C.red : C.g, ' text-anchor="start" font-weight="700"'));
    }
    var s = '<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="fast retransmission 애니메이션">';
    s += '<defs>';
    [["a", C.a], ["r", C.red], ["g", C.g], ["o", C.o]].forEach(function (m) {
      s += '<marker id="frt_' + m[0] + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="' + m[1] + '"/></marker>';
    });
    s += '</defs><rect x="0" y="0" width="760" height="380" fill="#fff"/>';
    [
      [0, 1.5, "101–200, 201–300 이 도착 → ACK 301 (다음에 기다리는 byte)"],
      [1.5, 4, "301–400 이 사라졌다. 401–500 은 도착했지만 순서가 틀려 쌓아 두고 다시 ACK 301"],
      [4, 8, "501–600, 601–700 도 도착 → ACK 301, ACK 301 (duplicate 세 번째)"],
      [8, 10, "원래 ACK + 똑같은 ACK 3 개 → time-out 전에 301–400 을 바로 다시 보낸다"],
      [10, 12, "빈칸이 채워졌다 → 쌓아 둔 것까지 한 번에 ACK 701 (cumulative)"],
      [12, D, "duplicate ACK = 뒤 segment 는 도착했다는 신호. 하나만 빠졌으니 기다릴 필요가 없다"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 24, c[2], 14, C.ink, ' font-weight="700"')); });

    s += '<rect x="120" y="40" width="100" height="26" rx="4" fill="' + C.aL + '" stroke="' + C.a + '"/>' + txt(XL, 58, "Client", 13, C.ink, ' font-weight="700"');
    s += '<rect x="510" y="40" width="100" height="26" rx="4" fill="' + C.gL + '" stroke="' + C.g + '"/>' + txt(XR, 58, "Server", 13, C.ink, ' font-weight="700"');
    s += '<line x1="' + XL + '" y1="66" x2="' + XL + '" y2="360" stroke="#999"/><line x1="' + XR + '" y1="66" x2="' + XR + '" y2="360" stroke="#999"/>';

    s += seg(80, "101–200", 0.1) + seg(100, "201–300", 0.4) + ack(122, "ACK 301", 1.0);
    s += seg(150, "301–400", 1.6, true) + seg(176, "401–500", 2.3) + ack(198, "ACK 301 (dup 1)", 3.1, true);
    s += seg(226, "501–600", 4.1) + ack(248, "ACK 301 (dup 2)", 4.9, true);
    s += seg(270, "601–700", 5.8) + ack(292, "ACK 301 (dup 3)", 6.6, true);
    s += vis(7.4, D, txt(XL - 8, 300, "3 dup ACKs!", 12, C.red, ' text-anchor="end" font-weight="700"'));
    s += seg(316, "301–400 재전송", 8.2, false, C.o);
    s += ack(338, "ACK 701", 10.2, false);

    // receiver buffer
    var bx = 640, by = 90;
    s += txt(bx + 50, by - 8, "receiver buffer", 11, C.muted);
    var cells = [[0, 1.0], [1, 1.0], [2, 9.0], [3, 3.1], [4, 4.9], [5, 6.6]];
    cells.forEach(function (c, i) {
      var x = bx + i * 17;
      s += '<rect x="' + x + '" y="' + by + '" width="15" height="22" fill="#fff" stroke="#888"/>';
      s += vis(c[1], D, '<rect x="' + x + '" y="' + by + '" width="15" height="22" fill="' + (i === 2 ? C.o : (i > 2 ? "#9cc7ee" : C.aL)) + '" stroke="#888"/>');
    });
    s += vis(3.1, 9, txt(bx + 50, by + 40, "out of order", 11, C.a));
    s += vis(9.2, D, txt(bx + 50, by + 40, "all in order", 11, C.g, ' font-weight="700"'));
    s += '</svg>';
    return s;
  }
};
