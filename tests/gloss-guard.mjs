import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "component-gallery.html"), "utf8");
const design = readFileSync(join(root, "references", "design-and-readability.md"), "utf8");

const checks = [];
const ok = (name, cond) => checks.push({ name, pass: !!cond });

ok("design 문서에 도형 광택 공식 절", /도형 광택 공식/.test(design));
ok("design 문서에 feDropShadow 레시피", /feDropShadow/.test(design));

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
  const re = new RegExp(`\\{n:${n},[\\s\\S]*?(?=\\r?\\n\\{n:|\\r?\\n\\];)`);
  const m = html.match(re);
  if (!m) throw new Error(`renderOf: component n:${n} not found (check array format)`);
  return m[0];
}

const r35 = renderOf(35);
ok("35 반투명 단색 fill 없음", !/fill="rgba\(255,255,255,\.62\)"/.test(r35));
ok("35 glossCircle 사용", /glossCircle\(/.test(r35));
ok("35 glossStroke 사용", /glossStroke\(/.test(r35));
ok("35 Sg 사용", /Sg\(/.test(r35));

const r33 = renderOf(33);
ok("33 반투명 단색 fill 없음", !/fill="rgba\(255,255,255,\.62\)"/.test(r33));
ok("33 glossCircle 사용", /glossCircle\(/.test(r33));
ok("33 Sg 사용", /Sg\(/.test(r33));

const r31 = renderOf(31);
ok("31 glossBlockStyle 사용", /glossBlockStyle\(/.test(r31));

const r28 = renderOf(28);
ok("28 glossWedge 사용", /glossWedge\(/.test(r28));
ok("28 Sg 사용", /Sg\(/.test(r28));

const r27 = renderOf(27);
ok("27 반투명 단색 fill 없음", !/fill="rgba\(255,255,255,\.62\)"/.test(r27));
ok("27 그라데이션 fill 사용", /fill="url\(#rg/.test(r27));
ok("27 글로우 필터 사용", /filter="url\(#gw/.test(r27));
ok("27 Sg 사용", /Sg\(/.test(r27));

const r38 = renderOf(38);
ok("38 흰 inner plate 존재", /fill="#fff"|fill="#ffffff"/.test(r38));
ok("38 multiply 블렌드 사용", /mix-blend-mode:multiply/.test(r38));

// (컴포넌트별 체크는 이후 태스크에서 이 파일에 추가)

// 확장: 광택 적용 대상 (배치별 확대) — 각자 gloss 헬퍼를 실제 참조해야 함
const GLOSSY = [26,29,30,34,39,40,41,49,12,17,18,19,21,24,25,32,36,42,48,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70];
for (const n of GLOSSY) {
  const r = renderOf(n);
  // gloss 헬퍼 호출 또는 그라데/글로우 id 참조(직접 적용)면 통과
  ok(`${n} gloss 적용`, /gloss(Circle|Rect|Wedge|Stroke|BlockStyle)\(|url\(#(rg|lg|gw)/.test(r));
}

let failed = 0;
for (const c of checks) {
  console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}`);
  if (!c.pass) failed++;
}
console.log(`\n${checks.length - failed}/${checks.length} passed`);
process.exit(failed ? 1 : 0);
