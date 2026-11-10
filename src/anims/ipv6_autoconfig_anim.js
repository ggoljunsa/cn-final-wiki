// ============================================================
// ipv6_autoconfig_anim — L14 p.13–21 Autoconfiguration (Example 7.29 숫자)
//   시간축(초): 0 MAC 만 앎 → 2 interface ID → 4 link-local + unique 확인 → 6 RS → 8 RA(prefix+subnet)
//   → 10 global unicast address 완성 → 13
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["ipv6_autoconfig_anim"] = {
  title: "IPv6 autoconfiguration — MAC 에서 global 주소까지 (13초)",
  desc: "host 가 서버 없이 ① MAC 으로 [[interface ID]] ② FE80:: 를 붙여 [[link-local address]] ③ [[router solicitation과 advertisement|router solicitation → advertisement]] 로 prefix + subnet ID 를 받아 [[global unicast address]] 를 완성한다. 숫자는 [[Example 7.29]].",
  duration: 13,
  build: function () {
    var D = 13;
    var C = { a: "#1d65b3", aL: "#dbe8f7", r: "#3b2f4a", rL: "#efe9f6", y: "#e09a40", yL: "#fdeec2", g: "#2e9e4f", gL: "#dff3e4", red: "#d6465f", muted: "#777", ink: "#222" };
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

    var s = '<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IPv6 autoconfiguration 애니메이션">';
    s += '<defs><marker id="ac_ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="' + C.muted + '"/></marker></defs>';
    [
      [0, 2, "host 가 network 에 붙었다. 아는 것은 자기 MAC 주소 F5-A9-23-11-9B-E2 뿐이다"],
      [2, 4, "① MAC 으로 interface ID: 7번째 bit 뒤집기(F5 → F7) + 가운데 FFFE"],
      [4, 6, "② FE80:: 뒤에 붙여 link-local address, link 에서 unique 한지 확인"],
      [6, 8, "③ link-local 주소로 router solicitation (\"prefix 가 뭔가요?\")"],
      [8, 10, "④ router advertisement: global prefix 3A21:1216:2165 + subnet ID 1232"],
      [10, D, "⑤ prefix + subnet ID 뒤에 interface ID 를 붙이면 global unicast address"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 24, c[2], 14, C.ink, ' font-weight="700"')); });

    // host, router
    s += box(30, 60, 190, 96, C.aL, C.a, 8) + txt(125, 82, "Host", 15, C.a, ' font-weight="700"');
    s += txt(125, 104, "MAC F5-A9-23-11-9B-E2", 12, C.ink, ' font-family="monospace"');
    s += box(560, 60, 170, 96, C.yL, C.y, 8) + txt(645, 82, "Router", 15, "#a5650f", ' font-weight="700"');
    s += txt(645, 106, "prefix 3A21:1216:2165", 11, C.ink, ' font-family="monospace"') + txt(645, 124, "subnet 1232", 11, C.ink, ' font-family="monospace"');
    s += '<line x1="220" y1="108" x2="560" y2="108" stroke="#bbb" stroke-width="2" stroke-dasharray="5 4"/>';
    s += txt(390, 100, "같은 link", 11, C.muted);

    // host 안쪽 줄: interface ID
    s += vis(2, D, txt(125, 124, "IID F7A9:23FF:FE11:9BE2", 12, C.red, ' font-family="monospace" font-weight="700"'));
    // link-local
    s += vis(4, D, txt(125, 144, "FE80::F7A9:23FF:FE11:9BE2", 11, C.g, ' font-family="monospace" font-weight="700"'));
    s += vis(4.8, 6.5, txt(258, 148, "unique ✓", 12, C.g, ' font-weight="700"'));

    // RS: host → router
    var rs = '<g>' + box(-62, -13, 124, 26, "#fff", C.a, 12) + txt(0, 4, "Router solicitation", 11, C.a, ' font-weight="700"') +
      '<animateMotion path="M 290 80 L 490 80" begin="6s" dur="1.6s" fill="freeze"/></g>';
    s += vis(6, 8.2, rs);
    // RA: router → host
    var ra = '<g>' + box(-92, -13, 184, 26, "#fff", C.y, 12) + txt(0, 4, "RA: 3A21:1216:2165 : 1232", 11, "#a5650f", ' font-weight="700" font-family="monospace"') +
      '<animateMotion path="M 460 138 L 320 138" begin="8s" dur="1.6s" fill="freeze"/></g>';
    s += vis(8, 10.3, ra);

    // global unicast address 막대
    var gx = 60, gy = 200;
    s += vis(10, D,
      box(gx, gy, 230, 40, C.yL, C.y) + txt(gx + 115, gy + 25, "3A21:1216:2165", 14, C.ink, ' font-family="monospace" font-weight="700"') +
      txt(gx + 115, gy + 58, "global prefix 48 bits (router)", 11, C.muted));
    s += vis(10.5, D,
      box(gx + 230, gy, 90, 40, C.gL, C.g) + txt(gx + 275, gy + 25, "1232", 14, C.ink, ' font-family="monospace" font-weight="700"') +
      txt(gx + 275, gy + 58, "subnet 16 (router)", 11, C.muted));
    s += vis(11, D,
      box(gx + 320, gy, 320, 40, C.aL, C.a) + txt(gx + 480, gy + 25, "F7A9:23FF:FE11:9BE2", 14, C.ink, ' font-family="monospace" font-weight="700"') +
      txt(gx + 480, gy + 58, "interface ID 64 bits (host 가 직접)", 11, C.muted));
    // 2–10 초 동안은 같은 자리에 "아직 모름"
    s += vis(2, 10, box(gx, gy, 320, 40, "#f4f4f4", "#bbb") + txt(gx + 160, gy + 25, "prefix + subnet ID = ? (host 는 모름)", 12, C.muted) +
      box(gx + 320, gy, 320, 40, C.aL, C.a) + txt(gx + 480, gy + 25, "F7A9:23FF:FE11:9BE2", 14, C.ink, ' font-family="monospace" font-weight="700"'));

    s += txt(380, 326, "요점: interface ID 는 host 가 스스로, prefix + subnet ID 는 router 가 알려 준다 (DHCP 서버 없음)", 13, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
