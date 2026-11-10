// eui64 — L14 p.10–12, p.19–21: link-layer 주소 → interface ID → link-local (→ global) 주소
//   48-bit Ethernet: 7번째 bit 뒤집기 + 가운데 FFFE / 64-bit EUI-64: 7번째 bit 만 뒤집기
//   결과는 python3 ipaddress 로 검산 (CONTRACT §1 L14)
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  var CASES = {
    ex729: { mac: "F5-A9-23-11-9B-E2", kind: 48, name: "Example 7.29 (p.19–21)", prefix: "3A21:1216:2165", subnet: "1232" },
    m001a: { mac: "00-1A-2B-3C-4D-5E", kind: 48, name: "MAC 00-1A-2B-3C-4D-5E (0 → 1)" },
    m0a: { mac: "0A-00-27-00-00-01", kind: 48, name: "MAC 0A-00-27-00-00-01 (7번째 bit 가 이미 1 → 0)" },
    eui: { mac: "00-1B-63-11-22-33-44-55", kind: 64, name: "64-bit EUI-64 00-1B-63-11-22-33-44-55 (p.11 (a))" },
    trap8: { mac: "F5-A9-23-11-9B-E2", kind: 48, name: "함정: 8번째 bit 를 뒤집으면", trap: true }
  };

  function hex2(n) { var s = n.toString(16).toUpperCase(); return s.length < 2 ? "0" + s : s; }
  function bin8(n) { var s = n.toString(2); while (s.length < 8) s = "0" + s; return s; }
  function strip(sec) { var s = sec.replace(/^0+/, ""); return s === "" ? "0" : s; }

  function makeSvg(bytes, flippedIdx, insert, phase) {
    return function () {
      var W = 720, H = 170, bw = 72, x0 = 20;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="14">';
      // 윗줄: link-layer 주소 bytes
      s += '<text x="' + x0 + '" y="20" font-family="sans-serif" font-size="12" fill="#777">link-layer 주소 (' + bytes.length * 8 + ' bits)</text>';
      bytes.forEach(function (b, i) {
        var x = x0 + i * bw;
        s += '<rect x="' + x + '" y="28" width="' + (bw - 6) + '" height="30" rx="4" fill="#dbe8f7" stroke="#1d65b3"/>';
        s += '<text x="' + (x + (bw - 6) / 2) + '" y="48" text-anchor="middle">' + hex2(b) + '</text>';
      });
      // 첫 byte 2진수
      if (phase >= 1) {
        var b0 = bin8(bytes[0]);
        for (var k = 0; k < 8; k++) {
          var hit = k === flippedIdx;
          s += '<rect x="' + (x0 + k * 22) + '" y="66" width="20" height="22" fill="' + (hit ? "#fbe3e8" : "#f4f4f4") + '" stroke="' + (hit ? "#d6465f" : "#bbb") + '"/>';
          s += '<text x="' + (x0 + k * 22 + 10) + '" y="82" text-anchor="middle" fill="' + (hit ? "#d6465f" : "#222") + '">' + b0[k] + '</text>';
          s += '<text x="' + (x0 + k * 22 + 10) + '" y="100" text-anchor="middle" font-size="10" fill="#777">' + (k + 1) + '</text>';
        }
        s += '<text x="' + (x0 + 186) + '" y="82" font-family="sans-serif" font-size="12" fill="#555">첫 byte, 왼쪽부터 1–8 번째 bit</text>';
      }
      // 아랫줄: interface ID 8 bytes
      if (phase >= 2) {
        var out = [];
        var fb = bytes[0] ^ (flippedIdx === 6 ? 2 : 1);
        if (insert) out = [fb, bytes[1], bytes[2], 0xFF, 0xFE, bytes[3], bytes[4], bytes[5]];
        else out = [fb].concat(bytes.slice(1));
        s += '<text x="' + x0 + '" y="120" font-family="sans-serif" font-size="12" fill="#777">interface ID (64 bits)</text>';
        out.forEach(function (b, i) {
          var x = x0 + i * bw, add = insert && (i === 3 || i === 4), first = i === 0;
          s += '<rect x="' + x + '" y="128" width="' + (bw - 6) + '" height="30" rx="4" fill="' + (add ? "#3b2f4a" : (first ? "#fbe3e8" : "#dbe8f7")) + '" stroke="' + (add ? "#3b2f4a" : (first ? "#d6465f" : "#1d65b3")) + '"/>';
          s += '<text x="' + (x + (bw - 6) / 2) + '" y="148" text-anchor="middle" font-weight="700" fill="' + (add ? "#fff" : "#222") + '">' + hex2(b) + '</text>';
        });
      }
      s += '</svg>';
      return s;
    };
  }

  global.SIMS["eui64"] = {
    title: "MAC 주소 → interface ID → link-local 주소 (L14 p.10–12, Ex 7.29)",
    desc: "[[EUI-64|link-layer address mapping]]: 48-bit Ethernet 주소는 첫 byte 의 '''7번째 bit''' 를 뒤집고 가운데에 '''FFFE''' 를 넣어 64-bit [[interface ID]] 를 만든다. 64-bit EUI-64 는 bit 만 뒤집는다. 그 뒤 FE80::/10 을 붙이면 [[link-local address]], router 가 준 prefix 를 붙이면 [[global unicast address]]. python `ipaddress` 로 검산했다.",
    options: [
      { key: "case", label: "주소", values: [
        { value: "ex729", label: "Ex 7.29 — F5-A9-23-11-9B-E2" },
        { value: "m001a", label: "00-1A-2B-3C-4D-5E" },
        { value: "m0a", label: "0A-00-27-00-00-01 (이미 1 인 bit)" },
        { value: "eui", label: "64-bit EUI-64 00-1B-63-11-22-33-44-55" },
        { value: "trap8", label: "함정: 8번째 bit 를 뒤집으면" }
      ] }
    ],
    build: function (opts) {
      var c = CASES[opts["case"] || "ex729"];
      var bytes = c.mac.split("-").map(function (h) { return parseInt(h, 16); });
      var flipIdx = c.trap ? 7 : 6;              // 0-based: 6 = 7번째 bit
      var mask = c.trap ? 1 : 2;
      var insert = c.kind === 48;
      var lines = [
        "link-layer 주소를 byte 로 나눈다 (48 bits = 6 bytes, EUI-64 = 8 bytes)",
        "첫 byte 를 2진수로 쓰고 왼쪽에서 7번째 bit 를 뒤집는다",
        "48-bit 면 앞 3 bytes | FF FE | 뒤 3 bytes (64 − 48 = 16 bits 채움)",
        "16 bits 씩 묶어 interface ID (4 sections)",
        "link-local = FE80:0:0:0 + interface ID → FE80::…",
        "global = router 가 준 prefix(48) + subnet ID(16) + interface ID(64)"
      ];
      var vars = [
        { name: "mac", label: "link-layer 주소", group: "입력" },
        { name: "b0", label: "첫 byte 2진수", group: "7번째 bit" },
        { name: "b0f", label: "뒤집은 뒤", group: "7번째 bit" },
        { name: "mid", label: "가운데 FFFE", group: "interface ID" },
        { name: "iid", label: "interface ID", group: "interface ID" },
        { name: "ll", label: "link-local", group: "주소" },
        { name: "gl", label: "global unicast", group: "주소" }
      ];
      var st = { mac: c.mac + " (" + c.kind + " bits)", b0: "?", b0f: "?", mid: "?", iid: "?", ll: "?", gl: c.prefix ? "?" : "(prefix 없음)" };
      var steps = [];
      function push(desc, pc, phase, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(bytes, flipIdx, insert, phase) });
      }
      push("'''" + c.name + "'''. " + (insert ? "Ethernet 주소는 48 bits = 6 bytes 다." : "EUI-64 주소는 64 bits = 8 bytes 라서 길이가 이미 interface ID 와 같다."), 1, 0);
      var fb = bytes[0] ^ mask;
      st.b0 = hex2(bytes[0]) + " = " + bin8(bytes[0]).slice(0, 4) + " " + bin8(bytes[0]).slice(4);
      st.b0f = hex2(fb) + " = " + bin8(fb).slice(0, 4) + " " + bin8(fb).slice(4);
      var bitBefore = bin8(bytes[0])[flipIdx];
      push("첫 byte " + hex2(bytes[0]) + " 를 2진수로 쓰면 " + st.b0.split("= ")[1] + ". " + (c.trap ? "'''8번째'''" : "왼쪽에서 '''7번째'''") + " bit 는 " + bitBefore + " 이고, 이것을 " + (bitBefore === "0" ? "1" : "0") + " 로 뒤집으면 '''" + hex2(fb) + "'''.", 2, 1,
        c.trap ? "틀렸다. 8번째(맨 오른쪽) bit 는 Ethernet 에서 unicast/multicast 를 가르는 bit 다. 규칙은 7번째 bit → F5 는 F7 이 돼야 한다." :
        (bitBefore === "1" ? "flip 은 bit 를 반대로 바꾸는 것이라서 이미 1 이면 0 이 된다. hex 로는 둘째 자리에서 2 를 빼는 것과 같다(A → 8)." : undefined));
      var out;
      if (insert) {
        out = [fb, bytes[1], bytes[2], 0xFF, 0xFE, bytes[3], bytes[4], bytes[5]];
        st.mid = hex2(fb) + "-" + hex2(bytes[1]) + "-" + hex2(bytes[2]) + " | FF-FE | " + hex2(bytes[3]) + "-" + hex2(bytes[4]) + "-" + hex2(bytes[5]);
        push("interface ID 는 64 bits 인데 Ethernet 주소는 48 bits 다. 64 − 48 = 16 bits 가 모자라니 앞 3 bytes 와 뒤 3 bytes 사이에 '''FF FE''' 를 넣는다(p.12 필기 \"64−48=16\").", 3, 2);
      } else {
        out = [fb].concat(bytes.slice(1));
        st.mid = "필요 없음 (이미 64 bits)";
        push("EUI-64 는 이미 64 bits 라서 FFFE 를 넣지 않는다. 7번째 bit 만 뒤집으면 끝이다(p.11 (a)).", 3, 2);
      }
      var secs = [0, 2, 4, 6].map(function (i) { return hex2(out[i]) + hex2(out[i + 1]); });
      st.iid = secs.join(":");
      push("16 bits(4 hex) 씩 묶으면 interface ID = '''" + st.iid + "'''.", 4, 2,
        c.trap ? "정답은 F7A9:23FF:FE11:9BE2 다. 한 bit 차이로 주소 전체가 달라진다." : undefined);
      st.ll = "FE80::" + secs.map(strip).join(":");
      push("[[link-local address]] = FE80:0000:0000:0000 + interface ID. 가운데 0 세 section 을 `::` 로 줄이고 leading zero 를 지우면 '''" + st.ll + "'''.", 5, 2);
      if (c.prefix) {
        st.gl = c.prefix + ":" + c.subnet + ":" + st.iid;
        push("router advertisement 가 prefix " + c.prefix + " 와 subnet ID " + c.subnet + " 를 준다. 뒤에 interface ID 를 붙이면 global unicast address = '''" + st.gl + "''' (48 + 16 + 64 = 128 bits).", 6, 2);
      }
      return { panels: [{ id: "P", title: "손으로 푸는 순서 (p.12, p.20–21)", lang: "txt", lines: lines }], vars: vars, steps: steps };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
