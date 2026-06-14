# Architecture (Layout / Tech Stack / React / Data)

이 문서는 레이아웃, 기술 스택, React 아키텍처, slides 데이터 스키마를 다룬다. 첨부 md의 9·10·11·12번 섹션에 해당한다.

---

## 1. 레이아웃 구조

**핵심: 배경은 전체화면, 내용만 고정 4:3 캔버스에 담고 통째로 스케일한다.**
(옛 방식 — "stage-box를 96vh 4:3으로 두고 바깥을 비우는" — 은 모니터 좌우에 빈 공간/경계선이 생겨 폐기. 또 옛 방식의 `vh` 기반 사이징도 스케일과 충돌해 폐기.)

기본 구조:

```
fixed fullscreen app-wrap        ← viewport 전체. 테마 그라디언트 배경. flex 중앙 정렬
├── bg-layer (absolute inset:0)  ← 전체화면 blob 레이어 (모니터 끝까지). overflow:hidden
├── stage-box (고정 1200×900)    ← 4:3 내용 캔버스. 투명. transform:scale(var(--fit))
│   ├── absolute stage           ← 슬라이드 (현재·±1만 렌더). px 좌표계
│   │   └── box (내용)           ← 고정 px 사이즈, 세로 가운데
├── progress bar                 ← app-wrap 직속(viewport). 화면 끝~끝 풀폭, 맨 아래
└── slide number                 ← app-wrap 직속(viewport). 진짜 우하단 모서리
```

필수 규칙:

- 브라우저 **스크롤 금지**. `html, body`에 `overflow:hidden`. `html/body/#root` 배경은 현재 테마 그라디언트로 둔다(React `useEffect`로 테마 따라 갱신) — 캔버스 바깥/로드 중에도 빈 색이 안 보이게.
- `app-wrap`: `position:fixed; inset:0`, 테마 그라디언트 배경, `display:flex; align-items:center; justify-content:center`로 캔버스를 중앙에.
- `bg-layer`: `position:absolute; inset:0; overflow:hidden; z-index:0`. 떠다니는 blob은 **여기**(전체화면)에 둔다. 4:3 캔버스 안에 넣으면 경계에서 잘린다.
- **`stage-box`는 고정 `width:1200px; height:900px`(4:3) 설계 캔버스**다. `transform:scale(var(--fit)); transform-origin:center; overflow:hidden; background:transparent; z-index:1`. `--fit`은 JS로 `min(innerWidth/1200, innerHeight/900)`, resize마다 갱신. 캔버스가 투명이라 뒤의 전체화면 배경이 그대로 비쳐 경계가 안 생긴다.
- `stage-box` 안의 슬라이드는 `position:absolute; inset:0`. **내부 사이즈는 전부 고정 px**(캔버스 1200×900 좌표). `vh/vw` 쓰면 스케일이 이중 적용된다.
- `progress bar`·`slide number`는 캔버스가 아니라 **`app-wrap` 직속**에 `position:absolute`로 둔다(스케일 안 받게, 모니터 전체 기준).
- 슬라이드 내부 padding은 `40px 64px` 정도. `box`는 `max-height:~820px`로 두고 글자·간격을 키워 세로를 채운다.

CSS 예시:

```css
.app-wrap {
  position: fixed; inset: 0;
  display: flex; align-items: center; justify-content: center;
  /* 테마별 그라디언트는 .app-wrap.theme-light/dark/warm 로 */
}
.bg-layer { position: absolute; inset: 0; overflow: hidden; z-index: 0; pointer-events: none; }

/* 고정 1200×900 설계 캔버스 — 화면에 통째로 맞춤 */
.stage-box {
  position: relative;
  width: 1200px; height: 900px;
  overflow: hidden; background: transparent; z-index: 1;
  transform: scale(var(--fit, 1));
  transform-origin: center center;
}
.stage {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 40px 64px;
  transition: opacity .35s ease; overflow: hidden;
}
```

```jsx
// 스케일러 — resize마다 --fit 갱신 (App 안 useEffect)
useEffect(() => {
  const fit = () => document.documentElement.style.setProperty(
    "--fit", Math.min(innerWidth / 1200, innerHeight / 900));
  fit(); addEventListener("resize", fit);
  return () => removeEventListener("resize", fit);
}, []);
```

`aspect-ratio` 강제 사용은 피한다. 4:3은 위 고정 캔버스 + scale로 달성한다.

CSS 예시:

```css
:root {
  /* 기본 배경 — 파스텔 메시 그라디언트 (블루/틸/하늘) */
  --bg-start: #EFF6FF;   /* 블루 파스텔 */
  --bg-mid:   #F0FDFA;   /* 틸 파스텔 */
  --bg-end:   #F0F9FF;   /* 하늘 파스텔 */

  /* 기본 텍스트 */
  --ink:  #0F172A;
  --muted: #64748B;

  /* glass-card 기본 */
  --glass-bg:     rgba(255, 255, 255, 0.65);
  --glass-border: rgba(255, 255, 255, 0.5);
  --glass-blur:   blur(16px);

  /* 메인 액센트 = 블루 (보라 제거) */
  --accent: #3B82F6;

  /* 서브 액센트 6색 — 보라 제외, teal 추가 */
  --blue:    #3B82F6;
  --emerald: #10B981;
  --amber:   #F59E0B;
  --rose:    #F43F5E;
  --sky:     #0EA5E9;
  --teal:    #14B8A6;
}

* { box-sizing: border-box; word-break: keep-all; overflow-wrap: break-word; }

html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: linear-gradient(135deg, var(--bg-start) 0%, var(--bg-mid) 50%, var(--bg-end) 100%);
  color: var(--ink);
  font-family: 'Pretendard', -apple-system, sans-serif;
}

/* glass-card 기본 */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.04), 0 0 20px rgba(99,102,241,0.12);
}

/* spring-pop build 기본 */
.spring-pop {
  opacity: 0;
  transform: scale(0.85) translateY(16px);
  transition: opacity 0.5s ease,
              transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.spring-pop.visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* ⚠️ 클래스 이름 일치 — 가장 흔한 함정.
   React에서 className="stage"를 쓰면 CSS도 .stage 로 정의해야 한다.
   CSS만 .slide로 정의하면 padding/align이 적용되지 않아 슬라이드가 잘린다. (실제 발생)

   ⚠️ 수직 정렬은 모든 슬라이드 가운데(align-items:center)로 통일.
   타입별 분기(flex-start vs center)는 짧으면 위가 비고 길면 잘리는 모순을 만든다.
   stage는 align-items:center + .box를 다시 flex column 가운데 정렬.
   콘텐츠가 잘리면 align이 아니라 콘텐츠가 캔버스 세로(900px)를 넘은 것 —
   컴포넌트의 폰트·padding(px)을 줄여 해결한다. (vh 아님!) */
.stage {
  position: absolute; inset: 0;
  display: flex;
  align-items: center;       /* 모든 슬라이드 가운데 정렬 통일 */
  justify-content: center;
  padding: 40px 64px;        /* 캔버스 px 좌표계 — vh 금지 */
  opacity: 0; visibility: hidden;
  transition: opacity 0.35s ease;
  overflow: hidden;
}
/* box는 stage 안에서 콘텐츠를 다시 수직 가운데 정렬 */
.box {
  width: 100%;
  max-height: 820px;         /* 캔버스 900 - 상하 여유. 넘으면 잘림 */
  display: flex; flex-direction: column; justify-content: center;
}
```

App 렌더링은 단순하게 (타입별 분기 없음). 슬라이드는 고정 1200×900 `stage-box` 안에 쌓이고,
`stage-box`가 통째로 `scale(var(--fit))` 된다:

```jsx
{slides.map((s, i) => (
  Math.abs(i - idx) > 1 ? null :
  <div className="stage" key={s.id} style={{opacity: i===idx?1:0, zIndex:2}}>
    <Slide s={s} step={i===idx ? step : 0} />
  </div>
))}
```

콘텐츠가 캔버스 세로(900px, 여유 두면 ~820px)를 넘는 슬라이드(5단계 step-flow, 6행 표 등)는
폰트·padding(**px**)을 줄여 한 캔버스에 들어가게 한다. **스크롤 절대 금지**. (vh로 줄이지 않는다.)

---

## 2. 기술 스택 (고정)

사용할 것:

- React (CDN 또는 빌드 환경 모두 가능)
- Tailwind CSS (production은 빌드 방식 권장, 샘플은 CDN 허용)
- CSS variables
- CSS Transition (또는 매우 단순한 keyframes)
- SVG (직접 마크업)
- `location.hash` (URL 동기화용)
- React 커스텀 훅 (특히 `useSlideNavigation`)

사용하지 않을 것:

- Reveal.js, Swiper, fullPage.js 등 프레젠테이션 라이브러리
- Framer Motion
- React Router
- React Transition Group
- 무거운 차트 라이브러리 (Chart.js·Recharts·d3 등 — 단순 SVG로 충분)
- 무거운 애니메이션 라이브러리 (GSAP 등)

Tailwind 사용 기준:

- 단일 HTML 샘플에서는 Tailwind CDN 허용. 단 "production-ready"라고 부르지 않는다.
- 실제 프로덕션 코드에서는 Tailwind 빌드 방식 또는 CSS 변수 기반 스타일 구조를 권장한다.

---

## 3. React 컴포넌트 구조

> **주의 — 아래 §3·§4는 옛 개념 스케치다.** 실제 검증된 구현 기준은: `App` 하나가 `useNav`(키보드·좌우클릭·터치·hash·자동 순차 등장)와 `draftSlides`·내장 편집기를 보유하고, `Slide` 디스패처가 `type`별 템플릿으로 분기한다. **실제로 만들어진 템플릿 13종은 `structure-catalog.md`** 기준이다: `hero-title` · `key-message` · `icon-versus` · `vertical-step-flow` · `flow` · `four-card` · `big-question` · `animated-bar-chart` · `table-slide` · `keyword-cluster` · `section-divider` · `closing-prompt` · `video`. 아래의 `big-title`/`question`/`three-keywords`/`timeline-moment`/`image-focus` 등은 **미구현 개념**이니, 정말 새로 만들 게 아니면 13종에서 고른다. 네비게이션 훅의 실제 구현(`useNav`)과 편집기는 `runtime-and-output.md` 1·8번을 따른다.

권장 트리:

```
Presentation
├── SlideStage
│   ├── SlideFrame
│   │   └── LectureSlideTemplate (type별 분기)
│   └── ProgressBar
├── BackgroundOrnaments  (선택사항: 아주 옅은 장식)
└── PresenterNotesBridge (notes를 console·BroadcastChannel로 전달)
```

권장 컴포넌트 목록:

- `Presentation` — 슬라이드 데이터와 네비게이션 훅을 보유, 최상위 wrapper
- `SlideStage` — `fixed inset-0` 무대. 현재·이전·다음 슬라이드만 렌더링
- `SlideFrame` — 한 슬라이드의 absolute wrapper, fade/slide transition 담당
- `ProgressBar` — 얇은 진행 막대 (선택사항)
- `BigText` — 48px+ 제목·핵심 문장용
- `BuildKeyword` — build 등장 키워드 카드
- `VisualCue` — 화살표·강조 원·라인 등 시각 신호
- `LectureDiagram` — SVG 기반 단순 도식
- `KeywordBadge` — 작은 라벨 (24px+ 유지)
- `ContrastPair` — 좌/우 또는 위/아래 대조 묶음

권장 슬라이드 템플릿 (`type` 값과 1:1 대응):

- `big-title` — `BigTitleSlide`
- `key-message` — `KeyMessageSlide`
- `question` — `QuestionSlide`
- `three-keywords` — `ThreeKeywordsSlide`
- `contrast` — `ContrastSlide`
- `timeline-moment` — `TimelineMomentSlide`
- `cause-effect` — `CauseEffectSlide`
- `image-focus` — `ImageFocusSlide`
- `closing-prompt` — `ClosingPromptSlide`

사용하지 않을 템플릿:

- 긴 본문 슬라이드
- 빽빽한 표 슬라이드
- 작은 각주 슬라이드
- 논문식 참고문헌 슬라이드
- 읽기용 다단 텍스트 슬라이드

---

## 4. slides 데이터 스키마

슬라이드는 **선언형 배열**로 관리한다. 각 항목의 권장 필드:

| 필드 | 타입 | 역할 |
|---|---|---|
| `id` | string | hash sync용 고유 ID (예: `"slide-1"`) |
| `type` | string | 템플릿 유형 (`big-title`, `three-keywords`, ...) |
| `title` | string | 큰 제목 |
| `subtitle` | string | 짧은 보조 문장 (선택) |
| `keywords` | string[] | 키워드 배열 (1~3개) |
| `visual` | string | 시각화 유형 (`soft-shape`, `keyword-cluster`, `arrow-flow`, ...) |
| `builds` | string[] | 순차 등장할 키워드 또는 시각 요소 ID 배열 |
| `notes` | string | 강사가 말할 설명 (speaker notes) |

예시:

```js
const slides = [
  {
    id: "slide-1",
    type: "big-title",
    title: "역사는 질문에서 시작된다",
    subtitle: "한 시대를 움직인 힘을 읽는 법",
    visual: "soft-shape",
    builds: [],
    notes: "도입부. 학생들에게 역사는 암기가 아니라 질문이라는 점을 강조한다."
  },
  {
    id: "slide-2",
    type: "three-keywords",
    title: "조선 후기 사회 변화",
    keywords: ["상업", "도시", "농민층 변화"],
    visual: "keyword-cluster",
    builds: ["상업", "도시", "농민층 변화"],
    notes: `
      세 키워드를 순서대로 설명한다.
      상업 발달이 도시 성장과 농민층 분화로 이어지는 흐름을 말한다.
      학생들에게 "경제가 바뀌면 사람들의 삶은 어떻게 달라질까?"라고 질문한다.
    `
  }
];
```

설계 원칙:

- 한 슬라이드 데이터를 보면 **무대 위에 무엇이 어떤 순서로 등장하는지** 한눈에 보여야 한다.
- 화면에 안 보이는 내용은 모두 `notes`로 옮긴다.
- `builds`는 등장 순서대로 정확히 나열한다. 누락된 키워드는 자동으로 표시되지 않는다.
- 같은 `type`은 같은 템플릿 분기를 쓴다. 한 type이 두 가지 시각으로 갈리면 type을 둘로 쪼갠다.

---

## 5. Presentation 컨테이너의 책임

`Presentation` 컴포넌트가 보유해야 할 것:

- 슬라이드 배열 (`slides`)
- `useSlideNavigation` 훅 — 현재 인덱스·step·direction·전환 락을 모두 관리
- hash 동기화 (mount 시 `location.hash` 읽어 인덱스 설정, 인덱스 변경 시 hash 쓰기)
- 키보드·터치 이벤트 바인딩
- speaker notes를 console (또는 BroadcastChannel)로 전달하는 effect

`Presentation`은 슬라이드별 시각 디테일을 직접 그리지 않는다. 그 일은 type별 템플릿이 담당한다. 이 분리가 깨지면 슬라이드 수가 많아질 때 빠르게 무너진다.
