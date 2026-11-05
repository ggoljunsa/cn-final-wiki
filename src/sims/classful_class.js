// classful_class — L13 p.6–7: 첫 바이트의 leading bits 로 class A–E 판별, prefix·network 수·주소 수
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  var CLASSES = [
    { c: "A", lead: "0", n: 8, nets: "2^7 = 128", per: "2^24 = 16,777,216", range: "0 – 127", share: "2^31 = 50%" },
    { c: "B", lead: "10", n: 16, nets: "2^14 = 16,384", per: "2^16 = 65,536", range: "128 – 191", share: "2^30 = 25%" },
    { c: "C", lead: "110", n: 24, nets: "2^21 = 2,097,152", per: "2^8 = 256", range: "192 – 223", share: "2^29 = 12.5%" },
    { c: "D", lead: "1110", n: null, nets: "Multicast", per: "–", range: "224 – 239", share: "2^28 = 6.25%" },
    { c: "E", lead: "1111", n: null, nets: "Reserved", per: "–", range: "240 – 255", share: "2^28 = 6.25%" }
  ];
  function b8(x) { var s = x.toString(2); while (s.length < 8) s = "0" + s; return s; }
  function classOf(fb) {
    var b = b8(fb);
    for (var i = 0; i < CLASSES.length; i++) if (b.indexOf(CLASSES[i].lead) === 0) return CLASSES[i];
    return CLASSES[4];
  }

  function makeSvg(fb, upto) {
    return function () {
      var b = b8(fb), cls = classOf(fb), L = cls.lead.length;
      var s = '<svg viewBox="0 0 620 150" width="620" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">';
      s += '<text x="20" y="22" font-weight="700">첫 바이트 ' + fb + ' = </text>';
      for (var i = 0; i < 8; i++) {
        var lead = upto >= 1 && i < L;
        s += '<rect x="' + (140 + i * 30) + '" y="6" width="28" height="26" fill="' + (lead ? "#fdeec2" : "#f4f4f4") + '" stroke="' + (lead ? "#c27a12" : "#bbb") + '"/>';
        s += '<text x="' + (154 + i * 30) + '" y="24" text-anchor="middle" font-family="monospace" font-weight="' + (lead ? 700 : 400) + '">' + b[i] + '</text>';
      }
      // 0–255 축 위에 class 구간
      var x0 = 20, w = 580, sc = w / 256;
      var segs = [[0, 128, "A", "#dbe8f7"], [128, 64, "B", "#fdeec2"], [192, 32, "C", "#efe0cf"], [224, 16, "D", "#fff6a8"], [240, 16, "E", "#e6e6e6"]];
      segs.forEach(function (g) {
        var on = upto >= 2 && g[2] === cls.c;
        s += '<rect x="' + (x0 + g[0] * sc) + '" y="60" width="' + (g[1] * sc) + '" height="30" fill="' + g[3] + '" stroke="' + (on ? "#d6465f" : "#999") + '" stroke-width="' + (on ? 3 : 1) + '"/>';
        s += '<text x="' + (x0 + (g[0] + g[1] / 2) * sc) + '" y="80" text-anchor="middle" font-weight="700">' + g[2] + '</text>';
        s += '<text x="' + (x0 + g[0] * sc) + '" y="106" text-anchor="middle" font-size="10" fill="#666">' + g[0] + '</text>';
      });
      s += '<text x="' + (x0 + w) + '" y="106" text-anchor="end" font-size="10" fill="#666">255</text>';
      var px = x0 + (fb + 0.5) * sc;
      s += '<path d="M' + px + ',56 l-6,-10 l12,0 z" fill="#d6465f"/>';
      s += '<text x="20" y="136" fill="#777" font-size="11">첫 바이트 구간: A 0–127 · B 128–191 · C 192–223 · D 224–239 · E 240–255 (p.6–7)</text>';
      s += '</svg>';
      return s;
    };
  }

  var ADDRS = {
    a: "12.24.76.8", b: "128.11.3.31", c: "200.1.1.1", d: "230.8.24.56", e: "245.10.0.1", edge: "191.255.0.1"
  };

  global.SIMS["classful_class"] = {
    title: "Classful addressing — 첫 바이트로 class 판별 (L13 p.6–7)",
    desc: "[[classful addressing]] 에서는 주소의 '''처음 몇 비트(leading bits)'''가 class 를 정하고, class 가 prefix 길이(8/16/24)를 정한다. 첫 바이트 → 2진수 → leading bits → class → network 수·network 당 주소 수.",
    options: [
      { key: "addr", label: "주소", values: [
        { value: "a", label: "12.24.76.8 (p.10 예)" },
        { value: "b", label: "128.11.3.31 (p.4 예)" },
        { value: "c", label: "200.1.1.1 (p.3 라우터)" },
        { value: "d", label: "230.8.24.56 (Ex 7.3)" },
        { value: "e", label: "245.10.0.1" },
        { value: "edge", label: "191.255.0.1 (경계)" }
      ] }
    ],
    build: function (opts) {
      var a = ADDRS[opts.addr || "a"], fb = Number(a.split(".")[0]), cls = classOf(fb);
      var lines = [
        "첫 바이트를 8비트 2진수로",
        "앞에서부터 leading bits 확인: 0 → A, 10 → B, 110 → C, 1110 → D, 1111 → E",
        "class 의 prefix 길이: A 8, B 16, C 24, D·E 없음",
        "# of networks = 2^(prefix − leading bits 수)",
        "addresses / network = 2^(32 − prefix)"
      ];
      var vars = [
        { name: "addr", label: "주소", group: "입력" },
        { name: "bin", label: "첫 바이트 2진수", group: "판별" },
        { name: "cls", label: "class", group: "판별" },
        { name: "n", label: "prefix", group: "결과" },
        { name: "nets", label: "# of networks", group: "결과" },
        { name: "per", label: "addresses / network", group: "결과" },
        { name: "share", label: "주소 공간 비율", group: "결과" }
      ];
      var st = { addr: a, bin: "?", cls: "?", n: "?", nets: "?", per: "?", share: "?" };
      var steps = [];
      function push(desc, pc, upto, note) { steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(fb, upto) }); }
      st.bin = b8(fb);
      push("주소 '''" + a + "''' 의 첫 바이트 " + fb + " 를 2진수로: `" + b8(fb) + "`.", 1, 0);
      st.cls = cls.c + " (leading " + cls.lead + ")";
      push("앞에서부터 읽으면 leading bits '''" + cls.lead + "''' → '''class " + cls.c + "''' (첫 바이트 " + cls.range + ").", 2, 1,
        opts.addr === "edge" ? "경계: 191 = 10111111 은 아직 '10' 으로 시작 → B. 192 = 11000000 부터 C." : undefined);
      st.n = cls.n ? "/" + cls.n : "Not applicable";
      push(cls.n ? "class " + cls.c + " 의 prefix 는 '''" + cls.n + " 비트''' (classful 에서는 고정 — p.6 \"three fixed prefix lengths\")." : "class " + cls.c + " 는 prefix 가 없다(Not applicable) — " + (cls.c === "D" ? "multicast 주소" : "reserved for future use") + ".", 3, 2);
      st.nets = cls.nets;
      push(cls.n ? "# of networks = $2^{" + cls.n + " - " + cls.lead.length + "}$ = " + cls.nets + ". leading bits 가 prefix 의 일부를 차지해서 network ID 에 남는 비트가 줄어든다 (p.7 \"Why 2^7 and not 2^8?\")." : "# of networks: " + cls.nets + ".", 4, 2);
      st.per = cls.per; st.share = cls.share;
      push(cls.n ? "network 당 주소 = $2^{32 - " + cls.n + "}$ = '''" + cls.per + "'''. class " + cls.c + " 전체는 주소 공간의 " + cls.share + "." : "class " + cls.c + " 는 주소 공간의 " + cls.share + " (= 첫 바이트 16 개 × 2^24).", 5, 2,
        cls.c === "A" ? "class A 는 network 하나가 1,677만 주소 → too big (p.8 address depletion)." : cls.c === "C" ? "class C 는 network 하나가 256 주소 → too small (p.8)." : undefined);
      return { panels: [{ id: "P", title: "class 판별 (p.7 표)", lang: "txt", lines: lines }], vars: vars, steps: steps };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
