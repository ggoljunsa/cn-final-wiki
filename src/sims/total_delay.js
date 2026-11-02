// total_delay — L12 p.28–33: Delay_tr = L/R, Delay_pg = d/s, Total = (n+1)(tr+pg+pr) + n·qu
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  function fx(x, d) { return String(Number(x.toFixed(d))); }
  function us(sec) { return fx(sec * 1e6, 3) + " μs"; }
  function ms(sec) { return fx(sec * 1e3, 3) + " ms"; }

  // 모든 값은 python 으로 검산 (CONTRACT §6 total_delay 행)
  var CASES = {
    slide: {
      name: "p.30 예제 확장 — 링크 1개 (n = 0)", n: 0,
      L: 8000, Ltxt: "8,000 bits (1,000 bytes, 가정)",
      R: 100e6, Rtxt: "100 Mbps (가정, Fast Ethernet 급)",
      d: 2000, dtxt: "2,000 m (슬라이드)", s: 2e8, stxt: "2 × 10^8 m/s (슬라이드)",
      pr: 0, prtxt: "0 (무시)", qu: 0, qutxt: "— (라우터 없음)",
      unit: us, linksMul: 1, prMul: 1, quMul: 0, wrong: false
    },
    routers: {
      name: "라우터 n = 3 개 경로 (예시 수치)", n: 3,
      L: 8000, Ltxt: "8,000 bits", R: 10e6, Rtxt: "10 Mbps",
      d: 200e3, dtxt: "200 km (링크마다)", s: 2e8, stxt: "2 × 10^8 m/s",
      pr: 50e-6, prtxt: "50 μs", qu: 2e-3, qutxt: "2 ms",
      unit: ms, linksMul: 4, prMul: 4, quMul: 3, wrong: false
    },
    trap_qu: {
      name: "함정 ① — queuing 을 n + 1 번 셈", n: 3,
      L: 8000, Ltxt: "8,000 bits", R: 10e6, Rtxt: "10 Mbps",
      d: 200e3, dtxt: "200 km (링크마다)", s: 2e8, stxt: "2 × 10^8 m/s",
      pr: 50e-6, prtxt: "50 μs", qu: 2e-3, qutxt: "2 ms",
      unit: ms, linksMul: 4, prMul: 4, quMul: 4, wrong: "qu"
    },
    trap_links: {
      name: "함정 ② — 링크를 n 개로 셈", n: 3,
      L: 8000, Ltxt: "8,000 bits", R: 10e6, Rtxt: "10 Mbps",
      d: 200e3, dtxt: "200 km (링크마다)", s: 2e8, stxt: "2 × 10^8 m/s",
      pr: 50e-6, prtxt: "50 μs", qu: 2e-3, qutxt: "2 ms",
      unit: ms, linksMul: 3, prMul: 3, quMul: 3, wrong: "links"
    }
  };

  // 경로 그림: Source — R1 … Rn — Dest, 현재 단계에 따라 강조
  function makeSvg(c, level) {
    return function () {
      var W = 640, H = 210;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">';
      var nodes = ["Source"];
      for (var i = 1; i <= c.n; i++) nodes.push("R" + i);
      nodes.push("Dest.");
      var N = nodes.length, x0 = 60, x1 = 580, y = 90;
      var gap = (x1 - x0) / (N - 1);
      // 링크
      for (var k = 0; k < N - 1; k++) {
        var xa = x0 + k * gap, xb = x0 + (k + 1) * gap;
        var miss = c.wrong === "links" && k === N - 2 && level >= 3;
        var on = level === 1 || level === 2 || level >= 4;
        var col = miss ? "#d6465f" : (on ? "#1d65b3" : "#999");
        s += '<line x1="' + (xa + 30) + '" y1="' + y + '" x2="' + (xb - 30) + '" y2="' + y + '" stroke="' + col + '" stroke-width="' + (on ? 3 : 2) + '"' + (miss ? ' stroke-dasharray="5 4"' : '') + '/>';
        s += '<text x="' + ((xa + xb) / 2) + '" y="' + (y - 10) + '" text-anchor="middle" fill="' + col + '" font-size="11">link ' + (k + 1) + (miss ? " (빠뜨림 ✗)" : "") + '</text>';
        if (level === 1 || level === 2) {
          s += '<text x="' + ((xa + xb) / 2) + '" y="' + (y + 22) + '" text-anchor="middle" fill="#1d65b3" font-size="10">' + (level === 1 ? "tr" : "tr+pg") + '</text>';
        }
      }
      // 노드
      nodes.forEach(function (nm, j) {
        var x = x0 + j * gap;
        var isR = nm.charAt(0) === "R";
        if (isR) {
          var hlQ = level === 3 || level >= 4;
          s += '<circle cx="' + x + '" cy="' + y + '" r="24" fill="#fff3bf" stroke="#d6a017" stroke-width="1.5"/>';
          s += '<text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-weight="700">' + nm + '</text>';
          if (hlQ) s += '<text x="' + x + '" y="' + (y + 44) + '" text-anchor="middle" fill="#e09a40" font-size="11">qu + pr</text>';
        } else {
          s += '<rect x="' + (x - 34) + '" y="' + (y - 18) + '" width="68" height="36" rx="4" fill="#dbe8f7" stroke="#1d65b3"/>';
          s += '<text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-weight="700">' + nm + '</text>';
          if (nm === "Dest." && level >= 3) {
            var extraQ = c.wrong === "qu";
            s += '<text x="' + x + '" y="' + (y + 44) + '" text-anchor="middle" fill="' + (extraQ ? "#d6465f" : "#e09a40") + '" font-size="11">' + (extraQ ? "pr + qu ✗" : "pr") + '</text>';
          }
        }
      });
      // 요약
      var nl = c.n + 1;
      s += '<text x="20" y="168" fill="#333">라우터 n = ' + c.n + ' → 링크 n + 1 = ' + nl + ' 개 · processing ' + nl + ' 번(라우터 ' + c.n + ' + 목적지 1) · queuing ' + c.n + ' 번(라우터만)</text>';
      s += '<text x="20" y="192" fill="#777" font-size="11">(Assume equal delays at the sender, routers, and receiver — p.32)</text>';
      s += '</svg>';
      return s;
    };
  }

  global.SIMS["total_delay"] = {
    title: "Total delay — 네 가지 지연과 (n + 1)·n 공식 (L12 p.28–33)",
    desc: "[[transmission delay]] = L / R, [[propagation delay]] = d / s 를 구한 뒤 [[total delay 공식]] (n+1)(tr + pg + pr) + n·qu 로 합친다. [[queuing delay]] 는 '''라우터 n 개에서만''' 생긴다. 예시 수치는 슬라이드 p.30 의 2,000 m · 2×10^8 m/s 를 빼면 가정값이다.",
    options: [
      { key: "case", label: "예제", values: [
        { value: "slide", label: "p.30 예제 확장 (n = 0, 2,000 m)" },
        { value: "routers", label: "라우터 n = 3 (예시)" },
        { value: "trap_qu", label: "함정 ①: queuing 을 n+1 번" },
        { value: "trap_links", label: "함정 ②: 링크를 n 개로" }
      ] }
    ],
    build: function (opts) {
      var key = opts["case"] || "slide";
      var c = CASES[key];
      var U = c.unit;
      var tr = c.L / c.R, pg = c.d / c.s;
      var per = tr + pg + c.pr;
      var right = (c.n + 1) * per + c.n * c.qu;
      var got = c.linksMul * (tr + pg) + c.prMul * c.pr + c.quMul * c.qu;

      var lines = [
        "Delay_tr = (Packet length) / (Transmission rate) = L / R",
        "Delay_pg = (Distance) / (Propagation speed) = d / s",
        "Delay_pr, Delay_qu = 주어진 값 (router·host 안)",
        "링크 수 = n + 1, processing 횟수 = n + 1, queuing 횟수 = n",
        "Total = (n+1)(Delay_tr + Delay_pg + Delay_pr) + n · Delay_qu"
      ];
      var vars = [
        { name: "L", label: "Packet length L", group: "입력" },
        { name: "R", label: "Transmission rate R", group: "입력" },
        { name: "d", label: "Distance d", group: "입력" },
        { name: "s", label: "Propagation speed s", group: "입력" },
        { name: "n", label: "라우터 수 n", group: "입력" },
        { name: "tr", label: "Delay_tr", group: "지연" },
        { name: "pg", label: "Delay_pg", group: "지연" },
        { name: "pr", label: "Delay_pr", group: "지연" },
        { name: "qu", label: "Delay_qu", group: "지연" },
        { name: "total", label: "Total delay", group: "결과" }
      ];
      var st = { L: c.Ltxt, R: c.Rtxt, d: c.dtxt, s: c.stxt, n: String(c.n), tr: "?", pg: "?", pr: c.prtxt, qu: c.qutxt, total: "?" };
      var steps = [];
      function push(desc, pc, level, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(c, level) });
      }

      push("'''" + c.name + "'''. 경로에 라우터가 n = " + c.n + " 개 있다. 네 가지 지연(transmission · propagation · processing · queuing)을 하나씩 구해 합친다.", null, 0);
      st.tr = U(tr);
      push("[[transmission delay]] = 패킷의 '''모든 비트를 링크에 밀어 넣는''' 시간 = L / R = " + c.L + " / " + c.R.toExponential(0).replace("e+", "×10^") + " = '''" + U(tr) + "'''. 패킷이 길수록, 링크가 느릴수록 길다.", 1, 1);
      st.pg = U(pg);
      push("[[propagation delay]] = '''비트 하나가''' 링크를 건너는 시간 = d / s = " + c.d + " m / (2×10^8 m/s) = '''" + U(pg) + "'''. 거리에만 달렸다 — 비트 수와 무관(교수 44:50 \"because it is about distance\").", 2, 2);
      if (c.n === 0) {
        push("라우터가 없으니(n = 0) [[queuing delay]] 는 0 번, processing 은 목적지 1 번(여기서는 0 으로 둠). 링크는 n + 1 = 1 개.", 4, 3);
      } else {
        push("링크는 '''n + 1 = " + (c.n + 1) + "''' 개 → tr·pg 를 " + (c.n + 1) + " 번. processing 은 라우터 " + c.n + " + 목적지 1 = '''" + (c.n + 1) + "''' 번. queuing 은 '''라우터에서만 " + c.n + "''' 번 (교수 50:43 \"queuing delay is involved with routers, not with source and destination\").", 4, 3,
          c.wrong === "qu" ? "함정 ①: 목적지에서도 queuing 을 한 번 더 세면 Delay_qu 가 하나 남는다." :
          c.wrong === "links" ? "함정 ②: 라우터 수 = 링크 수로 착각하면 마지막 링크(Rn → Dest.) 하나를 빠뜨린다." : undefined);
      }
      var formula, calc;
      if (c.wrong === "qu") {
        formula = "(✗) (n+1)(tr + pg + pr + qu) = 4 × (" + U(tr) + " + " + U(pg) + " + " + U(c.pr) + " + " + U(c.qu) + ")";
      } else if (c.wrong === "links") {
        formula = "(✗) n(tr + pg + pr) + n·qu = 3 × " + U(per) + " + 3 × " + U(c.qu);
      } else if (c.n === 0) {
        formula = "(0+1)(" + U(tr) + " + " + U(pg) + " + 0) + 0";
      } else {
        formula = "(3+1) × (" + U(tr) + " + " + U(pg) + " + " + U(c.pr) + ") + 3 × " + U(c.qu) + " = 4 × " + U(per) + " + " + U(3 * c.qu);
      }
      st.total = U(got) + (c.wrong ? " ✗" : "");
      calc = c.wrong
        ? "틀린 계산: " + formula + " = '''" + U(got) + "'''. 정답은 (n+1)(tr+pg+pr) + n·qu = '''" + U(right) + "'''."
        : "[[total delay 공식]]: " + formula + " = '''" + U(right) + "'''.";
      push(calc, 5, 4,
        c.wrong === "qu" ? "차이 " + U(got - right) + " = Delay_qu 하나. 목적지(destination)에는 queuing 이 없다." :
        c.wrong === "links" ? "차이 " + U(right - got) + " = 링크 하나의 tr + pg + pr. n 개 라우터 사이와 양 끝을 합치면 링크는 n + 1 개." :
        c.n === 0 ? "transmission (80 μs) 이 propagation (10 μs) 보다 8 배 크다 — 짧은 케이블에서는 비트를 밀어내는 시간이 지배한다." :
        "가장 큰 항은 queuing 3 × 2 ms = 6 ms. 트래픽이 늘면 이 항이 커진다 → [[load와 성능]].");

      return {
        panels: [{ id: "P", title: "공식 (p.29–33)", lang: "txt", lines: lines }],
        vars: vars,
        steps: steps
      };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
