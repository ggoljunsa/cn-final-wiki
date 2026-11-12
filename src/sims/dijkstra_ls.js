// dijkstra_ls — L15 p.20–25: LSDB 로 least-cost tree 만들기 (Init → Select → Update 반복)
//   root A 는 슬라이드 p.21–25 그대로: B(2) → D(3) → E(6) → C(7) → F(8) → G(9), G 는 Iter 4 에 10 → Iter 5 에 9
//   root D · G 는 p.5 의 다른 tree 와 맞춰 보는 연습. 동점이면 알파벳 순으로 고른다(슬라이드에는 없는 규칙)
//   모든 값은 python 으로 검산 (CONTRACT §1 L15)
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  var N = ["A", "B", "C", "D", "E", "F", "G"];
  var INF = Infinity;
  var EDGES = [["A", "B", 2], ["A", "D", 3], ["B", "C", 5], ["B", "E", 4], ["C", "F", 4], ["C", "G", 3], ["D", "E", 5], ["E", "F", 2], ["F", "G", 1]];
  var POS = { A: [70, 70], B: [210, 70], C: [350, 70], D: [70, 190], E: [210, 190], F: [350, 190], G: [470, 130] };
  var C = {};
  EDGES.forEach(function (e) { C[e[0] + e[1]] = e[2]; C[e[1] + e[0]] = e[2]; });
  function f(v) { return v === INF ? "∞" : String(v); }
  function copy(o) { var r = {}; for (var k in o) r[k] = o[k]; return r; }

  function graphSvg(root, dist, prev, inTree, sel, upd) {
    return function () {
      var s = '<svg viewBox="0 0 560 260" width="560" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">';
      s += '<defs><marker id="dij_arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#333"/></marker></defs>';
      EDGES.forEach(function (e) {
        var p = POS[e[0]], q = POS[e[1]];
        s += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" stroke="#ddd" stroke-width="2"/>';
        s += '<text x="' + ((p[0] + q[0]) / 2 + 6) + '" y="' + ((p[1] + q[1]) / 2 - 5) + '" fill="#aaa" font-size="11">' + e[2] + '</text>';
      });
      N.forEach(function (v) {
        if (!prev[v]) return;
        var p = POS[prev[v]], q = POS[v], dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy);
        var x2 = q[0] - dx / L * 22, y2 = q[1] - dy / L * 22, x1 = p[0] + dx / L * 22, y1 = p[1] + dy / L * 22;
        var solid = inTree[v];
        s += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (upd && upd[v] ? "#e09a40" : "#333") + '" stroke-width="2"' + (solid ? '' : ' stroke-dasharray="5 4"') + ' marker-end="url(#dij_arr)"/>';
      });
      N.forEach(function (v) {
        var p = POS[v], isRoot = v === root;
        var fill = isRoot ? "#222" : (inTree[v] ? "#cfe8f7" : "#fff");
        var stroke = sel === v ? "#d6465f" : "#333";
        s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="18" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (sel === v ? 3 : 1.5) + '"/>';
        s += '<text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle" font-weight="700" fill="' + (isRoot ? "#fff" : "#222") + '">' + v + '</text>';
        var ly = (v === "G") ? p[1] + 5 : (p[1] < 130 ? p[1] - 26 : p[1] + 36), lx = v === "G" ? p[0] + 34 : p[0];
        s += '<text x="' + lx + '" y="' + ly + '" text-anchor="middle" fill="' + (upd && upd[v] ? "#e09a40" : "#d6465f") + '" font-weight="700">' + f(dist[v]) + '</text>';
      });
      s += '<text x="20" y="250" fill="#777" font-size="11">검은 원 root · 하늘색 tree 안 · 흰색 아직 · 점선 potential path · 실선 path · 주황 = 이번에 바뀐 값</text>';
      s += '</svg>';
      return s;
    };
  }

  function build(root) {
    var lines = [
      "Init: 자기 자신을 root 로, cost 는 LSDB 의 자기 행",
      "Select: tree 밖 node 중 root 에 가장 가까운 것을 넣는다",
      "Update: 방금 넣은 u 의 이웃 v 마다 D(v) = min(D(v), D(u) + c(u,v))",
      "남은 node 가 있으면 Select 로",
      "Done: 모든 node 가 tree 에 들어감"
    ];
    var vars = [
      { name: "iter", label: "단계", group: "진행" },
      { name: "tree", label: "tree 안의 node", group: "진행" },
      { name: "sel", label: "고른 node", group: "진행" },
      { name: "calc", label: "갱신 계산", group: "진행" }
    ];
    N.forEach(function (v) { vars.push({ name: "D" + v, label: "D(" + v + ")", group: "root 로부터 cost" }); });
    var dist = {}, prev = {}, inTree = {}, steps = [];
    N.forEach(function (v) { dist[v] = v === root ? 0 : (C[root + v] === undefined ? INF : C[root + v]); if (C[root + v] !== undefined) prev[v] = root; });
    inTree[root] = true;
    var order = [root];
    function snap(iter, sel, calc) {
      var o = { iter: iter, tree: order.join(" "), sel: sel || "—", calc: calc || "—" };
      N.forEach(function (v) { o["D" + v] = f(dist[v]); });
      return o;
    }
    steps.push({
      desc: "Initialization: " + root + " 가 root 다. cost 는 LSDB 의 " + root + " 행을 그대로 쓴다. 이웃만 숫자가 있고 나머지는 ∞ 다." + (root === "A" ? " (p.21)" : ""),
      pc: { P: 1 }, vars: snap("Init", root, "LSDB " + root + " 행"),
      svg: graphSvg(root, copy(dist), copy(prev), copy(inTree), null, null)
    });
    for (var it = 1; it < N.length; it++) {
      var cand = N.filter(function (v) { return !inTree[v]; });
      cand.sort(function (x, y) { return dist[x] - dist[y] || (x < y ? -1 : 1); });
      var u = cand[0];
      var ties = cand.filter(function (v) { return dist[v] === dist[u]; });
      inTree[u] = true; order.push(u);
      steps.push({
        desc: "Iteration " + it + " ② Select: tree 밖에서 가장 가까운 것은 '''" + u + "''' (" + f(dist[u]) + ")." + (ties.length > 1 ? " " + ties.join("·") + " 가 동점이라 알파벳 순으로 " + u + " 를 먼저 넣었다(어느 쪽을 먼저 넣어도 최종 cost 는 같다)." : "") + " 후보: " + cand.map(function (v) { return v + " " + f(dist[v]); }).join(", "),
        pc: { P: 2 }, vars: snap("Iter " + it, u, "후보 중 최소 " + u + " = " + f(dist[u])),
        svg: graphSvg(root, copy(dist), copy(prev), copy(inTree), u, null)
      });
      var upd = {}, calcs = [];
      N.forEach(function (v) {
        if (inTree[v] || C[u + v] === undefined) return;
        var nv = dist[u] + C[u + v];
        if (nv < dist[v]) { calcs.push(v + ": min(" + f(dist[v]) + ", " + dist[u] + "+" + C[u + v] + ") = " + nv + " ✓"); dist[v] = nv; prev[v] = u; upd[v] = true; }
        else calcs.push(v + ": min(" + f(dist[v]) + ", " + dist[u] + "+" + C[u + v] + ") = " + f(dist[v]) + " 그대로");
      });
      var note = "";
      if (root === "A" && u === "D") note = " E 는 D 를 거치면 3 + 5 = 8 이라 지금의 6 보다 비싸다. 아무것도 안 바뀐다.";
      if (root === "A" && u === "C") note = " G 가 처음 10 으로 잡힌다(A→B→C→G).";
      if (root === "A" && u === "F") note = " G 가 10 → 9 로 바뀌고 부모가 C 에서 F 로 바뀐다. 슬라이드 ③의 \"paths may change\" 다.";
      var left = N.filter(function (v) { return !inTree[v]; }).length;
      steps.push({
        desc: "Iteration " + it + " ③ Update: " + u + " 의 이웃 중 tree 밖에 있는 것만 다시 계산한다. " + (calcs.length ? calcs.join(" · ") : "tree 밖 이웃이 없다.") + note + (left ? "" : " 모든 node 가 tree 에 들어갔다 → '''Done'''."),
        pc: { P: left ? 3 : 5 }, vars: snap("Iter " + it, u, calcs.length ? calcs.join(" / ") : "없음"),
        svg: graphSvg(root, copy(dist), copy(prev), copy(inTree), u, upd)
      });
    }
    return { panels: [{ id: "P", title: "Dijkstra (p.20) — root " + root, lang: "txt", lines: lines }], vars: vars, steps: steps };
  }

  global.SIMS["dijkstra_ls"] = {
    title: "Dijkstra — LSDB 로 least-cost tree 만들기 (p.20–25)",
    desc: "[[LSDB]] 의 root 행에서 시작해 가장 가까운 node 를 하나씩 tree 에 넣고 이웃의 cost 를 다시 계산한다 → [[Dijkstra algorithm]]. root A 는 슬라이드 p.21–25 그대로이고, D·G 는 p.5 의 다른 [[least-cost tree]] 와 맞춰 보는 연습이다.",
    options: [
      { key: "root", label: "root", values: [
        { value: "A", label: "A (p.21–25 슬라이드 예제)" },
        { value: "D", label: "D (p.5 tree 와 비교)" },
        { value: "G", label: "G (p.5 tree 와 비교, 동점 있음)" }
      ] }
    ],
    build: function (opts) { return build(opts.root || "A"); }
  };
})(window);
