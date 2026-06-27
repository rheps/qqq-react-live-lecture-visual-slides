/* build-kit.js — component-gallery.html 에서 토큰+빌더+렌더(C 배열)+키프레임+모션엔진을
 * 뽑아 references/qqq-component-kit.js 를 재생성한다.
 * 갤러리(모양·모션)를 고친 뒤 반드시 다시 돌려 키트를 동기화할 것.
 *   실행:  node references/build-kit.js     (스킬 루트에서)
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const galleryPath = path.join(ROOT, "component-gallery.html");
const outPath = path.join(ROOT, "references", "qqq-component-kit.js");

const h = fs.readFileSync(galleryPath, "utf8");

// 1) 키프레임: "모션 키트" 주석 ~ @media(prefers-reduced-motion) 줄 끝
const kfStart = h.indexOf("/* ===================== 모션 키트");
const mediaIdx = h.indexOf("@media (prefers-reduced-motion: reduce)");
if (kfStart < 0 || mediaIdx < 0) throw new Error("키프레임 블록을 찾지 못함 — 갤러리 마커 확인");
const kfEnd = h.indexOf("\n", mediaIdx);
const kf = h.slice(kfStart, kfEnd).replace(/\r/g, "").trim();

// 2) 로직: "// ===== 토큰 =====" ~ "// ===== 렌더링 =====" 직전 (animate 함수 끝)
const logStart = h.indexOf("// ===== 토큰 =====");
const logEnd = h.indexOf("// ===== 렌더링 =====");
if (logStart < 0 || logEnd < 0) throw new Error("로직 블록 마커를 찾지 못함 — 갤러리 마커 확인");
const logic = h.slice(logStart, logEnd).replace(/\r/g, "").trim();

const header =
`/* qqq-component-kit.js — component-gallery.html 와 100% 동일한
 * 시각 컴포넌트 렌더 + 모션 엔진을 자기완결로 담은 인라인용 키트.
 * 스킬이 생성하는 덱에 통째로 <script>(클래식)로 인라인하면 window.QQQ 가 노출된다.
 *   QQQ.mount(번호, domEl)  → el 안에 컴포넌트를 그리고 갤러리와 동일한 루프 모션을 입힌다
 *   QQQ.render(번호)        → 컴포넌트 SVG/HTML 문자열만 반환
 * 자동 생성물 — 직접 수정 금지. 갤러리를 고친 뒤 'node references/build-kit.js'로 재생성.
 */`;

const api = [
  "",
  "// ===== 키프레임 자동 주입 =====",
  "var __QQQ_KF=" + JSON.stringify(kf) + ";",
  'if(typeof document!=="undefined" && !document.getElementById("qqq-motion-kf")){',
  '  var __st=document.createElement("style"); __st.id="qqq-motion-kf"; __st.textContent=__QQQ_KF;',
  "  (document.head||document.documentElement).appendChild(__st);",
  "}",
  "// ===== 공개 API =====",
  'function __qqqRender(n){ return byN[n]? byN[n].render() : ""; }',
  "function __qqqMount(n, el){",
  "  if(!el) return;",
  '  el.classList.add("stage");',
  "  el.innerHTML=__qqqRender(n);",
  "  var c=byN[n]; if(!c) return;",
  '  var reduce = typeof window!=="undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;',
  "  if(!reduce){ try{ if(el.dataset) delete el.dataset.animed; animate(c, el); }catch(e){} }",
  "}",
  'if(typeof window!=="undefined") window.QQQ={ render:__qqqRender, mount:__qqqMount, byN:byN, applyMotion:animate };',
].join("\n");

const kit = header + "\n(function(){\n\n" + logic + "\n" + api + "\n\n})();\n";
fs.writeFileSync(outPath, kit);
console.log("재생성 완료:", path.relative(ROOT, outPath), "(" + kit.length + " bytes)");
