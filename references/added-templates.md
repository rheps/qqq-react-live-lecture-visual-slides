# 추가 템플릿 7종 (복붙용 스펙)

`qqq-react-live-lecture-visual-slides`로 실제 강의 덱을 만들며 검증된 7개 템플릿. 모두 **모듈 레벨 함수**(render 함수 안 정의 금지 — snap 방지)이고, 공용 헬퍼 `hl()`·`MI`·`Idle`·`Eyebrow`·`vF`·`PCOL`을 그대로 쓴다. 글자는 전부 24px+, 그라디언트 텍스트는 `color` fallback 먼저(`hl`이 처리). 등장은 FM 프리셋(`MI`), 지속 모션은 비텍스트(`Idle`)에만.

전제 헬퍼(생성기 본문에 이미 있는 것):
```js
const vF=(i,step)=>i<step;                 // build 가시성
const PCOL={blue:"#3B82F6",emerald:"#10B981",amber:"#F59E0B",rose:"#F43F5E",sky:"#0EA5E9",teal:"#14B8A6"};
// hl(text), MI({show,children,style,className,delay,hover}), Idle({children,kind,style}), Eyebrow({children})
```
`Slide` 스위치에 각 `case`를 등록한다.

---

## 1. `reproduce` — 재생산 루프 (1차→2차→3차 → 핵심 키워드)
**언제**: "한 번 쓰고 끝이 아니라, 계속 재사용·재생산되는 도구를 만든다" 같은 *지속/반복/일관성* 메시지. 허브(도구) → 반복 산출 체인 → 핵심 단어 hero.

데이터:
```js
{ id, type:"reproduce", theme:"light", eyebrow, title,
  hubEmoji:"🏭", hubSub:"한 번 쓰고 끝나는 결과물이 아니라", hubLabel:"재사용되는 *도구·플랫폼*을 만든다",
  outputs:["📄 1차 생성","📑 2차 활용","🔁 3차 재생산","♾️ 계속"],
  keyword:"일관성", keywordSub:"지속적·반복적으로 _같은 품질_을 뽑아낼 수 있느냐",
  caption:"생성물이 아니라, *생성하는 도구*를 만든다",
  builds:["title","hub","outputs","keyword","caption"] }
```
```jsx
function Reproduce({s,step}){
  return (
    <div className="box">
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <MI show={vF(0,step)} className="t-title" style={{marginBottom:28}}>{hl(s.title)}</MI>
      <MI show={vF(1,step)} hover className="glass" style={{padding:"24px 44px",borderTop:"4px solid var(--blue)",marginBottom:24}}>
        <Idle kind="breathe" style={{fontSize:68}}>{s.hubEmoji}</Idle>
        <div className="t-sub" style={{fontSize:25,marginTop:4}}>{hl(s.hubSub)}</div>
        <div className="t-label" style={{fontSize:34,marginTop:6}}>{hl(s.hubLabel)}</div>
      </MI>
      <MI show={vF(2,step)} style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:26}}>
        {s.outputs.map((o,i)=>(
          <React.Fragment key={i}>
            {i>0 && <span style={{fontSize:32,fontWeight:900,color:"var(--sky)"}}>→</span>}
            <span className="glass" style={{padding:"12px 22px",fontSize:26,fontWeight:800}}>{hl(o)}</span>
          </React.Fragment>
        ))}
      </MI>
      <MI show={vF(3,step)}>
        <div className="t-hero" style={{fontSize:58}}>{hl("결국 핵심은 *"+s.keyword+"*")}</div>
        <div className="t-sub" style={{fontSize:27,marginTop:8}}>{hl(s.keywordSub)}</div>
      </MI>
      <MI show={vF(4,step)} className="t-cap" style={{marginTop:24}}>{hl(s.caption)}</MI>
    </div>
  );
}
```

---

## 2. `platforms` — 카테고리별 묶음 (그룹 + 칩)
**언제**: 한 주제 아래 *여러 분야*가 있고 분야마다 *대표 항목 몇 개*가 붙을 때(예: 이미지 모델들 / 영상 모델들). 2~3 그룹 권장.

데이터:
```js
{ id, type:"platforms", theme:"light", eyebrow, title, subtitle,
  groups:[ {emoji:"🎨", label:"이미지", items:["나노바나나","이미지 2.0","미드저니"]},
           {emoji:"🎬", label:"영상",  items:["Veo","Seedance","Kling"]} ],
  caption, builds:["title","sub","g0","g1","caption"] }   // 그룹 수만큼 g0,g1,g2
```
```jsx
function Platforms({s,step}){
  return (
    <div className="box">
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <MI show={vF(0,step)} className="t-title" style={{marginBottom:12}}>{hl(s.title)}</MI>
      <MI show={vF(1,step)} className="t-sub" style={{fontSize:28,marginBottom:34}}>{hl(s.subtitle)}</MI>
      <div style={{display:"flex",gap:26,justifyContent:"center",width:"100%"}}>
        {s.groups.map((g,i)=>(
          <MI key={i} show={vF(2+i,step)} hover className="glass" style={{flex:1,maxWidth:460,padding:"30px 26px",borderTop:`4px solid ${i?PCOL.rose:PCOL.blue}`}}>
            <Idle kind="float" style={{fontSize:60}}>{g.emoji}</Idle>
            <div className="t-label" style={{fontSize:32,marginTop:10,color:i?PCOL.rose:PCOL.blue}}>{hl(g.label)}</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginTop:18}}>
              {g.items.map((it,j)=>(<span key={j} style={{fontSize:25,fontWeight:800,padding:"9px 18px",borderRadius:999,background:"rgba(59,130,246,.10)",color:"var(--ink)"}}>{hl(it)}</span>))}
            </div>
          </MI>
        ))}
      </div>
      <MI show={vF(2+s.groups.length,step)} className="t-cap" style={{marginTop:34}}>{hl(s.caption)}</MI>
    </div>
  );
}
```

---

## 3. `reasons` — 이유·근거 세로 나열
**언제**: 한 주장(=title) 아래 *이유/근거/장점 2~3개*를 나란히 댈 때. 행마다 이모지 + 굵은 라벨 + 설명. `subtitle`은 선택(있으면 빌드 인덱스 하나 차지).

데이터:
```js
{ id, type:"reasons", theme:"light", eyebrow, title, subtitle,
  rows:[ {emoji:"🌐", label:"범용성", detail:"만들 수 있는 범위가 _넓다_"},
         {emoji:"🔧", label:"적응성", detail:"_수정·확장_이 쉽다"} ],
  caption, builds:["title","sub","r0","r1","caption"] }   // subtitle 없으면 ["title","r0","r1","caption"]
```
```jsx
function Reasons({s,step}){
  const base=s.subtitle?2:1;
  return (
    <div className="box">
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <MI show={vF(0,step)} className="t-title" style={{marginBottom:10}}>{hl(s.title)}</MI>
      {s.subtitle && <MI show={vF(1,step)} className="t-sub" style={{fontSize:28,marginBottom:30}}>{hl(s.subtitle)}</MI>}
      <div style={{display:"flex",flexDirection:"column",gap:16,width:"100%",maxWidth:860}}>
        {s.rows.map((r,i)=>(
          <MI key={i} show={vF(base+i,step)} hover className="glass" style={{display:"flex",alignItems:"center",gap:22,padding:"22px 30px",textAlign:"left"}}>
            <Idle kind="breathe" style={{fontSize:46}}>{r.emoji}</Idle>
            <div style={{minWidth:170}}><div className="t-label" style={{fontSize:30,color:"var(--blue)"}}>{hl(r.label)}</div></div>
            <div className="t-body" style={{fontSize:27,flex:1}}>{hl(r.detail)}</div>
          </MI>
        ))}
      </div>
      <MI show={vF(base+s.rows.length,step)} className="t-cap" style={{marginTop:28}}>{hl(s.caption)}</MI>
    </div>
  );
}
```

---

## 4. `keymsg` — 핵심 문장 + 칩 묶음
**언제**: 한 문장 주장(hero) + *증거/예시 칩 몇 개*(파일형식·동작·항목)로 받칠 때. `chipNote`·`lead`는 선택.

데이터:
```js
{ id, type:"keymsg", theme:"light", eyebrow,
  title:"사실 *웹 챗봇*도 코딩을 잘한다", lead:"브라우저 속 GPT·클로드도 코드는 물론",
  chips:["xls","docx","py","html"], chipNote:"이런 파일을 만들어 _다운로드_해 쓸 수 있다",
  caption, builds:["title","lead","chips","caption"] }
```
```jsx
function KeyMsg({s,step}){
  return (
    <div className="box">
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <MI show={vF(0,step)} className="t-hero" style={{fontSize:58,marginBottom:18}}>{hl(s.title)}</MI>
      <MI show={vF(1,step)} className="t-sub" style={{fontSize:30,marginBottom:30}}>{hl(s.lead)}</MI>
      <MI show={vF(2,step)} style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center"}}>
        {s.chips.map((c,i)=>(<span key={i} className="glass" style={{padding:"14px 26px",fontSize:30,fontWeight:900,color:"var(--blue)"}}>{hl(c)}</span>))}
      </MI>
      {s.chipNote && <MI show={vF(2,step)} className="t-body" style={{fontSize:26,marginTop:18}}>{hl(s.chipNote)}</MI>}
      <MI show={vF(3,step)} className="t-cap" style={{marginTop:30}}>{hl(s.caption)}</MI>
    </div>
  );
}
```

---

## 5. `versus` — 단방향/양방향 대결 (VS)
**언제**: 두 방식의 *핵심 대조 한 방*(요약·펀치라인). `icon-versus`와 형제지만, 각 카드에 `tag`(분류)+`head`(큰 결론어)+`body`를 둬 결론을 더 키운다.

데이터:
```js
{ id, type:"versus", theme:"light", eyebrow, title,
  left:{ tag:"웹 챗봇", emoji:"📤", head:"단방향", body:"웹에서 만들어\n~다운로드~ 해서 쓴다" },
  right:{ tag:"코딩 에이전트", emoji:"🔄", head:"양방향", body:"로컬 파일을 직접\n_생성·읽기·수정·삭제_" },
  caption, builds:["title","left","vs","right","caption"] }
```
```jsx
function Versus({s,step}){
  const card=(d,accent,vis)=>(
    <MI show={vis} hover className="glass" style={{flex:1,maxWidth:430,padding:"32px 28px",borderTop:`4px solid ${accent}`,display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{fontSize:24,fontWeight:800,color:accent}}>{hl(d.tag)}</div>
      <Idle kind="breathe" style={{fontSize:72,margin:"10px 0"}}>{d.emoji}</Idle>
      <div className="t-hero" style={{fontSize:50,color:accent}}>{hl(d.head)}</div>
      <div className="t-body" style={{marginTop:14,fontSize:28,lineHeight:1.45}}>{hl(d.body)}</div>
    </MI>
  );
  return (
    <div className="box">
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <MI show={vF(0,step)} className="t-title" style={{marginBottom:34}}>{hl(s.title)}</MI>
      <div style={{display:"flex",gap:18,alignItems:"center",justifyContent:"center",width:"100%"}}>
        {card(s.left,PCOL.rose,vF(1,step))}
        <MI show={vF(2,step)} style={{fontSize:42,fontWeight:900,color:"var(--blue)",background:"#fff",borderRadius:999,width:78,height:78,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 24px rgba(59,130,246,.25)",flexShrink:0}}>VS</MI>
        {card(s.right,PCOL.blue,vF(3,step))}
      </div>
      <MI show={vF(4,step)} className="t-cap" style={{marginTop:34}}>{hl(s.caption)}</MI>
    </div>
  );
}
```

---

## 6. `bridge` — A →(라벨)→ B + 설명 카드
**언제**: "예전 A에서 지금 B로, *무엇 때문에* 바뀌었나"처럼 전환의 *원동력*을 화살표에 얹고, 아래에 용어/배경 설명을 붙일 때. `flow`의 변형(설명 카드 포함).

데이터:
```js
{ id, type:"bridge", theme:"light", eyebrow, title,
  fromEmoji:"💿", fromLabel:"SOFTWARE", toEmoji:"🌐", toLabel:"WEB · APP",
  arrowLabels:["☁ 클라우드","🧩 SaaS 확대"],
  explainTitle:"SaaS — 서비스형 소프트웨어",
  explain:"설치·평생 라이선스 대신,\n필요한 만큼 _구독_하고 브라우저·앱으로 *접속해서* 쓰는 방식",
  caption, builds:["title","bridge","explain","caption"] }
```
```jsx
function Bridge({s,step}){
  return (
    <div className="box">
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <MI show={vF(0,step)} className="t-title" style={{marginBottom:34}}>{hl(s.title)}</MI>
      <MI show={vF(1,step)} style={{display:"flex",alignItems:"center",gap:18,justifyContent:"center",width:"100%",marginBottom:30}}>
        <div className="glass" style={{padding:"24px 30px",minWidth:210}}>
          <Idle kind="breathe" style={{fontSize:58}}>{s.fromEmoji}</Idle>
          <div className="t-label" style={{fontSize:28,marginTop:8}}>{hl(s.fromLabel)}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:200,gap:4}}>
          {s.arrowLabels.map((a,i)=>(<div key={i} style={{fontSize:24,fontWeight:800,color:i?PCOL.teal:PCOL.sky}}>{hl(a)}</div>))}
          <div style={{fontSize:52,fontWeight:900,color:"var(--blue)",lineHeight:1}}>→</div>
        </div>
        <div className="glass" style={{padding:"24px 30px",minWidth:210,borderTop:"4px solid var(--blue)"}}>
          <Idle kind="float" style={{fontSize:58}}>{s.toEmoji}</Idle>
          <div className="t-label" style={{fontSize:28,marginTop:8,color:"var(--blue)"}}>{hl(s.toLabel)}</div>
        </div>
      </MI>
      <MI show={vF(2,step)} className="glass" style={{padding:"24px 34px",maxWidth:840,borderLeft:"5px solid var(--teal)",textAlign:"left"}}>
        <div className="t-label" style={{fontSize:28,color:"var(--teal)"}}>{hl(s.explainTitle)}</div>
        <div className="t-body" style={{fontSize:26,marginTop:10}}>{hl(s.explain)}</div>
      </MI>
      <MI show={vF(3,step)} className="t-cap" style={{marginTop:26}}>{hl(s.caption)}</MI>
    </div>
  );
}
```

---

## 7. `tradeoff` — 단점 N + 큰 장점 1 (그래도 하는 이유)
**언제**: "불편하지만 그래도 쓰는 이유" — 단점 카드 2개(로즈) + 장점 카드 1개(블루·넓게)로 *결론(장점)*을 더 크게. `pros-cons`의 강조형.

데이터:
```js
{ id, type:"tradeoff", theme:"light", eyebrow, title,
  cons:[ {emoji:"🛂", label:"심사 필요", detail:"앱스토어 ~심사~를 거쳐야 해 느리다"},
         {emoji:"🐢", label:"수동 업데이트", detail:"사용자가 직접 ~업데이트~ 해야 한다"} ],
  pro:{ emoji:"📲", label:"그래도 쓰는 이유", detail:"카메라·GPS·푸시 등\n_고유 기능_을 제대로 쓸 수 있다" },
  caption, builds:["title","con0","con1","pro","caption"] }
```
```jsx
function Tradeoff({s,step}){
  return (
    <div className="box">
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <MI show={vF(0,step)} className="t-title" style={{fontSize:46,marginBottom:26}}>{hl(s.title)}</MI>
      <div style={{display:"flex",gap:18,justifyContent:"center",width:"100%",marginBottom:22}}>
        {s.cons.map((c,i)=>(
          <MI key={i} show={vF(1+i,step)} hover className="glass" style={{flex:1,maxWidth:400,padding:"22px 24px",borderTop:`4px solid ${PCOL.rose}`}}>
            <Idle kind="wave" style={{fontSize:46}}>{c.emoji}</Idle>
            <div className="t-label" style={{fontSize:28,marginTop:8,color:PCOL.rose}}>{hl(c.label)}</div>
            <div className="t-body" style={{fontSize:25,marginTop:8}}>{hl(c.detail)}</div>
          </MI>
        ))}
      </div>
      <MI show={vF(1+s.cons.length,step)} hover className="glass" style={{maxWidth:840,padding:"24px 34px",borderTop:`4px solid ${PCOL.blue}`,display:"flex",alignItems:"center",gap:24,textAlign:"left"}}>
        <Idle kind="breathe" style={{fontSize:62}}>{s.pro.emoji}</Idle>
        <div>
          <div className="t-label" style={{fontSize:30,color:PCOL.blue}}>{hl(s.pro.label)}</div>
          <div className="t-body" style={{fontSize:27,marginTop:8}}>{hl(s.pro.detail)}</div>
        </div>
      </MI>
      <MI show={vF(2+s.cons.length,step)} className="t-cap" style={{marginTop:24}}>{hl(s.caption)}</MI>
    </div>
  );
}
```

---

## Slide 스위치 등록
```jsx
case "reproduce": return <Reproduce s={s} step={step}/>;
case "platforms": return <Platforms s={s} step={step}/>;
case "reasons":   return <Reasons s={s} step={step}/>;
case "keymsg":    return <KeyMsg s={s} step={step}/>;
case "versus":    return <Versus s={s} step={step}/>;
case "bridge":    return <Bridge s={s} step={step}/>;
case "tradeoff":  return <Tradeoff s={s} step={step}/>;
```

## 다크/핑크 테마 메모
- 다 light/dark/bling 모두에서 동작(글자색·glass는 테마 CSS가 처리). 단 `platforms`/`keymsg`의 칩 배경이 옅은 블루라 다크에서 약하면 칩 배경을 `rgba(255,255,255,.08)`로.
- 섹션 전환·강조 한 장은 dark, "그러나/반전" 한 장은 bling(핑크)로 쓰면 리듬이 산다.
