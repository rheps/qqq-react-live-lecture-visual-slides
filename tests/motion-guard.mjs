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
function kfBody(kfName){
  const start = html.search(new RegExp(`@keyframes\\s+${kfName}\\b`));
  if(start<0) return null;
  const open = html.indexOf("{", start);
  if(open<0) return null;
  let depth=0, i=open;
  for(; i<html.length; i++){ const ch=html[i]; if(ch==="{")depth++; else if(ch==="}"){depth--; if(depth===0)break;} }
  return html.slice(open+1, i);
}
function endsHidden(kfName){
  const body = kfBody(kfName);
  if(!body) return false;
  const stops = [...body.matchAll(/(\d+%|from|to)\s*\{([^{}]*)\}/g)];
  if(!stops.length) return false;
  const last = stops[stops.length-1][2];
  return /opacity:\s*0(\D|$)|scale\(0|scaleX\(0|scaleY\(0|dashoffset:\s*var\(--len\)/.test(last);
}
for (const kf of ["aRiseTIn","aRiseBIn","aSlideLIn","aSlideRIn","aPopIn","aFadeIn","aGrowYIn","aGrowXIn","aDrawIn","aWipeXIn","aGrowCIn"]) {
  ok(`${kf} 100%가 숨김으로 끝나지 않음`, !endsHidden(kf));
}
// 가드 자체가 숨김 종료를 실제로 감지하는지(비-vacuous) 검증
ok("endsHidden 동작 확인: aRiseT(원본 무한 루프)는 숨김으로 끝남을 감지", endsHidden("aRiseT"));
// enterA 헬퍼 정의
ok("enterA 헬퍼 정의", /function enterA\s*\(/.test(html));

for (const fn of ["cycleHighlight","altEmphasis","axisMarker","dirPulse","breatheGlow","pulseLife","ripple","sparkle","sheen","floatBob","wobbleLife"]) {
  ok(`생명 헬퍼 ${fn} 정의`, new RegExp(`function ${fn}\\s*\\(`).test(html));
}
for (const kf of ["aCycleHi","aAlt","aChev","aBreath","aRipple","aSpk","aSheen","aPulseLife","aFloatLife","aWobbleLife","aTravel"]) {
  ok(`생명 키프레임 ${kf} 정의`, new RegExp(`@keyframes\\s+${kf}\\b`).test(html));
}

ok("LIFE 레지스트리 정의", /const LIFE\s*=/.test(html));
ok("live 함수 정의", /function live\s*\(/.test(html));
ok("animate가 enter+live 호출", /enter\(c,\s*stage\)[\s\S]*live\(c,\s*stage\)/.test(html));

for (const n of [26,27,35,37,39,45]) ok(`LIFE[${n}] 존재`, new RegExp(`\\b${n}\\s*:\\s*s\\s*=>`).test(html.split("const LIFE")[1]||""));

// 재설계 대상은 더 이상 사라짐 모션을 호출하면 안 된다
const showBlock = html.slice(html.indexOf("const SHOW="), html.indexOf("function generic"));
for (const n of [28,60,61]) ok(`SHOW[${n}] bloomWedges 미사용`, !new RegExp(`${n}:s=>bloomWedges`).test(showBlock));
ok("SHOW[58] aPush 미사용", !/aPush/.test(showBlock));
ok("SHOW[62] aGrowC 미사용(1회는 aGrowCIn만)", !/"aGrowC"/.test(showBlock));
for (const n of [28,58,60,61,62]) ok(`LIFE[${n}] 존재`, new RegExp(`\\b${n}\\s*:\\s*s\\s*=>`).test(html.split("const LIFE")[1]||""));

// Task 6: 0(정지) 7종은 LIFE 엔트리가 없어야 한다
const lifeBlock = html.split("const LIFE")[1] || "";
for (const n of [4,38,70,71,72,73,74]) ok(`LIFE[${n}] 없음(정지)`, !new RegExp(`\\b${n}\\s*:\\s*s\\s*=>`).test(lifeBlock));
// Task 6: 효과 있는 대표 번호 존재 확인
for (const n of [1,2,3,5,6,7,8,12,14,17,19,20,29,31,40,41,43,44,46,53,56,63,65,82]) ok(`LIFE[${n}] 존재`, new RegExp(`\\b${n}\\s*:\\s*s\\s*=>`).test(lifeBlock));

// ===== 키트 동기화 가드 (Task 7) =====
const kit = readFileSync(join(root, "references", "qqq-component-kit.js"), "utf8");
ok("키트에 LIFE 포함", /const LIFE\s*=/.test(kit));
ok("키트에 cycleHighlight 포함", /function cycleHighlight/.test(kit));
ok("키트에 aRiseTIn 키프레임 포함", /aRiseTIn/.test(kit));
ok("키트에 bloomWedges 미포함(재설계 반영)", !/function bloomWedges/.test(kit));

// Task 7 review: SHOW 블록에 직접 A(var,"<루핑 등장 키프레임>") 잔존 없음 가드
const showBlk = html.slice(html.indexOf("const SHOW="), html.indexOf("function generic"));
const bareEntrance = /[^A-Za-z]A\(\s*[A-Za-z_$][\w$]*\s*,\s*"a(RiseT|RiseB|SlideL|SlideR|Pop|Fade|GrowY|GrowX|Draw|WipeX|GrowC|Bloom)"/;
ok("SHOW 진입 모션에 직접 A(...) 무한 루프 잔존 없음(전부 enterA+*In)", !bareEntrance.test(showBlk));

let failed = 0;
for (const c of checks) { console.log(`${c.pass?"PASS":"FAIL"}  ${c.name}`); if(!c.pass) failed++; }
console.log(`\n${checks.length - failed}/${checks.length} passed`);
process.exit(failed ? 1 : 0);
