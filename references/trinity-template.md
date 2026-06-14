# Trinity (삼위일체 삼각형) — 세 요소가 하나로 모이는 구조

> 내용 모양: **동등한 세 요소가 모여 하나의 상위 개념을 이룬다.**
> 단순 병렬(`four-card`)이 아니라 "셋 → 하나"의 **통합/삼위일체**가 핵심일 때 쓴다.
> 예: 사실성·관련성·충분성 → "탄탄한 반론" / 입법·사법·행정 → "삼권분립" / 지·정·의 → "전인".

세 꼭짓점(glass 카드)이 삼각형을 이루고, 마지막에 **중앙 허브(core)**가 등장하며 세
스포크가 빛을 내며 모여든다. 기독교 도상의 "삼위일체 방패(Scutum Fidei)"처럼
바깥 3노드 + 중심 1노드 + 연결선 구조다.

`hub-spoke`/`mindmap`(🔨, 방사형 일반)의 **3노드 특화 + 통합 강조** 버전으로 보면 된다.

---

## 언제 쓰나

- **use-when**: 동등한 핵심 요소가 **정확히 3개**이고, 그 셋이 합쳐져 **하나의 결론/개념**이 될 때.
- **avoid-when**:
  - 요소에 **순서·단계**가 있을 때 → `vertical-step-flow`
  - 요소가 **그냥 병렬**(통합 메시지 없음)일 때 → `four-card`
  - 요소가 4개 이상일 때 → `four-card` / `keyword-cluster`
  - **흐름(A→B→C)**일 때 → `flow`

---

## 데이터 스키마

```js
{
  id: "...",
  type: "trinity",
  theme: "light",
  emoji: "🎯",                       // 제목 옆 (옵션)
  eyebrow: "직접 반론 · 세 가지로 따져요",
  title: "사실성 · 관련성 · 충분성",
  core: "탄탄한 반론",               // 중앙 허브 라벨 — 셋이 모여 되는 것 (옵션, 없으면 허브·스포크 생략)
  coreEmoji: "🛡️",                  // 중앙 허브 이모지 (옵션)
  items: [                           // 정확히 3개 (4개 이상이면 앞 3개만 사용)
    { emoji: "🔍", label: "사실성", desc: "그 말이 *사실·정확*한가?" },
    { emoji: "🧲", label: "관련성", desc: "논제와 *정말 관련* 있나?" },
    { emoji: "⚖️", label: "충분성", desc: "*충분*한가? 모순은 없나?" }
  ],
  notes: "..."
}
```

- 모든 텍스트 필드(`title`/`eyebrow`/`label`/`desc`/`core`)는 `hl()` 마커(`*파랑*` `~로즈~` `_초록_`)가 먹는다.
- `core`를 비우면 허브·스포크 없이 **순수 삼각형**(꼭짓점 3 + 둘레)만 그린다.

---

## 등장 순서 (자동 순차)

`buildCount = items.length + (core?1:0)` → 보통 4스텝.

1. step1 — 위 꼭짓점(사실성)
2. step2 — 왼아래(관련성) + 둘레선 [위↔왼아래]
3. step3 — 오른아래(충분성) + 둘레선 [왼아래↔오른아래], [오른아래↔위] (삼각형 완성)
4. step4 — **중앙 허브 + 세 스포크가 빛나며 모여듦** ("셋이 하나로")

둘레선은 양 끝 꼭짓점이 다 나오면 `stroke-dashoffset`으로 그어진다.
스포크는 허브와 함께 각 노드 색으로 빛난다(`drop-shadow`).

---

## 좌표·크기 (1200×900 캔버스 기준)

- 캔버스 가용 폭은 `.stage` padding(64px×2) 때문에 **1072px**. 컨테이너는 **1040×680**으로 그 안에 들어간다.
- `.stage-box`가 `overflow:hidden`인 덱에서도 안 잘리도록 제목+여백 포함 총높이 ≤ 812px로 맞춤.
- 카드는 `transform:translate(-50%,-50%)`로 **중심 좌표**에만 배치(폭 300 고정, 높이 auto).
- 허브는 지름 180 원형 glass. 무게중심에 위치.
- SVG 선은 카드/허브(높은 zIndex) **밑**으로 깔려, 보이는 구간만 카드 사이를 잇는다.

| 요소 | 중심 좌표(컨테이너 1040×680) |
|---|---|
| 위 꼭짓점 | (520, 120) |
| 왼아래 꼭짓점 | (200, 560) |
| 오른아래 꼭짓점 | (840, 560) |
| 중앙 허브 | (520, 413) |

---

## 전체 코드 (검증됨 — `촉법소년-논증게임-온라인진행-슬라이드.html` slide c15)

모듈 레벨에 둔다. **render 함수 안에서 정의 금지**(remount→선 그리기 snap).

```jsx
/* ===== Trinity (삼위일체 삼각형) — 3요소 전용 ===== */
const TRI_W=1040, TRI_H=680;
const TRI_V=[{x:520,y:120},{x:200,y:560},{x:840,y:560}];   // 꼭짓점(카드 중심): 위 / 왼아래 / 오른아래
const TRI_C={x:520,y:413};                                  // 중앙 허브(무게중심)
const TRI_EDGES=[[0,1],[1,2],[2,0]];                        // 삼각형 둘레

// 모듈 레벨 정의 — render 함수 안에서 만들면 remount되어 선 그리기가 끊긴다(snap).
function TrinityLine({a,b,color,width,vis,glow}){
  const len=Math.hypot(b.x-a.x,b.y-a.y);
  return (
    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
      stroke={color} strokeWidth={width} strokeLinecap="round"
      strokeDasharray={len} strokeDashoffset={vis?0:len}
      style={{opacity:vis?1:0,transition:"stroke-dashoffset .7s ease,opacity .5s ease",filter:vis?`drop-shadow(0 0 6px ${glow})`:"none"}}/>
  );
}

function Trinity({s,step}){
  const items=(s.items||[]).slice(0,3);
  const hasCore=!!s.core;
  const hubVis=hasCore && step>items.length;   // 허브는 세 꼭짓점이 모두 나온 뒤 등장
  return (
    <div className="box" style={{alignItems:"center"}}>
      {s.eyebrow && <Eyebrow>{hl(s.eyebrow)}</Eyebrow>}
      {s.title && <h2 className="t-title" style={{textAlign:"center",marginBottom:4,fontSize:46}}>{s.emoji?<span className="emoji-md anim-wave" style={{marginRight:12}}>{s.emoji}</span>:null}{hl(s.title)}</h2>}
      <div style={{position:"relative",width:TRI_W,height:TRI_H}}>
        <svg viewBox={`0 0 ${TRI_W} ${TRI_H}`} width="100%" height="100%" style={{position:"absolute",inset:0,zIndex:1,overflow:"visible"}}>
          {/* 삼각형 둘레 — 꼭짓점이 다 나오면 그어진다 */}
          {TRI_EDGES.map(([a,b],i)=>(
            <TrinityLine key={"e"+i} a={TRI_V[a]} b={TRI_V[b]} color="rgba(100,116,139,0.45)" width={2.5} vis={step>Math.max(a,b)} glow="rgba(100,116,139,0.35)"/>
          ))}
          {/* 중앙으로 모이는 스포크 — 허브와 함께 빛난다 */}
          {hasCore && items.map((it,i)=>{const c=col(i);return (
            <TrinityLine key={"s"+i} a={TRI_C} b={TRI_V[i]} color={c.fg} width={4} vis={hubVis} glow={c.fg}/>
          );})}
        </svg>
        {/* 꼭짓점 카드 */}
        {items.map((it,i)=>{
          const c=col(i); const v=TRI_V[i]; const vis=step>i;
          return (
            <div key={i} className={"glass spring-pop "+(vis?"visible":"")}
              style={{position:"absolute",left:v.x,top:v.y,transform:"translate(-50%,-50%)",width:300,padding:"24px 22px",textAlign:"center",borderTop:`4px solid ${c.fg}`,boxShadow:`0 8px 32px rgba(0,0,0,0.05),0 0 26px ${c.glow}`,zIndex:3,transitionDelay:`${i*0.05}s`}}>
              <div style={{animation:`breathe 3.4s ease-in-out infinite ${i*0.3}s`,display:"inline-block"}}>
                <span className="emoji-md">{it.emoji}</span>
              </div>
              <div className="t-sm" style={{fontSize:30,fontWeight:800,marginTop:12,color:c.fg}}>{hl(it.label)}</div>
              {it.desc && <div className="t-sm" style={{fontSize:24,fontWeight:600,marginTop:8,color:"var(--muted)",lineHeight:1.4}}>{hl(it.desc)}</div>}
            </div>
          );
        })}
        {/* 중앙 허브 — 셋이 하나로 */}
        {hasCore && (
          <div className={"glass spring-pop "+(hubVis?"visible":"")}
            style={{position:"absolute",left:TRI_C.x,top:TRI_C.y,transform:"translate(-50%,-50%)",width:180,height:180,borderRadius:"50%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"2px solid var(--blue)",boxShadow:"0 8px 36px rgba(0,0,0,0.06),0 0 44px rgba(59,130,246,0.38)",zIndex:4}}>
            {s.coreEmoji && <span className="emoji-md" style={{fontSize:40,animation:"breathe 3s ease-in-out infinite"}}>{s.coreEmoji}</span>}
            <div className="t-sm" style={{fontSize:27,fontWeight:900,marginTop:6,color:"var(--blue)",textAlign:"center",lineHeight:1.25}}>{hl(s.core)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
```

디스패처와 스텝 수에 등록한다.

```jsx
// function Slide(...) switch 안:
case "trinity": return <Trinity s={s} step={step}/>;

// function buildCount(...) switch 안:
case "trinity": return (s.items||[]).length + (s.core?1:0);
```

---

## 주의

- **정확히 3요소**에 맞춘 좌표다. `items`가 4개 이상이면 앞 3개만 그린다(나머지는 `four-card`로).
- 둘레선 색 `rgba(100,116,139,0.45)`(슬레이트)은 **라이트 테마**에 맞춰 톤을 잡았다. 다크에서 둘레를 더 살리려면 밝은 반투명(예: `rgba(255,255,255,0.28)`)으로 바꾼다. 스포크·카드·허브는 테마 무관(블루/에메랄드/앰버 + glass).
- 지속 모션은 **비텍스트만**: 이모지에만 `breathe`. 라벨·core 글씨엔 idle 없음(규칙 9).
- 모든 visible text ≥24px (desc 24, label 30, core 27, coreEmoji 40).
