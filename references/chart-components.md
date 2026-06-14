# Chart Components

이 문서는 슬라이드 안에서 데이터를 시각화할 때 쓰는 차트 컴포넌트 가이드다.
**모든 차트는 SVG로 직접 구현한다.** Chart.js, D3, Recharts 등 외부 라이브러리 사용 금지.

---

## 1. 차트 선택 원칙

```
1. 수치 1개 → BigNumber
2. 항목별 비교 (3~5개) → BarChart 또는 LollipopChart
3. 시간 추세 → LineChart 또는 SlopeChart
4. 비율·구성 → Stacked100Bar (파이 차트 사용 금지)
5. 긴 항목명 비교 → HorizontalBar
6. 두 시점 변화 → SlopeChart
```

절대 규칙:
- 모든 차트 텍스트(축 레이블, 수치, 단위, 인사이트)는 **24px 이상**
- 차트에는 반드시 **인사이트 문장**을 함께 넣는다 (수치만 있으면 의미 전달 실패)
- 데이터 수는 발표형 기준 **5개 이하**

---

## 2. 차트 선택표

| 데이터 유형 | 데이터 수 | 권장 차트 | 대안 |
|---|---|---|---|
| 수치 하나 강조 | 1 | BigNumber | key-message |
| 항목 비교 | 3~5 | BarChart | LollipopChart |
| 항목 이름이 긴 비교 | 3~5 | HorizontalBar | BarChart |
| 시간에 따른 변화 | 4~8 시점 | LineChart | SlopeChart |
| 두 시점 간 변화 | 2 시점 | SlopeChart | before-after-panel |
| 비율·구성 | 3~5 그룹 | Stacked100Bar | — |
| 순위 강조 비교 | 3~5 | LollipopChart | BarChart |

---

## 3. BigNumber (큰 수치 강조)

```
type        : big-number
use-when    : 충격적이거나 중요한 수치 하나를 강하게 각인
build       : 수치 카운트업 (CSS counter animation) → 단위 → 설명
structure   : 수치 120px+, 단위 48px, 인사이트 32px
```

### SVG 없이 CSS만 사용
```jsx
// 수치 자체가 시각 요소
<div style={{ fontSize: "120px", fontWeight: 900, color: "var(--accent)" }}>
  4시간
</div>
<div style={{ fontSize: "32px" }}>
  안에 내 앱을 만든다
</div>
```

### 금지
- 수치 옆에 설명 문단 금지 (notes로 이동)
- 수치를 테이블 셀 안에 넣는 것 금지

---

## 4. BarChart (세로 막대 차트)

```
type        : bar-chart
use-when    : 3~5개 항목의 수치를 비교할 때
build       : 막대 순서대로 height 0 → 실제 높이 (CSS transition)
structure   : Y축 레이블 24px, X축 항목명 24px, 막대 위 수치 28px
```

### SVG 구현 패턴
```jsx
// 데이터
const bars = [
  { label: "소비자형", value: 30, color: "#C4A882" },
  { label: "생산자형", value: 90, color: "#C66B3D" },
];

// SVG 기본 구조
const W = 480, H = 300, PAD = { top: 20, right: 20, bottom: 60, left: 50 };
const maxVal = Math.max(...bars.map(b => b.value));
const barW = 80;
const gap = (W - PAD.left - PAD.right - bars.length * barW) / (bars.length + 1);

// 막대 높이 계산
const chartH = H - PAD.top - PAD.bottom;
const barHeight = (v) => (v / maxVal) * chartH;
const barY = (v) => PAD.top + chartH - barHeight(v);
```

### 애니메이션
```css
.bar {
  transform-origin: bottom;
  transform: scaleY(0);
  transition: transform 0.6s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.bar.visible { transform: scaleY(1); }
```

### 반드시 포함할 요소
1. Y축 기준선 (얇은 수평선)
2. 수치 레이블 (막대 위)
3. 항목 이름 (X축)
4. 인사이트 문장 (차트 아래 또는 우측)

### 금지
- 3D 막대 금지
- 막대가 6개 이상이면 슬라이드 분할

---

## 5. LollipopChart (롤리팝 차트)

```
type        : lollipop-chart
use-when    : BarChart와 같은 상황이지만 더 깔끔한 시각이 필요할 때
build       : 선 0 → 실제 길이, 그 후 원(dot) fade-in
structure   : 막대 대신 가는 선 + 끝에 큰 원, 수치는 원 옆
```

### SVG 구현 패턴
```jsx
// 가로 롤리팝 (항목명이 길 때 유용)
bars.map((b, i) => {
  const y = PAD.top + i * rowH + rowH / 2;
  const x = PAD.left + (b.value / maxVal) * chartW;
  return (
    <g key={i}>
      <line x1={PAD.left} y1={y} x2={x} y2={y}
            stroke={b.color} strokeWidth={3}
            className={`lollipop-line ${visible ? "visible" : ""}`} />
      <circle cx={x} cy={y} r={12} fill={b.color}
              className={`lollipop-dot ${visible ? "visible" : ""}`} />
      <text x={x + 16} y={y + 6} fontSize={24}>{b.value}</text>
    </g>
  );
})
```

---

## 6. LineChart (꺾은선 차트)

```
type        : line-chart
use-when    : 시간에 따른 연속적 변화 추세
build       : SVG stroke-dashoffset으로 선이 왼→오 그려지는 효과
structure   : X축 시간, Y축 수치, 선 위 데이터 점, 인사이트 화살표
```

### SVG 선 그리기 애니메이션
```jsx
// polyline으로 구현
const points = data.map((d, i) => {
  const x = PAD.left + (i / (data.length - 1)) * chartW;
  const y = PAD.top + chartH - (d.value / maxVal) * chartH;
  return `${x},${y}`;
}).join(" ");

// stroke-dasharray = 선 전체 길이
// stroke-dashoffset: 전체 길이 → 0 으로 transition
```

```css
.trend-line {
  stroke-dasharray: 1000; /* 실제 선 길이로 계산 */
  stroke-dashoffset: 1000;
  transition: stroke-dashoffset 1.2s ease-out;
}
.trend-line.visible { stroke-dashoffset: 0; }
```

### 반드시 포함할 요소
1. 시작점과 끝점에 큰 원 dot
2. 눈에 띄는 추세 변곡점 강조
3. 인사이트 텍스트 ("2020년 이후 급등")

---

## 7. SlopeChart (기울기 차트)

```
type        : slope-chart
use-when    : 두 시점 사이의 변화를 비교 (여러 항목의 상대 변화)
build       : 왼쪽 값 → 선 그리기 → 오른쪽 값
structure   : 왼쪽 컬럼(시점1) → 선 → 오른쪽 컬럼(시점2)
```

### SVG 구현 패턴
```jsx
items.map((item, i) => {
  const x1 = PAD.left;
  const x2 = W - PAD.right;
  const y1 = PAD.top + ((maxVal - item.before) / range) * chartH;
  const y2 = PAD.top + ((maxVal - item.after) / range) * chartH;
  return (
    <g key={i}>
      <circle cx={x1} cy={y1} r={8} fill={item.color} />
      <line x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={item.color} strokeWidth={2}
            className="slope-line" />
      <circle cx={x2} cy={y2} r={8} fill={item.color} />
      <text x={x1 - 12} y={y1 + 6} textAnchor="end" fontSize={24}>
        {item.before}
      </text>
      <text x={x2 + 12} y={y2 + 6} fontSize={24}>{item.after}</text>
    </g>
  );
})
```

---

## 8. HorizontalBar (가로 막대 차트)

```
type        : horizontal-bar
use-when    : 항목 이름이 길어서 세로 막대가 불편할 때
build       : 막대 width 0 → 실제 너비 (왼→오 확장)
structure   : Y축에 항목명, X축에 수치, 막대 끝에 수치 레이블
```

```css
.h-bar {
  width: 0;
  transition: width 0.6s ease-out;
}
.h-bar.visible { width: var(--target-width); }
```

---

## 9. Stacked100Bar (100% 스택 막대)

```
type        : stacked-bar-100
use-when    : 비율·구성 비교 (파이 차트 대체)
build       : 세그먼트 왼→오 차례로 등장
structure   : 100% 너비 막대, 세그먼트마다 색상과 비율 레이블
```

### 파이 차트 대신 이것을 써야 하는 이유
- 파이 차트는 슬라이스 크기 비교가 어렵다
- 100% 스택 막대는 여러 그룹의 구성을 행으로 나란히 비교할 수 있다
- 발표 화면에서 가독성이 훨씬 좋다

```jsx
// 각 그룹의 세그먼트
const segments = [
  { label: "소비자형", pct: 70, color: "#C4A882" },
  { label: "생산자형", pct: 30, color: "#C66B3D" },
];
let cumulative = 0;
segments.map(s => {
  const x = (cumulative / 100) * barWidth;
  cumulative += s.pct;
  return <rect x={x} width={s.pct / 100 * barWidth} ... />;
})
```

---

## 10. 차트 공통 구현 규칙

### 글자 크기
```
축 레이블(항목명)   : 최소 24px
수치 레이블         : 최소 28px
인사이트 문장       : 최소 28px
단위 표시           : 최소 24px
```

### 인사이트 문장 위치
```
차트 우측 상단 박스  → 발표형 기본 위치
차트 아래            → 차트가 클 때
차트 내부 화살표     → 추세·변화 강조용
```

### 색상 사용
```
강조 항목    : #C66B3D (테라코타)
보조 항목    : #C4A882 (뮤트 브라운)
배경         : #F9F6F1
눈금선       : #E8DFD0 (연한 선)
텍스트       : #3D3929
```

### 반응형 처리
SVG `viewBox`를 사용하면 크기가 자동으로 맞춰진다.
```jsx
<svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: "600px" }}>
```

---

## 11. 기본 추천에서 빠지는 차트 (요청 시 사용)

아래 차트들은 발표 화면 가독성이 떨어져 **기본 추천에서는 고르지 않는다.**
하지만 사용자가 `component-registry.md`의 번호로 직접 지정하면(또는 PowerPoint와 똑같이 만들어 달라고 하면) 만든다.
이때는 **더 잘 읽히는 대안을 한 번 안내한 뒤** 사용자가 그대로 원하면 그 번호로 만든다. (섹션 12에 규격)

| 차트 | 약점 | 더 잘 읽히는 대안 |
|---|---|---|
| 파이 차트(60) | 슬라이스 크기 비교 어려움 | Stacked100Bar(58) |
| 도넛 차트(61) | 파이와 동일한 문제 | Stacked100Bar(58) / BigNumber(52) |
| 레이더 차트(62) | 다각형 면적 해석 어려움 | BarChart(53) + 색상 강조 |
| 거품 차트(64) | 원 크기 비교 어려움 | LollipopChart(55) |
| 복합 이중 축(69) | 두 축 해석이 혼란스러움 | 두 장 슬라이드로 분할 |
| 3D 막대 | 실제 값 왜곡 | 일반 BarChart(53) — 3D는 만들지 않는다 |
| 데이터 6개 이상의 꺾은선 | 선이 겹쳐 판독 불가 | SlopeChart(57) 또는 분할 |

> 3D 효과(입체 막대·입체 파이)는 어떤 경우에도 만들지 않는다. 값 왜곡이 심하다.

---

## 12. PowerPoint 기본 차트 추가분 (번호 59~70)

PowerPoint 기본 차트를 이 시스템으로 옮긴 것. **모두 SVG로 직접 구현**(라이브러리 금지),
24px+ 글자·인사이트 문장·발표형 5개 이하 원칙은 그대로 적용한다.
**완성된 SVG 예시는 `component-gallery.html`의 각 번호 카드에 그대로 들어 있으니, 그 SVG 패턴을 출발점으로 쓴다.**

| # | type | 한 줄 규격 |
|---|---|---|
| 59 | `area-chart` | LineChart(56)에 `polygon`으로 아래 영역을 `opacity:.25` 채움. 추세 + 누적 양감. |
| 60 | `pie-chart` | `path` arc로 조각. 한 전체의 구성. 조각마다 `%` 라벨(흰 글자). 요청 시. |
| 61 | `donut-chart` | 파이에서 안쪽 반지름(`r0`)을 비운 고리. 가운데에 총합/핵심 수치 크게. 요청 시. |
| 62 | `radar-chart` | 축 N개 정다각형 격자 + 값 폴리곤(`opacity:.3`). 역량 프로필. 요청 시. |
| 63 | `scatter-plot` | x·y 축 + `circle` 점들 + 추세선(`dasharray`). 두 변수 상관. |
| 64 | `bubble-chart` | 산점도 + 점 반지름으로 3번째 변수. 요청 시. |
| 65 | `waterfall-chart` | 누적 시작/증가/감소/합계를 막대 위치로. 증감 흐름(예산·손익). |
| 66 | `funnel-chart` | 단계마다 좁아지는 막대 + 수치. 전환·감소. |
| 67 | `treemap` | 비율 크기의 사각 타일 배치. 비율 + 위계. |
| 68 | `histogram` | 구간(bin)별 막대, 막대 사이 간격 0에 가깝게. 분포(도수). |
| 69 | `combo-chart` | 막대(BarChart) 위에 꺾은선(LineChart) 겹침. 이중축은 혼란하니 요청 시만. |
| 70 | `gauge-chart` | 반원 arc 배경 + 값 arc + 가운데 `%`. 단일 지표 달성률. |

공통 규칙:
- 색은 PALETTE(blue/emerald/amber/rose/sky/teal) 순환. 강조 항목만 진한 액센트.
- 각 차트에 **인사이트 한 줄**을 함께 둔다(수치만으론 의미 전달 실패).
- 요청 시 항목(60·61·62·64·69)은 만들기 전 대안 번호를 한 번 안내한다(섹션 11 표).
