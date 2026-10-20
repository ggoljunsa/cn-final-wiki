window.SIMS = window.SIMS || {};
// band_channels — 대역 → 채널 수 계산: AMPS (L10 p.19) / GSM (p.24–25) / IS-95 (p.28–29)
(function (global) {
  "use strict";

  var CH = "#1ba1c9", GUARD = "#e9eaec", A = "#f3a35c", B = "#7cc3ea", CTRL = "#d6465f", VOICE = "#3c9a50";

  // o = { title, rev:{lo,hi,name}, fwd:{lo,hi,name}, boxes: "few"|number, guardGap, chw, segs:[{a,b,fill,label}] (0..1 비율),
  //       hl: 강조할 박스 index(few 모드: 0), zoom:{title,n,fill(i),label(i)}, big }
  function draw(o) {
    return function () {
      var W = 640, H = 330, x0 = 90, x1 = 580;
      var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">';
      s += '<rect width="' + W + '" height="' + H + '" rx="8" fill="#fff"/>';
      s += '<text x="' + (W / 2) + '" y="20" text-anchor="middle" font-weight="700" fill="#1d65b3">' + o.title + "</text>";
      [[o.rev, 52], [o.fwd, 132]].forEach(function (bb) {
        var b = bb[0], y = bb[1];
        if (!b) return;
        s += '<text x="' + ((x0 + x1) / 2) + '" y="' + (y - 8) + '" text-anchor="middle" font-size="12" fill="#c2185b" font-weight="700">' + b.name + "</text>";
        s += '<rect x="' + x0 + '" y="' + y + '" width="' + (x1 - x0) + '" height="30" fill="#fff" stroke="#222" stroke-width="1.5"/>';
        s += '<text x="' + x0 + '" y="' + (y + 46) + '" text-anchor="middle" font-size="11">' + b.lo + "</text>";
        s += '<text x="' + x1 + '" y="' + (y + 46) + '" text-anchor="middle" font-size="11">' + b.hi + "</text>";
        // 채널 박스
        if (o.boxes === "few") {
          var bw = 34, gap = 6, xs = [];
          for (var k = 0; k < 5; k++) xs.push(x0 + 4 + k * (bw + gap));
          xs.push(x1 - 4 - 2 * bw - gap, x1 - 4 - bw);
          xs.forEach(function (x, k) {
            s += '<rect x="' + x + '" y="' + (y + 4) + '" width="' + bw + '" height="22" fill="' + CH + '"' + (o.hl === k ? ' stroke="#d6465f" stroke-width="3"' : "") + "/>";
          });
          s += '<text x="' + ((x0 + 4 + 5 * (bw + gap) + x1 - 4 - 2 * bw - gap) / 2) + '" y="' + (y + 20) + '" text-anchor="middle" font-size="16">…</text>';
        } else if (typeof o.boxes === "number") {
          var n = o.boxes, gg = o.guardGap || 0, tot = x1 - x0 - 4, w = (tot - gg * (n + 1)) / n;
          for (var j = 0; j < n; j++) {
            var xx = x0 + 2 + gg + j * (w + gg);
            var fill = o.boxFill ? o.boxFill(j) : CH;
            s += '<rect x="' + xx.toFixed(1) + '" y="' + (y + 4) + '" width="' + w.toFixed(1) + '" height="22" fill="' + fill + '"' + (o.hl === j ? ' stroke="#d6465f" stroke-width="3"' : "") + "/>";
          }
        }
        // 구획 띠 (provider 분할 등)
        (o.segs || []).forEach(function (g) {
          var sa = x0 + (x1 - x0) * g.a, sb = x0 + (x1 - x0) * g.b;
          s += '<rect x="' + sa + '" y="' + (y + 31) + '" width="' + (sb - sa) + '" height="5" fill="' + g.fill + '"/>';
          if (y === 132 && g.label) s += '<text x="' + ((sa + sb) / 2) + '" y="' + (y + 60) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + g.fill + '">' + g.label + "</text>";
        });
      });
      if (o.chw && o.boxes === "few") {
        s += '<path d="M' + (x0 + 4) + ",44 v-6 h34 v6" + '" fill="none" stroke="#222"/>';
        s += '<text x="' + (x0 + 21) + '" y="34" text-anchor="middle" font-size="11" font-weight="700">' + o.chw + "</text>";
      }
      // 확대 (한 채널 안 / 그룹)
      if (o.zoom) {
        var z = o.zoom, zy = 222, zx0 = 90, zx1 = 580, zn = z.n, zw = (zx1 - zx0) / zn;
        s += '<text x="' + zx0 + '" y="' + (zy - 8) + '" font-size="12" font-weight="700">' + z.title + "</text>";
        for (var i = 0; i < zn; i++) {
          s += '<rect x="' + (zx0 + i * zw).toFixed(1) + '" y="' + zy + '" width="' + zw.toFixed(1) + '" height="30" fill="' + z.fill(i) + '" stroke="#fff" stroke-width="' + (zn > 20 ? 0.5 : 1.5) + '"/>';
          var lb = z.label ? z.label(i) : null;
          if (lb) s += '<text x="' + (zx0 + (i + 0.5) * zw).toFixed(1) + '" y="' + (zy + 20) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#222">' + lb + "</text>";
        }
      }
      if (o.big) s += '<text x="' + (W / 2) + '" y="' + (H - 18) + '" text-anchor="middle" font-size="16" font-weight="700" fill="#d6465f">' + o.big + "</text>";
      return s + "</svg>";
    };
  }

  function amps() {
    var rev = { lo: "824 MHz", hi: "849 MHz", name: "Mobile station band — Reverse (uplink: mobile → base)" };
    var fwd = { lo: "869 MHz", hi: "894 MHz", name: "Base station band — Forward (downlink: base → mobile)" };
    var T = "AMPS (1G) bands — p.19";
    var split = [{ a: 0, b: 0.5, fill: A, label: "provider A: 416" }, { a: 0.5, b: 1, fill: B, label: "provider B: 416" }];
    var ctrl = [{ a: 0, b: 21 / 832, fill: CTRL, label: "" }, { a: 21 / 832, b: 0.5, fill: A, label: "A: control 21 + voice 395" }, { a: 0.5, b: 1, fill: B, label: "B: 416" }];
    var lines = [
      "Each band is 25 MHz (824–849 / 869–894 MHz) — 대역 하나 25 MHz",
      "made of 832 30-kHz analog channels — 25 MHz ÷ 30 kHz → 832 채널",
      "Two providers share an area → 416 channels in each cell for each provider",
      "Among 416, 21 channels are used for control → voice 416 − 21 = 395",
      "AMPS has a frequency reuse factor of 7 → cell 당 395 / 7 ≈ 56 (파생)"
    ];
    var steps = [
      { pc: 1, v: ["25 MHz (방향당)", "30 kHz", "-", "-", "-", "-", "-"],
        d: "[[AMPS 대역과 채널]]: AMPS 는 '''두 개의 band''' 를 쓴다. MS 가 보내는 reverse(uplink) 824–849 MHz, BS 가 보내는 forward(downlink) 869–894 MHz. 각각 849 − 824 = 894 − 869 = '''25 MHz'''. 두 band 는 45 MHz 떨어져 있다(869 − 824, 파생).",
        o: { boxes: "few", chw: "30 kHz" } },
      { pc: 2, v: ["25 MHz (방향당)", "30 kHz", "25 000 ÷ 30 = 833.3", "832", "-", "-", "-"],
        d: "25 MHz 를 30 kHz 아날로그 채널([[FDMA]])로 자르면 25 000 kHz ÷ 30 kHz = 833.3. 슬라이드 값은 '''832 채널''' — 정수로 내리고 대역 가장자리를 남긴 값. '''방향당 832''' 이고, 통화 하나는 reverse 1 + forward 1 채널 쌍을 쓴다.",
        o: { boxes: "few", chw: "30 kHz", hl: 0, big: "25 MHz ÷ 30 kHz ≈ 833 → 832 채널" } },
      { pc: 3, v: ["25 MHz (방향당)", "30 kHz", "25 000 ÷ 30 = 833.3", "832", "832 ÷ 2 = 416", "-", "-"],
        d: "'''Two providers can share an area''' — 한 지역에 사업자 둘 → 832 ÷ 2 = '''416 채널''' (각 provider, 각 cell 기준 문구는 슬라이드 그대로 'in each cell for each provider').",
        o: { boxes: "few", segs: split, big: "832 ÷ 2 providers = 416" } },
      { pc: 4, v: ["25 MHz (방향당)", "30 kHz", "25 000 ÷ 30 = 833.3", "832", "832 ÷ 2 = 416", "416 − 21 = 395", "-"],
        d: "416 중 '''21 채널은 control''' ([[AMPS control channel]], FSK) → 남은 '''voice 채널 395''' (FM).",
        o: { boxes: "few", segs: ctrl, big: "416 − 21 control = 395 voice" } },
      { pc: 5, v: ["25 MHz (방향당)", "30 kHz", "25 000 ÷ 30 = 833.3", "832", "832 ÷ 2 = 416", "416 − 21 = 395", "395 ÷ 7 ≈ 56 (파생)"],
        d: "AMPS 의 [[reuse factor]] = '''7''' → 395 voice 채널을 7 그룹으로 나눠 cell 하나는 그중 한 그룹만 쓴다: 395 ÷ 7 = 56.4 → '''cell 당 약 56 voice 채널'''.",
        o: { boxes: "few", segs: ctrl,
          zoom: { title: "provider A 의 voice 395 → reuse factor 7 그룹 (cell 하나 = 한 그룹)", n: 7,
            fill: function (i) { return ["#f7d84a", "#f4a6c0", "#9fd36a", "#7cc3ea", "#f3a35c", "#b9a3e3", "#7fd8c3"][i]; },
            label: function (i) { return "그룹 " + (i + 1) + " ≈56"; } },
          big: "AMPS: 832 / 416 / 395 → cell 당 ≈56" },
        note: "395 / 7 ≈ 56 은 슬라이드에 없는 파생값이다(p.19 의 416 − 21 = 395 와 reuse factor 7 로 계산). 833 → 832 차이는 슬라이드가 설명하지 않는다. provider A/B 를 대역 절반씩으로 그린 것은 개념도." }
    ];
    return { T: T, rev: rev, fwd: fwd, lines: lines, steps: steps,
      names: ["대역폭", "채널 폭", "나눗셈", "채널 수 (방향당)", "provider 당", "voice 채널", "cell 당 voice"] };
  }

  function gsm() {
    var rev = { lo: "890 MHz", hi: "915 MHz", name: "Reverse band (uplink: MS → BS): 124 channels" };
    var fwd = { lo: "935 MHz", hi: "960 MHz", name: "Forward band (downlink: BS → MS): 124 channels" };
    var T = "GSM (2G) bands — p.24";
    var lines = [
      "Use two bands for (half) duplex: Forward (downlink) BS → MS, Reverse (uplink) BS ← MS",
      "Reverse 890–915 MHz, Forward 935–960 MHz → Band = 25 MHz",
      "Channel: 200 kHz → 25 MHz ÷ 200 kHz = 125",
      "Band = 25 MHz = 124 channels (나머지는 guard)",
      "각 채널 = TDMA 8 slots (p.25) → 124 × 8 = 992 사용자"
    ];
    var slot = function (i) { return ["#f7d84a", "#f4a6c0", "#9fd36a", "#7cc3ea", "#f3a35c", "#b9a3e3", "#7fd8c3", "#e6c07b"][i]; };
    var steps = [
      { pc: 1, v: ["-", "200 kHz", "-", "-", "-", "-"],
        d: "[[GSM 대역]]: GSM 도 '''두 band''' 를 쓴다 — forward(downlink, BS → MS) 와 reverse(uplink, MS → BS).",
        o: { boxes: "few", chw: "200 kHz" } },
      { pc: 2, v: ["25 MHz (방향당)", "200 kHz", "-", "-", "-", "-"],
        d: "reverse 890–915 MHz, forward 935–960 MHz → 각 '''25 MHz''' (AMPS 와 같은 폭). 두 band 간격 45 MHz(파생).",
        o: { boxes: "few", chw: "200 kHz" } },
      { pc: 3, v: ["25 MHz (방향당)", "200 kHz", "25 000 ÷ 200 = 125", "-", "-", "-"],
        d: "채널 폭이 AMPS 의 30 kHz 보다 훨씬 넓은 '''200 kHz''' (디지털 채널). 25 000 kHz ÷ 200 kHz = '''125'''.",
        o: { boxes: "few", chw: "200 kHz", hl: 0, big: "25 MHz ÷ 200 kHz = 125" } },
      { pc: 4, v: ["25 MHz (방향당)", "200 kHz", "25 000 ÷ 200 = 125", "124", "-", "-"],
        d: "슬라이드 값은 '''Band = 25 MHz = 124 channels''' — 125 중 1 채널 폭은 대역 양끝 guard 로 남긴 것으로 이해하면 된다. 방향당 '''124 채널'''.",
        o: { boxes: "few", segs: [{ a: 0, b: 0.004, fill: "#999", label: "" }, { a: 0.996, b: 1, fill: "#999", label: "" }, { a: 0.004, b: 0.996, fill: CH, label: "124 channels (양끝 guard)" }],
          big: "125 → 124 채널 (guard)" } },
      { pc: 5, v: ["25 MHz (방향당)", "200 kHz", "25 000 ÷ 200 = 125", "124", "8 slots", "124 × 8 = 992"],
        d: "GSM 은 [[TDMA]] — 200 kHz 채널 하나를 '''8 time slot''' 으로 나눠 8 명이 번갈아 쓴다(p.25 '# of slots: 8'). 그래서 동시 사용자 = 124 × 8 = '''992'''.",
        o: { boxes: "few", segs: [{ a: 0.004, b: 0.996, fill: CH, label: "124 channels" }], hl: 0,
          zoom: { title: "200 kHz 채널 1 개 = TDMA frame 8 slots (사용자 8 명)", n: 8, fill: slot, label: function (i) { return "slot " + (i + 1); } },
          big: "GSM: 124 채널 × 8 slot = 992 사용자" },
        note: "125 → 124 를 guard 로 설명한 것과 124 × 8 = 992 는 슬라이드에 직접 적힌 값이 아니다(p.24 의 124 channels 와 p.25 의 8 slots 로 계산·해석). 실제 GSM 은 control 용 slot·frame 도 있다(p.26 multiframe)." }
    ];
    return { T: T, rev: rev, fwd: fwd, lines: lines, steps: steps,
      names: ["대역폭", "채널 폭", "나눗셈", "채널 수 (방향당)", "채널당 slot", "동시 사용자"] };
  }

  function is95() {
    var rev = { lo: "", hi: "", name: "Band 1 (ISM 800-MHz)" };
    var fwd = { lo: "", hi: "", name: "Band 2 (ISM 1,900-MHz)" };
    var T = "IS-95 (2G) bands & channels — p.28";
    var lines = [
      "Use two bands for duplex communication — 두 band 로 duplex",
      "ISM 800-MHz, ISM 1,900-MHz",
      "Each band is divided into 20 channels of 1.228 MHz separated by guard bands",
      "Each service provider is allotted 10 channels",
      "각 1.228 MHz 채널 = Walsh code 64 개로 구분되는 64 digital channel (p.29, W0 = pilot)"
    ];
    var prov = function (j) { return j < 10 ? A : B; };
    var steps = [
      { pc: 1, v: ["-", "1.228 MHz", "-", "-", "-"],
        d: "[[IS-95 대역과 채널]]: IS-95 도 '''two bands for duplex communication'''.",
        o: { boxes: 20, guardGap: 3, boxFill: function () { return GUARD; } } },
      { pc: 2, v: ["ISM 800 / 1,900 MHz", "1.228 MHz", "-", "-", "-"],
        d: "band 는 '''ISM 800-MHz''' 와 '''ISM 1,900-MHz''' (슬라이드 표기 그대로).",
        o: { boxes: 20, guardGap: 3, boxFill: function () { return GUARD; } } },
      { pc: 3, v: ["ISM 800 / 1,900 MHz", "1.228 MHz", "20 (guard band 사이)", "-", "-"],
        d: "각 band 를 '''1.228 MHz 채널 20 개'''로 나누고 채널 사이에 '''guard band''' 를 둔다. 채널 폭 비교: AMPS 30 kHz · GSM 200 kHz · IS-95 '''1.228 MHz''' — 넓은 대역에 퍼뜨리는 [[DSSS]] 이기 때문. (20 × 1.228 = 24.56 MHz → 25 MHz band 라면 guard 합 ≈ 0.44 MHz, 파생)",
        o: { boxes: 20, guardGap: 3, hl: 0, big: "band 하나 = 1.228 MHz × 20 채널 + guard bands" } },
      { pc: 4, v: ["ISM 800 / 1,900 MHz", "1.228 MHz", "20 (guard band 사이)", "10", "-"],
        d: "'''Each service provider is allotted 10 channels''' → 20 ÷ 2 = provider 당 '''10 채널'''.",
        o: { boxes: 20, guardGap: 3, boxFill: prov, segs: [{ a: 0, b: 0.5, fill: A, label: "provider A: 10" }, { a: 0.5, b: 1, fill: B, label: "provider B: 10" }],
          big: "20 채널 → provider 당 10" } },
      { pc: 5, v: ["ISM 800 / 1,900 MHz", "1.228 MHz", "20 (guard band 사이)", "10", "64 (W0–W63)"],
        d: "1.228 MHz 채널 하나 안에서는 [[CDMA]]: '''64 개 [[Walsh code]]''' (W0 … W63) 로 64 개 digital channel 을 구분한다(p.29 블록도의 Σ 64). W0 는 all 1s 인 [[pilot channel]].",
        o: { boxes: 20, guardGap: 3, boxFill: prov, hl: 0, segs: [{ a: 0, b: 0.5, fill: A, label: "provider A: 10" }, { a: 0.5, b: 1, fill: B, label: "provider B: 10" }],
          zoom: { title: "1.228 MHz 채널 1 개 = Walsh code 64 개 (W0 = pilot)", n: 64,
            fill: function (i) { return i === 0 ? CTRL : (i % 2 ? "#7fb6d9" : "#a9d0ea"); } },
          big: "IS-95: 20 채널 / provider 10 / 채널당 Walsh 64" },
        note: "IS-95 band 폭 25 MHz 와 guard 합 ≈ 0.44 MHz 는 슬라이드 p.28 에 없다(교재 Forouzan 보충·파생). 64 개 중 일부(pilot 등)는 control 용이라 사용자 수는 64 보다 적다." }
    ];
    return { T: T, rev: rev, fwd: fwd, lines: lines, steps: steps,
      names: ["band", "채널 폭", "채널 수 (band 당)", "provider 당", "채널당 Walsh code"] };
  }

  global.SIMS["band_channels"] = {
    title: "대역 → 채널 수 — AMPS / GSM / IS-95",
    desc: "band 폭을 채널 폭으로 나누고 → provider·control·reuse factor(AMPS), TDMA slot(GSM), guard band·Walsh code(IS-95) 로 이어지는 채널 수 계산을 한 단계씩. 슬라이드에 없는 파생값(395/7 ≈ 56, 124 × 8 = 992 등)은 note 로 표시.",
    options: [{ key: "sys", label: "시스템", values: [
      { value: "amps", label: "AMPS (1G, p.19)" },
      { value: "gsm", label: "GSM (2G, p.24)" },
      { value: "is95", label: "IS-95 (2G, p.28)" }] }],
    build: function (opts) {
      var D = opts.sys === "gsm" ? gsm() : (opts.sys === "is95" ? is95() : amps());
      var vars = D.names.map(function (n, i) { return { name: n, group: i < 2 ? "band" : "계산" }; });
      var steps = D.steps.map(function (st) {
        var v = {};
        D.names.forEach(function (n, i) { v[n] = st.v[i]; });
        var o = st.o;
        o.title = D.T; o.rev = D.rev; o.fwd = D.fwd;
        var step = { desc: st.d, pc: { P: st.pc }, vars: v, svg: draw(o) };
        if (st.note) step.note = st.note;
        return step;
      });
      return { panels: [{ id: "P", title: D.T.replace(/ —.*/, "") + " 계산 순서", lang: "txt", lines: D.lines }], vars: vars, steps: steps };
    }
  };
})(window);
