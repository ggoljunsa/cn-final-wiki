// cidr_block — L13 p.11–19: address/n 하나로 block 의 세 가지 정보(N, first, last)를 구한다.
//   N = 2^(32−n), first = address AND mask, last = address OR NOT(mask), NOT(mask)+1 = N
//   모든 값은 python ipaddress 로 검산 (CONTRACT §1 L13 "검산된 수치")
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  function toInt(dotted) {
    return dotted.split(".").reduce(function (acc, b) { return acc * 256 + Number(b); }, 0);
  }
  function toDotted(x) {
    var out = [];
    for (var i = 3; i >= 0; i--) out.push(Math.floor(x / Math.pow(256, i)) % 256);
    return out.join(".");
  }
  function bits32(x) {
    var s = "";
    for (var i = 31; i >= 0; i--) s += Math.floor(x / Math.pow(2, i)) % 2;
    return s;
  }
  function grouped(b) { return b.slice(0, 8) + " " + b.slice(8, 16) + " " + b.slice(16, 24) + " " + b.slice(24, 32); }
  function maskInt(n) { return n === 0 ? 0 : (Math.pow(2, 32) - Math.pow(2, 32 - n)); }
  // 비트 단위 AND/OR (32비트 전체를 문자열로 — JS 비트 연산은 부호 있는 32비트라 피한다)
  function bitAnd(a, b) { var x = bits32(a), y = bits32(b), s = ""; for (var i = 0; i < 32; i++) s += (x[i] === "1" && y[i] === "1") ? "1" : "0"; return parseInt(s, 2); }
  function bitOr(a, b) { var x = bits32(a), y = bits32(b), s = ""; for (var i = 0; i < 32; i++) s += (x[i] === "1" || y[i] === "1") ? "1" : "0"; return parseInt(s, 2); }
  function bitNot(a) { var x = bits32(a), s = ""; for (var i = 0; i < 32; i++) s += x[i] === "1" ? "0" : "1"; return parseInt(s, 2); }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  var CASES = {
    ex71: { addr: "167.199.170.82", n: 27, name: "Example 7.1 (p.12–16) — 167.199.170.82/27" },
    ex73_20: { addr: "230.8.24.56", n: 20, name: "Example 7.3 (p.19) — 230.8.24.56/20" },
    ex73_27: { addr: "230.8.24.56", n: 27, name: "Example 7.3 (p.19) — 230.8.24.56/27", trap: "first" },
    ex73_31: { addr: "230.8.24.56", n: 31, name: "Example 7.3 (p.19) — 230.8.24.56/31" },
    ex74: { addr: "18.14.12.0", n: 22, name: "Example 7.4 (p.22) — 18.14.12.0/22 (ISP 1000 → 1024)" },
    slash25: { addr: "220.8.24.255", n: 25, name: "p.10 slash notation 예 — 220.8.24.255/25", trap: "last" }
  };

  // 32 칸 비트 그림: 행마다 prefix(파랑)/suffix(주황) 구분, 현재 단계 행 강조
  function makeSvg(c, rows, n, hl) {
    return function () {
      var W = 700, cw = 18, x0 = 150, H = 40 + rows.length * 34 + 30;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="12">';
      s += '<text x="' + (x0 + n * cw / 2) + '" y="18" text-anchor="middle" fill="#1d65b3" font-family="sans-serif" font-weight="700">prefix n = ' + n + '</text>';
      if (n < 32) s += '<text x="' + (x0 + n * cw + (32 - n) * cw / 2) + '" y="18" text-anchor="middle" fill="#c27a12" font-family="sans-serif" font-weight="700">suffix ' + (32 - n) + '</text>';
      rows.forEach(function (r, k) {
        var y = 30 + k * 34, b = bits32(r.v), on = hl.indexOf(r.key) >= 0;
        s += '<text x="' + (x0 - 8) + '" y="' + (y + 16) + '" text-anchor="end" font-family="sans-serif" font-weight="' + (on ? 700 : 400) + '" fill="' + (on ? "#222" : "#888") + '">' + r.label + '</text>';
        for (var i = 0; i < 32; i++) {
          var x = x0 + i * cw + Math.floor(i / 8) * 0;
          var pre = i < n;
          var fill = on ? (pre ? "#dbe8f7" : "#fdeec2") : "#f4f4f4";
          s += '<rect x="' + x + '" y="' + y + '" width="' + (cw - 1) + '" height="22" fill="' + fill + '" stroke="' + (i % 8 === 7 ? "#555" : "#ccc") + '"/>';
          s += '<text x="' + (x + cw / 2 - 0.5) + '" y="' + (y + 15) + '" text-anchor="middle" fill="' + (on ? (pre ? "#1d65b3" : "#c27a12") : "#999") + '">' + b[i] + '</text>';
        }
        s += '<text x="' + (x0 + 32 * cw + 8) + '" y="' + (y + 16) + '" font-family="sans-serif" fill="' + (on ? "#222" : "#999") + '">' + toDotted(r.v) + '</text>';
      });
      s += '<line x1="' + (x0 + n * cw - 0.5) + '" y1="24" x2="' + (x0 + n * cw - 0.5) + '" y2="' + (30 + rows.length * 34) + '" stroke="#d6465f" stroke-width="2" stroke-dasharray="4 3"/>';
      s += '<text x="10" y="' + (H - 8) + '" font-family="sans-serif" fill="#777" font-size="11">빨간 점선 = prefix | suffix 경계. AND 는 suffix 를 0 으로, OR NOT(mask) 는 suffix 를 1 로 만든다.</text>';
      s += '</svg>';
      return s;
    };
  }

  global.SIMS["cidr_block"] = {
    title: "CIDR block 계산 — address/n → N, first, last, mask (L13 p.11–22)",
    desc: "[[slash notation]] 의 주소 하나와 prefix length n 만으로 [[block의 세 가지 정보]] 를 구한다: $N = 2^{32-n}$, first = address AND [[address mask|mask]], last = address OR NOT(mask). Example 7.1 · 7.3 · 7.4 의 값은 슬라이드와 같고 python 으로 검산했다.",
    options: [
      { key: "case", label: "예제", values: [
        { value: "ex71", label: "Ex 7.1 — 167.199.170.82/27" },
        { value: "ex73_20", label: "Ex 7.3 — 230.8.24.56/20" },
        { value: "ex73_27", label: "Ex 7.3 — 230.8.24.56/27 (함정: 주어진 주소 ≠ first)" },
        { value: "ex73_31", label: "Ex 7.3 — 230.8.24.56/31" },
        { value: "ex74", label: "Ex 7.4 — 18.14.12.0/22" },
        { value: "slash25", label: "p.10 — 220.8.24.255/25 (함정: 주어진 주소가 last)" }
      ] }
    ],
    build: function (opts) {
      var c = CASES[opts["case"] || "ex71"];
      var n = c.n, A = toInt(c.addr), M = maskInt(n), NM = bitNot(M);
      var N = Math.pow(2, 32 - n), F = bitAnd(A, M), L = bitOr(A, NM);
      var lines = [
        "주소를 2진수 32비트로 (바이트마다 8비트)",
        "앞 n 비트 = prefix (network), 뒤 32 − n 비트 = suffix (node)",
        "① N = 2^(32 − n)",
        "mask = 앞 n 개 1 + 뒤 (32 − n) 개 0",
        "② first = address AND mask  (suffix 를 전부 0)",
        "③ last  = address OR NOT(mask)  (suffix 를 전부 1)",
        "검산: NOT(mask) + 1 = N,  first 는 N 으로 나누어떨어진다"
      ];
      var vars = [
        { name: "addr", label: "주어진 주소", group: "입력" },
        { name: "n", label: "prefix length n", group: "입력" },
        { name: "bin", label: "2진수", group: "비트" },
        { name: "split", label: "prefix | suffix", group: "비트" },
        { name: "N", label: "① N (주소 수)", group: "결과" },
        { name: "mask", label: "address mask", group: "결과" },
        { name: "first", label: "② first (network address)", group: "결과" },
        { name: "last", label: "③ last", group: "결과" },
        { name: "check", label: "검산", group: "결과" }
      ];
      var st = { addr: c.addr, n: "/" + n, bin: "?", split: "?", N: "?", mask: "?", first: "?", last: "?", check: "?" };
      var rowsA = [{ key: "a", label: "address", v: A }];
      var rowsAM = rowsA.concat([{ key: "m", label: "mask", v: M }]);
      var rowsAll = rowsAM.concat([{ key: "f", label: "AND → first", v: F }, { key: "nm", label: "NOT(mask)", v: NM }, { key: "l", label: "OR → last", v: L }]);
      var steps = [];
      function push(desc, pc, rows, hl, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(c, rows, n, hl) });
      }
      var bin = grouped(bits32(A));
      push("'''" + c.name + "'''. [[slash notation]] 은 address/n — 주소만으로는 block 을 알 수 없으니 prefix length n 을 같이 준다(p.19 \"Always give the prefix length\").", null, rowsA, []);
      st.bin = bin;
      push("[[dotted-decimal notation]] 의 네 바이트를 각각 8비트 2진수로: " + c.addr + " → `" + bin + "`.", 1, rowsA, ["a"]);
      var b = bits32(A);
      st.split = b.slice(0, n) + " | " + b.slice(n);
      push("앞 '''n = " + n + "''' 비트가 [[prefix와 suffix|prefix]](어느 network), 뒤 '''32 − " + n + " = " + (32 - n) + "''' 비트가 suffix(그 안의 어느 node). 손필기 p.12: \"←27→ ←5→\".", 2, rowsA, ["a"]);
      st.N = "2^(32−" + n + ") = 2^" + (32 - n) + " = " + fmt(N);
      push("① 주소 수 $N = 2^{32-n} = 2^{" + (32 - n) + "}$ = '''" + fmt(N) + "'''. suffix 비트 " + (32 - n) + " 개로 만들 수 있는 경우의 수다.", 3, rowsA, ["a"]);
      st.mask = toDotted(M);
      push("[[address mask]] = 앞 " + n + " 비트 1, 뒤 " + (32 - n) + " 비트 0 → '''" + toDotted(M) + "'''. (/27 이면 255.255.255.224 — p.17)", 4, rowsAM, ["m"],
        n % 8 ? "함정: mask 마지막 바이트를 '" + n + "' 로 쓰면 틀린다. 1 이 " + (n % 8) + " 개인 바이트 = " + parseInt("11111111".slice(0, n % 8) + "00000000".slice(n % 8), 2) + "." : undefined);
      st.first = toDotted(F) + "/" + n;
      push("② first = address '''AND''' mask: prefix 는 그대로, suffix 는 전부 0 → '''" + toDotted(F) + "/" + n + "'''. 이것이 [[network address]] — 라우터가 block 을 가리킬 때 쓰는 값.", 5, rowsAll.slice(0, 3), ["a", "m", "f"],
        c.trap === "first" ? "함정: 주어진 주소 230.8.24.56 이 block 의 시작이 아니다. /27 에서는 .32 부터 시작한다(56 = 00111000 → suffix 5비트를 0 으로 = 00100000 = 32)." : undefined);
      st.last = toDotted(L) + "/" + n;
      push("③ last = address '''OR''' NOT(mask): NOT(mask) 는 suffix 만 1 → OR 하면 suffix 가 전부 1 → '''" + toDotted(L) + "/" + n + "'''.", 6, rowsAll, ["a", "nm", "l"],
        c.trap === "last" ? "함정: 220.8.24.255/25 는 block 의 '''마지막''' 주소다. first 는 220.8.24.128, 주소 128 개." : undefined);
      var div = F % N === 0;
      st.check = "NOT(mask)+1 = " + fmt(NM) + "+1 = " + fmt(NM + 1) + (NM + 1 === N ? " ✓" : " ✗") + " · first " + fmt(F) + " ÷ " + fmt(N) + " = " + fmt(F / N) + (div ? " ✓" : " ✗");
      push("검산: NOT(mask) + 1 = " + fmt(NM) + " + 1 = '''" + fmt(N) + "''' = N ✓ (p.18 표). 그리고 first 를 정수로 보면 " + fmt(F) + " = " + fmt(N) + " × " + fmt(F / N) + " — '''N 으로 나누어떨어진다'''(p.21 CIDR block 규칙). Block: '''" + toDotted(F) + "/" + n + " ~ " + toDotted(L) + "/" + n + "''' (" + fmt(N) + " addresses).", 7, rowsAll, ["f", "l"]);
      return { panels: [{ id: "P", title: "손으로 푸는 순서 (p.11, p.18)", lang: "txt", lines: lines }], vars: vars, steps: steps };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
