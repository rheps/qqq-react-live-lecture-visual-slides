# Design & Readability

이 문서는 Modern Glassy Light 테마, glass-card CSS, spring-pop 애니메이션, 폰트, 가독성 규칙, 텍스트 밀도 규칙을 다룬다.

> **함께 보기 — `references/motion-theme-upgrades.md` (충돌 시 우선)**: 아래 내용 중 일부는 거기서 업데이트된다. ① 3-g "등장은 spring-pop 하나로 통일" → **요소별 모션 다양화**(1번). ② 3-e/3-f 다크 테마·"blob 더 진하게" → **다크=진짜 어둡게 + 밤하늘**(6번). ③ 3-b `hl()` 강조색 → 다크에서 묻히면 **강조색 CSS 변수를 `.theme-dark`에서 밝게 override**(4번). ④ Eyebrow는 **밑줄형**(5번). ⑤ 라이트 글래스 **투명도 옵션**(7번).

---

## 1. 기본 테마 — Modern Glassy Light (블루 중심, 보라 제외)

**라이트 배경 위에 반투명 유리 카드.** 메인 색은 **블루(#3B82F6)** 와
하늘(#0EA5E9)·틸(#14B8A6) 중심. 보라(violet/indigo/plum)는 사용하지 않는다.

| 용도 | 값 |
|---|---|
| 기본 배경 | 블루/틸 파스텔 메시 그라디언트 (`linear-gradient(135deg, #EFF6FF 0%, #F0FDFA 50%, #F0F9FF 100%)`) |
| 기본 텍스트 | `#0F172A` (딥 슬레이트) |
| 포인트 컬러 | 블루 `#3B82F6` (메인), 하늘 `#0EA5E9`, 틸 `#14B8A6` |
| glass-card 배경 | `rgba(255, 255, 255, 0.65)` + `backdrop-filter: blur(16px)` |
| glass-card 테두리 | `1px solid rgba(255, 255, 255, 0.5)` |
| glass-card 그림자 | `0 8px 32px rgba(0,0,0,0.04), 0 0 20px rgba(59,130,246,0.12)` |

### 서브 액센트 팔레트 (보라 완전 제외)

| 이름 | 전경색 | 글로우 색 | 용도 예시 |
|---|---|---|---|
| blue | `#3B82F6` | `rgba(59,130,246,0.20)` | 메인 액센트, 진행바, 핵심 카드 |
| emerald | `#10B981` | `rgba(16,185,129,0.18)` | 긍정·성장, 2번 항목 |
| amber | `#F59E0B` | `rgba(245,158,11,0.18)` | 주의·주목, 3번 항목 |
| rose | `#F43F5E` | `rgba(244,63,94,0.18)` | 대조·경고, 4번 항목 |
| sky | `#0EA5E9` | `rgba(14,165,233,0.18)` | 정보성, 5번 항목 |
| teal | `#14B8A6` | `rgba(20,184,166,0.18)` | 보조 액센트, 6번 항목 |

⚠️ **PALETTE는 반드시 hex로**. CSS 변수(`var(--xxx)`)를 PALETTE에 두면
`${c.fg}dd` 같은 알파 hex 보간이 `"var(--xxx)dd"`라는 잘못된 CSS가 되어
gradient/border가 깨지고, 강조 칩에 흰 글자가 보이지 않는 사고가 난다.

```js
const PALETTE = [
  { fg: "#3B82F6", glow: "rgba(59,130,246,0.20)", bg: "rgba(239,246,255,0.85)" },  // blue
  { fg: "#10B981", glow: "rgba(16,185,129,0.18)", bg: "rgba(236,253,245,0.85)" },  // emerald
  { fg: "#F59E0B", glow: "rgba(245,158,11,0.18)", bg: "rgba(255,251,235,0.85)" },  // amber
  { fg: "#F43F5E", glow: "rgba(244,63,94,0.18)",  bg: "rgba(255,241,242,0.85)" },  // rose
  { fg: "#0EA5E9", glow: "rgba(14,165,233,0.18)", bg: "rgba(240,249,255,0.85)" },  // sky
  { fg: "#14B8A6", glow: "rgba(20,184,166,0.18)", bg: "rgba(240,253,250,0.85)" },  // teal
];
const col = i => PALETTE[i % PALETTE.length];
```

배경(`--bg` 그라디언트)과 큰 제목(`--ink: #0F172A`)은 변경하지 않는다.

### 사용하지 않을 색상·스타일

- 진한 다크 배경 (검정·짙은 네이비 등) — 라이트 테마 유지
- 불투명 블랙 카드
- 강한 네온 (형광 그린, 형광 핑크 등)
- 골드 포인트
- 과한 그라디언트 (배경 전체에 두 가지 진한 색이 흐르는 패턴)
- 의미 없는 장식 이미지
- 작은 회색 캡션 (작은 글씨 자체 금지)

---

## 2. Glass-Card CSS

```css
/* 기본 glass-card */
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04),
              0 0 20px rgba(99, 102, 241, 0.12);
}

/* 색상별 glow 변형 — 파스텔 빛 번짐 */
.glass-card-indigo { box-shadow: 0 8px 32px rgba(0,0,0,0.04), 0 0 24px rgba(99,102,241,0.18); }
.glass-card-emerald { box-shadow: 0 8px 32px rgba(0,0,0,0.04), 0 0 24px rgba(16,185,129,0.18); }
.glass-card-amber  { box-shadow: 0 8px 32px rgba(0,0,0,0.04), 0 0 24px rgba(245,158,11,0.18); }
.glass-card-rose   { box-shadow: 0 8px 32px rgba(0,0,0,0.04), 0 0 24px rgba(244,63,94,0.18); }
.glass-card-sky    { box-shadow: 0 8px 32px rgba(0,0,0,0.04), 0 0 24px rgba(14,165,233,0.18); }
.glass-card-violet { box-shadow: 0 8px 32px rgba(0,0,0,0.04), 0 0 24px rgba(139,92,246,0.18); }
```

inline style에서는 다음과 같이 동적으로 적용한다:

```jsx
const c = col(i);
<div style={{
  background: c.bg,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.5)",
  borderRadius: 16,
  boxShadow: `0 8px 32px rgba(0,0,0,0.04), 0 0 24px ${c.glow}`,
  borderTop: `3px solid ${c.fg}`,
}}>
```

---

## 3. Spring-Pop 애니메이션

기본 등장 애니메이션. 정적인 opacity fade-in 대신 **탄력 있게 튕기며 등장**하는 느낌을 준다.

```css
/* Build 항목 기본 상태 */
.spring-pop {
  opacity: 0;
  transform: scale(0.85) translateY(16px);
  transition:
    opacity 0.5s ease,
    transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 등장 상태 */
.spring-pop.visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}
```

`cubic-bezier(0.175, 0.885, 0.32, 1.275)` — overshoot이 살짝 있는 spring 곡선. 너무 튀지 않으면서도 탄력감이 있다.

순차 등장 시 `transition-delay`로 간격을 준다:

```css
.spring-pop:nth-child(1) { transition-delay: 0s; }
.spring-pop:nth-child(2) { transition-delay: 0.08s; }
.spring-pop:nth-child(3) { transition-delay: 0.16s; }
```

React에서 build 토글:

```jsx
<div className={`spring-pop ${step > i ? 'visible' : ''}`}>
  {keyword}
</div>
```

### 기타 애니메이션 패턴

| 이름 | 용도 | 구현 |
|---|---|---|
| spring-pop | build 등장 기본 | `scale(0.85) + translateY(16px)` → cubic-bezier |
| glow-pulse | 강조 요소 주목 | `box-shadow` keyframe으로 glow 크기 반복 변화 |
| bar-grow | 바 차트 성장 | `height: 0` → `height: X%`, `transition: height 0.8s ease` |
| line-draw | SVG 연결선 그리기 | `stroke-dashoffset` 전환 |
| fade-up | 보조 텍스트 | `opacity: 0 + translateY(8px)` → ease (spring 없이) |

### 사용하지 않을 애니메이션

- spin (회전)
- 강한 parallax
- flashy particle effect
- 매우 빠른 flash/flicker
- 전체 배경이 흔들리는 shake

---

## 3-b. 그라디언트 텍스트 (필수: fallback color)

큰 글자(VS 마크, ?, 강조 부제)에 인디고→바이올렛 같은 그라디언트를 입힐 때는
**반드시 `color`를 먼저 선언**해서 fallback을 둔다.

```jsx
// ✅ 올바른 패턴 (메인은 블루 — 보라/인디고/바이올렛 금지)
<div style={{
  color: "var(--blue)",                                     /* fallback */
  background: "linear-gradient(135deg, var(--blue), var(--sky))",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
}}>?</div>
```

```jsx
// ❌ 위험 — fallback 없으면 webkit 미지원/렌더 타이밍에서 흰색·투명으로 사라짐
<div style={{
  background: "linear-gradient(...)",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
}}>?</div>
```

이유: `WebkitTextFillColor: transparent`는 background가 텍스트에 clip 되어야만
색이 보인다. background-clip이 실패하면 텍스트는 투명으로 남고 글자가 사라진다.
`color`를 먼저 두면 그 자리에 단색이 보이므로 최소한 글자는 읽힌다.

### 인라인 강조 마커 + 줄바꿈 `hl()` — 모든 텍스트 필드에 적용한다

문장 안 단어 강조는 마커 3색으로 한다: `*단어*`=블루→하늘 그라디언트(핵심·지향), `~단어~`=로즈/빨강(대비·지난 상태), `_단어_`=에메랄드/초록(긍정·강조2). 색을 더 늘리려면 안 겹치는 구분자(예: `=단어=`)를 같은 방식으로 추가한다.
**모든 템플릿의 모든 텍스트 렌더 지점**(제목·부제·문장·질문·인용·카드 라벨/설명·좌우대조 항목·표 머리글/칸·키워드 칩·캡션·목차 단계 라벨/부제·차트 막대 라벨·Eyebrow)을 `hl()`로 감싼다. 그래야 사용자가 편집기에서 **어느 페이지 어느 칸을 고치든 마커가 먹는다.** (마커 없는 텍스트는 그대로 렌더되므로 전 필드에 적용해도 부작용 없다.)

```jsx
function hl(text){
  // \n → <br/> : 편집기에서 Enter(줄바꿈)가 어느 칸에서나 화면에 보이게 한다.
  // 제목·카드·표처럼 white-space:pre-line 없는 칸도 포함 — 모든 텍스트가 hl을 통과하므로 한 곳만 고치면 전 필드 적용.
  const nl=(s,k)=>String(s).split("\n").map((seg,j)=>j?[<br key={k+"b"+j}/>,seg]:seg);
  return String(text).split(/(\*[^*]+\*|~[^~]+~|_[^_]+_)/).map((p,i)=>{
    if(p.startsWith("*")&&p.endsWith("*"))         // 핵심·지향: 블루→하늘 그라디언트
      return <span key={i} style={{color:"var(--blue)",   /* fallback 먼저 */
        background:"linear-gradient(135deg,var(--blue),var(--sky))",
        WebkitBackgroundClip:"text",backgroundClip:"text",
        WebkitTextFillColor:"transparent",fontWeight:900}}>{nl(p.slice(1,-1),i+"")}</span>;
    if(p.startsWith("~")&&p.endsWith("~"))          // 대비·지난 상태: 로즈(빨강)
      return <span key={i} style={{color:"var(--rose)",
        WebkitTextFillColor:"var(--rose)",fontWeight:900}}>{nl(p.slice(1,-1),i+"")}</span>;
    if(p.startsWith("_")&&p.endsWith("_"))          // 긍정·강조2: 에메랄드(초록)
      return <span key={i} style={{color:"var(--emerald)",
        WebkitTextFillColor:"var(--emerald)",fontWeight:900}}>{nl(p.slice(1,-1),i+"")}</span>;
    return <React.Fragment key={i}>{nl(p,i+"")}</React.Fragment>;
  });
}
// 적용 예: {hl(s.title)} · {hl(s.sub)} · {hl(st.label)} · {hl(it)} · {hl(cell)} · {hl(kw)} · <Eyebrow>{hl(text)}</Eyebrow>
```

- **로즈 span은 `WebkitTextFillColor`도 로즈로 명시**한다. 그라디언트(투명채움) 부모 안에 들어가면 `~로즈~`가 `WebkitTextFillColor:transparent`를 상속받아 글자가 사라진다(실제 발생). 블루 span은 자기 그라디언트 + `color` fallback이 있어 어디서든 보인다.
- 새 템플릿을 추가할 때도 텍스트 렌더는 반드시 `hl()`로 감싼다.
- **줄바꿈은 `hl()`이 `\n`→`<br/>`로 처리**한다. 칸마다 `white-space:pre-line`에 의존하지 말 것 — 제목·카드·표 등 pre-line 없는 칸에선 편집기에서 Enter를 쳐도 줄바꿈이 안 보인다(실제 사용자 피드백). `hl` 한 곳에서 변환하므로 어느 칸에서나 Enter가 줄바꿈으로 먹는다. (마커 안의 `\n`도 처리, `<br>`엔 `key` 부여 — React 키 경고 방지.)

---

## 3-c. 동적 바 차트 — 작은 값 처리

`animated-bar-chart`에서 가장 큰 값과 가장 작은 값이 100배 이상 차이나면
작은 막대 안에 숫자 라벨이 들어가지 않는다. 작은 막대 안에 흰 글자를 넣으면
글자가 잘려서 안 보인다.

해결: **숫자 라벨은 막대 위에 띄운 chip 형태**로 출력한다.

```jsx
<div style={{position:"relative", height: pct /* 막대 */}}>
  <div style={{position:"absolute", top:-44, left:0, right:0, textAlign:"center"}}>
    <span style={{
      background: "rgba(255,255,255,0.85)",
      color: c.fg,                       /* 파스텔 글자 + 흰 chip */
      padding: "4px 12px", borderRadius: 8,
      border: `1px solid ${c.fg}55`,
      boxShadow: `0 4px 12px ${c.glow}`,
    }}>
      {value.toLocaleString()}{unit}
    </span>
  </div>
</div>
```

막대 자체의 `min-height`도 작게나마 두어(예: `minHeight: 6`) 0px가 되지 않도록 한다.

---

## 3-d. 이모지 적극 활용 (Windows 기본 / 컬러 이모지)

이 테마는 이모지를 적극 활용해 시각 변주를 준다. 4D 카드 옆에 🔍🎯🎨⚖️,
5부 step-flow 옆에 🧭🌊🔎⚙️🚀, hero/section/key-message 위에 큰 이모지 한 개.

```css
body {
  font-family: "Pretendard", "Segoe UI Emoji", "Apple Color Emoji",
    "Noto Color Emoji", sans-serif;
}

/* 이모지 utility 클래스 */
.emoji-xl { font-size: clamp(60px, 9vh, 120px); line-height: 1;
  display: inline-block;
  font-family: "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif; }
.emoji-lg { font-size: clamp(40px, 5.5vh, 72px); /* same family */ }
.emoji-md { font-size: clamp(28px, 3.5vh, 44px); /* same family */ }
```

이모지는 컴포넌트의 `data.emoji` 필드로 받아 옵션 처리:

```jsx
{s.emoji && <span className="emoji-xl anim-breathe">{s.emoji}</span>}
```

큰 이모지는 항상 `anim-breathe` 또는 `anim-wave` / `anim-float` 같은 지속
애니메이션을 입혀 살아 움직이게 한다. 정적인 이모지는 어색하다.

---

## 3-e. 다중 테마 (light / dark / warm)

같은 슬라이드 시스템 안에서 슬라이드별로 테마를 다르게 가져갈 수 있다.
중요한 메시지·section divider·핵심 질문에 다크 테마를 쓰면 임팩트가 폭증한다.

```css
.app-wrap { transition: background 0.8s ease; }
.app-wrap.theme-light {
  background: linear-gradient(135deg, #EFF6FF 0%, #F0FDFA 50%, #F0F9FF 100%);
}
/* 다크 = 거의 순수 블랙 (보라 그라디언트 금지) */
.app-wrap.theme-dark {
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #050505 100%);
  color: #F1F5F9;
}
.app-wrap.theme-warm {
  background: linear-gradient(135deg, #FFF1F2 0%, #FFF7ED 50%, #FEF3C7 100%);
}

/* 다크 테마에서 자동 색상 반전 — 액센트는 블루/하늘 (보라 금지) */
.theme-dark .t-hero, .theme-dark .t-title { color: #FFFFFF; }
.theme-dark .t-sub, .theme-dark .t-sm { color: #E2E8F0; }
.theme-dark .glass-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 32px rgba(59,130,246,0.18);
}
```

App에서 현재 슬라이드의 `theme` 값을 읽어 동적 적용:

```jsx
const theme = slides[idx]?.theme || "light";
<div className={"app-wrap theme-" + theme}>
```

배경 전환은 `transition: background 0.8s ease`로 부드럽게.

다크 슬라이드 권장 위치:
- section-divider 중 무거운 주제 (위기, 한계, 결론)
- key-message 중 가장 강조하고 싶은 한 장
- big-question 중 결정적 질문
- 너무 자주 쓰면 효과 떨어진다. 30장 슬라이드 중 3~5장 정도.

---

## 3-f. 떠다니는 배경 blob (지속 애니메이션)

stage-box 내부에 큰 radial-gradient blob을 떠다니게 한다. 슬라이드가
정적이지 않고 항상 살아 움직이는 느낌을 준다.

```css
.bg-blob { position: absolute; pointer-events: none; z-index: 0;
  border-radius: 50%; filter: blur(40px); }
.bg-blob-1 { top: -15vh; left: -10vw; width: 55vh; height: 55vh;
  background: radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%);
  animation: float1 18s ease-in-out infinite; }
.bg-blob-2 { bottom: -18vh; right: -8vw; width: 60vh; height: 60vh;
  background: radial-gradient(circle, rgba(244,63,94,0.22) 0%, transparent 70%);
  animation: float2 22s ease-in-out infinite; }

@keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(40px,30px) scale(1.05); } }
@keyframes float2 { 0%,100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(-40px,-30px) scale(1.08); } }
```

테마에 따라 blob 색도 자동 변경:

```css
.theme-dark .bg-blob-1 {
  background: radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 70%);
}
```

다크 테마에서는 blob이 더 진하게 빛난다.

---

## 3-g. 등장 애니메이션 — spring-pop 하나로 통일 (잘림 방지)

⚠️ **중요**: `translateX(-50px)` / `translateX(50px)` 같은 큰 위치 이동
등장 애니메이션은 **`.stage`의 `overflow:hidden`에 잘려서 카드가 화면 밖으로
들어왔다가 보이게 된다.** 사용자에겐 "카드가 좌우로 잘린 것"처럼 보인다.

따라서 등장 애니메이션은 **제자리에서 scale만 변하는 spring-pop 하나**로 통일하고,
다양성은 `transition-delay`와 지속 애니메이션(breathe / glow-breath)으로 만든다.

```css
.spring-pop { opacity:0; transform: scale(0.85) translateY(12px);
  transition: opacity .45s ease,
              transform .55s cubic-bezier(0.175,0.885,0.32,1.275); }
.spring-pop.visible { opacity:1; transform: scale(1) translateY(0); }
```

사용 패턴 — 모두 spring-pop, delay만 다르게:

```jsx
{/* IconVersus: 왼쪽 0s, 오른쪽 0.15s */}
<Side delay={0}/>    <Side delay={0.15}/>

{/* FourCard: 카드별 i*0.1s */}
style={{transitionDelay: `${i*0.1}s`}}

{/* VerticalStepFlow: 각 row i*0.08s */}
style={{transitionDelay: `${i*0.08}s`}}

{/* KeywordCluster: 칩별 i*0.06s */}
style={{transitionDelay: `${i*0.06}s`}}
```

다양성은 지속 애니메이션으로:
- 각 카드 `glow-breath`에 인덱스별 delay (`i*0.3s`)
- 각 이모지 `anim-wave` / `anim-float`에 인덱스별 delay
- 이렇게 하면 모두 같은 spring-pop으로 등장해도 등장 후 호흡 패턴이 비대칭이라 살아 있는 느낌이 난다.

## 3-h. 지속 애니메이션 (등장 후에도 살아 있음)

등장만 하고 정지된 화면은 죽어 보인다. 강조 요소는 항상 살아 있어야 한다.

```css
@keyframes breathe    { 0%,100% { transform: scale(1); }
                        50%      { transform: scale(1.04); } }
@keyframes float-y    { 0%,100% { transform: translateY(0); }
                        50%      { transform: translateY(-8px); } }
@keyframes wave-rot   { 0%,100% { transform: rotate(-4deg); }
                        50%      { transform: rotate(4deg); } }
@keyframes glow-breath{ 0%,100% { filter: drop-shadow(0 0 16px rgba(99,102,241,0.4)); }
                        50%      { filter: drop-shadow(0 0 36px rgba(139,92,246,0.65)); } }
@keyframes pulse-ring { 0%      { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
                        100%    { box-shadow: 0 0 0 20px rgba(99,102,241,0); } }

.anim-breathe    { animation: breathe     3s   ease-in-out infinite; display: inline-block; }
.anim-float      { animation: float-y     4.5s ease-in-out infinite; display: inline-block; }
.anim-wave       { animation: wave-rot    5s   ease-in-out infinite; display: inline-block;
  transform-origin: 50% 80%; }
.anim-glow-breath{ animation: glow-breath 3.5s ease-in-out infinite; }
.anim-pulse-ring { animation: pulse-ring  2s   ease-out      infinite; }
```

권장 적용:
- 큰 이모지(emoji-xl): `anim-breathe` 또는 `anim-wave` 또는 `anim-float`
- BigQuestion의 `?`: `anim-breathe` + glow filter
- glass-card 활성화 후: `glow-breath` (인덱스별 delay로 호흡 패턴 차이)
- ClosingPrompt의 인용문 박스: `anim-glow-breath`
- Section divider의 part badge: `anim-pulse-ring`

같은 슬라이드 안에서 여러 요소가 각자 다른 delay로 호흡하면 화면이 살아 숨쉰다:

```jsx
{cards.map((card, i) => (
  <div style={{ animation: `glow-breath 3.5s ease-in-out infinite ${i*0.3}s` }}>
    ...
  </div>
))}
```

---

## 4. 폰트

메인 폰트는 **Pretendard**로 통일. 제목·본문·라벨 모두 Pretendard.

CDN:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
```

### 굵기 기준 (강의 가독성 최우선)

| 요소 | weight | 비고 |
|---|---|---|
| 메인 제목 (hero, title) | **900** | 최대한 두껍게 |
| 핵심 문장 (key-message) | **800** | |
| 카드 키워드·라벨 | **700** | |
| 본문·설명 (t-sm) | **600** | 400·500 금지 |
| 보조 텍스트 (sub, muted) | **500** | 400 금지 |

- 제목: `letter-spacing: -0.02em ~ -0.03em`
- 전역: `* { word-break: keep-all; overflow-wrap: break-word; }`

---

## 5. 절대 가독성 규칙

우선순위:

```
가독성 > 핵심 메시지 > 시각화 > 애니메이션 > 장식
```

메인 화면 visible text 최소 크기 (4:3 캔버스 기준):

| 요소 | 최소 크기 | vh 기준 |
|---|---:|---|
| 메인 제목 (hero) | 56px | 7vh+ |
| 슬라이드 제목 | 44px | 5.5vh+ |
| 핵심 문장 | 36px | 4.5vh+ |
| 카드·항목 본문 | 28px | 3vh+ |
| 라벨·서브텍스트 | 24px | 2.8vh+ |
| **모든 visible text** | **24px** | **2.5vh** |

절대 금지:

- 메인 화면에 24px 미만 글자
- 내용을 넣기 위해 글자 크기를 줄이는 것
- 공간을 만들기 위해 줄간격을 줄이는 것

### 간격 기준

| 위치 | 최소값 |
|---|---|
| 제목 ↔ 첫 콘텐츠 | 20px |
| 카드/항목 사이 gap | 14px |
| 카드 내부 padding | 20px 이상 |
| 텍스트 line-height | 1.55 이상 |
| 메시지바 위 margin | 20px 이상 |

> 글씨를 줄이지 말고, 슬라이드를 늘린다.

---

## 6. 텍스트 밀도 규칙

한 슬라이드 = 한 메시지.

허용되는 구성 중 1~2개 조합:

- 큰 제목 1개
- 핵심 문장 1개
- 짧은 키워드 최대 3개
- 단순한 도표 1개 (glass-card 또는 bar chart)
- 질문 1개
- 대조 구조 1개

피해야 할 구성:

- 긴 문단 (3줄 초과)
- 빽빽한 bullet list (4개 초과)
- 작은 캡션·각주
- 복잡한 표 (4행 4열 초과)
- 청중이 30초 이상 읽어야 하는 슬라이드

---

## 7. 왜 라이트 배경인가

글래스모피즘은 **라이트 배경일 때** 유리 질감이 살아난다. 다크 배경에서는 카드의 반투명함과 blur가 잘 보이지 않아 glassmorphism의 효과가 사라진다. 파스텔 메시 그라디언트 + 흰색 반투명 카드 + 파스텔 glow 조합이 이 테마의 핵심이다.
