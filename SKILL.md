---
name: qqq-react-live-lecture-visual-slides
description: Use this skill when the user wants to create a React-based slide system for live teaching, lectures, classroom explanation, online lessons, or instructor-led presentations (강의용 슬라이드, 발표 슬라이드, 수업 자료, 강의 화면). The slides use a "Modern Glassy Light" design — bright pastel-gradient background, glassmorphism cards (backdrop-filter blur), pastel glow box-shadows, and spring-pop animations (cubic-bezier overshoot). Large text (24px minimum, 48px+ titles), strong readability, and Pretendard font. The slides are visual support for an instructor's speech, not reading materials — the instructor explains, the slide supports dynamically. Trigger whenever the user mentions React 발표 슬라이드, 강의용 화면, 수업용 슬라이드, 트렌디한 발표 자료, 큰 글씨 발표 자료, online lecture slides, classroom slides, or wants slides that help an instructor explain while teaching, even if they don't say the word "React" explicitly.
---

# React Live Lecture Visual Slides (Modern Glassy Light)

이 skill은 강사가 모니터/빔프로젝터 앞에서 **직접 말로 설명할 때** 화면이 트렌디하고 역동적으로 설명을 받쳐주는 React 슬라이드 시스템을 만드는 데 사용한다. 최신 테크 유튜브 영상에서 볼 수 있는 **글래스모피즘(Glassmorphism) + 스프링 팝업 애니메이션**으로 시선을 사로잡는다.

## 핵심 정체성

> 강사가 설명하고, 화면은 트렌디하고 역동적으로 반응한다.
> The instructor explains. The slide reacts dynamically.

슬라이드 하나는 세 층으로 만든다.

```
Layer 1 — Slide Template     한 장 전체의 큰 구조
Layer 2 — Visual Component   내용 하나를 표현하는 시각 요소 (glass card, bar, flow line)
Layer 3 — Micro Animation    요소가 나타나고 강조되는 방식 (spring-pop, glow, grow)
```

Layer 1만 있고 Layer 2가 없으면 결과물이 "제목 + 텍스트 카드" 패턴만 반복된다.
텍스트 내용의 관계를 시각 구조로 바꾸는 것이 이 Skill의 핵심이다.

이 원칙에서 나오는 결과:

- 화면에는 **핵심만 크게** 보여준다 (제목 48px+, 어떤 글자도 24px 미만 금지).
- 한 슬라이드에는 **하나의 메시지**만 담는다.
- 내용이 많으면 **글씨를 줄이지 말고 슬라이드와 Build 스텝을 늘린다.**
- 긴 설명은 화면이 아니라 `notes` 필드(speaker notes)에 둔다.
- 화면은 **3초 안에** 이해되어야 한다.

## 언제 이 skill을 사용하는가

다음과 같은 요청이 들어올 때 반드시 활성화한다.

- 강의/수업/발표용 React 슬라이드 제작
- 트렌디하고 역동적인 발표 자료
- 온라인 강의 녹화용 화면
- 교실/강의실 빔프로젝터용 슬라이드
- 키워드·차트·플로우 중심의 수업 자료

다음은 이 skill의 대상이 아니다.

- 인쇄용/PDF형 읽기 자료
- 빽빽한 표·논문식 슬라이드
- Reveal.js 등 기존 프레젠테이션 라이브러리 위에 만드는 자료

## 작업 원칙 (요약)

1. **Modern Glassy Light 테마 + 다중 테마**: 기본 라이트는 블루/하늘/틸 파스텔 메시 그라디언트 + `backdrop-filter: blur(16px)` 유리 카드. **메인 액센트는 블루 `#3B82F6`** (보라/violet/indigo/plum 금지). 슬라이드별 `theme` 필드로 라이트/다크/웜 전환. **다크 = 거의 순수 블랙** (`#000000 → #0a0a0a` 그라디언트). 다크에서도 액센트는 블루/하늘. **보라(violet/indigo) 금지는 글씨·UI·카드·강조색에 한한다 — 단 움직이는 배경 장식(회전 오로라·드리프트 블롭)에만 violet 한 점 허용**(8번 배경 스택의 `b4`·오로라). 텍스트로는 절대 금지. **다크는 "진짜 어둡게"**(글로우 blob 강도를 죽여 가장자리는 검정 유지, 중앙 burst 금지)하고, 다크 전용 **밤하늘**(은하수 띠+별 반짝임+별똥별)으로 분위기를 낸다. **다크에서 색 강조 글씨가 묻히지 않게 강조색 CSS 변수를 `.theme-dark`에서 밝은 톤으로 override**한다. (`references/motion-theme-upgrades.md` 4·6번)
2. **Framer Motion 기반 등장 + snap 두 함정 유지**: 등장은 `SlideMotion.enter` 프리셋(FM variants)으로. **콘텐츠 캔버스(`.stage-box`)를 `overflow:visible`로 두고 잘림은 viewport 레벨(`#root`/`html,body{overflow:hidden}`)에서만** 처리하므로 `x` 가로 이동(슬라이드 인)도 허용된다(배경 blob은 viewport 레벨 `.bg-layer`에서 이미 클립됨). **snap(끊김) 두 함정은 그대로:** (a) **하위 컴포넌트를 render 함수 안에서 정의하지 마라**(remount→snap, 반드시 모듈 레벨). (b) **같은 요소에 CSS transition/animation과 FM을 동시에 걸지 마라**(충돌·snap). 등장에 FM을 주면 그 요소의 옛 CSS 등장 클래스(`spring-pop` 등)는 제거한다. 색·그림자 같은 지속 CSS는 FM과 다른 속성/노드면 공존 가능.
3. **가독성 절대 수호**: 화려함 속에서도 모든 visible text는 24px 이상. 캡션·라벨도 예외 없음. 글자를 줄이지 말고 슬라이드를 늘린다.
4. **한 슬라이드 = 한 메시지**: 데이터는 CSS `height` transition만으로 바닥에서 솟아오르는 동적 바 차트로 직접 구현한다. 무거운 차트 라이브러리 금지.
5. **기술 스택**: React + **Framer Motion(CDN UMD, `window.Motion`)** + CSS variables + SVG + `location.hash` + 커스텀 훅. 화려한 모션은 Framer Motion으로 구현한다(spring-pop도 FM 스프링으로). FM은 `react-dom` UMD **뒤**, `@babel/standalone` **앞**에 `<script src="https://unpkg.com/framer-motion@11/dist/framer-motion.js"></script>`로 싣는다. `window.Motion`이 없으면(오프라인) 평범한 요소로 degrade하는 가드를 둔다(`const M_OK=!!(window.Motion&&window.Motion.motion)`). **Reveal.js·GSAP은 계속 비사용.** 무거운 차트 라이브러리도 금지(차트는 직접 구현).
6. **Build는 큰 단위로, 연결선 포함**: 항목 박스가 등장할 때 박스 사이를 잇는 얇고 빛나는 세로 연결선이 스르륵 그어지는 Vertical Step Flow를 구현한다. 긴 문장 여러 개를 build로 흘리지 않는다.
7. **이모지 적극 활용**: 강조 요소·step·card에 이모지를 곁들인다 (🔍🎯🎨⚖️, 🧭🌊🔎⚙️🚀 등). `font-family`에 `Segoe UI Emoji`, `Apple Color Emoji`, `Noto Color Emoji` 폴백을 둔다. 큰 이모지는 반드시 `anim-breathe`/`anim-wave`/`anim-float`로 살아 움직이게.
8. **배경도 살아 있게 (전체화면 화려한 레이어 스택)**: 전체화면 `bg-layer`(app-wrap 안, `position:absolute;inset:0`)에 **세 레이어를 쌓는다 — ① 회전 오로라(다색 conic) 1~2겹 ② 드리프트 글로우 블롭 5~6개(b1~b6, 큰 궤도·`mix-blend:multiply`·라이트 `saturate(1.5)`) ③ 빛 입자(라이트=파란 입자·다크=흰 별)**. 다크 테마는 여기에 **밤하늘**(은하수 띠 + 별먼지 + 별똥별 16~20개)을 더한다. blob을 4:3 캔버스(`overflow:hidden`) 안에 넣으면 잘려 좌우 빈 공간·경계선이 생기므로 반드시 viewport 레벨. **라이트 색 구름은 정지처럼 보이면 실패** — 궤도 이동 폭을 화면 대비 ±13~15vw/vh로 크게(주기 26~38s). 복붙용 전체 CSS·JSX(오로라·블롭6 전부·스파크·밤하늘)는 `references/motion-theme-upgrades.md` **8번**.
9. **지속(ambient) 모션 — 비텍스트에만**: 등장이 끝난 뒤에도 화면이 살아 있도록 `SlideMotion.idle` 프리셋(무한 반복)을 둔다. 강도는 `SlideMotion.K`(기본 2.2, 활발). **단, 지속 모션은 이모지·그림·카드·큰 기호 등 비텍스트 요소에만 적용한다. 제목·핵심문장·질문·본문 같은 읽는 글씨에는 지속 모션을 절대 걸지 않는다**(글씨가 계속 흔들리면 읽기 방해 — 사용자 확정 규칙). 글씨는 `MotionItem`에 `enter`만 주고 `idle`은 주지 않는다. 카드는 인덱스별 delay로 호흡 패턴을 비대칭으로. **추가 원칙: 지속 모션은 비텍스트 도형/장식에만, 등장은 1회 후 정착(절대 opacity→0 루프 금지). 시각 컴포넌트 키트도 동일 — 등장 후 사라졌다가 재등장하는 루프는 허용하지 않는다.**
10. **Speaker notes 필수**: 각 슬라이드 데이터에 `notes` 필드를 두고, 화면에는 표시하지 않고 `console`에 출력한다.
11. **렌더링은 현재 ± 1장만**: 모든 슬라이드를 한 번에 렌더링하지 않는다.
12. **전체화면 배경 + 고정 4:3 캔버스 통짜 스케일**: 배경(그라디언트+blob)은 모니터를 끝까지 꽉 채우고, **내용만** 가운데 고정 `1200×900`(4:3) 캔버스에 담는다. 캔버스는 `transform:scale(var(--fit))`로 화면에 맞춘다(`--fit = min(vw/1200, vh/900)`, resize마다 JS로 갱신). 어느 모니터에서도 동일 비율·동일 글자 크기, 항상 딱 맞고 안 잘림. **내용 사이즈는 전부 고정 px**(캔버스 좌표계)로 — `vh`를 쓰면 스케일이 이중 적용된다. `vh/vw`는 전체화면 요소(배경 blob·`#root`·페이지 번호)에만. 캔버스 세로(900px)를 글자·간격을 키워 꽉 채워 위아래가 비지 않게 한다. (옛 방식인 "4:3 stage-box를 100vh로 두고 바깥을 비우는" 구조는 좌우 빈 공간/경계선 때문에 버렸다.)
13. **CSS 선택자 == className 정확히 일치**: React에서 `className="stage"` 쓰면 CSS도 `.stage`. CSS만 `.slide`로 정의하면 padding/align이 적용 안 되어 슬라이드가 위·아래로 잘려 보인다. (실제 발생함)
14. **언어는 요청 따름**: 한국어로 요청하면 슬라이드 텍스트도 한국어.
15. **항목은 자동 순차 등장 / 좌·우 클릭으로 이동**: 슬라이드에 들어가면 build 항목이 타이머로 하나씩 자동 등장한다(첫 항목 ~0.35초 뒤, 이후 0.6초 간격). 항목마다 클릭하게 하지 않는다. **이동은 화면 좌측 절반 클릭=이전, 우측 절반 클릭=다음** (`onClick`에서 `e.clientX < innerWidth/2 ? prev : next`), 키보드는 ←/PageUp=이전·→/Space/PageDown=다음. **우하단에 ◀ [N/M] ▶ 버튼**도 둬서 클릭으로 이동 — 버튼 onClick엔 반드시 `e.stopPropagation()`(안 하면 좌·우 클릭 영역까지 같이 발동). 바 차트 막대도 같은 0.6초 순차. 강사는 설명만 하고 화면이 알아서 흐른다.
16. **진행 UI는 viewport 레벨 / 라벨은 Eyebrow**: 진행 **막대**는 app-wrap 직속(화면 끝~끝)에 둬 스케일 안 받게 한다(얇은 바라 어느 크기서나 OK). **단 ◀▶ 버튼·페이지 번호·✏️ 편집 버튼·힌트 같은 컨트롤은 `transform:scale(var(--fit))`(transform-origin은 각자 붙은 모서리)로 캔버스와 함께 비례 축소**한다 — 작은 iframe/임베드(연수·공유 페이지)에서 컨트롤만 거대하게 남는 걸 막는다(사용자 확정). 제목 위 작은 라벨('현재 뉴스' 등)은 길쭉한 pill 칩 금지. **공용 `Eyebrow`는 양옆 줄/알약 박스 대신 "텍스트 + 그라데이션 밑줄"(밑줄형)을 기본으로** 한다(양옆 ——— 줄이나 알약은 촌스럽고 다크에서 묻힘). 전경색 상속으로 라이트=잉크/다크=흰 글씨. **밑줄 두께는 6px**(얇으면 안 보임 — 사용자 확정). 이 밑줄형은 `layoutId` 모핑 앵커로도 최적. 키워드 알약·번호 배지처럼 칩이 맞는 곳은 예외. (`references/motion-theme-upgrades.md` 5번)
17. **핵심 개념을 hero로 — 강조는 의미에서 나온다**: 슬라이드마다 "청중이 단 하나 가져갈 개념"을 먼저 정하고, 그걸 **가장 큰 자리(hero)**에 둔다. AI가 자주 틀리는 함정: **"A가 아니라 B"에서 셋업·부정절(A)을 크게 키우고 핵심(B)을 작은 보조문에 박는 강조 역전.** 핵심은 항상 B(긍정·전환·행동 개념)다. 판정 근거: ① `notes`에 적힌 강조 단서("'오케스트레이터'에 힘을") ② 구조("A가 아니라 B"→B, "A→B"→대조쌍 A↔B). 핵심이 대조면 `key-message`보다 `contrast`/`icon-versus`, 한 단어면 `big-keyword`가 맞을 수 있다 — **강조점이 템플릿 선택을 결정한다.** 문장 안 핵심 단어는 마커 3색으로 부각: `*단어*`→블루→하늘 그라디언트(핵심·지향), `~단어~`→로즈/빨강(대비·지난 상태), `_단어_`→에메랄드/초록(긍정·강조2). 이 `hl()`는 **모든 템플릿의 모든 텍스트 필드**(제목·부제·문장·질문·인용·라벨·항목·표 머리글/칸·칩·캡션·목차 단계·차트 라벨·Eyebrow)에 적용해, 사용자가 편집기에서 어느 칸을 고치든 마커가 먹게 한다. 그라디언트 span은 `color` fallback 먼저, **로즈 span은 `WebkitTextFillColor`도 로즈로 명시**(그라디언트 투명채움 칸 안에서 `~로즈~`가 사라지는 것 방지). 만든 뒤엔 `qqq-slide-emphasis-audit`로 강조·구조를 점검한다.

18. **내장 텍스트 편집기 필수**: 모든 결과물에 브라우저 편집기를 넣는다(HTML·코드 모르는 강사가 직접 수정). `E` 키/우하단 `✏️`로 우측 패널 토글 → 슬라이드 목록 + 모든 텍스트 필드(input/textarea). 편집은 `draftSlides`로 **즉시 화면 반영** + **localStorage 자동저장**(키에 원본 slides 시그니처를 넣어 소스가 바뀌면 옛 편집본 무시). 하단에 **💾 저장**(File System Access로 파일 덮어쓰기, Chrome/Edge·localhost/https; 미지원·`file://`이면 다운로드 폴백) · **⬇ 내보내기**(다운로드) · **↩ 원본으로 되돌리기**. 저장본은 **Babel 주입 컴파일 스크립트 제거 + #root 비움 + doctype**로 재오픈 안전(안 그러면 중복 createRoot로 구버전이 뜸). 편집 패널 input 포커스 중엔 키 네비 무시. **임베드(iframe) 공개판에선 편집기 전체를 숨긴다** — `const EMBED=(()=>{try{return window.self!==window.top}catch(e){return true}})();` 로 감지해 EMBED면 ✏️ 버튼·`E`키·편집 힌트·편집 패널을 렌더하지 않는다(연수·공유 페이지는 iframe으로 띄워서 누구나 편집하면 안 됨). top-level(직접 열기=작업)에선 그대로 노출. **Enter는 줄바꿈으로 반영**(`hl`이 `\n`→`<br/>` 변환 — 3-b). (`references/runtime-and-output.md` 섹션 8)

19. **모션은 요소마다 다르게 + Magic-Move 모핑(기본 ON)**: 등장을 한 종류(스프링 팝)로만 주면 "다 똑같이 띠용 튕긴다"는 단조로움이 생긴다. 프리셋을 여러 개 두고 **요소 종류로 자동 배정**(제목=좌→우 와이프 `reveal`, 부제=`blur`, 캡션=`rise`)하고 **카드 줄은 좌/플립/우로 방향을 번갈아** 들여보낸다(인접 요소가 같은 방향으로 우르르 들어오지 않게). 연결선·화살표는 `pathLength`로 그려지듯. **새 덱은 기본으로 거의 모든 슬라이드의 `Eyebrow`에 `layoutId="sectionTag"`를 줘 슬라이드 간 모핑**(밑줄이 늘어나며 이동)을 **켠다(기본값·사용자 확정)** — 모핑을 쓰면 슬라이드 전환은 **변형 없는 크로스페이드**여야 한다(스테이지에 x/scale/rotate 금지, `STAGE_FADE`=opacity만, `AnimatePresence` 기본 sync). "5종 화려한 슬라이드 전환"(가로 슬라이드·3D 회전)은 **모핑을 끌 때만** 쓰는 대안(둘이 동시에 못 감). 읽는 글씨에 *지속* 모션 금지 규칙은 유지(여기 다양화는 등장 한정). (`references/motion-theme-upgrades.md` 1·2·3번)

## 작업 순서

1. **콘텐츠 분해**: 긴 문장을 쪼개어 시각적 임팩트가 강한 키워드/데이터 중심으로 재구성. (`references/slide-patterns.md` 참고)
2. **슬라이드 유형 선정**: content intent 분류 후 시각 컴포넌트 선택. (`references/component-selection-rules.md` 참고). title + paragraph 기본값 금지.
3. **선언형 데이터 정리**: `id`, `type`, `title`, `keywords`, `visual`, `builds`, `notes` 필드 채우기. (`references/architecture.md` 참고)
4. **React 컴포넌트 구성**: `Presentation → SlideStage → SlideFrame → LectureSlideTemplate`. 네비게이션은 `useSlideNavigation` 훅 하나가 키보드·터치·hash를 모두 관리.
5. **시각화·애니메이션 추가**: glass-card + spring-pop 기본 적용. 바 차트, 플로우 연결선, glow 강조 등 멀리서도 보이는 큰 시각 요소.
6. **검증**: 모든 visible text 24px 이상, 한 슬라이드 한 메시지, 스크롤 없음, light 배경 유지.

## 슬라이드 템플릿 목록

기본 템플릿:

- `big-title` — 큰 제목 슬라이드
- `key-message` — 핵심 문장 슬라이드
- `question` — 발문·질문 슬라이드
- `three-keywords` — 3개 키워드 glass-card
- `contrast` — 좌/우 대조 (glass-card 양쪽)
- `cause-effect` — 원인→결과 플로우
- `closing-prompt` — 마무리 인용문

트렌디 템플릿 (적극 활용):

- `icon-versus` — 두 glass-card가 양쪽에서 spring-pop으로 등장, 중앙 VS 마크
- `animated-bar-chart` — CSS height transition만으로 바닥에서 솟아오르는 바 차트
- `vertical-step-flow` — 위→아래 키워드 박스 순차 등장 + 박스 사이 빛나는 연결선
- `flow` — 가로 흐름/메커니즘(A→장치→C). 가운데 변환 노드만 glass-card로 박아 강조, 사이에 화살표, 하단 caption. 내용이 "입력→변환→결과" 모양일 때.
- `trinity` — 삼위일체 삼각형. 동등한 **세 요소가 모여 하나(core)**가 될 때. 꼭짓점 3장이 삼각형(둘레선)을 이루고 마지막에 중앙 허브로 색 스포크가 빛나며 모여듦. 내용이 "셋 → 하나(통합)" 모양일 때. (`four-card`는 통합 없는 평면 병렬용.) 코드는 `references/trinity-template.md`.

검증된 추가 템플릿 (코드·스키마는 `references/added-templates.md` — 복붙용):

- `reproduce` — 재생산 루프. "한 번 쓰고 끝이 아니라 계속 재사용·재생산되는 도구"라는 *지속/반복/일관성* 메시지. 허브(도구) → 1·2·3차 산출 체인 → 핵심 단어 hero.
- `platforms` — 카테고리별 묶음. 한 주제 아래 *분야 2~3개* + 분야마다 *대표 항목 칩*(예: 이미지 모델들 / 영상 모델들).
- `reasons` — 이유·근거 세로 나열. 한 주장(title) 아래 *이유/장점 2~3개*를 행마다 이모지+굵은 라벨+설명으로.
- `keymsg` — 핵심 문장 + 칩. 한 문장 주장(hero) + *증거/예시 칩*(파일형식·동작·항목)으로 받침. `key-message`의 칩 강화형.
- `versus` — 단방향/양방향 대결. 두 방식의 *핵심 대조 한 방*. 각 카드에 `tag`+큰 결론어(`head`)+`body`, 중앙 VS.
- `bridge` — A →(라벨)→ B + 설명 카드. "A에서 B로, *무엇 때문에* 바뀌었나"의 원동력을 화살표에 얹고 아래에 용어/배경 설명. `flow`의 설명-카드 변형.
- `tradeoff` — 단점 N + 큰 장점 1. "불편하지만 그래도 쓰는 이유" — 단점 카드(로즈) + 장점 카드(블루·넓게)로 결론을 더 크게. `pros-cons` 강조형.

## 번호로 컴포넌트 고르기

사용자가 **"23번으로 해줘", "62번 차트 써줘"처럼 번호로 지시**하면:

- `references/component-registry.md` — **모든 컴포넌트(1~81)에 번호를 매긴 단일 기준표.** 번호 → `type`·이름·용도를 여기서 찾는다. (75~81 추가 템플릿의 코드는 `references/added-templates.md`.)
- `component-gallery.html` — 스킬 폴더의 **번호별 시각 카탈로그**(브라우저로 열면 1~74가 실제로 그려져 있음 — 75~81은 아직 갤러리 미수록, `added-templates.md` 참고). 사용자가 눈으로 보고 번호를 고르는 화면이며, 각 번호 카드 안에 **그대로 가져다 쓸 SVG/HTML 예시**가 들어 있다. **각 컴포넌트는 갤러리에서 짧은 루프 영상처럼 움직인다**(톱니 회전·선 위 흐르는 점·저울 흔들림·막대 자람·파이 순차 등). 이 움직임을 실제 슬라이드에도 1:1로 넣는 법은 아래 **"번호 컴포넌트는 '움직이는' 채로 만든다"** 항목과 `references/component-motion.md` 참고.
- `요청시` 표시 컴포넌트(파이 60·도넛 61·레이더 62·버블 64·복합 69)는 발표 가독성 때문에 기본 추천에선 빠진다. 번호로 직접 고르면 **더 잘 읽히는 대안을 한 번 안내한 뒤** 사용자가 그대로 원하면 그 번호로 만든다.

## 번호 컴포넌트는 '움직이는' 채로 만든다 — 모션 키트 필수

갤러리에서 보이는 그 움직임(27 톱니 회전·39 저울 흔들림·29·35 선 위 흐르는 점·56 손그림 선·60 파이 순차·63 점 찍힘 등)을 **실제 생성 슬라이드에도 1:1로 넣는다.** 정적 SVG를 그대로 복붙해 멈춰 있게 두지 말 것.

- 덱에 `references/qqq-component-kit.js`를 **클래식 `<script>`로, React/Babel 앞에** 통째로 인라인한다 → `window.QQQ` 노출(키프레임도 자동 주입, 별도 CSS 불필요).
- 시각 컴포넌트(Layer 2)는 빈 `<div ref>`에 `useEffect(()=>window.QQQ.mount(n, ref.current),[n])`로 그린다. 래퍼 `GalleryComponent({n})`을 한 번 정의해 재사용한다(코드는 `component-motion.md`).
- **FM 등장은 컴포넌트를 감싼 바깥 `MotionItem`에, 키트 모션은 안쪽 SVG 노드에** — 서로 다른 노드라 2번 규칙(같은 요소에 CSS+FM 동시 금지)과 충돌하지 않는다. (`<MotionItem enter><GalleryComponent n={27}/></MotionItem>`)
- Babel은 **classic JSX 런타임**으로 컴파일해야 한다(automatic 런타임은 `import`를 내보내 깨진다 — `component-motion.md` 주의 참고).
- `prefers-reduced-motion`이면 키트가 자동 정지. 컴포넌트 안 라벨 글씨는 등장 후 멈추므로 9번 규칙(읽는 글씨 지속 모션 금지)과도 맞는다.
- 갤러리(모양·모션)를 고치면 **반드시 `node references/build-kit.js`**로 키트를 재생성한다(키트는 파생물, 단일 진실원천은 갤러리).
- 전체 절차·React 글루·번호별 모션표·함정은 **`references/component-motion.md`를 반드시 읽는다.**

## 세부 규칙은 references/에서

- `references/component-registry.md` — **번호(1~81) ↔ 컴포넌트 기준표.** "n번으로 해줘"를 해석할 때 본다. 시각 카탈로그는 `component-gallery.html`(1~74), 75~81 코드는 `added-templates.md`.
- `references/component-motion.md` — **번호 컴포넌트를 갤러리처럼 '움직이게' 만드는 모션 키트(`qqq-component-kit.js`) 사용법.** `QQQ.mount(n, el)` · React 글루(`GalleryComponent`) · Framer Motion 공존 · reduced-motion · 번호별 시그니처 모션표 · `build-kit.js` 재생성. **시각 컴포넌트를 슬라이드에 넣을 때 반드시 본다.**
- `references/structure-catalog.md` — **내용 모양 → 실제 구현된 구조 14개 매핑(STEP 0).** 카드로 뭉개지 않도록 구조를 끄집어낼 때 먼저 본다.
- `references/trinity-template.md` — **`trinity`(삼위일체 삼각형) 전용 스펙.** 데이터 스키마 + 좌표 + 전체 컴포넌트 코드(복붙용) + 등장 순서.
- `references/added-templates.md` — **검증된 추가 템플릿 7종**(`reproduce`·`platforms`·`reasons`·`keymsg`·`versus`·`bridge`·`tradeoff`) 데이터 스키마 + 컴포넌트 코드(복붙용) + 빌드 인덱스.
- `references/component-selection-rules.md` — **가장 먼저 읽는다.** 3-layer 모델, intent 선택표, 단조로움 방지
- `references/visual-component-library.md` — 시각 컴포넌트 전체 목록
- `references/chart-components.md` — SVG/CSS 차트 가이드
- `references/design-and-readability.md` — **Modern Glassy Light 테마 색상, glass-card CSS, spring-pop CSS, 폰트, 가독성 규칙**
- `references/motion-theme-upgrades.md` — **동적 모션·테마 업그레이드(우선 적용).** 요소별 모션 다양화 / Magic-Move 모핑(layoutId) / 연결선 draw-on / **테마별 강조색(다크 색글씨 가독성)** / 밑줄형 Eyebrow / **다크=검정+밤하늘(은하수·별·별똥별)** / 투명 글래스. 충돌 시 이 문서가 우선.
- `references/architecture.md` — 레이아웃, 기술 스택, React 구조, slides 스키마
- `references/slide-patterns.md` — 분할 규칙, 애니메이션 규칙 (spring-pop), build 규칙
- `references/runtime-and-output.md` — 네비게이션 훅, hash 동기화, 출력 요구사항

## 마지막 점검

1. **글자 크기**: 메인 화면에 24px 미만 글자가 하나도 없는가?
2. **한 메시지**: 각 슬라이드가 한 메시지만 담고 있는가?
3. **테마**: 다크 배경·불투명 블랙 카드·강한 네온이 없는가? 라이트 배경을 유지하는가?
4. **스크롤**: 모든 슬라이드가 한 화면 안에 완결되는가? 긴 슬라이드(5단계 step-flow, 6행 이상 표)가 stage 위·아래로 잘리지 않는가?
5. **수직 정렬**: `.stage`가 `align-items:center` 통일 + `.box`가 다시 flex column 가운데 정렬인가? 타입별 분기(flex-start vs center)는 짧으면 비고 길면 잘리는 모순을 만든다.
6. **그라디언트 텍스트 fallback**: 그라디언트 + `WebkitTextFillColor:transparent` 쓸 때 항상 `color: var(--...)` fallback이 먼저 있는가? 없으면 webkit 미지원/렌더 타이밍에서 글자가 사라진다.
7. **PALETTE는 hex**: PALETTE의 `fg`가 `"var(--xxx)"` 같은 CSS 변수면 `${c.fg}dd` 알파 보간이 깨져서 그라디언트가 무효 → 흰 칩에 흰 글자로 사고난다. 반드시 hex.
8. **바 차트 작은 값**: `animated-bar-chart`에서 max 대비 1% 미만 값이 있을 때 라벨이 막대 안이 아니라 막대 위 chip으로 떠 있는가? 막대 안 흰 글자는 잘려서 안 보인다.
9. **등장이 끊기지 않는가(snap)**: `translateX` 큰 이동 금지(잘림). 그리고 **(a) render 함수 안에서 하위 컴포넌트 정의 금지**(remount→snap, 모듈 레벨로), **(b) spring-pop 요소에 인라인 `transition` 금지**(class transition 덮어써 snap). 의심되면 등장 중 `opacity/transform`을 시간순으로 재서 점진(부드러움)인지 한 프레임 점프(snap)인지 확인.
10. **편집기**: `E` 키와 `✏️` 플로팅 버튼으로 편집 패널이 열리는가? 텍스트 수정이 화면에 즉시 반영되고 localStorage에 자동저장되는가? **💾 저장(파일 덮어쓰기, File System Access)**·**⬇ 내보내기(다운로드)**가 동작하는가? **💾 저장은 파일 핸들을 IndexedDB에 기억**해, 재방문(새 세션) 첫 저장 때 폴더 탐색 없이 권한 허락 한 번으로 같은 파일을 덮어쓰는가? (핸들 무효 시 자동으로 다시 파일 선택 폴백, `📍 저장위치 잊기`로 초기화) 저장 HTML에서 **Babel 주입 컴파일 스크립트가 제거**돼 재오픈 시 중복 실행이 없는가? 슬라이드 목록에서 **드래그·▲▼ 순서 변경 · ⧉ 복제 · 🗑 삭제(↩ 되돌리기)**가 되는가? **📋 복사→📥 붙여넣기(보관함)로 파일 간 이동**도 되는가? (`references/runtime-and-output.md` 섹션 8 참고)
11. **보라 — 글씨/UI/카드 금지, 배경 장식만 예외**: indigo/violet/plum은 글씨·UI·카드·강조색 어디서도 쓰지 않는다. 메인은 블루(#3B82F6), 보조는 sky/teal/emerald/amber/rose. 다크 테마는 순수 블랙. **단 움직이는 배경 장식(회전 오로라·드리프트 블롭 `b4`)에만 violet 한 점 허용**(8번 스택). 텍스트로 새지 않았는지 확인.
12. **notes**: 모든 슬라이드에 speaker notes가 있는가? console에 출력되는가?
13. **다양성**: title + text 카드만 반복되지 않는가? glass-card, bar-chart, step-flow 등 Layer 2 시각 요소가 섞였는가? 같은 type(icon-versus·step-flow 등)을 5장 넘게 반복하지 않는가?
14. **전체화면 배경 — 화려한 스택 + 경계선/빈 공간 없는가**: 4:3 캔버스 바깥(좌우)이 흰색·검정·다른 색으로 비지 않는가? **회전 오로라 2겹 + 드리프트 블롭 5~6개 + 빛 입자**가 모두 들어가 모니터 끝까지 이음매 없이 이어지는가? **라이트 색 구름이 정지처럼 안 보이고 또렷이 움직이는가?** (배경은 viewport 레벨, 캔버스는 투명. 8번 스택.)
15. **사이즈 단위**: 내용이 전부 고정 px(캔버스 좌표)인가? `vh`가 캔버스 안에 남아 스케일 이중 적용되지 않는가? (`vh/vw`는 배경·`#root`·번호 같은 viewport 요소에만.)
16. **세로 채움**: 짧은 슬라이드도 캔버스 세로(900px)를 적절히 채우는가, 위아래가 휑하지 않은가? 빽빽한 슬라이드는 900px 넘겨 잘리지 않는가? (내용 높이 ≤ ~820px 확인.)
17. **자동 순차 + 클릭=다음**: 항목이 클릭 없이 0.6초 간격으로 자동 등장하는가? 클릭/→ 한 번에 다음 슬라이드로 넘어가는가(스텝 클릭 폐지)?
18. **라벨 pill 금지**: 제목 위 라벨이 길쭉한 pill 칩이 아니라 Eyebrow(페이드 선+자간)인가?
19. **마커 전 필드 적용**: 모든 템플릿의 모든 텍스트 렌더(제목·부제·라벨·항목·표 칸·칩·캡션·목차·차트 라벨·Eyebrow)가 `hl()`을 통과해, 어느 페이지 어느 칸에서도 `*파랑*`/`~로즈~`가 작동하는가? 로즈 span에 `WebkitTextFillColor`가 있는가? **또 `hl`이 `\n`→`<br/>`로 줄바꿈을 처리해, 편집기에서 Enter가 제목·카드·표 등 모든 칸에서 줄바꿈으로 보이는가?**(`pre-line`에 의존 금지) (`references/design-and-readability.md` 3-b 참고)
20. **FM 로딩 가드**: `window.Motion` 없을 때 흰 화면 없이 평범한 요소로 degrade하는가?
21. **캔버스 잘림 해제**: `.stage-box`가 `overflow:visible`이고, 가로 슬라이드 인이 안 잘리며, blob이 4:3 밖으로 새지 않는가?
22. **지속 모션 비텍스트 한정**: 읽는 글씨에 idle이 없고, 이모지·카드·기호에만 있는가?
23. **내보내기 보존**: 내장 편집기 내보내기/저장 HTML에서 FM CDN `<script src>`가 보존되어 재오픈 시 모션이 살아있는가?
24. **FM/CSS 중복 금지**: 같은 요소에 FM 등장과 옛 CSS 등장 애니메이션이 동시에 걸려 snap나지 않는가?
25. **모션 다양화**: 한 화면에서 요소들이 서로 다른 방향/유형으로 등장하는가(한 종류 띠용 반복 아님)? 카드 줄이 좌/플립/우로 갈라 들어오는가? (`motion-theme-upgrades.md` 1번)
26. **다크 색글씨 가독성**: 다크 슬라이드에서 흰 글씨뿐 아니라 `*파랑*`·`_초록_`·카드 라벨 같은 **색 강조 글씨도 또렷**한가? (강조색 CSS 변수를 `.theme-dark`에서 밝은 톤으로 override했는가? 텍스트 색이 hex가 아니라 변수인가?) (`motion-theme-upgrades.md` 4번)
27. **Eyebrow 밑줄형(6px) / 다크=밤하늘**: 제목 위 라벨이 양옆 줄·알약이 아니라 밑줄형(밑줄 6px)인가? 다크가 검정에 가깝고(가장자리) **은하수가 또렷**하고 별·별똥별(16~20개)이 자주 떨어지며 중앙 burst는 없는가? **다크 글래스 카드가 투명해 밤하늘이 카드 뒤로 비치는가?** (`motion-theme-upgrades.md` 5·6·7·8번)
28. **모핑 기본 ON**: Eyebrow가 슬라이드 넘김에 이어지며 변형되고, 전환이 변형 없는 크로스페이드(`STAGE_FADE`)인가? (`motion-theme-upgrades.md` 2번)

## 생성 후 — 강조·구조 점검을 권유한다

덱을 다 만들면, 사용자에게 **`qqq-slide-emphasis-audit`로 원본 대비 강조·구조 점검**을 돌리길 권한다. 이 생성 단계에서 글자 크기·잘림·등장 등 시각/동작은 챙기지만, "각 슬라이드가 원본의 **진짜 핵심 개념**을 제대로 강조했는지, 그 핵심에 **구조(템플릿)가 최적인지**"는 별도 점검 skill이 원본과 1:1로 따져 잡는다. (자주 나오는 강조 역전을 사후에 한 번 더 거른다.)

## 브랜드 로고

AI 툴·서비스나 개발 도구(Claude Code·Codex·Antigravity·ChatGPT·Gemini·GitHub·VS Code·Python·Node 등)를 언급할 때는 **임의 이모지(🤖·💻 등)를 쓰지 않고 공식 로고를 쓴다.** `component-gallery.html`의 `brandTile(key,label,size)` / `brandLogo(key,size)`를 사용한다 (키: claude/openai/antigravity/gemini/github/vscode/python/node — Claude Code는 claude, ChatGPT는 openai 마크 재사용). 로고는 브랜드 원색, 타일은 중립 라이트 광택. 카탈로그 82번(공식 로고)에서 확인.
