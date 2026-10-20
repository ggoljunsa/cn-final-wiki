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

**⚠️ 이 PDF 는 사용자의 GoodNotes 필기본이다.** 슬라이드 위에 빨간 손글씨가 있다: 각 슬라이드 제목 옆 녹음 타임스탬프(`14:40~` = 녹음 14분 40초부터 그 슬라이드), 밑줄, 메모. 메모는 사용자가 수업 중 표시한 것이라 **강조·약점 신호**로 쓴다:
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
