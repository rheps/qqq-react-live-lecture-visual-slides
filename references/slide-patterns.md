# Slide Patterns (Splitting / Teaching Patterns / Visuals / Animations / Builds)

이 문서는 콘텐츠 분할 규칙, 시각적 교수 패턴, 시각화 규칙, 애니메이션 규칙, build 효과 규칙, 콘텐츠 변환 예시를 다룬다. 첨부 md의 8·13·14·15·16·24번 섹션에 해당한다.

---

## 1. 슬라이드 분할 규칙

긴 내용이 들어오면 다음 순서로 처리한다.

```
긴 설명
   ↓
핵심 흐름 추출
   ↓
여러 장의 큰 글씨 슬라이드로 분할
   ↓
세부 설명은 speaker notes로 이동
```

절대 하지 말아야 할 것:

- 한 장에 다 넣기
- 글씨 줄이기
- 줄 간격 줄이기
- 작은 캡션으로 보충하기
- 표로 압축하기

권장 방식:

- **슬라이드 수를 늘린다.**
- 한 장에 한 메시지만 둔다.
- 강사가 말할 내용은 `notes`에 넣는다.
- 화면에는 키워드·질문·도식만 남긴다.

### 변환 예시

원문:
> 조선 후기에는 상품 화폐 경제가 발달하면서 도시가 성장하고, 농민층이 분화되었으며, 일부 농민은 부농으로 성장했지만 다수 농민은 몰락하였다.

나쁜 발표 슬라이드:
```
조선 후기에는 상품 화폐 경제가 발달하면서 도시가 성장하고, 농민층이 분화되었으며, 일부 농민은 부농으로 성장했지만 다수 농민은 몰락하였다.
```
(한 슬라이드 안에 문장 전체. 글씨가 작아지고, 청중은 강사의 말을 놓치고 화면을 읽는다.)

좋은 발표 슬라이드 분할:
```
슬라이드 1  — 조선 후기, 경제가 움직이기 시작했다  (big-title)
슬라이드 2  — 상품 화폐 경제                       (big-keyword)
슬라이드 3  — 도시가 커졌다                        (key-message + 단순 SVG)
슬라이드 4  — 농민층은 갈라졌다                    (key-message + 화살표)
슬라이드 5  — 부농 vs 몰락 농민                    (contrast)
```

자세한 설명은 슬라이드 1~5의 `notes` 필드에 분산해서 넣는다. 강사는 말로 설명하고, 화면은 시선을 안내한다.

---

## 2. 시각적 교수 패턴 (Teaching Patterns)

발표형에서는 시각화가 단순하고 커야 한다. 다음 패턴을 적극적으로 사용한다.

| 패턴 | 사용 목적 |
|---|---|
| Big Question | 수업 도입, 생각 열기 |
| Big Keyword | 핵심 개념 강조 |
| Contrast Pair | A/B 차이 강조 |
| Three Keywords | 흐름의 핵심 3개 제시 |
| Timeline Moment | 역사적 순간 강조 |
| Cause and Effect | 원인과 결과 연결 |
| Before and After | 변화 설명 |
| Concept Map | 개념 관계 시각화 (단순한 것만) |
| Image Focus | 이미지 보고 설명하기 |
| Quote Focus | 짧은 문장으로 생각 열기 |
| Closing Question | 수업 마무리 토론 유도 |
| Large SVG Diagram | 멀리서도 보이는 단순 도식 |
| Animated Keyword Reveal | 키워드를 하나씩 등장 |

각 패턴은 한 슬라이드 = 한 패턴 = 한 메시지를 지킨다. 한 슬라이드에 Big Keyword + Contrast + Timeline을 다 욱여넣지 않는다.

---

## 3. 시각화 규칙

강의용 시각화는 **멀리서도 보여야 한다.** 교실 맨 뒷자리 학생이 안경 없이도 보일 정도로 큼직하게.

적극적으로 사용할 것:

- 큰 키워드 카드 (한 변 200px+ 권장)
- 큼직한 화살표 (선 굵기 6~10px)
- 단순한 원인-결과 구조 (요소 2~3개)
- 큰 대조 패널 (좌/우 또는 위/아래)
- 2~3단계 타임라인
- 중심 키워드 + 주변 키워드 배치 (4개 이하)
- 간단한 SVG 그림 (선 위주, 면 채우기 최소)
- 선이 그려지는 듯한 SVG 라인 드로잉 애니메이션
- 따뜻한 하이라이트 (테라코타 underline 등)

피해야 할 것:

- 복잡한 차트
- 작은 축과 범례가 있는 그래프
- 빽빽한 표
- 작은 지도 라벨
- 한 슬라이드에 여러 단계가 한꺼번에 들어간 복잡한 개념도
- 읽어야 이해되는 도표 (3초 안에 안 보이면 실패)

원칙:

> 도표도 글씨처럼 커야 한다.

### SVG 라인 드로잉 패턴

`stroke-dasharray`와 `stroke-dashoffset`을 이용한 라인 드로잉 애니메이션은 강의 분위기와 잘 맞는다.

```css
.line-draw {
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  transition: stroke-dashoffset 1.2s ease;
}
.line-draw.visible {
  stroke-dashoffset: 0;
}
```

```html
<svg width="400" height="200" viewBox="0 0 400 200">
  <path
    class="line-draw"
    d="M 40 100 Q 200 40 360 100"
    fill="none"
    stroke="#C66B3D"
    stroke-width="6"
    stroke-linecap="round"
  />
</svg>
```

라인이 천천히 그려지면 "강사가 칠판에 그리는 듯한" 느낌이 난다.

---

## 4. 애니메이션 규칙

### 기본 등장: Spring-Pop

Build 항목이 나타날 때 기본 애니메이션은 **spring-pop** 이다. 살짝 작은 상태에서 탄력 있게 원래 크기로 튕기며 등장한다.

```css
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
```

순차 등장 시 delay 추가 (인덱스별 inline `transitionDelay`도 동일 효과):

```css
.spring-pop:nth-child(1) { transition-delay: 0s; }
.spring-pop:nth-child(2) { transition-delay: 0.08s; }
.spring-pop:nth-child(3) { transition-delay: 0.16s; }
```

### ⚠️ spring-pop을 붙여도 '툭' 끊기는 두 함정 (둘 다 실제로 겪음)

spring-pop class만 붙이면 끝이 아니다. 다음 두 경우 transition이 안 걸려 요소가 한 프레임에 튀어나온다(snap). 글씨는 부드러운데 카드·아이콘만 끊긴다면 거의 이 둘 중 하나다.

1. **render 함수 안에서 하위 컴포넌트를 정의하면 안 된다.**
   `function XxxSlide(){ const Card = (...)=>(...); ... }` 처럼 안에서 정의하면, `step`이 바뀌어 부모가 re-render될 때마다 `Card`의 함수 정체성이 달라진다. React는 이를 "다른 컴포넌트"로 보고 DOM을 **unmount→mount**한다. 새로 mount된 노드는 처음부터 `visible` 상태라 transition할 "이전 값"이 없어 그냥 나타난다(snap).
   → 하위 컴포넌트는 **반드시 모듈 레벨**에 정의하고 props로 받는다. (인라인 JSX를 map에 직접 쓰는 건 괜찮다 — 같은 DOM이 유지된다.)

2. **spring-pop 요소에 인라인 `transition`을 주면 안 된다.**
   인라인 `style={{transition:"background 0.4s, box-shadow 0.4s"}}`는 class의 `transition: opacity/transform`을 **통째로 덮어쓴다**(인라인 우선). 그래서 opacity/scale 등장이 transition 없이 튄다.
   → 색·그림자·배경 전환은 (a) 안쪽 자식 요소에 두거나, (b) 등장 전엔 어차피 opacity 0이라 안 보이므로 그냥 최종 스타일로 항상 렌더한다. spring-pop 요소 자신에는 인라인 transition을 얹지 않는다.

확인된 무죄: `backdrop-filter`(glass-card)와 인라인 `animation`(glow-breath 등)은 transition을 깨지 않는다. (FourCard는 둘 다 있지만 부드럽게 등장 — 측정으로 확인.)

진단법: 등장 중 요소의 `getComputedStyle(el).opacity`·`transform`을 ~40ms 간격으로 찍어본다. `0→0.1→0.35→…→1`처럼 여러 프레임에 걸치면 정상, `0`에서 한 번에 `1`로 점프하면 snap(위 둘 중 하나).

### 사용할 애니메이션

| 이름 | 용도 | 핵심 기법 |
|---|---|---|
| spring-pop | build 등장 기본 | `scale(0.85)+translateY(16px)` → cubic-bezier overshoot |
| bar-grow | 바 차트 성장 | `height: 0` → `height: X%`, 0.8s ease |
| line-draw | SVG 연결선 | `stroke-dashoffset` 전환 1~1.5s |
| glow-pulse | 강조 요소 반짝임 | `box-shadow` keyframe |
| fade-up | 보조 텍스트 | `opacity + translateY(8px)`, spring 없이 |
| progress-expand | 진행바 | `width` 전환 |

### 사용하지 않을 애니메이션

- spin (회전)
- 강한 parallax
- flashy particle effect
- 전체 배경 shake
- 매우 빠른 flash/flicker (0.1초 미만)

### 발표형 애니메이션의 역할

- 다음 설명 지점으로 시선을 안내한다.
- 강사의 말 흐름에 맞춰 키워드를 등장시킨다.
- 도표의 관계를 순서대로 보여준다.
- 화면이 산만해지지 않게 한다 — spring-pop은 탄력감을 주되 과하지 않아야 한다.

핵심 비유:

> 요소가 무대 위에 팝업되듯 등장하고, 연결선이 스르륵 그어지는 느낌.

지속 시간 가이드:

- 슬라이드 전환: 0.3~0.4초
- spring-pop 등장: 0.5~0.6초 (delay 포함 전체 0.8초 이하)
- bar-grow: 0.6~1.0초
- SVG 라인 드로잉: 0.8~1.5초

---

## 5. Build 효과 규칙

Build 효과는 **CSS 클래스 토글** 방식만 사용한다. Framer Motion 같은 무거운 라이브러리는 쓰지 않는다.

기본 패턴:

```html
<div class="build" data-build-index="0">큰 키워드 1</div>
<div class="build" data-build-index="1">큰 키워드 2</div>
<div class="build" data-build-index="2">큰 키워드 3</div>
```

```css
.build {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.build.visible {
  opacity: 1;
  transform: translateY(0);
}
```

React에서는 현재 `step` state에 따라 `visible` 클래스를 토글한다.

```jsx
{slide.builds.map((label, i) => (
  <div key={i} className={`build ${i < step ? 'visible' : ''}`}>
    {label}
  </div>
))}
```

### Build로 등장시킬 수 있는 것

- 큰 키워드 1개
- 큰 화살표 1개
- 도표의 한 부분
- 비교 대상 하나
- 질문 하나
- 하이라이트 하나

### Build로 등장시키지 말 것

- 긴 문장 여러 개
- 작은 bullet list
- 작은 캡션
- 복잡한 표의 행과 열
- 읽기용 설명 문단

### 등장은 자동 순차, 좌/우 클릭으로 이동 (중요)

항목마다 클릭해서 넘기지 **않는다.** 슬라이드에 들어가면 build 항목이 타이머로 하나씩 자동 등장한다. 이동은 **화면을 좌/우로 나눠** 좌측=이전, 우측=다음.

- 슬라이드 진입(`idx` 변경) 시 effect가 `step`을 0으로 두고 `setTimeout`으로 1,2,…,builds.length 까지 올린다. 첫 항목 ~0.35초 뒤, 이후 0.6초 간격. 슬라이드가 바뀌면 타이머 cleanup.
- **이동: 화면 좌측 절반 클릭 = 이전(prev), 우측 절반 = 다음(next).** `app-wrap` onClick에서 `e.clientX < innerWidth/2 ? prev : next`. 키보드 ←/PageUp=이전, →/Space/PageDown=다음.
- **우하단에 ◀ [N/M] ▶ 버튼**도 둔다(번호 칩 양옆). 버튼 onClick엔 **반드시 `e.stopPropagation()`** — 안 하면 좌·우 클릭 영역까지 같이 발동해 두 번 넘어간다. 버튼은 viewport 레벨(스케일 밖).
- `next()`=`go(idx+1)`, `prev()`=`go(idx-1)`. step은 클릭으로 안 올린다(자동 등장).
- 바 차트 막대도 같은 리듬(0.35 + k×0.6초)으로 내부 타이머로 순차 성장.

```jsx
// useNav 안: 슬라이드 진입 시 자동 순차 등장
useEffect(() => {
  const cnt = slides[idx]?.builds?.length || 0;
  setStep(0);
  if (!cnt) return;
  const ts = [];
  for (let k = 1; k <= cnt; k++) ts.push(setTimeout(() => setStep(k), 350 + (k-1)*600));
  return () => ts.forEach(clearTimeout);
}, [idx, slides]);

const next = () => go(idx + 1);
const prev = () => go(idx - 1);

// app-wrap: 좌/우 절반 클릭으로 이동
<div className="app-wrap" onClick={(e)=>(e.clientX < innerWidth/2 ? prev : next)()}>
  …
  {/* 우하단 ◀ [N/M] ▶ — 버튼은 stopPropagation 필수 */}
  <button onClick={(e)=>{e.stopPropagation(); prev();}}>◀</button>
  <span>{idx+1} / {n}</span>
  <button onClick={(e)=>{e.stopPropagation(); next();}}>▶</button>
</div>
```

강사 경험: 도착 → 항목이 알아서 하나씩 흐름 → 화면 오른쪽 클릭(또는 ▶)으로 다음, 왼쪽(또는 ◀)으로 이전. 되돌아가기 쉬워졌다.

---

## 6. 슬라이드 유형별 디자인 메모

### Big Title (`type: "big-title"`)

- 제목 1개를 화면 절반 이상 차지하도록 큼직하게
- 부제는 작아도 24px 이상
- 배경에 아주 옅은 도형(소프트 셰이프) 한두 개 정도는 OK

### Big Keyword (`type: "big-keyword"`)

- 키워드 1개만. 60~120px 크기
- 키워드 아래·옆에 짧은 한 줄 설명 (선택사항, 32px+)

### Three Keywords (`type: "three-keywords"`)

- 3개의 키워드 glass-card (가로 배열)
- 각 카드: `glass-card` + 상단 컬러 border-top + 파스텔 glow
- spring-pop으로 하나씩 등장

### Icon Versus (`type: "icon-versus"`) ★ 트렌디

- 두 개의 glass-card가 **양쪽에서 spring-pop**으로 튕기며 등장
- 왼쪽 카드: builds[0] 에서 등장
- 오른쪽 카드: builds[1] 에서 spring-pop 등장
- 중앙: 빛나는 "VS" 텍스트 (glow text-shadow) 또는 화살표
- 두 카드는 서로 다른 파스텔 글로우 색상 (예: indigo vs rose)

```jsx
// 구현 참고
<div style={{display:"flex", gap:32, alignItems:"center"}}>
  <div className={`glass-card spring-pop ${step>0?"visible":""}`}
       style={{flex:1, borderTop:"3px solid #6366F1",
               boxShadow:"0 8px 32px rgba(0,0,0,0.04),0 0 28px rgba(99,102,241,0.2)"}}>
    {/* 왼쪽 내용 */}
  </div>
  <div style={{fontSize:"clamp(36px,5vh,56px)", fontWeight:900,
               color:"#F43F5E", textShadow:"0 0 20px rgba(244,63,94,0.4)"}}>
    VS
  </div>
  <div className={`glass-card spring-pop ${step>1?"visible":""}`}
       style={{flex:1, borderTop:"3px solid #F43F5E",
               boxShadow:"0 8px 32px rgba(0,0,0,0.04),0 0 28px rgba(244,63,94,0.2)"}}>
    {/* 오른쪽 내용 */}
  </div>
</div>
```

### Contrast Pair (`type: "contrast"`)

- 좌/우 또는 위/아래 두 glass-card 패널
- 가운데 "vs" 또는 화살표
- 두 카드는 서로 다른 파스텔 glow 색상

### Animated Bar Chart (`type: "animated-bar-chart"`) ★ 트렌디

- **무거운 차트 라이브러리 금지.** CSS `height` 전환만으로 구현.
- 막대는 **한꺼번에가 아니라 0.6초 간격으로 하나씩 순차 성장** (다른 build와 동일 리듬). 내부 `revealed` 카운트를 타이머로 올리고 `i < revealed`인 막대만 목표 height로.
- 막대 위에 숫자 레이블 (px). 작은 값(max 대비 1% 미만)도 라벨이 막대 위 chip으로 떠 항상 보이게.
- 각 막대는 다른 파스텔 글로우 색상으로 구분.

```jsx
function BarChart({data}) {
  // 막대를 0.6초 간격으로 하나씩 순차 성장
  const [revealed, setRevealed] = React.useState(0);
  React.useEffect(() => {
    setRevealed(0);
    const ts = [];
    for (let k = 1; k <= data.length; k++) ts.push(setTimeout(() => setRevealed(k), 350 + (k-1)*600));
    return () => ts.forEach(clearTimeout);
  }, [data]);
  const max = Math.max(...data.map(d => d.value));
  return (
    // 높이는 px (캔버스 좌표). vh 금지.
    <div style={{display:"flex", gap:30, alignItems:"flex-end", height:"400px", padding:"0 8%"}}>
      {data.map((d, i) => {
        const c = col(i);
        const pct = (d.value / max * 100) + "%";
        const shown = i < revealed;   // 이 막대 차례가 되면 성장
        return (
          <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:14}}>
            {/* 숫자 라벨은 막대 위에 — 작은 값도 항상 보이게 */}
            <div style={{
              width:"100%",
              background:`linear-gradient(180deg,${c.fg} 0%,${c.fg}cc 100%)`,
              borderRadius:"14px 14px 6px 6px", border:`1.5px solid ${c.fg}`,
              boxShadow:`0 0 28px ${c.glow}`,
              height: shown ? pct : "0%", minHeight: shown ? 6 : 0,
              transition:"height 1.0s cubic-bezier(0.34,1.4,0.64,1)",
            }}/>
            <div style={{fontWeight:800, fontSize:"33px", color:c.fg}}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}
```

(라벨 chip을 막대 위에 absolute로 띄우는 상세는 실제 컴포넌트 참고. 핵심은 `grown` 일괄이 아니라 `revealed` 카운트로 **하나씩**.)

### Vertical Step Flow (`type: "vertical-step-flow"`) ★ 트렌디

- 위→아래로 키워드 glass-card가 spring-pop으로 하나씩 순차 등장 (`builds`).
- 카드와 카드 사이 **얇은 빛나는 세로 연결선**이 스르륵 그어진다 (`stroke-dashoffset` 전환).

```jsx
// 연결선 SVG 패턴
<svg style={{position:"absolute", left:"50%", top:0, height:"100%"}}
     width="4" viewBox="0 0 4 100" preserveAspectRatio="none">
  <line x1="2" y1="0" x2="2" y2="100"
        stroke={c.fg} strokeWidth="2"
        strokeDasharray="100" strokeDashoffset={lineVisible ? "0" : "100"}
        style={{transition:"stroke-dashoffset 0.6s ease 0.2s"}}
        filter={`drop-shadow(0 0 4px ${c.fg})`}/>
</svg>
```

연결선은 아래 카드가 등장하기 0.2초 전에 그어지기 시작하여 카드와 함께 마무리된다.

### Cause and Effect (`type: "cause-effect"`)

- 좌 → 우 흐름
- 큰 화살표 (SVG, 라인 드로잉 가능)
- 양 끝에 키워드

### Timeline Moment (`type: "timeline-moment"`)

- 가로 라인 위에 점 2~3개
- 각 점에 짧은 라벨
- 현재 강조하는 시점은 더 큰 점 + indigo 컬러 + glow

### Question (`type: "question"`)

- 화면 가운데 큰 물음표 (옵션)
- 질문 문장 한 줄 (40px+)
- 청중이 잠시 생각할 시간을 주기 위해 build 없음

### Closing Prompt (`type: "closing-prompt"`)

- 마무리 토론용 질문 슬라이드
- Question과 유사하지만 톤이 차분
- 다음 차시 예고를 짧게 넣을 수도 있다 (32px+)

---

## 7. 정리 — 한 슬라이드를 만들 때 체크 순서

1. 메시지 하나만 고른다.
2. 그 메시지에 가장 잘 맞는 패턴(`type`)을 고른다.
3. 화면에 띄울 글자·키워드·도형을 정한다 (24px+).
4. 어떤 순서로 등장할지 `builds`로 적는다.
5. 강사가 말할 모든 설명을 `notes`로 옮긴다.
6. 다른 슬라이드와 시각 톤이 일관된지 본다.

이 여섯 단계를 슬라이드마다 반복한다.
