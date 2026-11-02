// datagram_vs_vc — L12 p.20–26: 같은 메시지(datagram 1–4)를 datagram 방식 / virtual-circuit 방식으로 보내기
window.SIMS = window.SIMS || {};
(function (global) {
  "use strict";

  // p.22 그림의 배치 (라우터 5개)
  var POS = {
    S: [40, 110], R1: [140, 60], R2: [400, 60], R4: [270, 125], R3: [140, 190], R5: [400, 190], D: [520, 190]
  };
  var EDGES = [["S", "R1"], ["R1", "R2"], ["R1", "R4"], ["R1", "R3"], ["R2", "R4"], ["R2", "R5"], ["R3", "R4"], ["R3", "R5"], ["R4", "R5"], ["R5", "D"]];
  var COLORS = { 1: "#777", 2: "#e09a40", 3: "#1d9bd6", 4: "#222" };

  // datagram: p.22 그림의 경로
  var DG_PATH = {
    1: ["S", "R1", "R4", "R5", "D"],
    2: ["S", "R1", "R2", "R5", "D"],
    3: ["S", "R1", "R3", "R4", "R5", "D"],
    4: ["S", "R1", "R3", "R5", "D"]
  };
  var VC_PATH = ["S", "R1", "R3", "R5", "D"];
  // VCI 는 링크마다 다르다 (Forouzan 보충 — 슬라이드는 "flow label: VCI" 까지만)
  var VCI = [14, 66, 22, 77];

  function same(a, b) { return (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0]); }
  function onPath(path, e) {
    for (var i = 0; i < path.length - 1; i++) if (same([path[i], path[i + 1]], e)) return true;
    return false;
  }

  // paths: [{path, color, w}] ; labels: 노드 옆 글자 ; arrival: 수신 쪽 표시
  function makeSvg(paths, arrival, extra) {
    return function () {
      var s = '<svg viewBox="0 0 600 250" width="600" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">';
      EDGES.forEach(function (e) {
        var a = POS[e[0]], b = POS[e[1]];
        s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="#ccc" stroke-width="2"/>';
      });
      paths.forEach(function (p, k) {
        EDGES.forEach(function (e) {
          if (!onPath(p.path, e)) return;
          var a = POS[e[0]], b = POS[e[1]];
          var off = (k - (paths.length - 1) / 2) * 3;
          s += '<line x1="' + (a[0] + off) + '" y1="' + (a[1] + off) + '" x2="' + (b[0] + off) + '" y2="' + (b[1] + off) + '" stroke="' + p.color + '" stroke-width="' + (p.w || 3) + '" stroke-opacity="0.85"/>';
        });
      });
      Object.keys(POS).forEach(function (k) {
        var p = POS[k];
        if (k === "S" || k === "D") {
          s += '<rect x="' + (p[0] - 30) + '" y="' + (p[1] - 14) + '" width="60" height="28" rx="4" fill="#dbe8f7" stroke="#1d65b3"/>';
          s += '<text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle" font-weight="700">' + (k === "S" ? "Sender A" : "Recv B") + '</text>';
        } else {
          s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="22" ry="12" fill="#efe9f6" stroke="#3b2f4a"/>';
          s += '<text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle" font-weight="700" font-size="11">' + k + '</text>';
        }
      });
      if (extra) s += extra;
      if (arrival) {
        s += '<text x="20" y="240" fill="#333">' + arrival + '</text>';
      }
      s += '</svg>';
      return s;
    };
  }
  function vciLabels(upto) {
    var out = "";
    for (var i = 0; i < upto; i++) {
      var a = POS[VC_PATH[i]], b = POS[VC_PATH[i + 1]];
      var x = (a[0] + b[0]) / 2 - 18, y = (a[1] + b[1]) / 2 - 6;
      out += '<rect x="' + x + '" y="' + (y - 11) + '" width="54" height="16" rx="3" fill="#fff3bf" stroke="#d6a017"/>';
      out += '<text x="' + (x + 27) + '" y="' + (y + 1) + '" text-anchor="middle" font-size="10" font-weight="700">VCI ' + VCI[i] + '</text>';
    }
    return out;
  }

  global.SIMS["datagram_vs_vc"] = {
    title: "Datagram vs. virtual circuit — 같은 메시지 1–4 를 두 방식으로 (L12 p.20–26)",
    desc: "[[datagram approach]]: 패킷마다 '''destination address''' 로 [[forwarding table]] 을 찾아 따로 간다 → 경로가 다르고 '''out of order'''. [[virtual-circuit approach]]: setup 으로 길을 먼저 정하고 패킷은 '''flow label(VCI)''' 로 같은 길을 '''in order''' 로 간 뒤 teardown. 라우터 배치는 p.22 그림.",
    options: [
      { key: "mode", label: "방식", values: [
        { value: "dg", label: "Datagram (connectionless)" },
        { value: "vc", label: "Virtual circuit (connection-oriented)" }
      ] }
    ],
    build: function (opts) {
      var mode = opts.mode || "dg";
      var steps = [], st, vars, lines;
      function push(desc, pc, svg, note) {
        steps.push({ desc: desc, pc: { P: pc }, vars: JSON.parse(JSON.stringify(st)), note: note, svg: svg });
      }
      if (mode === "dg") {
        lines = [
          "메시지를 datagram 1–4 로 나눈다 (헤더: SA = A, DA = B)",
          "라우터: DA 로 forwarding table 조회 → output interface",
          "다음 datagram 도 처음부터 다시 조회 (서로 무관)",
          "경로가 패킷마다 다를 수 있다",
          "도착 순서가 뒤섞일 수 있다 (out of order)"
        ];
        vars = [
          { name: "setup", label: "setup 단계", group: "방식" },
          { name: "key", label: "router 가 보는 값", group: "방식" },
          { name: "p1", label: "datagram 1 경로", group: "경로" },
          { name: "p2", label: "datagram 2 경로", group: "경로" },
          { name: "p3", label: "datagram 3 경로", group: "경로" },
          { name: "p4", label: "datagram 4 경로", group: "경로" },
          { name: "arr", label: "수신 순서", group: "결과" }
        ];
        st = { setup: "없음 (no setup)", key: "destination address (DA = B)", p1: "-", p2: "-", p3: "-", p4: "-", arr: "-" };
        push("Sender A 의 network layer 가 메시지를 '''datagram 1, 2, 3, 4''' 로 나눈다. 넷 다 헤더에 SA = A, '''DA = B''' 가 있다. 미리 길을 잡는 setup 은 '''없다'''(connectionless).", 1, makeSvg([], "보낸 순서: 1 2 3 4"));
        var all = [];
        [1, 2, 3, 4].forEach(function (k) {
          st["p" + k] = DG_PATH[k].slice(1, -1).join(" → ");
          all.push({ path: DG_PATH[k], color: COLORS[k] });
          push("datagram " + k + ": 지나는 라우터마다 '''DA = B''' 를 [[forwarding table]] 에서 찾아 output interface 로 내보낸다 → 경로 '''" + st["p" + k] + "'''." +
            (k === 1 ? " 이 결정은 이 패킷 하나에 대한 것이다." : " 앞 datagram 과 '''아무 관계 없이''' 다시 조회한다."),
            k === 1 ? 2 : (k === 2 ? 3 : 4), makeSvg(all.slice(), null),
            k === 2 ? "같은 DA 인데 경로가 다르다: 표가 갱신되거나(혼잡·장애) 라우터가 부하를 나누면 다음 패킷은 다른 길로 간다 (Forouzan 보충 — 슬라이드는 \"may take different paths\")." : undefined);
        });
        st.arr = "1 3 4 2 (그림 p.22) ≠ 1 2 3 4";
        push("경로마다 길이·혼잡이 달라 '''도착 순서가 뒤섞인다''' — 그림의 수신 쪽 \"1 3 4 2 — Out of order\". 순서를 다시 맞추는 일은 IP 가 아니라 상위 계층(TCP)의 몫이다 (보충).", 5, makeSvg(all, "수신 쪽: 1 3 4 2 — Out of order (보낸 순서 1 2 3 4)"),
          "IP 는 datagram 방식이다 (p.26 \"The Internet's network layer (IP) uses the datagram approach\").");
      } else {
        lines = [
          "① setup: 경로를 먼저 정한다 (각 라우터에 VCI 항목 기록)",
          "② data transfer: 패킷마다 flow label = VCI",
          "   라우터: (in port, VCI) 로 표 조회 → (out port, 새 VCI)",
          "   모든 패킷이 같은 경로 → in order",
          "③ teardown: 경로(표 항목)를 지운다"
        ];
        vars = [
          { name: "phase", label: "단계", group: "방식" },
          { name: "key", label: "router 가 보는 값", group: "방식" },
          { name: "path", label: "virtual circuit 경로", group: "경로" },
          { name: "r1", label: "R1 표 (in VCI → out VCI)", group: "VCI 표 (보충)" },
          { name: "r3", label: "R3 표", group: "VCI 표 (보충)" },
          { name: "r5", label: "R5 표", group: "VCI 표 (보충)" },
          { name: "arr", label: "수신 순서", group: "결과" }
        ];
        st = { phase: "준비", key: "label (VCI)", path: "-", r1: "-", r3: "-", r5: "-", arr: "-" };
        push("같은 메시지(1–4)를 이번엔 '''virtual-circuit approach''' 로 보낸다. 패킷들은 서로 '''related''' 이고 모두 '''one path''' 를 따른다 — 그 길을 먼저 만들어야 한다.", null, makeSvg([], "보낸 순서: 1 2 3 4"));
        st.phase = "① setup"; st.path = "R1 → R3 → R5";
        st.r1 = VCI[0] + " → " + VCI[1]; st.r3 = VCI[1] + " → " + VCI[2]; st.r5 = VCI[2] + " → " + VCI[3];
        push("'''setup (define the path)''': 요청이 R1 → R3 → R5 를 지나며 각 라우터가 표에 \"(들어오는 VCI) → (나가는 port, 나가는 VCI)\" 항목을 적는다. 이제 이 길이 '''virtual circuit''' 이다 — 실제 전선을 잇는 건 아니지만 회선처럼 쓴다.", 1, makeSvg([{ path: VC_PATH, color: "#1d9bd6", w: 6 }], null, vciLabels(4)),
          "VCI 값(14 → 66 → 22 → 77)이 링크마다 바뀌는 것은 Forouzan 보충이다. 슬라이드는 \"Each packet carries a flow label: the virtual-circuit identifier (VCI)\" 까지만. p.25 그림에서는 같은 길이 R1 → R3 → R4 로 그려져 있다(라우터 이름만 다름).");
        st.phase = "② data transfer";
        push("datagram 1 이 '''VCI 14''' 를 달고 R1 에 도착 → R1 은 '''destination address 가 아니라 VCI''' 로 표를 찾아 R3 쪽으로, 라벨을 66 으로 바꿔 내보낸다. R3: 66 → 22, R5: 22 → 77. 교수: \"virtual circuit approach uses a '''flow label''' … datagram approach uses '''destination address''' — these are the key differences\" (39:05).", 2, makeSvg([{ path: VC_PATH, color: "#1d9bd6", w: 6 }], null, vciLabels(4)));
        push("datagram 2, 3, 4 도 '''같은 VCI 로 같은 길'''을 간다. 앞지를 길이 없으니 순서가 유지된다.", 4, makeSvg([{ path: VC_PATH, color: "#1d9bd6", w: 6 }], "1 2 3 4 가 줄지어 R1 → R3 → R5", vciLabels(4)));
        st.arr = "1 2 3 4 (in order)";
        push("수신 쪽 도착 순서 = '''1 2 3 4''' — \"in virtual circuit it ensures same order\"(41:22).", 4, makeSvg([{ path: VC_PATH, color: "#1d9bd6", w: 6 }], "수신 쪽: 1 2 3 4 — In order"));
        st.phase = "③ teardown"; st.r1 = "(삭제)"; st.r3 = "(삭제)"; st.r5 = "(삭제)"; st.path = "-";
        push("'''teardown''': 전송이 끝나면 각 라우터의 VCI 항목을 지워 virtual circuit 을 없앤다.", 5, makeSvg([], "teardown 완료 — 다음 메시지는 다시 setup 부터"),
          "비교: IP(인터넷)는 이 방식이 아니라 datagram 방식을 쓴다 (p.26).");
      }
      return {
        panels: [{ id: "P", title: mode === "dg" ? "Datagram 절차" : "Virtual-circuit 절차", lang: "txt", lines: lines }],
        vars: vars,
        steps: steps
      };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
