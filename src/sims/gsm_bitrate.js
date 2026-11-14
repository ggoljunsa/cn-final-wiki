// gsm_bitrate — L10 p.25–26 GSM Transmission: slot → frame → multiframe → channel bit rate
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  function fmt(x, d) {
    var r = Number(x.toFixed(d === undefined ? 3 : d));
    return String(r);
  }

  // 실제 GSM 26-multiframe 에서 control(SACCH/idle)은 13번째·26번째 frame
  var CTRL = { 12: true, 25: true };

  function makeSvg(level, mode) {
    // level: 0..7 진행도. mode: channel / user / data
    return function () {
      var W = 620, H = 360;
      var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">';
      // ---- slot 내부 (3겹) ----
      var tiers = [
        { bits: 65, label: "65 bits — User data", col: "#9ad0f5", lv: 0 },
        { bits: 114, label: "114 bits — + error control", col: "#b8e0a8", lv: 1 },
        { bits: 156.25, label: "156.25 bits — + TDMA control", col: "#f7c8e0", lv: 2 }
      ];
      s += '<text x="10" y="18" font-weight="700" fill="#333">① slot 1개 안의 비트</text>';
      tiers.forEach(function (t, i) {
        var on = level >= t.lv;
        var w = t.bits * 1.6;
        var x = 20, y = 28 + i * 26;
        var hl = (level === t.lv);
        s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="20" fill="' + (on ? t.col : "#eee") + '" stroke="' + (hl ? "#d6465f" : "#888") + '" stroke-width="' + (hl ? 2.5 : 1) + '"/>';
        s += '<text x="' + (x + w + 8) + '" y="' + (y + 14) + '" fill="' + (on ? "#222" : "#aaa") + '">' + t.label + "</text>";
      });
      // ---- frame = 8 slots ----
      var fy = 125;
      s += '<text x="10" y="' + (fy - 8) + '" font-weight="700" fill="' + (level >= 3 ? "#333" : "#aaa") + '">② frame = 8 slots (TDMA: 8 사용자)</text>';
      for (var k = 0; k < 8; k++) {
        var on2 = level >= 3;
        var mine = (mode === "user" || mode === "data") && k === 0 && level >= 3;
        var col = mine ? "#1d65b3" : (on2 ? "#f7c8e0" : "#eee");
        s += '<rect x="' + (20 + k * 46) + '" y="' + fy + '" width="44" height="26" fill="' + col + '" stroke="' + (level === 3 ? "#d6465f" : "#888") + '" stroke-width="' + (level === 3 ? 2 : 1) + '"/>';
        s += '<text x="' + (20 + k * 46 + 22) + '" y="' + (fy + 17) + '" text-anchor="middle" fill="' + (mine ? "#fff" : "#444") + '">' + (k + 1) + "</text>";
      }
      s += '<text x="400" y="' + (fy + 17) + '" fill="' + (level >= 3 ? "#444" : "#aaa") + '">8 × 156.25 = 1250 bits</text>';
      if (mode !== "channel" && level >= 3) {
        s += '<text x="20" y="' + (fy + 42) + '" fill="#1d65b3" font-size="10">파란 slot = 한 사용자의 자리 (frame 마다 1개)</text>';
      }
      // ---- multiframe = 26 frames ----
      var my = 200;
      s += '<text x="10" y="' + (my - 8) + '" font-weight="700" fill="' + (level >= 4 ? "#333" : "#aaa") + '">③ multiframe = 26 frames (24 traffic + 2 control) = 120 ms</text>';
      for (var f = 0; f < 26; f++) {
        var on3 = level >= 4;
        var ctrl = CTRL[f];
        var c3 = !on3 ? "#eee" : (ctrl ? "#ffd84d" : (mode === "data" && level >= 5 ? "#1d65b3" : "#f7c8e0"));
        s += '<rect x="' + (20 + f * 22) + '" y="' + my + '" width="20" height="30" fill="' + c3 + '" stroke="' + (level === 4 ? "#d6465f" : "#888") + '" stroke-width="' + (level === 4 ? 2 : 1) + '"/>';
        if (on3 && ctrl) s += '<text x="' + (20 + f * 22 + 10) + '" y="' + (my + 19) + '" text-anchor="middle" font-size="9">C</text>';
      }
      s += '<line x1="20" y1="' + (my + 44) + '" x2="590" y2="' + (my + 44) + '" stroke="' + (level >= 5 ? "#333" : "#ccc") + '" marker-end="url(#ga)" marker-start="url(#ga)"/>';
      s += '<defs><marker id="ga" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" fill="#333"/></marker></defs>';
      s += '<text x="305" y="' + (my + 58) + '" text-anchor="middle" fill="' + (level >= 5 ? "#333" : "#aaa") + '">120 ms  (frame 1개 ≈ 4.615 ms)</text>';
      if (level >= 4) {
        s += '<rect x="20" y="' + (my + 70) + '" width="12" height="12" fill="#ffd84d" stroke="#888"/><text x="38" y="' + (my + 80) + '">C = control frame (2개)</text>';
        if (mode === "data") s += '<rect x="190" y="' + (my + 70) + '" width="12" height="12" fill="#1d65b3"/><text x="208" y="' + (my + 80) + '">user data 를 실은 traffic frame (24개)</text>';
      }
      // 결과
      if (level >= 6) {
        var res = mode === "channel" ? "channel bit rate = 270.833 kbps ≈ 270.8 kbps"
          : mode === "user" ? "사용자 1명(slot 1개) = 33.85 kbps"
          : "순수 user data = 13 kbps";
        s += '<rect x="20" y="' + (my + 92) + '" width="320" height="24" rx="4" fill="#fff3bf" stroke="#d6a017"/>';
        s += '<text x="180" y="' + (my + 108) + '" text-anchor="middle" font-weight="700">' + res + "</text>";
      }
      s += "</svg>";
      return s;
    };
  }

  global.SIMS["gsm_bitrate"] = {
    title: "GSM channel bit rate — slot → frame → multiframe (L10 p.25–26)",
    desc: "[[GSM 프레임 구조]]를 안쪽부터 쌓는다: slot 156.25 bits (65 → 114 → 156.25) → frame = 8 slots → [[GSM multiframe]] = 26 frames = 120 ms → [[GSM channel bit rate]] = (1/120 ms) × 26 × 8 × 156.25.",
    options: [
      { key: "mode", label: "계산 대상", values: [
        { value: "channel", label: "channel bit rate (슬라이드)" },
        { value: "user", label: "사용자 1명 (slot 1개) rate" },
        { value: "data", label: "순수 user data rate" }
      ] }
    ],
    build: function (opts) {
      var mode = opts.mode || "channel";
      var USER = 65, ERR = 114, SLOT = 156.25, NSLOT = 8, NFRAME = 26, NTRAFFIC = 24, T = 0.120;
      var frameBits = NSLOT * SLOT;            // 1250
      var multiBits = NFRAME * frameBits;      // 32500
      var chRate = multiBits / T;              // 270833.33 bps
      var userBits = NFRAME * SLOT;            // 4062.5
      var userRate = userBits / T;             // 33854.17 bps
      var dataBits = USER * NTRAFFIC;          // 1560
      var dataRate = dataBits / T;             // 13000 bps
      var frameMs = T * 1000 / NFRAME;         // 4.615 ms

      var lines = [
        "slot: user data = " + USER + " bits",
        "+ error control bits → " + ERR + " bits",
        "+ TDMA control bits → " + SLOT + " bits (slot 1개)",
        "frame = " + NSLOT + " slots → " + NSLOT + " × " + SLOT + " = " + frameBits + " bits",
        "multiframe = " + NFRAME + " frames (24 traffic + 2 control)",
        "multiframe duration = 120 ms (frame = 120/26 ≈ " + fmt(frameMs) + " ms)"
      ];
      if (mode === "channel") {
        lines.push("multiframe 비트 = " + NFRAME + " × " + NSLOT + " × " + SLOT + " = " + multiBits + " bits");
        lines.push("rate = " + multiBits + " bits ÷ 0.120 s = " + fmt(chRate, 2) + " bps");
        lines.push("= " + fmt(chRate / 1000) + " kbps ≈ 270.8 kbps");
      } else if (mode === "user") {
        lines.push("한 사용자 = frame 마다 slot 1개 → " + NFRAME + " × " + SLOT + " = " + userBits + " bits / 120 ms");
        lines.push("rate = " + userBits + " ÷ 0.120 s = " + fmt(userRate, 2) + " bps");
        lines.push("= " + fmt(userRate / 1000, 2) + " kbps (= 270.833 ÷ 8)");
      } else {
        lines.push("user data 는 traffic frame 24개에만: " + USER + " × " + NTRAFFIC + " = " + dataBits + " bits / 120 ms");
        lines.push("rate = " + dataBits + " ÷ 0.120 s = " + fmt(dataRate) + " bps");
        lines.push("= " + fmt(dataRate / 1000) + " kbps");
      }

      var vars = [
        { name: "slotBits", label: "slot 비트", group: "slot" },
        { name: "frameBits", label: "frame 비트 (8 slots)", group: "frame / multiframe" },
        { name: "frames", label: "multiframe 의 frame 수", group: "frame / multiframe" },
        { name: "duration", label: "multiframe 시간", group: "frame / multiframe" },
        { name: "bits", label: "120 ms 동안 세는 비트", group: "결과" },
        { name: "rate", label: "rate", group: "결과" }
      ];

      var st = { slotBits: "-", frameBits: "-", frames: "-", duration: "-", bits: "-", rate: "?" };
      var steps = [];
      function push(desc, pc, level, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(level, mode) });
      }

      st.slotBits = USER + " (user data)";
      push("slot 한 칸에는 먼저 '''user data 65 bits''' (디지털화된 음성)가 들어간다.", 1, 0);
      st.slotBits = ERR + " (+error control)";
      push("여기에 '''error control bits''' 를 붙이면 114 bits. 무선 채널은 오류가 많으니 FEC 용 여분이 필요하다.", 2, 1);
      st.slotBits = SLOT + " (+TDMA control)";
      push("다시 '''TDMA control bits'''(동기·guard 등)를 붙이면 '''156.25 bits''' — 이것이 slot 1개의 크기(슬라이드 p.25 'Each slot carries 156.25 bits'). 0.25 bit 는 guard period 를 비트 단위로 환산해서 생긴 소수다.", 3, 2);
      st.frameBits = frameBits;
      push("[[TDMA]]: slot 8개가 모여 '''frame''' 1개. 8 × 156.25 = 1250 bits. 즉 한 200 kHz 채널을 8 명이 시간으로 나눠 쓴다.", 4, 3);
      st.frames = "26 (24 traffic + 2 control)";
      push("frame 26개가 모여 '''multiframe''' 1개. 24개는 traffic(음성), 2개는 control frame 이다 (p.26 노란 박스).", 5, 4,
        mode === "data" ? "그림의 control frame 위치(13·26번째)는 실제 GSM 규격 기준. 슬라이드는 개수(2개)만 말한다." : undefined);
      st.duration = "120 ms";
      push("multiframe 하나의 길이는 '''120 ms'''. 그러면 frame 하나 = 120/26 ≈ 4.615 ms, slot 하나 ≈ 0.577 ms.", 6, 5);

      if (mode === "channel") {
        st.bits = multiBits;
        push("120 ms 동안 채널에 실리는 '''모든''' 비트: 26 × 8 × 156.25 = 32500 bits.", 7, 5);
        st.rate = fmt(chRate, 2) + " bps";
        push("rate = 비트 ÷ 시간 = 32500 ÷ 0.120 s = 270833.33 bps.", 8, 5);
        st.rate = fmt(chRate / 1000) + " kbps ≈ 270.8 kbps";
        push("'''channel bit rate ≈ 270.8 kbps''' — 슬라이드 공식 (1/120 ms) × 26 × 8 × 156.25 = 270.8 kbps 와 같다.", 9, 6,
          "시험 포인트: 곱하는 네 수의 의미 — 1/120 ms(multiframe 시간), 26(frame 수), 8(slot 수), 156.25(slot 비트).");
      } else if (mode === "user") {
        st.bits = userBits;
        push("사용자 한 명은 frame 마다 '''자기 slot 1개'''만 쓴다(파란 칸). multiframe 동안 26 × 156.25 = 4062.5 bits.", 7, 5);
        st.rate = fmt(userRate, 2) + " bps";
        push("rate = 4062.5 ÷ 0.120 s = 33854.17 bps.", 8, 5);
        st.rate = fmt(userRate / 1000, 2) + " kbps";
        push("'''사용자 1명 ≈ 33.85 kbps''' = channel bit rate 270.833 kbps ÷ 8. 8명이 한 채널을 똑같이 나눴으니 당연하다.", 9, 6,
          "이 값은 슬라이드에 없는 파생값이다(overhead 포함 rate).");
      } else {
        st.bits = dataBits;
        push("순수 user data 는 slot 안의 '''65 bits''' 뿐이고, control frame 2개에는 음성이 없다 → traffic frame 24개 × 65 = 1560 bits.", 7, 5);
        st.rate = fmt(dataRate) + " bps";
        push("rate = 1560 ÷ 0.120 s = 13000 bps.", 8, 5);
        st.rate = fmt(dataRate / 1000) + " kbps";
        push("'''순수 user data ≈ 13 kbps''' — GSM full-rate 음성 코덱 속도와 일치. 33.85 kbps 중 대부분이 error control·TDMA control·control frame 이라는 뜻이다.", 9, 6,
          "이 값은 p.25 그림의 Digitizer 출력 13 kbps 와 같다 — 65×24/120 ms 로 검산.");
      }

      return {
        panels: [{ id: "P", title: "손으로 푸는 순서", lang: "txt", lines: lines }],
        vars: vars,
        steps: steps
      };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
