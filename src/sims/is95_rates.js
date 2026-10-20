// is95_rates — L10 p.29–30 IS-95 Forward(downlink) / Reverse(uplink) 블록도의 rate 를 왼쪽 → 오른쪽으로
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  function fmt(x, d) { return String(Number(x.toFixed(d === undefined ? 4 : d))); }

  // blocks: 본선(왼→오) 블록. branch: ⊕ 아래로 들어오는 long code 가지.
  function makeSvg(blocks, branch, cur, curBranch) {
    return function () {
      var W = 660, H = 230, bw = 70, bh = 40, gap = 12, y = 60;
      var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="10">';
      s += '<defs><marker id="ia" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#333"/></marker></defs>';
      var xs = [];
      blocks.forEach(function (b, i) {
        var x = 6 + i * (bw + gap);
        xs.push(x);
        var done = i <= cur, hl = i === cur;
        var fill = hl ? "#fff3bf" : (done ? (b.fill || "#eef4fb") : "#f4f4f4");
        if (b.round) {
          s += '<circle cx="' + (x + bw / 2) + '" cy="' + (y + bh / 2) + '" r="16" fill="' + fill + '" stroke="' + (hl ? "#d6465f" : "#666") + '" stroke-width="' + (hl ? 2.5 : 1) + '"/>';
          s += '<text x="' + (x + bw / 2) + '" y="' + (y + bh / 2 + 5) + '" text-anchor="middle" font-size="15">' + b.name + "</text>";
          if (b.sub) s += '<text x="' + (x + bw / 2) + '" y="' + (y - 6) + '" text-anchor="middle" fill="#555">' + b.sub + "</text>";
        } else {
          s += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="4" fill="' + fill + '" stroke="' + (hl ? "#d6465f" : "#666") + '" stroke-width="' + (hl ? 2.5 : 1) + '"/>';
          var parts = b.name.split("|");
          parts.forEach(function (p, k) {
            s += '<text x="' + (x + bw / 2) + '" y="' + (y + bh / 2 + 4 + (k - (parts.length - 1) / 2) * 12) + '" text-anchor="middle" fill="' + (done ? "#222" : "#999") + '">' + p + "</text>";
          });
        }
        // 출력 rate 라벨 (화살표 위)
        if (i < blocks.length - 1) {
          var ax1 = x + bw, ax2 = x + bw + gap;
          s += '<line x1="' + ax1 + '" y1="' + (y + bh / 2) + '" x2="' + ax2 + '" y2="' + (y + bh / 2) + '" stroke="' + (i < cur ? "#333" : "#ccc") + '" stroke-width="1.5" marker-end="url(#ia)"/>';
        }
        if (b.out && i <= cur) {
          var atBranch = branch && i === branch.at;
          s += '<text x="' + (atBranch ? x + bw / 2 + 6 : x + bw / 2) + '" y="' + (y + bh + (atBranch ? 30 : 16)) + '" text-anchor="' + (atBranch ? "start" : "middle") + '" font-weight="700" fill="' + (hl ? "#d6465f" : "#1d65b3") + '">' + b.out + "</text>";
        }
      });
      // long code 가지
      if (branch) {
        var bx = xs[branch.at];
        var on = cur >= branch.at || curBranch;
        var cx = bx + bw / 2;
        var by = 150;
        var bxs = [];
        var bw2 = 66;
        var n = branch.boxes.length;
        branch.boxes.forEach(function (b, k) {
          var x = cx - 30 - (n - k) * (bw2 + 8);
          bxs.push(x);
          s += '<rect x="' + x + '" y="' + by + '" width="' + bw2 + '" height="32" rx="4" fill="' + (curBranch ? "#fff3bf" : (on ? b.fill : "#f4f4f4")) + '" stroke="' + (curBranch ? "#d6465f" : "#666") + '" stroke-width="' + (curBranch ? 2.5 : 1) + '"/>';
          var parts = b.name.split("|");
          parts.forEach(function (p, j) {
            s += '<text x="' + (x + bw2 / 2) + '" y="' + (by + 20 + (j - (parts.length - 1) / 2) * 11) + '" text-anchor="middle">' + p + "</text>";
          });
          if (k > 0) s += '<line x1="' + (bxs[k - 1] + bw2) + '" y1="' + (by + 16) + '" x2="' + x + '" y2="' + (by + 16) + '" stroke="#333" marker-end="url(#ia)"/>';
          if (b.out) s += '<text x="' + (x + bw2 / 2) + '" y="' + (by + 46) + '" text-anchor="middle" fill="#1d65b3" font-weight="700">' + b.out + "</text>";
        });
        var lastX = bxs[bxs.length - 1] + bw2;
        s += '<path d="M' + lastX + "," + (by + 16) + " L" + cx + "," + (by + 16) + " L" + cx + "," + (y + bh / 2 + 18) + '" fill="none" stroke="#333" stroke-width="1.5" marker-end="url(#ia)"/>';
        s += '<text x="' + (cx - 6) + '" y="' + (by - 6) + '" text-anchor="end" fill="#1d65b3" font-weight="700">' + branch.into + "</text>";
        s += '<text x="' + (bxs[0] - 4) + '" y="' + (by + 20) + '" text-anchor="end">ESN</text>';
      }
      s += '<text x="6" y="20" font-size="12" font-weight="700" fill="#333">' + (blocks.title || "") + "</text>";
      return s + "</svg>";
    };
  }

  global.SIMS["is95_rates"] = {
    title: "IS-95 블록도의 rate 따라가기 — 9.6 kbps 가 어떻게 1.228 Mcps 가 되나 (L10 p.29–30)",
    desc: "[[IS-95 forward 전송]](downlink)과 [[IS-95 reverse 전송]](uplink) 블록도를 왼쪽에서 오른쪽으로. 각 블록 뒤의 rate 를 손으로 계산해 보면 두 방향 모두 [[chip rate]] 1.2288 Mcps(슬라이드 표기 1.228 Mcps)에 도달한다. forward 는 [[Walsh code]] 64 chips 로 ×64, reverse 는 6-to-64 symbol modulation 후 [[long code와 ESN|long code]] 로 ×4.",
    options: [
      { key: "dir", label: "방향", values: [
        { value: "fwd", label: "Forward (downlink, BS → MS)" },
        { value: "rev", label: "Reverse (uplink, MS → BS)" }
      ] }
    ],
    build: function (opts) {
      var dir = opts.dir || "fwd";
      var VOICE = 9.6;                     // kbps
      var CHIP = 1228.8;                   // kcps
      var steps = [];
      var lines, vars, blocks, branch, st;

      function push(desc, pc, cur, curBranch, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(blocks, branch, cur, curBranch) });
      }

      if (dir === "fwd") {
        var sym = VOICE * 2;               // 19.2 ksps
        var dec = CHIP / sym;              // 64
        var chips = sym * 64;              // 1228.8 kcps
        blocks = [
          { name: "3 kHz|Voice", out: "3 kHz" },
          { name: "Digitizer", out: "9.6 kbps" },
          { name: "Error corr.|repeat|interleave", out: "19.2 ksps" },
          { name: "+", round: true, sub: "scramble", fill: "#ffe94d", out: "19.2 ksps" },
          { name: "×", round: true, sub: "W_i", fill: "#ffe94d", out: "1.2288 Mcps" },
          { name: "Σ", round: true, sub: "64 ch", out: "1.2288 Mcps" },
          { name: "QPSK", out: "1.228 MHz" },
          { name: "FDMA|20 ch", out: "25 MHz" }
        ];
        blocks.title = "Forward (downlink) — BS 가 64 digital channel 을 합쳐 보냄";
        branch = { at: 3, into: "19.2 ksps", boxes: [
          { name: "Long code|generator", fill: "#cfe8f7", out: "1.228 Mcps" },
          { name: "Decimator", fill: "#b5dc6a", out: "" }
        ] };
        lines = [
          "voice 3 kHz (analog)",
          "Digitizer → 9.6 kbps",
          "error correcting·repeating·interleaving: 9.6 × 2 = 19.2 ksps",
          "long code (ESN) 1.2288 Mcps → decimator ÷ 64 → 19.2 ksps",
          "⊕ scramble: 19.2 ksps ⊕ 19.2 ksps → 19.2 ksps (rate 그대로)",
          "× Walsh code W_i (64 chips/symbol): 19.2 k × 64 = 1228.8 kcps",
          "= 1.2288 Mcps ≈ 1.228 Mcps",
          "Σ 64 digital channel (W0 = pilot, all 1s) → 1.2288 Mcps (합쳐도 rate 그대로)",
          "QPSK → 1.228 MHz 채널 (25 MHz band 의 FDMA 20 채널 중 하나)"
        ];
        vars = [
          { name: "block", label: "현재 블록", group: "블록도" },
          { name: "rate", label: "블록 출력 rate", group: "블록도" },
          { name: "longcode", label: "long code 가지", group: "scramble" },
          { name: "spread", label: "확산 배수", group: "spreading" },
          { name: "channels", label: "합쳐지는 channel", group: "spreading" }
        ];
        st = { block: "Voice", rate: "3 kHz analog", longcode: "-", spread: "-", channels: "-" };
        push("BS 쪽 한 사용자(digital channel i)의 '''3 kHz voice''' 에서 출발.", 1, 0, false);
        st.block = "Digitizer"; st.rate = "9.6 kbps";
        push("Digitizer 가 음성을 '''9.6 kbps''' 비트열로 만든다.", 2, 1, false);
        st.block = "Error correcting, repeating, interleaving"; st.rate = fmt(sym) + " ksps";
        push("error correcting·repeating·interleaving 을 거치면 비트 하나가 두 symbol 이 된다: 9.6 × 2 = '''19.2 ksps''' (bit 가 아니라 symbol 이므로 단위가 ksps).", 3, 2, false);
        st.longcode = "1228.8 kcps ÷ " + fmt(dec) + " = 19.2 ksps";
        push("아래 가지: [[long code와 ESN|ESN]] 으로 만든 '''long code''' 는 1.2288 Mcps 로 나오는데, '''Decimator''' 가 64 개 중 1 개만 골라 1228.8 ÷ 64 = '''19.2 ksps''' 로 속도를 맞춘다.", 4, 2, true,
          "decimator 배수 64 = 1228.8 ÷ 19.2 는 슬라이드 수치에서 역산한 값이다.");
        st.block = "⊕ (long code scramble)"; st.rate = fmt(sym) + " ksps";
        push("두 19.2 ksps 열을 ⊕ 로 섞는다(scramble). 같은 속도끼리라 출력도 '''19.2 ksps''' — 개인정보 보호(privacy)용이지 확산이 아니다.", 5, 3, false);
        st.block = "× Walsh code W_i"; st.spread = "× 64 (Walsh code 64 chips)"; st.rate = fmt(chips, 1) + " kcps";
        push("[[CDMA]] 부분: symbol 하나마다 [[Walsh code]] W_i 의 '''64 chips''' 를 곱한다 → 19.2 k × 64 = '''1228.8 kcps'''. 여기서 대역이 64배로 퍼진다([[DSSS]]).", 6, 4, false);
        st.rate = fmt(chips / 1000) + " Mcps ≈ 1.228 Mcps";
        push("1228.8 kcps = '''1.2288 Mcps''' — 슬라이드의 '''1.228 Mcps''' 가 바로 이 [[chip rate]] 다.", 7, 4, false);
        st.block = "Σ (64 digital channels)"; st.channels = "64 (W0 = pilot all 1s, W1…W63 = traffic 등)";
        push("Σ: W0…W63 로 확산된 '''64 개 digital channel''' 을 chip 단위로 더한다. 0번은 [[pilot channel]](데이터 all 1s). 더해도 chip rate 는 '''1.2288 Mcps''' 그대로.", 8, 5, false);
        st.block = "QPSK → FDMA"; st.rate = "1.228 MHz 채널";
        push("[[QPSK]] 변조 후 '''1.228 MHz''' 아날로그 채널 하나에 싣는다 — 25 MHz band 의 20 개 FDMA 채널 중 하나. 정리: 9.6 kbps → ×2 → ×64 → '''1.2288 Mcps'''.", 9, 7, false,
          "시험 포인트: forward 는 Walsh code(64 chips)로 사용자를 구분 → 1.228 MHz 채널 하나에 최대 64 digital channel. 9.6 → 19.2 → 1.228 순서를 기억.");
      } else {
        var sym3 = VOICE * 3;              // 28.8 ksps
        var groups = sym3 / 6;             // 4.8 k groups/s
        var walsh = groups * 64;           // 307.2 kcps
        var fac = CHIP / walsh;            // 4
        var out = walsh * fac;             // 1228.8
        blocks = [
          { name: "3 kHz|Voice", out: "3 kHz" },
          { name: "Digitizer", out: "9.6 kbps" },
          { name: "Error corr.|repetition|interleave", out: "28.8 ksps" },
          { name: "6 to 64|symbol mod.", out: "307.2 kcps" },
          { name: "+", round: true, sub: "DSSS", fill: "#ffe94d", out: "1.2288 Mcps" },
          { name: "QPSK", out: "1.228 MHz" },
          { name: "Σ", round: true, sub: "94 ch", out: "1.228 MHz" },
          { name: "FDMA|20 ch", out: "25 MHz" }
        ];
        blocks.title = "Reverse (uplink) — MS 한 대가 자기 신호만 보냄";
        branch = { at: 4, into: "1.228 Mcps", boxes: [
          { name: "Long code|generator", fill: "#b5dc6a", out: "" }
        ] };
        lines = [
          "voice 3 kHz (analog)",
          "Digitizer → 9.6 kbps",
          "error correcting·repetition·interleaving: 9.6 × 3 = 28.8 ksps",
          "6-to-64 symbol modulation: 28.8 k ÷ 6 = 4.8 k 묶음/s",
          "묶음당 64 chips: 4.8 k × 64 = 307.2 kcps",
          "long code (ESN) 1.2288 Mcps 와 ⊕ → DSSS: 1228.8 ÷ 307.2 = 4 배",
          "307.2 × 4 = 1228.8 kcps = 1.2288 Mcps ≈ 1.228 Mcps",
          "QPSK → 1.228 MHz, Σ 94 digital channel (DSSS) → FDMA 20 채널 중 하나"
        ];
        vars = [
          { name: "block", label: "현재 블록", group: "블록도" },
          { name: "rate", label: "블록 출력 rate", group: "블록도" },
          { name: "mod64", label: "6-to-64 계산", group: "spreading" },
          { name: "spread", label: "DSSS 배수", group: "spreading" },
          { name: "channels", label: "합쳐지는 channel", group: "spreading" }
        ];
        st = { block: "Voice", rate: "3 kHz analog", mod64: "-", spread: "-", channels: "-" };
        push("MS(휴대폰) 한 대의 '''3 kHz voice''' 에서 출발.", 1, 0, false);
        st.block = "Digitizer"; st.rate = "9.6 kbps";
        push("Digitizer → '''9.6 kbps''' (forward 와 같다).", 2, 1, false);
        st.block = "Error correcting, repetition, interleaving"; st.rate = fmt(sym3) + " ksps";
        push("uplink 는 오류에 더 약하니 더 강하게 보호한다: 9.6 × 3 = '''28.8 ksps''' (forward 는 ×2 = 19.2).", 3, 2, false);
        st.block = "6 to 64 symbol modulation"; st.mod64 = "28.8 k ÷ 6 = " + fmt(groups) + " k 묶음/s";
        push("'''6-to-64 symbol modulation''': symbol 6 개를 한 묶음으로 → 28.8 ÷ 6 = '''4.8 k 묶음/s'''. 6 bits 는 2^6 = 64 가지이므로 64 개 Walsh code 중 하나로 바꿔 보낸다.", 4, 3, false);
        st.mod64 = fmt(groups) + " k × 64 = " + fmt(walsh, 1) + " kcps"; st.rate = fmt(walsh, 1) + " kcps";
        push("묶음 하나 = 64 chips → 4.8 k × 64 = '''307.2 kcps'''. (여기서 Walsh code 는 사용자 구분이 아니라 '''변조'''용이다.)", 5, 3, false);
        st.block = "⊕ long code (DSSS)"; st.spread = "1228.8 ÷ 307.2 = " + fmt(fac) + " 배";
        push("아래 가지: [[long code와 ESN|ESN]] 으로 만든 '''long code''' 는 1.228 Mcps. 307.2 kcps 열과 ⊕ 하면 chip 하나가 long code 4 chips 로 쪼개진다: 1228.8 ÷ 307.2 = '''4 배''' [[DSSS]].", 6, 4, true,
          "uplink 에서는 '''long code 가 사용자 구분'''을 맡는다(MS 마다 ESN 이 다르므로).");
        st.rate = fmt(out / 1000) + " Mcps ≈ 1.228 Mcps";
        push("307.2 × 4 = 1228.8 kcps = '''1.2288 Mcps''' — forward 와 '''같은 [[chip rate]]'''. 그래야 같은 1.228 MHz 채널에 들어간다.", 7, 4, false);
        st.block = "QPSK → Σ → FDMA"; st.rate = "1.228 MHz 채널"; st.channels = "94 digital channels (DSSS)";
        push("[[QPSK]] 후 '''1.228 MHz''' 채널. 슬라이드 그림대로 '''94 digital channels''' 가 같은 채널에서 겹쳐(Σ) BS 에 도착하고, BS 는 long code 로 각 MS 를 분리한다. 정리: 9.6 → ×3 → ÷6×64 → ×4 → '''1.2288 Mcps'''.", 8, 6, false,
          "시험 포인트: forward = ×2 → ×64(Walsh) / reverse = ×3 → ÷6×64 → ×4(long code). 둘 다 1.228 Mcps.");
      }

      return { panels: [{ id: "P", title: "손으로 rate 계산", lang: "txt", lines: lines }], vars: vars, steps: steps };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
