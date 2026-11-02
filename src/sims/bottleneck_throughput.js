// bottleneck_throughput — L12 p.34–36: path throughput = min(link rates) (the bottleneck)
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  function fx(x, d) { return String(Number(x.toFixed(d))); }
  function rate(bps) {
    if (bps >= 1e9) return fx(bps / 1e9, 2) + " Gbps";
    if (bps >= 1e6) return fx(bps / 1e6, 2) + " Mbps";
    return fx(bps / 1e3, 2) + " kbps";
  }

  // 모든 값은 python 으로 검산 (CONTRACT §6 bottleneck_throughput 행)
  var CASES = {
    slide: {
      name: "p.35–36 슬라이드 예제 — 링크 3개",
      nodes: ["Source", "R1", "R2", "Destination"],
      links: [200e3, 100e3, 150e3],
      labels: ["Link1", "Link2", "Link3"],
      file: 8e6, fileTxt: "1 MB (8,000,000 bits, 가정)",
      note: "답은 min(200, 100, 150) = 100 kbps. 평균 150 kbps 나 합 450 kbps 가 아니다 — 물은 가장 가는 관만큼만 흐른다."
    },
    dgist: {
      name: "DGIST 캠퍼스 (10/27 수업 일화) — WiFi 가 빨라도 유선 300 Mbps",
      nodes: ["노트북", "WiFi AP", "캠퍼스 유선", "Internet"],
      links: [1200e6, 300e6, 10e9],
      labels: ["WiFi (예: 1.2 Gbps)", "캠퍼스 유선 300 Mbps", "외부망 (예: 10 Gbps)"],
      file: 8e9, fileTxt: "1 GB (8×10^9 bits, 가정)",
      note: "교수: WiFi 가 300 Mbps 보다 빨라도 '''you cannot use your Wi-Fi service faster than this one''' — 유선 인프라가 bottleneck. Gigabit Ethernet(1 Gbps)보다도 느리다."
    },
    upgrade: {
      name: "업그레이드 뒤 (가정) — 유선 10 Gbps 가 되면?",
      nodes: ["노트북", "WiFi AP", "캠퍼스 유선", "Internet"],
      links: [1200e6, 10e9, 10e9],
      labels: ["WiFi (예: 1.2 Gbps)", "캠퍼스 유선 (가정 10 Gbps)", "외부망 (예: 10 Gbps)"],
      file: 8e9, fileTxt: "1 GB (8×10^9 bits, 가정)",
      note: "bottleneck 이 사라지는 게 아니라 '''옮겨 간다''' — 이제는 WiFi 링크가 가장 느린 링크다."
    }
  };

  function makeSvg(c, idx, level) {
    return function () {
      var W = 640, H = 220;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">';
      var max = Math.max.apply(null, c.links);
      var x0 = 70, gap = 170, y = 80;
      c.nodes.forEach(function (nm, j) {
        var x = x0 + j * gap;
        s += '<rect x="' + (x - 42) + '" y="' + (y - 16) + '" width="84" height="32" rx="5" fill="' + (j === 0 || j === c.nodes.length - 1 ? "#dbe8f7" : "#efe9f6") + '" stroke="' + (j === 0 || j === c.nodes.length - 1 ? "#1d65b3" : "#3b2f4a") + '"/>';
        s += '<text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="11" font-weight="700">' + nm + '</text>';
      });
      // 링크 = 관. 굵기 ∝ log(rate)
      c.links.forEach(function (r, k) {
        var xa = x0 + k * gap + 42, xb = x0 + (k + 1) * gap - 42;
        var th = 6 + 24 * r / max;
        if (th < 6) th = 6;
        var isMin = level >= 2 && r === Math.min.apply(null, c.links);
        var cur = level === 1 && k === idx;
        var fill = isMin ? "#fbe3e7" : (cur ? "#fff3bf" : "#f2f2f2");
        var stroke = isMin ? "#d6465f" : (cur ? "#d6a017" : "#999");
        s += '<rect x="' + xa + '" y="' + (y - th / 2) + '" width="' + (xb - xa) + '" height="' + th + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (isMin ? 2 : 1) + '"/>';
        s += '<text x="' + ((xa + xb) / 2) + '" y="' + (y - th / 2 - 8) + '" text-anchor="middle" fill="' + (isMin ? "#d6465f" : "#333") + '" font-size="11" font-weight="700">' + rate(r) + '</text>';
        s += '<text x="' + ((xa + xb) / 2) + '" y="' + (y + th / 2 + 16) + '" text-anchor="middle" fill="#777" font-size="10">' + c.labels[k] + '</text>';
        if (isMin) s += '<text x="' + ((xa + xb) / 2) + '" y="' + (y + th / 2 + 32) + '" text-anchor="middle" fill="#d6465f" font-weight="700">Bottleneck</text>';
      });
      if (level >= 2) {
        var mn = Math.min.apply(null, c.links);
        s += '<rect x="20" y="168" width="600" height="34" rx="6" fill="#dff3e4" stroke="#2e9e4f"/>';
        s += '<text x="320" y="190" text-anchor="middle" font-weight="700" fill="#1d6b2a">경로 throughput = min(' + c.links.map(rate).join(", ") + ') = ' + rate(mn) + '</text>';
      }
      s += '</svg>';
      return s;
    };
  }

  global.SIMS["bottleneck_throughput"] = {
    title: "Throughput = 가장 느린 링크 (bottleneck) — L12 p.34–36",
    desc: "[[throughput]] = number of bits passing a point per second. 여러 링크를 지나는 경로의 throughput 은 '''가장 느린 링크([[bottleneck]])''' 의 rate 다. 슬라이드 예제 min(200, 100, 150) kbps 와, 교수가 수업에서 든 DGIST 유선 300 Mbps 일화(링크 rate 는 예시값)를 같은 순서로 푼다.",
    options: [
      { key: "case", label: "경로", values: [
        { value: "slide", label: "슬라이드 200 / 100 / 150 kbps" },
        { value: "dgist", label: "DGIST: WiFi → 유선 300 Mbps" },
        { value: "upgrade", label: "업그레이드 뒤 (가정)" }
      ] }
    ],
    build: function (opts) {
      var c = CASES[opts["case"] || "slide"];
      var mn = Math.min.apply(null, c.links);
      var mi = c.links.indexOf(mn);
      var t = c.file / mn;
      var lines = [
        "throughput = number of bits passing a point per second",
        "각 링크의 transmission rate 를 적는다",
        "경로 throughput = min(link1, link2, …) = bottleneck",
        "파일 전송 시간 ≈ 파일 크기 / throughput"
      ];
      var vars = [];
      var st = {};
      c.links.forEach(function (r, k) {
        vars.push({ name: "l" + k, label: c.labels[k], group: "링크" });
        st["l" + k] = "?";
      });
      vars.push({ name: "min", label: "경로 throughput", group: "결과" });
      vars.push({ name: "time", label: "전송 시간 (" + c.fileTxt + ")", group: "결과" });
      st.min = "?"; st.time = "?";
      var steps = [];
      function push(desc, pc, idx, level, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(c, idx, level) });
      }
      push("'''" + c.name + "'''. [[throughput]] = 한 지점을 1 초에 지나가는 비트 수.", 1, -1, 0);
      c.links.forEach(function (r, k) {
        st["l" + k] = rate(r);
        push(c.labels[k] + " 의 rate = '''" + rate(r) + "'''.", 2, k, 1);
      });
      st.min = rate(mn);
      push("경로 전체는 '''가장 느린 링크''' 를 넘을 수 없다: min = '''" + rate(mn) + "''' (" + c.labels[mi] + " = [[bottleneck]]). 빠른 링크는 남는 용량을 쓰지 못하고 기다린다.", 3, mi, 2, c.note);
      st.time = fx(t, 2) + " s";
      push("파일 전송 시간 ≈ " + c.fileTxt + " ÷ " + rate(mn) + " ≈ '''" + fx(t, 2) + " s'''. (가장 빠른 링크 rate 로 나누면 " + fx(c.file / Math.max.apply(null, c.links), 2) + " s 로 너무 짧게 나온다.)", 4, mi, 2);
      return {
        panels: [{ id: "P", title: "손으로 푸는 순서", lang: "txt", lines: lines }],
        vars: vars,
        steps: steps
      };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
