# 살아있는 모션 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 갤러리의 모든 시각 컴포넌트가 "등장 1회 후 정착해 영원히 사라지지 않되, 그 위에 비파괴적 생명 모션이 계속 도는" 구조로 바뀐다.

**Architecture:** 모션을 2층으로 분리한다 — (1) **등장(enter)**: 1회성(`rep=1, fill=forwards`)이며 정착 상태에서 끝나는 `*In` 키프레임. (2) **생명(live)**: 정착된 도형 위/안/옆에서만 도는 무한 비파괴 루프(14종 효과 헬퍼). `animate(c,stage)`를 `enter()` + `live()`로 나누고, 컴포넌트별 생명 효과는 선언적 `LIFE` 레지스트리로 매핑한다.

**Tech Stack:** 바닐라 JS + CSS keyframes + SVG SMIL. 단일 진실원천 `component-gallery.html`, 파생 키트 `references/qqq-component-kit.js`(`node references/build-kit.js`로 재생성). 테스트는 정적 정규식 가드 `node tests/gloss-guard.mjs`.

## Global Constraints

- 단일 진실원천은 `component-gallery.html`. 키트(`references/qqq-component-kit.js`)는 **직접 수정 금지** — 갤러리 수정 후 `node references/build-kit.js`로 재생성.
- 빌드킷 추출 마커를 깨지 말 것: 키프레임 블록은 `/* ===================== 모션 키트` ~ `@media (prefers-reduced-motion: reduce)` 줄, 로직 블록은 `// ===== 토큰 =====` ~ `// ===== 렌더링 =====`. 새 키프레임/헬퍼는 반드시 이 마커들 **안쪽**에 둔다.
- `@media (prefers-reduced-motion: reduce){ .stage *{animation:none !important;} }`는 유지. SMIL 생명 효과는 reduce일 때 적용을 건너뛰도록 헬퍼가 `prefers-reduced-motion`를 확인(또는 `animate()`가 reduce면 `live()` 생략).
- 읽는 글씨에 지속 모션 금지(SKILL 9번). 생명 모션은 비텍스트 도형·장식에만.
- 절대 `opacity:0` / `scale(0)` / `dashoffset=len`로 끝나는 무한 루프 금지(=사라짐). 등장은 정착에서 끝, 생명은 정착 상태를 기준으로 진동.
- 가드 기준선: 현재 `node tests/gloss-guard.mjs`는 73/74 통과(38 multiply는 기존 무관 실패). 새 작업이 이 73을 깨면 안 되고, 새 가드는 통과해야 한다.
- 컴포넌트별 효과 매핑의 단일 출처: `docs/superpowers/specs/2026-06-28-living-motion-redesign-design.md`의 §4 표.

---

### Task 1: 1회성 등장 키프레임 + 등장 헬퍼 once/forwards 전환 (1층)

모든 등장 모션이 정착에서 끝나도록. 무한 루프 등장(=사라짐)을 제거한다.

**Files:**
- Modify: `component-gallery.html` (키프레임 블록 102~127행 부근, `function A` 326~334행 부근)
- Test: `tests/motion-guard.mjs` (Create)

**Interfaces:**
- Produces: 새 키프레임 `aRiseTIn aRiseBIn aSlideLIn aSlideRIn aPopIn aFadeIn aGrowYIn aGrowXIn aDrawIn aWipeXIn aGrowCIn` (모두 정착 상태에서 종료). `enterA(el,name,o)` — 등장 전용 1회 적용 헬퍼(`rep:1, fill:"forwards"` 강제).

- [ ] **Step 1: 가드 테스트 작성 (실패하도록)**

Create `tests/motion-guard.mjs`:

```js
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "component-gallery.html"), "utf8");
const checks = [];
const ok = (name, cond) => checks.push({ name, pass: !!cond });

// 1회성 등장 키프레임이 정의돼야 한다
for (const kf of ["aRiseTIn","aRiseBIn","aSlideLIn","aSlideRIn","aPopIn","aFadeIn","aGrowYIn","aGrowXIn","aDrawIn","aWipeXIn","aGrowCIn"]) {
  ok(`키프레임 ${kf} 정의`, new RegExp(`@keyframes\\s+${kf}\\b`).test(html));
}
// 1회성 등장 키프레임은 100%에서 숨김(opacity:0 / scale(0) / dashoffset:var(--len))으로 끝나면 안 된다
function endsHidden(kfName){
  const m = html.match(new RegExp(`@keyframes\\s+${kfName}\\s*\\{([\\s\\S]*?)\\}`));
  if(!m) return false;
  const body=m[1];
  const last=body.match(/100%\s*\{([^}]*)\}/);
  if(!last) return false;
  return /opacity:\s*0|scale\(0|scaleX\(0|scaleY\(0|dashoffset:\s*var\(--len\)/.test(last[1]);
}
for (const kf of ["aRiseTIn","aRiseBIn","aSlideLIn","aSlideRIn","aPopIn","aFadeIn","aGrowYIn","aGrowXIn","aDrawIn","aWipeXIn","aGrowCIn"]) {
  ok(`${kf} 100%가 숨김으로 끝나지 않음`, !endsHidden(kf));
}
// enterA 헬퍼 정의
ok("enterA 헬퍼 정의", /function enterA\s*\(/.test(html));

let failed = 0;
for (const c of checks) { console.log(`${c.pass?"PASS":"FAIL"}  ${c.name}`); if(!c.pass) failed++; }
console.log(`\n${checks.length - failed}/${checks.length} passed`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: 실패 확인**

Run: `node tests/motion-guard.mjs`
Expected: FAIL (키프레임 미정의)

- [ ] **Step 3: 1회성 등장 키프레임 추가**

`component-gallery.html`의 키프레임 블록 안(`@media (prefers-reduced-motion...` 줄 **앞**)에 추가:

```css
  /* ── 1회성 등장(정착에서 끝남, 사라지지 않음) ── */
  @keyframes aRiseTIn{0%{opacity:0;transform:translateY(-15px)}100%{opacity:1;transform:none}}
  @keyframes aRiseBIn{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:none}}
  @keyframes aSlideLIn{0%{opacity:0;transform:translateX(-22px)}100%{opacity:1;transform:none}}
  @keyframes aSlideRIn{0%{opacity:0;transform:translateX(22px)}100%{opacity:1;transform:none}}
  @keyframes aPopIn{0%{opacity:0;transform:scale(.55)}60%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
  @keyframes aFadeIn{0%{opacity:0}100%{opacity:1}}
  @keyframes aGrowYIn{0%{transform:scaleY(0)}100%{transform:scaleY(1)}}
  @keyframes aGrowXIn{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
  @keyframes aDrawIn{0%{stroke-dashoffset:var(--len)}100%{stroke-dashoffset:0}}
  @keyframes aWipeXIn{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0 0 0)}}
  @keyframes aGrowCIn{0%{transform:scale(0);opacity:.35}100%{transform:scale(1);opacity:1}}
```

- [ ] **Step 4: `enterA` 헬퍼 추가 + 등장 헬퍼 전환**

`function A(...)` 바로 아래에 추가:

```js
// 등장 전용: 1회 재생 후 정착 유지(절대 사라지지 않음)
function enterA(el,name,o={}){ A(el,name,Object.assign({rep:1,fill:"forwards"},o)); }
```

그리고 등장 헬퍼들이 `*In` 키프레임 + `enterA`를 쓰도록 교체:
- `cascade`: 내부 `A(el,name,...)` → `enterA(el,name+"In",...)`로. 단, 호출부가 넘기는 name은 `"aRiseB"`처럼 기존명이므로, `cascade`가 `name` 끝에 `In`을 붙이도록 한다:
```js
function cascade(stage,name,o={}){
  const {gap=0.16,dur=5,base=0.1,origin,box,ease}=o;
  kids(stage).forEach((el,i)=>enterA(el,name+"In",{dur,delay:base+i*gap,origin,box,ease}));
}
```
- `drawStrokes`: `A(p,"aDraw",...)` → `enterA(p,"aDrawIn",...)`.
- `pop`: `A(el,"aPop",...)` → `enterA(el,"aPopIn",...)`.
- `chart`의 막대: `A(r,horiz?"aGrowX":"aGrowY",...)` → `enterA(r,horiz?"aGrowXIn":"aGrowYIn",...)`; 면 `aFade` → `enterA(...,"aFadeIn",...)`.
- `generic`의 `cascade(...,"aFade")` 최종 폴백 → `cascade`가 이미 `+In` 처리하므로 `"aFade"`는 `aFadeIn`이 됨(자동).

> 주의: `cascade` 호출부가 넘기는 이름이 항상 `*In` 짝을 갖도록 위 11개 키프레임이 커버한다(aRiseT/B, aSlideL/R, aPop, aFade, aGrowY/X). `aRiseT`(20번 직접호출) 등 SHOW 내부 직접 `A(...,"aRiseT"...)` 호출은 Task 4/6에서 정리.

- [ ] **Step 5: 통과 확인 + 기존 가드 유지**

Run: `node tests/motion-guard.mjs`
Expected: PASS (전부)
Run: `node tests/gloss-guard.mjs`
Expected: 73/74 (기존과 동일, 새 실패 없음)

- [ ] **Step 6: 커밋**

```bash
git add component-gallery.html tests/motion-guard.mjs
git commit -m "feat(motion): 1회성 등장 키프레임 + enterA — 등장 후 정착 유지(사라짐 제거 1층)"
```

---

### Task 2: 생명 레이어 헬퍼 라이브러리 (2층, 14종)

정착된 도형 위에 얹는 비파괴 영구 루프 헬퍼와 키프레임.

**Files:**
- Modify: `component-gallery.html` (키프레임 블록 + 로직 블록의 모션 헬퍼 구역)
- Test: `tests/motion-guard.mjs`

**Interfaces:**
- Consumes: `A`, `flowDot`, `lineDots`, `smilRotate`(기존)
- Produces: `cycleHighlight(stage, els, o)`, `altEmphasis(stage, els, o)`, `axisMarker(stage, o)`, `dirPulse(stage, sel, o)`, `breatheGlow(stage, sel, o)`, `pulseLife(stage, sel, o)`, `ripple(stage, cx, cy, o)`, `sparkle(stage, pts, o)`, `sheen(stage, els, o)`, `floatBob(stage, sel, o)`, `wobbleLife(stage, sel, o)`. (회전=기존 `aSpin`+`A`, 시소=39 SMIL 로직 재사용.)

- [ ] **Step 1: 가드 테스트 추가 (실패)**

`tests/motion-guard.mjs`의 `process.exit` 앞에 추가:

```js
for (const fn of ["cycleHighlight","altEmphasis","axisMarker","dirPulse","breatheGlow","pulseLife","ripple","sparkle","sheen","floatBob","wobbleLife"]) {
  ok(`생명 헬퍼 ${fn} 정의`, new RegExp(`function ${fn}\\s*\\(`).test(html));
}
for (const kf of ["aCycleHi","aAlt","aChev","aBreath","aRipple","aSpk","aSheen","aPulseLife","aFloatLife","aWobbleLife","aTravel"]) {
  ok(`생명 키프레임 ${kf} 정의`, new RegExp(`@keyframes\\s+${kf}\\b`).test(html));
}
```

- [ ] **Step 2: 실패 확인**

Run: `node tests/motion-guard.mjs` → FAIL (헬퍼/키프레임 미정의)

- [ ] **Step 3: 생명 키프레임 추가**

키프레임 블록(`@media` 앞)에 추가:

```css
  /* ── 생명 레이어(영구·비파괴) ── */
  @keyframes aCycleHi{0%{filter:brightness(1.18);transform:scale(1.05)}12%{filter:brightness(1.18);transform:scale(1.05)}26%,100%{filter:brightness(.82);transform:scale(1)}}
  @keyframes aAlt{0%{filter:brightness(1.12);transform:scale(1.03)}40%{filter:brightness(1.12);transform:scale(1.03)}55%,100%{filter:brightness(.8);transform:scale(.985)}}
  @keyframes aChev{0%,100%{opacity:.25}40%{opacity:1}}
  @keyframes aBreath{0%,100%{transform:scale(.85);opacity:.4}50%{transform:scale(1.15);opacity:.75}}
  @keyframes aRipple{0%{transform:scale(1);opacity:.8}100%{transform:scale(3.2);opacity:0}}
  @keyframes aSpk{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1) rotate(20deg)}}
  @keyframes aSheen{0%{transform:translateX(-160%) skewX(-18deg)}55%,100%{transform:translateX(320%) skewX(-18deg)}}
  @keyframes aPulseLife{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
  @keyframes aFloatLife{0%,100%{transform:translateY(-5px)}50%{transform:translateY(5px)}}
  @keyframes aWobbleLife{0%,100%{transform:rotate(0)}25%{transform:rotate(-10deg)}75%{transform:rotate(10deg)}}
  @keyframes aTravel{0%{left:6%;opacity:0}8%{opacity:1}80%{left:94%;opacity:1}90%{left:94%;opacity:0}100%{left:6%;opacity:0}}
```

- [ ] **Step 4: 생명 헬퍼 추가**

로직 블록의 모션 헬퍼 구역(`// ===== 컴포넌트별 맞춤 모션 =====` **앞**)에 추가:

```js
// ===== 생명 레이어 헬퍼 (정착 후 영구·비파괴) =====
function _items(stage, els){ return Array.isArray(els) ? els : [...stage.querySelectorAll(els)]; }

// 1 강조 순회: 조각/카드/층을 하나씩 차례로 강조
function cycleHighlight(stage, els, o={}){
  const {step=0.9}=o; const list=_items(stage, els||":scope > *"); const n=list.length; if(!n) return;
  list.forEach((el,i)=>{ el.style.transformBox="fill-box"; el.style.transformOrigin="center";
    A(el,"aCycleHi",{dur:n*step,delay:i*step,rep:"infinite",ease:"ease-in-out"}); });
}
// 2 양쪽 번갈아: 두(또는 N) 영역 교대 강조
function altEmphasis(stage, els, o={}){
  const {dur=3.0}=o; const list=_items(stage, els); const n=list.length; if(!n) return;
  list.forEach((el,i)=>{ el.style.transformBox="fill-box"; el.style.transformOrigin="center";
    A(el,"aAlt",{dur,delay:i*(dur/n),rep:"infinite",ease:"ease-in-out"}); });
}
// 4 축 따라 이동 마커: 가로 축을 따라 글로우 마커가 한 방향 이동
function axisMarker(stage, o={}){
  const {dur=4.5,color=RO,top}=o; const box=stage.firstElementChild||stage; box.style.position="relative";
  const mk=document.createElement("div");
  mk.style.cssText=`position:absolute;width:18px;height:18px;border-radius:50%;background:radial-gradient(circle,${color},#fff0 70%);box-shadow:0 0 14px ${color};transform:translate(-50%,-50%);left:6%;top:${top!=null?top+"px":"50%"};pointer-events:none`;
  box.appendChild(mk); A(mk,"aTravel",{dur,rep:"infinite",ease:EZL});
}
// 5 방향 펄스: 화살표/마디가 순서대로 톡톡 빛남
function dirPulse(stage, sel, o={}){
  const {dur=1.4,gap=0.18}=o; const list=[...stage.querySelectorAll(sel)];
  list.forEach((el,i)=>{ el.style.transformBox="fill-box"; A(el,"aChev",{dur,delay:i*gap,rep:"infinite",ease:"ease-in-out"}); });
}
// 6 글로우 호흡: 대상 뒤에 헤일로를 깔고 숨쉬게 함(글씨 정지)
function breatheGlow(stage, sel, o={}){
  const {color=AM,size=130}=o; const t=stage.querySelector(sel)||stage.firstElementChild; if(!t) return;
  const host=t.parentElement||stage; if(getComputedStyle(host).position==="static") host.style.position="relative";
  const halo=document.createElement("div");
  halo.style.cssText=`position:absolute;left:50%;top:50%;width:${size}px;height:${size}px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,${color} 0%,transparent 70%);filter:blur(8px);z-index:0;pointer-events:none`;
  host.insertBefore(halo, host.firstChild); A(halo,"aBreath",{dur:3.4,rep:"infinite",ease:"ease-in-out"});
}
// 7 맥박
function pulseLife(stage, sel, o={}){
  const {dur=1.6}=o; const t=stage.querySelector(sel)||stage.firstElementChild; if(!t) return;
  t.style.transformBox="fill-box"; t.style.transformOrigin="center"; A(t,"aPulseLife",{dur,rep:"infinite",ease:"ease-in-out"});
}
// 8 파동 펄스: 중심(cx,cy)에서 SVG 링이 퍼짐
function ripple(stage, cx, cy, o={}){
  const {color=TL,dur=2.6,n=3,r0=14}=o; const svg=stage.querySelector("svg"); if(!svg) return;
  for(let i=0;i<n;i++){ const c=document.createElementNS(SVGNS,"circle");
    c.setAttribute("cx",cx); c.setAttribute("cy",cy); c.setAttribute("r",r0);
    c.setAttribute("fill","none"); c.setAttribute("stroke",color); c.setAttribute("stroke-width","2.5");
    c.style.transformBox="fill-box"; c.style.transformOrigin=`${cx}px ${cy}px`;
    A(c,"aRipple",{dur,delay:i*(dur/n),rep:"infinite",ease:"ease-out"});
    svg.insertBefore(c, svg.firstChild); }
}
// 9 반짝임: 좌표 목록 위에 ✦ 스파클을 깜빡임 (pts: [[x,y],...] 또는 sel)
function sparkle(stage, pts, o={}){
  const {color=AM,dur=1.8,size=14}=o; const svg=stage.querySelector("svg");
  let list=pts;
  if(typeof pts==="string"){ list=[...stage.querySelectorAll(pts)].map(e=>{
    if(svg){ return [ +e.getAttribute("cx"), +e.getAttribute("cy") ]; }
    return [e.offsetLeft+e.offsetWidth/2, e.offsetTop+e.offsetHeight/2]; }); }
  list.forEach(([x,y],i)=>{
    if(svg){ const t=document.createElementNS(SVGNS,"text");
      t.setAttribute("x",x); t.setAttribute("y",y+5); t.setAttribute("text-anchor","middle");
      t.setAttribute("font-size",size); t.setAttribute("fill",color); t.textContent="✦";
      t.style.transformBox="fill-box"; t.style.transformOrigin="center";
      A(t,"aSpk",{dur,delay:(i%5)*0.35,rep:"infinite",ease:"ease-in-out"}); svg.appendChild(t); }
    else { const d=document.createElement("div"); d.textContent="✦";
      d.style.cssText=`position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%);color:${color};font-size:${size}px;pointer-events:none`;
      (stage.firstElementChild||stage).appendChild(d); A(d,"aSpk",{dur,delay:(i%5)*0.35,rep:"infinite"}); }
  });
}
// 10 광택 스윕: 막대/카드 위로 빛줄기가 지나감
function sheen(stage, els, o={}){
  const {gap=0.4,dur=3.0}=o; const list=_items(stage, els); 
  list.forEach((el,i)=>{ if(getComputedStyle(el).position==="static") el.style.position="relative";
    el.style.overflow="hidden"; const s=document.createElement("div");
    s.style.cssText=`position:absolute;top:0;left:0;width:55%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);pointer-events:none`;
    el.appendChild(s); A(s,"aSheen",{dur,delay:i*gap,rep:"infinite",ease:"ease-in-out"}); });
}
// 11 미세 부유
function floatBob(stage, sel, o={}){
  const {dur=2.8,gap=0.3}=o; [...stage.querySelectorAll(sel)].forEach((el,i)=>{
    el.style.transformBox="fill-box"; A(el,"aFloatLife",{dur,delay:i*gap,rep:"infinite",ease:"ease-in-out"}); });
}
// 12 흔들림
function wobbleLife(stage, sel, o={}){
  const {dur=1.8}=o; const t=stage.querySelector(sel); if(!t) return;
  t.style.transformOrigin="50% 80%"; A(t,"aWobbleLife",{dur,rep:"infinite",ease:"ease-in-out"});
}
```

> `EZL`, `RO`, `AM`, `TL`, `SVGNS`는 기존 토큰/상수(스코프 내 존재). 회전(13)은 기존 `A(el,"aSpin",...)`, 시소(14)는 SHOW[39]의 SMIL 로직을 그대로 둔다(Task 4).

- [ ] **Step 5: 통과 확인**

Run: `node tests/motion-guard.mjs` → PASS
Run: `node tests/gloss-guard.mjs` → 73/74 유지

- [ ] **Step 6: 커밋**

```bash
git add component-gallery.html tests/motion-guard.mjs
git commit -m "feat(motion): 생명 레이어 헬퍼 14종(강조순회·반짝임·광택·파동 등) 추가"
```

---

### Task 3: animate() 를 enter+live 로 분리 + LIFE 레지스트리 골격

**Files:**
- Modify: `component-gallery.html` (`animate` 530~533행 부근, `SHOW` 직후)
- Test: `tests/motion-guard.mjs`

**Interfaces:**
- Consumes: `SHOW`, `generic`, `chart`
- Produces: `const LIFE = {}` (번호→`stage=>{}`), `function live(c,stage)`, 재정의된 `function animate(c,stage)`

- [ ] **Step 1: 가드 추가 (실패)**

```js
ok("LIFE 레지스트리 정의", /const LIFE\s*=/.test(html));
ok("live 함수 정의", /function live\s*\(/.test(html));
ok("animate가 enter+live 호출", /enter\(c,\s*stage\)[\s\S]*live\(c,\s*stage\)/.test(html));
```

- [ ] **Step 2: 실패 확인** → `node tests/motion-guard.mjs` FAIL

- [ ] **Step 3: animate 재정의 + LIFE 골격**

`const SHOW={...}` 블록 **뒤**, `function generic` 위(또는 `animate` 정의부)에 삽입/교체:

```js
// 등장(1회): 기존 SHOW/generic/chart 가 정착 키프레임으로 1회 재생
function enter(c,stage){ (SHOW[c.n] || (()=>generic(c,stage)))(stage); }
// 생명(영구): 컴포넌트별 LIFE 효과 적용
const LIFE = {};
function live(c,stage){ const f=LIFE[c.n]; if(f){ try{ f(stage); }catch(e){} } }
```

그리고 `animate` 교체:

```js
function animate(c,stage){
  if(!stage || stage.dataset.animed) return; stage.dataset.animed="1";
  try{ enter(c,stage); }catch(e){}
  var reduce = typeof window!=="undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!reduce) live(c,stage);
}
```

- [ ] **Step 4: 통과 확인** → `node tests/motion-guard.mjs` PASS, `node tests/gloss-guard.mjs` 73/74

- [ ] **Step 5: 커밋**

```bash
git add component-gallery.html tests/motion-guard.mjs
git commit -m "refactor(motion): animate를 enter(1회)+live(영구)로 분리, LIFE 레지스트리 추가"
```

---

### Task 4: "현행 유지" 6종의 영구 모션을 SHOW→LIFE 로 이전 (26·27·35·37·39·45)

이들은 이미 비파괴·영구다. 등장과 섞여 SHOW 안에 있는 **무한 모션 부분만 LIFE로 옮기고**, SHOW에는 등장(정착)만 남긴다.

**Files:**
- Modify: `component-gallery.html` (SHOW[26,27,35,37,39,45], LIFE)
- Test: `tests/motion-guard.mjs`

**Interfaces:**
- Consumes: `flowDot`, `lineDots`, `smilRotate`, `pop`, `drawStrokes`
- Produces: `LIFE[26] LIFE[27] LIFE[35] LIFE[37] LIFE[39] LIFE[45]`

- [ ] **Step 1: 가드 추가 (실패)**

```js
for (const n of [26,27,35,37,39,45]) ok(`LIFE[${n}] 존재`, new RegExp(`\\b${n}\\s*:\\s*s\\s*=>`).test(html.split("const LIFE")[1]||""));
```

- [ ] **Step 2: 실패 확인** → FAIL

- [ ] **Step 3: SHOW에서 무한 모션을 LIFE로 이전**

`SHOW[26]`을 등장만 남기고(점 순환 제거), `LIFE[26]`에 flowDot 추가:
```js
// SHOW
26:s=>{ pop(s,"circle",{base:0.3,gap:0.22}); },
// LIFE
26:s=>{ flowDot(s,"M85 29 a56 56 0 1 1 -0.1 0",BL,{dur:3.4,delay:0,r:4}); },
```
`27`: 등장은 없음(톱니는 바로 보임) → `SHOW[27]` 비우거나 제거, 회전을 LIFE로:
```js
27:s=>{},
// LIFE
27:s=>{ const gs=[...s.querySelectorAll("g")].filter(g=>g.getAttribute("filter"));
  const cf=[{t:12,d:"normal"},{t:13.5,d:"reverse"},{t:7,d:"normal"}];
  gs.forEach((g,i)=>{const c=cf[i]||cf[0]; A(g,"aSpin",{dur:c.t,ease:"linear",box:"fill-box",origin:"center",dir:c.d,rep:"infinite"});}); },
```
`35`: 등장은 선 그림+점 pop(정착), 무한 lineDots/flowDot을 LIFE로:
```js
35:s=>{ drawStrokes(s,{gap:0.12,dur:5,base:0.2}); pop(s,"circle",{base:0.7,gap:0.16}); },
// LIFE
35:s=>{ [...s.querySelectorAll("path")].forEach((p,i)=>{const m=(p.getAttribute("d")||"").match(/M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+)/);
  if(m) flowDot(s,`M${m[1]} ${m[2]} L${m[3]} ${m[4]}`,EM,{dur:1.8,delay:1+i*0.2,r:3});}); },
```
`37`: 스펙트럼 마커 — 현재 등장 후 정착(`aSweepSettle`은 1회성으로 충분). 마커 생성은 SHOW에 두되 `aSweepSettle`을 `enterA`로 1회 적용:
```js
37:s=>{ const o=s.firstElementChild; o.style.position="relative"; const bar=o.firstElementChild;
  const mk=document.createElement("div");
  mk.style.cssText=`position:absolute;width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid ${INK};box-shadow:0 3px 9px rgba(15,23,42,.3);transform:translateX(-50%);left:6%`;
  mk.style.top=(bar.offsetTop+bar.offsetHeight/2-10)+"px"; mk.style.setProperty("--settle","87%"); o.appendChild(mk);
  enterA(mk,"aSweepSettle",{dur:5,ease:EZL}); },
// LIFE[37] 없음(정착 후 정지) — 또는 미세 bob 원하면 추후
```
`39`: SMIL 시소는 무한이므로 LIFE로 이전(SHOW[39]는 추 생성/정착만):
```js
// SHOW[39] 그대로 두되 SMIL 부착을 LIFE로 옮김. 현재 SHOW[39]의 mk(...) 3줄을 LIFE[39]로 이동.
39:s=>{},
39 /*LIFE*/:s=>{ const kt="0;0.16;0.30;0.44;0.74;1", ks=".3 0 .3 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.5 0 .4 1", dur="4.4s";
  const mk=(el,type,vals)=>{ if(!el)return; const a=document.createElementNS(SVGNS,"animateTransform");
    a.setAttribute("attributeName","transform"); a.setAttribute("type",type); a.setAttribute("values",vals);
    a.setAttribute("keyTimes",kt); a.setAttribute("calcMode","spline"); a.setAttribute("keySplines",ks);
    a.setAttribute("dur",dur); a.setAttribute("repeatCount","indefinite"); el.insertBefore(a,el.firstChild); };
  mk(s.querySelector(".js-beam"),"rotate","0 100 38;11 100 38;6 100 38;9 100 38;8 100 38;0 100 38");
  mk(s.querySelector(".js-panR"),"translate","0 0;0 10.7;0 5.9;0 8.8;0 7.8;0 0");
  mk(s.querySelector(".js-panL"),"translate","0 0;0 -10.7;0 -5.9;0 -8.8;0 -7.8;0 0"); },
```
`45`: 갸우뚱+물음표는 무한 → LIFE로:
```js
45:s=>{ const d=s.firstElementChild; d.style.position="relative"; d.style.paddingTop="18px";
  const q=document.createElement("div"); q.textContent="?";
  q.style.cssText=`position:absolute;left:50%;top:-8px;font-size:30px;font-weight:900;color:${BL};text-shadow:0 2px 6px ${BL}55`;
  d.insertBefore(q,d.firstChild); enterA(q,"aQMark",{dur:3.2,ease:EZ}); },
45 /*LIFE*/:s=>{ const emo=s.firstElementChild&&s.firstElementChild.querySelector("*"); 
  const e=[...s.querySelectorAll("*")].find(x=>x.textContent&&/\p{Emoji}/u.test(x.textContent)); 
  if(e){ e.style.display="inline-block"; e.style.transformOrigin="50% 85%"; A(e,"aWobble",{dur:1.5,ease:"ease-in-out",rep:"infinite"}); } },
```
> 키프레임 `aSpin aWobble aQMark aSweepSettle`은 기존 무한 키프레임이므로 **삭제하지 말 것**(생명/1회 양쪽에서 쓰임). `aQMark`/`aSweepSettle`은 `enterA`로 1회 적용.

- [ ] **Step 4: 통과 확인**

Run: `node tests/motion-guard.mjs` → PASS
브라우저 확인: `python -m http.server 8731` 후 `http://localhost:8731/component-gallery.html` 에서 26·27·35·37·39·45 가 **사라지지 않고** 계속 움직이는지 육안 확인.

- [ ] **Step 5: 커밋**

```bash
git add component-gallery.html tests/motion-guard.mjs
git commit -m "refactor(motion): 현행 유지 6종(26·27·35·37·39·45) 영구 모션을 LIFE로 이전"
```

---

### Task 5: ⚠️ 재설계 5종 — bloom/push/growC 제거 (28·58·60·61·62)

모션의 본질이 "사라짐"인 것들. 등장은 정착, 생명은 강조순회/광택/반짝임으로 교체.

**Files:**
- Modify: `component-gallery.html` (SHOW[28,58,60,61,62], `bloomWedges`, LIFE)
- Test: `tests/motion-guard.mjs`

**Interfaces:**
- Consumes: `cycleHighlight`, `sheen`, `sparkle`, `drawStrokes`, `glossWedge` 결과 노드
- Produces: `LIFE[28] LIFE[58] LIFE[60] LIFE[61] LIFE[62]`

- [ ] **Step 1: 가드 추가 (실패)**

```js
// 재설계 대상은 더 이상 사라짐 모션을 호출하면 안 된다
const showBlock = html.slice(html.indexOf("const SHOW="), html.indexOf("function generic"));
for (const n of [28,60,61]) ok(`SHOW[${n}] bloomWedges 미사용`, !new RegExp(`${n}:s=>bloomWedges`).test(showBlock));
ok("SHOW[58] aPush 미사용", !/aPush/.test(showBlock));
ok("SHOW[62] aGrowC 미사용(1회는 aGrowCIn만)", !/"aGrowC"/.test(showBlock));
for (const n of [28,58,60,61,62]) ok(`LIFE[${n}] 존재`, new RegExp(`\\b${n}\\s*:\\s*s\\s*=>`).test(html.split("const LIFE")[1]||""));
```

- [ ] **Step 2: 실패 확인** → FAIL

- [ ] **Step 3: 등장 정착 + 생명 교체**

```js
// SHOW: 등장만(조각/도형 정착)
28:s=>{ [...s.querySelectorAll("path")].filter(p=>{const f=p.getAttribute("fill");return f&&f!=="none";})
        .forEach((p,i)=>enterA(p,"aPopIn",{dur:.6,delay:0.1+i*0.12,box:"fill-box",origin:"center"})); },
58:s=>{ /* 막대·세그먼트는 등장 즉시 정착(별도 모션 없음) */ },
60:s=>{ [...s.querySelectorAll("path")].filter(p=>{const f=p.getAttribute("fill");return f&&f!=="none";})
        .forEach((p,i)=>enterA(p,"aPopIn",{dur:.6,delay:0.1+i*0.12,box:"fill-box",origin:"center"})); },
61:s=>{ [...s.querySelectorAll("path")].filter(p=>{const f=p.getAttribute("fill");return f&&f!=="none";})
        .forEach((p,i)=>enterA(p,"aPopIn",{dur:.6,delay:0.1+i*0.12,box:"fill-box",origin:"center"})); },
62:s=>{ const ps=[...s.querySelectorAll("polygon")]; const data=ps[ps.length-1];
        if(data) enterA(data,"aGrowCIn",{dur:.9,box:"view-box",origin:"85px 85px"}); },

// LIFE: 강조 순회 / 광택 / 반짝임
28:s=>cycleHighlight(s, [...s.querySelectorAll("path")].filter(p=>{const f=p.getAttribute("fill");return f&&f!=="none";}), {step:0.85}),
58:s=>sheen(s, kids(s).map(r=>r.lastElementChild).filter(Boolean)),
60:s=>cycleHighlight(s, [...s.querySelectorAll("path")].filter(p=>{const f=p.getAttribute("fill");return f&&f!=="none";}), {step:0.85}),
61:s=>cycleHighlight(s, [...s.querySelectorAll("path")].filter(p=>{const f=p.getAttribute("fill");return f&&f!=="none";}), {step:0.85}),
62:s=>{ const ps=[...s.querySelectorAll("polygon")]; const data=ps[ps.length-1];
        const pts=(data?.getAttribute("points")||"").trim().split(/\s+/).map(pr=>pr.split(",").map(Number));
        sparkle(s, pts, {color:BL,size:13}); },
```

`bloomWedges` 함수는 이제 미사용 → 정의 삭제(또는 남겨도 무방하나 가드가 SHOW 호출만 검사). 깔끔히 제거 권장.

- [ ] **Step 4: 통과 확인 + 육안**

Run: `node tests/motion-guard.mjs` → PASS
Run: `node tests/gloss-guard.mjs` → 73/74 (28 glossWedge·Sg 가드 유지되는지 확인: render는 안 건드렸으므로 유지됨)
브라우저: 28·60·61 조각이 **사라지지 않고** 강조만 순회, 62 면 유지+꼭짓점 반짝, 58 경계 안 흔들림.

- [ ] **Step 5: 커밋**

```bash
git add component-gallery.html tests/motion-guard.mjs
git commit -m "fix(motion): ⚠️재설계 5종(28·58·60·61·62) bloom/push/growC 제거→강조순회·광택·반짝임"
```

---

### Task 6: 나머지 전 컴포넌트 LIFE 매핑 (설계 §4 표 전체)

남은 모든 번호의 생명 효과를 LIFE에 채운다. 결정표가 단일 출처.

**Files:**
- Modify: `component-gallery.html` (LIFE 레지스트리 완성)
- Test: `tests/motion-guard.mjs`

**Interfaces:**
- Consumes: Task 2의 생명 헬퍼 전부, 기존 `flowDot/lineDots/pop`
- Produces: 효과가 "0 정지"가 아닌 모든 번호에 `LIFE[n]`

- [ ] **Step 1: 가드 추가 (실패)**

```js
const lifeBlock = html.split("const LIFE")[1] || "";
// 0(정지) 대상: 4,38,70,71,72,73,74 — LIFE 엔트리가 없어야 한다
for (const n of [4,38,70,71,72,73,74]) ok(`LIFE[${n}] 없음(정지)`, !new RegExp(`\\b${n}\\s*:\\s*s\\s*=>`).test(lifeBlock));
// 효과 있는 대표 번호 존재 확인
for (const n of [1,2,3,5,6,7,8,12,14,17,19,20,29,31,40,41,43,44,46,53,56,63,65,82]) ok(`LIFE[${n}] 존재`, new RegExp(`\\b${n}\\s*:\\s*s\\s*=>`).test(lifeBlock));
```

- [ ] **Step 2: 실패 확인** → FAIL

- [ ] **Step 3: LIFE 매핑 완성**

`const LIFE = { ...Task4/5 항목... }`에 아래를 모두 추가. (선택자는 각 컴포넌트 render 구조 기준 — 카드/칩은 `kids(s)`, SVG 점은 `circle`, 텍스트 키워드는 해당 노드.)

```js
// 텍스트류
1:s=>breatheGlow(s, ".kw, h1, .big, :scope *", {color:AM}),
2:s=>breatheGlow(s, ":scope *", {color:BL}),
3:s=>sheen(s, [s.firstElementChild].filter(Boolean)),
5:s=>pulseLife(s, ".quote-mark, :scope *"),   // 따옴표 글리프; 없으면 첫 요소
6:s=>sheen(s, [s.querySelector(".divider, hr, .ln")||s.firstElementChild].filter(Boolean)),
7:s=>wobbleLife(s, ".qmark, :scope *"),
// 카드·목록(B,I)
8:s=>cycleHighlight(s, kids(s)),
9:s=>cycleHighlight(s, kids(s)),
10:s=>sparkle(s, kids(s).map(e=>[e.offsetLeft+e.offsetWidth/2,e.offsetTop+8])),
11:s=>sparkle(s, kids(s).map(e=>[e.offsetLeft+e.offsetWidth/2,e.offsetTop+8])),
12:s=>dirPulse(s, ".num, .badge, :scope > *"),
13:s=>sparkle(s, kids(s).map(e=>[e.offsetLeft+14,e.offsetTop+e.offsetHeight/2])),
48:s=>sheen(s, kids(s)),
51:s=>sparkle(s, kids(s).map(e=>[e.offsetLeft+14,e.offsetTop+e.offsetHeight/2])),
// 비교(C)
14:s=>altEmphasis(s, kids(s)),
15:s=>dirPulse(s, "path, .arrow, :scope > *"),
16:s=>altEmphasis(s, kids(s)),
17:s=>{ altEmphasis(s, kids(s).filter(e=>!/vs/i.test(e.textContent))); pulseLife(s, ".vs, .badge"); },
18:s=>cycleHighlight(s, kids(s)),
// 흐름(D)
19:s=>dirPulse(s, "path, polyline, .arrow, :scope > *"),
20:s=>lineDots(s,[BL,EM,AM,RO]),
21:s=>dirPulse(s, ":scope > *"),
22:s=>dirPulse(s, "path, polyline, .arrow"),
23:s=>dirPulse(s, "path, polyline, .arrow, :scope > *"),
24:s=>dirPulse(s, ".chev, path, :scope > *"),
25:s=>cycleHighlight(s, kids(s)),
// 관계·구조(F)
29:s=>lineDots(s,[BL,EM,AM,RO]),
30:s=>lineDots(s,[RO,EM,BL]),
31:s=>cycleHighlight(s, kids(s)),
32:s=>cycleHighlight(s, kids(s)),
33:s=>lineDots(s,[BL,EM,RO]),
34:s=>lineDots(s,[BL,EM,AM]),
36:s=>dirPulse(s, ":scope > *"),
40:s=>ripple(s, 85, 75, {color:AM}),
// 타임라인(G)
41:s=>axisMarker(s,{color:RO}),
42:s=>cycleHighlight(s, kids(s)),
43:s=>breatheGlow(s, ".moment, :scope *", {color:BL}),
// 수업(H)
44:s=>floatBob(s, ".bubble, :scope *"),
46:s=>{ const ok=s.querySelector("span"); if(ok) sparkle(s,[[ok.offsetLeft+ok.offsetWidth/2, ok.offsetTop+ok.offsetHeight/2]],{color:EM}); },
47:s=>sparkle(s, [...s.querySelectorAll(".check, span")].slice(0,1).map(e=>[e.offsetLeft+e.offsetWidth/2,e.offsetTop+e.offsetHeight/2])),
// 마무리(I)
49:s=>lineDots(s,[EM,AM,SK,RO]),
50:s=>breatheGlow(s, ":scope *", {color:AM}),
// 차트(J,K)
52:s=>sparkle(s, [[ (s.firstElementChild?.offsetWidth||120)/2, (s.firstElementChild?.offsetHeight||60)/2 ]], {color:AM}),
53:s=>sheen(s, [...s.querySelectorAll("rect")].filter(r=>+(r.getAttribute("height")||0)>0)),
54:s=>sheen(s, kids(s).map(it=>it.lastElementChild&&it.lastElementChild.firstElementChild).filter(Boolean)),
55:s=>sheen(s, [...s.querySelectorAll("line")]),
56:s=>{ const p=s.querySelector("polyline,path[fill='none']"); if(p) flowDot(s,p.getAttribute("d")||polyToPath(p),BL,{dur:2.6}); },
57:s=>[...s.querySelectorAll("line,polyline")].forEach((p,i)=>flowDot(s, lineToPath(p), col(i), {dur:2.4,delay:i*0.3})),
59:s=>sheen(s, [s.querySelector("polygon")].filter(Boolean)),
63:s=>sparkle(s, "circle"),
64:s=>sparkle(s, "circle"),
65:s=>dirPulse(s, "rect"),
66:s=>dirPulse(s, "path, polygon, :scope > *"),
67:s=>sheen(s, [...s.querySelectorAll("rect")]),
68:s=>dirPulse(s, "rect"),
69:s=>{ sheen(s,[...s.querySelectorAll("rect")].filter(r=>+(r.getAttribute("height")||0)>0)); const p=s.querySelector("polyline,path[fill='none']"); if(p) flowDot(s,p.getAttribute("d")||polyToPath(p),RO,{dur:2.6}); },
// 로고(L)
82:s=>sheen(s, kids(s)),
```

보조 헬퍼(폴리라인→path 변환)가 56·57·69에서 필요하면 모션 헬퍼 구역에 추가:

```js
function polyToPath(p){ const pts=(p.getAttribute("points")||"").trim(); return pts? "M"+pts.replace(/\s+/g," ").replace(/,/g," ") : (p.getAttribute("d")||""); }
function lineToPath(ln){ if(ln.tagName.toLowerCase()==="line"){ return `M${ln.getAttribute("x1")} ${ln.getAttribute("y1")} L${ln.getAttribute("x2")} ${ln.getAttribute("y2")}`; } return polyToPath(ln); }
```

> 선택자는 실제 render 구조에 맞춰 실행 중 미세 조정 가능. 핵심 불변식: **LIFE는 비파괴**(도형/글씨를 사라지게 하지 않음), 0(정지) 7종엔 엔트리 없음.

- [ ] **Step 4: 통과 확인 + 전수 육안**

Run: `node tests/motion-guard.mjs` → PASS
Run: `node tests/gloss-guard.mjs` → 73/74
브라우저에서 카테고리별로 스크롤하며 **어떤 컴포넌트도 정착 후 사라지지 않는지** 전수 확인. (특히 0 정지 7종은 등장 후 완전 정지.)

- [ ] **Step 5: 커밋**

```bash
git add component-gallery.html tests/motion-guard.mjs
git commit -m "feat(motion): 전 컴포넌트 LIFE 생명 효과 매핑 완성(설계 §4)"
```

---

### Task 7: 키트 재생성 · 문서 갱신 · reduced-motion 검증

**Files:**
- Modify: `references/qqq-component-kit.js` (생성물), `references/component-motion.md`, `references/motion-system.md`, `SKILL.md`
- Test: `tests/motion-guard.mjs`, `tests/gloss-guard.mjs`

- [ ] **Step 1: 키트 재생성**

Run: `node references/build-kit.js`
Expected: `재생성 완료: references/qqq-component-kit.js (NNNNN bytes)`

- [ ] **Step 2: 키트 동기화 가드 추가**

`tests/motion-guard.mjs` 끝에:

```js
const kit = readFileSync(join(root, "references", "qqq-component-kit.js"), "utf8");
ok("키트에 LIFE 포함", /const LIFE\s*=/.test(kit));
ok("키트에 cycleHighlight 포함", /function cycleHighlight/.test(kit));
ok("키트에 aRiseTIn 키프레임 포함", /aRiseTIn/.test(kit));
ok("키트에 bloomWedges 미포함(재설계 반영)", !/function bloomWedges/.test(kit));
```

Run: `node tests/motion-guard.mjs` → PASS (재생성으로 동기화됨)

- [ ] **Step 3: 문서 갱신**

`references/component-motion.md`:
- §"번호별 시그니처 모션" 표를 "등장 1회 + 생명 레이어" 기준으로 갱신(설계 §4 요약).
- 상단에 원칙 1줄 추가: "모든 컴포넌트는 등장 후 정착해 사라지지 않으며, 그 위에 비파괴 생명 레이어가 영구히 돈다."

`references/motion-system.md` 및 `SKILL.md`:
- "지속 모션은 비텍스트 도형/장식에만, 등장은 1회 후 정착(절대 opacity→0 루프 금지)" 원칙 명시.

- [ ] **Step 4: reduced-motion 검증**

브라우저 DevTools에서 `prefers-reduced-motion: reduce` 에뮬레이트 → 모든 컴포넌트가 즉시 정착·정지(생명 레이어 없음)인지 확인.

- [ ] **Step 5: 최종 가드**

Run: `node tests/motion-guard.mjs` → 전부 PASS
Run: `node tests/gloss-guard.mjs` → 73/74 (기존 38 외 실패 없음)

- [ ] **Step 6: 커밋**

```bash
git add references/qqq-component-kit.js references/component-motion.md references/motion-system.md SKILL.md tests/motion-guard.mjs
git commit -m "chore(motion): 키트 재생성 + 문서 갱신(등장1회+생명레이어 원칙) + reduced-motion 검증"
```

---

## 정리 (구현 후)

- 임시 산출물 `_effect-menu-demo.html`, `_effect-decisions.md`는 참고용. 유지하려면 `references/`로 승격, 아니면 삭제(별도 커밋).
- 실제 슬라이드 캔버스(1200×900)에서 글씨 24px+ 및 읽는 글씨 무모션 최종 확인.
