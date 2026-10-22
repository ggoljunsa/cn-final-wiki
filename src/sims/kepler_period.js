// kepler_period — L11 p.5–10 Kepler's law: Period (s) = (1/100) × distance^1.5, distance = 고도 + 6378 km
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  var R_EARTH = 6378;

  function comma(n) {
    var neg = n < 0; n = Math.abs(n);
    var s = String(Math.round(n));
    var out = "";
    while (s.length > 3) { out = "," + s.slice(-3) + out; s = s.slice(0, -3); }
    return (neg ? "-" : "") + s + out;
  }
  function fx(x, d) { return String(Number(x.toFixed(d))); }

  var CASES = {
    moon: { h: 384000, name: "Example 5.1 — 달 (moon)", short: "달", addR: true },
    geo: { h: 35786, name: "Example 5.2 — GEO 위성", short: "GEO", addR: true },
    meo: { h: 18000, name: "MEO — GPS 위성", short: "MEO (GPS)", addR: true },
    leo: { h: 550, name: "LEO — Starlink 위성", short: "LEO (Starlink)", addR: true },
    trap: { h: 384000, name: "함정 — 달, 반지름을 안 더함", short: "달 (틀린 풀이)", addR: false }
  };

  // 그림: 지구 + 궤도. 반지름 R 과 고도 h 를 따로 표시 (축척 아님)
  function makeSvg(level, c, dist) {
    return function () {
      var W = 620, H = 300;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">';
      s += '<defs><marker id="kp_ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#333"/></marker></defs>';
      var cx = 150, cy = 160, rE = 60, rO = 125;
      // 궤도
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rO + '" fill="none" stroke="#777" stroke-dasharray="5 4"/>';
      // 지구
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rE + '" fill="#dbe8f7" stroke="#1d65b3" stroke-width="2"/>';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="#1d65b3"/>';
      s += '<text x="' + cx + '" y="' + (cy + 20) + '" text-anchor="middle" fill="#1d65b3">Earth 중심</text>';
      // 위성 (오른쪽)
      var sx = cx + rO, sy = cy;
      s += '<rect x="' + (sx - 7) + '" y="' + (sy - 7) + '" width="14" height="14" fill="#fdeec2" stroke="#e09a40" stroke-width="2"/>';
      s += '<text x="' + sx + '" y="' + (sy - 14) + '" text-anchor="middle" font-weight="700" fill="#e09a40">' + c.short + '</text>';
      // 반지름 R (중심 → 표면)
      var showR = c.addR ? level >= 1 : false;
      var rCol = showR ? "#1d65b3" : (c.addR ? "#bbb" : "#d6465f");
      s += '<line x1="' + cx + '" y1="' + (cy + 40) + '" x2="' + (cx + rE) + '" y2="' + (cy + 40) + '" stroke="' + rCol + '" stroke-width="2"' + (c.addR || level < 1 ? '' : ' stroke-dasharray="3 3"') + '/>';
      s += '<text x="' + (cx + rE / 2) + '" y="' + (cy + 56) + '" text-anchor="middle" fill="' + rCol + '">R = 6378</text>';
      // 고도 h (표면 → 위성)
      s += '<line x1="' + (cx + rE) + '" y1="' + cy + '" x2="' + (sx - 8) + '" y2="' + cy + '" stroke="#e09a40" stroke-width="2.5"/>';
      s += '<text x="' + (cx + rE + (rO - rE) / 2) + '" y="' + (cy - 6) + '" text-anchor="middle" fill="#a8661a">h = ' + comma(c.h) + '</text>';
      // distance 화살표 (중심 → 위성)
      if (level >= 1) {
        var dCol = c.addR ? "#2e9e4f" : "#d6465f";
        s += '<line x1="' + cx + '" y1="' + (cy + 80) + '" x2="' + (sx - 2) + '" y2="' + (cy + 80) + '" stroke="' + dCol + '" stroke-width="2" marker-end="url(#kp_ar)" marker-start="url(#kp_ar)"/>';
        s += '<text x="' + (cx + rO / 2) + '" y="' + (cy + 98) + '" text-anchor="middle" font-weight="700" fill="' + dCol + '">' +
          (c.addR ? "distance = h + R = " + comma(dist) + " km" : "distance = h 만 = " + comma(dist) + " km ✗") + '</text>';
      }
      // 오른쪽 계산 칸
      var x0 = 320;
      s += '<text x="' + x0 + '" y="30" font-weight="700" fill="#333">Kepler\'s law</text>';
      s += '<text x="' + x0 + '" y="50" fill="#333">Period (s) = (1/100) × distance^1.5</text>';
      s += '<text x="' + x0 + '" y="68" fill="#777" font-size="11">distance = 지구 중심부터의 거리 (km)</text>';
      var rows = [
        [1, "distance", comma(dist) + " km"],
        [2, "√distance", fx(Math.sqrt(dist), 2)],
        [3, "distance^1.5", comma(Math.pow(dist, 1.5))],
        [4, "× 1/100", comma(Math.pow(dist, 1.5) / 100) + " s"]
      ];
      rows.forEach(function (r, i) {
        var y = 100 + i * 30, on = level >= r[0], hl = level === r[0];
        s += '<rect x="' + x0 + '" y="' + (y - 16) + '" width="280" height="24" rx="4" fill="' + (hl ? "#fff3bf" : "#fafafa") + '" stroke="' + (hl ? "#d6a017" : "#ddd") + '"/>';
        s += '<text x="' + (x0 + 8) + '" y="' + y + '" fill="' + (on ? "#333" : "#bbb") + '">' + r[1] + '</text>';
        s += '<text x="' + (x0 + 272) + '" y="' + y + '" text-anchor="end" font-weight="700" fill="' + (on ? "#222" : "#bbb") + '">' + (on ? r[2] : "?") + '</text>';
      });
      if (level >= 5) {
        var ok = c.addR;
        s += '<rect x="' + x0 + '" y="222" width="280" height="30" rx="5" fill="' + (ok ? "#dff3e4" : "#fbe3e7") + '" stroke="' + (ok ? "#2e9e4f" : "#d6465f") + '"/>';
        s += '<text x="' + (x0 + 140) + '" y="242" text-anchor="middle" font-weight="700" fill="' + (ok ? "#1d6b2a" : "#d6465f") + '">' + c.result + '</text>';
      }
      s += '<text x="10" y="290" fill="#999" font-size="10">그림은 축척이 아님 (R 과 h 를 구분해 보이려는 개념도)</text>';
      s += '</svg>';
      return s;
    };
  }

  global.SIMS["kepler_period"] = {
    title: "Kepler's law — 고도 h 로 위성 주기 구하기 (L11 p.6–10)",
    desc: "[[Kepler's law]]: Period(s) = (1/100) × distance^1.5. distance 는 '''지구 중심부터'''의 거리라서 고도 h 에 지구 반지름 6378 km 를 더한다. [[Example 5.1 달의 주기]] · [[Example 5.2 정지궤도 주기]] 와 [[MEO]] · [[LEO]] 를 같은 순서로 손계산한다.",
    options: [
      { key: "obj", label: "대상", values: [
        { value: "moon", label: "Ex 5.1 달 (h = 384,000 km)" },
        { value: "geo", label: "Ex 5.2 GEO (h = 35,786 km)" },
        { value: "meo", label: "MEO GPS (h ≈ 18,000 km)" },
        { value: "leo", label: "LEO Starlink (h = 550 km)" },
        { value: "trap", label: "함정: 반지름 안 더함 (달)" }
      ] }
    ],
    build: function (opts) {
      var key = opts.obj || "moon";
      var c = CASES[key];
      var dist = c.addR ? c.h + R_EARTH : c.h;
      var root = Math.sqrt(dist);
      var p15 = Math.pow(dist, 1.5);
      var T = p15 / 100;
      var Tr = Math.round(T);

      // 단위 환산
      var conv, convLine, result, meaning, noteEnd;
      if (key === "moon" || key === "trap") {
        var days = T / 86400;
        conv = fx(days, 1) + " 일";
        convLine = comma(Tr) + " s ÷ 86,400 (s/일) ≈ " + fx(days, 1) + " 일";
      } else if (key === "leo") {
        var mins = T / 60;
        conv = fx(mins, 1) + " min";
        convLine = comma(Tr) + " s ÷ 60 ≈ " + fx(mins, 1) + " min";
      } else {
        var hrs = T / 3600;
        var hd = key === "geo" ? 2 : 1;
        conv = fx(hrs, hd) + " h";
        convLine = comma(Tr) + " s ÷ 3,600 ≈ " + fx(hrs, hd) + " h";
      }
      if (key === "moon") {
        result = comma(Tr) + " s ≈ " + conv + " ≈ 1 month";
        meaning = "'''≈ 1 month''' — 슬라이드 답 2,439,090 s = 1 month. 마지막 자리 1 차이는 반올림 차이(2,439,090.99…)일 뿐이다.";
        noteEnd = "시험 포인트: 384,000 은 '지구 위' 거리(above the Earth) → 반지름 6378 을 '''반드시 더한다'''.";
      } else if (key === "geo") {
        result = comma(Tr) + " s ≈ " + conv + " ≈ 24 h";
        meaning = "'''≈ 24 h''' = 지구 자전 주기와 같다 → 지구에서 보면 멈춰 있는 위성 = [[geostationary]] orbit, 즉 [[GEO]] (슬라이드 86,579 s = 24 h).";
        noteEnd = "p.16 본문은 GEO 고도를 '22,000 miles (≈ 35405 km)' 로 적는다. Kepler 예제(Ex 5.2)는 35,786 km 를 쓴다 — 둘 다 근사값.";
      } else if (key === "meo") {
        result = comma(Tr) + " s ≈ " + conv;
        meaning = "'''≈ 10.6 h''' — 하루에 지구를 두 바퀴 남짓 돈다. GPS 같은 [[MEO]] 위성은 지상에서 보면 천천히 움직인다.";
        noteEnd = "이 값은 슬라이드에 없는 파생값이다 (p.18 'altitude about 18,000 km' 에 같은 공식을 적용).";
      } else if (key === "leo") {
        result = comma(Tr) + " s ≈ " + conv;
        meaning = "'''≈ 96 min''' — 슬라이드 p.20 'rotation period of 90 to 120 min' 범위 안. [[LEO]] 는 빠르게 지나가므로 footprint 가 계속 움직인다.";
        noteEnd = "이 값은 슬라이드에 없는 파생값이다 (Starlink 고도 550 km 가정). 범위 양 끝: h=500 → 5,704 s ≈ 95 min, h=2000 → 7,669 s ≈ 128 min.";
      } else {
        result = comma(Tr) + " s — 틀린 값";
        meaning = "'''틀린 값''' 2,379,561 s (≈ " + conv + "). 정답 2,439,091 s 보다 약 59,530 s(≈ 0.7 일) 작다. 반지름을 빼먹으면 distance 가 작아져서 주기도 짧게 나온다.";
        noteEnd = "distance 는 '''지구 중심'''부터의 거리다. 문제의 '384,000 km above the Earth' 는 표면부터의 고도 → h + 6378 로 바꿔야 한다. 달에서는 차이가 2.4% 지만 LEO(550 km)에서 빼먹으면 550^1.5/100 ≈ 129 s 로, 정답 5,766 s 의 약 1/45 이 된다.";
      }
      c.result = result;

      var lines = [
        "문제: 고도 h = " + comma(c.h) + " km (지표면 위)",
        c.addR ? "distance = h + 6378 = " + comma(c.h) + " + 6,378 = " + comma(dist) + " km"
               : "distance = h = " + comma(dist) + " km   ✗ (반지름 안 더함)",
        "√distance = √" + comma(dist) + " ≈ " + fx(root, 2),
        "distance^1.5 = distance × √distance ≈ " + comma(dist) + " × " + fx(root, 2) + " ≈ " + comma(p15),
        "Period = (1/100) × " + comma(p15) + " ≈ " + comma(Tr) + " s",
        convLine
      ];

      var vars = [
        { name: "h", label: "고도 h (km)", group: "입력" },
        { name: "R", label: "지구 반지름 R (km)", group: "입력" },
        { name: "dist", label: "distance (km)", group: "계산" },
        { name: "root", label: "√distance", group: "계산" },
        { name: "pow", label: "distance^1.5", group: "계산" },
        { name: "T", label: "Period (s)", group: "결과" },
        { name: "conv", label: "환산", group: "결과" }
      ];
      var st = { h: comma(c.h), R: "6,378", dist: "?", root: "-", pow: "-", T: "?", conv: "-" };
      var steps = [];
      function push(desc, pc, level, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(level, c, dist) });
      }

      push("'''" + c.name + "''': 지표면 위 고도 h = " + comma(c.h) + " km. [[Kepler's law]] 는 Period(s) = C × distance^1.5, C ≈ 1/100, distance 단위 km, period 단위 seconds.", 1, 0);
      if (c.addR) {
        st.dist = comma(dist);
        push("distance 는 '''지구 중심'''에서 위성까지의 거리다. 고도 h 에 지구 반지름 6378 km 를 더한다: " + comma(c.h) + " + 6,378 = '''" + comma(dist) + " km'''.", 2, 1);
      } else {
        st.dist = comma(dist) + " ✗";
        push("(틀린 풀이) 고도 h 를 그대로 distance 로 넣었다: distance = " + comma(dist) + " km. 그림의 빨간 점선 — 지구 반지름 6378 km 가 빠졌다.", 2, 1,
          "여기가 실수 지점: distance 는 지구 중심부터 잰다.");
      }
      st.root = fx(root, 2);
      push("지수 1.5 = 1 + 0.5 이므로 distance^1.5 = distance × √distance. 먼저 √" + comma(dist) + " ≈ '''" + fx(root, 2) + "'''.", 3, 2);
      st.pow = comma(p15);
      push("distance × √distance = " + comma(dist) + " × " + fx(root, 2) + " ≈ '''" + comma(p15) + "'''.", 4, 3);
      st.T = comma(Tr) + " s";
      push("C ≈ 1/100 을 곱한다(100 으로 나눈다): Period ≈ '''" + comma(Tr) + " s'''.", 5, 4);
      st.conv = conv;
      push(convLine + ". " + meaning, 6, 5, noteEnd);

      return {
        panels: [{ id: "P", title: "손으로 푸는 순서", lang: "txt", lines: lines }],
        vars: vars,
        steps: steps
      };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
