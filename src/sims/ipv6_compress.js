// ipv6_compress — L14 p.3–4: 128-bit IPv6 주소(hex 32 자리)를 줄여 쓰기
//   ① section 마다 leading zero 지우기 ② 가장 긴 0 section 줄을 :: 로 (주소마다 한 번만) ③ 되돌려 검산
//   결과는 python3 ipaddress.IPv6Address(...).compressed 로 검산 (CONTRACT §1 L14)
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  var CASES = {
    p4: { full: "FDEC:0074:0000:0000:0000:B0FF:0000:FFF0", name: "p.4 슬라이드 예" },
    p3: { full: "FEF6:BA98:7654:3210:ADEF:BBFF:2922:FF00", name: "p.3 슬라이드 예 (0 section 없음)" },
    ll: { full: "FE80:0000:0000:0000:F7A9:23FF:FE11:9BE2", name: "Ex 7.29 link-local" },
    tie: { full: "2001:0DB8:0000:0000:0001:0000:0000:0001", name: "0 줄 길이가 같은 두 곳" },
    one: { full: "0000:0000:0000:0000:0000:0000:0000:0001", name: "앞이 전부 0" },
    trap_double: { full: "2001:0DB8:0000:0000:0001:0000:0000:0001", name: "함정: :: 두 번", trap: "double" },
    trap_single: { full: "FDEC:0074:0000:0000:0000:B0FF:0000:FFF0", name: "함정: 0 하나짜리에 ::", trap: "single" }
  };

  function strip(sec) { var s = sec.replace(/^0+/, ""); return s === "" ? "0" : s; }
  function zeroRuns(secs) {
    var runs = [], i = 0;
    while (i < 8) {
      if (secs[i] === "0") { var j = i; while (j < 8 && secs[j] === "0") j++; runs.push([i, j - i]); i = j; } else i++;
    }
    return runs;
  }
  function joinWith(secs, start, len) {
    if (len <= 0) return secs.join(":");
    var left = secs.slice(0, start).join(":"), right = secs.slice(start + len).join(":");
    return left + "::" + right;
  }

  // 8 칸 그림: 칸마다 원래/줄인 값, 0 section 은 연한 빨강, :: 로 바뀐 칸은 점선
  function makeSvg(full, short, phase, run) {
    return function () {
      var W = 720, H = 150, cw = 84, x0 = 24;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="14">';
      for (var i = 0; i < 8; i++) {
        var x = x0 + i * cw, zero = short[i] === "0";
        var inRun = run && i >= run[0] && i < run[0] + run[1] && phase >= 3;
        var fill = inRun ? "#fff" : (zero && phase >= 2 ? "#fbe3e8" : "#dbe8f7");
        var stroke = inRun ? "#d6465f" : "#1d65b3";
        s += '<rect x="' + x + '" y="30" width="' + (cw - 8) + '" height="32" rx="4" fill="' + fill + '" stroke="' + stroke + '"' + (inRun ? ' stroke-dasharray="4 3"' : "") + '/>';
        s += '<text x="' + (x + (cw - 8) / 2) + '" y="51" text-anchor="middle" fill="' + (phase >= 1 ? "#999" : "#222") + '">' + full[i] + '</text>';
        if (phase >= 1) {
          s += '<rect x="' + x + '" y="74" width="' + (cw - 8) + '" height="32" rx="4" fill="' + fill + '" stroke="' + stroke + '"' + (inRun ? ' stroke-dasharray="4 3"' : "") + '/>';
          s += '<text x="' + (x + (cw - 8) / 2) + '" y="95" text-anchor="middle" font-weight="700" fill="' + (inRun ? "#d6465f" : "#222") + '">' + (inRun ? "·" : short[i]) + '</text>';
        }
        s += '<text x="' + (x + (cw - 8) / 2) + '" y="22" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#777">section ' + (i + 1) + '</text>';
      }
      s += '<text x="12" y="135" font-family="sans-serif" font-size="12" fill="#555">윗줄: 원래 4 자리 · 아랫줄: leading zero 를 지운 값 · 빨간 점선: :: 로 사라지는 0 section</text>';
      s += '</svg>';
      return s;
    };
  }

  global.SIMS["ipv6_compress"] = {
    title: "IPv6 주소 줄여 쓰기 — leading zero → :: (L14 p.3–4)",
    desc: "128-bit [[IPv6 address]] 를 [[colon hexadecimal notation]] 8 section 으로 쓴 뒤, section 마다 앞쪽 0 을 지우고 가장 긴 0 section 줄을 `::` 로 바꾼다([[zero compression]]). `::` 는 주소마다 한 번만. 결과는 python `ipaddress` 로 검산했다.",
    options: [
      { key: "case", label: "주소", values: [
        { value: "p4", label: "p.4 FDEC:0074:0000:0000:0000:B0FF:0000:FFF0" },
        { value: "p3", label: "p.3 FEF6:BA98:7654:3210:ADEF:BBFF:2922:FF00" },
        { value: "ll", label: "Ex 7.29 FE80:0000:0000:0000:F7A9:23FF:FE11:9BE2" },
        { value: "tie", label: "2001:0DB8:0000:0000:0001:0000:0000:0001 (같은 길이 두 줄)" },
        { value: "one", label: "0000:…:0000:0001 (앞이 전부 0)" },
        { value: "trap_double", label: "함정: :: 를 두 번 쓰면?" },
        { value: "trap_single", label: "함정: 0 하나짜리에 :: 를 쓰면?" }
      ] }
    ],
    build: function (opts) {
      var c = CASES[opts["case"] || "p4"];
      var full = c.full.split(":");
      var short = full.map(strip);
      var runs = zeroRuns(short);
      var best = null;
      runs.forEach(function (r) { if (r[1] >= 2 && (!best || r[1] > best[1])) best = r; });
      var lines = [
        "8 sections × hex 4 자리로 나눈다 (section = 16 bits)",
        "① 각 section 의 앞쪽 0 을 지운다 (0074→74, 0000→0)",
        "② 0 section 이 이어진 줄을 모두 찾는다",
        "③ 가장 긴 줄 하나를 :: 로 바꾼다 (주소마다 한 번만)",
        "검산: 숨은 0 section 수 = 8 − 보이는 section 수"
      ];
      var vars = [
        { name: "full", label: "원래 주소", group: "입력" },
        { name: "lead", label: "① leading zero 제거", group: "과정" },
        { name: "runs", label: "② 0 section 줄", group: "과정" },
        { name: "pick", label: "③ :: 로 바꿀 줄", group: "과정" },
        { name: "result", label: "결과", group: "결과" },
        { name: "check", label: "검산", group: "결과" }
      ];
      var st = { full: c.full, lead: "?", runs: "?", pick: "?", result: "?", check: "?" };
      var steps = [];
      function push(desc, pc, phase, run, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(full, short, phase, run) });
      }
      push("'''" + c.name + "'''. 128 bits 를 16 bits 씩 8 section 으로 나눴고, section 마다 hex 4 자리다.", 1, 0, null);
      st.lead = short.join(":");
      push("① 각 section 의 '''앞쪽 0''' 을 지운다. 뒤쪽 0 과 가운데 0 은 값이라서 남긴다(B0FF, FFF0 그대로). → `" + st.lead + "`", 2, 1, null);
      st.runs = runs.length ? runs.map(function (r) { return "section " + (r[0] + 1) + (r[1] > 1 ? "–" + (r[0] + r[1]) : "") + " (" + r[1] + "개)"; }).join(", ") : "없음";
      push("② 0 section 이 이어진 줄을 찾는다: " + st.runs + ".", 3, 2, null, runs.length ? undefined : "0 section 이 없으니 :: 를 쓸 곳이 없다. ① 결과가 최종 표기다.");

      var run = best, result;
      if (c.trap === "single") {
        run = [6, 1];
        st.pick = "section 7 (1개) ← 일부러";
        result = joinWith(short, 6, 1);
        st.result = result + "  (맞는 주소지만 가장 짧지 않음)";
        push("③ 함정: 길이 3 짜리 줄을 놔두고 0 하나뿐인 section 7 을 `::` 로 바꿨다 → `" + result + "`.", 4, 3, run,
          "규칙 위반은 아니다(:: 는 한 번만 썼다). 하지만 더 긴 줄을 줄인 FDEC:74::B0FF:0:FFF0 보다 길다. 시험에서는 가장 긴 0 줄을 :: 로 쓴다.");
      } else if (c.trap === "double") {
        st.pick = "section 3–4 와 section 6–7 둘 다 ← 일부러";
        result = "2001:DB8::1::1";
        st.result = result + "  ✗ 틀린 표기";
        push("③ 함정: 길이 2 짜리 줄 두 곳을 모두 `::` 로 바꾸면 `" + result + "` 이 된다.", 4, 3, runs[0],
          "보이는 section 이 4 개라 숨은 0 은 4 개다. 그런데 두 :: 에 1+3, 2+2, 3+1 중 어떻게 나눠야 할지 알 수 없다. 그래서 :: 는 주소마다 한 번만(p.4 형광펜, 11/10 06:18).");
        st.result = "2001:DB8::1:0:0:1  (앞쪽 한 줄만 ::)";
        push("바르게 쓰면 한 줄만 `::` 로 바꾸고 다른 줄은 `0:0` 으로 남긴다. 길이가 같으면 관례상 앞쪽을 줄인다 → '''2001:DB8::1:0:0:1'''.", 4, 3, runs[0]);
        run = runs[0];
        result = "2001:DB8::1:0:0:1";
      } else if (best) {
        st.pick = "section " + (best[0] + 1) + "–" + (best[0] + best[1]) + " (" + best[1] + "개)";
        result = joinWith(short, best[0], best[1]);
        st.result = result;
        var tieNote = runs.filter(function (r) { return r[1] === best[1]; }).length > 1 ? "길이가 같은 줄이 둘이다. 하나만 :: 로 줄일 수 있으니 관례상 앞쪽을 줄이고, 뒤쪽은 0:0 으로 남긴다." : undefined;
        push("③ 가장 긴 줄(" + st.pick + ")을 `::` 로 바꾼다 → '''" + result + "'''.", 4, 3, best, tieNote);
      } else {
        st.pick = runs.length ? "길이 1 짜리뿐 → 그대로 0" : "없음";
        result = short.join(":");
        st.result = result;
        push("③ `::` 로 바꿀 줄이 없다. 결과는 '''" + result + "'''.", 4, 3, null);
      }
      {
        var visible = run ? 8 - run[1] : 8;
        st.check = run ? "보이는 " + visible + "개 → 숨은 0 section " + (8 - visible) + "개 → " + c.full + " ✓" : "section 8 개 그대로 ✓";
        push("검산: `::` 를 풀 때는 보이는 section 을 센다. " + (run ? visible + " 개가 보이니 `::` 자리에 0000 이 " + (8 - visible) + " 개 숨어 있다 → 원래 주소 " + c.full + " 로 돌아온다." : "줄인 곳이 없으니 그대로다."), 5, 3, run);
      }
      return { panels: [{ id: "P", title: "줄여 쓰는 순서 (p.4)", lang: "txt", lines: lines }], vars: vars, steps: steps };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
