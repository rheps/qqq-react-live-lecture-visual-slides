# 공식 브랜드 로고 아이콘 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AI 툴·개발 도구의 공식 로고를 재사용 SVG 세트(`brandLogo`/`brandTile`)로 제공하고, 카탈로그에 쇼케이스 카드(n:82)를 추가하며, 임의 이모지 대신 공식 로고를 쓰도록 스킬에 명시한다.

**Architecture:** `component-gallery.html` 공용 빌더 구역에 `BRAND` 데이터 + `brandLogo(key,size)` + `brandTile(key,label)` 헬퍼를 추가한다. 로고는 인라인 SVG로 간결 재현(외부 의존성 0). 쇼케이스 컴포넌트 n:82가 `brandTile` 그리드로 8종을 보여준다. 로고 품질은 **스크린샷으로 식별 가능 여부를 눈으로 확인**한다(정적 테스트로는 존재만 보장).

**Tech Stack:** 순수 HTML/SVG/CSS + 인라인 JS. 가드: `node tests/gloss-guard.mjs`. 실행검증: `node .superpowers/sdd/render-check.mjs`.

## Global Constraints

- 로고는 브랜드 원색 유지(우리 팔레트로 칠하지 않음). 타일만 중립 라이트 글래스.
- key 세트(정확히 8): `claude, openai, antigravity, gemini, github, vscode, python, node`.
- 라벨 매핑: claude→"Claude", openai→"Codex"(쇼케이스엔 "Codex / ChatGPT" 병기 가능), antigravity→"Antigravity", gemini→"Gemini", github→"GitHub", vscode→"VS Code", python→"Python", node→"Node.js". Claude Code는 claude 마크 재사용.
- 외부 네트워크·CDN·폰트 의존 금지(오프라인 동작).
- 기존 컴포넌트 n/type/en/ko/use 텍스트·팔레트·배경 불변. 편집 파일: `component-gallery.html`, `tests/gloss-guard.mjs`, `SKILL.md`, `references/component-registry.md`.
- 쇼케이스 컴포넌트 번호 = **82** (75~81은 added-templates에서 사용 중).
- Antigravity는 정확 마크 불확실 → Google 4색 근사, `BRAND` 주석에 명시.

---

## File Structure

- `component-gallery.html` — Modify: 공용 빌더에 BRAND/brandLogo/brandTile 추가, C 배열에 n:82 쇼케이스 추가.
- `tests/gloss-guard.mjs` — Modify: BRAND/헬퍼/8키/쇼케이스/SKILL 지침 가드.
- `SKILL.md` — Modify: "AI 툴 언급 시 공식 로고" 지침 한 줄.
- `references/component-registry.md` — Modify: n:82 행 추가.

---

### Task 1: BRAND 데이터 + brandLogo/brandTile 헬퍼

**Files:**
- Modify: `component-gallery.html` (공용 빌더 구역, 광택 키트 정의 다음)
- Modify: `tests/gloss-guard.mjs`

**Interfaces:**
- Consumes: 기존 광택 키트(없어도 됨 — 타일은 자체 스타일).
- Produces:
  - `BRAND` — `{ [key]: { logo: string(viewBox 0 0 24 24 inner svg), color: string, label: string } }`
  - `brandLogo(key, size=40) -> "<svg>…</svg>"` (raw 로고, 타일 없음)
  - `brandTile(key, label=BRAND[key].label, size=120) -> "<div>…</div>"` (중립 라이트 광택 타일 + 로고 + 라벨)

- [ ] **Step 1: 가드에 헬퍼·키 존재 체크 추가**

`tests/gloss-guard.mjs`의 `// (컴포넌트별 체크는…` 줄 위에 삽입:

```js
ok("BRAND 정의", /const BRAND\s*=/.test(html));
ok("brandLogo 정의", /function brandLogo\s*\(/.test(html));
ok("brandTile 정의", /function brandTile\s*\(/.test(html));
for (const k of ["claude","openai","antigravity","gemini","github","vscode","python","node"]) {
  ok(`BRAND.${k} 존재`, new RegExp(`\\b${k}\\s*:\\s*\\{`).test(html));
}
```

- [ ] **Step 2: 가드 실행 → 실패 확인**

Run: `cd /c/AI/qqq-react-live-lecture-visual-slides && node tests/gloss-guard.mjs`
Expected: BRAND/brandLogo/brandTile/8키 체크 FAIL, exit 1.

- [ ] **Step 3: BRAND + 헬퍼 구현 (초기 로고)**

`component-gallery.html` 공용 빌더 구역(광택 키트 `glossBlockStyle` 정의 다음 줄)에 아래를 삽입한다. 각 `logo`는 viewBox `0 0 24 24` 기준 inner SVG다. **이 SVG들은 초기본이며 Step 5에서 스크린샷으로 식별성을 확인해 다듬는다.**

```js
// ===== 브랜드 로고 (공식 마크, 교육용 간결 재현) =====
// Antigravity는 신생 제품이라 정확 마크 불확실 → Google 4색 근사.
const _ray=(n,c)=>{let s="";for(let i=0;i<n;i++){const a=i*(360/n)*Math.PI/180;const x1=12+3*Math.cos(a),y1=12+3*Math.sin(a),x2=12+10*Math.cos(a),y2=12+10*Math.sin(a);s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2.1" stroke-linecap="round"/>`;}return s;};
const BRAND={
  claude:{color:"#D97757",label:"Claude",logo:_ray(12,"#D97757")},
  openai:{color:"#0F0F0F",label:"Codex / ChatGPT",logo:`<g fill="none" stroke="#0F0F0F" stroke-width="1.6"><circle cx="12" cy="7" r="4.2"/><circle cx="7.2" cy="14.5" r="4.2"/><circle cx="16.8" cy="14.5" r="4.2"/></g>`},
  antigravity:{color:"#4285F4",label:"Antigravity",logo:`<circle cx="12" cy="12" r="9" fill="none" stroke="#4285F4" stroke-width="2.4" stroke-dasharray="9 5"/><circle cx="12" cy="12" r="9" fill="none" stroke="#EA4335" stroke-width="2.4" stroke-dasharray="9 5" stroke-dashoffset="-14"/><circle cx="12" cy="12" r="3.2" fill="#FBBC05"/>`},
  gemini:{color:"#3B82F6",label:"Gemini",logo:`<defs><linearGradient id="gem" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4285F4"/><stop offset="100%" stop-color="#9B59E8"/></linearGradient></defs><path d="M12 2 C12.6 7.4 16.6 11.4 22 12 C16.6 12.6 12.6 16.6 12 22 C11.4 16.6 7.4 12.6 2 12 C7.4 11.4 11.4 7.4 12 2 Z" fill="url(#gem)"/>`},
  github:{color:"#181717",label:"GitHub",logo:`<path fill="#181717" d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.3-1.3-3.3-1.3-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.5 4.9.3.3.7 1 .7 2v3c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2Z"/>`},
  vscode:{color:"#0A84C9",label:"VS Code",logo:`<path fill="#0A84C9" d="M17.5 2.5 21 4.2v15.6l-3.5 1.7-9-8.7-4.5 3.4-1.5-.8V6.6l1.5-.8 4.5 3.4 9-8.7Zm-.5 5.1-5.4 4.4 5.4 4.4V7.6Z"/>`},
  python:{color:"#3776AB",label:"Python",logo:`<path fill="#3776AB" d="M11.9 2.5c-4.7 0-4.4 2-4.4 2v2.1h4.5v.6H5.7s-3 .3-3 4.4 2.6 4 2.6 4h1.6v-2.2s-.1-2.6 2.5-2.6h4.5s2.5 0 2.5-2.4V5s.4-2.5-4-2.5Zm-2.5 1.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z"/><path fill="#FFD43B" d="M12.1 21.5c4.7 0 4.4-2 4.4-2v-2.1h-4.5v-.6h6.3s3-.3 3-4.4-2.6-4-2.6-4h-1.6v2.2s.1 2.6-2.5 2.6H8.1s-2.5 0-2.5 2.4V19s-.4 2.5 4 2.5Zm2.5-1.4a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z"/>`},
  node:{color:"#5FA04E",label:"Node.js",logo:`<path fill="#5FA04E" d="M12 2.3 21 7.4v9.2L12 21.7 3 16.6V7.4l9-5.1Zm0 2.2L5 8.4v7.2l7 4 7-4V8.4l-7-3.9Z"/><text x="12" y="14.5" text-anchor="middle" font-size="6" font-weight="800" fill="#5FA04E" font-family="sans-serif">JS</text>`},
};
function brandLogo(key,size=40){const b=BRAND[key];if(!b)return "";return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="display:block">${b.logo}</svg>`;}
function brandTile(key,label,size=120){const b=BRAND[key];if(!b)return "";const lbl=label===undefined?b.label:label;return `<div style="display:inline-flex;flex-direction:column;align-items:center;gap:7px;width:${size}px"><div style="width:${size*0.66}px;height:${size*0.66}px;border-radius:${size*0.2}px;background:rgba(255,255,255,.62);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.8);box-shadow:0 6px 16px rgba(15,23,42,.10),0 0 12px rgba(148,163,184,.18),inset 0 1px 0 rgba(255,255,255,.7);display:flex;align-items:center;justify-content:center">${brandLogo(key,size*0.4)}</div>${lbl?`<div style="font-size:12px;font-weight:700;color:${INK};text-align:center;line-height:1.2">${lbl}</div>`:""}</div>`;}
```

- [ ] **Step 4: 가드 실행 → 통과 확인**

Run: `cd /c/AI/qqq-react-live-lecture-visual-slides && node tests/gloss-guard.mjs`
Expected: 새 체크 전부 PASS, exit 0.

- [ ] **Step 5: 시각 확인 (식별성)**

임시 서버로 띄워(또는 Playwright) `brandTile`을 잠깐 렌더해 8개 로고가 각 브랜드로 식별되는지 확인. 식별이 약한 마크(특히 openai·antigravity·github)는 `BRAND[key].logo`를 다듬어 다시 확인한다. (이 단계는 Task 2의 쇼케이스가 생기면 함께 본다.)

- [ ] **Step 6: 커밋**

```bash
cd /c/AI/qqq-react-live-lecture-visual-slides && git add component-gallery.html tests/gloss-guard.mjs && git commit -m "feat(gallery): 브랜드 로고 세트 brandLogo/brandTile 추가"
```

---

### Task 2: 쇼케이스 컴포넌트(n:82) + SKILL 지침 + registry

**Files:**
- Modify: `component-gallery.html` (C 배열 끝)
- Modify: `SKILL.md`
- Modify: `references/component-registry.md`
- Modify: `tests/gloss-guard.mjs`

**Interfaces:**
- Consumes: `brandTile` (Task 1)

- [ ] **Step 1: 가드에 쇼케이스·SKILL 체크 추가**

`tests/gloss-guard.mjs`에 추가(헬퍼 체크 아래):

```js
const r82 = renderOf(82);
ok("82 brandTile 사용", /brandTile\(/.test(r82));
const skill = readFileSync(join(root, "SKILL.md"), "utf8");
ok("SKILL에 공식 로고 지침", /공식 로고|brandTile/.test(skill));
```

(파일 상단에 `SKILL.md`를 읽는 줄이 없으면, `const skill = …`는 위 블록에서 직접 읽으므로 추가 import 불필요 — `readFileSync`/`join`/`root`는 이미 정의됨.)

- [ ] **Step 2: 가드 실행 → 실패 확인**

Run: `cd /c/AI/qqq-react-live-lecture-visual-slides && node tests/gloss-guard.mjs`
Expected: "82 brandTile 사용", "SKILL에 공식 로고 지침" FAIL (renderOf(82)는 throw할 수 있음 → 먼저 Step 3에서 n:82 추가). 만약 renderOf(82)가 throw하면 그 자체가 미구현 신호이므로 Step 3 진행.

- [ ] **Step 3: 쇼케이스 컴포넌트 n:82 추가**

`component-gallery.html`의 C 배열 마지막 항목(`{n:74,…}`) 다음 줄, 배열 닫기 `];` 직전에 추가:

```js
{n:82,type:"brand-logos",en:"BrandLogos",ko:"공식 로고",cat:"L",tag:"new",use:"AI 툴·개발 도구 언급 시 임의 이모지 대신 공식 로고 타일.",render:()=>`<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:300px">${["claude","openai","antigravity","gemini","github","vscode","python","node"].map(k=>brandTile(k,undefined,96)).join("")}</div>`},
```

- [ ] **Step 4: SKILL.md에 지침 추가**

`SKILL.md`에서 컴포넌트/시각 요소를 다루는 절(예: 컴포넌트 카탈로그·아이콘 관련 문단)에 한 줄을 추가한다. 적절한 위치를 못 찾으면 문서 끝에 다음 절을 추가:

```markdown
## 브랜드 로고

AI 툴·서비스나 개발 도구(Claude Code·Codex·Antigravity·ChatGPT·Gemini·GitHub·VS Code·Python·Node 등)를
언급할 때는 **임의 이모지(🤖·💻 등)를 쓰지 않고 공식 로고를 쓴다.** `component-gallery.html`의
`brandTile(key,label,size)` / `brandLogo(key,size)`를 사용한다(키: claude/openai/antigravity/gemini/github/vscode/python/node).
로고는 브랜드 원색, 타일은 중립 라이트 광택. 카탈로그 82번(공식 로고)에서 확인.
```

- [ ] **Step 5: registry에 n:82 행 추가**

`references/component-registry.md`의 표에서 L(사료) 또는 마지막 적절한 위치에 행을 추가:

```
| 82 | `brand-logos` | BrandLogos | AI 툴·개발 도구 공식 로고 타일 | NEW |
```

- [ ] **Step 6: 가드 + 실행검증 → 통과 확인**

Run: `cd /c/AI/qqq-react-live-lecture-visual-slides && node tests/gloss-guard.mjs`
Expected: 전부 PASS.
Run: `cd /c/AI/qqq-react-live-lecture-visual-slides && node .superpowers/sdd/render-check.mjs 82`
Expected: `PASS n:82 …`.

- [ ] **Step 7: 시각 확인 (8개 로고 식별성 게이트)**

브라우저로 82번 카드를 캡처해 8개 타일이 각 브랜드로 식별되는지 확인. 약한 마크는 Task 1 Step 3의 `BRAND[key].logo`를 다듬어 재확인(이 게이트 통과가 완료 기준).

- [ ] **Step 8: 커밋 + 글로벌 동기화**

```bash
cd /c/AI/qqq-react-live-lecture-visual-slides && git add component-gallery.html SKILL.md references/component-registry.md tests/gloss-guard.mjs && git commit -m "feat(gallery): 공식 로고 쇼케이스(82) + SKILL 지침 + registry"
cp component-gallery.html SKILL.md ~/.claude/skills/qqq-react-live-lecture-visual-slides/
cp references/component-registry.md ~/.claude/skills/qqq-react-live-lecture-visual-slides/references/
```

---

## Self-Review

- **Spec coverage:** 헬퍼 2종+BRAND(Task1) / 8키(Global+Task1) / 쇼케이스 n:82(Task2) / SKILL 지침(Task2) / registry(Task2) / 중립 광택 타일(Task1 brandTile) / 가드·실행·시각(각 Step) — 커버됨.
- **Placeholder scan:** 로고 SVG는 실제 초기본 포함(빈칸 없음). "다듬는다"는 시각 수용 절차이지 미구현 placeholder 아님.
- **Type consistency:** `BRAND`/`brandLogo(key,size)`/`brandTile(key,label,size)` 시그니처가 Task1 정의와 Task2(82·SKILL) 사용에서 일치. 키 8종 동일.
