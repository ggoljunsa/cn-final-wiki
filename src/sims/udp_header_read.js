// udp_header_read — L16 p.34–36: UDP header 8 B(16 hex 자리)를 2 B 씩 끊어 읽기
//   p36   : 슬라이드 예제 CB84 000D 001C 001C → 52100 · 13 · 28 · data 20 · client → server · Daytime
//   dns   : 예시(슬라이드에 없음) E1F0 0035 002A 0000 → 57840 · 53 · 42 · data 34 · client → server · DNS, checksum 0 = 안 씀
//   reply : 예시 응답 0035 E1F0 0052 7A3C → 53 · 57840 · 82 · data 74 · server → client
//   모든 값은 python int(x,16) 으로 검산
window.SIMS = window.SIMS || {};
(function () {
  "use strict";
  var CASES = {
    p36: { hex: "CB84000D001C001C", label: "p.35–36 슬라이드 예제", app: { 13: "Daytime" } },
    dns: { hex: "E1F00035002A0000", label: "예시: DNS 질의 (슬라이드 밖)", app: { 53: "DNS" } },
    reply: { hex: "0035E1F000527A3C", label: "예시: DNS 응답 (슬라이드 밖)", app: { 53: "DNS" } }
  };
  var NAMES = ["Source port", "Destination port", "Total length", "Checksum"];
  var COL = ["#dbe8f7", "#fdeec2", "#dff3e4", "#fde2e4"];

  function svgOf(hex, hi) {
    return function () {
      var s = '<svg viewBox="0 0 560 120" width="560" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">';
      for (var i = 0; i < 4; i++) {
        var x = 10 + i * 136, on = hi === i || hi === "all";
        s += '<rect x="' + x + '" y="20" width="130" height="40" fill="' + COL[i] + '" stroke="' + (on ? "#d6465f" : "#888") + '" stroke-width="' + (on ? 3 : 1) + '"/>';
        s += '<text x="' + (x + 65) + '" y="46" text-anchor="middle" font-family="monospace" font-size="17" font-weight="700">' + hex.substr(i * 4, 4) + '</text>';
        s += '<text x="' + (x + 65) + '" y="80" text-anchor="middle" fill="#555">' + NAMES[i] + '</text>';
        s += '<text x="' + (x + 65) + '" y="98" text-anchor="middle" fill="#777" font-size="11">bytes ' + (i * 2) + '–' + (i * 2 + 1) + '</text>';
      }
      s += '<text x="280" y="14" text-anchor="middle" fill="#777" font-size="11">UDP header = 8 bytes = 2 B × 4 칸</text>';
      return s + '</svg>';
    };
  }

  SIMS["udp_header_read"] = {
    title: "UDP header 읽기 — hex 16 자리를 2 B 씩",
    desc: "p.35–36 예제처럼 UDP header 를 네 칸으로 끊고 10진수로 바꾼 뒤, port 크기로 방향(client → server)을 판정한다. [[UDP header]] · [[Example UDP header 읽기]]",
    options: [{ key: "c", label: "header", values: [
      { value: "p36", label: "p.35 CB84000D001C001C" },
      { value: "dns", label: "예시 E1F00035002A0000" },
      { value: "reply", label: "예시 0035E1F000527A3C" }] }],
    build: function (opts) {
      var c = CASES[opts.c] || CASES.p36, h = c.hex;
      var v = [0, 1, 2, 3].map(function (i) { return parseInt(h.substr(i * 4, 4), 16); });
      var src = v[0], dst = v[1], tl = v[2], ck = v[3];
      var dir, who, proc;
      if (dst <= 1023 && src > 1023) { dir = "client → server"; who = dst; proc = "destination 이 well-known port " + dst + " 이니 받는 쪽이 server"; }
      else if (src <= 1023 && dst > 1023) { dir = "server → client"; who = src; proc = "source 가 well-known port " + src + " 이니 보내는 쪽이 server"; }
      else { dir = "판정 불가"; who = null; proc = "둘 다 1023 보다 크다"; }
      var app = who !== null && c.app[who] ? c.app[who] : "?";
      var vars = [{ name: "hex", group: "입력" }, { name: "source port", group: "필드" }, { name: "destination port", group: "필드" },
        { name: "total length", group: "필드" }, { name: "data length", group: "필드" }, { name: "checksum", group: "필드" },
        { name: "방향", group: "판정" }, { name: "서비스", group: "판정" }];
      var snap = { hex: h, "source port": "?", "destination port": "?", "total length": "?", "data length": "?", checksum: "?", "방향": "?", "서비스": "?" };
      function S(o) { var r = {}; for (var k in snap) r[k] = snap[k]; for (var k2 in o) { r[k2] = o[k2]; snap[k2] = o[k2]; } return r; }
      var steps = [
        { desc: c.label + ". header 는 '''8 bytes''' 고정이라 hex 로 16 자리다. 2 B(hex 4 자리)씩 네 칸으로 끊는다.", pc: { P: 1 }, vars: S({}), svg: svgOf(h, "all") },
        { desc: "a. Source port = 0x" + h.substr(0, 4) + " = '''" + src + "'''", pc: { P: 2 }, vars: S({ "source port": src }), svg: svgOf(h, 0) },
        { desc: "b. Destination port = 0x" + h.substr(4, 4) + " = '''" + dst + "'''", pc: { P: 2 }, vars: S({ "destination port": dst }), svg: svgOf(h, 1) },
        { desc: "c. Total length = 0x" + h.substr(8, 4) + " = '''" + tl + " bytes'''. header 와 data 를 합친 길이다.", pc: { P: 3 }, vars: S({ "total length": tl }), svg: svgOf(h, 2) },
        { desc: "d. Data = total length − 8 = " + tl + " − 8 = '''" + (tl - 8) + " bytes'''", pc: { P: 4 }, vars: S({ "data length": tl - 8 }), svg: svgOf(h, 2) },
        { desc: "checksum = 0x" + h.substr(12, 4) + (ck === 0 ? ". 0 이면 보내는 쪽이 checksum 을 계산하지 않았다는 뜻이다(UDP 에서는 optional)." : ". pseudoheader + header + data 로 계산한 값이다."), pc: { P: 5 }, vars: S({ checksum: "0x" + h.substr(12, 4) + (ck === 0 ? " (안 씀)" : "") }), svg: svgOf(h, 3) },
        { desc: "e. " + proc + ". 그래서 '''" + dir + "'''.", pc: { P: 6 }, vars: S({ "방향": dir }), svg: svgOf(h, dir === "client → server" ? 1 : 0) },
        { desc: "f. well-known port " + who + " = '''" + app + "'''. 반대쪽 " + (who === dst ? src : dst) + " 은 client 의 ephemeral port 다.", pc: { P: 7 }, vars: S({ "서비스": app }), svg: svgOf(h, "all") }
      ];
      return {
        panels: [{ id: "P", title: "손으로 푸는 순서", lang: "txt", lines: [
          "1. hex 16 자리를 4 자리씩 네 칸으로 끊는다",
          "2. 1·2 칸 = source / destination port (16진 → 10진)",
          "3. 3 칸 = total length (header + data)",
          "4. data = total length − 8",
          "5. 4 칸 = checksum (0 이면 안 씀)",
          "6. 0–1023 쪽이 server → 방향 판정",
          "7. well-known port 번호 → 서비스 이름"] }],
        vars: vars, steps: steps
      };
    }
  };
})();
