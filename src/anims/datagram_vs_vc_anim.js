// ============================================================
// datagram_vs_vc_anim — L12 p.20–26
//   위: datagram 방식 — 1·2·3·4 가 패킷마다 다른 경로 → 2 4 1 3 순서로 도착 (out of order)
//   아래: virtual circuit — setup(경로·VCI) → 같은 경로로 1 2 3 4 (in order) → teardown
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["datagram_vs_vc_anim"] = {
  title: "Datagram vs. virtual circuit — 같은 메시지 1–4 가 가는 두 가지 방법 (14초)",
  desc: "위: [[datagram approach]] (connectionless) — 라우터가 패킷마다 '''destination address''' 로 따로 결정해 경로가 제각각, 도착 순서가 뒤섞인다. 아래: [[virtual-circuit approach]] (connection-oriented) — setup 으로 길을 먼저 정하고 '''[[VCI]]''' 를 단 패킷이 같은 길로 순서대로, 끝나면 teardown.",
  duration: 14,
  build: function () {
    var D = 14;
    var C = { a: "#1d65b3", aL: "#dbe8f7", r: "#3b2f4a", rL: "#efe9f6", red: "#d6465f", muted: "#777", ink: "#222", vc: "#1d9bd6", g: "#2e9e4f" };
    var PK = { 1: ["#fff", "#333", "#222"], 2: ["#f3a33c", "#a8661a", "#222"], 3: ["#5bc0eb", "#1d6f99", "#222"], 4: ["#222", "#000", "#fff"] };
    function r2(v) { return Math.round(v * 100) / 100; }
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var f = 0.12 / D, a = r4(from / D), b = r4(Math.min(from / D + f, (from + to) / 2 / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, to / D - f)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }
    function pkt(k, path, start, dur) {
      var c = PK[k];
      var g = '<g>' +
        '<rect x="-9" y="-9" width="18" height="18" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="1.3"/>' +
        txt(0, 5, String(k), 12, c[2], ' font-weight="700"') +
        '<animateMotion path="' + path + '" begin="' + start + 's" dur="' + dur + 's" fill="freeze"/></g>';
      return vis(start, start + dur, g);
    }

    // 망 하나 그리기 (dy = 세로 이동)
    function net(dy) {
      var P = { S: [60, 115 + dy], R1: [170, 115 + dy], R2: [320, 72 + dy], R3: [320, 158 + dy], R4: [470, 115 + dy], D: [600, 115 + dy] };
      var E = [["S", "R1"], ["R1", "R2"], ["R1", "R4"], ["R1", "R3"], ["R2", "R4"], ["R3", "R4"], ["R4", "D"]];
      var g = '';
      E.forEach(function (e) {
        g += '<line x1="' + P[e[0]][0] + '" y1="' + P[e[0]][1] + '" x2="' + P[e[1]][0] + '" y2="' + P[e[1]][1] + '" stroke="#bbb" stroke-width="2"/>';
      });
      ["R1", "R2", "R3", "R4"].forEach(function (k) {
        g += '<ellipse cx="' + P[k][0] + '" cy="' + P[k][1] + '" rx="21" ry="12" fill="' + C.rL + '" stroke="' + C.r + '" stroke-width="1.5"/>' + txt(P[k][0], P[k][1] + 4, k, 11, C.r, ' font-weight="700"');
      });
      g += '<rect x="20" y="' + (P.S[1] - 15) + '" width="62" height="30" rx="4" fill="' + C.aL + '" stroke="' + C.a + '"/>' + txt(51, P.S[1] + 5, "Sender", 12, C.a, ' font-weight="700"');
      g += '<rect x="580" y="' + (P.D[1] - 15) + '" width="70" height="30" rx="4" fill="' + C.aL + '" stroke="' + C.a + '"/>' + txt(615, P.D[1] + 5, "Receiver", 12, C.a, ' font-weight="700"');
      return { svg: g, P: P };
    }
    function pathOf(P, list) {
      return list.map(function (k, i) { return (i ? "L" : "M") + P[k][0] + "," + P[k][1]; }).join(" ");
    }

    var s = '<svg viewBox="0 0 760 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="datagram 방식과 virtual circuit 방식 비교 애니메이션">';

    // ---- 자막 ----
    [
      [0, 1, "같은 메시지 = datagram 1 2 3 4. 두 가지 packet switching 으로 보낸다"],
      [1, 5, "위 — Datagram: 라우터가 패킷마다 destination address 로 따로 결정 → 경로가 제각각"],
      [5, 7.6, "도착 순서 2 4 1 3 — packets may arrive out of order (connectionless)"],
      [7.6, 9, "아래 — Virtual circuit ① setup: 경로 R1 → R3 → R4 를 먼저 정한다"],
      [9, 12.2, "② data transfer: 모두 같은 flow label(VCI)·같은 경로 → 1 2 3 4 순서대로"],
      [12.2, D, "③ teardown: 경로를 지운다. 인터넷의 IP 는 위쪽(datagram) 방식"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 24, c[2], 14, C.ink, ' font-weight="700"')); });

    // ---- 위: datagram ----
    var top = net(0);
    s += '<rect x="8" y="38" width="744" height="152" rx="8" fill="none" stroke="#ddd"/>';
    s += txt(16, 56, "Datagram (connectionless) — router decides by destination address", 12, C.ink, ' text-anchor="start" font-weight="700"');
    s += top.svg;
    var routes = { 1: ["S", "R1", "R3", "R4", "D"], 2: ["S", "R1", "R4", "D"], 3: ["S", "R1", "R2", "R4", "D"], 4: ["S", "R1", "R4", "D"] };
    // 시작·소요 (도착: 2@5.0, 4@6.2, 1@7.0, 3@7.6)
    var T = { 1: [1.0, 6.0], 2: [1.6, 3.4], 3: [2.2, 5.4], 4: [2.8, 3.4] };
    [1, 2, 3, 4].forEach(function (k) { s += pkt(k, pathOf(top.P, routes[k]), T[k][0], T[k][1]); });
    s += vis(1.2, 7.6, txt(170, 92, "DA = B ?", 11, C.red, ' font-weight="700"'));
    // 도착 칸
    s += txt(700, 100, "도착 순서", 11, C.muted);
    var order = [2, 4, 1, 3];
    order.forEach(function (k, i) {
      var t = T[k][0] + T[k][1], c = PK[k];
      s += vis(t, D, '<rect x="' + (664 + i * 19) + '" y="108" width="17" height="17" fill="' + c[0] + '" stroke="' + c[1] + '"/>' + txt(672.5 + i * 19, 121, String(k), 11, c[2], ' font-weight="700"'));
    });
    s += vis(7.6, D, txt(700, 146, "out of order ✗", 12, C.red, ' font-weight="700"'));

    // ---- 아래: virtual circuit ----
    var bot = net(150);
    s += '<rect x="8" y="188" width="744" height="152" rx="8" fill="none" stroke="#ddd"/>';
    s += txt(16, 206, "Virtual circuit (connection-oriented) — router decides by label (VCI)", 12, C.ink, ' text-anchor="start" font-weight="700"');
    var vcList = ["S", "R1", "R3", "R4", "D"];
    var vcPath = pathOf(bot.P, vcList);
    // 경로 띠: setup 에 나타나고 teardown 에 흐려짐
    s += '<path d="' + vcPath + '" fill="none" stroke="' + C.vc + '" stroke-width="12" stroke-linejoin="round" opacity="0">' +
      '<animate attributeName="opacity" values="0;0;0.55;0.55;0.08;0.08" keyTimes="0;' + r4(7.6 / D) + ';' + r4(8.8 / D) + ';' + r4(12.2 / D) + ';' + r4(13 / D) + ';1" dur="' + D + 's" fill="freeze"/></path>';
    s += bot.svg;
    // VCI 라벨 (Forouzan 보충: 링크마다 바뀜)
    var vci = [14, 66, 22, 77];
    var lab = '';
    for (var i = 0; i < 4; i++) {
      var a = bot.P[vcList[i]], b = bot.P[vcList[i + 1]];
      var x = r2((a[0] + b[0]) / 2), y = r2((a[1] + b[1]) / 2 + 22);
      lab += '<rect x="' + (x - 24) + '" y="' + (y - 11) + '" width="48" height="15" rx="3" fill="#fff3bf" stroke="#d6a017"/>' + txt(x, y + 1, "VCI " + vci[i], 10, C.ink, ' font-weight="700"');
    }
    s += vis(8.2, 12.6, lab);
    s += vis(7.6, 9, txt(250, 236, "setup →", 12, C.vc, ' font-weight="700"'));
    [1, 2, 3, 4].forEach(function (k) { s += pkt(k, vcPath, 9 + (k - 1) * 0.45, 1.7); });
    s += txt(700, 250, "도착 순서", 11, C.muted);
    [1, 2, 3, 4].forEach(function (k, i) {
      var t = 9 + (k - 1) * 0.45 + 1.7, c = PK[k];
      s += vis(t, D, '<rect x="' + (664 + i * 19) + '" y="258" width="17" height="17" fill="' + c[0] + '" stroke="' + c[1] + '"/>' + txt(672.5 + i * 19, 271, String(k), 11, c[2], ' font-weight="700"'));
    });
    s += vis(12.05, D, txt(700, 296, "in order ✓", 12, C.g, ' font-weight="700"'));
    s += vis(12.6, D, txt(470, 326, "teardown — virtual circuit 삭제", 12, C.red, ' font-weight="700"'));

    // ---- 요점 ----
    s += txt(380, 362, "요점: datagram = destination address·경로 제각각·out of order / VC = label(VCI)·같은 경로·in order", 13, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
