window.SIMS = window.SIMS || {};
// handoff_signal — L10 p.14–16 Handoff: MSC 가 every few seconds 신호 세기 측정 → 약해지면 새 cell 탐색 → 채널 변경
// hard handoff (break before make) / soft handoff (make before break)
(function (global) {
  "use strict";

  var THR = -90;              // 임계값 (예시)
  var Y1 = "#e8b93c", Y1F = "#fbe7a8", G2 = "#3c9a50", G2F = "#cfe9d3", RED = "#d6465f";

  // 측정 회차별 예시 신호 세기 (dBm). 슬라이드에는 수치가 없다.
  var MEAS = [
    { pos: 0.10, s1: -60, s2: -105 },
    { pos: 0.22, s1: -68, s2: -100 },
    { pos: 0.34, s1: -76, s2: -94 },
    { pos: 0.46, s1: -84, s2: -88 },
    { pos: 0.56, s1: -88, s2: -84 },
    { pos: 0.66, s1: -93, s2: -78 },
    { pos: 0.78, s1: -98, s2: -72 },
    { pos: 0.90, s1: -104, s2: -66 }
  ];

  function hex(cx, cy, r, fill, stroke) {
    var p = [];
    for (var k = 0; k < 6; k++) {
      var a = Math.PI / 3 * k;
      p.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1));
    }
    return '<polygon points="' + p.join(" ") + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5" fill-opacity="0.9"/>';
  }
  function tower(x, y) {
    return '<path d="M' + x + "," + (y - 14) + " L" + (x - 7) + "," + (y + 10) + " L" + (x + 7) + "," + (y + 10) + ' Z" fill="#fff" stroke="#222" stroke-width="1.5"/>';
  }

  function makeSvg(hist, i, title) {
    return function () {
      var W = 640, H = 330, cur = hist[i], m = MEAS[cur.t];
      var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">';
      s += '<rect width="' + W + '" height="' + H + '" rx="8" fill="#fff"/>';
      s += '<text x="200" y="20" text-anchor="middle" font-weight="700" fill="#1d65b3">' + title + "</text>";
      // --- 지도: MSC + BS1/BS2 cell + MS ---
      var b1 = { x: 130, y: 130 }, b2 = { x: 270, y: 130 };
      s += '<rect x="165" y="32" width="70" height="28" rx="3" fill="#d9e8f8" stroke="#3b78c2" stroke-width="1.5"/>';
      s += '<text x="200" y="51" text-anchor="middle" font-weight="700">MSC</text>';
      s += '<line x1="190" y1="60" x2="' + b1.x + '" y2="' + (b1.y - 20) + '" stroke="#333"/>';
      s += '<line x1="210" y1="60" x2="' + b2.x + '" y2="' + (b2.y - 20) + '" stroke="#333"/>';
      s += hex(b1.x, b1.y, 72, Y1F, Y1) + hex(b2.x, b2.y, 72, G2F, G2);
      s += tower(b1.x, b1.y) + tower(b2.x, b2.y);
      s += '<text x="' + (b1.x - 40) + '" y="' + (b1.y + 5) + '" font-weight="700">BS1</text>';
      s += '<text x="' + (b2.x + 14) + '" y="' + (b2.y + 5) + '" font-weight="700">BS2</text>';
      var mx = 80 + 240 * m.pos, my = 165;
      if (cur.conn.indexOf("BS1") >= 0) s += '<line x1="' + mx + '" y1="' + my + '" x2="' + b1.x + '" y2="' + (b1.y + 8) + '" stroke="' + Y1 + '" stroke-width="4"/>';
      if (cur.conn.indexOf("BS2") >= 0) s += '<line x1="' + mx + '" y1="' + my + '" x2="' + b2.x + '" y2="' + (b2.y + 8) + '" stroke="' + G2 + '" stroke-width="4"/>';
      if (!cur.conn.length) s += '<text x="' + mx + '" y="' + (my - 18) + '" text-anchor="middle" font-weight="700" fill="' + RED + '">✕ 끊김</text>';
      s += '<rect x="' + (mx - 6) + '" y="' + (my - 11) + '" width="12" height="22" rx="3" fill="#fff" stroke="#222" stroke-width="1.5"/>';
      s += '<path d="M' + (mx + 10) + "," + my + " h22" + '" stroke="#222" stroke-width="1.5"/><path d="M' + (mx + 32) + "," + (my - 4) + " l6,4 l-6,4 z" + '" fill="#222"/>';
      s += '<text x="' + mx + '" y="' + (my + 26) + '" text-anchor="middle" font-size="11">MS</text>';

      // --- 신호 세기 막대 ---
      var gx = 430, gy0 = 50, gy1 = 210, lo = -110, hi = -50;
      var yv = function (v) { return gy1 - (gy1 - gy0) * (v - lo) / (hi - lo); };
      s += '<text x="525" y="38" text-anchor="middle" font-weight="700" font-size="12">MSC 측정값 (예시, dBm)</text>';
      s += '<line x1="' + gx + '" y1="' + gy1 + '" x2="620" y2="' + gy1 + '" stroke="#555"/>';
      [-110, -90, -70, -50].forEach(function (v) {
        s += '<text x="' + (gx - 4) + '" y="' + (yv(v) + 4) + '" text-anchor="end" font-size="10" fill="#555">' + v + "</text>";
      });
      [["BS1", m.s1, Y1, 470], ["BS2", m.s2, G2, 550]].forEach(function (b) {
        s += '<rect x="' + b[3] + '" y="' + yv(b[1]) + '" width="44" height="' + (gy1 - yv(b[1])) + '" fill="' + b[2] + '"/>';
        s += '<text x="' + (b[3] + 22) + '" y="' + (yv(b[1]) - 4) + '" text-anchor="middle" font-size="11" font-weight="700">' + b[1] + "</text>";
        s += '<text x="' + (b[3] + 22) + '" y="' + (gy1 + 14) + '" text-anchor="middle" font-weight="700">' + b[0] + "</text>";
      });
      s += '<line x1="' + gx + '" y1="' + yv(THR) + '" x2="620" y2="' + yv(THR) + '" stroke="' + RED + '" stroke-dasharray="5,3" stroke-width="1.5"/>';
      s += '<text x="' + (gx + 4) + '" y="' + (yv(THR) - 4) + '" text-anchor="start" font-size="10" fill="' + RED + '">임계값 ' + THR + "</text>";

      // --- 타임라인 (p.16 아래 그림처럼) ---
      var tx0 = 70, tx1 = 600, ty = 262, n = hist.length;
      var cw = (tx1 - tx0) / n;
      s += '<text x="' + (tx0 - 10) + '" y="' + (ty + 4) + '" text-anchor="end" font-weight="700" font-size="11">BS1</text>';
      s += '<text x="' + (tx0 - 10) + '" y="' + (ty + 28) + '" text-anchor="end" font-weight="700" font-size="11">BS2</text>';
      for (var j = 0; j <= i; j++) {
        var c = hist[j].conn, x = tx0 + j * cw;
        if (c.indexOf("BS1") >= 0) s += '<rect x="' + x + '" y="' + (ty - 6) + '" width="' + cw + '" height="12" fill="' + Y1F + '" stroke="' + Y1 + '"/>';
        if (c.indexOf("BS2") >= 0) s += '<rect x="' + x + '" y="' + (ty + 18) + '" width="' + cw + '" height="12" fill="' + G2F + '" stroke="' + G2 + '"/>';
        if (!c.length) s += '<rect x="' + x + '" y="' + (ty - 10) + '" width="' + cw + '" height="44" fill="' + RED + '" fill-opacity="0.25"/>';
        if (c.length === 2) s += '<rect x="' + x + '" y="' + (ty - 10) + '" width="' + cw + '" height="44" fill="' + G2 + '" fill-opacity="0.12"/>';
      }
      s += '<line x1="' + tx0 + '" y1="' + (ty + 42) + '" x2="' + tx1 + '" y2="' + (ty + 42) + '" stroke="#555"/>';
      s += '<text x="' + tx1 + '" y="' + (ty + 56) + '" text-anchor="end" font-size="10" fill="#555">Time (MSC 측정 회차)</text>';
      var xc = tx0 + (i + 0.5) * cw;
      s += '<path d="M' + xc + "," + (ty + 44) + " l-5,8 h10 z" + '" fill="' + RED + '"/>';
      return s + "</svg>";
    };
  }

  function connStr(c) { return "{" + c.join(", ") + "}"; }

  global.SIMS["handoff_signal"] = {
    title: "Handoff — 신호 세기 측정과 BS 전환",
    desc: "MS 가 BS1 cell 에서 BS2 cell 로 이동. MSC 가 every few seconds 측정한 신호 세기(가상 dBm 예시값 — 슬라이드에는 수치 없음, 임계값 −90 도 예시)에 따라 hard handoff(break before make) / soft handoff(make before break) 로 연결 BS 집합이 어떻게 바뀌는지.",
    options: [{ key: "type", label: "handoff 종류", values: [
      { value: "hard", label: "Hard handoff (break before make)" },
      { value: "soft", label: "Soft handoff (make before break)" }] }],
    build: function (opts) {
      var soft = opts.type === "soft";
      var proc = { id: "P", title: "Handoff 절차 (p.15)", lang: "txt", lines: [
        "MSC monitors the level of the signal every few seconds — MSC 가 몇 초마다 신호 세기 측정",
        "If the strength of the signal diminishes: — 신호가 약해지면",
        "The MSC seeks a new cell that can better accommodate the communication — 더 잘 수용할 새 cell 탐색",
        "Then it changes the channel carrying the call — 통화를 싣는 channel 변경"] };
      var kind = soft
        ? { id: "K", title: "Soft handoff (p.16)", lang: "txt", lines: [
          "An MS can communicate with two BSs at the same time — 동시에 두 BS 와 통신 가능",
          "Make before break: 새 BS2 먼저 연결 → {BS1, BS2}",
          "그 다음 옛 BS1 을 끊음 → {BS2} (끊김 없음)"] }
        : { id: "K", title: "Hard handoff (p.16)", lang: "txt", lines: [
          "An MS only communicates with one BS — 한 번에 BS 하나와만 통신",
          "Used in early systems — 초기 시스템(예: AMPS)",
          "Break before make: BS1 먼저 끊음 → {} (짧은 끊김)",
          "그 다음 BS2 연결 → {BS2}"] };

      // hist: { t: 측정 회차, conn, pcP, pcK, st, d }
      var h = [];
      function add(t, conn, pcP, pcK, st, d, note) { h.push({ t: t, conn: conn, pcP: pcP, pcK: pcK, st: st, d: d, note: note }); }
      var m = MEAS;
      add(0, ["BS1"], 1, 1, "BS1 로 통화 중",
        "MS 가 BS1 cell 안에서 통화 중. [[handoff]] = 사용자가 cell 을 넘어갈 때 '''active call 을 끊지 않고''' 한 BS 에서 다른 BS 로 넘기는 과정(p.14). MSC 는 '''every few seconds''' 신호 세기를 잰다. 측정값 BS1 " + m[0].s1 + " / BS2 " + m[0].s2 + " dBm (예시값).");
      add(1, ["BS1"], 1, 1, "BS1 로 통화 중",
        "MS 가 오른쪽(BS2 쪽)으로 이동. BS1 " + m[1].s1 + " dBm 으로 약해지고 BS2 " + m[1].s2 + " dBm 은 아직 임계값(−90, 예시) 아래.");
      add(2, ["BS1"], 2, 1, "BS1 약해지는 중",
        "BS1 " + m[2].s1 + ", BS2 " + m[2].s2 + " dBm. '''If the strength of the signal diminishes''' — BS1 신호가 계속 줄어드는 것을 MSC 가 본다.");
      if (soft) {
        add(3, ["BS1", "BS2"], 3, 2, "두 BS 와 동시 통신",
          "BS2 가 " + m[3].s2 + " dBm 으로 임계값을 넘었다. MSC 가 '''better accommodate''' 할 새 cell(BS2)을 찾고, [[soft handoff]] 는 BS1 을 '''유지한 채''' BS2 채널을 '''먼저 추가''' → 연결 집합 {BS1, BS2}. 이것이 '''make before break'''.");
        add(4, ["BS1", "BS2"], 3, 2, "두 BS 와 동시 통신",
          "BS1 " + m[4].s1 + " / BS2 " + m[4].s2 + " dBm. MS 는 두 BS 와 '''at the same time''' 통신한다 (cell 경계 구간). IS-95 는 모든 BS 가 pilot channel 을 계속 방송해서 MS 가 이웃 cell 신호를 감지할 수 있기 때문에 이게 가능하다(p.32).");
        add(5, ["BS2"], 4, 3, "BS2 로 통화 중",
          "BS1 이 " + m[5].s1 + " dBm 으로 임계값 아래 → 옛 연결 BS1 을 '''이제야''' 끊는다 → {BS2}. 통화가 '''한순간도 끊기지 않았다'''.");
        add(6, ["BS2"], 1, 3, "BS2 로 통화 중",
          "handoff 완료. 이후 MSC 는 다시 BS2 신호를 몇 초마다 감시한다. 최종 흐름: '''{BS1} → {BS1, BS2} → {BS2}'''.",
          "신호 세기 dBm 값과 임계값 −90 은 설명용 예시다(슬라이드에 수치 없음). 슬라이드 p.16 의 핵심은 hard = one BS, break before make / soft = two BSs at the same time, make before break.");
      } else {
        add(3, ["BS1"], 2, 1, "BS1 로 통화 중",
          "BS2 (" + m[3].s2 + " dBm) 가 더 잘 들리기 시작했지만, [[hard handoff]] 에서 MS 는 '''only one BS''' 와만 통신하므로 아직 BS1 유지.");
        add(4, ["BS1"], 2, 1, "BS1 로 통화 중",
          "BS1 " + m[4].s1 + " / BS2 " + m[4].s2 + " dBm. BS1 이 임계값에 거의 닿았다.");
        add(5, ["BS1"], 3, 2, "새 cell 탐색",
          "BS1 이 " + m[5].s1 + " dBm 으로 임계값(−90) 아래! MSC 가 '''seeks a new cell''' → BS2 가 가장 강하다(" + m[5].s2 + " dBm).");
        add(5, [], 4, 3, "끊김 (채널 변경 중)",
          "MSC 가 '''changes the channel'''. hard handoff 는 '''break before make''': BS1 연결을 '''먼저 끊고''' → 연결 집합 {} — 아주 짧은 끊김(p.16 그림의 빨간 틈).");
        add(6, ["BS2"], 4, 4, "BS2 로 통화 중",
          "그 다음 BS2 채널로 연결(make) → {BS2}. 초기 시스템(early systems)이 이 방식.");
        add(7, ["BS2"], 1, 4, "BS2 로 통화 중",
          "handoff 완료. 최종 흐름: '''{BS1} → {} (짧은 끊김) → {BS2}'''. 다시 MSC 가 BS2 신호를 몇 초마다 감시.",
          "신호 세기 dBm 값과 임계값 −90 은 설명용 예시다(슬라이드에 수치 없음). 끊김 구간 길이도 과장해서 한 칸으로 그렸다.");
      }
      var title = soft ? "Soft handoff — make before break" : "Hard handoff — break before make";
      var steps = h.map(function (e, i) {
        var mm = MEAS[e.t];
        var step = {
          desc: e.d,
          pc: { P: e.pcP, K: e.pcK },
          vars: {
            "측정 회차": "t" + e.t,
            "MS 위치": e.t <= 2 ? "BS1 cell" : (e.t <= 4 ? "cell 경계 부근" : "BS2 cell"),
            "BS1 신호": mm.s1 + " dBm",
            "BS2 신호": mm.s2 + " dBm",
            "임계값": THR + " dBm (예시)",
            "연결 BS": connStr(e.conn),
            "상태": e.st
          },
          status: { K: !e.conn.length ? "끊김" : (e.conn.length === 2 ? "2 BS" : e.conn[0]) },
          svg: makeSvg(h, i, title)
        };
        if (e.note) step.note = e.note;
        return step;
      });
      return {
        panels: [proc, kind],
        vars: [
          { name: "측정 회차", group: "이동" }, { name: "MS 위치", group: "이동" },
          { name: "BS1 신호", group: "측정 (예시값)" }, { name: "BS2 신호", group: "측정 (예시값)" }, { name: "임계값", group: "측정 (예시값)" },
          { name: "연결 BS", group: "연결" }, { name: "상태", group: "연결" }
        ],
        steps: steps
      };
    }
  };
})(window);
