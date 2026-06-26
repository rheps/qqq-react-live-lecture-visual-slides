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
