# 컴포넌트 모션 — 갤러리의 "움직이는 컴포넌트"를 실제 슬라이드에 그대로

> **원칙**: 모든 컴포넌트는 등장 후 정착해 사라지지 않으며, 그 위에 비파괴 생명 레이어가 영구히 돈다.

`component-gallery.html`에서 보이는 **움직이는 시각 컴포넌트(톱니 회전·선 위 점·저울 흔들림·스펙트럼 진동·막대 자람·파이 순차 등)를 실제 생성 슬라이드에 1:1로** 재현하기 위한 모듈이다.

핵심 원리: 갤러리가 쓰는 **바닐라 모션 엔진**(CSS keyframes + SMIL + DOM 후처리)을 자기완결 키트로 묶어 두고, 컴포넌트 SVG/HTML을 `innerHTML`로 그린 뒤 번호로 모션을 입힌다. 이 방식은 React/Framer Motion과 **다른 노드**에서 동작하므로 충돌이 없다.

## 구성 파일

- **`references/qqq-component-kit.js`** — 자기완결 키트(토큰+빌더+컴포넌트 렌더 `C`배열+키프레임+모션엔진). 클래식 `<script>`로 인라인하면 `window.QQQ` 노출. **자동 생성물 — 직접 수정 금지.**
- **`references/build-kit.js`** — 갤러리에서 키트를 재생성하는 스크립트. 갤러리(모양/모션)를 고치면 `node references/build-kit.js`로 다시 뽑는다.
- (모양·모션의 원본은 항상 `component-gallery.html`. 키트는 그 파생물이다.)

## 빠른 사용 (3단계)

```html
<!-- 1) 키트를 '클래식' 스크립트로, React/Babel '앞'에 인라인 (window.QQQ 준비) -->
<script>/* qqq-component-kit.js 내용을 통째로 여기에 인라인 */</script>

<!-- 키프레임은 키트가 <style id="qqq-motion-kf">로 자동 주입한다 (별도 CSS 불필요) -->

<!-- 2) React/Babel은 그 뒤에 -->
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
...
```

```jsx
// 3) 번호로 컴포넌트를 그리고 모션을 입히는 래퍼 (덱 안에 정의)
function GalleryComponent({ n }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current && window.QQQ) window.QQQ.mount(n, ref.current); }, [n]);
  return <div className="stage" ref={ref} />;   // QQQ.mount가 .stage class를 보장하지만 명시해도 됨
}

// 사용: 슬라이드 템플릿(Layer 1) 안에 시각 컴포넌트(Layer 2)로 박는다
<GalleryComponent n={27} />   // 톱니바퀴가 맞물려 돈다
<GalleryComponent n={39} />   // 양팔저울이 흔들린다
<GalleryComponent n={56} />   // 꺾은선이 손으로 그리듯 그려진다
```

이게 전부다. `QQQ.mount(n, el)`이 `el.innerHTML`에 갤러리와 동일한 SVG/HTML을 넣고, **1회 등장 후 정착**시킨 뒤 비파괴 **생명 레이어**(번호별 맞춤 영구 루프)를 그 위에 얹는다.

## QQQ API

| 호출 | 동작 |
|---|---|
| `QQQ.mount(n, el)` | `el` 안에 컴포넌트 n을 그리고, 1회 등장 후 정착 + 생명 레이어 시작. `prefers-reduced-motion`이면 모션 없이 최종 상태로만 렌더(생명 레이어 생략). 재호출 시 재적용. |
| `QQQ.render(n)` | 컴포넌트 n의 SVG/HTML 문자열만 반환(모션 없음). 정적 미리보기/PDF용. |
| `QQQ.byN` | 번호→컴포넌트 메타(`{n,type,en,ko,use,cat,render}`) 맵. |
| `QQQ.applyMotion(comp, el)` | 이미 그려진 `el`에 모션만 적용(저수준). |

## React / Babel 주의 (중요)

- 키트는 **클래식 `<script>`**(=`type` 없음)로, **React/Babel보다 먼저** 싣는다. 그래야 `window.QQQ`가 컴포넌트 마운트 시점에 준비된다.
- Babel은 **classic JSX 런타임**으로 컴파일해야 한다(automatic 런타임은 `import {jsx} from 'react/jsx-runtime'`를 내보내 브라우저 스크립트에서 `Cannot use import statement outside a module`로 깨진다). 덱은 `React.createElement`가 스코프에 있는 전제(=classic)로 JSX를 쓴다.
  - **확실한 방법(검증됨):** `@babel/standalone`을 **7.x로 핀**하고 `data-presets="react"`를 준다 — Babel 7의 preset-react 기본이 classic이다.
    ```html
    <script src="https://unpkg.com/@babel/standalone@7.24.7/babel.min.js"></script>
    <script type="text/babel" data-presets="react"> /* ... */ </script>
    ```
    (무핀 `@babel/standalone`이 Babel 8을 받으면 automatic이 기본이라 깨질 수 있다. `component-gallery-v2.html`이 이 핀으로 75개 컴포넌트를 정상 구동한다.)
- 컴포넌트 내부는 `innerHTML`(키트가 채움)이라 React가 reconcile하지 않는다 → 키트가 주입한 SMIL/인라인 스타일이 보존된다. 컴포넌트를 React로 다시 그리지 말고 **항상 빈 `<div ref>`만 주고 키트에 맡긴다.**

## Framer Motion과의 공존 (충돌 없음)

SKILL.md 2번 규칙 "같은 요소에 CSS animation과 FM을 동시에 걸지 마라"에 **안 걸린다.**

- **FM**: 슬라이드/항목의 **등장**(`SlideMotion.enter`)을 바깥 `MotionItem`(컴포넌트를 감싼 래퍼)에 건다.
- **키트 모션**: 컴포넌트 **내부 SVG/HTML 노드**(톱니 `<g>`, 선 `<path>`, 점 등)에 건다.
- 서로 **다른 노드**이므로 갤러리의 "카드 등장 vs 내부 모션"이 공존하던 것과 동일하게 안전하다.

즉: `<MotionItem enter><GalleryComponent n={27} /></MotionItem>` — 바깥은 FM으로 스르륵 등장, 안쪽 톱니는 키트로 무한 회전.

## 가독성 / reduced-motion / 글씨 규칙

- 키트는 `@media (prefers-reduced-motion: reduce)`에서 CSS 애니메이션을 끄고, `QQQ.mount`도 생명 레이어(SMIL·JS 루프)를 건너뛴다(즉시 정착·완전 정지).
- 키트 모션은 **비텍스트 시각 요소**(도형·선·점·막대·조각)에 든다 — SKILL.md 9번(읽는 글씨엔 지속 모션 금지)과 충돌하지 않는다. 컴포넌트 안의 라벨 글씨는 등장 후 정착해 멈춘다(38·70~74처럼 생명 레이어 없이 완전 정지인 것도 있음).
- 컴포넌트 안 글씨도 24px 미만 금지 규칙은 그대로 — 갤러리 미리보기는 축소판이라 작아 보일 뿐, 실제 슬라이드 캔버스(1200×900)에 키우면 24px+가 되도록 배치/스케일한다.

## 번호별 시그니처 모션 (요약 — 자세한 건 키트의 `SHOW`/`LIFE` 레지스트리)

> 모든 컴포넌트는 **등장 1회 후 정착** (opacity→0 루프 없음). 정착 위에 **비파괴 생명 레이어**가 영구히 돈다. ★ 표시는 기존 bloom/disappear 모션을 재설계한 항목.

| 번호 | 등장(1회) | 생명 레이어(영구·비파괴) |
|---|---|---|
| 1·2 제목/섹션 | 위에서 페이드인 | 글로우 호흡 |
| 3·6·48 핵심단어/파트/요점 | 위에서 페이드인 | 광택 스윕 |
| 5 인용문 | 위에서 페이드인 | 맥박 |
| 7·45 발문/생각멈춤 | 위에서 페이드인 | 흔들림 |
| 8·9·18·25·31·32·42 카드/피라미드/시대 | 순차 팝 | 강조 순회 |
| 10·11·13·46·47·52·63·64 칩/OX/수치/점 | 순차 팝 | 반짝임 |
| 12·15·19·21·22·23·24·36·65·66·68 흐름/단계 | 좌→우(또는 아래→위) 순차 | 방향 펄스 |
| 14·16·17 비교 | 좌·우 동시 분할 | 양쪽 번갈아 |
| 20·29·30·33·34·49·56·57 관계/선 | 선 그려지고 정착 | 선 위 흐르는 점 |
| 26 순환 루프 | 마디 순차 등장 | 선 위 흐르는 점 (현행 유지) |
| 27 톱니 | 맞물려 등장 | 회전 (현행 유지) |
| 28·60 블록/파이 | 순차 등장·정착 | 강조 순회 ★ (bloom 대체, 사라짐 없음) |
| 35 방사형 | 방사 등장 | 선 위 흐르는 점 (현행 유지) |
| 37 스펙트럼 | 마커 오른쪽으로 정착 | (현행 유지) |
| 4 핵심문장·38·70·71·72·73·74 정적 | 페이드인 정착 | 없음(완전 정지) |
| 39 양팔저울 | 수평 등장→오른쪽 기울어 정착 | 시소 진자 (현행 유지) |
| 40 동심원 | 중심부터 확산 등장 | 파동 펄스 |
| 41 연표 | 순차 팝 | 축 따라 마커 이동 |
| 43·50 결정적순간/마무리 | 팝 | 글로우 호흡 |
| 44 모둠토론 | 말풍선 팝 | 미세 부유 |
| 53·54·55·58·59·67·82 막대/스택/면/타일 | 아래서 자람 또는 좌→우 | 광택 스윕 (★ 58: 경계흔들림→정착+스윕) |
| 61 도넛 | 순차 등장·정착 | 강조 순회 ★ (bloom 대체) |
| 62 레이더 | 중앙서 퍼져 정착 | 반짝임(꼭짓점) ★ (퍼짐 후 유지) |
| 그 외 | 카테고리 기본 등장 | 방향 펄스 또는 반짝임 |

## 갱신

갤러리(`component-gallery.html`)의 모양·모션을 고친 뒤에는 **반드시**:

```bash
node references/build-kit.js     # qqq-component-kit.js 재생성
```

키트는 파생물이므로 키트를 직접 손대지 말 것. 단일 진실원천은 갤러리다.
