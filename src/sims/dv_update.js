// dv_update — L15 p.10–16: distance vector 갱신(Bellman-Ford)과 count to infinity
//   p11    : p.11 B 가 A 의 벡터, 이어서 E 의 벡터를 받아 칸별로 min(old, c + Z[ ])
//   sync   : p.10 초기 벡터 7 개에서 모든 node 가 동시에 교환 → 라운드 3 에 수렴, 4 에서 변화 없음
//   loop   : p.13 two-node loop — X–A 고장 뒤 A·B 가 1 씩 올리며 16(= ∞)까지 15 번
//   split  : p.14 split horizon — B 는 A 에게 X 를 말하지 않음 → 1 번에 끝
//   poison : p.15 poison reverse — B 는 A 에게 X = ∞ 로 알림 → 1 번에 끝
//   모든 값은 python 으로 검산 (CONTRACT §1 L15)
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  var N = ["A", "B", "C", "D", "E", "F", "G"];
  var INF = Infinity;
  var EDGES = [["A", "B", 2], ["A", "D", 3], ["B", "C", 5], ["B", "E", 4], ["C", "F", 4], ["C", "G", 3], ["D", "E", 5], ["E", "F", 2], ["F", "G", 1]];
  var C = {};
  EDGES.forEach(function (e) { C[e[0] + e[1]] = e[2]; C[e[1] + e[0]] = e[2]; });
  function cost(x, y) { return x === y ? 0 : (C[x + y] === undefined ? INF : C[x + y]); }
  function nbrs(x) { return N.filter(function (y) { return y !== x && C[x + y] !== undefined; }); }
  function f(v) { return v === INF ? "∞" : String(v); }
  function initVec(x) { var o = {}; N.forEach(function (y) { o[y] = cost(x, y); }); return o; }
  function vecStr(v) { return "[" + N.map(function (y) { return f(v[y]); }).join(", ") + "]"; }
  function copy(o) { var r = {}; for (var k in o) r[k] = o[k]; return r; }

  // ---------- svg: 벡터 열 여러 개 ----------
  function colsSvg(title, cols, hiRow) {
    return function () {
      var W = 120 + cols.length * 110, H = 260;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">';
      s += '<text x="10" y="18" font-weight="700">' + title + '</text>';
      cols.forEach(function (col, k) {
        var x = 60 + k * 110;
        s += '<text x="' + (x + 22) + '" y="44" text-anchor="middle" font-weight="700" fill="' + (col.color || "#222") + '">' + col.name + '</text>';
        N.forEach(function (y, i) {
          var yy = 54 + i * 26;
          if (k === 0) s += '<text x="' + (x - 14) + '" y="' + (yy + 18) + '" text-anchor="middle" fill="#d6465f" font-weight="700">' + y + '</text>';
          var hi = (hiRow === y);
          var changed = col.changed && col.changed[y];
          var fill = changed ? "#222" : (hi ? "#fff3bf" : (col.vec[y] === INF ? "#e7f1fb" : "#fff"));
          s += '<rect x="' + x + '" y="' + yy + '" width="44" height="24" fill="' + fill + '" stroke="' + (hi ? "#e09a40" : "#888") + '" stroke-width="' + (hi ? 2 : 1) + '"/>';
          s += '<text x="' + (x + 22) + '" y="' + (yy + 17) + '" text-anchor="middle" fill="' + (changed ? "#fff" : "#222") + '">' + f(col.vec[y]) + '</text>';
        });
      });
      s += '</svg>';
      return s;
    };
  }

  // ---------- svg: 7×7 벡터 표 ----------
  function tableSvg(title, D, changed) {
    return function () {
      var W = 420, H = 250;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">';
      s += '<text x="10" y="16" font-weight="700">' + title + '</text>';
      N.forEach(function (y, j) { s += '<text x="' + (92 + j * 44) + '" y="40" text-anchor="middle" fill="#d6465f" font-weight="700">' + y + '</text>'; });
      N.forEach(function (x, i) {
        var yy = 48 + i * 27;
        s += '<text x="40" y="' + (yy + 18) + '" text-anchor="middle" font-weight="700" fill="#1d65b3">' + x + ' 의 벡터</text>';
        N.forEach(function (y, j) {
          var ch = changed && changed[x + y];
          s += '<rect x="' + (72 + j * 44) + '" y="' + yy + '" width="40" height="24" fill="' + (ch ? "#fff3bf" : (D[x][y] === INF ? "#e7f1fb" : "#fff")) + '" stroke="' + (ch ? "#e09a40" : "#bbb") + '" stroke-width="' + (ch ? 2 : 1) + '"/>';
          s += '<text x="' + (92 + j * 44) + '" y="' + (yy + 17) + '" text-anchor="middle"' + (ch ? ' font-weight="700"' : '') + '>' + f(D[x][y]) + '</text>';
        });
      });
      s += '</svg>';
      return s;
    };
  }

  // ---------- svg: X — A — B ----------
  function loopSvg(a, b, msg, broken, note) {
    return function () {
      var s = '<svg viewBox="0 0 560 190" width="560" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">';
      s += '<line x1="80" y1="110" x2="260" y2="110" stroke="' + (broken ? "#d6465f" : "#555") + '" stroke-width="3"' + (broken ? ' stroke-dasharray="7 5"' : '') + '/>';
      s += '<line x1="260" y1="110" x2="440" y2="110" stroke="#555" stroke-width="3"/>';
      if (broken) s += '<text x="170" y="100" text-anchor="middle" fill="#d6465f" font-size="18" font-weight="700">✗</text>';
      s += '<text x="170" y="132" text-anchor="middle" fill="#777" font-size="11">cost 1</text><text x="350" y="132" text-anchor="middle" fill="#777" font-size="11">cost 1</text>';
      [["X", 80, "#dbe8f7", "#1d65b3"], ["A", 260, "#efe9f6", "#3b2f4a"], ["B", 440, "#efe9f6", "#3b2f4a"]].forEach(function (n) {
        s += '<circle cx="' + n[1] + '" cy="110" r="22" fill="' + n[2] + '" stroke="' + n[3] + '" stroke-width="2"/>';
        s += '<text x="' + n[1] + '" y="115" text-anchor="middle" font-weight="700">' + n[0] + '</text>';
      });
      function tag(x, v) {
        var inf = v >= 16;
        return '<rect x="' + (x - 46) + '" y="30" width="92" height="30" rx="4" fill="' + (inf ? "#fde2e4" : "#fff") + '" stroke="#888"/>' +
          '<text x="' + x + '" y="50" text-anchor="middle" font-weight="700">X : ' + (inf ? "16 (∞)" : v) + '</text>';
      }
      s += tag(260, a) + tag(440, b);
      if (msg) {
        var right = msg.dir === "BA";
        s += '<line x1="' + (right ? 420 : 280) + '" y1="80" x2="' + (right ? 280 : 420) + '" y2="80" stroke="#1d65b3" stroke-width="2" marker-end="url(#dvu_arr)"/>';
        s += '<text x="350" y="74" text-anchor="middle" fill="#1d65b3" font-size="12">' + msg.text + '</text>';
      }
      s += '<defs><marker id="dvu_arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1d65b3"/></marker></defs>';
      if (note) s += '<text x="20" y="176" fill="#777" font-size="12">' + note + '</text>';
      s += '</svg>';
      return s;
    };
  }

  // =========================================================
  function buildP11() {
    var lines = [
      "B 의 old 벡터와 보낸 이웃 Z 의 벡터를 나란히 놓는다",
      "link cost c_BZ 를 Z[ ] 의 모든 칸에 더한다",
      "칸마다 min(old B, c_BZ + Z) 를 고른다",
      "바뀐 칸을 표시하고 new B 로 저장한다"
    ];
    var vars = [
      { name: "event", label: "event", group: "받은 벡터" },
      { name: "Z", label: "보낸 이웃 Z", group: "받은 벡터" },
      { name: "c", label: "c_BZ", group: "받은 벡터" },
      { name: "dest", label: "목적지 y", group: "칸 하나" },
      { name: "calc", label: "min(old, c + Z)", group: "칸 하나" },
      { name: "newB", label: "new B", group: "결과" }
    ];
    var steps = [];
    var B = initVec("B");
    var events = [{ z: "A", c: 2, name: "a. First event: B receives a copy of A's vector" }, { z: "E", c: 4, name: "b. Second event: B receives a copy of E's vector" }];
    events.forEach(function (ev, ei) {
      var Z = initVec(ev.z), oldB = copy(B), newB = copy(B), changed = {};
      var base = { event: ev.name, Z: ev.z + " = " + vecStr(Z), c: String(ev.c), dest: "—", calc: "—", newB: vecStr(oldB) };
      steps.push({
        desc: "p.11 (" + (ei === 0 ? "a" : "b") + "): B 가 이웃 '''" + ev.z + "''' 의 벡터를 받았다. 식은 `B[ ] = min(B[ ], " + ev.c + " + " + ev.z + "[ ])` 이다. 벡터 전체에 link cost " + ev.c + " 를 더하고, 칸마다 원래 값과 비교한다.",
        pc: { P: 1 }, vars: copy(base),
        svg: colsSvg("Old B 와 " + ev.z + " (c_B" + ev.z + " = " + ev.c + ")", [{ name: "Old B", vec: oldB }, { name: ev.z, vec: Z, color: "#1d65b3" }])
      });
      N.forEach(function (y) {
        var cand = ev.c + Z[y], nv = Math.min(oldB[y], cand);
        var ch = nv !== oldB[y];
        newB[y] = nv; if (ch) changed[y] = true;
        var plus = {}; N.forEach(function (k) { plus[k] = ev.c + Z[k]; });
        var v = copy(base); v.dest = y; v.calc = "min(" + f(oldB[y]) + ", " + ev.c + " + " + f(Z[y]) + ") = min(" + f(oldB[y]) + ", " + f(cand) + ") = " + f(nv); v.newB = vecStr(newB);
        steps.push({
          desc: "목적지 " + y + ": " + v.calc + (ch ? " → '''바뀜'''. B 는 " + ev.z + " 를 거쳐 " + y + " 로 가는 더 싼 길을 알게 됐다." : " → 그대로."),
          pc: { P: ch ? 4 : 3 }, vars: v,
          svg: colsSvg("New B = min(Old B, " + ev.c + " + " + ev.z + "[ ])", [{ name: "New B", vec: copy(newB), changed: copy(changed) }, { name: "Old B", vec: oldB }, { name: ev.c + " + " + ev.z, vec: plus, color: "#1d65b3" }], y)
        });
      });
      B = newB;
      var v2 = copy(base); v2.dest = "—"; v2.calc = "바뀐 칸: " + Object.keys(changed).join(", "); v2.newB = vecStr(B);
      steps.push({
        desc: ei === 0 ? "첫 event 결과: D 가 ∞ → 5 로 바뀌었다(B→A→D = 2 + 3). 슬라이드 (a) 의 검은 칸이다." : "둘째 event 결과: F 가 ∞ → 6 으로 바뀌었다(B→E→F = 4 + 2). 슬라이드 (b) 의 검은 칸이다. G 는 아직 ∞ 다. E 도 아직 G 를 모르기 때문이다.",
        pc: { P: 4 }, vars: v2,
        svg: colsSvg("결과: New B", [{ name: "New B", vec: copy(B), changed: changed }])
      });
    });
    return { panels: [{ id: "P", title: "Bellman-Ford 로 벡터 갱신 (p.11)", lang: "txt", lines: lines }], vars: vars, steps: steps };
  }

  // =========================================================
  function buildSync() {
    var lines = [
      "라운드 0: 모든 node 가 초기 벡터(이웃만, 나머지 ∞)",
      "모든 node 가 자기 벡터를 이웃에게 보낸다",
      "각 node x 가 받은 벡터마다 D_xy = min(D_xy, c_xz + D_zy)",
      "바뀐 칸이 있으면 다음 라운드",
      "바뀐 칸이 하나도 없으면 수렴(끝)"
    ];
    var vars = [
      { name: "round", label: "라운드", group: "진행" },
      { name: "changes", label: "바뀐 칸 수", group: "진행" },
      { name: "A", label: "A 의 벡터", group: "벡터" },
      { name: "B", label: "B 의 벡터", group: "벡터" },
      { name: "G", label: "G 의 벡터", group: "벡터" },
      { name: "detail", label: "바뀐 칸", group: "진행" }
    ];
    var D = {}; N.forEach(function (x) { D[x] = initVec(x); });
    var steps = [];
    function snap(r, ch, detail) { return { round: String(r), changes: String(ch), A: vecStr(D.A), B: vecStr(D.B), G: vecStr(D.G), detail: detail }; }
    steps.push({ desc: "p.10: 부팅 직후 각 node 는 이웃까지의 link cost 만 안다. 나머지는 ∞ 다(파란 칸).", pc: { P: 1 }, vars: snap(0, 0, "—"), svg: tableSvg("라운드 0 — rudimentary vectors", D, null) });
    for (var r = 1; r <= 6; r++) {
      var ND = {}, changed = {}, list = [];
      N.forEach(function (x) {
        ND[x] = {};
        N.forEach(function (y) {
          var best = D[x][y];
          nbrs(x).forEach(function (z) { var c = cost(x, z) + D[z][y]; if (c < best) best = c; });
          ND[x][y] = best;
          if (best !== D[x][y]) { changed[x + y] = true; list.push(x + "→" + y + " " + f(D[x][y]) + "→" + best); }
        });
      });
      D = ND;
      var n = list.length;
      var note = "";
      if (r === 2) note = "A→G 가 처음 10 으로 잡힌다(A→B→C→G). 아직 최종값이 아니다.";
      if (r === 3) note = "A→G 가 10 → 9 로 내려간다(A→B→E→F→G). 더 싼 길(good news)이 한 라운드 늦게 도착했다.";
      steps.push({
        desc: n ? "라운드 " + r + ": 모든 node 가 동시에 교환했다. 바뀐 칸 " + n + " 개(노란 칸). " + (r === 1 ? "이웃의 이웃까지 알게 된다. " : "") + note : "라운드 " + r + ": 바뀐 칸이 없다 → '''수렴'''. 7 개 벡터가 p.5 의 7 개 least-cost tree 숫자와 같다.",
        pc: { P: n ? 3 : 5 }, vars: snap(r, n, n ? list.slice(0, 6).join(", ") + (n > 6 ? " …" : "") : "없음"),
        svg: tableSvg("라운드 " + r + (n ? " — 바뀐 칸 " + n : " — 변화 없음, 수렴"), D, changed)
      });
      if (!n) break;
    }
    return { panels: [{ id: "P", title: "동기 라운드로 본 distance vector (p.10–11)", lang: "txt", lines: lines }], vars: vars, steps: steps };
  }

  // =========================================================
  function buildLoop(mode) {
    var lines = [
      "X–A link 고장. A 는 바로 알아채고 X = 16(∞)",
      mode === "loop" ? "A 가 알리기 전에 B 의 벡터(X = 2)가 A 에 도착" : (mode === "split" ? "split horizon: B 는 X 를 A 에게서 배웠으니 A 에게 X 를 말하지 않음" : "poison reverse: B 는 A 에게 'X = ∞' 로 알림"),
      "A 갱신: X = min(16, 1 + B 가 말한 X)",
      "A 가 자기 벡터를 B 에게 보냄",
      "B 갱신: next router 가 A 라 값이 올라가도 받아들임",
      "둘 다 16 이면 끝"
    ];
    var vars = [
      { name: "upd", label: "update 횟수", group: "진행" },
      { name: "a", label: "A 의 X cost", group: "표" },
      { name: "b", label: "B 의 X cost", group: "표" },
      { name: "calc", label: "계산", group: "진행" }
    ];
    var steps = [];
    var a = 1, b = 2, n = 0;
    var title = { loop: "규칙 없음", split: "split horizon", poison: "poison reverse" }[mode];
    steps.push({ desc: "p.13 a. Before failure: A 는 X 에 바로 붙어 있어 cost 1, B 는 A 를 거쳐 1 + 1 = 2.", pc: { P: null }, vars: { upd: "0", a: "1", b: "2", calc: "—" }, svg: loopSvg(1, 2, null, false, "a. Before failure") });
    a = 16;
    steps.push({ desc: "p.13 b. After link failure: X–A 가 끊겼다. 이웃인 A 는 즉시 X = 16 으로 바꾼다. 교수: \"you can just think of 16 equal to infinity\".", pc: { P: 1 }, vars: { upd: "0", a: "16", b: "2", calc: "A: X = ∞" }, svg: loopSvg(16, 2, null, true, "b. After link failure") });
    if (mode === "loop") {
      var turn = "A";
      while (!(a >= 16 && b >= 16)) {
        n++;
        if (turn === "A") {
          var na = Math.min(16, 1 + b);
          steps.push({
            desc: (n === 1 ? "p.13 c. A 가 자기 ∞ 를 알리기 '''전에''' B 의 벡터가 왔다. B 는 아직 X = " + b + " 라고 말한다(stale). A 는 \"B 가 X 로 가는 길을 아는구나\" 하고 Bellman-Ford 로 1 + " + b + " = " + na + " 를 쓴다." : "A 가 B 의 X = " + b + " 를 받아 1 + " + b + " = " + na + ".") + (na >= 16 ? " 16 에 닿았다." : ""),
            pc: { P: n === 1 ? 3 : 3 }, vars: { upd: String(n), a: f(na), b: String(b), calc: "A = min(16, 1 + " + b + ") = " + na },
            svg: loopSvg(na, b, { dir: "BA", text: "B → A: X = " + b }, true, n === 1 ? "c. After A is updated by B" : "update " + n)
          });
          a = na; turn = "B";
        } else {
          var nb = Math.min(16, 1 + a);
          steps.push({
            desc: (n === 2 ? "p.13 d. 이번엔 B 가 A 의 벡터(X = " + a + ")를 받는다. B 의 X 경로는 원래 A 를 거치니까(next router = A), 값이 올라가도 받아들인다 → 1 + " + a + " = " + nb + "." : "B 가 A 의 X = " + a + " 를 받아 1 + " + a + " = " + nb + ".") + (nb >= 16 ? " 16 에 닿았다." : ""),
            pc: { P: 5 }, vars: { upd: String(n), a: String(a), b: f(nb), calc: "B = 1 + " + a + " = " + nb },
            svg: loopSvg(a, nb, { dir: "AB", text: "A → B: X = " + a }, true, n === 2 ? "d. After B is updated by A" : "update " + n)
          });
          b = nb; turn = "A";
        }
      }
      steps.push({ desc: "p.13 e. Finally: 둘 다 16(∞). 고장 뒤 '''15 번'''의 update 가 필요했다. 그동안 X 로 가는 패킷은 A 와 B 사이를 왔다 갔다 한다. 이것이 two-node loop(two-node instability)이고, p.28 표의 count to infinity 다.", pc: { P: 6 }, vars: { upd: String(n), a: "16", b: "16", calc: "끝" }, svg: loopSvg(16, 16, null, true, "e. Finally — 15 updates") });
    } else {
      steps.push({
        desc: mode === "split" ? "split horizon: B 는 X 로 가는 길을 A 에게서 배웠다. 그래서 A 에게 보내는 벡터에서 X 칸을 '''뺀다'''. A 는 B 에게서 X 정보를 받지 못하니 16 을 유지한다." : "poison reverse: B 는 A 에게 X 를 '''∞''' 로 알린다(\"don't use me to reach X\"). A 는 min(16, 1 + ∞) = 16 이라 그대로다.",
        pc: { P: 2 }, vars: { upd: "0", a: "16", b: "2", calc: mode === "split" ? "B → A 벡터에 X 없음" : "A = min(16, 1 + ∞) = 16" },
        svg: loopSvg(16, 2, { dir: "BA", text: mode === "split" ? "B → A: (X 는 말하지 않음)" : "B → A: X = ∞" }, true, title)
      });
      steps.push({
        desc: "A 가 자기 벡터(X = 16)를 B 에게 보낸다. B 의 X next router 는 A 라서 값이 올라가도 받아들인다 → 1 + 16 → 16. '''update 1 번'''으로 둘 다 ∞ 가 됐다. 다만 이 해결책은 노드가 셋 이상이면 보장되지 않는다(three-node instability).",
        pc: { P: 6 }, vars: { upd: "1", a: "16", b: "16", calc: "B = min(16, 1 + 16) = 16" },
        svg: loopSvg(16, 16, { dir: "AB", text: "A → B: X = 16" }, true, title + " — 1 update")
      });
    }
    return { panels: [{ id: "P", title: "two-node loop (p.13–16) — " + title, lang: "txt", lines: lines }], vars: vars, steps: steps };
  }

  global.SIMS["dv_update"] = {
    title: "Distance vector 갱신 — Bellman-Ford 와 count to infinity",
    desc: "[[Bellman-Ford equation]] 으로 이웃의 벡터를 받아 칸마다 min 을 고르는 과정(p.11), 7 node 가 수렴하는 라운드(p.10), 그리고 link 가 끊겼을 때 A·B 가 16 까지 세어 올라가는 [[count to infinity와 two-node loop|two-node loop]](p.13)와 [[split horizon]] · [[poison reverse]] 를 비교한다.",
    options: [
      { key: "mode", label: "장면", values: [
        { value: "p11", label: "p.11 B 가 A·E 의 벡터 받기" },
        { value: "sync", label: "p.10 7 node 동기 라운드 (수렴까지)" },
        { value: "loop", label: "p.13 two-node loop (규칙 없음)" },
        { value: "split", label: "p.14 split horizon 적용" },
        { value: "poison", label: "p.15 poison reverse 적용" }
      ] }
    ],
    build: function (opts) {
      var m = opts.mode || "p11";
      if (m === "p11") return buildP11();
      if (m === "sync") return buildSync();
      return buildLoop(m);
    }
  };
})(window);
