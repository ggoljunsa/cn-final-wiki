// cwnd_tahoe_reno — L16 p.78–85: RTT 마다 cwnd(MSS 단위)와 ssthresh 를 따라간다
//   tahoe : p.83 그래프 — SS 1 2 4 8, RTT 3 time-out → ssthresh 4, cwnd 1 → 2 4 → CA 5 … 12 (RTT 13) → 3dupACKs → ssthresh 6, cwnd 1 → 2 4 6(Th) → CA 7 8 9 10
//   reno  : p.85 그래프 — RTT 13 까지 같음 → 3dupACKs → ssthresh 6, cwnd = 6 + 3 = 9 → FR 10, 12 → new ACK → cwnd = ssthresh 6 → CA 7 … 11
//   그래프 값은 슬라이드 그림에서 읽은 것(격자 눈금). Reno 의 FR 구간은 duplicate ACK 마다 +1 이라 RTT 당 +1 로 딱 떨어지지 않는다.
window.SIMS = window.SIMS || {};
(function () {
  "use strict";
  var DATA = {
    tahoe: [
      [0, 1, 16, "SS", "시작. cwnd = 1 MSS, ssthresh = 16. slow start."],
      [1, 2, 16, "SS", "ACK 가 다 오면 RTT 마다 두 배: 1 → 2."],
      [2, 4, 16, "SS", "2 → 4 (exponential)."],
      [3, 8, 16, "SS", "4 → 8. 이 RTT 에서 '''time-out''' 이 났다(빨간 네모)."],
      [3, 1, 4, "SS", "time-out: ssthresh = cwnd/2 = 8/2 = '''4''', cwnd = '''1''' → 다시 slow start."],
      [4, 2, 4, "SS", "1 → 2."],
      [5, 4, 4, "CA", "2 → 4. cwnd 가 ssthresh(4)에 닿았다(Th) → congestion avoidance."],
      [6, 5, 4, "CA", "CA 는 RTT 마다 +1 MSS (additive): 4 → 5."],
      [9, 8, 4, "CA", "5, 6, 7, 8 … 한 칸씩."],
      [13, 12, 4, "CA", "RTT 13 에 12. 여기서 '''3 duplicate ACKs'''."],
      [13, 1, 6, "SS", "Tahoe 는 3dupACKs 도 time-out 과 똑같이 본다: ssthresh = 12/2 = '''6''', cwnd = '''1''' → slow start."],
      [14, 2, 6, "SS", "1 → 2."],
      [15, 4, 6, "SS", "2 → 4."],
      [16, 6, 6, "CA", "4 → 8 이 아니라 ssthresh 6 에서 멈춘다(Th) → CA."],
      [19, 9, 6, "CA", "7, 8, 9 … RTT 마다 +1."]
    ],
    reno: [
      [0, 1, 16, "SS", "시작. cwnd = 1, ssthresh = 16. Tahoe 와 같은 출발."],
      [3, 8, 16, "SS", "1 → 2 → 4 → 8. RTT 3 에서 '''time-out'''."],
      [3, 1, 4, "SS", "time-out 은 Reno 도 Tahoe 와 같다: ssthresh = 4, cwnd = 1 → slow start."],
      [5, 4, 4, "CA", "2 → 4, ssthresh 에 닿아 CA."],
      [13, 12, 4, "CA", "+1 씩 올라 RTT 13 에 12. 여기서 '''3 duplicate ACKs'''."],
      [13, 9, 6, "FR", "Reno: ssthresh = 12/2 = '''6''', cwnd = ssthresh + 3 = '''9''' → '''fast recovery'''. 1 로 떨어지지 않는다."],
      [14, 10, 6, "FR", "fast recovery 동안 duplicate ACK 가 올 때마다 cwnd + 1: 9 → 10."],
      [15, 12, 6, "FR", "그래프에서는 RTT 15 에 12 까지 올라간다."],
      [15, 6, 6, "CA", "'''new ACK''' 가 왔다(빠진 segment 가 복구됨) → cwnd = ssthresh = '''6''' → congestion avoidance."],
      [16, 7, 6, "CA", "CA: RTT 마다 +1."],
      [20, 11, 6, "CA", "7, 8, 9, 10, 11 …"]
    ]
  };
  function svgOf(rows, k) {
    return function () {
      var W = 620, H = 230, x0 = 40, y0 = 200, sx = 27, sy = 11;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">';
      for (var g = 0; g <= 16; g += 2) {
        s += '<line x1="' + x0 + '" y1="' + (y0 - g * sy) + '" x2="' + (x0 + 20 * sx) + '" y2="' + (y0 - g * sy) + '" stroke="#eee"/>';
        s += '<text x="' + (x0 - 6) + '" y="' + (y0 - g * sy + 4) + '" text-anchor="end" fill="#777">' + g + '</text>';
      }
      for (var r = 0; r <= 20; r++) s += '<text x="' + (x0 + r * sx) + '" y="' + (y0 + 14) + '" text-anchor="middle" fill="#777">' + r + '</text>';
      s += '<text x="' + (x0 + 20 * sx) + '" y="' + (y0 + 26) + '" text-anchor="end" fill="#777">RTT</text><text x="6" y="12" fill="#777">cwnd (MSS)</text>';
      var pts = rows.slice(0, k + 1).map(function (q) { return (x0 + q[0] * sx) + "," + (y0 - q[1] * sy); });
      s += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="#1d65b3" stroke-width="2.5"/>';
      rows.slice(0, k + 1).forEach(function (q, i) {
        s += '<circle cx="' + (x0 + q[0] * sx) + '" cy="' + (y0 - q[1] * sy) + '" r="' + (i === k ? 5 : 3) + '" fill="' + (i === k ? "#d6465f" : "#222") + '"/>';
      });
      var th = rows[k][2];
      s += '<line x1="' + x0 + '" y1="' + (y0 - th * sy) + '" x2="' + (x0 + 20 * sx) + '" y2="' + (y0 - th * sy) + '" stroke="#222" stroke-dasharray="4 3"/>';
      s += '<text x="' + (x0 + 20 * sx) + '" y="' + (y0 - th * sy - 4) + '" text-anchor="end">ssthresh = ' + th + '</text>';
      return s + '</svg>';
    };
  }
  SIMS["cwnd_tahoe_reno"] = {
    title: "cwnd 따라가기 — Tahoe(p.83) vs Reno(p.85)",
    desc: "slow start(두 배) → ssthresh 에서 congestion avoidance(+1) → 사건(time-out / 3 duplicate ACKs)마다 ssthresh 와 cwnd 를 다시 정한다. [[cwnd]] · [[slow start]] · [[congestion avoidance]] · [[fast recovery]] · [[Tahoe와 Reno]]",
    options: [{ key: "c", label: "TCP", values: [{ value: "tahoe", label: "Tahoe (p.83)" }, { value: "reno", label: "Reno (p.85)" }] }],
    build: function (opts) {
      var rows = DATA[opts.c] || DATA.tahoe;
      var lineOf = { SS: 1, CA: 2, FR: 4 };
      return {
        panels: [{ id: "P", title: "규칙 (p.79–81)", lang: "txt", lines: [
          "1. SS: cwnd 1 에서 시작, RTT 마다 두 배",
          "2. CA: cwnd ≥ ssthresh 이면 RTT 마다 +1",
          "3. time-out: ssthresh = cwnd/2, cwnd = 1 → SS (둘 다)",
          "4. 3dupACKs: Tahoe = time-out 과 같음 / Reno = ssthresh = cwnd/2, cwnd = ssthresh + 3 → FR",
          "5. FR: dup ACK 마다 +1, new ACK → cwnd = ssthresh → CA"] }],
        vars: [{ name: "RTT", group: "상태" }, { name: "cwnd", group: "상태" }, { name: "ssthresh", group: "상태" }, { name: "phase", group: "상태" }],
        steps: rows.map(function (q, i) {
          var pcLine = /Tahoe 는 3dup|cwnd = ssthresh \+ 3/.test(q[4]) ? 4 : (/time-out/.test(q[4]) && /cwnd = '''1'''|cwnd = 1/.test(q[4]) ? 3 : (/new ACK/.test(q[4]) ? 5 : lineOf[q[3]]));
          return { desc: "RTT " + q[0] + ": " + q[4], pc: { P: pcLine }, vars: { RTT: q[0], cwnd: q[1], ssthresh: q[2], phase: { SS: "slow start", CA: "congestion avoidance", FR: "fast recovery" }[q[3]] }, svg: svgOf(rows, i) };
        })
      };
    }
  };
})();
