# motion-system.md — Framer Motion 모션 시스템 레퍼런스

이 파일은 강의 슬라이드 덱을 만들 때 복사해 바로 쓸 수 있는 Framer Motion 적용 기준이다.

> **함께 보기 — `references/motion-theme-upgrades.md`**: 아래 3절 모션 배정표를 확장하는 **요소별 모션 다양화**(한 종류 띠용 반복 탈피), **Magic-Move 모핑(`layoutId`)**, **연결선 draw-on(`pathLength`)**이 거기 정리돼 있다. 모핑을 쓰면 슬라이드 전환은 변형 없는 크로스페이드여야 한다(그 문서 2번).

---

## 1. 로더 한 줄

FM CDN은 **`react-dom` UMD 뒤, `@babel/standalone` 앞**에 반드시 이 순서로 싣는다.

```html
<!-- react, react-dom UMD 먼저 -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Framer Motion — react-dom 뒤, babel 앞 -->
<script src="https://unpkg.com/framer-motion@11/dist/framer-motion.js"></script>

<!-- Babel은 항상 마지막 -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

---

## 2. `SlideMotion` 프리셋 + `MotionItem` 래퍼 전체 코드

덱 최상단(컴포넌트 정의 전)에 그대로 붙여넣는다.

```jsx
const FM = window.Motion || {};
const M_OK = !!(FM && FM.motion);

const SlideMotion = {
  K: 2.2,
  spring: (delay=0, stiffness=280, damping=17)=>({type:"spring",stiffness,damping,delay}),
  listV: { hidden:{}, show:{ transition:{ staggerChildren:.13, delayChildren:.1 } } },
  enter: {
    title:   { hidden:{opacity:0,y:16,filter:"blur(9px)"}, show:{opacity:1,y:0,filter:"blur(0px)",transition:{duration:.65,ease:[.22,1,.36,1]}} },
    item:    { hidden:{opacity:0,y:20,scale:.85}, show:{opacity:1,y:0,scale:1,transition:{type:"spring",stiffness:280,damping:17}} },
    card:    { hidden:{opacity:0,y:24,scale:.8}, show:{opacity:1,y:0,scale:1,transition:{type:"spring",stiffness:260,damping:16}} },
    chip:    { hidden:{opacity:0,scale:0}, show:{opacity:1,scale:1,transition:{type:"spring",stiffness:400,damping:16}} },
    tableRow:{ hidden:{opacity:0,scale:.96}, show:{opacity:1,scale:1,transition:{type:"spring",stiffness:260,damping:20}} },
    fromLeft:{ hidden:{opacity:0,x:-160}, show:{opacity:1,x:0,transition:{type:"spring",stiffness:220,damping:22}} },
    fromRight:{hidden:{opacity:0,x:160}, show:{opacity:1,x:0,transition:{type:"spring",stiffness:220,damping:22}} },
    divider: { hidden:{opacity:0,scale:1.4,letterSpacing:"14px",filter:"blur(8px)"}, show:{opacity:1,scale:1,letterSpacing:"2px",filter:"blur(0px)",transition:{duration:.8,ease:[.22,1,.36,1]}} },
    quote:   { hidden:{clipPath:"inset(0 100% 0 0)",opacity:0}, show:{clipPath:"inset(0 0% 0 0)",opacity:1,transition:{duration:.85,ease:[.65,0,.35,1]}} },
  },
  idle: {
    title:(k=2.2)=>({ animate:{ y:[0,-2*k,0] }, transition:{repeat:Infinity,repeatType:"mirror",ease:"easeInOut",duration:3.4} }),
    card:(k=2.2,i=0)=>({ animate:{ scale:[1,1+0.012*k,1] }, transition:{repeat:Infinity,repeatType:"mirror",ease:"easeInOut",duration:3.0+i*0.7,delay:i*0.5} }),
    stat:(k=2.2)=>({ animate:{ scale:[1,1+0.012*k,1] }, transition:{repeat:Infinity,repeatType:"mirror",ease:"easeInOut",duration:4.0} }),
    emoji:(k=2.2)=>({ animate:{ y:[0,-6*k,0], rotate:[0,3*k,0,-3*k,0] }, transition:{ y:{repeat:Infinity,repeatType:"mirror",ease:"easeInOut",duration:2.4}, rotate:{repeat:Infinity,repeatType:"mirror",ease:"easeInOut",duration:5} } }),
  },
};

function MotionItem({enter, idle, i=0, as="div", className, style, children, ...rest}){
  if(!M_OK){ return React.createElement(as, {className, style, ...rest}, children); }
  const Outer = FM.motion[as] || FM.motion.div;
  const ev = enter ? SlideMotion.enter[enter] : null;
  const outerProps = ev ? { variants: ev, initial:"hidden", animate:"show" } : {};
  if(!idle){
    return <Outer className={className} style={style} {...outerProps} {...rest}>{children}</Outer>;
  }
  const idleCfg = SlideMotion.idle[idle](SlideMotion.K, i);
  const inline = (as === "span");
  const Inner = inline ? FM.motion.span : FM.motion.div;
  const clipText = style && (style.WebkitBackgroundClip==="text" || style.backgroundClip==="text");
  const innerStyle = {
    ...(inline ? {display:"inline-block"} : {width:"100%",height:"100%"}),
    ...(clipText ? {background:style.background, WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:style.WebkitTextFillColor||"transparent"} : {})
  };
  return (
    <Outer className={className} style={style} {...outerProps} {...rest}>
      <Inner animate={idleCfg.animate} transition={idleCfg.transition} style={innerStyle}>
        {children}
      </Inner>
    </Outer>
  );
}
```

---

## 3. 요소 → 모션 배정표

| 요소 / 템플릿 | enter 프리셋 | idle 프리셋 | 비고 |
|---|---|---|---|
| hero-title / section-divider | `title` / `divider` | **없음** | 글씨 — enter만, idle 금지 |
| key-message / 본문 문장 | `title` / `item` | **없음** | 글씨 — enter만, idle 금지 |
| closing-prompt / 인용 | `quote` | **없음** | 글씨 — enter만, idle 금지 |
| four-card / keyword-cluster | `card` | `card`(인덱스별 delay) | 카드·비텍스트 — idle 유지 |
| 키워드 칩 / 배지 | `chip` | 필요 시 `card` | 비텍스트 요소 |
| 통계 / 큰 숫자 | `item` | `stat` | 숫자 자체는 비텍스트 역할 |
| 이모지 | `chip` | `emoji` | 항상 idle emoji |
| icon-versus / 비교 | `fromLeft` / `fromRight` | `card` | 가로 이동 허용(캔버스 overflow:visible) |
| vertical-step-flow / flow | `item` / `card` | 선택 | 연결선은 pathLength 또는 scaleY |
| table-slide | listV + `tableRow` | **없음** | 표 행은 enter만 |
| animated-bar-chart 막대 | — | — | **기존 CSS height grow 유지**(FM scaleY 전환 금지 — 라벨 찌그러짐·reveal 타이밍 위험) |
| 강조 단어(hl) | — | — | **그대로 둠**(마커 sweep 금지, 회귀 위험) |
| 슬라이드 전환 | AnimatePresence `mode="wait"` + `key=idx` | — | step 내부 전환 제외 |

> **핵심 규칙**: 읽는 글씨(제목·메시지·질문·본문·인용)에는 idle을 절대 주지 않는다. idle은 이모지·카드·기호·통계처럼 시각적으로 보는 요소에만.

---

## 4. 캔버스 변경

FM 가로 이동(`x`)이 잘리지 않도록 캔버스 overflow 정책을 바꾼다.

```css
/* 변경 전 (구버전) */
.stage-box { overflow: hidden; }

/* 변경 후 (FM 적용) */
.stage-box { overflow: visible; }

/* 잘림은 viewport 레벨에서만 처리 */
#root, html, body { overflow: hidden; }

/* blob은 별도 viewport 레이어에서 클립 — 4:3 밖으로 새지 않음 */
.bg-layer { position: absolute; inset: 0; overflow: hidden; }
```

이 구조 덕분에 `fromLeft`/`fromRight` 가로 슬라이드 인이 캔버스 경계에서 잘리지 않고, blob은 여전히 배경 레이어 안에서만 움직인다.

---

## 5. 편집기 내보내기 보존 주의

`buildEditedHtml` 함수는 `src` 속성이 있는 `<script>` 태그를 그대로 보존한다. 따라서 FM CDN `<script src="...framer-motion.js">` 태그는 편집기로 저장/내보낸 HTML에도 남아, 재오픈 시 모션이 그대로 살아있다.

- slides 데이터 배열과 편집기 로직(`buildEditedHtml` 등)은 FM 적용과 무관하므로 건드리지 않는다.
- 편집기 저장 시 Babel 주입 컴파일 스크립트만 제거하고, CDN script src는 유지된다.

---

## 6. 주의 / 위험

| 항목 | 내용 |
|---|---|
| React 버전 | FM UMD는 React 19부터 지원 중단 예정. 현재 React 18 환경에서는 정상 동작. |
| 오프라인 fallback | `M_OK` 가드가 없으면 오프라인 시 `FM.motion.div` 접근에서 흰 화면 발생. `MotionItem`의 `if(!M_OK)` 분기가 반드시 있어야 함. |
| 글씨 idle 금지 | 제목·본문·인용 등 읽는 글씨에 idle을 걸면 강의 중 가독성을 심각하게 해친다. 사용자 확정 규칙. |
| FM + CSS 중복 | 같은 요소에 FM variants와 옛 CSS `spring-pop` 클래스를 동시에 두면 충돌·snap 발생. FM 등장을 주면 해당 요소의 CSS 등장 클래스는 반드시 제거. |
| `listV` 사용 시 | `listV`는 부모에 두고 자식에 개별 enter variants를 둔다. 부모에 `initial="hidden" animate="show"`를 주면 stagger가 자동 전파됨. |
