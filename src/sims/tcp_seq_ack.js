// tcp_seq_ack — L16 p.47–50, p.56: TCP 는 byte 에 번호를 붙인다
//   five    : p.49 파일 5,000 B, 첫 byte 10,001, 1,000 B × 5 → seq 10,001 / 11,001 / 12,001 / 13,001 / 14,001, 마지막 byte 15,000
//   uneven  : 예시(슬라이드 밖) 첫 byte 4,001, segment 크기 500 · 1,200 · 300 → seq 4,001 / 4,501 / 5,701, 마지막 byte 5,999, ACK 6,000
//   hand    : p.56 three-way handshake: SYN seq 8000 → SYN+ACK seq 15000 ack 8001 → ACK seq 8001 ack 15001 (SYN·SYN+ACK 는 번호 1 개 소비, ACK 는 소비 안 함)
window.SIMS = window.SIMS || {};
(function () {
  "use strict";
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function barSvg(first, sizes, hi, ackShow) {
    return function () {
      var total = sizes.reduce(function (a, b) { return a + b; }, 0);
      var W = 600, x0 = 20, w = 560, s = '<svg viewBox="0 0 ' + W + ' 130" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">';
      var cols = ["#dbe8f7", "#fdeec2", "#dff3e4", "#efe9f6", "#fde2e4"];
      var cur = first, x = x0;
      sizes.forEach(function (sz, i) {
        var ww = w * sz / total, on = hi === i;
        s += '<rect x="' + x + '" y="30" width="' + ww + '" height="36" fill="' + cols[i % 5] + '" stroke="' + (on ? "#d6465f" : "#888") + '" stroke-width="' + (on ? 3 : 1) + '"/>';
        s += '<text x="' + (x + ww / 2) + '" y="53" text-anchor="middle" font-weight="700">Seg ' + (i + 1) + '</text>';
        s += '<text x="' + (x + 2) + '" y="84" fill="' + (on ? "#d6465f" : "#555") + '" font-size="11">' + fmt(cur) + '</text>';
        cur += sz; x += ww;
      });
      s += '<text x="' + (x0 + w) + '" y="100" text-anchor="end" fill="#555" font-size="11">마지막 byte ' + fmt(cur - 1) + '</text>';
      if (ackShow) s += '<text x="' + (x0 + w) + '" y="120" text-anchor="end" fill="#2e9e4f" font-weight="700">ACK number = ' + fmt(cur) + ' (다음에 기다리는 byte)</text>';
      s += '<text x="20" y="18" fill="#777" font-size="11">각 칸 아래 숫자 = 그 segment 의 sequence number (첫 byte 번호)</text>';
      return s + '</svg>';
    };
  }
  function handSvg(k) {
    return function () {
      var s = '<svg viewBox="0 0 560 210" width="560" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">';
      s += '<defs><marker id="tsa_a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1d65b3"/></marker></defs>';
      s += '<rect x="40" y="10" width="90" height="26" fill="#dbe8f7" stroke="#1d65b3"/><text x="85" y="28" text-anchor="middle" font-weight="700">Client</text>';
      s += '<rect x="430" y="10" width="90" height="26" fill="#dff3e4" stroke="#2e9e4f"/><text x="475" y="28" text-anchor="middle" font-weight="700">Server</text>';
      s += '<line x1="85" y1="36" x2="85" y2="205" stroke="#888"/><line x1="475" y1="36" x2="475" y2="205" stroke="#888"/>';
      var rows = [["① SYN (seq = 8000)", 1], ["② SYN + ACK (seq = 15000, ack = 8001)", -1], ["③ ACK (seq = 8001, ack = 15001)", 1]];
      rows.forEach(function (r, i) {
        if (i >= k) return;
        var y = 60 + i * 50, x1 = r[1] > 0 ? 85 : 475, x2 = r[1] > 0 ? 475 : 85;
        s += '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + (y + 24) + '" stroke="#1d65b3" stroke-width="2" marker-end="url(#tsa_a)"/>';
        s += '<text x="280" y="' + (y + 6) + '" text-anchor="middle" fill="' + (i === k - 1 ? "#d6465f" : "#222") + '">' + r[0] + '</text>';
      });
      return s + '</svg>';
    };
  }

  SIMS["tcp_seq_ack"] = {
    title: "TCP sequence number · ACK number 계산",
    desc: "TCP 는 segment 가 아니라 '''byte''' 에 번호를 붙인다. segment 의 sequence number = 그 안 첫 byte 의 번호, ACK number = 다음에 받을 byte 번호. [[TCP sequence number와 ISN]] · [[acknowledgment number]] · [[three-way handshake]]",
    options: [{ key: "c", label: "예제", values: [
      { value: "five", label: "p.49 5,000 B 를 1,000 B × 5" },
      { value: "uneven", label: "예시: 크기가 다른 segment 3 개" },
      { value: "hand", label: "p.56 three-way handshake" }] }],
    build: function (opts) {
      var c = opts.c || "five";
      if (c === "hand") {
        var vh = [{ name: "client seq", group: "Client" }, { name: "client 가 기다리는 byte", group: "Client" }, { name: "server seq", group: "Server" }, { name: "server 가 기다리는 byte", group: "Server" }];
        return {
          panels: [{ id: "P", title: "규칙", lang: "txt", lines: [
            "1. client ISN 을 무작위로 고른다 (8000)",
            "2. SYN 은 data 가 없어도 번호 1 개를 쓴다",
            "3. server ISN 을 고른다 (15000), ack = 8000 + 1",
            "4. SYN+ACK 도 번호 1 개를 쓴다",
            "5. ACK: seq = 8001, ack = 15000 + 1",
            "6. ACK 만 있는 segment 는 번호를 쓰지 않는다"] }],
          vars: vh,
          steps: [
            { desc: "client 가 active open. ISN 을 '''8000''' 으로 골랐다(p.56 예시 값).", pc: { P: 1 }, vars: { "client seq": 8000, "client 가 기다리는 byte": "?", "server seq": "?", "server 가 기다리는 byte": "?" }, svg: handSvg(0) },
            { desc: "① '''SYN (seq = 8000)'''. data 가 없지만 SYN 은 sequence number 하나를 쓴다. 그래서 client 의 다음 번호는 8001 이 된다.", pc: { P: 2 }, vars: { "client seq": "8000 → 다음 8001", "client 가 기다리는 byte": "?", "server seq": "?", "server 가 기다리는 byte": 8001 }, svg: handSvg(1) },
            { desc: "② '''SYN + ACK (seq = 15000, ack = 8001)'''. server 는 자기 ISN 15000 을 보내면서 \"8000 번까지 받았고 8001 번을 기다린다\" 고 알린다.", pc: { P: 3 }, vars: { "client seq": 8001, "client 가 기다리는 byte": 15001, "server seq": "15000 → 다음 15001", "server 가 기다리는 byte": 8001 }, svg: handSvg(2) },
            { desc: "③ '''ACK (seq = 8001, ack = 15001)'''. 이 ACK 는 data 가 없으니 번호를 쓰지 않는다. 그래서 다음 data segment 도 seq = 8001 로 나간다.", pc: { P: 5 }, vars: { "client seq": "8001 (그대로)", "client 가 기다리는 byte": 15001, "server seq": 15001, "server 가 기다리는 byte": 8001 }, svg: handSvg(3) },
            { desc: "SYN·SYN+ACK 는 번호 1 개씩 쓰고 ACK 는 쓰지 않는다. 양쪽 번호는 서로 독립이다(8000 계열과 15000 계열).", pc: { P: 6 }, vars: { "client seq": 8001, "client 가 기다리는 byte": 15001, "server seq": 15001, "server 가 기다리는 byte": 8001 }, svg: handSvg(3) }
          ]
        };
      }
      var first = c === "five" ? 10001 : 4001;
      var sizes = c === "five" ? [1000, 1000, 1000, 1000, 1000] : [500, 1200, 300];
      var vars = [{ name: "segment", group: "현재" }, { name: "bytes", group: "현재" }, { name: "sequence number", group: "현재" }, { name: "byte 범위", group: "현재" }];
      var steps = [{ desc: (c === "five" ? "p.49: 파일 5,000 bytes, 첫 byte 번호 10,001, 1,000 B 씩 5 segment." : "예시: 첫 byte 4,001, segment 크기 500 · 1,200 · 300 B.") + " 첫 segment 의 seq 는 첫 byte 번호다.", pc: { P: 1 }, vars: { segment: "-", bytes: "-", "sequence number": "-", "byte 범위": "-" }, svg: barSvg(first, sizes, -1, false) }];
      var cur = first;
      sizes.forEach(function (sz, i) {
        steps.push({ desc: "Segment " + (i + 1) + ": seq = " + (i === 0 ? "첫 byte 번호 " : "앞 seq + 앞 segment 의 bytes = ") + "'''" + fmt(cur) + "'''. 이 segment 는 " + fmt(cur) + " ~ " + fmt(cur + sz - 1) + " 번 byte 를 싣는다.", pc: { P: i === 0 ? 2 : 3 }, vars: { segment: i + 1, bytes: sz, "sequence number": fmt(cur), "byte 범위": fmt(cur) + " – " + fmt(cur + sz - 1) }, svg: barSvg(first, sizes, i, false) });
        cur += sz;
      });
      steps.push({ desc: "전부 받았다면 receiver 의 ACK number = 마지막 byte + 1 = '''" + fmt(cur) + "'''. cumulative 라서 \"" + fmt(cur - 1) + " 까지 다 받았다\" 는 뜻이다." + (c === "five" ? " 슬라이드 p.49 표의 Range 끝값(11,000 … 15,000)은 각 segment 의 마지막 byte 다." : ""), pc: { P: 4 }, vars: { segment: "ACK", bytes: "-", "sequence number": "-", "byte 범위": "ack = " + fmt(cur) }, svg: barSvg(first, sizes, -1, true) });
      return {
        panels: [{ id: "P", title: "손으로 푸는 순서", lang: "txt", lines: [
          "1. 첫 byte 번호를 확인",
          "2. 첫 segment seq = 첫 byte 번호",
          "3. 다음 seq = 앞 seq + 앞 segment bytes",
          "4. ACK = 마지막으로 받은 byte + 1"] }],
        vars: vars, steps: steps
      };
    }
  };
})();
