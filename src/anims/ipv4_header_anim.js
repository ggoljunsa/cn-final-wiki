// ============================================================
// ipv4_header_anim — L13 p.31–38 IPv4 datagram format
//   32-bit 행 다섯 개 + options 가 한 행씩 채워지고, 마지막에 HLEN × 4 = header, total length = header + data
// ============================================================
window.ANIMS = window.ANIMS || {};
ANIMS["ipv4_header_anim"] = {
  title: "IPv4 header — 32-bit 행이 한 줄씩 채워지는 13초",
  desc: "[[IPv4 datagram format]] 의 header 를 '''4-byte(32-bit) 행''' 단위로 쌓는다. 1 행 VER·[[HLEN]]·[[service type]]·[[total length]] → 2 행 [[identification field|identification]]·[[flags D와 M|flags]]·[[fragmentation offset|offset]] → 3 행 [[TTL]]·[[protocol field|protocol]]·[[header checksum]] → 4–5 행 주소 → options.",
  duration: 13,
  build: function () {
    var D = 13;
    var C = { a: "#1d65b3", aL: "#dbe8f7", g: "#2e9e4f", gL: "#dff3e4", o: "#e09a40", oL: "#fdeec2", r: "#3b2f4a", rL: "#efe9f6", red: "#d6465f", muted: "#777", ink: "#222", y: "#d6a017", yL: "#fff3bf" };
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function txt(x, y, s, size, fill, extra) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '"' + (/text-anchor/.test(extra || "") ? "" : ' text-anchor="middle"') + (extra || "") + '>' + s + '</text>';
    }
    function show(from, to) {
      var f = 0.15 / D, a = r4(from / D), b = r4(Math.min(from / D + f, (from + to) / 2 / D));
      if (to >= D) return '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + a + ';' + b + ';1" dur="' + D + 's" fill="freeze"/>';
      var c = r4(Math.max(b, to / D - f)), d = r4(to / D);
      return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + a + ';' + b + ';' + c + ';' + d + ';1" dur="' + D + 's" fill="freeze"/>';
    }
    function vis(from, to, inner) { return '<g opacity="0">' + inner + show(from, to) + '</g>'; }

    var s = '<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IPv4 header 형식 애니메이션">';

    // ---- 자막 ----
    [
      [0, 1.5, "IPv4 header 는 32-bit(4-byte) 행으로 그린다 — header 20–60 bytes"],
      [1.5, 3.5, "1 행: VER(= 4) · HLEN(header 길이 ÷ 4) · service type · total length"],
      [3.5, 5.5, "2 행: fragmentation 용 — identification · flags(D, M) · offset(8-byte 단위)"],
      [5.5, 7.5, "3 행: TTL(라우터마다 −1) · protocol(상위 프로토콜) · header checksum(header 만)"],
      [7.5, 9, "4–5 행: source / destination IP address — 끝까지 바뀌지 않는다"],
      [9, 10.5, "options + padding 0–40 bytes → header 는 20–60 bytes"],
      [10.5, D, "header 뒤에 payload — total length = HLEN × 4 + data"]
    ].forEach(function (c) { s += vis(c[0], c[1], txt(380, 24, c[2], 14, C.ink, ' font-weight="700"')); });

    // ---- 비트 눈금 (x0 = 40, 32 bits × 14 px = 448) ----
    var x0 = 40, bw = 14, y0 = 62, rh = 34;
    function X(bit) { return x0 + bit * bw; }
    [0, 4, 8, 16, 31].forEach(function (b) { s += txt(X(b) + (b === 31 ? bw / 2 : 0), 52, String(b), 11, C.red, ' font-weight="700"'); });

    // 빈 틀
    for (var i = 0; i < 5; i++) s += '<rect x="' + x0 + '" y="' + (y0 + i * rh) + '" width="' + (32 * bw) + '" height="' + (rh - 2) + '" fill="#fafafa" stroke="#ccc"/>';

    // 필드: [행, 시작 bit, 폭 bits, 이름, bits 표기, 색, 등장 시각]
    var F = [
      [0, 0, 4, "VER", "4", C.aL, 1.6], [0, 4, 4, "HLEN", "4", C.yL, 1.9], [0, 8, 8, "Service type", "8", C.aL, 2.2], [0, 16, 16, "Total length", "16", C.yL, 2.5],
      [1, 0, 16, "Identification", "16", C.oL, 3.6], [1, 16, 3, "Flags", "3", C.oL, 3.9], [1, 19, 13, "Fragmentation offset", "13", C.oL, 4.2],
      [2, 0, 8, "TTL", "8", C.gL, 5.6], [2, 8, 8, "Protocol", "8", C.gL, 5.9], [2, 16, 16, "Header checksum", "16", C.gL, 6.2],
      [3, 0, 32, "Source IP address", "32", C.rL, 7.6], [4, 0, 32, "Destination IP address", "32", C.rL, 8.0]
    ];
    F.forEach(function (f) {
      var x = X(f[1]), w = f[2] * bw, y = y0 + f[0] * rh;
      var narrow = f[2] <= 4;
      var inner = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (rh - 2) + '" fill="' + f[5] + '" stroke="#888"/>';
      inner += txt(x + w / 2, y + (narrow ? 14 : 15), f[3], narrow ? 10 : 12, C.ink, ' font-weight="700"');
      inner += txt(x + w / 2, y + 27, f[4] + " bits", 9, C.muted);
      s += vis(f[6], D, inner);
    });
    // options
    var oy = y0 + 5 * rh;
    s += vis(9.1, D, '<rect x="' + x0 + '" y="' + oy + '" width="' + (32 * bw) + '" height="' + (rh - 2) + '" fill="#f9c784" stroke="' + C.o + '" stroke-dasharray="5 3"/>' + txt(x0 + 16 * bw, oy + 20, "Options + padding (0–40 bytes)", 12, C.ink, ' font-weight="700"'));

    // 오른쪽 메모 (x ≥ 510)
    var nx = 510;
    s += vis(1.9, D, txt(nx, y0 + 20, "HLEN = header ÷ 4 (5 → 20 B, 15 → 60 B)", 11, C.y, ' text-anchor="start" font-weight="700"'));
    s += vis(4.2, D, txt(nx, y0 + rh + 20, "flags = − · D · M, offset × 8 = byte", 11, C.o, ' text-anchor="start" font-weight="700"'));
    s += vis(5.6, D, txt(nx, y0 + 2 * rh + 20, "TTL 0 → discard, checksum 은 매 라우터 재계산", 11, C.g, ' text-anchor="start" font-weight="700"'));
    s += vis(7.6, D, txt(nx, y0 + 3.5 * rh + 14, "32 bits 씩 — 바뀌지 않음", 11, C.r, ' text-anchor="start" font-weight="700"'));
    s += vis(9.1, D, txt(nx, oy + 20, "있으면 HLEN &gt; 5", 11, C.o, ' text-anchor="start" font-weight="700"'));

    // 20 bytes 괄호 (왼쪽)
    s += vis(10.5, D, '<path d="M ' + (x0 - 8) + ' ' + y0 + ' L ' + (x0 - 14) + ' ' + y0 + ' L ' + (x0 - 14) + ' ' + (y0 + 5 * rh - 2) + ' L ' + (x0 - 8) + ' ' + (y0 + 5 * rh - 2) + '" fill="none" stroke="' + C.red + '" stroke-width="2"/>' +
      txt(x0 - 18, y0 + 2.5 * rh, "20 B", 11, C.red, ' text-anchor="end" font-weight="700"'));

    // payload 막대 (아래)
    var py = oy + rh + 10;
    s += vis(10.8, D, '<rect x="' + x0 + '" y="' + py + '" width="120" height="24" fill="#fff" stroke="#555"/>' + txt(x0 + 60, py + 16, "Header 20–60 B", 11, C.ink, ' font-weight="700"') +
      '<rect x="' + (x0 + 120) + '" y="' + py + '" width="328" height="24" fill="#8fd3f4" stroke="#555"/>' + txt(x0 + 284, py + 16, "Payload (data from upper layer)", 11, C.ink, ' font-weight="700"'));
    s += vis(11.4, D, txt(x0 + 224, py + 40, "total length (16 bits) = header + data ≤ 65,535 bytes", 11, C.red, ' font-weight="700"'));

    // ---- 요점 ----
    s += txt(380, 352, "요점: header = HLEN × 4 bytes (20–60), data = total length − HLEN × 4", 13, C.ink, ' font-weight="700"');
    s += '</svg>';
    return s;
  }
};
