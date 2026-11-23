// ============================================================
// three_way_handshake_anim — L16 p.56–61: 연결 설정 → data → 연결 종료
//   0–1.5 passive/active open → 1.5–3.5 SYN(seq 8000) → 3.5–5.5 SYN+ACK(seq 15000, ack 8001)
//   → 5.5–7.5 ACK(seq 8001, ack 15001) → 7.5–9 data(양방향) → 9–12.5 FIN → FIN+ACK → ACK → 12.5–14 결과
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["three_way_handshake_anim"] = {
  title: "TCP 연결 — three-way handshake 로 열고 닫는 14초",
  desc: "SYN → SYN+ACK → ACK 로 연결을 열고(p.56), data 를 주고받은 뒤 FIN → FIN+ACK → ACK 로 닫는다(p.60). [[three-way handshake]] · [[connection termination과 half close]]",
  duration: 14,
  build: function () {
    var D = 14;
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
    var XL = 150, XR = 610;
    // 화살표 하나: t0 에 출발해 t1 에 도착, 그 뒤 계속 남음
    function arrow(dir, y, label, t0, t1, col) {
      var x1 = dir > 0 ? XL : XR, x2 = dir > 0 ? XR : XL, y2 = y + 26;
      var len = Math.round(Math.sqrt((x2 - x1) * (x2 - x1) + 26 * 26));
      var s = '<g opacity="0">';
      s += '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + col + '" stroke-width="2.5" marker-end="url(#twh_' + (col === C.red ? "r" : (col === C.g ? "g" : "a")) + ')" stroke-dasharray="' + len + '" stroke-dashoffset="' + len + '">';
      s += '<animate attributeName="stroke-dashoffset" values="' + len + ';' + len + ';0;0" keyTimes="0;' + r4(t0 / D) + ';' + r4(t1 / D) + ';1" dur="' + D + 's" fill="freeze"/></line>';
      s += txt(380, y + 6, label, 12, col, ' font-weight="700"');
      s += show(t0, D) + '</g>';
      return s;
    }
    var s = '<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TCP three-way handshake 애니메이션">';
    s += '<defs>';
    [["a", C.a], ["r", C.red], ["g", C.g]].forEach(function (m) {
      s += '<marker id="twh_' + m[0] + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="' + m[1] + '"/></marker>';
    });
    s += '</defs><rect x="0" y="0" width="760" height="380" fill="#fff"/>';
    [
      [0, 1.5, "server 는 passive open(받을 준비), client 는 active open(연결하고 싶다)"],
      [1.5, 3.5, "① SYN: client 가 자기 sequence number(8000)를 맞추자고 보낸다"],
      [3.5, 5.5, "② SYN + ACK: server 도 자기 번호(15000)를 보내고 8001 을 기다린다고 알린다"],
      [5.5, 7.5, "③ ACK: client 가 15001 을 기다린다고 답한다 → 연결 완료"],
      [7.5, 9, "data transfer: 양방향(full-duplex), ACK 는 data 에 piggyback 될 수 있다"],
      [9, 12.5, "종료도 three-way: FIN → FIN + ACK → ACK"],
      [12.5, D, "SYN · SYN+ACK · FIN 은 번호 1 개씩 쓰고, 순수 ACK 는 번호를 쓰지 않는다"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 24, c[2], 14, C.ink, ' font-weight="700"')); });

    s += '<rect x="95" y="40" width="110" height="28" rx="4" fill="' + C.aL + '" stroke="' + C.a + '"/>' + txt(XL, 59, "Client", 14, C.ink, ' font-weight="700"');
    s += '<rect x="555" y="40" width="110" height="28" rx="4" fill="' + C.gL + '" stroke="' + C.g + '"/>' + txt(XR, 59, "Server", 14, C.ink, ' font-weight="700"');
    s += '<line x1="' + XL + '" y1="68" x2="' + XL + '" y2="360" stroke="#999"/><line x1="' + XR + '" y1="68" x2="' + XR + '" y2="360" stroke="#999"/>';
    s += vis(0, D, txt(70, 90, "active open", 11, C.a));
    s += vis(0, D, txt(690, 90, "passive open", 11, C.g));

    s += arrow(1, 92, "① SYN  seq = 8000", 1.5, 3, C.a);
    s += arrow(-1, 132, "② SYN + ACK  seq = 15000, ack = 8001", 3.5, 5, C.a);
    s += arrow(1, 172, "③ ACK  seq = 8001, ack = 15001", 5.5, 7, C.a);
    s += vis(7, D, '<rect x="40" y="206" width="680" height="2" fill="' + C.g + '"/>' + txt(690, 200, "연결 열림", 12, C.g, ' font-weight="700"'));
    s += arrow(1, 214, "data  seq = 8001 …", 7.5, 8.3, C.g);
    s += arrow(-1, 238, "data + ACK (piggyback)", 8.1, 8.9, C.g);
    s += arrow(1, 270, "FIN  seq = x", 9, 10, C.red);
    s += arrow(-1, 298, "FIN + ACK  seq = y, ack = x + 1", 10.2, 11.2, C.red);
    s += arrow(1, 326, "ACK  seq = x + 1, ack = y + 1", 11.4, 12.4, C.red);
    s += vis(12.4, D, txt(70, 374, "connection closed", 11, C.red) + txt(690, 374, "connection closed", 11, C.red));
    s += '</svg>';
    return s;
  }
};
