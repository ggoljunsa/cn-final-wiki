// ============================================================
// encap_decap — L12 p.7–9 Packetizing
//   Source: encapsulate(header 붙이기) → R1·R2: header 만 읽음(decapsulate 안 함)
//   → Destination: decapsulate → upper layer. 마지막: 유일한 예외 fragmentation
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["encap_decap"] = {
  title: "Packetizing — source 는 encapsulate, router 는 header 만, destination 은 decapsulate (14초)",
  desc: "[[packetizing]]: payload 를 '''바꾸지도 쓰지도 않고''' 나른다. source 가 header 를 붙이고(encapsulate), [[mid:라우터|router]] 는 header 만 읽어 next hop 을 고르며, destination 이 header 를 뗀다(decapsulate). 예외는 [[fragmentation]] 하나.",
  duration: 14,
  build: function () {
    var D = 14;
    var C = { a: "#1d65b3", aL: "#dbe8f7", r: "#3b2f4a", rL: "#efe9f6", h: "#d6a017", hL: "#fff3bf", red: "#d6465f", muted: "#777", ink: "#222", g: "#2e9e4f" };
    function r4(v) { return Math.round(v * 10000) / 10000; }
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
    function kt(times) { return times.map(function (t) { return r4(t / D); }).join(";"); }
    function box(x, y, w, h, fill, stroke, extra) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.3"' + (extra || "") + '/>';
    }

    var s = '<svg viewBox="0 0 760 350" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="packetizing: encapsulation과 decapsulation 애니메이션">';
    s += '<defs><marker id="ed_ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + C.a + '"/></marker></defs>';

    // ---- 자막 ----
    [
      [0, 1.5, "Source host 의 network layer 가 위(transport)에서 payload 를 받는다"],
      [1.5, 3.5, "Source: encapsulate — header(source·destination address + control info)를 붙인다"],
      [3.5, 6, "Router R1: decapsulate 하지 않는다 — header 만 읽고 next hop 을 고른다"],
      [6, 8, "Router R2: 역시 reads the header only — payload 는 바꾸지도 쓰지도 않는다"],
      [8, 10, "Destination: decapsulate — header 를 떼고 payload 를 upper layer 로"],
      [10, D, "유일한 예외: fragmentation — 너무 큰 패킷을 나누고 header 를 각 fragment 에 복사"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 26, c[2], 14, C.ink, ' font-weight="700"')); });

    // ---- 노드: host 는 5계층, router 는 3계층 ----
    var X = [90, 290, 490, 680];
    var NAMES = ["Source host", "Router R1", "Router R2", "Destination host"];
    var LAY = ["Application", "Transport", "Network", "Data-link", "Physical"];
    X.forEach(function (x, i) {
      var host = i === 0 || i === 3;
      s += txt(x, 52, NAMES[i], 13, host ? C.a : C.r, ' font-weight="700"');
      LAY.forEach(function (nm, k) {
        if (!host && k < 2) return;
        var y = 60 + k * 19;
        var net = k === 2;
        s += box(x - 50, y, 100, 17, net ? (host ? C.aL : C.rL) : "#fafafa", net ? (host ? C.a : C.r) : "#bbb");
        s += txt(x, y + 13, nm, 11, net ? C.ink : C.muted, net ? ' font-weight="700"' : "");
      });
    });
    // 링크
    for (var i = 0; i < 3; i++) {
      s += '<line x1="' + (X[i] + 50) + '" y1="' + 145 + '" x2="' + (X[i + 1] - 50) + '" y2="' + 145 + '" stroke="#999" stroke-width="2"/>';
    }

    // ---- 패킷 (x = 0 기준으로 그리고 translate 로 이동) ----
    var PX = X[0] - 35, PY = 182, HW = 46, PW = 74;
    var pk = '<g>';
    // payload
    pk += box(PX, PY, PW, 26, "#fff", "#555");
    pk += txt(PX + PW / 2, PY + 17, "Payload", 12, C.ink);
    // payload 회색 덮개 (router 에서 "안 봄")
    pk += vis(4.7, 6, box(PX, PY, PW, 26, "#e6e6e6", "#aaa") + txt(PX + PW / 2, PY + 17, "Payload", 12, "#999"));
    pk += vis(7, 8, box(PX, PY, PW, 26, "#e6e6e6", "#aaa") + txt(PX + PW / 2, PY + 17, "Payload", 12, "#999"));
    // header: 1.5–3.5 왼쪽에서 들어와 붙고, 9–10 에 떨어져 사라짐
    var hd = '<g opacity="0">';
    hd += box(PX - HW, PY, HW, 26, C.hL, C.h);
    hd += txt(PX - HW / 2, PY + 17, "Header", 11, C.ink, ' font-weight="700"');
    hd += vis(4.7, 6, '<rect x="' + (PX - HW - 3) + '" y="' + (PY - 3) + '" width="' + (HW + 6) + '" height="32" rx="4" fill="none" stroke="' + C.red + '" stroke-width="2.5"/>');
    hd += vis(7, 8, '<rect x="' + (PX - HW - 3) + '" y="' + (PY - 3) + '" width="' + (HW + 6) + '" height="32" rx="4" fill="none" stroke="' + C.red + '" stroke-width="2.5"/>');
    hd += '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="' + kt([0, 1.5, 2.2, 9, 9.8, D]) + '" dur="' + D + 's" fill="freeze"/>';
    hd += '<animateTransform attributeName="transform" type="translate" values="-50,-30;-50,-30;0,0;0,0;-30,-38;-30,-38" keyTimes="' + kt([0, 1.5, 3.2, 9, 9.8, D]) + '" dur="' + D + 's" fill="freeze"/>';
    hd += '</g>';
    pk += hd;
    // 이동: source → R1 → R2 → destination, 10 이후 사라짐 (fragmentation 장면)
    pk += '<animateTransform attributeName="transform" type="translate" values="0,0;0,0;200,0;200,0;400,0;400,0;590,0;590,0;590,0;590,0" keyTimes="' + kt([0, 3.5, 4.6, 6, 7, 8, 9, 9.8, 10.6, D]) + '" dur="' + D + 's" fill="freeze"/>';
    pk += '<animate attributeName="opacity" values="1;1;0;0" keyTimes="' + kt([0, 10.6, 11, D]) + '" dur="' + D + 's" fill="freeze"/>';
    pk += '</g>';
    s += pk;

    // router 아래 설명
    s += vis(4.7, 6, txt(X[1], 232, "reads the header only", 12, C.red, ' font-weight="700"') + txt(X[1], 248, "(DA 를 보고 next hop 결정)", 11, C.muted));
    s += vis(7, 8, txt(X[2], 232, "reads the header only", 12, C.red, ' font-weight="700"') + txt(X[2], 248, "payload 는 그대로", 11, C.muted));
    s += vis(1.5, 3.5, txt(X[0], 232, "encapsulate (add a header)", 12, C.a, ' font-weight="700"'));
    s += vis(9, 11, txt(X[3] - 50, 232, "decapsulate (remove the header)", 12, C.a, ' font-weight="700"'));
    s += vis(9.8, 11.5, '<line x1="' + (X[3] + 60) + '" y1="175" x2="' + (X[3] + 60) + '" y2="105" stroke="' + C.a + '" stroke-width="2" marker-end="url(#ed_ar)"/>' + txt(X[3] + 64, 100, "to upper layer", 11, C.a, ' text-anchor="end"'));

    // ---- 예외: fragmentation (10–14) ----
    var fx = 180, fy = 262;
    var fr = '';
    fr += txt(fx - 10, fy + 18, "큰 패킷", 12, C.muted, ' text-anchor="end"');
    fr += box(fx, fy, 40, 26, C.hL, C.h) + txt(fx + 20, fy + 17, "H", 12, C.ink, ' font-weight="700"');
    fr += box(fx + 40, fy, 150, 26, "#fff", "#555") + txt(fx + 115, fy + 17, "Payload (too large)", 11, C.ink);
    s += vis(10.3, D, fr);
    s += vis(11.3, D, '<line x1="' + (fx + 200) + '" y1="' + (fy + 13) + '" x2="' + (fx + 236) + '" y2="' + (fy + 13) + '" stroke="' + C.r + '" stroke-width="2" marker-end="url(#ed_ar)"/>' + txt(fx + 218, fy - 4, "router", 11, C.r));
    var f2 = '';
    [0, 1].forEach(function (k) {
      var x = fx + 245 + k * 130;
      f2 += box(x, fy, 40, 26, C.hL, C.h) + txt(x + 20, fy + 17, "H′", 12, C.ink, ' font-weight="700"');
      f2 += box(x + 40, fy, 75, 26, "#fff", "#555") + txt(x + 77, fy + 17, "frag " + (k + 1), 11, C.ink);
    });
    s += vis(11.6, D, f2);
    s += vis(12.2, D, txt(fx + 365, fy + 44, "header is copied to every fragment, with a few changes", 11, C.red));

    // ---- 요점 ----
    s += txt(380, 340, "요점: routers do not decapsulate — 유일한 예외는 fragmentation (packet too large)", 13, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
