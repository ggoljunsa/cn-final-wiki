window.SIMS = window.SIMS || {};
// reuse_pattern — L10 p.11 Frequency Reuse Principle (N = 4 / 7) + p.31 IS-95 frequency reuse factor 1
(function (global) {
  "use strict";

  // 그룹 번호별 색 (1..7)
  var COL = ["", "#f7d84a", "#f4a6c0", "#9fd36a", "#7cc3ea", "#f3a35c", "#b9a3e3", "#7fd8c3"];
  var R = 30, S3 = Math.sqrt(3);
  // flat-top 육각형, axial 좌표 (q, r)
  function px(q, r) { return { x: 1.5 * R * q, y: S3 * R * (r + q / 2) }; }
  var NB = [[0, -1], [1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0]];
  function hexPts(cx, cy, rr) {
    var p = [];
    for (var k = 0; k < 6; k++) {
      var a = Math.PI / 3 * k;
      p.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return p.join(" ");
  }

  // cluster 모양 (중심 기준 offset → 그룹 번호) — p.11 그림의 배치를 따름
  var SHAPE = {
    "4": [[0, 0, 1], [0, -1, 2], [1, -1, 3], [-1, 0, 4]],             // 1 아래, 2 위, 3 오른쪽 위, 4 왼쪽 위
    "7": [[0, 0, 1], [0, -1, 2], [1, -1, 3], [1, 0, 4], [0, 1, 5], [-1, 1, 6], [-1, 0, 7]],  // 1 가운데, 2..7 시계방향
    "1": [[0, 0, 1], [0, -1, 1], [1, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 1, 1], [-1, 0, 1]]
  };
  // cluster 중심 (co-channel lattice 위의 점)
  var CENTERS = {
    "4": [[0, 0, "A"], [2, 0, "B"], [0, 2, "C"]],
    "7": [[0, 0, "A"], [2, 1, "B"], [-1, 3, "C"]],
    "1": [[0, 0, "A"]]
  };

  function layout(N) {
    var cells = [];
    CENTERS[N].forEach(function (c) {
      SHAPE[N].forEach(function (o, k) {
        cells.push({ q: c[0] + o[0], r: c[1] + o[1], g: o[2], cl: c[2], code: k + 1 });
      });
    });
    return cells;
  }
  function key(q, r) { return q + "," + r; }

  function makeSvg(cells, placed, cur, N, title, finalMsg) {
    return function () {
      var pts = cells.map(function (c) { return px(c.q, c.r); });
      var minx = Math.min.apply(null, pts.map(function (p) { return p.x; })) - R - 10;
      var maxx = Math.max.apply(null, pts.map(function (p) { return p.x; })) + R + 10;
      var miny = Math.min.apply(null, pts.map(function (p) { return p.y; })) - R - 34;
      var maxy = Math.max.apply(null, pts.map(function (p) { return p.y; })) + R + (finalMsg ? 34 : 12);
      if (maxx - minx < 400) { var pad = (400 - (maxx - minx)) / 2; minx -= pad; maxx += pad; }
      var W = maxx - minx, H = maxy - miny, wpx = Math.min(560, Math.round(W * 1.15));
      var s = '<svg viewBox="' + minx.toFixed(1) + " " + miny.toFixed(1) + " " + W.toFixed(1) + " " + H.toFixed(1) + '" width="' + wpx + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">';
      s += '<rect x="' + minx + '" y="' + miny + '" width="' + W + '" height="' + H + '" rx="8" fill="#fff"/>';
      s += '<text x="' + (minx + W / 2) + '" y="' + (miny + 20) + '" text-anchor="middle" font-weight="700" fill="#1d65b3">' + title + "</text>";
      var curNb = {};
      if (cur >= 0) NB.forEach(function (d) { curNb[key(cells[cur].q + d[0], cells[cur].r + d[1])] = true; });
      cells.forEach(function (c, i) {
        var p = px(c.q, c.r), on = i < placed;
        var stroke = "#777", sw = 1.2, dash = "";
        if (!on) { stroke = "#bbb"; dash = ' stroke-dasharray="4,3"'; }
        if (on && curNb[key(c.q, c.r)]) { stroke = "#e08a1e"; sw = 2.5; }
        s += '<polygon points="' + hexPts(p.x, p.y, R - 1) + '" fill="' + (on ? COL[c.g] : "#f5f6f7") + '" stroke="' + stroke + '" stroke-width="' + sw + '"' + dash + "/>";
        if (on) {
          s += '<text x="' + p.x + '" y="' + (p.y + (N === "1" ? 0 : 5)) + '" text-anchor="middle" font-weight="700">' + (N === "1" ? "f" : "") + c.g + "</text>";
          if (N === "1") s += '<text x="' + p.x + '" y="' + (p.y + 14) + '" text-anchor="middle" font-size="9" fill="#333">code ' + c.code + "</text>";
        }
      });
      if (cur >= 0) {
        var pc = px(cells[cur].q, cells[cur].r);
        s += '<polygon points="' + hexPts(pc.x, pc.y, R - 2) + '" fill="none" stroke="#d6465f" stroke-width="3"/>';
      }
      if (finalMsg) s += '<text x="' + (minx + W / 2) + '" y="' + (maxy - 12) + '" text-anchor="middle" font-weight="700" fill="#d6465f">' + finalMsg + "</text>";
      return s + "</svg>";
    };
  }

  global.SIMS["reuse_pattern"] = {
    title: "Frequency reuse pattern — reuse factor N 배치",
    desc: "p.11 그림처럼 육각 cell 에 주파수 그룹 1..N 을 한 cell 씩 배치하며 '같은 번호 cell 끼리 인접하지 않음'을 확인. 마지막에 AMPS voice 채널 395 개를 N 으로 나눈 cell 당 채널 수(파생값). N = 1 은 IS-95(p.31): 모든 cell 이 같은 대역, code 로 구분.",
    options: [{ key: "N", label: "reuse factor N", values: [
      { value: "4", label: "N = 4 (p.11 a)" },
      { value: "7", label: "N = 7 (p.11 b, AMPS)" },
      { value: "1", label: "N = 1 (IS-95 CDMA, p.31)" }] }],
    build: function (opts) {
      var N = String(opts.N || "4"), n = parseInt(N, 10), cdma = N === "1";
      var cells = layout(N);
      var panels = cdma
        ? [{ id: "P", title: "IS-95 frequency reuse (p.31)", lang: "txt", lines: [
          "Frequency reuse factor: normally 1 — reuse factor 보통 1",
          "→ Neighboring cells can use the same freq. band! — 이웃 cell 도 같은 대역 사용",
          "cell 하나씩 배치: 전부 같은 대역 f1",
          "Why? The interference from neighboring cells cannot affect CDMA or DSSS transmission",
          "→ cell 당 사용 대역 = 전 대역 (사용자는 code 로 구분)"] }]
        : [{ id: "P", title: "Frequency reuse principle (p.11)", lang: "txt", lines: [
          "Neighboring cells cannot use the same set of frequencies — 이웃 cell 은 같은 주파수 집합 금지",
          "Interference for the users located near the cell boundaries — 경계 사용자에게 간섭",
          "A frequency reuse pattern is a configuration of N cells — N 개 cell 이 한 패턴",
          "N is the reuse factor — 그 N 이 reuse factor",
          "cell 하나에 그룹 번호 배치 → 이웃 6 칸에 같은 번호 없는지 확인",
          "cell 당 채널 수 = 전체 채널 ÷ N"] }];
      var vars = [
        { name: "N (reuse factor)", group: "패턴" },
        { name: "배치한 cell", group: "패턴" },
        { name: "현재 cell", group: "확인" },
        { name: "이웃 6칸 번호", group: "확인" },
        { name: "같은 번호 이웃", group: "확인" },
        { name: "전체 채널", group: "채널" },
        { name: "cell 당 채널", group: "채널" }
      ];
      var title = cdma ? "IS-95: reuse factor 1" : "Reuse factor of " + N;
      var total = cdma ? "1.228 MHz 채널 (IS-95)" : "395 (AMPS voice)";
      var steps = [];
      var pos = {};
      function V(placed, curTxt, nbTxt, same, perCell) {
        return { "N (reuse factor)": N, "배치한 cell": placed + " / " + cells.length, "현재 cell": curTxt,
          "이웃 6칸 번호": nbTxt, "같은 번호 이웃": same, "전체 채널": total, "cell 당 채널": perCell };
      }
      steps.push({
        desc: cdma
          ? "[[IS-95 frequency reuse]]: IS-95 의 [[reuse factor]] 는 '''normally 1''' (p.31). 즉 이웃 cell 도 '''같은 주파수 대역'''을 쓴다. 7 개 cell 에 하나씩 배치해 보자."
          : "[[frequency reuse]]: 이웃 cell 이 같은 주파수 집합을 쓰면 cell 경계 근처 사용자에게 '''interference'''([[co-channel interference]]) 가 생긴다. 그래서 전체 채널을 '''N 개 그룹'''으로 나누고, N 개 cell 묶음(pattern)마다 그룹 1..N 을 하나씩 준다. 이 N 이 [[reuse factor]]. 이제 cell 을 하나씩 칠해 본다 (cluster " + CENTERS[N].map(function (c) { return c[2]; }).join("·") + ").",
        pc: { P: cdma ? 1 : 1 },
        vars: V(0, "-", "-", "-", "?"),
        svg: makeSvg(cells, 0, -1, N, title, null)
      });
      var allOk = true;
      cells.forEach(function (c, i) {
        pos[key(c.q, c.r)] = c.g;
        var nb = [], same = [];
        NB.forEach(function (d) {
          var g = pos[key(c.q + d[0], c.r + d[1])];
          if (g !== undefined) { nb.push(g); if (g === c.g) same.push(g); }
        });
        // 아직 안 칠한 이웃은 다음 cell 에서 검사되므로 '이미 칠한 이웃'만 보면 전체 검사와 같다
        if (same.length && !cdma) allOk = false;
        var nbTxt = nb.length ? nb.join(", ") : "(아직 없음)";
        var desc;
        if (cdma) {
          desc = "cell " + (i + 1) + " 에 대역 '''f1''' (같은 대역). 이웃 " + nb.length + " 칸도 전부 f1 — FDMA 였다면 간섭이지만, IS-95 는 [[CDMA]]/[[DSSS]] 라서 cell(사용자)을 '''code''' 로 구분한다.";
        } else {
          desc = "cluster " + c.cl + " 의 cell 에 그룹 '''" + c.g + "''' 배치. 이미 칠한 이웃 6 칸의 번호: " + nbTxt + " → " +
            (same.length ? "'''같은 번호 이웃 있음 ✗'''" : "같은 번호 없음 ✓") + ".";
          if (c.g === 1 && c.cl !== "A") desc += " 그룹 1 이 다시 쓰였지만 다른 1 과는 cell 몇 칸 떨어져 있다 — 이것이 '''reuse'''.";
        }
        steps.push({
          desc: desc,
          pc: { P: cdma ? 3 : 5 },
          vars: V(i + 1, "cluster " + c.cl + " · 그룹 " + c.g, cdma ? nbTxt.replace(/1/g, "f1") : nbTxt, cdma ? (nb.length ? "있음 (code 로 구분)" : "-") : (same.length ? "있음 ✗" : "없음 ✓"), "?"),
          svg: makeSvg(cells, i + 1, i, N, title, null)
        });
      });
      if (cdma) {
        steps.push({
          desc: "'''Why?''' The interference from neighboring cells cannot affect CDMA or DSSS transmission (p.31) — 신호를 넓은 대역에 퍼뜨리고 code 로 꺼내므로, 이웃 cell 신호는 code 가 안 맞아 잡음 수준으로만 보인다.",
          pc: { P: 4 },
          vars: V(cells.length, "전체", "전부 f1", "있음 (code 로 구분)", "?"),
          svg: makeSvg(cells, cells.length, -1, N, title, null)
        });
        steps.push({
          desc: "결론: N = 1 → 모든 cell 이 '''전 대역'''을 쓴다(나눌 필요 없음). 같은 대역 안의 사용자는 [[Walsh code]] 로 구분. 비교: AMPS(N = 7)는 cell 마다 1/7 만 쓴다.",
          pc: { P: 5 },
          vars: V(cells.length, "전체", "전부 f1", "있음 (code 로 구분)", "전 대역 (code 로 구분)"),
          svg: makeSvg(cells, cells.length, -1, N, title, "N = 1 → cell 당 전 대역 (code 로 구분)"),
          note: "cell 안의 'code k' 라벨은 그림 설명용이다. 슬라이드 p.31 은 '이웃 cell 간섭이 CDMA/DSSS 전송에 영향을 못 준다'까지만 말한다."
        });
      } else {
        var per = Math.floor(395 / n), exact = (395 / n).toFixed(2);
        steps.push({
          desc: "전체 " + cells.length + " cell 확인 완료: " + (allOk ? "'''같은 번호 cell 끼리 인접한 곳이 하나도 없다 ✓'''" : "인접한 같은 번호가 있다 ✗") +
            ". 같은 번호(같은 주파수 그룹) cell 은 항상 다른 번호 cell 로 가로막혀 있다.",
          pc: { P: 3 },
          vars: V(cells.length, "전체", "-", allOk ? "없음 ✓" : "있음 ✗", "?"),
          svg: makeSvg(cells, cells.length, -1, N, title, null)
        });
        steps.push({
          desc: "채널 수: AMPS 의 provider 당 voice 채널 395 개(= 416 − 21 control)를 N = " + N + " 그룹으로 나누면 cell 당 395 / " + N + " = " + exact + " → '''약 " + per + " 개'''. N 이 클수록 간섭은 줄지만 cell 당 채널이 줄어든다(trade-off).",
          pc: { P: 6 },
          vars: V(cells.length, "전체", "-", allOk ? "없음 ✓" : "있음 ✗", "395 / " + N + " ≈ " + per),
          svg: makeSvg(cells, cells.length, -1, N, title, "cell 당 395 / " + N + " ≈ " + per + " voice 채널"),
          note: "395 / " + N + " ≈ " + per + " 는 슬라이드에 없는 파생값이다 (p.19 의 416 − 21 = 395 와 reuse factor 로 계산). AMPS 실제 reuse factor 는 7 (p.19)." +
            (N === "4" ? " N = 4 를 AMPS 395 채널에 적용한 것은 비교용 가정." : "")
        });
      }
      return { panels: panels, vars: vars, steps: steps };
    }
  };
})(window);
