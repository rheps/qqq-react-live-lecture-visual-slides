# 라이트 광택 컴포넌트 표준 — 설계 문서

- 날짜: 2026-06-26
- 대상 스킬: `qqq-react-live-lecture-visual-slides`
- 벤치마크: `rheps/remotion-news-shorts` (`src/remotion/ds/` — kit.tsx, smartart, components, tokens)

## 1. 배경과 문제

이 스킬은 밝은 파스텔 배경(`linear-gradient(135deg,#EFF6FF,#F0FDFA,#F0F9FF)`) 위에
유리(glass) 카드를 얹는 "Modern Glassy Light" 테마다. 사이트 기준에 맞춰 컴포넌트를
"약간 투명한 느낌"으로 바꾸는 과정에서, 카드 컨테이너뿐 아니라 **카드 안의 SVG 도형**까지
`fill`을 반투명 단색(`rgba(255,255,255,.62)` 등)으로 바꿨다.

그 결과 도형이 많은 컴포넌트(원·톱니·블록·노드)는 밝은 배경이 그대로 비쳐
**형태가 씻겨 보이고 깨졌다**. 광택의 정체인 "그라데이션 채움 + 안쪽 흰 하이라이트 +
컬러 글로우"가 도형에는 없었기 때문이다.

벤치마크(remotion-news-shorts)는 어두운 배경 위에서 같은 문제를 이렇게 푼다:
- 도형 본체(`Badge` 등)는 **불투명** radial-gradient + `inset 0 1px 2px rgba(255,255,255,.45)`
  하이라이트 + 컬러 글로우로 입체 광택을 낸다 (투명도가 아니라 그라데+하이라이트가 광택의 정체).
- 반투명(glass)은 **카드 패널 컨테이너에만** 쓰고, 통제된 배경 위에서만 비치게 한다.

## 2. 목표

밝은 배경에서 **도형이 깨지지 않으면서** remotion급 입체·광택을 내는
"라이트 광택 표준"을 확립한다.

- 질감 방향(확정): **하이브리드** — 도형 = 광택 불투명, 카드/패널 = 옅은 유리.
- 범위(확정): 먼저 **대표 6개**로 표준을 완성·승인받고, 그 공식을 나머지로 확장.
- 단일 출처: 갤러리 미리보기 = 생성되는 슬라이드가 같은 광택을 갖도록 공식을 한 곳에 둔다.

### 비목표 (이번 범위 밖)
- 다크 테마 변경.
- 라이트 배경/딥슬레이트 제목/블루 메인/보라 금지/번호·type 문자열 체계 변경.
- 6개 외 나머지 컴포넌트의 실제 리메이크(표준 확정 후 별도 확장 단계).

## 3. 아키텍처 & 단일 출처

| 파일 | 역할 | 이번 변경 |
| --- | --- | --- |
| `component-gallery.html` | 번호별 시각 카탈로그 + 복붙용 SVG 소스 | 상단에 **광택 키트**(공용 `<defs>` + JS 헬퍼) 추가, 대표 6개 빌더를 키트로 교체 |
| `references/design-and-readability.md` | 테마·glass·광택 공식의 글로 된 단일 출처 | "도형 광택 공식(라이트)" 절 신설 — 헬퍼와 1:1 대응 레시피 명문화 |
| `references/component-registry.md` | 번호 ↔ 컴포넌트 기준표 | 6개 항목에 "광택 표준 적용됨" 표시 (번호·type 문자열 유지) |

### 광택 키트 내부 구성 (한 곳에 모음)
- `<defs>` 한 블록: 색상 6종(BL/EM/AM/RO/SK/TL)별 **그라데이션**(밝은 틸트→액센트) + **글로우 필터**.
- JS 헬퍼 4종:
  - `glossCircle(cx,cy,r,colorKey,opts)` — 채운 원/노드 (radial 그라데 + 하이라이트 + 글로우)
  - `glossBlock(x,y,w,h,colorKey,opts)` — 블록/바 (linear135° 그라데 + 상단 하이라이트 줄 + 바닥 그림자)
  - `glossArc(path/points,colorKey,opts)` — 호·연결선 (그라데 stroke + 흐르는 광택 점선 + 화살촉 + 글로우)
  - `glossNode(innerSvg,colorKey,opts)` — 복잡 도형(톱니 등)을 그라데/글로우로 감싸는 래퍼
- 헬퍼만 갈아끼우면 컴포넌트가 일관되게 같이 바뀐다 (AGENTS.md "한곳만 고쳐도 같이 바뀐다" 원칙).

## 4. 라이트 광택 공식 (레시피)

예시 색 = 블루 `#3B82F6`. 4요소로 구성한다.

### ① 채움 = 그라데이션 (단색 금지)
```html
<radialGradient id="g-blue" cx="38%" cy="30%" r="75%">
  <stop offset="0%"   stop-color="#9DC3FF"/>  <!-- 좌상단 빛받는 밝은 틴트 -->
  <stop offset="100%" stop-color="#3B82F6"/>  <!-- 액센트 본색 -->
</radialGradient>
```
원·노드는 radial(구체감), 블록·바는 linear 135°(면 광택).

### ② 안쪽 위 흰 하이라이트 = 입체의 정체
도형 위에 얇은 흰 타원/초승달을 한 겹 (remotion `inset 0 1px 2px rgba(255,255,255,.45)`의 SVG 이식):
```html
<ellipse cx=".." cy="topArea" rx=".." ry=".." fill="rgba(255,255,255,.55)"
         style="mix-blend-mode:soft-light"/>
```

### ③ 외부 컬러 글로우 + 바닥 그림자 = 라이트 배경에서 떠 보이게
```html
<filter id="glow-blue">
  <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#3B82F6" flood-opacity=".38"/>
  <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0F172A" flood-opacity=".14"/>
</filter>
```
컬러 글로우(떠오름) + 아주 옅은 다크 그림자(접지). 밝은 배경에선 접지 그림자가 있어야 입체로 읽힌다.

### ④ 또렷한 가장자리 (선택)
밝은 배경에서 번지지 않게 `stroke="rgba(255,255,255,.7)" stroke-width="1"`.

### 겹침(벤다이어그램) 예외
교집합은 비쳐야 의미가 산다. 그래서 벤만:
- 카드 안에 **불투명 흰 inner plate**를 깔고, 그 위에서만 두 원을 `mix-blend-mode:multiply` 반투명으로.
- 교집합이 자연스럽게 진해지고, 페이지 파스텔 배경이 직접 비치지 않아 안 깨진다.

### 대원칙
도형은 절대 페이지 배경에 직접 닿지 않는다. 항상 카드의 유리 판 위에 얹고,
도형 채움은 불투명-광택이 기본. 비침이 의미상 필요한 것(벤)만 흰 inner plate + 블렌드로 통제.

## 5. 대표 6개 적용 매핑

각 대표가 서로 다른 "도형 렌더링 난제"를 대표한다.

| # | 컴포넌트 | 난제 | 적용 |
| --- | --- | --- | --- |
| 35 | 방사형(HubSpoke) | 채운 원 + 연결선 | 위성=`glossCircle`, 허브=큰 `glossCircle`, 스포크=`glossArc` 직선판 |
| 33 | 삼위일체(Trinity) | 원+연결선 합성 | 꼭짓점·중심=`glossCircle`, 잇는 선=`glossArc` 직선판 |
| 31 | 피라미드 | 쌓인 블록 | 층마다 `glossBlock`, 위→아래 명도 단계 |
| 8  | 순환·블록주기 | 호(arc) 세그먼트 | `glossArc`(그라데 stroke + 흐르는 광택 점선 + 화살촉 + 글로우) |
| 27 | 톱니바퀴(Gear) | 복잡 도형 | 톱니+몸통을 `glossNode`로, 중심 구멍은 카드 유리톤, 톱니 가장자리 흰 stroke |
| 38 | 벤다이어그램 | 겹침/비침 | 예외 레시피: 흰 inner plate + 2원 `multiply` 반투명 |

작업 순서: 35 → 33 → 31 → 8 → 27 → 38 (쉬운→어려운, 공식이 점점 검증됨).

## 6. 검증

1. **눈으로(매 컴포넌트)**: 브라우저로 갤러리 열어 ① 안 깨짐(배경 안 비침) ② 광택 보임
   ③ 떠 보임(글로우+그림자) ④ 벤 교집합 또렷 확인.
2. **6개 나란히(표준 게이트)**: 한 화면 비교로 색/광택 강도/그림자 일관성 확인 → OK면 표준 확정.
3. **회귀 체크(정적 스크립트)**: 도형 `fill`에 `rgba(255,255,255,..)` 반투명 단색이 남아있지 않은지,
   6개 빌더가 광택 헬퍼/그라데이션 id를 실제 참조하는지 정규식 확인 (AGENTS.md 가드 테스트 스타일).
4. **불변 확인**: 라이트 배경·블루 메인·보라 없음·번호/type 문자열 유지.

## 7. 산출물 동기화

- 작업 위치: `C:\AI\qqq-react-live-lecture-visual-slides` (GitHub 원본 풀 클론).
- 단계마다 글로벌 스킬 폴더(`~/.claude/skills/qqq-react-live-lecture-visual-slides`)로 동기화해 즉시 사용.
- GitHub push는 사용자가 명시 요청할 때만.
