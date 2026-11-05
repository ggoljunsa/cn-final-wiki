// ipv4_header_decode — L13 p.31–41: IPv4 header 의 앞 10 bytes 를 필드별로 해독
//   Ex 7.7 (01000010 → 버림), Ex 7.9 (HLEN 5, total 0028 → data 20), Ex 7.10 (45 00 00 28 00 01 00 00 01 02 → TTL 1, IGMP)
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  // 모든 값은 python 으로 검산 (src/_handoff_group7.md)
  var CASES = {
    ex77: { name: "Example 7.7 — 첫 8 bits 01000010", hex: ["42"], note77: true },
    ex79: { name: "Example 7.9 — HLEN 5, total length 0028 (hex)", hex: ["45", "00", "00", "28"] },
    ex710: { name: "Example 7.10 — 45 00 00 28 00 01 00 00 01 02", hex: ["45", "00", "00", "28", "00", "01", "00", "00", "01", "02"] },
    trap: { name: "함정 — 47 00 01 2C 3A 10 20 00 05 11 (HLEN ≠ 5)", hex: ["47", "00", "01", "2C", "3A", "10", "20", "00", "05", "11"] }
  };
  var PROTO = { 1: "ICMP", 2: "IGMP", 6: "TCP", 17: "UDP", 89: "OSPF" };

  function bin(v, w) { var s = v.toString(2); while (s.length < w) s = "0" + s; return s; }

  // 10 byte 상자 그림. hl = 강조할 byte 번호(1-based) 배열
  function makeSvg(hex, hl, label) {
    return function () {
      var W = 660, H = 150, bw = 58, x0 = 40, y = 40;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">';
      for (var i = 0; i < 10; i++) {
        var x = x0 + i * bw, known = i < hex.length, on = hl.indexOf(i + 1) >= 0;
        s += '<rect x="' + x + '" y="' + y + '" width="' + (bw - 4) + '" height="40" rx="3" fill="' + (on ? "#fff3bf" : (known ? "#f4f6f9" : "#fafafa")) + '" stroke="' + (on ? "#d6a017" : "#bbb") + '" stroke-width="' + (on ? 2 : 1) + '"/>';
        s += '<text x="' + (x + (bw - 4) / 2) + '" y="' + (y + 26) + '" text-anchor="middle" font-family="monospace" font-weight="' + (on ? 700 : 400) + '" fill="' + (known ? "#222" : "#bbb") + '">' + (known ? hex[i] : "··") + '</text>';
        s += '<text x="' + (x + (bw - 4) / 2) + '" y="' + (y + 56) + '" text-anchor="middle" font-size="11" fill="#777">' + (i + 1) + '</text>';
      }
      s += '<text x="' + x0 + '" y="24" fill="#333" font-size="12">IPv4 header 앞 10 bytes (hex) — 노란 칸이 지금 읽는 필드</text>';
      if (label) s += '<text x="' + x0 + '" y="126" fill="#d6a017" font-weight="700">' + label + '</text>';
      s += '</svg>';
      return s;
    };
  }

  global.SIMS["ipv4_header_decode"] = {
    title: "IPv4 header 해독 — hex bytes 를 필드별로 (L13 p.33–41)",
    desc: "[[IPv4 datagram format]] 의 앞 10 bytes 를 왼쪽부터 읽어 VER · [[HLEN]] · [[service type]] · [[total length]] · [[identification field|identification]] · [[flags D와 M|flags]]/[[fragmentation offset|offset]] · [[TTL]] · [[protocol field|protocol]] 을 꺼낸다. 4 bits·8 bits·16 bits 경계와 '''HLEN × 4''' 를 손으로 따라가 보라.",
    options: [
      { key: "case", label: "예제", values: [
        { value: "ex77", label: "Ex 7.7 — 01000010" },
        { value: "ex79", label: "Ex 7.9 — HLEN 5, 0028" },
        { value: "ex710", label: "Ex 7.10 — 45 00 00 28 … 01 02" },
        { value: "trap", label: "함정 — HLEN 7, M = 1" }
      ] }
    ],
    build: function (opts) {
      var c = CASES[opts["case"] || "ex77"];
      var b = c.hex.map(function (h) { return parseInt(h, 16); });
      var lines = [
        "byte 1 상위 4 bits = VER (4 여야 함)",
        "byte 1 하위 4 bits = HLEN → header = HLEN × 4 bytes (20–60)",
        "byte 2 = service type (DiffServ)",
        "byte 3–4 = total length (header + data, bytes)",
        "data = total length − HLEN × 4",
        "byte 5–6 = identification",
        "byte 7–8 = flags 3 bits (−, D, M) + offset 13 bits (× 8 bytes)",
        "byte 9 = TTL (남은 hop 수)",
        "byte 10 = protocol (1 ICMP, 2 IGMP, 6 TCP, 17 UDP, 89 OSPF)",
        "판정"
      ];
      var vars = [
        { name: "VER", group: "byte 1–4" }, { name: "HLEN", group: "byte 1–4" }, { name: "header", label: "header 길이", group: "byte 1–4" },
        { name: "tos", label: "service type", group: "byte 1–4" }, { name: "total", label: "total length", group: "byte 1–4" }, { name: "data", label: "data 길이", group: "byte 1–4" },
        { name: "id", label: "identification", group: "byte 5–8" }, { name: "flags", label: "flags (− D M)", group: "byte 5–8" }, { name: "offset", group: "byte 5–8" },
        { name: "TTL", group: "byte 9–10" }, { name: "protocol", group: "byte 9–10" },
        { name: "verdict", label: "판정", group: "결과" }
      ];
      var st = { VER: "?", HLEN: "?", header: "?", tos: "?", total: "?", data: "?", id: "?", flags: "?", offset: "?", TTL: "?", protocol: "?", verdict: "?" };
      var steps = [];
      function push(desc, pc, hl, label, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: makeSvg(c.hex, hl, label) });
      }

      push("'''" + c.name + "'''. header 는 '''32-bit(4-byte) 행''' 으로 그린다(p.32). 첫 행 = VER 4 bits · HLEN 4 bits · service type 8 bits · total length 16 bits. 왼쪽 byte 부터 읽는다.", null, [], "");

      var ver = b[0] >> 4, hlen = b[0] & 15, hdr = hlen * 4;
      st.VER = ver + " (" + bin(ver, 4) + ")";
      push("byte 1 = " + c.hex[0] + " = '''" + bin(b[0], 8) + "'''. 상위 4 bits " + bin(ver, 4) + " = '''" + ver + "''' → version " + (ver === 4 ? "정상 ✓" : "✗ (IPv4 가 아님)") + ".", 1, [1], "VER = " + ver);

      st.HLEN = hlen + " (" + bin(hlen, 4) + ")";
      st.header = hlen + " × 4 = " + hdr + " bytes";
      var badH = hdr < 20;
      push("하위 4 bits " + bin(hlen, 4) + " = HLEN '''" + hlen + "'''. [[HLEN]] 은 '''4-byte word 단위''' → header = " + hlen + " × 4 = '''" + hdr + " bytes'''." + (badH ? " 그런데 header 는 '''최소 20 bytes'''(HLEN ≥ 5)다." : (hdr > 20 ? " 20 bytes 보다 " + (hdr - 20) + " bytes 길다 → '''options''' 가 " + (hdr - 20) + " bytes 있다." : " 최소 길이 20 bytes — options 없음.")),
        2, [1], "HLEN = " + hlen + " → " + hdr + " B",
        c === CASES.trap ? "함정: HLEN 7 을 '7 bytes' 로 읽으면 안 된다. 단위가 4 bytes 라서 28 bytes 다(options 8 B)." : (badH ? "HLEN = 2 → 8 bytes < 20 bytes. 불가능한 값이다." : undefined));

      if (c.note77) {
        st.verdict = "discard — header 8 B < 20 B (전송 중 손상)";
        push("판정: VER = 4 는 맞지만 header 가 8 bytes 일 수는 없다(최소 20 bytes). '''the packet was corrupted in transmission''' → receiver 가 '''discard'''. (Ex 7.7 의 답)", 10, [1], "8 B < 20 B → discard ✗",
          "VER 는 맞아도 HLEN 이 5 미만이면 버린다. 이 판단에 checksum 까지 갈 필요도 없다.");
        return { panels: [{ id: "P", title: "읽는 순서 (p.33–41)", lang: "txt", lines: lines }], vars: vars, steps: steps };
      }

      st.tos = "0x" + c.hex[1] + (b[1] === 0 ? " (기본값)" : "");
      push("byte 2 = 0x" + c.hex[1] + " = [[service type]] (원래 TOS, 지금은 DiffServ). 이 문제에서는 의미 없음.", 3, [2], "service type = 0x" + c.hex[1]);

      var tot = (b[2] << 8) | b[3];
      st.total = "0x" + c.hex[2] + c.hex[3] + " = " + tot + " bytes";
      push("byte 3–4 = 0x" + c.hex[2] + c.hex[3] + " = '''" + tot + " bytes''' = [[total length]] (header + data). 16 진수 28 = 2 × 16 + 8 = 40." + (tot !== 40 ? " (0x" + c.hex[2] + c.hex[3] + " = " + (b[2] * 256) + " + " + b[3] + " = " + tot + ")" : ""), 4, [3, 4], "total length = " + tot + " B");

      st.data = tot + " − " + hdr + " = " + (tot - hdr) + " bytes";
      push("data = total length − HLEN × 4 = " + tot + " − " + hdr + " = '''" + (tot - hdr) + " bytes'''." + (c.hex.length === 4 ? " (Ex 7.9 의 답)" : ""), 5, [1, 3, 4], "data = " + (tot - hdr) + " B",
        c === CASES.trap ? "함정: header 를 20 으로 고정하면 300 − 20 = 280 (✗). HLEN 7 → 28 bytes 라서 272 bytes 다." : undefined);

      if (c.hex.length === 4) {
        st.verdict = "header 20 B + data 20 B = 40 B";
        push("판정: header 20 bytes + data 20 bytes = total 40 bytes. '''total length 는 header 까지 포함'''한다는 것이 핵심.", 10, [1, 3, 4], "20 + 20 = 40 ✓");
        return { panels: [{ id: "P", title: "읽는 순서 (p.33–41)", lang: "txt", lines: lines }], vars: vars, steps: steps };
      }

      var id = (b[4] << 8) | b[5];
      st.id = "0x" + c.hex[4] + c.hex[5] + " = " + id;
      push("byte 5–6 = 0x" + c.hex[4] + c.hex[5] + " = [[identification field|identification]] " + id + ". source 가 datagram 마다 붙이는 번호 — fragment 들이 같은 값을 복사해 가진다.", 6, [5, 6], "identification = " + id);

      var w = (b[6] << 8) | b[7], fl = w >> 13, off = w & 0x1fff;
      var D = (fl >> 1) & 1, M = fl & 1;
      st.flags = bin(fl, 3) + " → D = " + D + ", M = " + M;
      st.offset = off + " (× 8 = byte " + off * 8 + ")";
      push("byte 7–8 = " + bin(b[6], 8) + " " + bin(b[7], 8) + ". 앞 3 bits '''" + bin(fl, 3) + "''' = flags(reserved, D, M) → D = " + D + (D ? " (do not fragment)" : "") + ", M = " + M + ". 나머지 13 bits = [[fragmentation offset|offset]] " + off + ". M = 0 이고 offset = 0 → '''fragment 가 아닌 온전한 datagram'''.", 7, [7, 8], "flags " + bin(fl, 3) + ", offset " + off,
        D ? "D = 1: MTU 가 작은 링크를 만나도 라우터는 나눌 수 없다 → 버리고 ICMP 로 보고(destination unreachable)." : undefined);

      st.TTL = "0x" + c.hex[8] + " = " + b[8];
      push("byte 9 = 0x" + c.hex[8] + " = [[TTL]] '''" + b[8] + "'''. 8 bytes 를 건너뛴 9 번째 byte. 라우터마다 1 씩 줄고 0 이 되면 버려진다 → " + (b[8] === 1 ? "'''only 1 hop'''." : "최대 " + b[8] + " hops."), 8, [9], "TTL = " + b[8]);

      st.protocol = "0x" + c.hex[9] + " = " + b[9] + " → " + (PROTO[b[9]] || "?");
      push("byte 10 = 0x" + c.hex[9] + " = [[protocol field|protocol]] " + b[9] + " → '''" + (PROTO[b[9]] || "?") + "'''. destination 의 IP 가 payload 를 이 프로토콜로 올려 보낸다(demultiplexing).", 9, [10], "protocol = " + b[9] + " (" + PROTO[b[9]] + ")",
        b[9] === 17 ? "UDP = 17 은 16 진수로 0x11 이다." : undefined);

      st.verdict = c === CASES.ex710 ? "1 hop 만 갈 수 있음, 상위 프로토콜 IGMP" : "header 28 B(options 8 B), data 272 B, M = 1·offset 0 → 첫 fragment, TTL 5, UDP";
      push("판정: " + st.verdict + "." + (c === CASES.ex710 ? " (Ex 7.10 의 답 — TTL 은 9 번째, protocol 은 10 번째 byte)" : ""), 10, [9, 10], c === CASES.ex710 ? "TTL 1 hop · IGMP" : "28 B header · 첫 fragment · UDP");

      return { panels: [{ id: "P", title: "읽는 순서 (p.33–41)", lang: "txt", lines: lines }], vars: vars, steps: steps };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
