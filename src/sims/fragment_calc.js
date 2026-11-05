// fragment_calc — L13 p.42–48: datagram 크기 + MTU → fragment 별 bytes 범위 · offset · M · total length
//   p.45–46 (data 4,000 B, MTU 1,420 → offset 0/175/350), F2 재분할(MTU 820 → 175/275),
//   함정(MTU 1,000 → 8 의 배수로 내림), Ex 7.14 (M=1, offset=0 → first), Ex 7.16 (offset 100 → bytes 800–879)
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  // 모든 값은 python 으로 검산 (src/_handoff_group7.md)
  var CASES = {
    p46: { kind: "split", name: "p.45–46 — data 4,000 bytes(total 4,020), MTU 1,420", total: 4020, hlen: 20, mtu: 1420, base: 0, lastM: 0 },
    re: { kind: "split", name: "p.46 — F2(bytes 1400–2799, total 1,420) 를 다음 라우터가 MTU 820 으로 다시 나눔", total: 1420, hlen: 20, mtu: 820, base: 1400, lastM: 1 },
    trap: { kind: "split", name: "함정 — 같은 datagram, MTU 1,000 (980 은 8 의 배수가 아님)", total: 4020, hlen: 20, mtu: 1000, base: 0, lastM: 0 },
    ex714: { kind: "classify", name: "Example 7.14 — M = 1, offset = 0", M: 1, off: 0 },
    ex716: { kind: "range", name: "Example 7.16 — offset 100, HLEN 5, total length 100", off: 100, hlenWords: 5, total: 100 }
  };

  function split(c) {
    var data = c.total - c.hlen, maxd = Math.floor((c.mtu - c.hlen) / 8) * 8, out = [], o = 0;
    while (o < data) {
      var d = Math.min(maxd, data - o);
      out.push({ a: c.base + o, b: c.base + o + d - 1, d: d, tl: c.hlen + d, off: (c.base + o) / 8, M: (o + d < data) ? 1 : c.lastM });
      o += d;
    }
    return { data: data, maxd: maxd, frags: out };
  }

  // 원래 datagram 의 byte 축 위에 fragment 막대
  function makeSvg(lo, hi, frags, upto, extra) {
    return function () {
      var W = 660, H = 170, x0 = 40, x1 = 620, y = 60;
      function X(v) { return x0 + (v - lo) / (hi + 1 - lo) * (x1 - x0); }
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">';
      s += '<text x="' + x0 + '" y="20" fill="#333">원래 datagram 의 data bytes ' + lo + '–' + hi + ' (offset 은 항상 원래 datagram 기준)</text>';
      s += '<rect x="' + x0 + '" y="' + (y - 26) + '" width="' + (x1 - x0) + '" height="16" fill="#dbe8f7" stroke="#1d65b3"/>';
      var cols = ["#fdeec2", "#dff3e4", "#efe9f6", "#fde2e4", "#e3f2fd"];
      frags.forEach(function (f, i) {
        if (i >= upto) return;
        var xa = X(f.a), xb = X(f.b + 1);
        s += '<rect x="' + xa + '" y="' + y + '" width="' + Math.max(2, xb - xa - 2) + '" height="30" fill="' + cols[i % 5] + '" stroke="#e09a40"/>';
        s += '<text x="' + ((xa + xb) / 2) + '" y="' + (y + 19) + '" text-anchor="middle" font-weight="700">F' + (i + 1) + '</text>';
        s += '<text x="' + xa + '" y="' + (y + 46) + '" font-size="10" fill="#555">' + f.a + '</text>';
        s += '<text x="' + ((xa + xb) / 2) + '" y="' + (y + 62) + '" text-anchor="middle" font-size="10" fill="#d6465f">off ' + f.off + ' · M ' + f.M + '</text>';
      });
      if (extra) s += '<text x="' + x0 + '" y="' + (H - 12) + '" fill="#d6a017" font-weight="700">' + extra + '</text>';
      s += '</svg>';
      return s;
    };
  }

  global.SIMS["fragment_calc"] = {
    title: "Fragmentation 계산기 — MTU 로 나누고 offset · M · total length 구하기 (L13 p.42–48)",
    desc: "[[MTU]] 보다 큰 datagram 을 나눌 때 fragment 마다 '''data 범위 → [[fragmentation offset|offset]] = 첫 byte ÷ 8 → M bit → total length = header + data''' 를 구한다. 마지막이 아닌 fragment 의 data 는 '''8 의 배수'''여야 한다. Ex 7.14·7.16 은 거꾸로 header 값에서 위치를 읽는다.",
    options: [
      { key: "case", label: "예제", values: [
        { value: "p46", label: "p.46 — 4,000 B data, MTU 1,420" },
        { value: "re", label: "p.46 — F2 재분할 (MTU 820)" },
        { value: "trap", label: "함정 — MTU 1,000" },
        { value: "ex714", label: "Ex 7.14 — M = 1, offset = 0" },
        { value: "ex716", label: "Ex 7.16 — offset 100, total 100" }
      ] }
    ],
    build: function (opts) {
      var c = CASES[opts["case"] || "p46"];
      var steps = [], st, vars, lines;

      if (c.kind === "split") {
        var r = split(c);
        lines = [
          "data = total length − header (20 bytes)",
          "fragment 당 최대 data = (MTU − header) 를 8 의 배수로 내림",
          "앞에서부터 잘라 각 fragment 의 bytes a–b 정하기",
          "offset = a ÷ 8 (원래 datagram 기준)",
          "M = 1 (뒤에 더 있음) / 0 (마지막)",
          "total length = header + 이 fragment 의 data",
          "identification 은 모두 같은 값 복사 → destination 이 reassemble"
        ];
        vars = [
          { name: "total", label: "들어온 total length", group: "입력" }, { name: "mtu", label: "MTU", group: "입력" },
          { name: "data", label: "data 길이", group: "계산" }, { name: "maxd", label: "fragment 당 최대 data", group: "계산" },
          { name: "cur", label: "현재 fragment", group: "fragment" }, { name: "range", label: "bytes", group: "fragment" },
          { name: "off", label: "offset", group: "fragment" }, { name: "M", label: "M bit", group: "fragment" }, { name: "tl", label: "total length", group: "fragment" },
          { name: "list", label: "지금까지", group: "결과" }
        ];
        st = { total: c.total + " bytes", mtu: c.mtu + " bytes", data: "?", maxd: "?", cur: "—", range: "?", off: "?", M: "?", tl: "?", list: "—" };
        var lo = c.base, hi = c.base + r.data - 1;
        var push = function (desc, pc, upto, extra, note) {
          steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(lo, hi, r.frags, upto, extra) });
        };
        push("'''" + c.name + "'''. 다음 링크의 [[MTU]] 가 " + c.mtu + " bytes 라서 total " + c.total + " bytes 짜리는 그대로 못 지나간다.", null, 0, "");
        st.data = c.total + " − " + c.hlen + " = " + r.data + " bytes (bytes " + lo + "–" + hi + ")";
        push("data = " + c.total + " − 20 = '''" + r.data + " bytes'''." + (c.base ? " 이 조각은 이미 F2 라서 원래 datagram 의 bytes " + lo + "–" + hi + " 를 들고 있다." : ""), 1, 0, "");
        var raw = c.mtu - c.hlen;
        st.maxd = raw + (raw % 8 ? " → 8 의 배수로 내림 " + r.maxd : " (8 의 배수 ✓)") + " bytes";
        push("fragment 하나에 실을 수 있는 data = MTU − header = " + c.mtu + " − 20 = " + raw + (raw % 8 ? " → offset 이 '''8-byte 단위'''라서 8 의 배수로 내려 '''" + r.maxd + "'''." : " — 8 의 배수라 그대로 '''" + r.maxd + "'''."), 2, 0, "최대 data/fragment = " + r.maxd + " B",
          raw % 8 ? "함정: 980 을 그대로 쓰면 둘째 fragment 의 offset 이 980 ÷ 8 = 122.5 — 정수가 아니다. 그래서 976 으로 내린다." : undefined);
        var done = [];
        r.frags.forEach(function (f, i) {
          st.cur = "F" + (i + 1) + (c.base ? " (F2." + (i + 1) + ")" : "");
          st.range = f.a + "–" + f.b + " (" + f.d + " bytes)";
          st.off = f.a + " ÷ 8 = " + f.off;
          st.M = String(f.M);
          st.tl = "20 + " + f.d + " = " + f.tl;
          done.push("F" + (i + 1) + ": " + f.a + "–" + f.b + ", off " + f.off + ", M " + f.M + ", TL " + f.tl);
          st.list = done.join(" / ");
          var last = i === r.frags.length - 1;
          push("'''F" + (i + 1) + "''': bytes " + f.a + "–" + f.b + " → offset = " + f.a + " ÷ 8 = '''" + f.off + "''', M = '''" + f.M + "'''" + (last ? (f.M ? " (이 조각의 마지막이지만 원래 datagram 의 마지막은 아니다 → M = 1 유지)" : " (마지막)") : " (뒤에 더 있음)") + ", total length = 20 + " + f.d + " = '''" + f.tl + "'''.", last ? 5 : 4, i + 1, "F" + (i + 1) + " offset " + f.off,
            last && c.base ? "p.46 F2.2: 원래 F2 가 '''중간''' fragment 였으므로 다시 나눈 마지막 조각도 M = 1. M = 0 은 원래 datagram 의 진짜 끝(F3)만 갖는다." : undefined);
        });
        push("모든 fragment 는 같은 [[identification field|identification]](p.46 그림: 14,567)을 복사해 갖는다. 라우터는 다시 합치지 않고, '''destination host 만''' offset 순서로 [[reassembly|reassemble]] 한다.", 7, r.frags.length, r.frags.length + " fragments, offsets " + r.frags.map(function (f) { return f.off; }).join(" / "));
        return { panels: [{ id: "P", title: "나누는 순서 (p.42–46)", lang: "txt", lines: lines }], vars: vars, steps: steps };
      }

      if (c.kind === "classify") {
        lines = [
          "M = 0, offset = 0 → not fragmented",
          "M = 1, offset = 0 → first fragment",
          "M = 1, offset > 0 → middle fragment",
          "M = 0, offset > 0 → last fragment"
        ];
        vars = [{ name: "M", group: "입력" }, { name: "off", label: "offset", group: "입력" }, { name: "step1", label: "M 으로 좁히기", group: "판정" }, { name: "ans", label: "답", group: "판정" }];
        st = { M: String(c.M), off: String(c.off), step1: "?", ans: "?" };
        var tbl = function (row) {
          return function () {
            var rows = [["0", "0", "Not fragmented"], ["1", "0", "First fragment"], ["1", "> 0", "Middle fragment"], ["0", "> 0", "Last fragment"]];
            var s = '<svg viewBox="0 0 520 170" width="520" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">';
            s += '<text x="20" y="20" font-weight="700">Summary (p.47)</text>';
            ["M bit", "Offset", "This packet is…"].forEach(function (h, k) { s += '<text x="' + [40, 130, 230][k] + '" y="44" font-weight="700" fill="#1d65b3">' + h + '</text>'; });
            rows.forEach(function (rw, i) {
              var y = 52 + i * 26, on = row.indexOf(i) >= 0;
              s += '<rect x="20" y="' + y + '" width="460" height="24" fill="' + (on ? "#fff3bf" : "#f4f6f9") + '" stroke="' + (on ? "#d6a017" : "#ddd") + '"/>';
              s += '<text x="50" y="' + (y + 17) + '">' + rw[0] + '</text><text x="140" y="' + (y + 17) + '">' + rw[1].replace(">", "&gt;") + '</text><text x="230" y="' + (y + 17) + '">' + rw[2] + '</text>';
            });
            return s + '</svg>';
          };
        };
        steps.push({ desc: "'''" + c.name + "'''. 두 값으로 이 패킷이 첫 / 중간 / 마지막 fragment 중 무엇인지 판정한다.", pc: { P: null }, vars: JSON.parse(JSON.stringify(st)), svg: tbl([]) });
        st.step1 = "M = 1 → 뒤에 더 있음 → first 또는 middle";
        steps.push({ desc: "M = 1 = more fragments → '''마지막이 아니다'''. 그리고 '''fragment 이긴 하다'''(M = 1 이면 나뉜 것). → first 또는 middle.", pc: { P: 2 }, vars: JSON.parse(JSON.stringify(st)), svg: tbl([1, 2]) });
        st.ans = "first fragment";
        steps.push({ desc: "offset = 0 → data 가 원래 datagram 의 '''맨 앞(byte 0)''' 부터 → '''first fragment'''. (Ex 7.14 의 답)", pc: { P: 2 }, vars: JSON.parse(JSON.stringify(st)), svg: tbl([1]),
          note: "함정: offset = 0 만 보고 '안 나뉜 datagram' 이라고 하면 틀린다. M = 0 이고 offset = 0 이어야 not fragmented." });
        return { panels: [{ id: "P", title: "판정표 (p.47 Summary)", lang: "txt", lines: lines }], vars: vars, steps: steps };
      }

      // range — Ex 7.16
      lines = [
        "first byte = offset × 8",
        "header = HLEN × 4",
        "data = total length − header",
        "last byte = first + data − 1"
      ];
      vars = [{ name: "off", label: "offset", group: "입력" }, { name: "hlen", label: "HLEN", group: "입력" }, { name: "tl", label: "total length", group: "입력" },
        { name: "first", label: "first byte", group: "계산" }, { name: "data", label: "data", group: "계산" }, { name: "last", label: "last byte", group: "계산" }];
      st = { off: String(c.off), hlen: String(c.hlenWords), tl: String(c.total), first: "?", data: "?", last: "?" };
      var first = c.off * 8, data = c.total - c.hlenWords * 4, lastb = first + data - 1;
      var bar = function (lv) {
        return function () {
          var s = '<svg viewBox="0 0 560 120" width="560" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">';
          s += '<rect x="60" y="30" width="440" height="34" fill="#dbe8f7" stroke="#1d65b3"/>';
          s += '<text x="280" y="52" text-anchor="middle">data of this fragment: ' + (lv >= 2 ? data + " bytes" : "?") + '</text>';
          s += '<text x="60" y="88" text-anchor="middle" font-weight="700">' + (lv >= 1 ? first : "?") + '</text>';
          s += '<text x="500" y="88" text-anchor="middle" font-weight="700">' + (lv >= 3 ? lastb : "?") + '</text>';
          return s + '</svg>';
        };
      };
      steps.push({ desc: "'''" + c.name + "'''. 이 fragment 가 원래 datagram 의 몇 번째 byte 부터 몇 번째 byte 까지를 들고 있나?", pc: { P: null }, vars: JSON.parse(JSON.stringify(st)), svg: bar(0) });
      st.first = c.off + " × 8 = " + first;
      steps.push({ desc: "offset 은 '''8-byte 단위''' → first byte = " + c.off + " × 8 = '''" + first + "'''.", pc: { P: 1 }, vars: JSON.parse(JSON.stringify(st)), svg: bar(1),
        note: "함정: offset 100 을 그대로 first byte 100 이라고 쓰면 틀린다." });
      st.data = c.total + " − " + c.hlenWords + " × 4 = " + data;
      steps.push({ desc: "header = HLEN × 4 = 20 bytes. data = total length − header = " + c.total + " − 20 = '''" + data + " bytes'''.", pc: { P: 3 }, vars: JSON.parse(JSON.stringify(st)), svg: bar(2) });
      st.last = first + " + " + data + " − 1 = " + lastb;
      steps.push({ desc: "last byte = " + first + " + " + data + " − 1 = '''" + lastb + "'''. (Ex 7.16 의 답: 800–879) — '''−1''' 을 잊지 말 것(800 부터 80 개면 879 에서 끝).", pc: { P: 4 }, vars: JSON.parse(JSON.stringify(st)), svg: bar(3) });
      return { panels: [{ id: "P", title: "거꾸로 읽기 (p.48)", lang: "txt", lines: lines }], vars: vars, steps: steps };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
