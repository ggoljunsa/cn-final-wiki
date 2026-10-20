// cdma_walsh — CDMA 4 스테이션 예제 (Forouzan 보충: 슬라이드 p.27 의 code1…codeN 그림을 수치로)
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  var C = [[1, 1, 1, 1], [1, -1, 1, -1], [1, 1, -1, -1], [1, -1, -1, 1]];
  var D = [-1, -1, 0, 1];
  var BITLABEL = ["bit 0", "bit 0", "silent", "bit 1"];
  var COL = ["#1d65b3", "#2e9e4f", "#999999", "#d6465f"];

  function sg(x) { return x > 0 ? "+" + x : (x < 0 ? "−" + (-x) : "0"); }
  function vec(v) { return "[" + v.map(sg).join(" ") + "]"; }
  function mul(a, b) { return a.map(function (x, i) { return x * b[i]; }); }

  // rows: [{label, v, color, hl}] — chip 막대 그림
  function makeSvg(rows, caption) {
    return function () {
      var rowH = 52, W = 560, x0 = 150, cw = 80;
      var H = 24 + rows.length * rowH + 24;
      var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">';
      for (var j = 0; j < 4; j++) {
        s += '<text x="' + (x0 + j * cw + cw / 2) + '" y="14" text-anchor="middle" fill="#777">chip ' + (j + 1) + "</text>";
      }
      rows.forEach(function (r, i) {
        var yMid = 24 + i * rowH + rowH / 2;
        var unit = 7;   // px per 1
        s += '<rect x="2" y="' + (yMid - rowH / 2 + 2) + '" width="' + (W - 4) + '" height="' + (rowH - 4) + '" rx="4" fill="' + (r.hl ? "#fff3bf" : "#fafafa") + '" stroke="' + (r.hl ? "#d6a017" : "#eee") + '"/>';
        s += '<text x="10" y="' + (yMid + 4) + '" font-weight="700" fill="' + r.color + '">' + r.label + "</text>";
        s += '<line x1="' + x0 + '" y1="' + yMid + '" x2="' + (x0 + 4 * cw) + '" y2="' + yMid + '" stroke="#bbb"/>';
        r.v.forEach(function (val, j) {
          var h = Math.abs(val) * unit * (r.scale || 3);
          var y = val >= 0 ? yMid - h : yMid;
          if (val !== 0) s += '<rect x="' + (x0 + j * cw + 8) + '" y="' + y + '" width="' + (cw - 16) + '" height="' + h + '" fill="' + r.color + '" opacity="0.8"/>';
          s += '<text x="' + (x0 + j * cw + cw / 2) + '" y="' + (val >= 0 ? yMid + 13 : yMid - 4) + '" text-anchor="middle" font-size="10" fill="#222">' + sg(val) + "</text>";
        });
        if (r.right) s += '<text x="' + (x0 + 4 * cw + 10) + '" y="' + (yMid + 4) + '" fill="#222">' + r.right + "</text>";
      });
      if (caption) s += '<text x="10" y="' + (H - 6) + '" fill="#333">' + caption + "</text>";
      return s + "</svg>";
    };
  }

  global.SIMS["cdma_walsh"] = {
    title: "CDMA — Walsh code 4개로 4 스테이션 동시 전송·복원",
    desc: "Forouzan 보충 (슬라이드에 수치 없음): p.27 의 'code1, code2, …, codeN' 그림을 4 스테이션 수치 예제로. 각 스테이션이 데이터 d_i 에 자기 [[Walsh code]] c_i 를 곱해 동시에 보내면 채널에서 chip 별로 더해진다. 수신자는 합에 c_i 를 곱해 더하고 4 로 나누면 d_i 만 남는다 — 코드끼리 직교(orthogonal)이기 때문. [[CDMA]] · [[DSSS]] · [[spread spectrum]].",
    options: [
      { key: "k", label: "복원할 스테이션", values: [
        { value: "1", label: "스테이션 1 (d1 = −1, bit 0)" },
        { value: "2", label: "스테이션 2 (d2 = −1, bit 0)" },
        { value: "3", label: "스테이션 3 (d3 = 0, silent)" },
        { value: "4", label: "스테이션 4 (d4 = +1, bit 1)" }
      ] }
    ],
    build: function (opts) {
      var k = parseInt(opts.k || "1", 10) - 1;
      var prods = D.map(function (d, i) { return C[i].map(function (c) { return d * c; }); });
      var sum = [0, 1, 2, 3].map(function (j) { return prods.reduce(function (a, p) { return a + p[j]; }, 0); });
      var rx = mul(sum, C[k]);
      var inner = rx.reduce(function (a, b) { return a + b; }, 0);
      var dk = inner / 4;
      var bit = dk > 0 ? "bit 1" : (dk < 0 ? "bit 0" : "silent");
      var K = k + 1;

      var lines = [
        "Walsh code: c1=[+1 +1 +1 +1] c2=[+1 −1 +1 −1] c3=[+1 +1 −1 −1] c4=[+1 −1 −1 +1]",
        "직교성: c_i·c_j = 0 (i≠j), c_i·c_i = 4",
        "데이터: bit 0 → −1, bit 1 → +1, silent → 0  ⇒ d = [−1, −1, 0, +1]",
        "d1·c1 = " + vec(prods[0]),
        "d2·c2 = " + vec(prods[1]),
        "d3·c3 = " + vec(prods[2]),
        "d4·c4 = " + vec(prods[3]),
        "채널 합 (chip 별 덧셈) = " + vec(sum),
        "수신자 " + K + ": 합 × c" + K + " (chip 별 곱) = " + vec(rx),
        "내적 = " + rx.map(sg).join(" ") + " = " + sg(inner),
        "d" + K + " = " + sg(inner) + " ÷ 4 = " + sg(dk) + " → " + bit
      ];
      var vars = [
        { name: "codes", label: "Walsh code", group: "준비" },
        { name: "data", label: "d (−1/0/+1)", group: "준비" },
        { name: "p1", label: "d1·c1", group: "송신 (각 스테이션)" },
        { name: "p2", label: "d2·c2", group: "송신 (각 스테이션)" },
        { name: "p3", label: "d3·c3", group: "송신 (각 스테이션)" },
        { name: "p4", label: "d4·c4", group: "송신 (각 스테이션)" },
        { name: "sum", label: "채널 합", group: "채널" },
        { name: "rx", label: "합 × c" + K, group: "수신자 " + K },
        { name: "inner", label: "내적", group: "수신자 " + K },
        { name: "dk", label: "복원 d" + K, group: "수신자 " + K }
      ];
      var st = { codes: "4 chips × 4", data: "-", p1: "-", p2: "-", p3: "-", p4: "-", sum: "-", rx: "-", inner: "-", dk: "?" };
      var steps = [];
      function push(desc, pc, rows, cap, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(rows, cap) });
      }
      function codeRows(hl) {
        return C.map(function (c, i) { return { label: "c" + (i + 1), v: c, color: COL[i], hl: hl === i }; });
      }
      function prodRows(n, hl) {
        var r = [];
        for (var i = 0; i < n; i++) r.push({ label: "d" + (i + 1) + "·c" + (i + 1), v: prods[i], color: COL[i], hl: hl === i, right: "d" + (i + 1) + " = " + sg(D[i]) });
        return r;
      }

      push("각 스테이션에 '''4 chips''' 짜리 [[Walsh code]] 를 하나씩 준다. 슬라이드 p.27 의 code1, code2, …, codeN 이 바로 이것.", 1, codeRows(-1), "Walsh code 4개 (chip 값 ±1)");
      push("직교성 확인: 예) c1·c2 = (+1)(+1)+(+1)(−1)+(+1)(+1)+(+1)(−1) = 0, c2·c2 = 1+1+1+1 = 4. '''다른 코드끼리 내적 0, 자기 자신과는 4'''.", 2, codeRows(1), "c2 강조: c2·c2 = 4, c2·c(다른 것) = 0");
      st.data = "[−1, −1, 0, +1]";
      push("데이터 규칙: bit 0 → '''−1''', bit 1 → '''+1''', 보낼 게 없으면(silent) '''0'''. 스테이션 1·2 는 bit 0, 3 은 silent, 4 는 bit 1 → d = [−1, −1, 0, +1].", 3, codeRows(-1), "d1 = −1, d2 = −1, d3 = 0, d4 = +1");
      var pkeys = ["p1", "p2", "p3", "p4"];
      for (var i = 0; i < 4; i++) {
        st[pkeys[i]] = vec(prods[i]);
        var why = i === 0 ? "d1 = −1 이므로 c1 의 부호를 전부 뒤집는다."
          : i === 1 ? "d2 = −1 → c2 를 뒤집음."
          : i === 2 ? "d3 = 0 → 전부 0. silent 스테이션은 채널에 아무것도 더하지 않는다."
          : "d4 = +1 → c4 그대로.";
        push("스테이션 " + (i + 1) + " 송신: d" + (i + 1) + "·c" + (i + 1) + " = " + sg(D[i]) + " × " + vec(C[i]) + " = '''" + vec(prods[i]) + "'''. " + why, 4 + i, prodRows(i + 1, i), "송신 신호 (chip 별)");
      }
      st.sum = vec(sum);
      var sumRows = prodRows(4, -1).concat([{ label: "채널 합", v: sum, color: "#6b3fa0", hl: true, scale: 1.4 }]);
      push("네 신호가 '''동시에 같은 대역'''으로 나가 채널에서 chip 별로 더해진다: chip1 = −1−1+0+1 = −1, chip2 = −1+1+0−1 = −1, chip3 = −1−1+0−1 = −3, chip4 = −1+1+0+1 = +1 → '''" + vec(sum) + "'''.", 8, sumRows, "채널 = 모든 송신 신호의 chip 별 합");
      st.rx = vec(rx);
      var rxRows = [
        { label: "채널 합", v: sum, color: "#6b3fa0", scale: 1.4 },
        { label: "× c" + K, v: C[k], color: COL[k] },
        { label: "곱", v: rx, color: "#d6a017", hl: true, scale: 1.4 }
      ];
      push("수신자 " + K + " 는 자기 코드 c" + K + " = " + vec(C[k]) + " 를 합에 chip 별로 곱한다 → '''" + vec(rx) + "'''.", 9, rxRows, "수신자 " + K + ": 합 × c" + K);
      st.inner = inner;
      push("곱한 4 값을 더한다(내적): " + rx.map(function (x, j) { return j === 0 ? sg(x) : (x < 0 ? "− " + (-x) : "+ " + x); }).join(" ") + " = '''" + sg(inner) + "'''. 다른 스테이션 몫은 직교성 때문에 0 으로 사라지고 d" + K + " × 4 만 남는다.", 10, rxRows, "내적 = " + sg(inner));
      st.dk = sg(dk) + " (" + bit + ")";
      push("4(= chip 수 = c_i·c_i)로 나누면 '''d" + K + " = " + sg(dk) + "''' → " + bit + ". 보낸 값(" + sg(D[k]) + ", " + BITLABEL[k] + ")과 정확히 같다.", 11,
        rxRows.concat([{ label: "d" + K, v: [dk, dk, dk, dk], color: COL[k], hl: true, right: sg(dk) + " = " + bit }]), "복원 완료: d" + K + " = " + sg(dk),
        "핵심: 같은 시간·같은 주파수를 쓰는데도 분리되는 이유는 '''코드의 직교성'''. 이것이 [[CDMA]] 가 FDMA·TDMA 와 다른 점이다 (Forouzan 보충).");

      return { panels: [{ id: "P", title: "손으로 푸는 순서", lang: "txt", lines: lines }], vars: vars, steps: steps };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
