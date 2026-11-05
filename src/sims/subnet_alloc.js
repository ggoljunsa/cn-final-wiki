// subnet_alloc — L13 p.23–26 Example 7.5: 14.24.74.0/24 를 120 · 60 · 10 주소 subnet 으로 나누기
//   need → 2^k 로 올림 → 큰 것부터 → 시작 주소가 N_sub 로 나누어떨어지는지 확인 → reserve
//   모든 값은 python ipaddress 로 검산 (CONTRACT §1 L13)
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  var BASE = [14, 24, 74];     // 14.24.74.0/24, 마지막 바이트만 바뀐다
  function addr(k) { return BASE.join(".") + "." + k; }
  function up2(x) { var p = 1; while (p < x) p *= 2; return p; }
  function log2(x) { return Math.round(Math.log(x) / Math.LN2); }
  var COL = { a: ["#dbe8f7", "#1d65b3"], b: ["#fdeec2", "#c27a12"], c: ["#dff3e4", "#2e9e4f"] };

  // 0–255 막대 그림
  function makeSvg(placed, cursorAt, reserve) {
    return function () {
      var W = 680, x0 = 40, w = 600, sc = w / 256;
      var s = '<svg viewBox="0 0 ' + W + ' 170" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">';
      s += '<text x="' + x0 + '" y="20" font-weight="700">14.24.74.0/24 — N = 256 (마지막 바이트 0 … 255)</text>';
      s += '<rect x="' + x0 + '" y="40" width="' + w + '" height="44" fill="#f4f4f4" stroke="#888"/>';
      placed.forEach(function (p) {
        var col = COL[p.id] || ["#f8d7dc", "#d6465f"];
        var bad = p.bad;
        s += '<rect x="' + (x0 + p.start * sc) + '" y="40" width="' + (p.size * sc) + '" height="44" fill="' + (bad ? "#f8d7dc" : col[0]) + '" stroke="' + (bad ? "#d6465f" : col[1]) + '" stroke-width="2"' + (bad ? ' stroke-dasharray="5 3"' : '') + '/>';
        s += '<text x="' + (x0 + (p.start + p.size / 2) * sc) + '" y="60" text-anchor="middle" font-weight="700" fill="' + (bad ? "#d6465f" : col[1]) + '">' + p.id + ' /' + p.prefix + '</text>';
        s += '<text x="' + (x0 + (p.start + p.size / 2) * sc) + '" y="76" text-anchor="middle" font-size="11" fill="#333">' + p.size + (bad ? " ✗" : "") + '</text>';
        s += '<text x="' + (x0 + p.start * sc) + '" y="100" text-anchor="middle" font-size="10" fill="#555">.' + p.start + '</text>';
      });
      if (reserve) {
        s += '<rect x="' + (x0 + reserve[0] * sc) + '" y="40" width="' + ((reserve[1] - reserve[0] + 1) * sc) + '" height="44" fill="#333"/>';
        s += '<text x="' + (x0 + (reserve[0] + (reserve[1] - reserve[0] + 1) / 2) * sc) + '" y="66" text-anchor="middle" fill="#fff" font-weight="700">Unused ' + (reserve[1] - reserve[0] + 1) + '</text>';
        s += '<text x="' + (x0 + reserve[0] * sc) + '" y="100" text-anchor="middle" font-size="10" fill="#555">.' + reserve[0] + '</text>';
      }
      if (cursorAt !== null && cursorAt !== undefined) {
        var cx = x0 + cursorAt * sc;
        s += '<line x1="' + cx + '" y1="32" x2="' + cx + '" y2="92" stroke="#d6465f" stroke-width="2"/>';
        s += '<text x="' + cx + '" y="124" text-anchor="middle" fill="#d6465f" font-size="11">다음 시작 .' + cursorAt + '</text>';
      }
      s += '<text x="' + (x0 + w) + '" y="100" text-anchor="end" font-size="10" fill="#555">.255</text>';
      s += '<text x="' + x0 + '" y="156" fill="#777" font-size="11">규칙: ① N_sub = 2^k ② n_sub = 32 − log2 N_sub ③ first address 는 N_sub 로 나누어떨어진다 (p.23)</text>';
      s += '</svg>';
      return s;
    };
  }

  global.SIMS["subnet_alloc"] = {
    title: "Subnet 설계 — Example 7.5 (14.24.74.0/24 → 120 · 60 · 10)",
    desc: "[[subnetting]] 의 세 규칙대로 need 를 2 의 거듭제곱으로 올리고 '''큰 것부터''' 놓는다 → [[Example 7.5 subnet 설계]]. 작은 것부터 붙여 놓으면 시작 주소가 N_sub 로 나누어떨어지지 않는 함정도 볼 수 있다.",
    options: [
      { key: "order", label: "배치 순서", values: [
        { value: "largest", label: "큰 것부터 (슬라이드 풀이)" },
        { value: "smallest", label: "함정: 작은 것부터 빈틈없이" }
      ] }
    ],
    build: function (opts) {
      var order = opts.order || "largest";
      var needs = [{ id: "a", need: 120 }, { id: "b", need: 60 }, { id: "c", need: 10 }];
      if (order === "smallest") needs = needs.slice().reverse();
      var lines = [
        "block: 14.24.74.0/24 → N = 2^(32−24) = 256 (.0 … .255)",
        "need 를 2^k 로 올림 (N_sub must be a power of 2)",
        order === "largest" ? "큰 것부터 정렬 (largest first)" : "(✗) 요청 순서대로 작은 것부터",
        "n_sub = 32 − log2 N_sub",
        "시작 = 앞 subnet 바로 다음, 시작 ÷ N_sub 확인",
        "last = 시작 + N_sub − 1",
        "used = Σ N_sub, reserve = 256 − used"
      ];
      var vars = [
        { name: "block", label: "원래 block", group: "입력" },
        { name: "needs", label: "need", group: "입력" },
        { name: "cur", label: "지금 subnet", group: "계산" },
        { name: "alloc", label: "allocate (2^k)", group: "계산" },
        { name: "prefix", label: "n_sub", group: "계산" },
        { name: "range", label: "first – last", group: "계산" },
        { name: "div", label: "시작 ÷ N_sub", group: "계산" },
        { name: "used", label: "used", group: "결과" },
        { name: "reserve", label: "reserve", group: "결과" }
      ];
      var st = { block: "14.24.74.0/24 (256)", needs: "a 120 · b 60 · c 10", cur: "—", alloc: "—", prefix: "—", range: "—", div: "—", used: "0", reserve: "—" };
      var placed = [], steps = [];
      function push(desc, pc, cursor, reserve, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(placed.slice(), cursor, reserve) });
      }
      push("Example 7.5: '''14.24.74.0/24''' → $2^{32-24}$ = '''256''' 주소(First 14.24.74.0, Last 14.24.74.255). 여기서 subblock 3 개(120, 60, 10 주소)를 만든다.", 1, 0);
      needs.forEach(function (x) { x.alloc = up2(x.need); x.k = log2(x.alloc); });
      st.needs = needs.map(function (x) { return x.id + " " + x.need + "→" + x.alloc; }).join(" · ");
      push("need 를 2 의 거듭제곱으로 올린다: 120 → '''128''' ($2^7$), 60 → '''64''' ($2^6$), 10 → '''16''' ($2^4$). 120 이나 60 은 block 크기가 될 수 없다(p.9 \"must be a power of 2\").", 2, 0);
      push(order === "largest"
        ? "'''큰 것부터''' 놓는다: a(128) → b(64) → c(16). 교수(47:31): \"allocate the largest first and ends with assigning the smallest\". 그래야 시작 주소가 저절로 각 크기로 나누어떨어진다."
        : "(함정) 요청 순서를 뒤집어 '''작은 것부터''' 빈틈없이 붙여 본다: c(16) → b(64) → a(128).", 3, 0);
      var cursor = 0, used = 0, broken = false;
      needs.forEach(function (x) {
        var start = cursor, ok = start % x.alloc === 0;
        st.cur = x.id + " (need " + x.need + ")";
        st.alloc = x.alloc + " = 2^" + x.k;
        st.prefix = "32 − " + x.k + " = " + (32 - x.k);
        push("subblock '''" + x.id + "''': N_sub = " + x.alloc + " → $n_{sub} = 32 - \\log_2 " + x.alloc + " = 32 - " + x.k + "$ = '''/" + (32 - x.k) + "'''.", 4, cursor);
        st.div = start + " ÷ " + x.alloc + " = " + (start / x.alloc) + (ok ? " ✓" : " ✗ (나머지 " + (start % x.alloc) + ")");
        st.range = addr(start) + "/" + (32 - x.k) + " – " + addr(start + x.alloc - 1) + "/" + (32 - x.k);
        placed.push({ id: x.id, start: start, size: x.alloc, prefix: 32 - x.k, bad: !ok });
        if (!ok) broken = true;
        push("시작 = '''" + addr(start) + "''' → " + start + " ÷ " + x.alloc + (ok ? " = " + (start / x.alloc) + " ✓ 나누어떨어진다." : " 은 나누어떨어지지 '''않는다''' ✗."), 5, cursor, null,
          ok ? undefined : "규칙 ③ 위반: " + addr(start) + "/" + (32 - x.k) + " 은 올바른 block 이 아니다. /" + (32 - x.k) + " 로 " + addr(start) + " 를 AND 하면 " + addr(start - start % x.alloc) + " 이 나와 앞 subnet 과 겹친다.");
        cursor = start + x.alloc;
        used += x.alloc;
        st.used = String(used);
        push("last = " + start + " + " + x.alloc + " − 1 = " + (cursor - 1) + " → " + st.range + ". 다음 subnet 은 '''." + cursor + "''' 부터.", 6, cursor);
      });
      st.reserve = (256 - used) + " (" + addr(used) + " – " + addr(255) + ")";
      st.cur = "—";
      if (order === "largest") {
        push("used = 128 + 64 + 16 = '''208''' → '''48''' 주소가 reserve(14.24.74.208 – 14.24.74.255). 48 은 2 의 거듭제곱이 아니라 prefix 는 아직 정하지 않는다(p.26). 교수(51:28) \"the last parts of these addresses are unused\".", 7, null, [208, 255],
          "슬라이드 p.26 그림의 c 시작 라벨 \"14.24.192.0/28\" 은 오타 — 표(p.25)대로 14.24.74.192/28 이 맞다.");
      } else {
        push("used 는 똑같이 208 이지만 '''b 와 a 의 시작 주소가 규칙 ③ 을 어긴다'''. 올바르게 하려면 b 를 .64, a 를 .128 로 밀어야 하고, 그러면 .16–.63 에 48 주소짜리 '''틈'''이 끼어 남는 공간이 조각난다. → '''큰 것부터'''가 정답.", 7, null, null,
          broken ? "작은 것부터 빈틈없이 놓으면 시작 주소가 N_sub 의 배수가 아니게 된다 — 슬라이드가 \"This keeps every start address divisible by its block size\" 라고 한 이유." : undefined);
      }
      return { panels: [{ id: "P", title: "Subnet 설계 순서 (p.23–26)", lang: "txt", lines: lines }], vars: vars, steps: steps };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
