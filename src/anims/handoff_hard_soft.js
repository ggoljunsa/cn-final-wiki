// ============================================================
// handoff_hard_soft — L10 p.14–16 (handoff, hard vs soft)
// 왼쪽 (a) hard / 오른쪽 (b) soft 를 같은 시간축으로 나란히. MS 는 1.5→11.5s 동안 BS1 cell → BS2 cell.
//   hard: BS1 1.5–6.2, 끊김 6.2–7.2, BS2 7.2–   (break before make)
//   soft: BS1 1.5–7.8, BS2 5.4–  → 5.4–7.8 겹침 (make before break)
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["handoff_hard_soft"] = {
  title: "Handoff — hard(break before make) vs soft(make before break), 14초",
  desc: "[[handoff]] = 이동 중인 통화를 끊지 않고 한 BS 에서 다른 BS 로 넘기는 과정. [[MSC]] 가 every few seconds 신호 세기를 감시하다가 약해지면 더 나은 cell 로 채널을 바꾼다. [[hard handoff]] 는 BS 하나와만, [[soft handoff]] 는 두 BS 와 동시에 통신",
  duration: 14,
  build: function () {
    var D = 14;
    var C = {
      a: "#1d65b3", aL: "#dbe8f7", b: "#2e9e4f", bL: "#dff3e4", c: "#e09a40", cL: "#fdeec2",
      dev: "#3b2f4a", devL: "#efe9f6", red: "#d6465f", muted: "#777", ink: "#222",
      cell: "#c9a227", cellL: "#fdf3c4"
    };
    function r2(v) { return Math.round(v * 100) / 100; }
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + r2(x) + '" y="' + r2(y) + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    // from~to 초에만 보이기 (0.12s 페이드)
    function show(from, to) {
      var f = 0.12 / D, a = r4(from / D), b = r4(Math.min(from / D + f, (from + to) / 2 / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, to / D - f)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }
    function caps(list) {
      return list.map(function (c) { return vis(c[0], c[1], txt(380, 26, c[2], 14, C.ink, ' font-weight="700"')); }).join("");
    }
    function hexPts(cx, cy, r, pointy) {
      var p = [];
      for (var i = 0; i < 6; i++) {
        var a = Math.PI / 180 * (60 * i + (pointy ? 30 : 0));
        p.push(r2(cx + r * Math.cos(a)) + "," + r2(cy + r * Math.sin(a)));
      }
      return p.join(" ");
    }
    function hex(cx, cy, r, fill, stroke, pointy, extra) {
      return '<polygon points="' + hexPts(cx, cy, r, pointy) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"' + (extra || "") + '/>';
    }
    function rbox(x, y, w, h, fill, stroke, lines, size, col) {
      var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.8"/>';
      lines = [].concat(lines || []);
      var n = lines.length, fs = size || 13;
      lines.forEach(function (l, i) { s += txt(x + w / 2, y + h / 2 + (i - (n - 1) / 2) * (fs + 3) + fs * 0.36, l, fs, col || C.ink, ' font-weight="700"'); });
      return s;
    }
    // 기지국 탑: (x, y) = 밑변 가운데, 높이 26
    function tower(x, y, col) {
      col = col || C.dev;
      return '<path d="M' + r2(x - 7) + ',' + r2(y) + ' L' + r2(x) + ',' + r2(y - 26) + ' L' + r2(x + 7) + ',' + r2(y) + ' Z" fill="#fff" stroke="' + col + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<line x1="' + r2(x - 4) + '" y1="' + r2(y - 10) + '" x2="' + r2(x + 4) + '" y2="' + r2(y - 10) + '" stroke="' + col + '" stroke-width="1.4"/>';
    }
    // 휴대폰(MS): 중심 (x, y), 12×22
    function phone(x, y, col, fill) {
      col = col || C.ink;
      return '<rect x="' + r2(x - 6) + '" y="' + r2(y - 11) + '" width="12" height="22" rx="2.5" fill="' + (fill || "#fff") + '" stroke="' + col + '" stroke-width="1.6"/>' +
        '<line x1="' + r2(x - 2.5) + '" y1="' + r2(y - 7) + '" x2="' + r2(x + 2.5) + '" y2="' + r2(y - 7) + '" stroke="' + col + '" stroke-width="1.4"/>';
    }
    function line(x1, y1, x2, y2, col, w, extra) {
      return '<line x1="' + r2(x1) + '" y1="' + r2(y1) + '" x2="' + r2(x2) + '" y2="' + r2(y2) + '" stroke="' + col + '" stroke-width="' + (w || 2) + '"' + (extra || "") + '/>';
    }
    function pth(d, col, w, extra) {
      return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + (w || 2) + '"' + (extra || "") + '/>';
    }
    // 경로를 따라 움직이는 점 (begin~begin+dur 동안만 보임)
    function dot(d, begin, dur, col, rad) {
      return '<circle r="' + (rad || 5) + '" fill="' + col + '" opacity="0"><animateMotion begin="' + begin + 's" dur="' + dur + 's" fill="freeze" path="' + d + '"/>' + show(begin, begin + dur) + '</circle>';
    }
    function marker(id, col) {
      return '<marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + col + '"/></marker>';
    }

    var s = '<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="hard handoff 와 soft handoff 비교 애니메이션">';
    s += '<defs>' + marker("ho_ar", "#555") + '</defs>';

    s += caps([
      [0, 1.5, "통화 중인 MS 가 BS1 의 cell 에서 BS2 의 cell 쪽으로 이동한다"],
      [1.5, 5.4, "MSC 가 every few seconds 신호 세기를 감시 — 멀어질수록 BS1 신호가 약해진다"],
      [5.4, 6.2, "신호가 약해지면 MSC 가 더 나은 cell(BS2)을 찾아 통화 채널을 바꾼다 = handoff"],
      [6.2, 8.4, "(a) hard: BS1 을 먼저 끊고 BS2 에 연결 → 잠깐 끊김 (break before make)"],
      [8.4, 11, "(b) soft: BS2 를 먼저 잡은 뒤 BS1 을 놓는다 → 겹치는 구간 (make before break)"],
      [11, D, "hard = MS 가 BS 하나와만 통신(early systems) · soft = 두 BS 와 동시에 통신"]
    ]);

    var R = 46, W3 = R * Math.sqrt(3);
    var Y1 = 1.5, Y2 = 11.5, X0 = 132, X1 = 248;   // MS x: 132 → 248 (왼쪽 패널 기준)
    var BS1C = "#b8901a", BS2C = C.b;
    function TX(t) { return 60 + (t - Y1) * 26; }               // 시간 → 타임라인 x

    function panel(ox, hard) {
      var p = '';
      var c1 = 150 + ox, c2 = 150 + W3 + ox, cy = 140;
      var t1x = c1 - 8, t2x = c2 - 8, tb = 148;
      // MSC
      p += rbox(145 + ox, 40, 90, 28, C.aL, C.a, "MSC", 13, C.a);
      p += line(190 + ox, 68, t1x, tb - 26, "#555", 1.4) + line(190 + ox, 68, t2x, tb - 26, "#555", 1.4);
      // cells
      p += hex(c1, cy, R, C.cellL, C.cell, true) + hex(c2, cy, R, C.bL, C.b, true);
      p += tower(t1x, tb, C.dev) + tower(t2x, tb, C.dev);
      p += txt(c1 + 4, cy - 18, "BS1", 12, "#8a6a10", ' font-weight="700" text-anchor="start"') + txt(c2 + 4, cy - 18, "BS2", 12, "#1d6b2a", ' font-weight="700" text-anchor="start"');
      // 신호 세기 감시 펄스 (every few seconds)
      [2, 4, 6, 8, 10].forEach(function (b) {
        p += dot("M" + (190 + ox) + ",68 L" + t1x + "," + (tb - 26), b, 0.6, C.a, 3);
        p += dot("M" + (190 + ox) + ",68 L" + t2x + "," + (tb - 26), b, 0.6, C.a, 3);
      });
      // 무선 링크 (끝점이 MS 를 따라간다)
      function link(tx, col, from, to, fade) {
        var l = '<line x1="' + tx + '" y1="' + (tb - 20) + '" x2="' + (X0 + ox) + '" y2="152" stroke="' + col + '" stroke-width="3" stroke-linecap="round">' +
          '<animate attributeName="x2" values="' + (X0 + ox) + ';' + (X1 + ox) + '" begin="' + Y1 + 's" dur="' + (Y2 - Y1) + 's" fill="freeze"/>' +
          (fade ? '<animate attributeName="stroke-opacity" values="1;0.35" begin="' + Y1 + 's" dur="' + 4.5 + 's" fill="freeze"/>' : '') + '</line>';
        return vis(from, to, l);
      }
      if (hard) { p += link(t1x, BS1C, 0, 6.2, true) + link(t2x, BS2C, 7.2, D, false); }
      else { p += link(t1x, BS1C, 0, 7.8, true) + link(t2x, BS2C, 5.4, D, false); }
      // MS
      var ms = phone(X0 + ox, 160, C.a, C.aL);
      if (hard) ms += vis(6.2, 7.2, '<circle cx="' + (X0 + ox) + '" cy="160" r="15" fill="none" stroke="' + C.red + '" stroke-width="2.5"/>' + txt(X0 + ox, 192, "끊김!", 12, C.red, ' font-weight="700"'));
      else ms += vis(5.4, 7.8, '<circle cx="' + (X0 + ox) + '" cy="160" r="15" fill="none" stroke="' + C.b + '" stroke-width="2.5"/>');
      p += '<g>' + ms + '<animateTransform attributeName="transform" type="translate" values="0,0;' + (X1 - X0) + ',0" begin="' + Y1 + 's" dur="' + (Y2 - Y1) + 's" fill="freeze"/></g>';

      // ---- 타임라인 ----
      p += txt(52 + ox, 219, "BS1", 12, "#8a6a10", ' font-weight="700" text-anchor="end"');
      p += txt(52 + ox, 241, "BS2", 12, "#1d6b2a", ' font-weight="700" text-anchor="end"');
      p += line(58 + ox, 256, 338 + ox, 256, "#555", 1.5, ' marker-end="url(#ho_ar)"') + txt(340 + ox, 270, "Time", 11, "#555", ' text-anchor="end"');
      function bar(y, t0, t1, fill, stroke) {
        return '<rect x="' + r2(TX(t0) + ox) + '" y="' + y + '" width="0" height="11" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.3">' +
          '<animate attributeName="width" values="0;' + r2(TX(t1) - TX(t0)) + '" begin="' + t0 + 's" dur="' + r2(t1 - t0) + 's" fill="freeze"/></rect>';
      }
      if (hard) {
        p += vis(6.2, D, '<rect x="' + r2(TX(6.2) + ox) + '" y="203" width="' + r2(TX(7.2) - TX(6.2)) + '" height="46" fill="' + C.red + '" fill-opacity="0.22"/>');
        p += bar(209, Y1, 6.2, C.cellL, BS1C) + bar(231, 7.2, Y2, C.bL, BS2C);
        p += vis(6.4, D, txt(TX(6.7) + ox, 274, "Break before make", 12, C.red, ' font-weight="700"'));
      } else {
        p += '<rect x="' + r2(TX(5.4) + ox) + '" y="203" width="0" height="46" fill="' + C.b + '" fill-opacity="0.2">' +
          '<animate attributeName="width" values="0;' + r2(TX(7.8) - TX(5.4)) + '" begin="5.4s" dur="2.4s" fill="freeze"/></rect>';
        p += bar(209, Y1, 7.8, C.cellL, BS1C) + bar(231, 5.4, Y2, C.bL, BS2C);
        p += vis(7.8, D, txt(TX(6.6) + ox, 274, "Make before break", 12, C.b, ' font-weight="700"'));
      }
      p += txt(190 + ox, 296, hard ? "(a) Hard handoff" : "(b) Soft handoff", 14, C.ink, ' font-weight="700"');
      p += txt(190 + ox, 313, hard ? "MS 는 BS 하나와만 통신 · early systems" : "MS 가 두 BS 와 동시에 통신", 11, C.muted);
      return p;
    }
    s += panel(0, true);
    s += line(380, 46, 380, 312, "#ddd", 1.5);
    s += panel(380, false);

    // ---- 요점 ----
    s += txt(380, 334, "handoff = 이동 중 통화를 끊지 않고 BS 를 바꾸는 것 — MSC 가 every few seconds 신호 세기를 보고 결정", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
