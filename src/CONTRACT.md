# 컴네위키 기말 제작 계약 (모든 에이전트 필독)

목표: DGIST CSE403 Computer Network(Prof. Soobin Um, 교재 Forouzan *Data Communications and Networking with TCP/IP Protocol Suite* 6e) **기말고사 범위**(CH05 Wide Area Networks 부터)를 **나무위키 스타일 단일 HTML 위키**로 만든다. 중간고사 범위(CH01–CH04)는 별도 위키 https://ggoljunsa.github.io/cn-wiki/ 에 있고, 이 위키는 그 후속편이다 — 선수 개념은 `[[mid:키|표시]]` 로 그쪽에 링크한다(§3).
독자는 수강생 본인(3학년). 해설본이 "그림이 없고 변수를 까먹어서" 이해가 안 됐다는 피드백이 출발점 →
**① 그림/캡처/시뮬레이터 많이, ② 비유 많이, ③ 모든 변수·용어·공식 기호는 [[링크]]로 사전 문서에 연결.**

교수는 영어로 강의한다. 문서는 '''한국어 산문 + 영어 기술 용어 그대로'''("frequency reuse", "handoff", "reuse factor", "multiframe", "pilot channel"). 교수가 영어로 쓴 용어를 번역하지 말 것. 교수의 입버릇: "'''the name itself is very important'''" — 용어의 이름(정의)에서 개념을 끌어내는 설명을 사전 문서마다 넣는다.

## 1. 파일 배치
```
위키/                         (= 컴퓨터네트워크/기말고사/위키, 자체 git repo ggoljunsa/cn-final-wiki)
├── build.py                 # src/* → index.html (단일 파일), 참조 이미지 복사, 깨진 링크 검사
├── index.html               # 생성물 (직접 편집 금지)
├── images/                  # build.py 가 _slides/ 에서 참조된 것만 복사
├── _slides/                 # 슬라이드 PNG 원본 (git 제외) — L{덱}-{페이지}.png
├── _text/                   # 슬라이드 텍스트 (pdftotext -layout, git 제외)
└── src/
    ├── head.html · renderer.js · test_*.js
    ├── sims/_engine.js + sims/*.js       # SIMS["이름"] = {...} (§6)
    ├── anims/_anim_engine.js + anims/*.js # ANIMS["이름"] = {...} (§7)
    └── articles/*.wiki                   # 문서 각 1파일
```

### 슬라이드 원본 (덱 번호 ↔ PDF)
덱 번호는 중간고사 위키(L0–L9)에 이어 **L10 부터**. `_slides/L10-{pp}.png` (2자리 `L10-05.png`, 한 자리 페이지는 패딩 없는 복사본 `L10-5.png` 도 있음). 페이지 번호 = PDF 페이지 = 슬라이드 인쇄 번호 = 해설본 `p.N`.
텍스트는 `_text/CH05_Wide Area Networks (1).txt` (페이지 구분 `\f`).

| 덱 | PDF (`../강의자료/`) | 페이지 | 내용 | 수업 | 해설본 |
|---|---|---|---|---|---|
| L10 | CH05_Wide Area Networks (1) | 36 | p.2–4 복습(LAN 까지 배운 것, WAN recap), p.5–7 WAN 분류(wired: telephone/cable · wireless: cellular/satellite), **p.8–17 Cellular 동작**(cell·BS·MS·MSC, frequency reuse, 발신·수신, handoff hard/soft, roaming), **p.18–36 세대**(1G AMPS, 2G D-AMPS·GSM·IS-95, 3G IMT-2000, 4G) | 10/20(화) 전부 | `../정리본/CH05_정리.md` |
| L11 | CH05_Wide Area Networks (2) | 21 | **Satellite Network 전부**: p.2 정의, p.3 구성(space/ground/user segment, ISL — Starlink system architecture), p.4 orbit 3종(equatorial/inclined/polar), p.5–6 period + Kepler's law, p.7–8 Ex 5.1 달의 주기, p.9–10 Ex 5.2 35,786 km 위성 = 24 h(geostationary), p.11–14 세 범주(GEO/MEO/LEO, Van Allen belt), p.15 SATCOM 주파수 대역 표(L/S/C/Ku/Ka, uplink=Earth→satellite), p.16–17 GEO, p.18–19 MEO(GPS, trilateration), p.20–21 LEO(Starlink, UML/GWL/ISL, footprint) | 10/22(목) — **수업 전 선제 작성, 녹음 없음** | `../정리본/CH05(2)_정리.md` |
| L12 | CH07_Network Layer - Data Transfer (1) | 38 | **Network layer 시작.** p.2 So far, p.3–5 Overview(host-to-host delivery, IP: addresses·connectionless·best effort·datagram, segment→datagram→frame, ICMP·IGMP·DHCP·ARP), p.6 §1 Services, p.7 every hop, p.8–9 packetizing(라우터는 decapsulate 안 함, 예외 fragmentation), p.10–11 routing vs forwarding, p.12–13 error control(header checksum + ICMP)·flow control(TCP), p.14 congestion(vicious cycle), p.15 QoS, p.16 security(IPSec), p.17–18 What IP provides 표, p.19 §2 Packet switching, p.20–22 router = switch, p.23–24 datagram approach, p.25 virtual-circuit approach(VCI), p.26 비교표, p.27 §3 Performance, p.28–31 delay 4종(Ex 2,000 m / 2×10^8 = 10 μs), p.32–33 total delay, p.34–36 throughput = bottleneck(min(200,100,150)=100 kbps), p.37–38 delay·throughput vs load | 10/27(화) 전부 — 녹음 `1027_컴네.txt` (faster-whisper) | (정리본 미작성) |
| L13 | CH07_Network Layer - Data Transfer (2) (p.1–30: 11/3 필기본 · p.31– : `… (2) rev.pdf`) | 67 → rev 68 | **IPv4 addressing (p.1–30, 6강)**: p.2 §4 IPv4, p.3 address = connection(라우터 3 networks → 3 addresses), p.4 address space 2^32·세 표기, p.5 prefix/suffix, p.6–7 classful A–E(Why 2^7), p.8 depletion, p.9 classless(power of 2, n 0–32), p.10 slash notation/CIDR, p.11 N·first·last, p.12–16 Ex 7.1, p.17–18 address mask(NOT+1, AND, OR NOT), p.19 Ex 7.3, p.20 network address, p.21 block allocation(ICANN, 세 규칙), p.22 Ex 7.4, p.23 subnetting, p.24–26 Ex 7.5, p.27–28 aggregation·Ex 7.6, p.29 main/auxiliary protocols, p.30 IP unreliable·connectionless. **p.31– (rev) datagram format, fragmentation, ICMPv4, forwarding → 7강 (별도 작성)** | 11/3(화) p.1–30 — 녹음 `1103_컴네.txt` (whisper.cpp large-v3-turbo) · 11/5(목) p.31–68 추정, **녹음 없음** | (정리본 미작성) |
| L14 | CH07_Network Layer - Data Transfer (3) | 32 | **IPv6 (8강)**: p.2 §5 표지, p.3 128 bits·colon hex, p.4 leading zero·`::` 한 번만, p.5–7 unicast/anycast/multicast, p.8 2000::/3·n 48/m 16/q 64, p.9 global unicast 그림, p.10–12 link-layer address mapping(EUI-64: 7th bit, Ethernet: + FFFE), p.13–15 autoconfiguration ①②③·link-local FE80::/10, p.16–18 RS/RA, p.19–21 Ex 7.29, p.22 what changed, p.23–24 base header 40 B·필드 표, p.25 extension header·next-header codes, p.26 fragmentation source only, p.27–28 ICMPv6(ND·MLD), p.29 §6 표지, p.30 dual stack, p.31 tunneling, p.32 header translation | 11/10(화) 전부 — 녹음 `1110_컴네.txt` (whisper) | (정리본 미작성) |
| L15 | CH08_Network Layer - Routing of Packets_261112_162500 | 37 | **Routing (9강)**: p.2–3 Introduction(hop by hop, routing builds tables), p.4 weighted graph(A–G 7 node), p.5 least-cost tree ×7, p.6 빈 비교표, p.7 Bellman-Ford, p.8–9 distance vector, p.10 rudimentary vectors, p.11 교환·갱신(B←A D=5, B←E F=6), p.12–13 good/bad news·two-node loop, p.14–16 split horizon·poison reverse·three-node instability, p.17–18 LSDB, p.19 flooding·LSP, p.20 Dijkstra 절차, p.21–25 Dijkstra 예제(root A), p.26–27 path vector(policy, S-B-D 2 vs S-A-C-D 6), p.28 비교표, p.29 backbone·peering point, p.30 hierarchical routing·AS, p.31–32 RIP, p.33 RIP 예제 표, p.34–35 OSPF(weight, area), p.36–37 BGP4(eBGP/iBGP) | 11/12(목) 전부 — 녹음 `1112_컴네.txt` (faster-whisper, 09:39 시작 → p.13 부터) | `../정리본/CH08_정리.md` |

L11 PDF 는 **필기 없는 원본**이다(L10 과 다름). ※ 11/3 사용자가 필기본 `CH05_Wide Area Networks (2)_필기.pdf` 를 추가 — 필기는 질문·"다시" 없이 메모뿐: p.3 "지상국"(→ `41` tip) · p.6 "8:21"(녹음 위치) · p.8 "Bayes' Rule P(A|B)=", "Rule⟷Law⟷Theorem/Conjecture(추측)", 그림 r·d(→ `49` tip) · p.11 GEO→"정지궤도"(→ `4E` tip) · p.15 Ku/Ka 에 "high freq"(→ `4D` tip). images/ 캡처는 깨끗한 원본 유지. p.5–6, p.7–8, p.9–10, p.11–14, p.16–17, p.18–19, p.20–21 은 같은 슬라이드가 한 줄씩 늘어나는 build-up 이다 — 캡처는 **가장 완성된 마지막 장**(p.6, p.8, p.10, p.14, p.17, p.19, p.21)을 쓴다.

**검산된 수치**(python): Period = (1/100) × (h + 6378)^1.5 [s], h = 지표면 위 고도 km, 6378 = 지구 반지름. 달 h=384,000 → 2,439,091 s ≈ 1 month (슬라이드 2,439,090) · h=35,786 → 86,579 s = 24.05 h (슬라이드 "24 h") · LEO h=500 → 5,704 s ≈ 95 min, h=2000 → 7,669 s ≈ 128 min (슬라이드 "90 to 120 min" 은 근사) · MEO h=18,000 → 38,062 s ≈ 10.6 h. **함정: distance 는 지구 중심부터의 거리 → 고도에 반지름 6378 km 를 더해야 한다** (안 더하면 달 2,379,561 s). 슬라이드 불일치: p.11–14 그림은 GEO 35,786 km, p.16 본문은 "22,000 miles (≈ 35405 km)" — 둘 다 소개하고 Kepler 예제는 35,786 을 쓴다고 명시. MEO 도 불일치: p.14 그림 초록 띠 5,000–15,000 km vs p.18 본문 "about 18,000 km"(실제 GPS ≈ 20,200 km, 보충). Ex 5.1 의 384,000 km 는 원래 지구–달 중심 거리라 6378 을 더하면 엄밀히는 이중 계산이지만 시험은 슬라이드 풀이(2,439,090 s)를 따른다.

**L12 (CH07 (1))**: 11/3 사용자 필기본으로 교체 확인 — 질문·"다시" 없음, 형광펜·손그림만: p.4 형광펜(IP main protocol, Connectionless, Best effort)+동그라미 R ×2(→ `53` tip) · p.8 "Packetizing" 제목 동그라미 · p.9 형광펜(fragmentation, Header is copied)+fragment 손그림+"Fragmented"+"header" 동그라미(→ `5A`·`5B` tip) · p.10 라우터 옆 "RT"(→ `5C` tip) · p.11 "□→table", "forward"(→ `5D` tip). (원본 설명:) 필기 없는 원본. build-up 묶음 p.2–5, 8–9, 10–11, 12–13, 17–18, 20–22, 28–30, 32–33, 34–36, 37–38 → 캡처는 마지막 장. 녹음 `../녹음본/1027_컴네.txt` (`[MM:SS]`, faster-whisper; "panetizing"=packetizing, "Honjak"=혼잡, "SDS"=best effort). 교수 강조: "network and transport … most important"(00:32), "each role and each service"(01:49), routing=building the table / forwarding=pushing the packet(20:47), IP 두 성질 connectionless+best effort(28:28), IPSec same layer but different protocol(29:05), VC=flow label vs datagram=destination address(39:05), queuing 은 라우터에서만(50:43), DGIST 유선 300 Mbps bottleneck 일화(52:00–56:29). 시험 공지 없음. **검산된 수치**(python): Delay_pg = 2,000/(2×10^8) = 10 μs · (가정) 8,000 bits/100 Mbps = 80 μs · n=3, L=8,000 bits, R=10 Mbps, d=200 km, s=2×10^8, pr=50 μs, qu=2 ms → tr 0.8 ms, pg 1 ms, Total = 4×1.85 + 3×2 = 13.4 ms (함정: qu 를 n+1 번 → 15.4 ms, 링크 n 개 → 11.55 ms) · min(200,100,150) = 100 kbps, 1 MB → 80 s · DGIST min(1.2 G, 300 M, 10 G) = 300 Mbps, 1 GB → 26.67 s, 업그레이드 가정 → 1.2 Gbps, 6.67 s. **슬라이드 불일치**: p.9 "Routers do not decapsulate" vs p.31 processing 정의 "remove the header"(router/host) — 하위 계층 header 로 해석, 문서에 warn · p.9 그림이 Source→Destination→Router 순으로 배치 · p.38 b throughput 최고점이 capacity 선 약간 오른쪽 · p.25 그림은 VC 경로를 R1→R3→R4 로, p.22 그림 이름 체계와 다름 · p.36 그림 "Kbps" vs 본문 "kbps".

**L13 (CH07 (2))**: 11/3 판 PDF(67쪽)는 사용자 GoodNotes **필기본**, 11/4 교수가 개정판 `CH07_Network Layer - Data Transfer (2) rev.pdf`(68쪽)를 올렸다 — **p.1–50 은 글자까지 동일**하고 구 덱 p.64–67 **NAT 가 삭제**됐다(p.2 목차에는 "NAT" 남음). `_slides/L13-01…30.png` 는 11/3 필기본, `L13-31…68.png` 는 rev 에서 렌더(텍스트 `_text/CH07_Network Layer - Data Transfer (2) rev.txt`). **L13 은 p.31 부터 rev 덱 기준**. `[[NAT]]` 링크 금지. build-up: p.12–16(→ p.16), p.17–18(→ p.18). 필기: p.3 "two connections → not 'device' (MAC)", 세 주소 "여러 개" · p.4 "(2^8)^4" · p.6 막대 밑 "2^31 bits", "2^30 bits", "2^29", "2^28", "0~127"(→ bits 아니라 주소 개수, `{warn}` 정정) · p.8 "주소/자원 고갈" · p.9 "2^32" · p.12 "←27→ ←5→ → 2^5 = 32". "??"·"다시" 표시는 p.1–30 에 없음. 녹음 `../녹음본/1103_컴네.txt` (`[hh:mm:ss.mmm --> …]`; "meetup score"=midterm score, "Ja-won-quart"=자원 고갈, "sub-mapping"=subnetting, "address application"=aggregation, "AIP"=ARP, "best export"=best effort). 교수 강조: connections not devices(02:52), "most crucial distinction from MAC address"(05:19), depletion "crucial issue of IPv4"(16:34), block size power of 2 "important restrictions"(21:01), first always all-zero suffix(27:15), mask "implementable in a router"(35:46), Ex 7.3 "take this one as your own"(36:13), never directly receive from ICANN(38:19), Ex 7.4 prefix/suffix 말실수 정정(40:50–41:44), largest first(47:31), "exactly the same as dividing the entire address space"(50:35). **공지(00:00–00:42): 중간고사 점수 확인·claim 일시·장소 → TA 문의.** 59:13 "continue … IPv4 format on Thursday". **검산된 수치**(python ipaddress): 2^32 = 4,294,967,296 · 128.11.3.31 = 0x800B031F · class A 2^7=128 × 2^24=16,777,216, B 2^14=16,384 × 65,536, C 2^21=2,097,152 × 256, 몫 2^31/2^30/2^29/2^28/2^28 · Ex 7.1 167.199.170.82/27 → N 32, mask 255.255.255.224, .64–.95, NOT(mask)=31 · Ex 7.3 230.8.24.56: /16 230.8.0.0–230.8.255.255, /20 230.8.16.0–230.8.31.255, /26 .24.0–.24.63, /27 .24.32–.24.63, /29 .24.56–.24.63, /31 .24.56–.24.57 (230 은 classful 로 class D) · p.10 예: 12.24.76.8/8 → 12.0.0.0–12.255.255.255, 23.14.67.92/12 → 23.0.0.0–23.15.255.255, 220.8.24.255/25 → .128–.255 · Ex 7.4 1000 → 1024, /22, 18.14.12.0–18.14.15.255, 302,910,464 = 1024 × 295,811, mask 255.255.252.0 · Ex 7.5 /24 = 256 → a .0/25 (128), b .128/26 (64), c .192/28 (16), used 208, reserve 48 = .208/28 + .224/27 · 함정(작은 것부터) c .0, b .16 (16 mod 64 ≠ 0), a .80 · Ex 7.6 4 × /26 → 160.70.14.0/24, .130 → Block 3. **슬라이드 불일치**: p.26 그림 c 라벨 "14.24.192.0/28" = 14.24.74.192/28 오타 · 교수 "200 addresses"(51:28) vs 208 · 교수 23.14.67.92/12 "25 bits for the last one"(25:00) → suffix 20 · L12 p.5 는 DHCP 를 auxiliary 로, L13 p.29 그림은 DHCP 를 application layer 칸에.

**L13 후반 (7강, rev p.31–68, 11/5 선제)**: L13 후반 = `CH07_Network Layer - Data Transfer (2) rev.pdf` (11/4 개정판, 68쪽) **p.31–68** → 그룹 `7강 IPv4 데이터그램` [70_–7P_]. 페이지 번호는 rev 기준.
- p.31–38 IPv4 datagram format (header 행별 필드), p.39 Ex 7.7, p.40 Ex 7.9, p.41 Ex 7.10, p.42–46 fragmentation (MTU, 누가 나누고 합치나, identification/flags/offset, 재분할), p.47 Ex 7.14, p.48 Ex 7.16, p.49–50 ICMPv4 개요·두 종류, **p.51 ICMP 메시지 형식 (rev 신규)**, p.52–53 error reporting + 표, p.54 time exceeded/parameter problem, p.55 echo/timestamp, p.56 forwarding (rev 에서 "Remember: network address = the first address" 추가), **p.57–60 Ex 7.19 (rev build-up: 그림 → Network address → Connection address → Solution)**, p.61 Ex 7.20, p.62 Ex 7.21, p.63–66 address aggregation (p.63 그림, p.64 R1 표, p.65 R2 한 줄, p.66 떨어진 조직 + longest match), p.67 hierarchical routing, p.68 Ex 7.22.
- **NAT (구판 p.64–67) 는 rev 에서 삭제** → 문서·키·nat_anim 제거, 메인에 `{info}` 로 "시험 범위에서 빠졌을 가능성(교수 확인 전)" 만 남김.
- 상태(11/10 갱신): 11/5 수업은 녹음이 없어 슬라이드 기준으로 확정. 11/10 녹음이 "So far we've seen IPv4" 로 시작해 IPv6 로 넘어갔으므로 11/5 에 p.68 까지 나간 것으로 본다. (원래 메모:) 11/3 수업은 p.30 까지("continue our discussion on IPv4 format on Thursday", 1103 녹음 59:13). 이 그룹은 **11/5 수업 전 선제 작성** — 녹음이 오면 메인 `70_` 에 🎙 절 추가와 ⭐ 조정. 11/3 녹음 56:43–59:00 에서 교수가 IP = unreliable, best-effort, connectionless 를 복습함(메인 {exam} 에 인용).
- rev p.31–68 에는 손글씨 없음. build-up 묶음: p.33–38(같은 header 표, 강조 칸만 바뀜), p.57–60, p.63–65 → 캡처는 마지막 장(p.60, p.65) 또는 설명 장.

**검산된 수치** (python3 `ipaddress` 등):
- Ex 7.7: 0x42 → VER 4, HLEN 2 → 8 B < 20 → discard
- Ex 7.9: 0x0028 = 40, 40 − 20 = 20 B
- Ex 7.10: 45 00 00 28 00 01 00 00 01 02 → HLEN 20 B, total 40, id 1, flags/offset 0, TTL 1 (1 hop), protocol 2 = IGMP
- sim 함정: 47 00 01 2C 3A 10 20 00 05 11 → HLEN 7 = 28 B, total 300, data 272, id 14864, flags 001 (D=0, M=1), offset 0 → 첫 fragment, TTL 5, UDP (11-05: PS1 5(a) 와 겹치던 원래 값 교체)
- p.45–46: data 4,000 B (total 4,020), MTU 1,420 → F1 0–1399 off 0 M1 TL1420 / F2 1400–2799 off 175 M1 TL1420 / F3 2800–3999 off 350 M0 TL1220; F2 재분할(MTU 820) → F2.1 1400–2199 off 175 M1 TL820 / F2.2 2200–2799 off 275 **M1** TL620; id 14,567
- 함정 MTU 1,000 → 980 → 8 의 배수 976 → offsets 0/122/244/366/488, 마지막 96 B (TL 116)
- Ex 7.14: M1 off0 → first. Ex 7.16: 800–879 (data 80)
- offset 13 bits → 최대 8191 × 8 = 65,528
- Ex 7.21: 180.70.65.140 AND /26 = .128 ≠ .192 ✗, AND /25 = .128 ✓ → m0. 추가: .200 → /26 m2 (/25 도 맞음 = longest match 예시), 201.4.22.35 → m3, 201.4.18.7 → m1 (AND /22 = 201.4.16.0), 18.24.32.78 → default 180.70.65.200 m2
- aggregation: 140.24.7.0/24 = /26 × 4; R2(p.66) 140.24.7.200 → /26 m1, 140.24.7.42 → /24 m0
- Ex 7.22: /18 = 16,384; /20 × 4 = 4,096 each (64.0, 80.0 unused, 96.0, 112.0); LISP1 /23 × 8 = 512 (64.0…78.0), /30 × 128 = 512; LISP2 /22 × 4; LISP3 /24 × 16

**슬라이드 불일치**:
- p.61 (Ex 7.20) 셋째 행 201.4.22.0 의 셋째 octet 이 `00011100`(=28) — 정답 `00010110`(=22). 구판 p.58 에도 있었고 rev 에서도 안 고쳐짐. 메인·`7N_` 에 {warn}.
- p.42 "Maximum **Transfer** Unit" (Forouzan 표기; 흔한 표준어는 Maximum Transmission Unit) — 메인 {tip}, `7B_MTU` 본문.
- p.56 그림 표 셋째 행 `x2.y2.z2.t2/n1` (n2 여야 함) — Forouzan 원 그림 오타, 사소해서 문서에는 미기재.
- p.56(구판 p.55)·p.59 그림: 201.4.22.0/24 와 201.4.22.3/24 의 글자색이 다른 행과 반대(네트워크 주소가 연한 색) — 사소.
- rev p.2 개요에 아직 NAT 언급(본문 슬라이드는 삭제됨) — 메인 {info} 에 기재.
- (구판 전용, rev 삭제) NAT p.66 그림 incoming D 200.24.8.5 (= 200.24.5.8 오타).


**L14 (CH07 (3) IPv6, 8강)**: `CH07_Network Layer - Data Transfer (3).pdf` 32쪽 → 그룹 `8강 IPv6` [80_–8O_]. 11/10 수업에서 p.1–32 전부. PDF 는 사용자 GoodNotes **필기본** — `_slides/L14-NN.png`(+ 한 자리 복사본), 텍스트 `_text/CH07_Network Layer - Data Transfer (3).txt`. build-up 묶음 p.5–7(→ p.7), p.10–12(→ p.12), p.13–15(→ p.15), p.16–18(→ p.18), p.19–20(→ p.20) → 캡처는 마지막 장.
- 필기("??"·"다시" 없음, 메모·형광펜만): p.4 "Allowed only once per address" 형광펜(→ `80` p.4 · `84` tip) · p.8 "2000::" 아래 "00"·화살표, "/n : # bits of prefix"(→ `80` p.8 · `86` tip) · p.9 Site 옆 "↓ prefix"(→ `80` p.9 · `86` tip) · p.12 "64−48=16"(→ `80` p.10–12 · `88` tip) · p.14 "can build its own address", "no server needed" 형광펜(→ `80` p.13–15 · `8A` tip) · p.25 base header Next header 옆 "44", 첫 extension header 옆 "02", 동그라미, "→ ICMPv6"(→ `80` p.25 · `8F` · `8G` tip).
- 녹음 `../녹음본/1110_컴네.txt` (`[hh:mm:ss.mmm --> …]`, 47분; 46:45 이후 같은 문장 반복 환각 → 무시). ASR: "Any Guest"=anycast, "Global Unitecast/unicad"=global unicast, "laurel/louder"=router, "sfse"=FFFE, "IGFP, ICFP"=IGMP, ICMP, "MLP"=MLD, "two-step/dualsmeck"=dual stack. 00:00 "So far we've seen IPv4" → 11/5 는 녹음 없이 L13 rev p.31–68 을 끝낸 것으로 추정.
- 교수 강조: 전 세계 IPv6 사용 거의 절반·한국 약 25%(01:16), 동기 = address space(02:10), connection not device(03:04), `::` only once "to avoid confusion in decoding"(06:18–06:43), anycast = nearest(08:19), /n = # bits of prefix(09:51), EUI-64 이름 외울 필요 없음(15:31), **interface ID 64 bits "please remember"(15:47)**, autoconfiguration "a key difference"(19:17·19:46), solicitation = asking(22:21), "very easy, just following the rule"(27:22), IPv4 header 복잡·가변 → 느림(28:12·29:51), next header 사슬 44 → 02(34:21–35:47), **fragmentation only at source, router drops — "a key difference … you may be asked in exams … please remember that one"(39:06–39:45) → `{exam}`**, ICMPv6 = ICMP+ARP+IGMP, ND≈ARP, MLD≈IGMP(40:07–40:58), dual stack "simple but very stupid … very effective"(41:38), tunneling(43:28), header translation 기능 손실(45:33), 46:23 "continue … remaining part of chapter 7 on Thursday"(= 11/12). 시험 일정 공지 없음.
- 교수 말실수(문서에 warn/info): 15:43 "Always MAC layer addressing is about 64 bits"(Ethernet MAC 은 48) · 42:30 "the other one … forwards to IPv4"(= IPv6) · 37:50 "hosts and sources"(= source 와 router).
- **검산된 수치**(python3 `ipaddress`): FDEC:0074:0000:0000:0000:B0FF:0000:FFF0 → fdec:74::b0ff:0:fff0 · FEF6:BA98:7654:3210:ADEF:BBFF:2922:FF00 그대로 · 2^128 = 340,282,366,920,938,463,463,374,607,431,768,211,456, 2^96 배 · 2000::/3 = 2^125, 범위 2000:: ~ 3fff:ffff:…:ffff, 2^45 sites, 2^16 = 65,536 · Ex 7.29 F5 = 11110101 → 7번째 bit → 11110111 = F7, IID f7a9:23ff:fe11:9be2, link-local fe80::f7a9:23ff:fe11:9be2, global 3a21:1216:2165:1232:f7a9:23ff:fe11:9be2 · sim 프리셋 00-1A-2B-3C-4D-5E → 021a:2bff:fe3c:4d5e (fe80::21a:2bff:fe3c:4d5e), 0A-00-27-00-00-01 → 0800:27ff:fe00:0001 (fe80::800:27ff:fe00:1), EUI-64 00-1B-63-11-22-33-44-55 → 021b:6311:2233:4455, 함정 8번째 bit → f4a9:… · 2001:0DB8:0000:0000:0001:0000:0000:0001 → 2001:db8::1:0:0:1 (같은 길이면 앞쪽) · 0…01 → ::1 · base header 4+8+20+16+8+8 = 64 bits + 256 = 320 bits = 40 B · 문제 2001:0DB8:00AB:0001:IID → 2001:db8:ab:1:f7a9:23ff:fe11:9be2.
- **슬라이드 주의**: p.25 next-header 표의 "02: ICMPv6" 는 Forouzan 표기(IANA 실제 값 58, 02 는 IGMP) → `8F` info, 시험은 슬라이드 기준. p.8 "Interface ID … Can embed a link-layer address" 와 p.10 "shorter than 64 bits" 일치. header checksum 삭제는 슬라이드에 없음 → Forouzan 보충 표시.

**L15 (CH08 Routing, 9강)**: `CH08_Network Layer - Routing of Packets_261112_162500.pdf` 37쪽 → 그룹 `9강 라우팅` [90_–9P_]. `_slides/L15-NN.png`(+ 한 자리 복사본, PyMuPDF 90 dpi = 1200 px), 텍스트 `_text/CH08_Network Layer - Routing of Packets.txt`. build-up 묶음 p.2–3, 4–5, 8–9, 12–13, 14–16, 17–18, 21–25(Dijkstra), 26–27, 36–37 → 캡처는 마지막 장. (11-12: `_slides/` 에 없던 L13·L14 원본은 `images/` 에서 mtime 보존 복사해 build 의 missing 0 을 맞췄다.)
- 필기(GoodNotes 접미사 `_261112_162500`): p.13 "Two-node instability", stale 밑줄 + "=old", 16 위 "=∞", A 의 3 옆 "2+1 → cost to B", A→X 곡선 화살표 · p.14 "learned it from" 동그라미. "??"·"다시" 없음.
- 녹음 `../녹음본/1112_컴네.txt` (`[MM:SS]`, 35:51, 09:39 시작 → **p.1–12 녹음 없음**). ASR: "Style"=stale, "top/hook count"=hop count, "LINQ"=link state, "extra algorithm / Dijkstra code"=Dijkstra, "PG PG P"=BGP, "IP or SPF"=RIP·OSPF, "two months"=two nodes, **"every 13 seconds"=30 s(슬라이드)**.
- 교수 강조: stale = "한물간, 예전, old info"(02:15) · 16 = ∞ "explain later"(04:19) → RIP max 15(31:08) · split horizon "fancy name … very easy"(08:24) · poison reverse "not a fundamental cure"(11:17) · 3+ 노드 instability(11:42) · **근본 원인 "each node does not have global information … core key problem"(12:31) → `{exam}`** · LSDB 모두 같음(14:57) · flooding inefficient·congestion(18:53) · Dijkstra 자세히 안 함(19:42) · path vector = policy, 군 통신·ISP 예(24:43–26:21) → `{exam}` · **algorithm(저수준) vs protocol(규칙)(29:46) → `{exam}`** · OSPF weight "continuous"(33:00) · **BGP "the only inter-domain"(34:51) → `{exam}`** · "this is the last slide", 출석. 시험 공지 없음. 11/10 예고("CH07 남은 부분")와 달리 CH08 이 나감.
- **검산된 수치**(python): 7 tree 행 A [0,2,7,3,6,8,9] · B [2,0,5,5,4,6,7] · C [7,5,0,10,6,4,3] · D [3,5,10,0,5,7,8] · E [6,4,6,5,0,2,3] · F [8,6,4,7,2,0,1] · G [9,7,3,8,3,1,0] (슬라이드 p.5 와 일치) · p.11 B←A → [2,0,5,5,4,∞,∞], B←E → F 6 · 동기 DV 라운드 3 에 수렴(A→G 10 → 9), 라운드 4 변화 없음 · Dijkstra root A: B D E C F G, G Iter4 10 → Iter5 9 · root E: F G B D A C · root B: A E C D F G · two-node loop(cost 1) 15 updates, A–B cost 2 → 8, cost 3 → 5 · D←E → [3,9,∞,0,5,7,∞] · RIP 예제 표 검산(동점: R2→N6, R3→N5, R4→N4) · OSPF R3 4, R2 7, R1 12 (N3=10 이면 R1 19, R2 14) · path vector 2 vs 6.
- **슬라이드 주의**: p.13 그림 셋째 칸이 c·d 에서도 "A"(경로상 A 의 next router 는 B) — cost 칸 기준. p.19 E 의 LSP 표 셋째 줄 "E 2" = "F 2" 오타.

**이 덱에서 uplink/downlink 의 뜻이 바뀐다**: 셀룰러는 uplink = MS→BS, 위성은 uplink = **Earth → satellite**, downlink = satellite → Earth (p.15). 교수가 10/20 에 "uplink/downlink 는 외워라" 라고 했으므로 둘을 연결하는 `{exam}` 을 반드시 넣는다.

**⚠️ L10 PDF 는 사용자의 GoodNotes 필기본이다.** 슬라이드 위에 빨간 손글씨가 있다: 각 슬라이드 제목 옆 녹음 타임스탬프(`14:40~` = 녹음 14분 40초부터 그 슬라이드), 밑줄, 메모. 메모는 사용자가 수업 중 표시한 것이라 **강조·약점 신호**로 쓴다:
- "다시" (p.19 AMPS Bands, p.25 GSM Transmission, p.27 DSSS/CDMA) → 사용자가 다시 봐야 한다고 표시 → 그 문서에 쉬운 재설명 + `{warn}`.
- "기억 x" (p.21, 7.95 kbps 옆) → 교수가 "외울 필요 없다"고 한 듯 — 녹음본으로 확인하고 `{info}` 로 "수치 암기 불필요" 명시.
- "AP: Access point (동일 개념??)" (p.9 BS 옆) · "Hand over (동일 개념)" (p.14) · "SRT, KTX??", "break off connection??" (p.16 soft handoff 옆) · "416 channels ? 다시" (p.19) · "위의 5~6번 과정이랑 다른 거임?" (p.13 receiving) · "ETRI가 개발!" (p.27) · "South Korea 3G" (p.35 IMT-DS) · "blue print, not actual standard" (p.33) · "64 user" (p.29) · "각 소자가 frequency 쓰는…" (p.11) → 사용자가 품은 **질문**이다. 해당 문서에 그 질문에 대한 답을 `{tip}` 박스(제목 "필기 속 질문: …")로 반드시 답한다.
캡처할 때 손글씨가 많이 덮인 슬라이드는 캡션에 "(필기본)" 이라고 적는다. 손글씨는 그대로 둬도 된다(지울 수 없음).

복습 슬라이드(p.2–4)의 내용은 중간고사 위키로 `[[mid:]]` 링크.

녹음본: `../녹음본/1020_컴네.txt` (10/20, 73분, whisper.cpp large-v3-turbo 영어 전사 — `[hh:mm:ss.mmm --> …]` 타임스탬프). 영어 ASR이라 기술 용어가 깨져 있다("WANN" = WAN, "Starship" = Starshield 등). **슬라이드가 용어의 권위, 녹음본은 강조·공지의 권위.** 슬라이드 위 손글씨 타임스탬프로 녹음 위치를 바로 찾을 수 있다. 교수가 "remember", "important", "exam", "you don't need to memorize" 라고 한 대목은 `{exam}`(또는 암기 불필요는 `{info}`) 박스로. 학생 질문·교수 답변은 해당 문서 `== 🎙 수업에서 ==` 절에.

중간고사 위키 소스(키 확인용): `../../중간고사/위키/src/articles/*.wiki` — 각 파일 헤더 `key:` 가 `[[mid:]]` 에 쓸 키다(파일명이 아니라 키: 예 파일 `CSMA_CD.wiki` 의 키는 `CSMA/CD`). 자주 쓸 것: `WAN` · `LAN` · `FDM` · `TDM` · `FSK` · `PSK` · `modulation` · `multiplexing` · `channelization` · `guard band` · `FHSS` · `duplexing과 multiple access` · `TDD-TDMA` · `bandwidth` · `bit rate` · `PCM` · `sampling` · `half-duplex` · `full-duplex` · `IEEE 802.11` · `BSS` · `station mobility` · `distribution system`.

## 2. 문서 파일 형식 (`src/articles/{정렬번호}_{key}.wiki`)
```
key: frequency reuse
title: Frequency Reuse (주파수 재사용)
category: 1강 셀룰러 동작, 용어
---
(본문. 아래 문법)
```
- `key` = 다른 문서가 `[[key]]` 로 참조하는 문자열. **반드시 §5 의 정식 키 목록을 쓸 것** (새 키가 필요하면 목록 형식대로 §5 에 추가하고 파일도 만들 것).
- `category` 는 쉼표 구분. 첫 항목은 강의(`N강 ...`) 또는 `안내`/`시험`/`용어`. 첫 항목이 사이드바 그룹이 된다 — **아래 §5 의 그룹명을 글자 그대로** 쓸 것.
- 파일명 정렬번호: `00` 안내, `10` 1강, `20` 2강, `30` 3강 (이후 덱은 `40`, `50`, …), `E0` 시험, `Z0` 기타 용어. 정렬번호 뒤 두 번째 자리는 `0-9, A-Z` 로 이어간다(`10_`, `11_`, … `1A_`, `1B_`). 파일명에 `/` 는 `_` 로(키는 헤더에 원래대로).

## 3. 위키 문법 (renderer.js 가 지원)
| 문법 | 결과 |
|---|---|
| `== 제목 ==`, `=== 소제목 ===`, `==== 소소제목 ====` | h2/h3/h4 (자동 목차) |
| `'''굵게'''`, `''기울임''`, `` `code` `` | 인라인 |
| `* 항목` / `# 번호항목` | ul / ol (한 줄 = 한 항목, 중첩 없음) |
| `[[키]]`, `[[키|표시문구]]` | 위키 링크 (없는 키는 회색 stub 표시 → 반드시 있는 키만). 표시 문구가 없으면 '''key 그대로''' 보이고 문서 제목은 툴팁(title 속성)으로 — 제목이 길어 문장이 깨지지 않게 (2026-09-25 리뷰 반영) |
| `[[mid:키]]`, `[[mid:키|표시]]` | **중간고사 컴네위키(cn-wiki) 문서로 가는 외부 링크** (보라색, ↗중간 표시, 새 탭). 선수 개념(FDM, TDM, FSK, FHSS, channelization 등)에 쓴다. 키는 중간고사 위키 문서의 `key:` 그대로 (§1 끝 목록). build.py 는 검사하지 않으니 키 철자 주의 |
| `[[img:L10-11.png|캡션|small/medium/large]]` | 슬라이드 캡처 (한 줄에 단독으로) |
| `[[sim:gsm_bitrate]]` | 시뮬레이터 삽입 (한 줄에 단독으로) |
| `[[anim:handoff_hard_soft|캡션]]` | 움직이는 그림 삽입 (한 줄에 단독으로, 캡션 선택). §7 |
| `{info}…{/info}` `{warn}…{/warn}` `{tip}…{/tip}` `{joke}…{/joke}` | 참고/주의/팁/여담 박스 |
| `{analogy}…{/analogy}` | 🎭 비유 박스 (문서마다 1개 이상) |
| `{def}…{/def}` | 📖 정의 박스 (정의→용어 문제 대비, 슬라이드 원문 영어 정의 + 한국어) |
| `{quiz}…{/quiz}` | ❓ 예상문제 박스 |
| `{answer}…{/answer}` | 접힌 정답 (클릭해서 펼침) — quiz 바로 뒤에 |
| `{exam}…{/exam}` | 🎯 출제 포인트 박스 (교수가 녹음본에서 강조 / NotebookLM 퀴즈에서 틀린 것 / 해설본 ⭐⭐⭐) |
| 박스는 여러 줄 가능 (`{info}` 로 시작해 `{/info}` 로 끝나는 줄까지) | |
| `<pre class="txt">` … `</pre>` | 코드/계산 블록 (class: c / asm / ascii / sh / txt). ascii 는 밝은 배경 (ASCII 그림용) |
| ↑ 중 `txt` / `ascii` 블록 안에서만 | `'''굵게'''` 와 `[[키]]` / `[[키\|표시]]` 가 추가로 처리된다. `c` / `asm` / `sh` / 클래스 없는 `<pre>` 는 완전히 raw |
| `{|` / `! 헤더 || 헤더` / `|-` / `| 셀 || 셀` / `|}` | 표 |
| `$…$` | KaTeX 인라인 수식 — **이 과목은 수식이 많다. 공식은 반드시 `$…$` 로** (`$\frac{1}{120\text{ ms}} \times 26 \times 8 \times 156.25 = 270.8\text{ kbps}$`) |
| `----` | 수평선 |

주의: 코드 블록 안에서는 문법 처리 안 함. 표 셀 안에서는 인라인 문법만. 표 셀 안에서 `|` 가 필요하면 `\|`. KaTeX 안에서 `|` 도 표 셀 밖에서만 쓸 것.
계산 과정은 `<pre class="txt">` 블록에 한 줄에 한 단계씩 쓴다(손으로 푸는 순서 그대로).

## 4. 문서 작성 규칙
1. **한국어 산문 + 영어 기술용어 그대로.** 교수가 영어로 쓴 용어(cell, base station, handoff, frequency reuse, multiframe, pilot channel …)를 번역하지 말 것. 한국어 병기는 첫 등장 시 괄호로만.
2. 나무위키 톤: 개요 → 본문(슬라이드 순서) → 관련 문서. 잡담/여담(`{joke}`) 허용, 그러나 사실은 슬라이드·Forouzan 기준으로 정확히. **슬라이드 수치(Example 번호, 값)를 그대로** 쓴다.
3. **슬라이드에 계산(GSM 270.8 kbps, AMPS 416 채널 등)이 있으면 풀이를 단계별로 재현**하고 `[[sim:]]` 을 바로 아래에 둔다. 공식은 `$…$`, 각 기호는 첫 등장 시 [[링크]].
4. **모든 용어/기호/프로토콜/장비는 첫 등장 시 [[링크]]**: `[[MSC]]`, `[[reuse factor]]`, `[[TDMA]]`, `[[pilot channel]]`. 중간고사 범위 개념은 `[[mid:FDM]]` 처럼.
5. 문서마다 최소 `{analogy}` 1개, 시각자료([[img:]] 또는 [[sim:]] 또는 [[anim:]] 또는 ascii 그림 또는 표) 1개 이상. **메인 문서는 실제 슬라이드 캡처 3장 이상 + 움직이는 그림 1개 이상 + (§6 에 해당 시뮬레이터가 있으면) 시뮬레이터**. 용어 문서도 관련 슬라이드에 그림·표·수식이 있으면 캡처 1장을 넣는다.
6. 캡처 고르는 기준: 그림/표/파형/수식이 있는 슬라이드. **`_slides/L*.png` 를 Read 로 직접 보고 고른다.** 글자만 있는 슬라이드(섹션 표지, 정의 한 줄)는 캡처 대신 본문으로.
7. 각 메인 문서 끝에 `== 🎙 실제 수업 기록 (10/20 화, 녹음본 기준) ==`(교수 강조·학생 Q&A·공지), `== 시험 대비 핵심 요약 ==` 번호 목록, `== 관련 문서 ==` 링크 목록. 수치가 많은 메인 문서는 `== 공식 모음 ==` 표도.
8. 용어 사전 문서는 짧아도 됨 (정의 박스 + "이름에서 개념 끌어내기" + 어디서 쓰이는지 + 관련 링크 2~3개). 그러나 stub 이 아니라 실제 내용. 사전 문서의 `{def}` 는 **슬라이드 영어 원문 정의**를 먼저, 그 아래 한국어.
9. 해설본 `../정리본/CH05_정리.md`(있으면)의 ⭐ 와 "시험 대비 핵심 요약"을 재활용. ⭐⭐⭐ 항목·교수 강조는 `{exam}` 박스로.
10. **슬라이드 손글씨(§1)의 "다시" 표시는 `{warn}`(어려워한 곳 → 쉬운 재설명), "??" 질문은 `{tip}` "필기 속 질문: …" 으로 답한다.** 슬라이드 범위를 넘는 Forouzan 보충은 "(Forouzan 보충 — 슬라이드에 없음)"이라고 표시.
11. 사전 문서끼리 서로 링크 (§5 끝 "교차 링크 기대" 참고).
12. **문서 하나를 완성할 때마다 즉시 Write.** 여러 개를 모아 두지 말 것.
13. **문체 (2026-11-10 사용자 피드백, 8강부터 필수 — 기존 문서도 고칠 때 적용).** 조교가 칠판 옆에서 설명하는 노트처럼 쉽고 담백하게 쓴다. 기준 원문은 algo-wiki `src/CONTRACT.md` §9.4·§9.4a.
    - 하지 말 것: 극적인 문장("이게 핵심이다", "X 의 질문은 하나다", "답은 네 덩어리다"), "A 가 아니라 B 다" 대구, 본문 문단에 `—` 2 개 이상(제목·캡션은 괜찮음), 한 문단에 `'''굵게'''` 3 개 이상, 메타 발언("살펴보자", "정리하면", "다시 말해", "주목할 점은"), 번역투 동사("처리한다/수행한다/검출한다" → "~해도 된다/한다/찾아낸다").
    - 할 것: 짧은 "~다" 문장, 접속 표현으로 이유를 잇기("그래서", "대신", "~니까"), 세 가지 이상은 불릿, 영어 인용은 따로 한 문장("교수 표현으로는 "…" 이다."), 주어를 빼먹지 않기.
    - 절 순서: 슬라이드 캡처 → 이 슬라이드가 하는 일 2–4 문장 → 표/계산 → 주의할 점. **메인 문서의 `== p.N ==` 절마다 캡처 1장 이상**, 사전 문서도 관련 그림이 있으면 1장.



## 5. 정식 문서 키 목록 (링크는 이 키로만)
그룹명(= category 첫 항목)을 괄호 안에 적었다. 정렬번호 접두는 `[ ]`. 파일명: `{정렬번호}_{key}.wiki` (`/` → `_`).

### 안내 (`안내`) [00_–06_] — 메인 세션이 작성
main(대문) · 읽는 순서 · 시험 정보 · 자주 틀리는 함정 모음 · 공식 모음 · 셀룰러 세대 비교표 · 중간고사 선수 개념

### 1강 CH05 셀룰러 동작 (`1강 셀룰러 동작`) [10_–] — L10 p.1–17 (작성: w-1)
**메인**: CH05 셀룰러 동작
**사전**: WAN 분류 · telephone network · cable network · satellite network · Starlink · cellular telephony · cell · base station · mobile station · MSC · PSTN · frequency reuse · reuse factor · co-channel interference · 통화 발신 과정 · 통화 수신 과정 · paging · handoff · hard handoff · soft handoff · roaming · uplink와 downlink

### ⚠️ 페이지 대응(정정 10/20): p.18 1G AMPS · p.19 AMPS Bands · p.20 AMPS Transmission · p.21 D-AMPS · p.22 D-AMPS Transmission · p.23 GSM · p.24 GSM Bands · p.25 GSM Transmission · p.26 Multiframe · p.27 IS-95 · p.28 Bands · p.29 Forward · p.30 Reverse · p.31–32 Reuse/Handoff · p.33 IMT-2000 · p.34–35 Standards · p.36 4G. p.8 Cellular Telephony 표지 · p.9–10 Cellular system · p.11 Reuse · p.12 Transmitting · p.13 Receiving · p.14–16 Handoff · p.17 Roaming.

### 2강 CH05 1G·2G TDMA 계열 (`2강 1G–2G`) [20_–] — L10 p.18–26 (작성: w-2)
**메인**: CH05 1G–2G 셀룰러
**사전**: 셀룰러 세대 · 1G · AMPS · AMPS 대역과 채널 · FDMA · FM · AMPS control channel · 2G · D-AMPS · 7.95 kbps 디지털 음성 · TDMA · GSM · GSM 대역 · GSM 프레임 구조 · GSM multiframe · GSM channel bit rate · GMSK · HLR

### 3강 CH05 CDMA·3G·4G (`3강 CDMA–4G`) [30_–] — L10 p.27–36 (작성: w-3)
**메인**: CH05 IS-95·3G·4G
**사전**: IS-95 · DSSS · CDMA · Walsh code · chip rate · IS-95 대역과 채널 · GPS 동기화 · IS-95 forward 전송 · IS-95 reverse 전송 · pilot channel · long code와 ESN · QPSK · IS-95 frequency reuse · IS-95 soft handoff · 3G · IMT-2000 · ITU · IMT-2000 표준 · W-CDMA · CDMA 2000 · circuit switching과 packet switching · 4G · all-IP · ETRI

### 4강 CH05 Satellite Network (`4강 위성`) [40_–] — L11 p.1–21 (10/22 수업 전 선제 작성)
**메인**: CH05 Satellite Network
**사전**: satellite network 구성 · ISL · orbit · equatorial orbit · inclined orbit · polar orbit · period of a satellite · Kepler's law · Example 5.1 달의 주기 · Example 5.2 정지궤도 주기 · 위성 세 범주 · Van Allen belt · SATCOM 주파수 대역 · GEO · geostationary · line-of-sight · MEO · GPS · trilateration · LEO · footprint · UML과 GWL
(기존 키 재사용·갱신: satellite network(14_ — 이번 덱 메인으로 링크 추가) · Starlink(15_ — LEO·ISL 내용 추가) · WAN 분류 · uplink와 downlink(1M_ — 위성의 uplink/downlink 절 추가) · GPS 동기화(37_ — `[[GPS]]` 로 링크) · cellular telephony · handoff · cell)

### 5강 CH07 Network Layer: Data Transfer (1) (`5강 네트워크 계층`) [50_–] — L12 p.1–38 (10/27)
**메인**: CH07 네트워크 계층 서비스와 성능
**사전**: network layer · host-to-host delivery · IP · connectionless · best effort · datagram · segment·datagram·frame · ICMP · 보조 프로토콜 · packetizing · fragmentation · routing · forwarding · forwarding table · IP의 error control · flow control · congestion control · QoS · IPSec · IP가 제공하는 서비스 · packet switching · datagram approach · virtual-circuit approach · VCI · transmission delay · propagation delay · processing delay · queuing delay · total delay 공식 · throughput · bottleneck · load와 성능
(기존 키 재사용·갱신: circuit switching과 packet switching(3L_ — 5강 packet switching 으로 info 박스 추가) · GEO·all-IP 는 링크만. 중간고사 위키 키 `network layer`·`IP`·`throughput`·`fragmentation` 은 같은 이름이지만 `[[mid:…]]` 로만 가리킨다 — 이 위키의 같은 키는 기말 범위(CH07) 문서.)

### 6강 CH07 (2) IPv4 주소 (`6강 IPv4 주소`) [60_–] — L13 p.1–30 (11/3)
**메인**: CH07 IPv4 주소
**사전**: IPv4 address · logical address와 physical address · address space · dotted-decimal notation · prefix와 suffix · classful addressing · address depletion · classless addressing · slash notation · CIDR · block의 세 가지 정보 · address mask · Example 7.1 · Example 7.3 · network address · block allocation · ICANN · ISP · Example 7.4 · subnetting · Example 7.5 subnet 설계 · address aggregation · Example 7.6 · IGMP · DHCP · IPv4
(기존 키 재사용: 보조 프로토콜 · ICMP · best effort · connectionless · datagram approach · forwarding table · forwarding. 7강 키로 링크: CH07 IPv4 데이터그램과 포워딩 · IPv4 datagram format · ICMPv4 · longest mask matching. NAT 는 rev 덱에서 삭제 → 키 없음.)

### 7강 CH07 IPv4 datagram·forwarding (`7강 IPv4 데이터그램`) [70_–7P_] — L13 rev p.31–68 (11/5, 녹음 없음 — 슬라이드 기준)
**메인**: CH07 IPv4 데이터그램과 포워딩
**사전**: IPv4 datagram format · HLEN · service type · total length · TTL · protocol field · header checksum · Example 7.7 버전 판정 · Example 7.9 데이터 길이 · Example 7.10 TTL과 protocol · MTU · identification field · flags D와 M · fragmentation offset · reassembly · Example 7.14 fragment 위치 판정 · Example 7.16 첫·마지막 바이트 · ICMPv4 · ICMP error-reporting message · time exceeded와 traceroute · echo request와 ping · next hop · Example 7.19–7.21 R1 포워딩 · longest mask matching · hierarchical routing
(기존 키 재사용: `fragmentation`(5B_), `forwarding table`(5E_), `ICMP`(58_), `forwarding`, `best effort`, `datagram`, `packetizing`, `IP의 error control` — 5* 파일은 수정하지 않음. 6강 키 링크: `CH07 IPv4 주소`, `IPv4 address`, `CIDR`, `address mask`, `network address`, `subnetting`, `address aggregation`. `NAT` 키는 만들지 않음(rev 삭제).)

### 8강 CH07 (3) IPv6 (`8강 IPv6`) [80_–8O_] — L14 p.1–32 (11/10)
**메인**: CH07 IPv6
**사전**: IPv6 · IPv6 address · colon hexadecimal notation · zero compression · unicast·anycast·multicast · global unicast address · interface ID · EUI-64 · link-local address · autoconfiguration · router solicitation과 advertisement · Example 7.29 · IPv6 base header · traffic class와 flow label · next header · extension header · IPv6 fragmentation · ICMPv6 · neighbor discovery · MLD · dual stack · tunneling · header translation · IPv4와 IPv6 비교
(기존 키 재사용: IPv4 · DHCP · IGMP · ICMPv4 · fragmentation · MTU · TTL · total length · HLEN · service type · protocol field · slash notation · prefix와 suffix · 보조 프로토콜 · flow control · virtual-circuit approach · IPSec. 중간고사 위키 링크: `mid:MAC 주소` · `mid:ARP` · `mid:Ethernet 주소 판별` · `mid:unicast` · `mid:multicast` · `mid:broadcast 주소` · `mid:캡슐화` · `mid:IP 주소와 MAC 주소`. 다음 덱은 L15, 그룹 `90_`.)

### 9강 CH08 Routing (`9강 라우팅`) [90_–9P_] — L15 p.1–37 (11/12)
**메인**: CH08 라우팅
**사전**: least-cost routing · least-cost tree · Bellman-Ford equation · distance vector · distance vector routing · count to infinity와 two-node loop · split horizon · poison reverse · three-node instability · link state routing · LSDB · flooding과 LSP · Dijkstra algorithm · path vector routing · 라우팅 알고리즘 비교 · backbone과 peering point · autonomous system · intra-AS와 inter-AS routing · RIP · hop count · RIP forwarding table 예제 · OSPF · OSPF area · BGP4 · eBGP와 iBGP
(기존 키 재사용: routing(5C_ — info 추가) · forwarding table · hierarchical routing(7P_ — info 추가) · ISP · next hop · longest mask matching. 9강부터 메인 문서는 `_위키_문체지침.md` 의 나무위키형: 각주 `[* ]`, 절마다 `{mini}`+`{answer}`, `== 시험 직전 체크 ==`. 렌더러에 각주·취소선·mini 를 algo-wiki(dba4249)에서 이식(11-12). 다음 덱은 L16, 그룹 `A0_`.)

### 기타 용어 (`용어`) [Z0_] — 해당 용어를 처음 쓰는 작성자가 만든다
spread spectrum · 셀룰러와 WiFi 비교

(총 약 75 문서. 키를 새로 만들 필요가 있으면 이 목록 형식대로 §5 에 추가하고 파일도 만들 것. 이미 있는 키와 뜻이 겹치면 새로 만들지 말고 기존 키로 링크.)

교차 링크 기대: `[[handoff]]` ↔ `[[hard handoff]]` ↔ `[[soft handoff]]` ↔ `[[IS-95 soft handoff]]` ↔ `[[pilot channel]]` · `[[frequency reuse]]` ↔ `[[reuse factor]]` ↔ `[[IS-95 frequency reuse]]` ↔ `[[CDMA]]` · `[[FDMA]]` ↔ `[[TDMA]]` ↔ `[[CDMA]]` (+ `[[mid:channelization]]`) · `[[AMPS]]` → `[[D-AMPS]]` → (같은 대역) · `[[GSM 프레임 구조]]` ↔ `[[GSM multiframe]]` ↔ `[[GSM channel bit rate]]`.

## 6. 시뮬레이터 (src/sims/*.js)
### 이름 (문서에서 `[[sim:이름]]`)
| 이름 | 내용 (옵션) | 기대 최종값 | 문서 |
|---|---|---|---|
| call_flow | p.12 발신(Transmitting) ①–⑦ / p.13 수신(Receiving) ①–⑦ 을 슬라이드 문장 그대로 한 단계씩. 패널 = 7단계 원문(영어) + 한국어, vars = 현재 메시지 위치(MS/BS/MSC/central office/상대), 할당된 voice channel, 상태. svg 로 MS–BS–MSC–central office–상대 전화 그림에 현재 화살표 강조 (옵션: 발신 / 수신) | 발신: ⑦ "Communication begins", voice channel 할당은 ⑥(MSC 가 unused voice channel 할당) · 수신: ② paging(모든 cell 에 query) → ③ MS 응답으로 위치 확인 → ⑥ voice channel 할당 → ⑦ | 통화 발신 과정, 통화 수신 과정, paging, CH05 셀룰러 동작 |
| handoff_signal | MS 가 BS1 → BS2 쪽으로 이동. 매 step(= "every few seconds" MSC 측정) BS1·BS2 신호 세기(가상 dB 값, 슬라이드에 수치 없음 — 예시값임을 desc 에 명시)와 연결 상태. 신호가 임계값 아래로 떨어지면 MSC 가 새 cell 탐색 → 채널 변경 (옵션: hard handoff = break before make / soft handoff = make before break) | hard: 연결 BS 가 {BS1} → {} (짧은 끊김) → {BS2} · soft: {BS1} → {BS1,BS2} → {BS2} | handoff, hard handoff, soft handoff, CH05 셀룰러 동작 |
| band_channels | 대역 → 채널 수 계산 (옵션: AMPS / GSM / IS-95). AMPS: 25 MHz ÷ 30 kHz = 833.3 → 832 채널(방향당) → 2 provider → 416 → control 21 → voice 395 → reuse factor 7 → cell 당 ≈56 voice(395/7, 슬라이드에는 없는 파생값임을 note 로) · GSM: 890–915 = 25 MHz ÷ 200 kHz = 125 → 124 채널(guard) × 8 slot = 992 사용자 · IS-95: 25 MHz 안에 1.228 MHz 채널 20 개(guard band 사이), provider 당 10, 채널당 Walsh code 64 개 | AMPS 832/416/395 · GSM 124 / 992 · IS-95 20 / 10 / 64 | AMPS 대역과 채널, GSM 대역, IS-95 대역과 채널, reuse factor, 공식 모음 |
| gsm_bitrate | p.25–26: slot 156.25 bits ← (user data 65 → +error control 114 → +TDMA control 156.25) → frame = 8 slots → multiframe = 26 frames(24 traffic + 2 control) = 120 ms → channel bit rate = (1/120 ms) × 26 × 8 × 156.25 (옵션: channel bit rate / 사용자 1명(slot 1개) rate / 순수 user data rate = 65 × 24 / 120 ms) | 270.833 kbps ≈ 270.8 kbps · 33.85 kbps · 13 kbps | GSM channel bit rate, GSM multiframe, GSM 프레임 구조, 공식 모음 |
| damps_tdma | p.21–22: 음성 3 kHz → digitize 7.95 kbps × 3 사용자 = 23.85 kbps → TDMA 로 합침 + overhead → 48.6 kbps → QPSK → 30 kHz 아날로그 채널 → FDMA 832 채널 중 하나 (옵션: AMPS(비교: 사용자 1명 = 채널 1개 FM) / D-AMPS) | D-AMPS: 23.85 → 48.6 kbps, 채널당 3 사용자 (AMPS 1명 대비 3배) | D-AMPS, TDMA, 7.95 kbps 디지털 음성 |
| is95_rates | p.29–30 블록도의 rate 를 왼쪽→오른쪽으로 (옵션: forward(downlink) / reverse(uplink)). forward: voice 3 kHz → digitizer 9.6 kbps → error correcting·repeating·interleaving 19.2 ksps → long code(ESN, decimator 1.228 Mcps → 19.2 ksps)로 scramble → Walsh code W_i (64 chips) 곱 → 19.2 k × 64 = 1.2288 Mcps → Σ(64 digital channel, W0 = pilot all 1s) → QPSK → 1.228 MHz 채널 · reverse: 9.6 kbps → 28.8 ksps → 6-to-64 symbol modulation 307.2 kcps → long code(1.228 Mcps)로 DSSS ×4 → QPSK | 둘 다 1.2288 Mcps ≈ 1.228 Mcps (forward 64 배 확산, reverse 307.2×4) | IS-95 forward 전송, IS-95 reverse 전송, chip rate, Walsh code, long code와 ESN |
| cdma_walsh | Forouzan 6e CDMA 예제(보충 — 슬라이드 p.27 의 "code1, code2, …, codeN" 그림을 수치로): 4 스테이션, Walsh code c1=[+1 +1 +1 +1], c2=[+1 −1 +1 −1], c3=[+1 +1 −1 −1], c4=[+1 −1 −1 +1]. 데이터 d1=−1(bit 0), d2=−1(bit 0), d3=0(silent), d4=+1(bit 1). 단계: 각 d_i·c_i → 채널에서 합 → 수신자 i 가 합·c_i 내적 ÷ 4 (옵션: 복원할 스테이션 = 1 / 2 / 3 / 4) | 채널 합 [−1 −1 −3 +1] · 복원 d1=−1, d2=−1, d3=0(silent), d4=+1 | CDMA, Walsh code, DSSS, spread spectrum |
| reuse_pattern | p.11 그림: 육각 cell 격자에 reuse factor N = 4 / 7 패턴으로 주파수 그룹 1..N 을 배치하는 과정을 한 cell 씩(svg 육각형), 매 step "같은 번호 cell 끼리 인접하지 않음" 확인. 마지막 step: 채널 395 개(AMPS voice)일 때 cell 당 395/N. 옵션 N = 4 / 7 / 1(IS-95 CDMA: 모든 cell 이 같은 대역, 코드로 구분) | N=4: cell 당 ≈98 · N=7: ≈56 · N=1: 전 대역(코드로 구분) | frequency reuse, reuse factor, co-channel interference, IS-95 frequency reuse |
| kepler_period | Kepler's law: 고도 h → distance = h + 6378 → distance^1.5 → × 1/100 → 초 → 시간/일 환산. 옵션: Ex 5.1 달(h=384,000) / Ex 5.2 GEO(35,786) / MEO GPS(≈18,000) / LEO Starlink(550) / 함정: 반지름 안 더함(달) | 2,439,091 s ≈ 28.2 일 · 86,579 s ≈ 24.05 h · 38,062 s ≈ 10.6 h · 5,766 s ≈ 96 min · 2,379,561 s (틀린 값) | Kepler's law, period of a satellite, Example 5.1 달의 주기, Example 5.2 정지궤도 주기, GEO, LEO, CH05 Satellite Network |
| total_delay | L12 p.28–33: Delay_tr = L/R → Delay_pg = d/s → 링크·processing·queuing 횟수 세기 → (n+1)(tr+pg+pr) + n·qu. 옵션: p.30 예제 확장(n=0, 2,000 m, 2×10^8, L=8,000 bits, R=100 Mbps, pr=0) / 라우터 n=3(L=8,000 bits, R=10 Mbps, d=200 km, pr=50 μs, qu=2 ms) / 함정 ① queuing n+1 번 / 함정 ② 링크 n 개 | 90 μs (tr 80 + pg 10) · 13.4 ms · ✗ 15.4 ms · ✗ 11.55 ms | total delay 공식, transmission delay, propagation delay, queuing delay, CH07 네트워크 계층 서비스와 성능 |
| bottleneck_throughput | L12 p.34–36: 링크 rate 를 하나씩 → min = bottleneck → 파일 전송 시간. 옵션: 슬라이드 200/100/150 kbps(1 MB) / DGIST WiFi 1.2 Gbps(예시)·유선 300 Mbps·외부 10 Gbps(예시)(1 GB) / 업그레이드 가정(유선 10 Gbps) | 100 kbps, 80 s · 300 Mbps, 26.67 s · 1.2 Gbps, 6.67 s | throughput, bottleneck, CH07 네트워크 계층 서비스와 성능 |
| datagram_vs_vc | L12 p.20–26: 같은 메시지 1–4 (p.22 라우터 배치). datagram: DA 로 패킷마다 조회, 경로 1 R1→R4→R5 · 2 R1→R2→R5 · 3 R1→R3→R4→R5 · 4 R1→R3→R5, 수신 1 3 4 2. VC: setup R1→R3→R5, VCI 14→66→22→77 (Forouzan 보충), data transfer in order, teardown | dg: out of order (1 3 4 2) · vc: in order (1 2 3 4) | datagram approach, virtual-circuit approach, VCI, packet switching |
| cidr_block | L13 p.11–22: address/n → 2진수 → prefix·suffix → N = 2^(32−n) → mask → first = AND mask → last = OR NOT(mask) → 검산(NOT(mask)+1 = N, first mod N = 0). 옵션: Ex 7.1 167.199.170.82/27 · Ex 7.3 230.8.24.56 /20 · /27(함정: 주어진 주소 ≠ first) · /31 · Ex 7.4 18.14.12.0/22 · p.10 220.8.24.255/25(함정: 주어진 주소 = last) | .64–.95 (32) · 230.8.16.0–230.8.31.255 · .32–.63 · .56–.57 · 18.14.12.0–18.14.15.255 (1024) · .128–.255 | block의 세 가지 정보, address mask, Example 7.1, Example 7.3, Example 7.4, slash notation, CH07 IPv4 주소 |
| subnet_alloc | L13 p.23–26 Ex 7.5: 14.24.74.0/24 → need 120·60·10 → 2^k 올림 → 정렬 → n_sub → 시작 ÷ N_sub → last → used/reserve. 옵션: 큰 것부터(슬라이드) / 함정: 작은 것부터 빈틈없이 | a .0/25 · b .128/26 · c .192/28, used 208, reserve 48 · 함정: b .16 (✗), a .80 (✗) | subnetting, Example 7.5 subnet 설계, CH07 IPv4 주소 |
| classful_class | L13 p.6–7: 첫 바이트 → 8비트 → leading bits → class → prefix · # of networks · addresses/network · 공간 몫. 옵션: 12.24.76.8 / 128.11.3.31 / 200.1.1.1 / 230.8.24.56 / 245.10.0.1 / 191.255.0.1(경계) | A /8 128 × 16,777,216 · B /16 · C /24 · D multicast · E reserved · 191 → B | classful addressing, CH07 IPv4 주소 |
| ipv4_header_decode | L13 p.33–41: hex bytes 를 VER/HLEN → service type → total length → data → identification → flags·offset → TTL → protocol 순으로 해독, 10 byte 상자 svg (옵션: Ex 7.7 `42` / Ex 7.9 `45 00 00 28` / Ex 7.10 `45 00 00 28 00 01 00 00 01 02` / 함정 `47 00 01 2C 3A 10 20 00 05 11`) | 8 B < 20 → discard · data 20 B · TTL 1, IGMP · 28 B header, data 272, M=1 off 0 → first, TTL 5, UDP | IPv4 datagram format, HLEN, TTL, Example 7.7/7.9/7.10, main |
| fragment_calc | L13 p.42–48: (MTU−20) 을 8 의 배수로 → fragment 별 bytes·offset·M·TL, byte 축 svg (옵션: p.46 4,000 B/MTU 1,420 / F2 재분할 MTU 820 / 함정 MTU 1,000 / Ex 7.14 판정표 / Ex 7.16 범위) | 0/175/350 · 175/275 (F2.2 M=1) · 976 → 0/122/244/366/488 · first · 800–879 | MTU, fragmentation offset, flags D와 M, Example 7.14/7.16, main |
| forward_lookup | L13 p.56–62: Ex 7.19 표(/26 m2, /25 m0, /24 m3, /22 m1, default 180.70.65.200 m2)를 긴 mask 부터 dest AND mask 비교, 표 svg (옵션: Ex 7.21 180.70.65.140 / 180.70.65.200 / 201.4.22.35 / 201.4.18.7 / 18.24.32.78) | m0 · m2 (/25 도 맞지만 longest) · m3 · m1 · default m2 | Example 7.19–7.21, longest mask matching, next hop, main |
| ipv6_compress | L14 p.3–4: 8 sections → leading zero 제거 → 0 section 줄 찾기 → 가장 긴 줄 `::`(같으면 앞쪽) → 검산(숨은 수 = 8 − 보이는 수), 8 칸 svg (옵션: p.4 FDEC:0074:… / p.3 FEF6:… / Ex 7.29 link-local / 2001:0DB8:0:0:1:0:0:1 / 0…01 / 함정 `::` 두 번 / 함정 0 하나에 `::`) | FDEC:74::B0FF:0:FFF0 · 그대로 · FE80::F7A9:23FF:FE11:9BE2 · 2001:DB8::1:0:0:1 · ::1 · 2001:DB8::1::1 ✗ · FDEC:74:0:0:0:B0FF::FFF0 (맞지만 길다) | zero compression, colon hexadecimal notation, main |
| eui64 | L14 p.10–12, p.19–21: MAC bytes → 첫 byte 2진수·7번째 bit 뒤집기 → (48-bit) 가운데 FFFE → interface ID → FE80:: link-local → (Ex 7.29) prefix + subnet + IID, byte 상자 svg (옵션: Ex 7.29 / 00-1A-2B-3C-4D-5E / 0A-00-27-00-00-01(1 → 0) / 64-bit EUI-64 / 함정 8번째 bit) | F7A9:23FF:FE11:9BE2 → FE80::F7A9:23FF:FE11:9BE2 → 3A21:1216:2165:1232:F7A9:23FF:FE11:9BE2 · FE80::21A:2BFF:FE3C:4D5E · FE80::800:27FF:FE00:1 · 021B:6311:2233:4455 · F4A9 ✗ | EUI-64, Example 7.29, interface ID, link-local address, main |
| dv_update | L15 p.10–16: (옵션) p.11 B 가 A·E 벡터 받기(칸별 min) / p.10 7 node 동기 라운드 / p.13 two-node loop / split horizon / poison reverse. 벡터 열·7×7 표·X–A–B svg | B ← A D=5, B ← E F=6 · 라운드 3 수렴(A→G 10→9) · loop 15 updates · split·poison 1 update | Bellman-Ford equation, distance vector routing, count to infinity와 two-node loop, split horizon, poison reverse, main |
| dijkstra_ls | L15 p.20–25: Init(LSDB 행) → Select(가장 가까운 것) → Update → 반복, 7-node 그래프 svg(root 검정, tree 하늘색, potential 점선). 옵션 root A(슬라이드) / D / G(동점 C·E) | A: B D E C F G, [0,2,7,3,6,8,9] · D: [3,5,10,0,5,7,8] · G: [9,7,3,8,3,1,0] | Dijkstra algorithm, LSDB, least-cost tree, main |

### 엔진 API (`src/sims/_engine.js`, 모든 sim 파일이 따를 것 — 참조 구현 `src/sims/_reference_ticket_lock.js.txt`)
```js
window.SIMS = window.SIMS || {};
SIMS["gsm_bitrate"] = {
  title: "CRC 나눗셈 — 1001000 ÷ 1011",
  desc: "한 줄 설명 (무엇을 보여주는지)",
  options: [ { key:"mode", label:"모드", values:[{value:"enc",label:"Encoder"},{value:"dec_ok",label:"Decoder (오류 없음)"}] } ],
  build(opts) {           // opts = {mode:"enc"} (기본값 = 각 option 의 첫 value)
    return {
      panels: [ { id:"P", title:"절차", lang:"txt", lines:["1. dataword 뒤에 000 붙이기","2. 최상위 비트가 1이면 1011 로 XOR","3. …"] }, ... ],
      vars:   [ { name:"dividend", group:"나눗셈" }, { name:"remainder", group:"나눗셈" }, ... ],   // 표시 순서
      steps:  [
        { desc:"설명 (인라인 위키문법 가능: '''굵게''', [[링크]])",
          pc: { P: 1 },                    // 패널별 현재 줄 (1-based, null=대기)
          vars: { dividend:"1001000", remainder:"?", ... },   // 전체 스냅샷 (엔진이 이전 step 과 diff 해서 바뀐 값 강조)
          status: { P:"running" },         // 선택. 패널 헤더에 배지
          note: "warn 텍스트 (선택, 빨간 박스)",
          svg: "<svg …>" 또는 function(step, i) → string (선택. 커스텀 그림)
        }, ...
      ]
    };
  }
};
```
엔진 동작 (`SimEngine.mount(containerEl, simName)`):
- 헤더(제목·설명) → 옵션 select 들(바꾸면 build 재실행, step 0) → 컨트롤(⏮ ◀ ▶ ⏭, ▶ 자동재생(속도), 슬라이더, "n / N") → 코드 패널 가로 나열(현재 줄 하이라이트, status 배지) → 변수표(그룹별, 바뀐 값 노란 배경 + 이전값 표시) → 설명 박스 → svg 영역.
- 이 과목은 코드가 아니라 **계산·절차**가 패널이다: 패널 lines 에 "손으로 푸는 순서"나 "흐름도 단계"를 한 줄씩 적고, pc 로 현재 단계를 가리킨다. 비트열 처리(stuffing, CRC)는 panel lines 에 비트열을 놓고 svg 로 현재 위치를 강조.
- 모바일에서 세로 배치. 키보드 ← → 지원. 각 sim 은 순수 데이터 + build 만 갖는다 (DOM 접근 금지).
- 자동 테스트: `src/test_sims.js` (node) 가 모든 sims 를 로드해 각 옵션 조합으로 build() 를 실행, steps.length>0 이고 pc 가 존재하는 패널 줄 범위 안인지 검사.

## 7. 움직이는 그림 (src/anims/*.js, `[[anim:이름|캡션]]`)

시뮬레이터(§6)가 "값을 한 단계씩 보는 디버거"라면, 움직이는 그림은 '''보고만 있어도 흐름이 들어오는 10초짜리 만화'''다.
문서에서는 보통 `{def}`/`{analogy}` 다음, `[[sim:]]` 앞에 둔다 — 먼저 그림으로 감을 잡고, 그다음 시뮬레이터로 값을 확인하는 순서.

### 파일 형식 (참조 구현: `src/anims/_reference_ctx_switch.js.txt` — 운체위키의 컨텍스트 스위치. 반드시 읽고 같은 구조로)
```js
window.ANIMS = window.ANIMS || {};
ANIMS["csma_cd_abort"] = {              // 이름 == 파일명(csma_cd_abort.js). 영문 소문자+밑줄
  title: "CSMA/CD — 충돌을 감지하고 중단하는 10초",
  desc: "한 줄 설명. 인라인 위키 문법([[링크]], '''굵게''') 허용",
  duration: 10,                         // 초. 엔진이 0→duration 을 반복 재생
  build: function () { return '<svg viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg">…</svg>'; }
};
```
- `build()` 는 '''순수 문자열'''만 돌려준다. DOM 접근 금지 (`node src/test_anims.js` 가 document 없이 실행한다).
- 시간축은 '''SMIL''' (`<animate>`, `<animateTransform>`, `<animateMotion>`, `<set>`) 로만 만든다. CSS animation·JS 타이머 금지 — 엔진이 `svg.setCurrentTime(t)` 로 시간을 직접 움직이므로 SMIL 만 스크러버/배속/정지에 반응한다.
- 모든 애니메이션 요소는 `begin + dur ≤ duration`. `repeatCount="indefinite"` 를 쓰려면 `dur` 을 반드시 지정. `fill="freeze"` 로 마지막 상태를 유지.
- "t초~t'초에만 보이기"는 `opacity` 를 `values="0;0;1;1;0;0" keyTimes="0;a;a+0.02;b;b+0.02;1" dur="D s"` 로 (참조 구현의 `show()` 헬퍼). keyTimes 는 0 에서 시작해 1 로 끝나고 단조증가.
- `viewBox="0 0 760 H"` (H 는 260~380). `<svg>` 에 고정 `width`/`height` 쓰지 말 것 — CSS 가 100% 폭으로 맞춘다.
- 텍스트 안의 `<`, `>`, `&` 는 `&lt;` `&gt;` `&amp;` 로. (`T_fr >= 2T_p` → `T_fr &gt;= 2T_p`)
- `<marker id>` 등 id 는 anim 이름을 접두어로 (`cc_arrow`) — 한 문서에 그림이 여럿 실린다.
- 크기 60KB 이하. 글자 크기 11~15px, 한국어 산문 + 영어 용어 (§4-1 그대로).
- 색: 스테이션/호스트 A `#1d65b3`(연한 `#dbe8f7`), B `#2e9e4f`(`#dff3e4`), C `#e09a40`(`#fdeec2`), 라우터/스위치/장비 `#3b2f4a`(`#efe9f6`), 충돌/오류/경고 `#d6465f`, 보조 글씨 `#777`. 신호 파형은 `#1d65b3`, 잡음·손상 `#d6465f`, 반송파 `#777`.
- 구성 규칙: 맨 위 한 줄 '''단계 자막'''(지금 무슨 일이 일어나는지, 시간대별로 바뀜) → 가운데 그림 → 맨 아래 한 줄 '''요점'''. 자막 문장은 문서 본문의 표현과 일치시킬 것 (시험 답안에 그대로 쓸 수 있게).
- 시간 설계: 첫 1~2초는 초기 상태를 보여주고, 각 단계 1.5초 내외, 마지막 1.5초는 결과 상태 유지. 8~14초.
- 파형(사인파)은 `<path d="M …">` 로 점을 20~40개 찍어 그린다. 계산은 build() 안에서 JS 로 해도 된다(순수 함수).

### 검증 (작성자가 반드시)
```sh
node src/test_anims.js                  # 계약 검사 (태그 균형, viewBox, SMIL 유무, begin+dur ≤ duration, 이스케이프)
python3 build.py                        # index.html 재생성 + 문서에서 안 쓰는 anim 경고
./shot.sh <이름> <초> [출력.png]         # headless Chrome 으로 t초에 멈춘 화면 캡처 → Read 로 열어 눈으로 확인
```
캡처는 최소 3개 시각(초반·중반·끝)에서 찍어 '''글자 겹침·잘림·화살표 방향·색 대비'''를 확인하고 고친 뒤에 끝낸다.
문서에 넣을 때는 `[[anim:이름|캡션]]` 한 줄, 캡션에는 "무엇을 보고 나서 무엇을 하라"를 쓴다.


### 목록 (이름 → 문서)
| 이름 | 내용 | 문서 |
|---|---|---|
| wan_categories | p.5–7: WAN 이 wired(telephone network: local loop–end office–trunk–tandem–regional office / cable network) 와 wireless(cellular telephony 4G/5G · satellite network Starlink/Starshield) 로 갈라지는 트리가 차례로 그려지고, 마지막에 "이번 강의 focus: wireless WAN" 박스 | main, WAN 분류, CH05 셀룰러 동작 |
| cellular_architecture | p.9–10: 육각 cell 들이 깔리고 각 cell 에 BS(탑)·MS(폰) 등장 → BS 들이 유선으로 MSC 에 연결 → MSC 가 PSTN(public switched telephone network) 에 연결 → stationary phone. 요점 "MSC = 모든 BS 와 central office 사이의 조정자" | cellular telephony, cell, base station, mobile station, MSC, PSTN, CH05 셀룰러 동작 |
| frequency_reuse_hex | p.11: 인접 cell 이 같은 주파수를 쓰면 경계의 사용자에게 interference(빨간 ✗) → N=4 패턴으로 색칠(같은 색 cell 은 떨어져 있음) → N=7 패턴 → 마지막 장면 IS-95: 모든 cell 이 같은 색(N=1)이지만 사용자마다 다른 code 무늬 | frequency reuse, reuse factor, co-channel interference, IS-95 frequency reuse |
| call_transmit | p.12 발신 ①–⑦: MS 가 대역 scan 해 가장 강한 setup channel 로 번호 송신 → BS → MSC → telephone central office → 상대 연결 → 결과가 MSC 로 → MSC 가 unused voice channel 할당 → 통화 시작(초록 voice channel 선) | 통화 발신 과정, CH05 셀룰러 동작 |
| call_receive | p.13 수신 ①–⑦: central office 가 번호를 MSC 로 → MSC 가 **모든 cell 에 paging**(퍼지는 파동) → MS 응답, 위치 확인 → MSC 가 ringing signal → MS 응답 → voice channel 할당 → 통화. 요점 "발신과 달리 MS 가 어디 있는지 모르니 paging 이 필요" | 통화 수신 과정, paging |
| handoff_hard_soft | p.14–17: MS 가 BS1 cell → BS2 cell 로 이동, 아래 시간축에 BS1·BS2 연결 막대. 위 줄 hard handoff: BS1 막대가 끝난 뒤 BS2 시작(break before make, 빨간 틈) / 아래 줄 soft handoff: 두 막대가 겹침(make before break). 요점 "MSC 가 every few seconds 신호 세기를 감시" | handoff, hard handoff, soft handoff, IS-95 soft handoff |
| roaming_anim | p.17: MS 가 Provider A(home) 의 cell 들을 벗어나 Provider B(neighbor) cell 로 이동 → MSC A ↔ MSC B 사이 roaming contract 점선이 빛나며 서비스 계속 | roaming |
| access_methods | p.27 오른쪽 그림: 시간–주파수–코드(또는 power) 축에서 FDMA(주파수 띠로 나눔) → TDMA(시간 슬롯으로 나눔, user 1·2·3) → CDMA(같은 시간·같은 주파수, code 1·2·3 이 겹쳐 쌓임). 요점 "1G=FDMA, 2G=TDMA(D-AMPS·GSM)/CDMA(IS-95)" | FDMA, TDMA, CDMA, 셀룰러 세대, CH05 1G–2G 셀룰러 |
| amps_bands | p.19: MS 대역 824–849 MHz(reverse=uplink, mobile→base) 와 BS 대역 869–894 MHz(forward=downlink, base→mobile), 각 25 MHz = 832 × 30 kHz 채널. 한 MS 가 uplink 채널 하나 + downlink 채널 하나를 짝으로 잡는 모습. 요점 "두 대역을 써서 duplex, 채널은 FDMA" | AMPS 대역과 채널, uplink와 downlink, AMPS, FDMA |
| damps_tdma_anim | p.22: 왼쪽 AMPS — 3 kHz 음성 하나가 FM 으로 30 kHz 채널 하나 차지 / 오른쪽 D-AMPS — 음성 3개가 digitizer(7.95 kbps) → TDMA 슬롯 1·2·3 으로 끼워져 48.6 kbps → QPSK → 같은 30 kHz 채널. 요점 "같은 대역에서 3배 사용자" | D-AMPS, TDMA, 7.95 kbps 디지털 음성 |
| gsm_multiframe_anim | p.25–26: 65 bits user data → 114 bits(error control) → 156.25 bits(TDMA control) slot → 8 slot = frame → 26 frame(24 traffic + 2 control) = multiframe 120 ms → "(1/120 ms) × 26 × 8 × 156.25 = 270.8 kbps" 식이 아래에 완성 | GSM 프레임 구조, GSM multiframe, GSM channel bit rate |
| cdma_spreading | CDMA 원리(Forouzan 보충 + p.27 그림): 스테이션 3개의 비트(+1/−1)가 각자 Walsh code 칩열과 곱해짐 → 채널에서 더해져 하나의 파형 → 수신자 2 가 자기 code 를 곱해 평균 → 자기 비트만 복원(나머지는 0 으로 상쇄). 요점 "같은 주파수·같은 시간, 코드가 직교라서 분리" | CDMA, Walsh code, DSSS, spread spectrum, IS-95 |
| generations_timeline | 1G(AMPS, analog, FDMA, voice) → 2G(digital: D-AMPS·GSM=TDMA, IS-95=CDMA) → 3G(IMT-2000: 144 k/384 k/2 M bps, packet+circuit, W-CDMA·CDMA 2000) → 4G(100 Mbps 이동 / 1 Gbps 정지, all-IP packet-switched) 가 왼쪽에서 오른쪽으로 쌓이고, 아래에 "아날로그→디지털→데이터→all-IP" 화살표 | 셀룰러 세대, 1G, 2G, 3G, 4G, 셀룰러 세대 비교표, main |
| satellite_orbits | p.11–14 그림: 고도축(0 / 5,000 / 15,000 / 35,786 km) 위에 LEO(파랑 띠) → Lower Van Allen belt → MEO(초록 띠) → Upper Van Allen belt → GEO(점선) 가 차례로 나타나고, 오른쪽에 각 궤도 위성이 지구를 도는 속도 차이(LEO 빠름 ~90–120 min, MEO, GEO 24 h = 지구와 같이 돎 → 정지해 보임) | 위성 세 범주, GEO, MEO, LEO, Van Allen belt, CH05 Satellite Network, main |
| geo_three | p.17: 적도면 위 GEO 위성 1 기 → 닿는 영역(line-of-sight)과 지구 곡률로 가려지는 영역 → 120° 간격 3 기로 전 지구 커버. 요점 "최소 3 기 = full global transmission" | GEO, geostationary, line-of-sight |
| leo_footprint | p.20–21: LEO 위성 2 기가 ISL 로 연결되어 지나가고, 지상의 footprint 원이 위성을 따라 이동. 사용자 폰(UML)·gateway(GWL). footprint 가 지나가면 다음 위성으로 넘겨짐 → "Similar to the cellular telephone system"(cell 이 움직이는 셀룰러) | LEO, footprint, UML과 GWL, ISL, Starlink |
| trilateration_anim | p.19: 2D — 기지점 A·B·C 에서 거리 원 3 개가 커지며 한 점에서 만남(교점 = 내 위치) / 3D — 위성 3 기의 구가 겹쳐 두 점 → 지구 표면 쪽 하나. 요점 "거리 3 개 → 위치 1 개 (GPS)" | trilateration, GPS, MEO |
| encap_decap | L12 p.7–9: host 5계층 / 라우터 3계층. Source 에서 header 가 붙고(encapsulate) → R1·R2 에서 header 만 빨갛게 강조, payload 회색("reads the header only") → Destination 에서 header 가 떨어지고 "to upper layer" → 10 초 이후 예외 fragmentation(큰 패킷 → H′ 복사된 fragment 2 개). 14 s | CH07 네트워크 계층 서비스와 성능, packetizing, fragmentation |
| datagram_vs_vc_anim | L12 p.20–26: 위 datagram — 1·2·3·4 가 서로 다른 경로로 가서 2 4 1 3 순서로 도착(out of order) / 아래 virtual circuit — setup 경로 띠 + VCI 14·66·22·77, 1 2 3 4 가 같은 경로로 in order, teardown. 14 s | CH07 네트워크 계층 서비스와 성능, packet switching, datagram approach, virtual-circuit approach, connectionless |
| delay_four_parts | L12 p.28–33: A → link1 → Router(input queue · Process · output queue) → link2 → B. 비트 6 개가 0.3 s 간격으로 나감(transmission), 각 비트가 1.6 s 에 건넘(propagation), queue 대기·Process·output queue, link2, B processing. 아래 집계 tr+pg 2 번 · processing 2 번 · queuing 1 번 → 2(tr+pg+pr) + 1·qu. 13 s | CH07 네트워크 계층 서비스와 성능, transmission delay, processing delay, queuing delay, total delay 공식 |
| load_curves | L12 p.37–38: load 커서가 0 → capacity(0.7) → 1 로 움직이며 delay 곡선(capacity 에서 발산)과 throughput 곡선(직선 상승 → capacity 약간 너머 최고 → 붕괴)이 clipPath 로 그려짐, Congestion area 라벨. 12 s | CH07 네트워크 계층 서비스와 성능, load와 성능, congestion control |
| cidr_mask_anim | L13 p.11–18 Ex 7.1: 167.199.170.82 32칸 → prefix·suffix 경계(27) → mask 줄 → AND 줄이 왼쪽부터 채워져 first .64 → NOT(mask) 줄 + OR 줄 → last .95 → "N = NOT(mask)+1 = 32, Block .64 ~ .95". 12 s | CH07 IPv4 주소, address mask, block의 세 가지 정보, Example 7.1 |
| subnet_split_anim | L13 p.23–26 Ex 7.5: /24 막대(256) → need 120·60·10 빨간 점선 → a 128 /25 .0 → b 64 /26 .128 → c 16 /28 .192 가 자라남 → Unused 48 → Check 0÷128, 128÷64, 192÷16 (+ 작은 것부터면 16÷64 ✗). 13 s | CH07 IPv4 주소, subnetting, Example 7.5 subnet 설계 |
| aggregation_anim | L13 p.27–28 Ex 7.6: Block 1–4 (/26) 와 25–26 번째 비트 00·01·10·11 → 바깥 forwarding table 4 줄 → 160.70.14.0/24 1 줄 → 패킷 .14.130 이 Internet → ISP → Block 3. 12 s | CH07 IPv4 주소, address aggregation, Example 7.6 |
| ipv4_header_anim | L13 p.31–38: 0·4·8·16·31 눈금 위 32-bit 행이 한 줄씩 채워짐(1 행 VER·HLEN·service·total → 2 행 id·flags·offset → 3 행 TTL·protocol·checksum → 주소 2 행 → options), 오른쪽 메모, 20 B 괄호, Header+Payload 막대와 "total length = header + data ≤ 65,535". 13 s | main, IPv4 datagram format |
| fragmentation_anim | L13 p.43–46: Source → R1(MTU 1,420) F1/F2/F3 → R2(MTU 820) F2 → F2.1/F2.2 (M=1 강조), id 14,567, destination 에 F2.2 F2.1 F3 F1 뒤섞여 도착 → offset 순 재조립 막대. 13 s | main, identification field, fragmentation offset, reassembly |
| ipv6_autoconfig_anim | L14 p.13–21 Ex 7.29: Host(MAC) · Router(prefix, subnet) → IID F7A9:23FF:FE11:9BE2 → link-local + unique ✓ → RS 이동 → RA(3A21:1216:2165:1232) 이동 → global 막대 prefix + subnet + IID 완성. 13 s | main, autoconfiguration, router solicitation과 advertisement |
| ipv6_frag_anim | L14 p.26: 위 IPv4 줄 1,500 B → router(next MTU 1,000) 에서 F1·F2 로 나눠 destination 재조립 / 아래 IPv6 줄 같은 패킷 drop(✗) → source 가 처음부터 F1·F2 로 보내 통과. 12 s | main, IPv6 fragmentation |
| ipv6_transition_anim | L14 p.30–32: ① dual stack(IPv4 패킷 → IPv4 층, IPv6 패킷 → IPv6 층) ② tunneling([v6\|data] → R1 [v4\|v6\|data] → R2 [v6\|data]) ③ header translation([v6\|data] → R [v4\|data], IPv6 전용 기능 손실). 14 s | main, dual stack, tunneling, header translation |
| count_to_infinity_anim | L15 p.13–16: 위 줄 규칙 없음 — X–A 고장 → A 16 → B 의 stale X=2 → A 3 → B 4 → … 16/16 (update 15 번) / 아래 줄 split horizon — B 침묵 → A 16 알림 → B 16 (1 번). 13 s | main, count to infinity와 two-node loop |
| lsp_flooding_anim | L15 p.17–19: A 의 LSP(B 2, D 3)가 hop 1 B·D → hop 2 C·E(D→E 중복 discard) → hop 3 F·G(E→D, E→F discard) → hop 4 전부 discard, 받은 node 초록. 끝에 LSDB A 행, 12 메시지 중 6 버림. 13 s | main, link state routing, flooding과 LSP |
