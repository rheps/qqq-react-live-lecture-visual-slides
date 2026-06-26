# 라이트 광택 컴포넌트 표준 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 밝은 파스텔 배경에서 도형이 깨지지 않으면서 remotion급 입체·광택을 내는 "라이트 광택 표준"을 대표 6개 컴포넌트에 확립한다.

**Architecture:** `component-gallery.html` 상단 `<script>`에 공용 광택 키트(그라데이션/글로우 `<defs>` 생성기 + JS 헬퍼)를 추가하고, 대표 6개의 `render()`를 그 헬퍼로 교체한다. 같은 레시피를 `references/design-and-readability.md`에 글로 명문화하여 생성 슬라이드도 동일 광택을 갖게 한다. 정적 가드 스크립트로 회귀를 막는다.

**Tech Stack:** 순수 HTML/SVG/CSS + 인라인 JS (빌드 없음). 가드 테스트는 Node ESM 스크립트(`node tests/gloss-guard.mjs`).

## Global Constraints

- 라이트 배경 유지: `linear-gradient(135deg,#EFF6FF 0%,#F0FDFA 50%,#F0F9FF 100%)` — 변경 금지.
- 색 팔레트만 사용: `BL=#3B82F6, SK=#0EA5E9, TL=#14B8A6, EM=#10B981, AM=#F59E0B, RO=#F43F5E, INK=#0F172A, MUT=#475569, GRID=#E2E8F0`. 보라(violet/indigo/plum) 금지.
- 번호(n)·`type` 문자열·컴포넌트 `en`/`ko`/`use` 텍스트는 변경 금지 (registry 호환).
- 도형 채움은 불투명-광택이 기본. 도형 `fill`에 `rgba(255,255,255,…)` 같은 반투명 단색 금지(벤의 통제된 multiply 예외만 허용).
- 다크 테마는 이번 범위 밖.
- 대표 6개 = **35(hub-spoke), 33(trinity), 31(pyramid), 28(segmented-cycle), 27(gear-cycle), 38(venn)**. (설계 문서의 "8번"은 28번의 오기 — 본 계획이 우선.)
- 작업 위치: `C:\AI\qqq-react-live-lecture-visual-slides`. 각 컴포넌트 완료 후 글로벌(`~/.claude/skills/qqq-react-live-lecture-visual-slides`)로 동기화는 Task 8에서 일괄.

---

## File Structure

- `component-gallery.html` — Modify: 상단 `<script>`의 "공용 빌더" 구역에 광택 키트 추가, 대표 6개 `render()` 교체.
- `references/design-and-readability.md` — Modify: "도형 광택 공식(라이트)" 절 추가.
- `references/component-registry.md` — Modify: 대표 6개 행에 "광택 표준" 표시.
- `tests/gloss-guard.mjs` — Create: 정적 회귀 가드.

---

### Task 1: 광택 키트 + 가드 하니스

**Files:**
- Modify: `component-gallery.html` (`// ===== 공용 빌더 =====` 구역, 현재 `const S=` 정의 직후)
- Create: `tests/gloss-guard.mjs`

**Interfaces:**
- Produces (전역 함수, 이후 모든 컴포넌트 태스크가 사용):
  - `lighten(hex, a) -> hex` / `darken(hex, a) -> hex`
  - `gid(hex) -> string` (그라데이션 id 베이스, 글자 시작)
  - `glossDefs(colorsArray) -> "<defs>…</defs>"`
  - `Sg(w, h, inner, colors) -> "<svg>…</svg>"` (= `S`에 defs 주입판)
  - `glossCircle(cx, cy, r, c) -> svg`
  - `glossRect(x, y, w, h, c, rx=7) -> svg`
  - `glossWedge(pathD, c) -> svg`
  - `glossStroke(pathD, c, w=4) -> svg`
  - `glossBlockStyle(c) -> "css문자열"` (HTML div용)

- [ ] **Step 1: 가드 테스트 작성 (키트 존재 확인)**

Create `tests/gloss-guard.mjs`:

```js
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "component-gallery.html"), "utf8");

const checks = [];
const ok = (name, cond) => checks.push({ name, pass: !!cond });

// --- 키트 존재 ---
ok("glossDefs 정의", /function glossDefs\s*\(/.test(html));
ok("Sg 정의", /const Sg\s*=/.test(html));
ok("glossCircle 정의", /function glossCircle\s*\(/.test(html));
ok("glossRect 정의", /function glossRect\s*\(/.test(html));
ok("glossWedge 정의", /function glossWedge\s*\(/.test(html));
ok("glossStroke 정의", /function glossStroke\s*\(/.test(html));
ok("glossBlockStyle 정의", /const glossBlockStyle\s*=/.test(html));

// --- 컴포넌트 render 추출 헬퍼 (이후 태스크에서 사용) ---
export function renderOf(n) {
  const re = new RegExp(`\\{n:${n},[\\s\\S]*?(?=\\n\\{n:|\\n\\];)`);
  const m = html.match(re);
  return m ? m[0] : "";
}

// (컴포넌트별 체크는 이후 태스크에서 이 파일에 추가)
let failed = 0;
for (const c of checks) {
  console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}`);
  if (!c.pass) failed++;
}
console.log(`\n${checks.length - failed}/${checks.length} passed`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: 가드 실행 → 실패 확인**

Run: `node tests/gloss-guard.mjs`
Expected: FAIL (7개 "정의" 체크 전부 FAIL — 아직 키트 없음), 종료코드 1.

- [ ] **Step 3: 광택 키트 구현**

`component-gallery.html`에서 `const S=(w,h,inner)=>…;` 줄을 찾아 그 **바로 다음 줄**에 아래를 삽입한다(기존 `S`/`card`/`chip` 등은 그대로 둔다):

```js
// ===== 광택 키트 (라이트) =====
const _hx=c=>c.replace('#','');
const lighten=(c,a)=>{const n=parseInt(_hx(c),16);let r=(n>>16)&255,g=(n>>8)&255,b=n&255;r=Math.round(r+(255-r)*a);g=Math.round(g+(255-g)*a);b=Math.round(b+(255-b)*a);return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');};
const darken=(c,a)=>{const n=parseInt(_hx(c),16);let r=(n>>16)&255,g=(n>>8)&255,b=n&255;r=Math.round(r*(1-a));g=Math.round(g*(1-a));b=Math.round(b*(1-a));return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');};
const gid=c=>'x'+_hx(c);
function glossDefs(colors){
  const uniq=[...new Set(colors)];
  return `<defs>${uniq.map(c=>{const k=gid(c);return `<radialGradient id="rg${k}" cx="38%" cy="30%" r="80%"><stop offset="0%" stop-color="${lighten(c,.5)}"/><stop offset="100%" stop-color="${c}"/></radialGradient><linearGradient id="lg${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${lighten(c,.32)}"/><stop offset="100%" stop-color="${darken(c,.1)}"/></linearGradient><filter id="gw${k}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${c}" flood-opacity="0.40"/><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#0F172A" flood-opacity="0.16"/></filter>`;}).join('')}</defs>`;
}
const Sg=(w,h,inner,colors)=>`<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;max-height:172px">${glossDefs(colors)}${inner}</svg>`;
function glossCircle(cx,cy,r,c){const k=gid(c);return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#rg${k})" stroke="rgba(255,255,255,.75)" stroke-width="1" filter="url(#gw${k})"/><ellipse cx="${cx}" cy="${cy-r*.38}" rx="${r*.62}" ry="${r*.34}" fill="rgba(255,255,255,.55)" style="mix-blend-mode:soft-light"/>`;}
function glossRect(x,y,w,h,c,rx=7){const k=gid(c);return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#lg${k})" stroke="rgba(255,255,255,.55)" stroke-width="1" filter="url(#gw${k})"/><rect x="${x+2}" y="${y+1.5}" width="${w-4}" height="${Math.max(2,h*.32)}" rx="${rx*.6}" fill="rgba(255,255,255,.4)" style="mix-blend-mode:soft-light"/>`;}
function glossWedge(d,c){const k=gid(c);return `<path d="${d}" fill="url(#lg${k})" stroke="rgba(255,255,255,.6)" stroke-width="1" filter="url(#gw${k})"/>`;}
function glossStroke(d,c,w=4){const k=gid(c);return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" filter="url(#gw${k})"/><path d="${d}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="${Math.max(1,w*.4)}" stroke-linecap="round"/>`;}
const glossBlockStyle=c=>`background:linear-gradient(135deg,${lighten(c,.32)},${darken(c,.06)});border:1px solid rgba(255,255,255,.55);box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 4px 10px rgba(15,23,42,.14),0 0 14px ${c}55;`;
```

- [ ] **Step 4: 가드 실행 → 통과 확인**

Run: `node tests/gloss-guard.mjs`
Expected: PASS (7개 "정의" 체크 통과), 종료코드 0.

- [ ] **Step 5: 시각 확인**

브라우저로 `component-gallery.html`을 열어 콘솔 에러가 없고 기존 카탈로그가 정상 렌더되는지 확인(아직 컴포넌트 미변경이라 외형 동일).

- [ ] **Step 6: 커밋**

```bash
git add component-gallery.html tests/gloss-guard.mjs
git commit -m "feat(gallery): 라이트 광택 키트 + 정적 가드 추가"
```

---

### Task 2: 35 방사형(HubSpoke) — 채운 원 + 연결선

**Files:**
- Modify: `component-gallery.html` (`{n:35,`)
- Modify: `tests/gloss-guard.mjs`

**Interfaces:**
- Consumes: `Sg`, `glossCircle`, `glossStroke` (Task 1)

- [ ] **Step 1: 가드에 35번 체크 추가**

`tests/gloss-guard.mjs`의 `// (컴포넌트별 체크는…` 줄 위에 추가:

```js
const r35 = renderOf(35);
ok("35 반투명 단색 fill 없음", !/fill="rgba\(255,255,255,\.62\)"/.test(r35));
ok("35 glossCircle 사용", /glossCircle\(/.test(r35));
ok("35 glossStroke 사용", /glossStroke\(/.test(r35));
```

- [ ] **Step 2: 가드 실행 → 35 체크 실패 확인**

Run: `node tests/gloss-guard.mjs`
Expected: FAIL — "35 반투명 단색 fill 없음", "35 glossCircle 사용", "35 glossStroke 사용" 3개 FAIL.

- [ ] **Step 3: 35번 render 교체**

`{n:35,…}`의 `render:()=>{…}` 본문을 아래로 교체(메타 `n/type/en/ko/cat/tag/use`는 그대로):

```js
render:()=>{const cx=95,cy=85;const sp=[[95,22,"읽기",EM],[160,85,"쓰기",AM],[95,148,"말하기",RO],[30,85,"듣기",SK]];const cols=[BL,...sp.map(s=>s[3])];let lines="";sp.forEach(([x,y,t,f])=>{lines+=glossStroke(`M${cx} ${cy} L${x} ${y}`,f,2.5);});let nodes="";sp.forEach(([x,y,t,f])=>{nodes+=glossCircle(x,y,17,f)+`<text x="${x}" y="${y+4}" text-anchor="middle" font-size="10.5" font-weight="800" fill="#fff">${t}</text>`;});nodes+=glossCircle(cx,cy,24,BL)+`<text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">국어</text>`;return Sg(190,170,lines+nodes,cols)}
```

(변경 요지: 연결선 → `glossStroke`, 위성/허브 원 → `glossCircle`(불투명 그라데+하이라이트+글로우), 라벨 글자색은 흰색으로 통일, `S`→`Sg`로 defs 주입.)

- [ ] **Step 4: 가드 실행 → 통과 확인**

Run: `node tests/gloss-guard.mjs`
Expected: PASS (35번 3개 체크 포함 전부 통과).

- [ ] **Step 5: 시각 확인**

브라우저에서 35번 카드: 원이 안 깨지고(배경 안 비침) 구체 광택·글로우가 보이며 떠 보이는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add component-gallery.html tests/gloss-guard.mjs
git commit -m "feat(gallery): 35 방사형 라이트 광택 적용"
```

---

### Task 3: 33 삼위일체(Trinity) — 원 + 연결선 합성

**Files:**
- Modify: `component-gallery.html` (`{n:33,`)
- Modify: `tests/gloss-guard.mjs`

**Interfaces:**
- Consumes: `Sg`, `glossCircle`, `glossStroke`

- [ ] **Step 1: 가드에 33번 체크 추가**

```js
const r33 = renderOf(33);
ok("33 반투명 단색 fill 없음", !/fill="rgba\(255,255,255,\.62\)"/.test(r33));
ok("33 glossCircle 사용", /glossCircle\(/.test(r33));
```

- [ ] **Step 2: 가드 실행 → 33 체크 실패 확인**

Run: `node tests/gloss-guard.mjs`
Expected: FAIL — "33 반투명 단색 fill 없음", "33 glossCircle 사용" FAIL.

- [ ] **Step 3: 33번 render 교체**

```js
render:()=>{const tri=`<polygon points="85,22 28,128 142,128" fill="none" stroke="${GRID}" stroke-width="2"/>`;const spokes=glossStroke("M85 22 L85 92",BL,2)+glossStroke("M28 128 L85 92",EM,2)+glossStroke("M142 128 L85 92",AM,2);let v="";[[85,22,"🔍",BL],[28,128,"🧲",EM],[142,128,"⚖️",AM]].forEach(([x,y,e,f])=>{v+=glossCircle(x,y,18,f)+`<text x="${x}" y="${y+6}" text-anchor="middle" font-size="16">${e}</text>`;});v+=glossCircle(85,92,20,BL)+`<text x="85" y="97" text-anchor="middle" font-size="14">🛡️</text>`;return Sg(175,155,tri+spokes+v,[BL,EM,AM])}
```

(변경 요지: 꼭짓점 흰 반투명 원 → `glossCircle` 컬러 불투명 원, 잇는 선 → `glossStroke`. 이모지는 원 위에 그대로 얹음.)

- [ ] **Step 4: 가드 실행 → 통과 확인**

Run: `node tests/gloss-guard.mjs`
Expected: PASS.

- [ ] **Step 5: 시각 확인**

33번 카드: 세 꼭짓점 원이 컬러 광택으로 또렷하고, 중심 통합원이 강조되는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add component-gallery.html tests/gloss-guard.mjs
git commit -m "feat(gallery): 33 삼위일체 라이트 광택 적용"
```

---

### Task 4: 31 피라미드(Pyramid) — 쌓인 블록(div)

**Files:**
- Modify: `component-gallery.html` (`{n:31,`)
- Modify: `tests/gloss-guard.mjs`

**Interfaces:**
- Consumes: `glossBlockStyle` (HTML div용 CSS 광택)

- [ ] **Step 1: 가드에 31번 체크 추가**

```js
const r31 = renderOf(31);
ok("31 glossBlockStyle 사용", /glossBlockStyle\(/.test(r31));
```

- [ ] **Step 2: 가드 실행 → 31 체크 실패 확인**

Run: `node tests/gloss-guard.mjs`
Expected: FAIL — "31 glossBlockStyle 사용" FAIL.

- [ ] **Step 3: 31번 render 교체**

기존 각 층 `<div>`의 `background:${f};`(단색)를 `glossBlockStyle(f)`로 교체:

```js
render:()=>{const lv=[["자아실현",RO],["존중",AM],["소속",EM],["안전·생존",BL]];return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;width:100%;max-width:220px">${lv.map(([t,f],i)=>`<div style="width:${40+i*20}%;${glossBlockStyle(f)}color:#fff;text-align:center;font-size:11.5px;font-weight:800;padding:5px;border-radius:6px">${t}</div>`).join("")}</div>`}
```

(변경 요지: `background:${f}` → `glossBlockStyle(f)`(linear 그라데+상단 inset 하이라이트+바닥 그림자+컬러 글로우), 모서리 `border-radius` 4→6, gap 3→4.)

- [ ] **Step 4: 가드 실행 → 통과 확인**

Run: `node tests/gloss-guard.mjs`
Expected: PASS.

- [ ] **Step 5: 시각 확인**

31번 카드: 각 층이 면 광택(위가 밝고 아래로 진해짐)과 떠오른 그림자를 갖는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add component-gallery.html tests/gloss-guard.mjs
git commit -m "feat(gallery): 31 피라미드 라이트 광택 적용"
```

---

### Task 5: 28 블록 순환(SegmentedCycle) — 호(arc) 세그먼트

**Files:**
- Modify: `component-gallery.html` (`{n:28,`)
- Modify: `tests/gloss-guard.mjs`

**Interfaces:**
- Consumes: `Sg`, `glossWedge`

- [ ] **Step 1: 가드에 28번 체크 추가**

```js
const r28 = renderOf(28);
ok("28 glossWedge 사용", /glossWedge\(/.test(r28));
```

- [ ] **Step 2: 가드 실행 → 28 체크 실패 확인**

Run: `node tests/gloss-guard.mjs`
Expected: FAIL — "28 glossWedge 사용" FAIL.

- [ ] **Step 3: 28번 render 교체**

호 wedge의 단색 `fill`을 `glossWedge(d, fill)`로 교체(좌표/각도 계산은 유지):

```js
render:()=>{const cx=85,cy=85,R=58,r0=34;const st=[["봄",EM],["여름",RO],["가을",AM],["겨울",BL]];let p="";const wedge=(a0,a1,fill)=>{const rad=d=>d*Math.PI/180;const x0=cx+R*Math.cos(rad(a0)),y0=cy+R*Math.sin(rad(a0)),x1=cx+R*Math.cos(rad(a1)),y1=cy+R*Math.sin(rad(a1)),x2=cx+r0*Math.cos(rad(a1)),y2=cy+r0*Math.sin(rad(a1)),x3=cx+r0*Math.cos(rad(a0)),y3=cy+r0*Math.sin(rad(a0));return glossWedge(`M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3} Z`,fill);};st.forEach(([t,f],i)=>{const a0=-88+i*90,a1=a0+84;p+=wedge(a0,a1,f);const am=(a0+a1)/2*Math.PI/180,rm=(R+r0)/2;p+=`<text x="${cx+rm*Math.cos(am)}" y="${cy+rm*Math.sin(am)+4}" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">${t}</text>`;});return Sg(170,170,p,st.map(s=>s[1]))}
```

(변경 요지: `arc()`가 만들던 단색 `<path fill>` → `glossWedge`(linear 그라데+가장자리 하이라이트+글로우), `S`→`Sg`.)

- [ ] **Step 4: 가드 실행 → 통과 확인**

Run: `node tests/gloss-guard.mjs`
Expected: PASS.

- [ ] **Step 5: 시각 확인**

28번 카드: 4개 호 블록이 광택 그라데로 입체감 있고 가장자리가 또렷한지 확인.

- [ ] **Step 6: 커밋**

```bash
git add component-gallery.html tests/gloss-guard.mjs
git commit -m "feat(gallery): 28 블록 순환 라이트 광택 적용"
```

---

### Task 6: 27 톱니바퀴(GearCycle) — 복잡 도형

**Files:**
- Modify: `component-gallery.html` (`{n:27,`)
- Modify: `tests/gloss-guard.mjs`

**Interfaces:**
- Consumes: `Sg`, `gid`, `lighten`

- [ ] **Step 1: 가드에 27번 체크 추가**

```js
const r27 = renderOf(27);
ok("27 반투명 단색 fill 없음", !/fill="rgba\(255,255,255,\.62\)"/.test(r27));
ok("27 그라데이션 fill 사용", /fill="url\(#rg/.test(r27));
ok("27 글로우 필터 사용", /filter="url\(#gw/.test(r27));
```

- [ ] **Step 2: 가드 실행 → 27 체크 실패 확인**

Run: `node tests/gloss-guard.mjs`
Expected: FAIL — 27 체크 3개 FAIL.

- [ ] **Step 3: 27번 render 교체**

톱니+몸통을 `<g filter>`로 묶고 몸통을 그라데, 중심 구멍은 옅은 유리톤, 상단 하이라이트 추가:

```js
render:()=>{const gear=(cx,cy,R,f,lbl)=>{const k=gid(f);let teeth="";for(let i=0;i<10;i++){const a=i*36*Math.PI/180;const x1=cx+R*Math.cos(a),y1=cy+R*Math.sin(a),x2=cx+(R+7)*Math.cos(a),y2=cy+(R+7)*Math.sin(a);teeth+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${f}" stroke-width="6" stroke-linecap="round"/>`;}return `<g filter="url(#gw${k})">${teeth}<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#rg${k})" stroke="rgba(255,255,255,.7)" stroke-width="1"/></g><ellipse cx="${cx}" cy="${cy-R*.4}" rx="${R*.55}" ry="${R*.3}" fill="rgba(255,255,255,.5)" style="mix-blend-mode:soft-light"/><circle cx="${cx}" cy="${cy}" r="${R*.4}" fill="${lighten(f,.78)}"/><text x="${cx}" y="${cy+R+20}" text-anchor="middle" font-size="12" font-weight="800" fill="${f}">${lbl}</text>`;};return Sg(220,150,gear(55,62,30,BL,"투입")+gear(140,80,34,EM,"전환")+gear(60,120,18,AM,"산출"),[BL,EM,AM])}
```

(변경 요지: 중심 구멍 `rgba(255,255,255,.62)` → `lighten(f,.78)`(옅은 유리톤·불투명), 몸통 단색 → `url(#rg)`, 그룹에 `url(#gw)` 글로우, 상단 하이라이트 타원 추가, `S`→`Sg`.)

- [ ] **Step 4: 가드 실행 → 통과 확인**

Run: `node tests/gloss-guard.mjs`
Expected: PASS.

- [ ] **Step 5: 시각 확인**

27번 카드: 톱니바퀴 3개가 입체 광택을 갖고 안 깨지며, 중심 구멍이 비침 없이 옅은 톤인지 확인.

- [ ] **Step 6: 커밋**

```bash
git add component-gallery.html tests/gloss-guard.mjs
git commit -m "feat(gallery): 27 톱니바퀴 라이트 광택 적용"
```

---

### Task 7: 38 벤다이어그램(Venn) — 겹침/비침 예외

**Files:**
- Modify: `component-gallery.html` (`{n:38,`)
- Modify: `tests/gloss-guard.mjs`

**Interfaces:**
- Consumes: `Sg`

- [ ] **Step 1: 가드에 38번 체크 추가**

```js
const r38 = renderOf(38);
ok("38 흰 inner plate 존재", /fill="#fff"|fill="#ffffff"/.test(r38));
ok("38 multiply 블렌드 사용", /mix-blend-mode:multiply/.test(r38));
```

- [ ] **Step 2: 가드 실행 → 38 체크 실패 확인**

Run: `node tests/gloss-guard.mjs`
Expected: FAIL — 38 체크 2개 FAIL.

- [ ] **Step 3: 38번 render 교체**

흰 inner plate(둥근 사각) 위에 두 원을 `multiply`로 겹쳐 교집합이 진해지게:

```js
render:()=>Sg(200,150,`<rect x="6" y="6" width="188" height="138" rx="14" fill="#ffffff" filter="url(#gwx0F172A)"/><g style="mix-blend-mode:multiply"><circle cx="78" cy="75" r="52" fill="${BL}" opacity=".5"/><circle cx="122" cy="75" r="52" fill="${RO}" opacity=".5"/></g><text x="54" y="80" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">A</text><text x="146" y="80" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">B</text><text x="100" y="80" text-anchor="middle" font-size="11" font-weight="800" fill="${INK}">공통</text>`,[INK])}
```

(변경 요지: 페이지 배경 위 반투명 원 → 흰 inner plate 위 `multiply` 반투명 원. plate에 옅은 접지 그림자(`gw`+INK). 라벨 A/B는 흰색으로 대비 확보. `colors=[INK]`로 plate 그림자 필터 `gwx0F172A` 생성.)

- [ ] **Step 4: 가드 실행 → 통과 확인**

Run: `node tests/gloss-guard.mjs`
Expected: PASS.

- [ ] **Step 5: 시각 확인**

38번 카드: 흰 판 위 두 원이 겹치는 교집합이 또렷이 진해지고, 페이지 배경이 원 안으로 비치지 않는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add component-gallery.html tests/gloss-guard.mjs
git commit -m "feat(gallery): 38 벤다이어그램 inner-plate 예외 적용"
```

---

### Task 8: 표준 명문화 + registry 표시 + 글로벌 동기화 (게이트)

**Files:**
- Modify: `references/design-and-readability.md`
- Modify: `references/component-registry.md`
- Modify: `tests/gloss-guard.mjs`

- [ ] **Step 1: 가드에 문서 동기화 체크 추가**

`tests/gloss-guard.mjs` 상단의 파일 읽기 부분 아래에 추가:

```js
const design = readFileSync(join(root, "references", "design-and-readability.md"), "utf8");
ok("design 문서에 도형 광택 공식 절", /도형 광택 공식/.test(design));
ok("design 문서에 feDropShadow 레시피", /feDropShadow/.test(design));
```

- [ ] **Step 2: 가드 실행 → 문서 체크 실패 확인**

Run: `node tests/gloss-guard.mjs`
Expected: FAIL — 문서 체크 2개 FAIL.

- [ ] **Step 3: `design-and-readability.md`에 "도형 광택 공식(라이트)" 절 추가**

문서 끝에 다음을 추가:

```markdown
## 도형 광택 공식 (라이트) — 도형은 투명 금지

밝은 배경에서 SVG 도형(원·톱니·블록·호·노드)은 **불투명 그라데이션 + 안쪽 흰 하이라이트
+ 컬러 글로우 + 옅은 접지 그림자**로 입체 광택을 낸다. 반투명 단색 fill은 배경이 비쳐
깨지므로 금지한다. (구현 헬퍼: `component-gallery.html`의 `glossCircle/glossRect/glossWedge/glossStroke/glossBlockStyle`.)

- 채움(원·노드): `radial-gradient(38% 30%): lighten(accent,.5) → accent`
- 채움(블록·호·바): `linear-gradient(135°): lighten(accent,.32) → darken(accent,.1)`
- 안쪽 하이라이트: 도형 위 흰 타원/줄 `rgba(255,255,255,.5)` + `mix-blend-mode:soft-light`
- 글로우+접지: `filter` 안에
  `feDropShadow(0,0,4, accent, .40)` + `feDropShadow(0,3,5, #0F172A, .16)`
- 가장자리: `stroke="rgba(255,255,255,.7)" stroke-width="1"`
- 겹침(벤다이어그램) 예외: 흰 inner plate 위에서만 두 원을 `mix-blend-mode:multiply` 반투명으로.
  페이지 배경이 직접 비치지 않게 한다.

카드/패널 컨테이너는 기존 glass(반투명+blur) 유지. 도형 본체에는 적용하지 않는다.
```

- [ ] **Step 4: `component-registry.md`의 대표 6개 행에 표시**

35·33·31·28·27·38 항목 설명 끝에 ` (라이트 광택 표준 적용)`을 덧붙인다. (해당 줄을 찾아 텍스트만 추가, 번호/type 불변.)

- [ ] **Step 5: 가드 실행 → 전체 통과 확인**

Run: `node tests/gloss-guard.mjs`
Expected: PASS (키트 + 6개 컴포넌트 + 문서 체크 전부 통과).

- [ ] **Step 6: 6개 나란히 시각 게이트**

브라우저에서 35·33·31·28·27·38을 한 화면에 놓고 비교: 색/광택 강도/그림자/글로우가 **일관**된지 확인. 어긋나면 해당 컴포넌트 태스크로 돌아가 헬퍼 파라미터를 조정.

- [ ] **Step 7: 글로벌 스킬 폴더로 동기화**

```bash
cp component-gallery.html ~/.claude/skills/qqq-react-live-lecture-visual-slides/component-gallery.html
cp references/design-and-readability.md ~/.claude/skills/qqq-react-live-lecture-visual-slides/references/design-and-readability.md
cp references/component-registry.md ~/.claude/skills/qqq-react-live-lecture-visual-slides/references/component-registry.md
```

- [ ] **Step 8: 커밋**

```bash
git add references/design-and-readability.md references/component-registry.md tests/gloss-guard.mjs
git commit -m "docs: 도형 광택 공식 명문화 + registry 표시 (대표 6개 표준 확정)"
```

---

## Self-Review

- **Spec coverage:** 아키텍처(Task1) / 광택 공식 4요소(Task1 키트+Task8 문서) / 6개 매핑(Task2~7) / 벤 예외(Task7) / 검증 눈+나란히+정적가드(각 Step5·Task8 Step6·gloss-guard) / 불변(Global Constraints+가드 반투명 금지) / 동기화(Task8 Step7) — 모두 태스크로 커버됨. spec "8번"은 Global Constraints에서 28번으로 정정.
- **Placeholder scan:** TBD/TODO 없음. 모든 코드 스텝에 실제 코드 포함.
- **Type consistency:** 헬퍼 이름(`glossCircle/glossRect/glossWedge/glossStroke/glossBlockStyle/Sg/glossDefs/gid/lighten/darken`)이 Task1 정의와 Task2~7 사용에서 일치. 그라데이션 id 규칙 `rg${gid}/lg${gid}/gw${gid}`가 헬퍼·문서·38번 plate(`gwx0F172A`)에서 일관.
