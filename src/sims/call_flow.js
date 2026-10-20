window.SIMS = window.SIMS || {};
// call_flow — L10 p.12 Transmitting(making a call) ①–⑦ / p.13 Receiving ①–⑦
(function (global) {
  "use strict";

  var C = { on: "#d6465f", done: "#555", todo: "#d5d8dc", voice: "#2e8b57", cell: "#fdf1c4", cellLine: "#c9a227",
    msc: "#d9e8f8", mscLine: "#3b78c2", co: "#fbe0cc", coLine: "#d98a4e", found: "#ffe08a" };

  function hex(cx, cy, r, fill, stroke, sw) {
    var p = [];
    for (var k = 0; k < 6; k++) {
      var a = Math.PI / 3 * k;
      p.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1));
    }
    return '<polygon points="' + p.join(" ") + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (sw || 1.5) + '"/>';
  }
  function tower(x, y) { // 기지국 안테나 (삼각형)
    return '<path d="M' + x + "," + (y - 16) + " L" + (x - 8) + "," + (y + 12) + " L" + (x + 8) + "," + (y + 12) + ' Z" fill="#fff" stroke="#222" stroke-width="1.5"/>' +
      '<line x1="' + (x - 5) + '" y1="' + (y + 2) + '" x2="' + (x + 5) + '" y2="' + (y + 2) + '" stroke="#222"/>';
  }
  function phone(x, y) {
    return '<rect x="' + (x - 7) + '" y="' + (y - 13) + '" width="14" height="26" rx="3" fill="#fff" stroke="#222" stroke-width="1.5"/>' +
      '<line x1="' + (x - 3) + '" y1="' + (y - 8) + '" x2="' + (x + 3) + '" y2="' + (y - 8) + '" stroke="#222"/>';
  }
  function box(x, y, w, h, fill, stroke, label) {
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>';
    var lines = label.split("\n");
    lines.forEach(function (t, i) {
      s += '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5 + (i - (lines.length - 1) / 2) * 15) + '" text-anchor="middle" font-weight="700" font-size="13">' + t + "</text>";
    });
    return s;
  }
  // a: {x1,y1,x2,y2,n,dash,lx,ly}; state: "on"|"done"|"todo"
  function arrow(a, state) {
    var col = C[state], w = state === "on" ? 3 : 1.5, mk = "cf_m_" + state;
    var s = '<line x1="' + a.x1 + '" y1="' + a.y1 + '" x2="' + a.x2 + '" y2="' + a.y2 + '" stroke="' + col + '" stroke-width="' + w + '"' +
      (a.dash ? ' stroke-dasharray="5,4"' : "") + ' marker-end="url(#' + mk + ')"/>';
    if (a.n) s += '<text x="' + a.lx + '" y="' + a.ly + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + (state === "todo" ? "#aaa" : col) + '">' + a.n + "</text>";
    return s;
  }
  function defs() {
    var s = "<defs>";
    ["on", "done", "todo"].forEach(function (k) {
      s += '<marker id="cf_m_' + k + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
        '<path d="M0,0 L10,5 L0,10 z" fill="' + C[k] + '"/></marker>';
    });
    return s + "</defs>";
  }
  function stateOf(stepNo, idxs) { // idxs: 이 화살표가 쓰이는 단계 번호들
    if (idxs.indexOf(stepNo) >= 0) return "on";
    for (var i = 0; i < idxs.length; i++) if (idxs[i] < stepNo) return "done";
    return "todo";
  }
  var NUM = ["", "①", "②", "③", "④", "⑤", "⑥", "⑦"];

  function svgTransmit(stepNo, title) {
    var W = 640, H = 270;
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">' + defs();
    s += '<rect width="' + W + '" height="' + H + '" rx="8" fill="#fff"/>';
    s += '<text x="' + (W / 2) + '" y="20" text-anchor="middle" font-weight="700" fill="#1d65b3">' + title + "</text>";
    s += hex(110, 125, 82, C.cell, C.cellLine);
    s += '<text x="60" y="68" fill="#a08020" font-size="12">Cell</text>';
    s += tower(150, 95) + '<text x="164" y="88" font-weight="700">BS</text>';
    s += phone(82, 160) + '<text x="70" y="192" font-weight="700">MS</text>';
    s += box(250, 100, 100, 46, C.msc, C.mscLine, "MSC");
    s += box(410, 96, 120, 54, C.co, C.coLine, "Telephone\ncentral office");
    s += phone(600, 123) + '<text x="600" y="154" text-anchor="middle" font-size="11">Called party</text>';
    var A = [
      null,
      { x1: 90, y1: 148, x2: 140, y2: 105, n: "①", lx: 104, ly: 118 },
      { x1: 168, y1: 106, x2: 248, y2: 112, n: "②", lx: 208, ly: 100 },
      { x1: 350, y1: 112, x2: 408, y2: 112, n: "③", lx: 380, ly: 104 },
      { x1: 530, y1: 118, x2: 588, y2: 118, n: "④", lx: 558, ly: 110 },
      { x1: 408, y1: 136, x2: 352, y2: 136, n: "⑤", dash: true, lx: 380, ly: 154 },
      { x1: 250, y1: 140, x2: 94, y2: 162, n: "⑥", lx: 175, ly: 166 }
    ];
    for (var k = 1; k <= 6; k++) s += arrow(A[k], stateOf(stepNo, [k]));
    var vs = stepNo >= 7 ? (stepNo === 7 ? "on" : "done") : "todo";
    var vcol = vs === "todo" ? C.todo : C.voice;
    s += '<path d="M82,174 V235 H600 V136" fill="none" stroke="' + vcol + '" stroke-width="' + (vs === "on" ? 4 : 2) + '"' + (vs === "todo" ? ' stroke-dasharray="5,4"' : "") + "/>";
    s += '<text x="340" y="254" text-anchor="middle" font-weight="700" fill="' + (vs === "todo" ? "#aaa" : C.voice) + '">⑦ Voice channel</text>';
    return s + "</svg>";
  }

  function svgReceive(stepNo, title) {
    var W = 640, H = 290, cy = [72, 132, 192];
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">' + defs();
    s += '<rect width="' + W + '" height="' + H + '" rx="8" fill="#fff"/>';
    s += '<text x="' + (W / 2) + '" y="20" text-anchor="middle" font-weight="700" fill="#1d65b3">' + title + "</text>";
    cy.forEach(function (y, i) {
      var found = stepNo >= 3 && i === 1;
      s += hex(120, y, 34.6, found ? C.found : C.cell, found ? "#d6465f" : C.cellLine, found ? 2.5 : 1.5);
      s += tower(130, y);
      s += '<text x="94" y="' + (y - 10) + '" font-size="11" font-weight="700">BS' + (i + 1) + "</text>";
    });
    s += phone(64, 132) + '<text x="40" y="136" font-weight="700" text-anchor="end">MS</text>';
    if (stepNo >= 3) s += '<text x="120" y="244" text-anchor="middle" font-size="11" fill="#d6465f">위치 확인: BS2 cell</text>';
    s += box(260, 108, 100, 46, C.msc, C.mscLine, "MSC");
    s += box(420, 104, 120, 54, C.co, C.coLine, "Telephone\ncentral office");
    s += phone(600, 131) + '<text x="600" y="100" text-anchor="middle" font-size="11">Caller</text>';
    // ① CO → MSC (caller 측 연결선 포함)
    s += '<line x1="590" y1="131" x2="542" y2="131" stroke="#555" stroke-width="1.5" marker-end="url(#cf_m_done)"/>';
    s += arrow({ x1: 420, y1: 131, x2: 362, y2: 131, n: "①", lx: 391, ly: 123 }, stateOf(stepNo, [1]));
    // ② paging: MSC → 모든 BS (점선)
    var pst = stateOf(stepNo, [2]);
    cy.forEach(function (y, i) {
      s += arrow({ x1: 260, y1: 120 + i * 5, x2: 146, y2: y + (i === 1 ? -6 : 0), dash: true }, pst);
    });
    s += '<text x="215" y="66" text-anchor="middle" font-weight="700" fill="' + (pst === "todo" ? "#aaa" : C[pst]) + '">② Paging</text>';
    // ③⑤ MS → MSC, ④⑥ MSC → MS
    s += arrow({ x1: 74, y1: 124, x2: 258, y2: 124, n: "③⑤", lx: 200, ly: 117 }, stateOf(stepNo, [3, 5]));
    s += arrow({ x1: 258, y1: 146, x2: 74, y2: 146, n: "④⑥", lx: 200, ly: 162 }, stateOf(stepNo, [4, 6]));
    var vs = stepNo >= 7 ? (stepNo === 7 ? "on" : "done") : "todo";
    var vcol = vs === "todo" ? C.todo : C.voice;
    s += '<path d="M64,146 V262 H600 V144" fill="none" stroke="' + vcol + '" stroke-width="' + (vs === "on" ? 4 : 2) + '"' + (vs === "todo" ? ' stroke-dasharray="5,4"' : "") + "/>";
    s += '<text x="340" y="280" text-anchor="middle" font-weight="700" fill="' + (vs === "todo" ? "#aaa" : C.voice) + '">⑦ Voice channel</text>';
    return s + "</svg>";
  }

  var TX = {
    lines: [
      "① MS scans the band and sends the number on the strongest setup channel — MS 가 대역을 스캔해 가장 강한 setup channel 로 상대 번호 전송",
      "② BS relays the number to the MSC — BS 가 번호를 MSC 로 중계",
      "③ MSC forwards it to the telephone central office — MSC 가 전화국(central office)으로 전달",
      "④ Central office connects the called party (if available) — 전화국이 수신자에게 연결(가능하면)",
      "⑤ Result is relayed back to the MSC — 연결 결과를 MSC 로 회신",
      "⑥ MSC assigns an unused voice channel; MS retunes — MSC 가 빈 voice channel 할당, MS 가 그 채널로 재동조",
      "⑦ Communication begins — 통화 시작"
    ],
    steps: [
      { at: "MS", to: "-", vc: "없음", st: "대기 (idle)",
        d: "p.12 Transmitting (making a call). 사용자가 번호를 누르기 직전. 통화하려면 단말 하나로는 안 되고 [[base station|BS]] · [[MSC]] · telephone central office 같은 infrastructure 가 필요하다." },
      { at: "MS → BS", to: "BS", vc: "없음 (setup channel 사용 중)", st: "번호 전송",
        d: "① [[mobile station|MS]] 가 band 를 '''scan''' 해서 신호가 '''가장 강한 setup channel''' 을 고르고(= 보통 가장 가까운 BS), 그 채널로 상대 번호를 보낸다. 아직 '''voice channel 은 없다''' — 번호 같은 제어 정보는 setup(control) channel 로 간다." },
      { at: "BS → MSC", to: "MSC", vc: "없음", st: "중계",
        d: "② BS 는 판단하지 않고 번호를 [[MSC]] 로 '''relay''' 만 한다. MSC 는 모든 BS 와 central office 사이를 조율하는 교환기(p.10)." },
      { at: "MSC → central office", to: "central office", vc: "없음", st: "유선망으로 전달",
        d: "③ MSC 가 번호를 telephone central office 로 '''forward''' 한다. 여기서부터는 기존 유선 전화망([[PSTN]]) 의 영역." },
      { at: "central office → called party", to: "called party", vc: "없음", st: "수신자 연결 시도",
        d: "④ central office 가 상대(called party)에게 연결한다 — '''if available''': 상대가 통화 중이거나 꺼져 있으면 연결되지 않는다." },
      { at: "central office ⇢ MSC", to: "MSC", vc: "없음", st: "결과 회신",
        d: "⑤ 연결 결과(되었는지)가 MSC 로 '''relay back''' 된다 (그림의 점선 화살표)." },
      { at: "MSC → MS", to: "MS", vc: "할당됨 (unused voice channel)", st: "MS retune",
        d: "⑥ 이제야 MSC 가 '''사용 중이 아닌 voice channel''' 을 하나 '''assign''' 하고, MS 는 setup channel 에서 그 voice channel 로 '''retune''' 한다. '''voice channel 할당은 ⑥ 단계''' — 시험 포인트." },
      { at: "MS ⇄ called party", to: "-", vc: "사용 중", st: "통화 중",
        d: "⑦ '''Communication begins''' — 할당된 voice channel(초록선)로 MS 와 상대가 통화한다." }
    ],
    note: "voice channel 이 '언제' 생기는지(⑥, MSC 가 할당)와 그 전까지는 setup channel 로 제어 정보만 오간다는 점을 구분할 것."
  };

  var RX = {
    lines: [
      "① Central office sends the called number to the MSC — 전화국이 수신 번호를 MSC 로 보냄",
      "② MSC sends query signals to every cell (paging) — MSC 가 모든 cell 에 query 신호 (paging)",
      "③ MS responds; its location is found — MS 가 응답 → 위치(어느 cell) 확인",
      "④ MSC transmits a ringing signal — MSC 가 벨(ringing) 신호 전송",
      "⑤ MS answers — MS 가 받음",
      "⑥ MSC assigns a voice channel — MSC 가 voice channel 할당",
      "⑦ Communication begins — 통화 시작"
    ],
    steps: [
      { at: "caller", to: "-", vc: "없음", st: "대기", loc: "모름",
        d: "p.13 Receiving. 유선/다른 망의 caller 가 이 MS 의 번호로 전화를 건다. 이 시점에 망은 MS 가 '''어느 cell 에 있는지 모른다'''." },
      { at: "central office → MSC", to: "MSC", vc: "없음", st: "수신 번호 전달", loc: "모름",
        d: "① telephone central office 가 called number 를 [[MSC]] 로 보낸다. 발신 과정(p.12)과 '''방향이 반대'''로 시작한다." },
      { at: "MSC → 모든 cell (BS1·BS2·BS3)", to: "every cell", vc: "없음", st: "paging", loc: "모름 (찾는 중)",
        d: "② MSC 는 MS 의 위치를 모르므로 '''모든 cell 에 query signal''' 을 뿌린다 — 이것이 [[paging]] (그림의 빨간 점선 3갈래). 이름 그대로 '호출 방송'처럼 \"○○번 계세요?\" 하고 전부에게 묻는 것." },
      { at: "MS → MSC", to: "MSC", vc: "없음", st: "MS 응답", loc: "BS2 cell (확인)",
        d: "③ 자기 번호를 들은 MS 가 '''응답'''하고, 응답이 들어온 cell 로 MS 의 '''location 이 확인'''된다. 이후 메시지는 그 cell 로만 간다." },
      { at: "MSC → MS", to: "MS", vc: "없음", st: "ringing", loc: "BS2 cell",
        d: "④ MSC 가 '''ringing signal''' 을 보낸다 → 전화기가 울린다." },
      { at: "MS → MSC", to: "MSC", vc: "없음", st: "MS answers", loc: "BS2 cell",
        d: "⑤ 사용자가 받는다 (MS answers)." },
      { at: "MSC → MS", to: "MS", vc: "할당됨", st: "voice channel 할당", loc: "BS2 cell",
        d: "⑥ MSC 가 '''voice channel 을 assign''' 한다 — 발신(p.12 ⑥)과 같은 위치의 단계. ③⑤ 와 ④⑥ 은 그림에서 같은 화살표 쌍을 쓴다." },
      { at: "caller ⇄ MS", to: "-", vc: "사용 중", st: "통화 중", loc: "BS2 cell",
        d: "⑦ '''Communication begins''' — voice channel(초록선)로 통화." }
    ],
    note: "발신은 MS 위치를 망이 처음부터 안다(MS 가 먼저 보냄). 수신은 모르니까 ② paging → ③ 응답으로 위치를 찾는 단계가 추가된다. '어느 cell 에 MS 가 있는지'는 그림 설명용(BS2)."
  };

  global.SIMS["call_flow"] = {
    title: "통화 발신·수신 과정 — MS · BS · MSC · central office",
    desc: "p.12 Transmitting ①–⑦ 과 p.13 Receiving ①–⑦ 을 슬라이드 문장 그대로 한 단계씩. 빨간 화살표가 지금 단계의 메시지, 초록선이 ⑦ voice channel.",
    options: [{ key: "mode", label: "과정", values: [
      { value: "transmit", label: "발신 (Transmitting, p.12)" },
      { value: "receive", label: "수신 (Receiving, p.13)" }] }],
    build: function (opts) {
      var rx = opts.mode === "receive", D = rx ? RX : TX;
      var title = rx ? "Receiving (p.13)" : "Transmitting — making a call (p.12)";
      var vars = [
        { name: "단계", group: "진행" },
        { name: "메시지 위치", group: "진행" },
        { name: "도착지", group: "진행" },
        { name: "voice channel", group: "상태" },
        { name: "상태", group: "상태" }
      ];
      if (rx) vars.push({ name: "MS 위치", group: "상태" });
      var steps = D.steps.map(function (s, i) {
        var v = { "단계": i === 0 ? "시작 전" : NUM[i], "메시지 위치": s.at, "도착지": s.to, "voice channel": s.vc, "상태": s.st };
        if (rx) v["MS 위치"] = s.loc;
        var step = {
          desc: s.d,
          pc: { P: i === 0 ? null : i },
          vars: v,
          status: { P: i === 7 ? "done" : (i === 0 ? "ready" : "running") },
          svg: rx ? svgReceive(i, title) : svgTransmit(i, title)
        };
        if (i === 7) step.note = D.note;
        return step;
      });
      return {
        panels: [{ id: "P", title: rx ? "Receiving ①–⑦ (p.13)" : "Transmitting ①–⑦ (p.12)", lang: "txt", lines: D.lines }],
        vars: vars,
        steps: steps
      };
    }
  };
})(window);
