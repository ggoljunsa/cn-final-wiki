// ============================================================
// count_to_infinity_anim — L15 p.13–16: two-node loop 과 split horizon
//   위 줄: 규칙 없음 — X–A 고장 → B 의 stale "X = 2" 가 먼저 도착 → A 3, B 4, … 16 (15 updates)
//   아래 줄: split horizon — B 는 A 에게 X 를 말하지 않음 → A 16 을 알림 → B 16 (1 update)
//   시간축(초): 0–1.5 고장 전 → 1.5–3 고장, A = 16 → 3–4.5 B→A "X = 2", A 3 → 4.5–6 A→B, B 4
//   → 6–10 빨리 감기 5/4 … 16/16 → 10–13 결과 유지
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["count_to_infinity_anim"] = {
  title: "Two-node loop — 16 까지 세어 올라가는 13초",
  desc: "X–A link 가 끊긴 뒤 A 와 B 가 서로의 오래된(stale) 값을 받아 1 씩 올린다 → [[count to infinity와 two-node loop]]. 아래 줄은 [[split horizon]] 을 쓰면 한 번에 끝나는 모습이다.",
  duration: 13,
  build: function () {
    var D = 13;
    var C = { a: "#1d65b3", aL: "#dbe8f7", r: "#3b2f4a", rL: "#efe9f6", g: "#2e9e4f", gL: "#dff3e4", red: "#d6465f", muted: "#777", ink: "#222" };
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var a = r4(from / D), b = r4(Math.min(1, (from + 0.12) / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, (to - 0.12) / D)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }

    // 한 줄(X — A — B) 그리기
    function row(y, label) {
      var s = txt(30, y - 52, label, 13, C.ink, ' text-anchor="start" font-weight="700"');
      s += '<line x1="120" y1="' + y + '" x2="300" y2="' + y + '" stroke="#555" stroke-width="3"/>';
      s += vis(1.5, D, '<line x1="120" y1="' + y + '" x2="300" y2="' + y + '" stroke="#fff" stroke-width="5"/><line x1="120" y1="' + y + '" x2="300" y2="' + y + '" stroke="' + C.red + '" stroke-width="3" stroke-dasharray="7 5"/>' + txt(210, y - 8, "✗", 18, C.red, ' font-weight="700"'));
      s += '<line x1="300" y1="' + y + '" x2="520" y2="' + y + '" stroke="#555" stroke-width="3"/>';
      [["X", 120, C.aL, C.a], ["A", 300, C.rL, C.r], ["B", 520, C.rL, C.r]].forEach(function (n) {
        s += '<circle cx="' + n[1] + '" cy="' + y + '" r="20" fill="' + n[2] + '" stroke="' + n[3] + '" stroke-width="2"/>' + txt(n[1], y + 5, n[0], 14, C.ink, ' font-weight="700"');
      });
      return s;
    }
    function tag(x, y, v, from, to) {
      var inf = v >= 16;
      return vis(from, to, '<rect x="' + (x - 42) + '" y="' + (y - 48) + '" width="84" height="26" rx="4" fill="' + (inf ? "#fde2e4" : "#fff") + '" stroke="#888"/>' + txt(x, y - 30, "X : " + (inf ? "16 (∞)" : v), 13, inf ? C.red : C.ink, ' font-weight="700"'));
    }
    function msg(y, dir, label, t0, t1) {
      var x1 = dir === "BA" ? 495 : 325, x2 = dir === "BA" ? 325 : 495;
      return vis(t0, t1, '<line x1="' + x1 + '" y1="' + (y + 30) + '" x2="' + x2 + '" y2="' + (y + 30) + '" stroke="' + C.a + '" stroke-width="2" marker-end="url(#cti_arr)"/>' + txt(410, y + 48, label, 12, C.a));
    }

    var s = '<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="two-node loop 와 split horizon 비교 애니메이션">';
    s += '<defs><marker id="cti_arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="' + C.a + '"/></marker></defs>';
    s += '<rect x="0" y="0" width="760" height="360" fill="#fff"/>';
    [
      [0, 1.5, "고장 전: A 는 X 까지 1, B 는 A 를 거쳐 2"],
      [1.5, 3, "X–A link 고장. A 는 바로 X = 16(∞) 으로 바꾼다"],
      [3, 4.5, "A 가 알리기 전에 B 의 벡터(X = 2)가 도착 → A = 1 + 2 = 3"],
      [4.5, 6, "B 는 A 를 거쳐 가니까 A 의 3 을 받아 4 (값이 올라가도 받아들인다)"],
      [6, 10, "서로 1 씩 올리며 주고받는다: 5, 6, 7, … 16"],
      [10, D, "규칙 없음 15 번 vs split horizon 1 번"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 26, c[2], 14, C.ink, ' font-weight="700"')); });

    var y1 = 130, y2 = 270;
    s += row(y1, "규칙 없음 (p.13)") + row(y2, "split horizon (p.14)");

    // ---- 위 줄 값 변화 ----
    var seq = [[1, 2, 0, 1.5], [16, 2, 1.5, 3], [3, 2, 3, 4.5], [3, 4, 4.5, 6]];
    var a = 3, b = 4, t = 6, dt = 0.3, turn = "A";
    while (!(a >= 16 && b >= 16)) {
      if (turn === "A") a = Math.min(16, b + 1); else b = Math.min(16, a + 1);
      turn = turn === "A" ? "B" : "A";
      seq.push([a, b, t, t + dt]); t += dt;
    }
    seq[seq.length - 1][3] = D;
    seq.forEach(function (q) { s += tag(300, y1, q[0], q[2], q[3]) + tag(520, y1, q[1], q[2], q[3]); });
    s += msg(y1, "BA", "B → A: X = 2 (stale)", 3, 4.5) + msg(y1, "AB", "A → B: X = 3", 4.5, 6);
    s += vis(6, 10, txt(410, y1 + 48, "A ⇄ B 계속 주고받음", 12, C.a));
    s += vis(10, D, txt(660, y1 + 5, "update 15 번", 14, C.red, ' font-weight="700"'));

    // ---- 아래 줄 ----
    s += tag(300, y2, 1, 0, 1.5) + tag(520, y2, 2, 0, 1.5);
    s += tag(300, y2, 16, 1.5, D) + tag(520, y2, 2, 1.5, 4.5) + tag(520, y2, 16, 4.5, D);
    s += msg(y2, "BA", "B → A: (X 는 말하지 않음)", 3, 4.5) + msg(y2, "AB", "A → B: X = 16", 4.5, 6);
    s += vis(4.5, D, txt(660, y2 + 5, "update 1 번", 14, C.g, ' font-weight="700"'));

    s += txt(380, 348, "원인: 각 node 는 이웃이 말해 준 숫자만 안다(global information 이 없다) → link state 로", 12, C.muted);
    s += '</svg>';
    return s;
  }
};
