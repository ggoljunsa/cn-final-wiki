// ============================================================
// mux_demux_anim — L16 p.4, p.9–14: IP address 는 host 를, port number 는 process 를 고른다
//   0–2 Host A 의 P1·P2·P3 (port 52000·53100·61000) 가 메시지 → 2–4.5 multiplexer 가 하나의 transport 로 모아 IP 로
//   → 4.5–7 network layer 가 Host B 로 (host-to-host) → 7–10 demultiplexer 가 destination port(13·53·80)로 나눔 → 10–12 결과
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["mux_demux_anim"] = {
  title: "Multiplexing · demultiplexing — IP 는 host, port 는 process 를 고른다 (12초)",
  desc: "sender 의 transport layer 는 여러 process 의 메시지를 받아 하나로 내보내고(multiplexing), receiver 의 transport layer 는 destination port 를 보고 알맞은 process 에 나눠 준다(demultiplexing). [[multiplexing과 demultiplexing]] · [[port number]] · [[process-to-process delivery]]",
  duration: 12,
  build: function () {
    var D = 12;
    var C = { a: "#1d65b3", aL: "#dbe8f7", g: "#2e9e4f", gL: "#dff3e4", o: "#e09a40", oL: "#fdeec2", r: "#3b2f4a", rL: "#efe9f6", red: "#d6465f", muted: "#777", ink: "#222" };
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
    // 점 (x,y) 들을 시간 t 들에 지나가는 작은 봉투
    function mover(pts, times, col, label) {
      var kt = times.map(function (t) { return r4(t / D); });
      var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
      var keyTimes = "0;" + kt.join(";") + ";1";
      var s = '<g opacity="0"><rect x="-22" y="-10" width="44" height="20" rx="3" fill="' + col + '" stroke="#555"/>';
      s += '<text x="0" y="4" font-size="10" text-anchor="middle" fill="#fff" font-weight="700">' + label + '</text>';
      var pv = [pts[0]].concat(pts, [pts[pts.length - 1]]).map(function (p) { return p[0] + " " + p[1]; }).join(";");
      s += '<animateTransform attributeName="transform" type="translate" values="' + pv + '" keyTimes="' + keyTimes + '" dur="' + D + 's" fill="freeze" calcMode="linear"/>';
      s += show(times[0], times[times.length - 1] + 0.3) + '</g>';
      return s;
    }
    var s = '<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="multiplexing demultiplexing 애니메이션">';
    s += '<rect x="0" y="0" width="760" height="360" fill="#fff"/>';
    [
      [0, 2, "Host A 의 process 세 개가 각자 메시지를 만든다 (client: ephemeral port)"],
      [2, 4.5, "multiplexing: transport layer 가 여러 process 의 메시지를 받아 header(port) 를 붙여 내려보낸다"],
      [4.5, 7, "network layer 는 IP address 로 host 까지만 데려다준다 (host-to-host)"],
      [7, 10, "demultiplexing: Host B 의 transport layer 가 destination port 를 보고 알맞은 process 에 준다"],
      [10, D, "IP address 는 host 를, port number 는 그 host 안의 process 를 고른다"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 24, c[2], 13, C.ink, ' font-weight="700"')); });

    function host(x, name, procs, col, colL) {
      var t = '<rect x="' + x + '" y="50" width="220" height="250" rx="8" fill="#fafafa" stroke="#bbb"/>' + txt(x + 110, 70, name, 14, C.ink, ' font-weight="700"');
      procs.forEach(function (p, i) {
        var px = x + 20 + i * 66;
        t += '<rect x="' + px + '" y="84" width="54" height="40" rx="4" fill="' + colL + '" stroke="' + col + '"/>' + txt(px + 27, 102, p[0], 12, C.ink, ' font-weight="700"') + txt(px + 27, 117, p[1], 10, C.muted);
      });
      t += '<rect x="' + (x + 20) + '" y="170" width="180" height="34" rx="4" fill="' + C.oL + '" stroke="' + C.o + '"/>' + txt(x + 110, 192, "Transport layer", 12);
      t += '<rect x="' + (x + 20) + '" y="246" width="180" height="34" rx="4" fill="' + C.rL + '" stroke="' + C.r + '"/>' + txt(x + 110, 268, "IP (network layer)", 12);
      return t;
    }
    s += host(30, "Host A (client) 10.0.0.5", [["P1", "52000"], ["P2", "53100"], ["P3", "61000"]], C.a, C.aL);
    s += host(510, "Host B (server) 200.23.56.8", [["Daytime", "13"], ["DNS", "53"], ["HTTP", "80"]], C.g, C.gL);
    s += '<line x1="250" y1="263" x2="510" y2="263" stroke="#999" stroke-width="2" stroke-dasharray="6 4"/>' + txt(380, 255, "network: host to host", 11, C.muted);
    s += vis(2, 4.5, txt(140, 225, "Multiplexer", 12, C.o, ' font-weight="700"'));
    s += vis(7, 10.5, txt(620, 225, "Demultiplexer", 12, C.o, ' font-weight="700"'));

    var cols = [C.a, "#7a5cc0", "#c0563a"];
    var srcX = [77, 143, 209], dstX = [557, 623, 689], dports = ["→13", "→53", "→80"];
    for (var i = 0; i < 3; i++) {
      var d0 = i * 0.35;
      s += mover([[srcX[i], 130], [140, 187], [140, 263], [620, 263], [620, 187], [dstX[i], 130]],
        [0.6 + d0, 2.6 + d0, 4.3 + d0, 6.8 + d0, 8.0 + d0, 9.4 + d0], cols[i], dports[i]);
    }
    s += vis(9.8, D, txt(620, 150, "dst port 로 골라 줌", 11, C.g, ' font-weight="700"'));
    s += '<text x="380" y="340" font-size="12" fill="#777" text-anchor="middle">socket address = IP address + port number (예: 200.23.56.8 : 13)</text>';
    s += '</svg>';
    return s;
  }
};
