# 컴네위키 기말 (CN Final Wiki)

DGIST **CSE403 Computer Network** (Prof. Soobin Um, 교재 Forouzan *Data Communications and Networking with TCP/IP Protocol Suite* 6e) **기말고사 범위**를 나무위키 스타일로 정리한 단일 페이지 위키. 중간고사 범위(CH01–CH04)는 [컴네위키](https://ggoljunsa.github.io/cn-wiki/)에 있고, 선수 개념은 보라색 `↗중간` 링크로 그쪽 문서에 연결된다.

계산이 나오는 곳마다 **한 단계씩 값이 바뀌는 시뮬레이터**가 붙어 있고, 핵심 메커니즘마다 **저절로 도는 움직이는 그림(SVG 애니메이션)**과 **실제 강의 슬라이드 캡처**가 들어 있으며, 모든 용어는 사전 문서로 하이퍼링크된다.

**라이브**: https://ggoljunsa.github.io/cn-final-wiki/

## 범위

1. CH05 Wide Area Networks (1) — WAN 분류, cellular 구조(cell·BS·MS·MSC), **frequency reuse**, 발신·수신, **handoff**(hard/soft), roaming (10/20 수업)
2. CH05 (1) 세대 — 1G AMPS(FDMA), 2G D-AMPS(TDMA)·**GSM**(270.8 kbps)·**IS-95**(DSSS/CDMA, reuse factor 1, soft handoff), 3G IMT-2000, 4G

## 구조 · 빌드

```sh
python3 build.py                     # src/ → index.html, 깨진 링크/누락 이미지 보고
node src/test_sims.js                # 시뮬레이터 자동 검사
node src/test_anims.js               # 움직이는 그림 자동 검사
node src/test_render.js index.html   # 전 문서 렌더 → 원시 마크업 잔존 검사
```

`src/CONTRACT.md` 가 문법·문서 키·시뮬레이터/애니메이션 규약. 슬라이드 PNG(`_slides/`, git 제외)가 없으면 `pdftoppm -r 90 -png "../강의자료/CH05_Wide Area Networks (1).pdf" _slides/L10`.

## 출처

강의 슬라이드 이미지는 DGIST CSE403 (Prof. Soobin Um) 강의 자료의 캡처(수강생 필기 포함)이며 교육 목적의 학습 정리용이다. 학습 목적 비상업적 사용. 저작권은 원저작자에게 있다.
