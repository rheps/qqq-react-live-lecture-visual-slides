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
