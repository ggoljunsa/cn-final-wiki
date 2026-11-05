// forward_lookup — L13 rev p.56–62: Ex 7.19 R1 forwarding table, 목적지 주소 AND mask (긴 mask 부터) → interface
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  // Ex 7.19 표 (rev p.60) — longest mask first. 모든 값은 python ipaddress 로 검산
  var TABLE = [
    { net: "180.70.65.192", len: 26, hop: "—", ifc: "m2" },
    { net: "180.70.65.128", len: 25, hop: "—", ifc: "m0" },
    { net: "201.4.22.0", len: 24, hop: "—", ifc: "m3" },
    { net: "201.4.16.0", len: 22, hop: "—", ifc: "m1" }
  ];
  var DEFAULT = { hop: "180.70.65.200", ifc: "m2" };
  var DESTS = {
    ex721: { ip: "180.70.65.140", name: "Example 7.21 — 180.70.65.140" },
    both: { ip: "180.70.65.200", name: "/26 와 /25 둘 다 맞는 주소 — 180.70.65.200" },
    m3: { ip: "201.4.22.35", name: "201.4.22.35 (예시)" },
    m1: { ip: "201.4.18.7", name: "201.4.18.7 (예시 — /22 블록 안)" },
    dflt: { ip: "18.24.32.78", name: "18.24.32.78 (예시 — 어느 행과도 안 맞음 → default)" }
  };

  function toInt(ip) { return ip.split(".").reduce(function (a, o) { return a * 256 + Number(o); }, 0); }
  function toIp(n) { return [24, 16, 8, 0].map(function (s) { return Math.floor(n / Math.pow(2, s)) % 256; }).join("."); }
  function maskInt(len) { return len === 0 ? 0 : (Math.pow(2, 32) - Math.pow(2, 32 - len)); }
  function andMask(ip, len) {
    // 32-bit AND 를 부호 문제 없이: 상위 len bits 만 남기기
    var n = toInt(ip), m = Math.pow(2, 32 - len);
    return Math.floor(n / m) * m;
  }
  function bits(ip) {
    return ip.split(".").map(function (o) { var s = Number(o).toString(2); while (s.length < 8) s = "0" + s; return s; }).join(" ");
  }
  function prefixBits(ip, len) {
    var b = bits(ip).replace(/ /g, "").slice(0, len), out = "";
    for (var i = 0; i < b.length; i++) { out += b[i]; if (i % 8 === 7 && i < b.length - 1) out += " "; }
    return out;
  }

  function makeSvg(dest, rowState, chosen) {
    return function () {
      var W = 660, H = 230, x0 = 20;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">';
      s += '<text x="' + x0 + '" y="18" font-weight="700">Forwarding table for R1 (p.60) — 목적지 ' + dest + '</text>';
      ["Network address/mask", "Next hop", "Interface", "dest AND mask", "Match?"].forEach(function (h, k) {
        s += '<text x="' + [x0 + 6, 200, 310, 390, 560][k] + '" y="42" font-weight="700" fill="#1d65b3">' + h + '</text>';
      });
      TABLE.concat([{ net: "Default", len: null, hop: DEFAULT.hop, ifc: DEFAULT.ifc }]).forEach(function (r, i) {
        var y = 50 + i * 30, rs = rowState[i] || {};
        var fill = rs.match === true ? "#dff3e4" : (rs.match === false ? "#fde2e4" : (rs.cur ? "#fff3bf" : "#f4f6f9"));
        s += '<rect x="' + x0 + '" y="' + y + '" width="620" height="26" fill="' + fill + '" stroke="' + (chosen === i ? "#2e9e4f" : "#ddd") + '" stroke-width="' + (chosen === i ? 2.5 : 1) + '"/>';
        s += '<text x="' + (x0 + 6) + '" y="' + (y + 18) + '">' + r.net + (r.len !== null ? "/" + r.len : "") + '</text>';
        s += '<text x="200" y="' + (y + 18) + '">' + r.hop + '</text>';
        s += '<text x="320" y="' + (y + 18) + '" font-weight="700">' + r.ifc + '</text>';
        if (rs.anded) s += '<text x="390" y="' + (y + 18) + '" font-family="monospace">' + rs.anded + '</text>';
        if (rs.match !== undefined) s += '<text x="560" y="' + (y + 18) + '" font-weight="700" fill="' + (rs.match ? "#2e9e4f" : "#d6465f") + '">' + (rs.match ? "✓ yes" : "✗ no") + '</text>';
      });
      s += '<text x="' + x0 + '" y="216" fill="#777" font-size="11">위에서부터(긴 mask 부터) 차례로 AND → 처음 맞는 행 = longest match. 아무 것도 안 맞으면 Default.</text>';
      return s + '</svg>';
    };
  }

  global.SIMS["forward_lookup"] = {
    title: "Forwarding — 목적지 AND mask 를 긴 mask 부터 (L13 p.56–62, Ex 7.19–7.21)",
    desc: "라우터 R1 의 [[forwarding table]](p.60)에서 목적지 주소에 각 행의 mask 를 '''AND''' 해 그 행의 network address 와 같은지 본다. 행은 '''longest mask → shortest''' 로 정렬돼 있어 처음 맞는 행이 곧 [[longest mask matching|longest match]]. 맞는 행이 없으면 default(next hop 180.70.65.200).",
    options: [
      { key: "dest", label: "목적지", values: [
        { value: "ex721", label: "Ex 7.21 — 180.70.65.140" },
        { value: "both", label: "180.70.65.200 (/26·/25 둘 다)" },
        { value: "m3", label: "201.4.22.35" },
        { value: "m1", label: "201.4.18.7" },
        { value: "dflt", label: "18.24.32.78 (default)" }
      ] }
    ],
    build: function (opts) {
      var d = DESTS[opts.dest || "ex721"];
      var lines = [
        "목적지 주소를 꺼낸다 (Extract destination address)",
        "행 1: dest AND /26 mask == 180.70.65.192 ?",
        "행 2: dest AND /25 mask == 180.70.65.128 ?",
        "행 3: dest AND /24 mask == 201.4.22.0 ?",
        "행 4: dest AND /22 mask == 201.4.16.0 ?",
        "모두 아니면 Default → next hop 180.70.65.200",
        "맞은 행의 interface 로 내보낸다"
      ];
      var vars = [
        { name: "dest", label: "목적지", group: "입력" }, { name: "destBits", label: "목적지 (bits)", group: "입력" },
        { name: "row", label: "검사 중인 행", group: "검사" }, { name: "mask", label: "mask", group: "검사" }, { name: "anded", label: "dest AND mask", group: "검사" }, { name: "rowNet", label: "행의 network address", group: "검사" },
        { name: "out", label: "결과 interface", group: "결과" }, { name: "nexthop", label: "next hop", group: "결과" }
      ];
      var st = { dest: d.ip, destBits: bits(d.ip), row: "—", mask: "—", anded: "—", rowNet: "—", out: "?", nexthop: "?" };
      var rowState = [], steps = [];
      function push(desc, pc, chosen, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(d.ip, JSON.parse(JSON.stringify(rowState)), chosen) });
      }
      push("'''" + d.name + "'''. 패킷이 R1 에 도착했다. 라우터는 header 에서 destination address 만 꺼내 표를 찾는다(p.56).", 1, -1);

      var hit = -1;
      for (var i = 0; i < TABLE.length; i++) {
        var r = TABLE[i], a = toIp(andMask(d.ip, r.len)), ok = a === r.net;
        st.row = (i + 1) + " (" + r.net + "/" + r.len + ")";
        st.mask = "/" + r.len + " = " + toIp(maskInt(r.len));
        st.anded = a;
        st.rowNet = r.net + " (앞 " + r.len + " bits " + prefixBits(r.net, r.len) + ")";
        rowState[i] = { anded: a, match: ok };
        var extra = "";
        if (r.len === 26 || r.len === 25) {
          var last = Number(d.ip.split(".")[3]);
          extra = " (마지막 octet " + last + " = " + ("00000000" + last.toString(2)).slice(-8) + " → 앞 " + (r.len - 24) + " bits 만 남기면 " + a.split(".")[3] + ")";
        }
        push("행 " + (i + 1) + ": " + d.ip + " AND /" + r.len + " (" + toIp(maskInt(r.len)) + ") = '''" + a + "'''" + extra + ". 행의 network address " + r.net + " 와 " + (ok ? "'''같다 ✓''' → '''" + r.ifc + "'''" : "다르다 ✗ → 다음 행"), i + 2, ok ? i : -1,
          (ok && d === DESTS.both) ? "180.70.65.200 은 /25 행(180.70.65.128/25)에도 맞는다. 그래도 위에 있는 더 긴 /26 이 먼저 잡힌다 — 이것이 longest mask matching. 표 순서가 거꾸로였다면 m0 로 잘못 보냈을 것." : undefined);
        if (ok) { hit = i; break; }
      }
      if (hit < 0) {
        rowState[4] = { match: true };
        st.row = "Default (0.0.0.0/0)";
        st.mask = "/0 = 0.0.0.0"; st.anded = "0.0.0.0"; st.rowNet = "0.0.0.0 (비교할 bit 0 개 → 항상 맞음)";
        st.out = DEFAULT.ifc; st.nexthop = DEFAULT.hop;
        push("네 행 모두 실패 → '''Default''' 행. mask 길이 0 이라 모든 주소가 맞는다(가장 짧은 mask 라 맨 아래). next hop '''180.70.65.200''' (Rest of the Internet 쪽 라우터), interface '''m2'''.", 6, 4);
      } else {
        st.out = TABLE[hit].ifc; st.nexthop = "— (직접 연결된 네트워크 → 목적지 host 로 바로)";
      }
      push("결과: interface '''" + st.out + "''' 로 내보낸다" + (hit >= 0 ? ". next hop 칸이 '—' 인 것은 이 네트워크가 R1 에 '''직접 연결'''돼 있어 다음 라우터 없이 목적지 host 에게 바로 전달하기 때문." : ", next hop 180.70.65.200.") + (d === DESTS.ex721 ? " (Ex 7.21 의 답: /26 은 ✗, /25 에서 ✓ → m0)" : ""), 7, hit >= 0 ? hit : 4);
      return { panels: [{ id: "P", title: "검색 순서 (p.56–62)", lang: "txt", lines: lines }], vars: vars, steps: steps };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
