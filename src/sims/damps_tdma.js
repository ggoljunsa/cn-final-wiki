// damps_tdma — L10 p.22–23 AMPS vs D-AMPS Transmission: 3 사용자 → digitize → TDMA → QPSK → FDMA 30 kHz 채널
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  function fmt(x, d) { return String(Number(x.toFixed(d === undefined ? 3 : d))); }

  var UCOL = ["#f5e663", "#9fd66b", "#8fd0e8"];

  function arrow(x1, y1, x2, y2, on) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (on ? "#333" : "#ccc") + '" stroke-width="1.5" marker-end="url(#da' + (on ? "1" : "0") + ')"/>';
  }
  function box(x, y, w, h, label, on, hl, fill) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="' + (on ? fill : "#f2f2f2") + '" stroke="' + (hl ? "#d6465f" : (on ? "#555" : "#ccc")) + '" stroke-width="' + (hl ? 2.5 : 1) + '"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4) + '" text-anchor="middle" fill="' + (on ? "#222" : "#aaa") + '">' + label + "</text>";
  }
  function defs() {
    return '<defs><marker id="da1" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#333"/></marker>' +
      '<marker id="da0" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#ccc"/></marker></defs>';
  }
  // FDMA 채널 띠: 832 개 중 몇 개만 그림, 첫 칸 강조
  function fdma(x, y, on, hl, label) {
    var s = '<rect x="' + (x - 6) + '" y="' + (y - 22) + '" width="200" height="74" fill="' + (on ? "#e6e6e6" : "#f6f6f6") + '" stroke="' + (hl ? "#d6465f" : "#999") + '" stroke-dasharray="4,3" stroke-width="' + (hl ? 2 : 1) + '"/>';
    s += '<text x="' + (x + 94) + '" y="' + (y - 9) + '" text-anchor="middle" font-size="10" fill="' + (on ? "#333" : "#aaa") + '">FDMA — 25 MHz band, 832 × 30 kHz</text>';
    for (var i = 0; i < 7; i++) {
      var cx = x + i * 27;
      var mine = i === 0 && on;
      s += '<path d="M' + cx + "," + (y + 30) + " Q" + cx + "," + (y + 8) + " " + (cx + 11) + "," + (y + 8) + " Q" + (cx + 22) + "," + (y + 8) + " " + (cx + 22) + "," + (y + 30) + ' z" fill="' + (mine ? "#ff6a3d" : "#fff") + '" stroke="#777" stroke-dasharray="' + (mine ? "" : "3,2") + '"/>';
      if (i === 4) s += '<text x="' + (cx + 11) + '" y="' + (y + 26) + '" text-anchor="middle">…</text>';
    }
    s += '<text x="' + (x + 94) + '" y="' + (y + 45) + '" text-anchor="middle" font-size="10" fill="' + (on ? "#333" : "#aaa") + '">' + label + "</text>";
    return s;
  }

  function svgDamps(lv) {
    return function () {
      var s = '<svg viewBox="0 0 640 260" width="640" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">' + defs();
      for (var u = 0; u < 3; u++) {
        var y = 20 + u * 44;
        s += box(10, y, 74, 30, "📱 3 kHz voice", lv >= 0, lv === 0, "#fff");
        s += arrow(84, y + 15, 104, y + 15, lv >= 1);
        s += box(104, y, 70, 30, "Digitizer", lv >= 1, lv === 1, UCOL[u]);
        s += '<text x="180" y="' + (y + 12) + '" font-size="10" fill="' + (lv >= 1 ? "#1d65b3" : "#aaa") + '">7.95 kbps</text>';
        s += arrow(174, y + 15, 236, y + 15, lv >= 2);
      }
      // 합류선
      s += '<line x1="236" y1="35" x2="236" y2="123" stroke="' + (lv >= 2 ? "#333" : "#ccc") + '" stroke-width="1.5"/>';
      if (lv >= 2) s += '<text x="244" y="82" fill="#1d65b3" font-weight="700">Σ 23.85 kbps</text>';
      s += arrow(236, 123, 236, 160, lv >= 3);
      // TDMA slot strip 1 2 3 1 2 3
      for (var k = 0; k < 6; k++) {
        var on = lv >= 3;
        s += '<rect x="' + (180 + k * 22) + '" y="162" width="22" height="24" fill="' + (on ? UCOL[k % 3] : "#f2f2f2") + '" stroke="' + (lv === 3 ? "#d6465f" : "#777") + '" stroke-width="' + (lv === 3 ? 2 : 1) + '"/>';
        s += '<text x="' + (191 + k * 22) + '" y="178" text-anchor="middle" fill="' + (on ? "#222" : "#aaa") + '">' + (k % 3 + 1) + "</text>";
      }
      s += '<text x="320" y="178" fill="' + (lv >= 3 ? "#d6465f" : "#aaa") + '" font-weight="700">TDMA</text>';
      s += '<text x="246" y="205" text-anchor="middle" fill="' + (lv >= 3 ? "#1d65b3" : "#aaa") + '" font-weight="700">48.6 kbps (overhead 포함)</text>';
      s += arrow(246, 212, 246, 228, lv >= 4);
      s += arrow(246, 240, 370, 240, lv >= 4);
      s += box(370, 226, 60, 28, "QPSK", lv >= 4, lv === 4, "#fff");
      s += arrow(430, 240, 438, 160, lv >= 5);
      s += '<text x="436" y="215" font-size="10" fill="' + (lv >= 4 ? "#333" : "#aaa") + '">30 kHz</text>';
      s += fdma(440, 110, lv >= 5, lv === 5, "채널 1개 = 30 kHz = 사용자 3명");
      if (lv >= 6) s += '<rect x="434" y="20" width="200" height="40" rx="4" fill="#fff3bf" stroke="#d6a017"/><text x="534" y="37" text-anchor="middle" font-weight="700">채널당 3 사용자</text><text x="534" y="53" text-anchor="middle">AMPS(1명) 대비 3배</text>';
      return s + "</svg>";
    };
  }

  function svgAmps(lv) {
    return function () {
      var s = '<svg viewBox="0 0 640 230" width="640" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">' + defs();
      for (var u = 0; u < 3; u++) {
        var y = 20 + u * 50;
        var ctrl = u === 2;
        s += box(10, y, 84, 30, ctrl ? "10 kbps control" : "📱 3 kHz voice", lv >= 0, lv === 0, "#fff");
        s += arrow(94, y + 15, 120, y + 15, lv >= 1);
        s += box(120, y, 60, 30, ctrl ? "FSK" : "FM", lv >= 1, lv === 1, ctrl ? "#ffe94d" : "#bfe3f0");
        s += '<text x="186" y="' + (y + 12) + '" font-size="10" fill="' + (lv >= 1 ? "#333" : "#aaa") + '">30 kHz analog</text>';
        s += arrow(180, y + 15, 432, 90 + u * 6, lv >= 2);
      }
      s += fdma(440, 70, lv >= 2, lv === 2, "채널 1개 = 30 kHz = 사용자 1명");
      if (lv >= 3) s += '<rect x="434" y="160" width="200" height="40" rx="4" fill="#fff3bf" stroke="#d6a017"/><text x="534" y="177" text-anchor="middle" font-weight="700">채널당 1 사용자</text><text x="534" y="193" text-anchor="middle">voice 는 analog(FM) 그대로</text>';
      return s + "</svg>";
    };
  }

  global.SIMS["damps_tdma"] = {
    title: "AMPS vs D-AMPS — 30 kHz 채널 하나에 몇 명? (L10 p.22–23)",
    desc: "[[AMPS]] 는 30 kHz 채널 하나에 analog voice 1명([[FM]]). [[D-AMPS]] 는 같은 채널에 음성을 [[7.95 kbps 디지털 음성|7.95 kbps 로 digitize]] 한 3명을 [[TDMA]] 로 묶어 48.6 kbps → [[QPSK]] 로 싣는다. 대역·채널([[FDMA]] 832개)은 그대로.",
    options: [
      { key: "sys", label: "시스템", values: [
        { value: "damps", label: "D-AMPS (2G)" },
        { value: "amps", label: "AMPS (1G, 비교)" }
      ] }
    ],
    build: function (opts) {
      var sys = opts.sys || "damps";
      var BAND = 25e6, CH = 30e3;
      var steps = [];
      var lines, vars, st, svgf;

      if (sys === "damps") {
        var VOICE = 7.95, N = 3, TDMA = 48.6;
        var sum = VOICE * N;                 // 23.85
        var over = TDMA - sum;               // 24.75
        var baud = TDMA / 2;                 // 24.3 (QPSK 2 bits/symbol)
        lines = [
          "사용자 3명: 3 kHz analog voice",
          "Digitizer: 사용자당 7.95 kbps",
          "TDMA 입력 합: 3 × 7.95 = " + fmt(sum, 2) + " kbps",
          "TDMA 출력 (slot 1 2 3 1 2 3 + overhead) = 48.6 kbps",
          "overhead = 48.6 − " + fmt(sum, 2) + " = " + fmt(over, 2) + " kbps",
          "QPSK (2 bits/symbol): 48.6 ÷ 2 = " + fmt(baud, 1) + " ksymbol/s → 30 kHz 아날로그 채널",
          "FDMA: 25 MHz ÷ 30 kHz = " + fmt(BAND / CH, 1) + " → 832 채널 중 하나",
          "결과: 채널당 3 사용자 (AMPS 1명 대비 3배)"
        ];
        vars = [
          { name: "users", label: "사용자 수", group: "입력" },
          { name: "perUser", label: "사용자당 rate", group: "입력" },
          { name: "sum", label: "음성 합 rate", group: "TDMA" },
          { name: "tdma", label: "TDMA 출력 rate", group: "TDMA" },
          { name: "overhead", label: "overhead", group: "TDMA" },
          { name: "channel", label: "아날로그 채널", group: "FDMA" },
          { name: "perCh", label: "채널당 사용자", group: "결과" }
        ];
        st = { users: 3, perUser: "3 kHz analog", sum: "-", tdma: "-", overhead: "-", channel: "-", perCh: "?" };
        svgf = svgDamps;
        var push = function (desc, pc, lv, note) {
          steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: svgf(lv) });
        };
        push("사용자 3명이 각자 '''3 kHz analog voice''' 를 만든다. AMPS 라면 이 셋이 30 kHz 채널을 '''하나씩''' 차지한다.", 1, 0);
        st.perUser = "7.95 kbps";
        push("D-AMPS 의 핵심 변화: voice 를 '''digitize''' 한다. Digitizer 출력은 사용자당 '''7.95 kbps'''.", 2, 1,
          "슬라이드 필기 '기억 x' — 7.95 kbps 라는 수치 자체는 외울 필요 없다는 표시. 흐름(analog → digital → TDMA)이 핵심.");
        st.sum = fmt(sum, 2) + " kbps";
        push("세 디지털 스트림을 합치면 3 × 7.95 = '''23.85 kbps'''.", 3, 2);
        st.tdma = TDMA + " kbps";
        push("[[TDMA]]: 시간을 slot 으로 나눠 '''1 2 3 1 2 3 …''' 순서로 번갈아 싣는다. 여기에 error control·동기 같은 overhead 가 붙어 출력은 '''48.6 kbps'''.", 4, 3);
        st.overhead = fmt(over, 2) + " kbps (≈ " + fmt(over / TDMA * 100, 1) + "%)";
        push("overhead = 48.6 − 23.85 = '''24.75 kbps''' — TDMA 출력의 절반 가까이가 순수 음성이 아닌 제어·오류정정 비트다.", 5, 3,
          "overhead 값과 비율은 슬라이드에 없는 파생값이다.");
        st.channel = "30 kHz (QPSK)";
        push("[[QPSK]] 는 symbol 하나에 2 bits → 48.6 ÷ 2 = 24.3 ksymbol/s. 이 정도면 '''30 kHz''' 아날로그 채널 하나에 들어간다.", 6, 4,
          "24.3 ksymbol/s 는 설명을 위한 파생값(슬라이드에 없음).");
        st.channel = "30 kHz, 832 채널 중 1개";
        push("[[FDMA]]: 25 MHz band ÷ 30 kHz ≈ 833.3 → '''832 채널''' 중 하나에 배정. 즉 '''FDMA 위에 TDMA''' 를 얹은 구조 (AMPS 와 같은 대역·채널 간격).", 7, 5);
        st.perCh = "3 명";
        push("결과: 30 kHz 채널 하나에 '''3 사용자''' — AMPS(1명) 대비 '''3배''' 용량. 이것이 D-AMPS 가 'Digital AMPS' 이면서 AMPS 와 backward compatible 한 이유다.", 8, 6,
          "시험 포인트: D-AMPS = AMPS 와 같은 대역·30 kHz 채널 + digitize + TDMA(채널당 3명) + QPSK.");
      } else {
        lines = [
          "사용자: 3 kHz analog voice",
          "FM 변조 → 30 kHz analog (digitize 없음)",
          "FDMA: 25 MHz ÷ 30 kHz = " + fmt(BAND / CH, 1) + " → 832 채널 (control 은 10 kbps FSK)",
          "결과: 채널당 1 사용자"
        ];
        vars = [
          { name: "signal", label: "신호", group: "입력" },
          { name: "mod", label: "변조", group: "변조" },
          { name: "channel", label: "채널", group: "FDMA" },
          { name: "perCh", label: "채널당 사용자", group: "결과" }
        ];
        st = { signal: "3 kHz analog voice", mod: "-", channel: "-", perCh: "?" };
        svgf = svgAmps;
        var pushA = function (desc, pc, lv, note) {
          steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: svgf(lv) });
        };
        pushA("[[AMPS]] (1G): 사용자의 '''3 kHz analog voice''' 를 그대로 다룬다.", 1, 0);
        st.mod = "FM → 30 kHz analog";
        pushA("[[FM]] 으로 변조해 '''30 kHz analog''' 신호를 만든다. digitize 도 TDMA 도 없다. control channel 은 10 kbps 데이터를 [[mid:FSK|FSK]] 로 보낸다.", 2, 1);
        st.channel = "30 kHz, 832 채널 중 1개";
        pushA("[[FDMA]]: 25 MHz band 를 30 kHz 로 잘라 ≈ 833.3 → '''832 채널'''(방향당). 한 사용자가 한 채널을 '''통째로''' 쓴다.", 3, 2);
        st.perCh = "1 명";
        pushA("결과: 채널당 '''1 사용자'''. D-AMPS 는 같은 채널에 3명을 넣는다 → 옵션을 D-AMPS 로 바꿔 비교해 보자.", 4, 3);
      }
      return { panels: [{ id: "P", title: "흐름 (왼쪽 → 오른쪽)", lang: "txt", lines: lines }], vars: vars, steps: steps };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
