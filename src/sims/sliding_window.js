// sliding_window — L16 p.22–26: sequence number m = 4 (0–15), window 크기 7
//   slide : p.24–26 a. 4 개 보냄 → b. 5 개 → c. 7 개(window full) → d. ACK 0 → window 한 칸 이동 (+ 이어서 7 보냄)
//   wrap  : 예시(슬라이드 밖) first outstanding 12 에서 7 개 → 12 13 14 15 0 1 2 (wrap around), ACK 12·13 → 14..4
window.SIMS = window.SIMS || {};
(function () {
  "use strict";
  var M = 16, WIN = 7;
  function svgOf(sf, sn, note) {
    return function () {
      var s = '<svg viewBox="0 0 640 150" width="640" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">';
      var x0 = 20, cw = 36;
      // 보여 줄 칸: sf 기준 앞 3 칸부터 16 칸 (원형을 펼친 linear form)
      var start = (sf - 3 + M) % M;
      for (var k = 0; k < 16; k++) {
        var n = (start + k) % M;
        var off = (n - sf + M) % M;          // window 시작에서 몇 칸 뒤인가
        var inWin = off < WIN;
        var sent = off < ((sn - sf + M) % M);
        var fill = sent ? "#9cc7ee" : (inWin ? "#fff" : "#f3f3f3");
        s += '<rect x="' + (x0 + k * cw) + '" y="40" width="' + (cw - 2) + '" height="34" fill="' + fill + '" stroke="#888"/>';
        s += '<text x="' + (x0 + k * cw + 17) + '" y="62" text-anchor="middle" fill="' + (inWin ? "#222" : "#aaa") + '">' + n + '</text>';
      }
      var wx = x0 + 3 * cw - 2;
      s += '<rect x="' + wx + '" y="34" width="' + (WIN * cw + 2) + '" height="46" fill="none" stroke="#222" stroke-width="3"/>';
      s += '<text x="' + (wx + 2) + '" y="100" fill="#d6465f" font-size="12">↑ Sf = ' + sf + ' (first outstanding)</text>';
      var snOff = (sn - sf + M) % M;
      s += '<text x="' + (wx + snOff * cw + 4) + '" y="122" fill="#1d65b3" font-size="12">↑ Sn = ' + sn + ' (next to send)</text>';
      s += '<text x="20" y="22" fill="#777" font-size="11">파랑 = 보냈지만 ACK 없음(outstanding), 흰 칸 = window 안에서 아직 안 보냄, 회색 = window 밖</text>';
      if (note) s += '<text x="20" y="144" fill="#d6465f" font-size="12">' + note + '</text>';
      return s + '</svg>';
    };
  }
  SIMS["sliding_window"] = {
    title: "Sliding window — m = 4, window 7",
    desc: "보낸 packet 은 ACK 가 올 때까지 window 안에 남는다. ACK 가 오면 window 가 미끄러진다. sequence number 는 0–15 를 돌아서 다시 0 (modulo 2^m). [[sliding window]] · [[sequence number]]",
    options: [{ key: "c", label: "장면", values: [
      { value: "slide", label: "p.24–26 슬라이드 a → d" },
      { value: "wrap", label: "예시: 15 를 넘어 0 으로 (wrap around)" }] }],
    build: function (opts) {
      var c = opts.c || "slide";
      var vars = [{ name: "Sf (first outstanding)", group: "window" }, { name: "Sn (next to send)", group: "window" }, { name: "outstanding 개수", group: "window" }, { name: "더 보낼 수 있는 개수", group: "window" }];
      function V(sf, sn) { var o = (sn - sf + M) % M; return { "Sf (first outstanding)": sf, "Sn (next to send)": sn, "outstanding 개수": o, "더 보낼 수 있는 개수": WIN - o }; }
      var steps;
      if (c === "slide") {
        steps = [
          { desc: "시작. 아직 아무것도 보내지 않았다. window 는 0–6 의 7 칸이다.", pc: { P: 1 }, vars: V(0, 0), svg: svgOf(0, 0) },
          { desc: "a. 0, 1, 2, 3 을 보냈다(p.24 a. Four packets have been sent). ACK 를 하나도 못 받았지만 window 안이라 계속 보낼 수 있다.", pc: { P: 2 }, vars: V(0, 4), svg: svgOf(0, 4) },
          { desc: "b. 4 도 보냈다(Five packets have been sent). 아직 ACK 없음.", pc: { P: 2 }, vars: V(0, 5), svg: svgOf(0, 5) },
          { desc: "c. 5, 6 까지 7 개를 보냈다. '''window is full'''. 이제 ACK 가 올 때까지 더 보내지 못하고 기다린다.", pc: { P: 3 }, vars: V(0, 7), svg: svgOf(0, 7, "window full → 대기") },
          { desc: "d. '''Packet 0 has been acknowledged; window slides.''' 0 이 빠지고 window 가 1–7 로 한 칸 이동한다. 7 을 보낼 자리가 생겼다.", pc: { P: 4 }, vars: V(1, 7), svg: svgOf(1, 7) },
          { desc: "(이어서) 7 을 보내면 다시 full 이다. window 는 ACK 가 올 때마다 오른쪽으로 미끄러진다.", pc: { P: 2 }, vars: V(1, 8), svg: svgOf(1, 8, "window full → 대기") }
        ];
      } else {
        steps = [
          { desc: "예시: 0–11 은 이미 ACK 받았고 Sf = Sn = 12 다.", pc: { P: 1 }, vars: V(12, 12), svg: svgOf(12, 12) },
          { desc: "12, 13, 14, 15 를 보냈다. m = 4 라서 15 다음 번호는 16 이 아니라 '''0''' 이다.", pc: { P: 2 }, vars: V(12, 0), svg: svgOf(12, 0) },
          { desc: "0, 1, 2 까지 보내 7 개. window full. 번호가 15 → 0 으로 돌아갔다(wrap around, modulo 16).", pc: { P: 3 }, vars: V(12, 3), svg: svgOf(12, 3, "window full → 대기") },
          { desc: "12 와 13 의 ACK 가 왔다. window 가 두 칸 미끄러져 14 – 4 가 된다. 3, 4 를 보낼 수 있다.", pc: { P: 4 }, vars: V(14, 3), svg: svgOf(14, 3) },
          { desc: "같은 번호(예: 0)가 다시 쓰이니 window 크기가 2^m 보다 작아야 receiver 가 새 0 과 옛 0 을 헷갈리지 않는다(슬라이드 밖 보충).", pc: { P: 5 }, vars: V(14, 3), svg: svgOf(14, 3) }
        ];
      }
      return {
        panels: [{ id: "P", title: "규칙", lang: "txt", lines: [
          "1. window = 보내도 되는 sequence number 범위",
          "2. window 안이면 ACK 없이 계속 보낸다 (Sn 증가)",
          "3. Sn 이 window 끝에 닿으면 full → 대기",
          "4. ACK 오면 Sf 증가 → window slide",
          "5. 번호는 0 … 2^m − 1 을 돈다 (modulo 2^m)"] }],
        vars: vars, steps: steps
      };
    }
  };
})();
