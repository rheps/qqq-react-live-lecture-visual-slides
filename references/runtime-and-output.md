# Runtime & Output (Navigation / URL / Rendering / Notes / Progress / Output Spec)

이 문서는 네비게이션 훅, URL 동기화, 렌더링 최적화, speaker notes 처리, progress bar, 출력 요구사항, 금지 항목을 다룬다. 첨부 md의 17·18·19·20·21·22·23번 섹션에 해당한다.

---

## 1. `useSlideNavigation` 훅

이 skill의 모든 슬라이드 시스템은 **하나의 커스텀 훅**이 슬라이드 이동을 책임진다. 여러 군데에 분산하면 무한 루프·중복 핸들러로 빠르게 무너진다.

훅이 관리할 상태:

- `slideIndex` — 현재 슬라이드 인덱스
- `step` — 현재 슬라이드 안의 build 진행 단계
- `direction` — `"forward"` 또는 `"backward"` (전환 애니메이션 방향 결정용)
- `isAnimatingRef` — 전환 중 입력을 막기 위한 ref 락

지원할 키 입력:

| 키 | 동작 |
|---|---|
| `ArrowRight` / `PageDown` / `Space` | next (build → 다음 슬라이드) |
| `ArrowLeft` / `PageUp` | prev |
| `Home` | 첫 슬라이드로 |
| `End` | 마지막 슬라이드로 |

`Space`는 브라우저 기본 스크롤이 일어나지 않게 `e.preventDefault()`를 호출한다. 다만 input/textarea/contenteditable 요소에 포커스가 있으면 키 네비게이션을 무시한다.

터치:

- 좌우 swipe 지원
- 의도치 않은 작은 움직임은 무시 (예: 50px 미만 이동은 무시)
- 수직 swipe와 구분 (수평 이동이 수직 이동보다 클 때만 슬라이드 이동)

입력 잠금:

- 전환 애니메이션 진행 중에는 추가 입력 무시 (`isAnimatingRef.current === true`)
- 연속 키 입력으로 step·slide가 폭주하지 않도록 짧은 락 (전환 시간과 동일하게)

훅의 인터페이스 예:

```js
function useSlideNavigation(slides) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("forward");
  const isAnimatingRef = useRef(false);

  const next = useCallback(() => goTo(slideIndex + 1), [goTo, slideIndex]);
  const prev = useCallback(() => goTo(slideIndex - 1), [goTo, slideIndex]);
  const goTo = useCallback((idx) => { /* setSlideIndex + setStep(0) + hash */ }, [slides]);

  // keyboard, touch, hash effects + 자동 순차 등장 effect (아래 참고)

  return { slideIndex, step, direction, next, prev, goTo };
}
```

**중요 — step은 클릭이 아니라 타이머로 자동 증가, 이동은 좌/우 클릭.** `next`/`prev`는 슬라이드만 이동하고, `step`은 슬라이드 진입(`slideIndex` 변경) 시 effect가 `setTimeout`으로 0.35초 뒤부터 0.6초 간격으로 자동 증가시킨다(슬라이드 바뀌면 cleanup). **이동: 화면 좌측 절반 클릭=prev, 우측 절반=next**(`onClick`에서 `e.clientX < innerWidth/2 ? prev : next`), 키보드 ←/PageUp·→/Space/PageDown, 그리고 **우하단 ◀ [N/M] ▶ 버튼**(버튼 onClick엔 `e.stopPropagation()` 필수). 항목마다 클릭하게 하지 않는다. 패턴 전문은 `slide-patterns.md`의 "등장은 자동 순차, 좌/우 클릭으로 이동" 참고.

---

## 2. `location.hash` 동기화

URL 동기화는 **`location.hash`만** 사용한다. React Router나 History API를 섞지 않는다.

형식:

```
#slide-1
#slide-2
#slide-3
```

규칙:

- hash가 변경되면 (`hashchange` 이벤트) 해당 slideIndex로 이동한다.
- slideIndex가 변경되면 hash를 갱신한다.
- 현재 슬라이드와 hash가 이미 같으면 **다시 갱신하지 않는다**. 이 가드가 빠지면 hash 변경 → state 변경 → hash 변경 무한 루프가 생긴다.

구현 예:

```js
// hash → state
useEffect(() => {
  const sync = () => {
    const id = location.hash.replace(/^#/, "");
    const idx = slides.findIndex(s => s.id === id);
    if (idx >= 0 && idx !== slideIndex) goTo(idx);
  };
  sync();
  window.addEventListener("hashchange", sync);
  return () => window.removeEventListener("hashchange", sync);
}, [slides, slideIndex, goTo]);

// state → hash
useEffect(() => {
  const id = slides[slideIndex]?.id;
  if (id && location.hash !== `#${id}`) {
    history.replaceState(null, "", `#${id}`);
  }
}, [slideIndex, slides]);
```

`replaceState`로 hash를 바꾸면 hashchange 이벤트가 발생하지 않아 루프가 안 생긴다. (`location.hash = ...`로 바꾸면 hashchange가 발생하므로 가드를 더 신경 써야 한다.)

---

## 3. 렌더링 최적화

발표형은 슬라이드 수가 쉽게 20~50장이 된다. 모든 슬라이드를 한 번에 렌더링하면 SVG·이미지가 많은 경우 부하가 커지고, 전환 애니메이션도 끊긴다.

기본 렌더링 범위:

```
이전 슬라이드 (slideIndex - 1)
현재 슬라이드 (slideIndex)
다음 슬라이드 (slideIndex + 1)
```

규칙:

- 현재 슬라이드 기준 주변 1장씩만 렌더링한다.
- 이미지·SVG가 많은 슬라이드는 필요할 때만 렌더링한다 (lazy mount).
- 슬라이드 수가 많은 것은 **OK**.
- 한 슬라이드가 붐비는 것은 **NOT OK**.

핵심 문장:

> Many slides are acceptable. Crowded slides are not acceptable.

구현 패턴:

```jsx
{slides.map((slide, i) => {
  const distance = Math.abs(i - slideIndex);
  if (distance > 1) return null; // 멀리 있는 슬라이드는 mount 자체를 안 함
  return (
    <SlideFrame key={slide.id} active={i === slideIndex}>
      <LectureSlideTemplate slide={slide} step={step} />
    </SlideFrame>
  );
})}
```

---

## 4. Speaker Notes 처리

발표형에서는 `notes`가 거의 필수다. 각 슬라이드 데이터는 `notes` 필드를 가져야 한다.

메인 화면에 표시할 것:

- 큰 제목
- 키워드
- 질문
- 도표
- 핵심 시각 요소

`notes`에 넣을 것:

- 강사가 말할 설명
- 예시
- 학생에게 던질 질문
- 전환 멘트
- 배경 지식
- 수업 운영 팁

규칙:

- `notes`는 메인 화면에 표시하지 않는다.
- 단일 HTML 샘플에서는 슬라이드가 바뀌거나 step이 바뀔 때마다 현재 `notes`를 `console.info` 또는 `console.log`로 출력한다 — 강사가 DevTools를 열어 확인할 수 있게.
- 실제 발표자 모드 확장이 필요하면 `BroadcastChannel` 또는 `postMessage`로 별도 창에 동기화한다.

구현 예:

```js
useEffect(() => {
  const current = slides[slideIndex];
  if (!current) return;
  console.info(
    `%c[Speaker Notes] ${current.id} (step ${step})\n%c${current.notes || "(no notes)"}`,
    "color: #C66B3D; font-weight: 700",
    "color: #3D3929"
  );
}, [slideIndex, step, slides]);
```

---

## 5. Progress Bar

진행 상황은 **얇은 progress bar**로 표현한다.

규칙:

- 화면 상단 또는 하단에 얇게 (높이 3~6px).
- progress bar·페이지 번호는 4:3 캔버스가 아니라 **viewport 레벨**(app-wrap 직속, 화면 끝~끝)에 둔다. 스케일 안 받게.
- 진행률 = `(slideIndex + 1) / slides.length`를 기본으로 한다. (step은 자동 등장이라 진행률에 굳이 안 넣어도 된다.)
- progress bar 색은 메인 블루→하늘 그라디언트 (`linear-gradient(90deg,#3B82F6,#0EA5E9)`), 트랙은 옅은 블루 `rgba(59,130,246,0.10)`. 다크 테마에선 트랙을 `rgba(255,255,255,0.08)`로. (옛 테라코타/베이지 아님.)

구현 예:

```jsx
<div className="progress-track">
  <div
    className="progress-fill"
    style={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }}
  />
</div>
```

```css
.progress-track {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: #E8DFD0;
}
.progress-fill {
  height: 100%;
  background: #C66B3D;
  transition: width 0.4s ease;
}
```

---

## 6. 출력 요구사항 (단일 HTML 샘플)

사용자가 단일 HTML 샘플을 요청하면 다음 조건을 모두 만족해야 한다.

- React CDN + Babel standalone(`text/babel`) 사용
- Tailwind CDN 사용 (production-ready라고 부르지 않는다)
- 외부 프레젠테이션 라이브러리 금지 (Reveal.js·Swiper 등)
- 샘플 요청이면 3~5장, 실제 작업은 내용에 맞춰 장수 제한 없음(붐비는 한 장보다 여러 장)
- **Modern Glassy Light 테마**: 메인 액센트 블루 `#3B82F6`, 파스텔 메시 그라디언트 배경 + `backdrop-filter` 유리 카드. 슬라이드별 `theme`로 라이트/다크/웜 전환, 다크는 거의 순수 블랙. **보라/violet/indigo/plum 금지.**
- **전체화면 배경 + 고정 1200×900(4:3) 캔버스 통짜 스케일**: 배경(그라디언트+blob)은 모니터 끝까지, **내용만** 가운데 4:3 캔버스에 담아 `transform:scale(var(--fit))`. 좌우 빈 공간·경계선 없음. 캔버스 안 내용은 **전부 고정 px**, `vh/vw`는 배경·`#root`·페이지번호 같은 viewport 요소에만.
- Pretendard 폰트 (CDN) + 이모지 폰트 폴백
- 모든 visible text 24px 이상 / 제목 48px+ / 핵심 문장 40px+ (글씨 줄이지 말고 슬라이드를 늘린다). `max-width`로 가두지 말고 캔버스 세로를 채워 가운데 정렬
- spring-pop 등장 통일(인라인 transition로 class transition 덮어쓰지 않기) + 지속 애니메이션(breathe/glow); 큰 위치 이동(translateX) 금지
- **항목 자동 순차 등장**(첫 ~0.35초, 이후 0.6초 간격) — CSS 클래스 토글 기반, 항목마다 클릭 안 함
- **이동: 화면 좌반 클릭=이전·우반 클릭=다음**, 키보드 ←/PageUp=이전·→/Space/PageDown=다음·Home/End, **우하단 ◀ [N/M] ▶ 버튼**(stopPropagation). 입력 포커스 중엔 키 네비 무시
- touch swipe
- 내용의 관계를 시각 구조로(카드·바차트·플로우·대조·표 등). title+문단 금지. 구조 선택은 `structure-catalog.md`
- **진행 막대·페이지 번호는 viewport 레벨**(화면 끝~끝, 스케일 안 받음), 제목 위 라벨은 pill 칩 대신 `Eyebrow`(페이드 선+자간)
- `location.hash` 동기화(번호 기반) + 현재±1장만 렌더(lazy mount)
- speaker notes 데이터 + `console` 출력(메인 화면 비표시)
- **내장 텍스트 편집기 필수(섹션 8)**: `E` 키/`✏️` 토글, 텍스트 즉시 반영, **localStorage 자동저장**(원본 시그니처 키), **💾 저장**(File System Access 파일 덮어쓰기·**핸들을 IndexedDB에 기억해 재방문 첫 저장도 허락 한 번**·미지원/`file://`이면 다운로드 폴백)·**⬇ 내보내기**(다운로드)·**↩ 원본으로 되돌리기**. 저장 HTML은 Babel 주입 컴파일 스크립트 제거 + doctype로 재오픈 안전

샘플 콘텐츠는 사용자가 따로 주지 않으면 첨부 md의 24번 변환 예시 ("조선 후기 경제")를 사용한다.

---

## 7. 하지 말아야 할 것 (금지 목록)

이 skill의 결과물에 다음이 들어가면 안 된다.

- 보라/violet/indigo/plum 계열 색 (라이트·다크 공통, 메인은 블루 #3B82F6). 다크 테마 자체는 슬라이드별 `theme:"dark"`로 허용(거의 순수 블랙) — 금지는 보라·골드·네온 과채도
- 4:3 캔버스 바깥(좌우)을 흰색·검정 등으로 비우는 것 (배경은 viewport 레벨로 끝까지)
- 캔버스 안 내용에 `vh` 사용 (스케일 이중 적용) — 고정 px만
- Reveal.js, Swiper, fullPage.js 등 프레젠테이션 라이브러리
- Framer Motion (기본값으로)
- React Router
- React Transition Group
- 모든 슬라이드를 한 번에 렌더링
- 24px 미만 글씨 (메인 화면)
- 작은 캡션 / 작은 각주 / 작은 페이지 번호
- 긴 문단 (한 슬라이드에 3줄 초과 본문)
- 빽빽한 표 (4행 4열 초과는 의심)
- 복잡한 차트 (Chart.js·Recharts·d3 무리해서 넣지 않는다)
- 청중이 30초 이상 조용히 읽어야 하는 슬라이드
- 내용을 넣기 위해 글씨를 줄이는 것
- 애니메이션이 설명보다 더 튀는 것 (bounce·spin·glow 등)
- Tailwind CDN 샘플을 "production-ready"라고 부르는 것

---

## 8. 내장 텍스트 편집기 (Built-in Slide Editor)

**모든 HTML 결과물에 반드시 포함한다.** HTML·코드 지식이 없는 사용자가 브라우저에서 슬라이드 텍스트를 직접 수정하게 한다. 수정은 **자동저장(localStorage)**되어 새로고침/재방문해도 유지되고, **저장(파일 덮어쓰기)** 또는 **내보내기(새 파일 다운로드)**로 파일에 반영한다.

### 트리거
- `E` 키 → 편집 패널 열기/닫기 토글
- 화면 우하단 `✏️` 플로팅 버튼 → 동일 동작
- 편집 패널이 열린 상태에서도 슬라이드 좌우 이동 가능
- input/textarea에 포커스가 있을 때는 `E` 키 무시 (타이핑과 충돌 방지)

### 편집 패널 UI
- 화면 오른쪽에 고정 패널 (`position: fixed; right: 0; top: 0; bottom: 0; width: 420px`) — 텍스트가 편하게 보이도록 넉넉한 폭
- 배경: `var(--card)` 또는 동등한 밝은 크림, 보더: 좌측에 1px 선
- **상단 슬라이드 목록 (순서 변경·삭제·복제)**: 번호 + 제목 한 줄씩, 클릭하면 해당 슬라이드로 이동. 각 줄에 **드래그 손잡이(⠿)로 끌어 옮기기 · ▲▼(한 칸 이동) · ⧉(복제) · 🗑(삭제)**. `draftSlides`를 splice로 재배열/삭제하므로 💾 저장·자동저장에 그대로 반영된다. 규칙: 마지막 한 장은 삭제 금지, 직전 삭제는 헤더 **'↩ 삭제 취소'**(`lastDeleted` 상태)로 복구. 복제본은 **새 `id` 부여**(React key 충돌 방지). 슬라이드가 줄면 `useNav`가 현재 idx를 범위 안으로 **클램프**(`useEffect(()=>{if(idxRef.current>n-1)go(Math.max(0,n-1))},[n,go])`). 드래그는 **손잡이=drag source, 행 전체=drop target**, 행 안 버튼 onClick엔 `stopPropagation`. 목록 영역은 여러 장 보이게 넉넉히(`maxHeight ~300`).
- **파일끼리 슬라이드 이동 (복사 → 붙여넣기, 보관함)**: 각 덱은 독립 앱이라 직접 드래그로 넘길 수 없어 **복사/붙여넣기**로 옮긴다. 각 줄 **📋 복사**는 슬라이드를 **공용 localStorage 보관함**(`bigsilver-slide-clipboard` — srcSig 무관 **전역** 키)에 담고(여러 장 쌓기 가능), 목록 상단 **📥 붙여넣기 (N장)**이 보관함 슬라이드들을 현재 위치 뒤에 삽입한다(붙여넣을 때 **새 `id` 부여**로 key 충돌 방지). **🧹**로 보관함 비우기. 보관함은 **같은 origin**(localhost·배포)이면 덱끼리 공유돼 — 덱 A에서 📋 → 덱 B 열어 📥. `storage` 이벤트로 다른 탭 변화도 실시간 반영. (`file://` 더블클릭은 origin이 갈려 공유 안 됨 — localhost/배포에서 쓰도록 안내.) 이동 = 복사 + 붙여넣기 + 원본 🗑.
- **하단 편집 폼**: 현재 슬라이드의 텍스트 필드를 input/textarea로 표시
  - 편집 가능: `title`, `subtitle`, `body`, `quote`, `notes`, `keywords[]`, `builds[].label`, `builds[].detail` 등 텍스트 계열 전부
  - 숨김: `id`, `type` (기술 필드)
  - 배열 항목은 항목별 textarea로 각각 표시
  - **영상(`video`) 슬라이드**: `videoId`를 그대로 노출하지 말고 **"유튜브 주소" 입력칸**을 둔다. 링크(`watch?v=` · `youtu.be/` · `shorts/` · `embed/` · 원시 11자)를 붙여넣으면 ID를 추출(`parseYouTubeId`)해 즉시 교체. 인식 실패 시 빨간 테두리로 알림. (강사가 11자 ID를 알 필요 없게.)
- **"수정된 HTML 다운로드" 버튼**: 패널 최하단 고정, 포인트 컬러 배경 흰 텍스트

### React 상태 구조
```js
const [editMode, setEditMode] = React.useState(false);
// draftSlides가 발표 화면 렌더링 소스 — 편집 즉시 반영
const [draftSlides, setDraftSlides] = React.useState(
  () => JSON.parse(JSON.stringify(slides))
);

function updateField(slideIdx, field, value) {
  setDraftSlides(prev => {
    const next = JSON.parse(JSON.stringify(prev));
    next[slideIdx][field] = value;
    return next;
  });
}

function updateNestedField(slideIdx, arrayKey, itemIdx, field, value) {
  setDraftSlides(prev => {
    const next = JSON.parse(JSON.stringify(prev));
    next[slideIdx][arrayKey][itemIdx][field] = value;
    return next;
  });
}
```

### 저장 / 내보내기 / 자동저장 구현

**핵심: 편집본 HTML을 만들 때 Babel이 런타임에 주입한 컴파일 `<script>`를 반드시 제거한다.**
`@babel/standalone`은 `type="text/babel"` 소스를 컴파일해 **새 `<script>`(type 없음)를 DOM에 append**한다. `document.documentElement.outerHTML`을 그냥 저장하면 이 컴파일 스크립트가 같이 들어가, 재오픈 시 그게 먼저 실행돼 **createRoot 중복 → 옛 slides가 뜨고 편집 유실**된다(실제로 겪음). 그래서: 클론에서 `src 없고 type≠text/babel`인 script 제거 + `#root` 비우기 + `<!DOCTYPE html>` 부착. 정규식은 실제 소스 형식에 맞춰 `const slides\s*=\s*\[` (공백 유무 무관), 치환은 함수형(`$` 오해석 방지).

```js
function buildEditedHtml(draftSlides) {
  const html = document.documentElement.cloneNode(true);
  html.querySelectorAll("script").forEach(sc => {
    const ty = sc.getAttribute("type") || "";
    if (!sc.getAttribute("src") && ty !== "text/babel") sc.remove(); // Babel 주입분 제거
  });
  const root = html.querySelector("#root"); if (root) root.innerHTML = "";
  const serialized = JSON.stringify(draftSlides, null, 2);
  return "<!DOCTYPE html>\n" + html.outerHTML.replace(
    /const slides\s*=\s*\[[\s\S]*?\];/, () => "const slides=" + serialized + ";");
}
```

**저장(파일 덮어쓰기) — File System Access API + 핸들 기억(IndexedDB).** Chrome/Edge + **secure context(localhost/https)**에서만 동작(`file://`·Firefox/Safari 미지원). 같은 세션은 핸들을 `useRef`에 두면 재프롬프트가 없지만, **새로고침·재방문하면 `useRef`가 사라져 매 세션 첫 저장 때 또 폴더를 탐색**해야 한다. 그래서 **파일 핸들을 IndexedDB(파일 경로별 키)에 보관**한다 → 다음 세션 첫 저장은 `showSaveFilePicker`(폴더 탐색) 대신 **권한 허락 한 번**(`requestPermission`)으로 같은 파일을 바로 덮어쓴다. (브라우저 보안상 쓰기 권한 클릭 자체는 0번이 될 수 없다 — "폴더 탐색"을 "허락 클릭 1회"로 줄이는 게 최선.) 핸들이 무효(파일 이동·삭제·권한 거부)면 자동으로 다시 파일 선택으로 폴백하고, `📍 저장위치 잊기` 버튼으로 초기화한다.

```js
// 핸들 기억 헬퍼 (모듈 레벨)
const FS_DB="bigsilver-fs", FS_STORE="handles", FS_KEY="deck:"+location.pathname; // 파일별 키
function fsIdb(){return new Promise((res,rej)=>{try{const r=indexedDB.open(FS_DB,1);
  r.onupgradeneeded=()=>r.result.createObjectStore(FS_STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}catch(e){rej(e);}});}
async function fsSaveHandle(h){try{const db=await fsIdb();await new Promise((res,rej)=>{const tx=db.transaction(FS_STORE,"readwrite");tx.objectStore(FS_STORE).put(h,FS_KEY);tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});}catch(e){}}
async function fsLoadHandle(){try{const db=await fsIdb();return await new Promise((res,rej)=>{const tx=db.transaction(FS_STORE,"readonly");const q=tx.objectStore(FS_STORE).get(FS_KEY);q.onsuccess=()=>res(q.result||null);q.onerror=()=>rej(q.error);});}catch(e){return null;}}
async function fsForgetHandle(){try{const db=await fsIdb();await new Promise(res=>{const tx=db.transaction(FS_STORE,"readwrite");tx.objectStore(FS_STORE).delete(FS_KEY);tx.oncomplete=res;tx.onerror=res;});}catch(e){}}
async function fsEnsurePerm(h,req){try{const o={mode:"readwrite"};if((await h.queryPermission(o))==="granted")return true;if(req&&(await h.requestPermission(o))==="granted")return true;}catch(e){}return false;}

const fileHandleRef = useRef(null);
async function save(draftSlides) {
  const out = buildEditedHtml(draftSlides);
  if (window.showSaveFilePicker) {
    try {
      let h = fileHandleRef.current;
      if (!h) h = await fsLoadHandle();                 // 기억된 저장 위치
      if (h && !(await fsEnsurePerm(h, true))) h = null; // 쓰기 허락 한 번(사용자 제스처 내)
      if (!h) {                                          // 처음이면 위치 선택 후 기억
        h = await window.showSaveFilePicker({ suggestedName: "slides.html",
          types: [{ description: "HTML", accept: { "text/html": [".html"] } }] });
        await fsSaveHandle(h);
      }
      fileHandleRef.current = h;
      const w = await h.createWritable(); await w.write(out); await w.close();
      return "저장됨 ✓";
    } catch (e) {
      if (e && e.name === "AbortError") return "";       // 취소
      if (e && ["NotFoundError","NotAllowedError","NoModificationAllowedError"].includes(e.name)) {
        await fsForgetHandle(); fileHandleRef.current = null; return "기억된 위치를 못 써요 — 다시 파일을 골라 주세요"; }
    }
  }
  downloadHtmlString(out, "slides.html"); // 폴백
  return "다운로드됨";
}
// 마운트 시: const h=await fsLoadHandle(); if(h) setStatus("저장 위치 기억됨 — 💾 누르고 ‘허락’ 한 번이면 바로 덮어쓰기");
```
⚠️ `requestPermission`은 **사용자 제스처(저장 버튼 클릭) 안에서** 호출해야 하므로 `save` 안에서 부른다(transient activation은 IDB 읽기 한 번 정도는 버틴다). 핸들은 IndexedDB에 structured-clone으로 보관된다(Chrome).

**내보내기 — 항상 다운로드**(`buildEditedHtml` 결과를 Blob → a[download]). "다른 이름으로" 보관용.

**자동저장 — localStorage.** draft가 바뀔 때마다 저장하고, 마운트 시 복원한다. **키에 원본 slides의 시그니처를 넣어, 생성기/개발자가 소스 slides를 고치면 키가 달라져 옛 편집본이 새 소스를 덮지 않게 한다**(이 함정 주의). "원본으로 되돌리기"로 키 삭제 + 원본 복원.

```js
function srcSig(arr){ const s=JSON.stringify(arr); let h=0;
  for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))|0; return arr.length+"_"+(h>>>0).toString(36); }
const AUTOSAVE_KEY = "deck-draft-" + srcSig(slides);
const [draft, setDraft] = useState(() => {
  try { const raw = localStorage.getItem(AUTOSAVE_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return JSON.parse(JSON.stringify(slides));
});
useEffect(() => { try { localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft)); } catch (e) {} }, [draft]);
```

패널 하단 버튼: **💾 저장**(주), **⬇ 내보내기**(보조), **↩ 원본으로 되돌리기**(작게). 저장/내보내기 직후 "저장됨 ✓" 같은 상태 텍스트를 잠깐 보여준다.

### 스타일 규칙
- input/textarea: 밝은 배경, 차콜 텍스트, 얇은 보더, 라운드 모서리
- 현재 편집 중인 슬라이드 목록 항목은 하이라이트
- 패널 열릴 때 발표 무대는 `pointer-events: none` (실수 클릭 방지)
- 글자 크기: 최소 14px (편집 패널 내 라벨/입력 필드)
- 각 textarea는 **최소 2줄 높이**(짧은 값도 1줄로 답답하지 않게), 내용이 길면 줄 수만큼 자동으로 커짐(최대 ~8줄). `rows={Math.min(8,Math.max(2,value.split("\n").length))}`. 가로는 패널 폭에 꽉 차게(`width:100%`)

### 주의 사항
- `draftSlides`를 발표 화면의 렌더링 소스로 사용한다 (편집 즉시 슬라이드에 반영)
- 저장/내보내기/다운로드 후에도 편집 모드 유지 (닫으려면 E 키 또는 ✕ 버튼)
- 내보낸/저장한 파일은 편집기 포함 완전한 HTML이다 (재편집 가능)
- 편집은 키 입력마다 localStorage에 자동저장 — input/textarea 포커스 중엔 키 네비게이션(←/→/Space) 무시(타이핑과 충돌 방지)
- File System Access 저장은 secure context 한정 — `file://`로 열면 폴백 다운로드만 됨을 사용자에게 알린다
- **💾 저장은 조용히 실패할 수 있다(실제 데이터 유실 사고 발생).** 자동화(automation) 플래그로 띄운 브라우저·미지원 브라우저·`file://`에서는 `showSaveFilePicker`가 안 뜨거나 멈춰서 "아무 일도 안 일어난" 것처럼 보인다. → 저장 성공/실패/폴백을 **항상 눈에 띄게 표시**하고(상태 텍스트), 어떤 경우에도 멈추지 말고 다운로드로 폴백한다.
- **브라우저 편집은 💾 저장으로 파일에 쓰기 전엔 localStorage(자동저장)에만 있다.** 자동저장은 새로고침 대비 안전망일 뿐, 원본 `slides`가 바뀌면 키가 어긋나 복원이 안 될 수 있다. 사용자에게 "**중요한 편집은 💾 저장으로 파일에 남겨라**"를 분명히 안내한다. (같은 origin이면 별도 `recover.html`로 localStorage를 읽어 복구할 수 있다.)

---

## 9. 마지막 요약

> 작게 쓰지 말고, 나눠서 크게 보여준다.
> 예쁨은 장식이 아니라, 명확한 시각 구조와 부드러운 움직임에서 나온다.
> 말할 때 빛나는 자료. 강사의 설명을 살리는 자료. 청중이 한눈에 핵심을 잡는 자료.
