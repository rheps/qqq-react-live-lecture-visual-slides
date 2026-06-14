# Visual Component Library

이 문서는 슬라이드 안에서 쓸 수 있는 시각 컴포넌트 전체 목록이다.
슬라이드 유형(template)을 고른 뒤, 이 목록에서 실제로 화면에 그릴 컴포넌트를 고른다.
컴포넌트 선택 절차는 `component-selection-rules.md`를 먼저 읽는다.

---

## 범례

```
type        : slides 데이터에 들어가는 문자열 식별자
use-when    : 이 컴포넌트를 선택하는 조건
build       : 등장 순서 권장 (→ 는 이전 요소 후에 등장)
avoid-when  : 이 컴포넌트를 피해야 하는 상황
```

---

## 1. 텍스트 강조 컴포넌트

### HeroTitle
```
type        : hero-title
use-when    : 단원·파트 시작, 강한 첫 인상이 필요할 때
build       : 큰 제목 → 부제 or 키워드
avoid-when  : 이미 big-title을 앞 슬라이드에서 사용했을 때
structure   : 화면 중앙 or 좌측 정렬, 제목 72px+, 부제 32px+
```

### BigTitle
```
type        : big-title
use-when    : 섹션 구분, 새 주제 시작 알림
build       : 없음 (단번에 등장)
avoid-when  : 연속 2장 사용 금지
structure   : 제목만 화면 가득, 배경 accent-light 또는 이미지
```

### BigKeyword
```
type        : big-keyword
use-when    : 핵심 단어 하나를 강하게 각인시킬 때
build       : 단어 등장 → 간단한 한 줄 설명 fade-in
avoid-when  : 단어가 2개 이상일 때 (그 경우 three-keywords 사용)
structure   : 단어 80px+, 중앙 배치, 테라코타 밑줄 or 배경
```

### KeyMessage
```
type        : key-message
use-when    : 강한 주장 한 문장을 화면에 남길 때
build       : 문장 등장 → 핵심 단어 highlight
avoid-when  : 연속 3장 사용 금지, 문장이 2개 이상일 때
structure   : 문장 40px+, 핵심 단어 bold + 색상 강조
```

### QuoteFocus
```
type        : quote-focus
use-when    : 인용문, 명언, 역사적 선언, 강사의 핵심 멘트
build       : 인용문 등장 → 출처 fade-in
avoid-when  : 출처가 없는 문장 (출처 불명이면 key-message 사용)
structure   : 큰 따옴표 아이콘, 텍스트 36px+, 출처 24px 우측 하단
```

### SectionDivider
```
type        : section-divider
use-when    : 파트 전환 (1일차 → 2일차, 이론 → 실습)
build       : 없음
avoid-when  : 내용 슬라이드로 바로 넘어갈 수 있을 때
structure   : 파트 번호 + 파트 제목, 구분선, 이전/다음 파트 이름
```

---

## 2. 키워드 묶음 컴포넌트

### ThreeKeywords
```
type        : three-keywords
use-when    : 핵심 요소 3개, 특징 3개, 이유 3가지
build       : 왼쪽 → 가운데 → 오른쪽 순서로 등장
avoid-when  : 요소가 4개 이상일 때, 요소 사이에 순서·흐름이 있을 때
structure   : 3칸 카드 또는 원형 배치, 각 카드에 키워드 1개 + 짧은 설명
```

### FourCard
```
type        : four-card
use-when    : 4가지 요소, 4단계, 2×2 구조
build       : 왼쪽 위 → 오른쪽 위 → 왼쪽 아래 → 오른쪽 아래
avoid-when  : 요소 사이에 순서가 있을 때 (step-flow 사용)
structure   : 2×2 그리드, 각 카드에 아이콘 or 번호 + 키워드
```

### KeywordCluster
```
type        : keyword-cluster
use-when    : 관련 용어 묶음, 개념 그룹, 주제 지도
build       : 중심 개념 → 관련 키워드들 차례로 fade-in
avoid-when  : 키워드 수가 10개 이상일 때
structure   : 중심 원 + 주변 버블, SVG 연결선
```

### TermChipGroup
```
type        : term-chip-group
use-when    : 용어 목록, 핵심 어휘, 개념어 모음 (5~10개)
build       : 일괄 등장 또는 왼→오 물결
avoid-when  : 용어 사이에 관계나 위계가 있을 때
structure   : 태그 칩(pill) 형태, 배경색으로 카테고리 구분 가능
```

---

## 3. 비교 컴포넌트

### SplitCompare
```
type        : split-compare
use-when    : 두 가지 대립·비교, A vs B, 이전/이후, 소비자/생산자
build       : 왼쪽 패널 → 오른쪽 패널 → 핵심 차이 강조
avoid-when  : 비교 대상이 3개 이상일 때
structure   : 화면 반반 분할, 각 패널에 큰 키워드 + 서브 텍스트
```

### BeforeAfterPanel
```
type        : before-after-panel
use-when    : 변화 전·후, 개선 전·후, 상태 전환
build       : Before 패널 → After 패널 → 변화 화살표 or 강조
avoid-when  : 변화 원인이 중요할 때 (cause-effect-chain 사용)
structure   : 좌/우 or 상/하 분할, 화살표로 변화 방향 표시
```

### ProsConsBoard
```
type        : pros-cons-board
use-when    : 찬반, 장단점, 기회/위협
build       : 왼쪽(찬/장점) → 오른쪽(반/단점) → 결론 강조
avoid-when  : 한쪽이 명백히 우위일 때 (split-compare 사용)
structure   : 두 컬럼에 + / - 아이콘, 항목 3개 이내 권장
```

### ContrastKeyword
```
type        : contrast
use-when    : 두 개념의 핵심 차이를 키워드 수준으로 대비
build       : 왼 키워드 → 오른 키워드 → 가운데 vs 레이블
avoid-when  : 설명이 필요한 복잡한 비교 (split-compare 사용)
structure   : 화면 중앙에 "VS" 또는 구분선, 양쪽에 큰 키워드
```

### TwoByTwoMatrix
```
type        : two-by-two-matrix
use-when    : 2축 분류, 중요도×긴급도, 우선순위 매핑
build       : 축 등장 → 사분면 레이블 → 항목 배치 순서
avoid-when  : 축 이름이 명확하지 않을 때
structure   : X축/Y축 이름, 4개 사분면 레이블, 항목 dot or chip
```

---

## 4. 흐름·과정 컴포넌트

### StepFlow
```
type        : step-flow
use-when    : 순서가 있는 과정, 방법론, 실습 절차
build       : 단계 1 → 단계 2 → 단계 3 (한 번에 하나씩)
avoid-when  : 단계가 6개 이상일 때 (두 슬라이드로 분할)
structure   : 가로 또는 세로 흐름, 번호 + 키워드 + 화살표
```

### HorizontalFlow
```
type        : horizontal-flow
use-when    : 3~5단계 선형 과정, 간단한 파이프라인
build       : 왼쪽부터 차례로 등장
avoid-when  : 단계 이름이 길어서 가로 공간이 부족할 때
structure   : 가로 배열, 화살표로 연결, 각 단계 박스 안에 키워드
```

### CauseEffectChain
```
type        : cause-effect-chain
use-when    : 원인 → 결과, 사건 연쇄, 역사적 흐름
build       : 원인 → 화살표 → 중간 결과 → 화살표 → 최종 결과
avoid-when  : 원인이 여러 개일 때 (keyword-cluster + 화살표 사용)
structure   : 가로 체인, 굵은 화살표, 각 노드에 핵심 키워드
```

### LoopDiagram
```
type        : loop-diagram
use-when    : 반복 개선 사이클, 피드백 루프, PDCA
build       : 원 등장 → 단계별 순서 강조 → 루프 완성 표시
avoid-when  : 단계가 6개 이상일 때
structure   : 원형 배치, 화살표로 순환 방향, 각 단계 키워드
```

### CycleDiagram
```
type        : cycle-diagram
use-when    : 반복 순환 구조 (계절, 학습 사이클, 업무 흐름)
build       : loop-diagram과 동일
avoid-when  : loop-diagram으로 충분할 때 (중복 사용 자제)
structure   : loop-diagram과 유사하나 더 원형 강조
```

### NumberedSteps
```
type        : numbered-steps
use-when    : 1~5단계 절차를 한 눈에 보여줄 때
build       : 전체 목록 등장 → 현재 단계 highlight
avoid-when  : 각 단계를 깊게 설명해야 할 때 (step-flow 사용)
structure   : 세로 목록, 번호 원형 배지, 각 항목 한 줄
```

---

## 5. 타임라인 컴포넌트

### TimelineDots
```
type        : timeline-dots
use-when    : 역사적 사건 3~5개, 시간 순서
build       : 선 등장 → 점 1 → 점 2 → 점 3 순서로
avoid-when  : 사건이 6개 이상일 때 (두 슬라이드 분할)
structure   : 가로 또는 세로 선, 원형 점, 연도 + 사건명
```

### ChronologyRibbon
```
type        : chronology-ribbon
use-when    : 긴 시간 범위의 흐름, 시대 구분
build       : 리본 전체 등장 → 시대 구분 → 핵심 사건 표시
avoid-when  : 정확한 사건 날짜보다 흐름이 중요할 때 사용 (적합)
structure   : 가로 리본, 시대 배경색 구분, 사건명 위/아래 표시
```

### TimelineMoment
```
type        : timeline-moment
use-when    : 하나의 역사적 순간을 깊게 다룰 때
build       : 날짜 등장 → 사건 → 의미 또는 결과
avoid-when  : 여러 사건을 나열할 때 (timeline-dots 사용)
structure   : 날짜/시기 크게, 사건명 중간, 의미 아래 작게 (단 24px 이상)
```

---

## 6. 관계·구조 컴포넌트

### ConceptMap
```
type        : concept-map
use-when    : 개념들의 연결 관계, 요인 망, 주제 지도
build       : 중심 개념 → 주요 연결 → 세부 연결 순서
avoid-when  : 노드가 7개 이상일 때 (keyword-cluster 사용)
structure   : 중심 노드 + 연결선 + 주변 노드, SVG로 구현
```

### ActorMap
```
type        : actor-map
use-when    : 역사 속 인물·집단의 관계, 협력/대립 구도
build       : 인물/집단 등장 → 관계선 순서
avoid-when  : 관계가 5개 이상으로 복잡할 때
structure   : 인물 원형 노드, 색상으로 진영 구분, 관계 레이블
```

### Pyramid
```
type        : pyramid
use-when    : 계층 구조, 중요도 순위, 매슬로우 식 위계
build       : 아래 → 위로 단계별 등장
avoid-when  : 위계가 명확하지 않을 때
structure   : 삼각형 분할, 각 층에 레이블, 색상 그라데이션
```

### Trinity
```
type        : trinity
use-when    : 동등한 세 요소가 모여 하나의 상위 개념이 될 때 (삼위일체/통합). 정확히 3개.
build       : 위 꼭짓점 → 왼아래(+둘레선) → 오른아래(+삼각형 완성) → 중앙 허브+스포크 모여듦
avoid-when  : 순서가 있을 때(step-flow), 그냥 병렬일 때(four-card), 4개 이상일 때(four-card)
structure   : 삼각형 꼭짓점 3개(glass 카드) + 중앙 허브(core 원) + 빛나는 연결선("삼위일체 방패")
schema      : items[3]{emoji,label,desc} + core/coreEmoji(옵션). 전체 코드는 trinity-template.md
```

### TreeDiagram
```
type        : tree-diagram
use-when    : 분류 체계, 개념 분지, 의사결정 트리
build       : 루트 → 1단계 → 2단계 순서
avoid-when  : 깊이가 3단계 이상일 때 (단순화 필요)
structure   : 루트 노드 → 자식 노드, 세로 또는 가로 트리
```

### Ladder
```
type        : ladder
use-when    : 발전 단계, 숙달 수준, 역량 단계
build       : 아래 계단 → 위 계단 순서
avoid-when  : 단계가 6개 이상일 때
structure   : 계단 모양, 각 단계에 레이블, 현재 위치 강조
```

### SpectrumLine
```
type        : spectrum-line
use-when    : 연속적인 스펙트럼, 입장 분포, 정도 표시
build       : 선 등장 → 양 끝 레이블 → 표시 위치
avoid-when  : 두 개의 명확한 대립일 때 (split-compare 사용)
structure   : 가로 선, 양 끝에 반대 개념, 중간 눈금 선택적
```

---

## 7. 수업·발문 컴포넌트

### BigQuestion
```
type        : big-question
use-when    : 수업 핵심 질문, 토론 발문, 탐구 문제
build       : 물음표 or 아이콘 → 질문 문장
avoid-when  : 질문이 2개 이상일 때 (한 슬라이드 한 질문)
structure   : 질문 문장 44px+, 중앙 배치, 강조 밑줄 or 색상
```

### DiscussionPrompt
```
type        : discussion-prompt
use-when    : 모둠 토론, 짝 활동, 생각 나눔 지시
build       : 활동 아이콘 → 지시 문장 → 시간 안내
avoid-when  : 단순 발문으로 충분할 때 (big-question 사용)
structure   : 그룹 아이콘, 활동 지시, 제한 시간 표시
```

### ThinkPause
```
type        : think-pause
use-when    : 잠깐 생각해보기, 혼자 정리 시간
build       : 없음 (전체 한 번에)
avoid-when  : 토론이 필요할 때 (discussion-prompt 사용)
structure   : "잠깐 생각해봅시다" + 생각 주제, 간단한 시각 요소
```

### MiniQuiz
```
type        : mini-quiz
use-when    : 간단 확인 문제, OX 퀴즈, 선택지 문제
build       : 질문 → 선택지 순서
avoid-when  : 정답을 즉시 보여주지 않아도 될 때
structure   : 문제 + 2~4개 선택지, 정답 build로 reveal
```

### CheckForUnderstanding
```
type        : check-for-understanding
use-when    : 핵심 내용 확인, 형성평가 질문
build       : 질문 → 정답 reveal
avoid-when  : mini-quiz와 구분이 불필요할 때
structure   : mini-quiz와 유사, 더 간결한 형태
```

---

## 8. 정리·마무리 컴포넌트

### RecapThree
```
type        : recap-three
use-when    : 3개 핵심 요점 정리
build       : 포인트 1 → 2 → 3 순서
avoid-when  : 요점이 3개가 아닐 때
structure   : 번호 + 핵심 문장 3개, 색상 포인트 강조
```

### SummaryMap
```
type        : summary-map
use-when    : 전체 구조 한 눈에 보기, 마인드맵식 정리
build       : 중심 → 주요 항목 순서
avoid-when  : 내용이 선형 흐름일 때 (recap-three 사용)
structure   : concept-map 형태에 정리 내용 배치
```

### Checklist
```
type        : checklist
use-when    : 할 일 목록, 완료 체크, 기준 점검
build       : 항목 1 → 2 → 3 순서 (체크 표시와 함께)
avoid-when  : 순서보다 내용이 중요할 때
structure   : 체크박스 아이콘 + 텍스트, 완료 항목 다른 색
```

### ClosingPrompt
```
type        : closing-prompt
use-when    : 강의 마무리, 행동 촉구, 다음 단계 안내
build       : 핵심 메시지 → 행동 지시 또는 다음 단계
avoid-when  : 단순 감사 인사만 있을 때
structure   : 큰 마무리 문장 + 행동 지시 or 다음 단계 한 줄
```

### ExitTicket
```
type        : exit-ticket
use-when    : 수업 끝 소감, 과제, 되돌아보기
build       : 없음
avoid-when  : 슬라이드가 아닌 실물 활동지가 있을 때
structure   : 2~3개 빈칸 질문, 작성 시간 표시
```

---

## 9. 데이터·수치 컴포넌트

차트 계열은 `chart-components.md`에 상세 규칙이 있다.
아래는 간략 목록이다.

| 컴포넌트 | type | 사용 시점 |
|---|---|---|
| BigNumber | `big-number` | 강한 수치 하나 강조 |
| BarChart | `bar-chart` | 항목별 수치 비교 (3~5개) |
| LollipopChart | `lollipop-chart` | 막대 차트 대안, 시각적 강조 |
| LineChart | `line-chart` | 시간에 따른 추세 |
| SlopeChart | `slope-chart` | 두 시점 변화 비교 |
| HorizontalBar | `horizontal-bar` | 긴 항목 이름의 비교 |
| Stacked100Bar | `stacked-bar-100` | 비율·구성 비교 |

---

## 10. 사료·출처 컴포넌트

### QuoteAnnotation
```
type        : quote-annotation
use-when    : 1차 사료 인용, 문헌 분석, 텍스트 해석
build       : 원문 등장 → 주석 순서
avoid-when  : 인용문이 짧고 출처만 있을 때 (quote-focus 사용)
structure   : 인용문 박스 + 측면 주석, 핵심 어구 highlight
```

### PrimarySourceLens
```
type        : primary-source-lens
use-when    : 역사 사료를 분석 렌즈로 읽을 때
build       : 사료 텍스트 → 분석 질문 → 핵심 어구 highlight
avoid-when  : 역사 과목이 아닐 때
structure   : 원문 + 분석 도구(누가 썼나? 무엇을? 왜?)
```

### HistoricalFigureCard
```
type        : historical-figure-card
use-when    : 인물 소개, 인물 중심 수업
build       : 이름 → 시기 → 핵심 업적 순서
avoid-when  : 인물이 3명 이상일 때 (카드 그리드 사용)
structure   : 이름 크게, 시기·배경, 핵심 키워드 3개 이내
```

---

## 11. 컴포넌트 조합 패턴

하나의 슬라이드에 2개 이상의 컴포넌트를 조합할 수 있다.

### 권장 조합
```
SplitCompare (왼쪽) + ContrastKeyword (가운데 강조)
CauseEffectChain + BigNumber (결과 수치)
TimelineDots + QuoteAnnotation (특정 시점 사료)
ThreeKeywords + LoopDiagram (개념 소개 → 구조 설명)
```

### 금지 조합
```
같은 레이아웃 컴포넌트 2개 (SplitCompare + BeforeAfterPanel)
비교 + 비교 (두 비교가 경쟁함)
흐름도 + 타임라인 (방향이 달라 혼란)
```

---

## 12. 발표형 밀도 기준

컴포넌트를 고른 뒤, 콘텐츠 밀도를 이 기준에 맞춰 조정한다.

| 컴포넌트 요소 | 발표형 (기본) | 콘텐츠형 |
|---|---|---|
| 카드 안 텍스트 | 키워드 1~2개 | 설명 1문장 가능 |
| 타임라인 사건 수 | 3~5개 | 5~8개 |
| 비교 패널 내용 | 큰 키워드 중심 | 설명 문장 포함 |
| 흐름도 단계 수 | 3~5단계 | 6단계까지 |
| 관계도 노드 수 | 4~6개 | 7~9개 |
| 차트 데이터 수 | 3~5개 | 6~8개 |

발표형이 이 Skill의 기본이다. 화면이 복잡해지면 강사의 설명이 화면에 묻힌다.

---

## 13. PowerPoint SmartArt 추가분 (번호 기준표 연동)

PowerPoint 기본 SmartArt를 이 시스템으로 옮긴 것. 번호 ↔ 전체 목록은 `component-registry.md`,
**완성된 SVG/HTML 예시는 `component-gallery.html`의 각 번호 카드**에 들어 있다.
모두 Modern Glassy Light 토큰 + spring-pop + 24px+ 글자 규칙을 따른다.

### ChevronProcess (갈매기 단계)
```
type        : chevron-process   (# 24)
use-when    : 순서 있는 단계를 화살표 리본으로 강하게 "진행" 느낌 줄 때
build       : 왼쪽 갈매기부터 차례로 등장
avoid-when  : 단계가 6개 이상, 또는 각 단계 설명이 길 때 (step-flow/vertical-step-flow)
structure   : SVG path로 갈매기(>) 모양 박스 연속, 색은 PALETTE 순환, 흰 글자
```

### FunnelList (깔때기 목록)
```
type        : funnel-list       (# 25)
use-when    : 단계마다 대상이 걸러져 좁아지는 과정 (지원자→합격자)
build       : 위(넓음) → 아래(좁음) 순서
avoid-when  : 수치 자체가 핵심일 때 (funnel-chart 66번)
structure   : 위에서 아래로 너비가 줄어드는 막대 스택
```

### GearCycle (톱니바퀴)
```
type        : gear-cycle        (# 27)
use-when    : 여러 요소가 맞물려 함께 돌아가는 구조 (협업·시스템 작동)
build       : 큰 기어 → 맞물리는 작은 기어들
avoid-when  : 단순 순서 반복일 때 (loop-diagram 26번)
structure   : SVG로 기어(원 + 방사 톱니) 2~3개를 겹쳐 배치, 각 기어에 라벨
```

### SegmentedCycle (블록 순환)
```
type        : segmented-cycle   (# 28)
use-when    : 4단계 안팎의 순환을 호(arc) 블록으로 또렷이 (계절·분기 사이클)
build       : 12시 방향부터 시계방향 순서
avoid-when  : 중심 개념을 강조해야 할 때 (loop-diagram 26번)
structure   : SVG path arc로 도넛을 4조각, 각 조각에 라벨
```

### InvertedPyramid (역피라미드)
```
type        : inverted-pyramid  (# 32)
use-when    : 넓은 데서 좁혀 핵심을 뽑는 흐름 (전체 정보→선별→핵심), 기사 두괄식
build       : 위(넓음) → 아래(좁음)
avoid-when  : 위계가 "아래가 기반"인 구조일 때 (pyramid 31번)
structure   : 위가 가장 넓고 아래로 갈수록 좁아지는 층
```

### HubSpoke / Mindmap (방사형)
```
type        : hub-spoke         (# 35)
use-when    : 한 중심 개념에서 여러 갈래로 퍼질 때 (마인드맵, 영역 분류)
build       : 중심 → 가지들 차례로
avoid-when  : 노드가 7개 이상(keyword-cluster), 정확히 3개면 trinity가 더 강함
structure   : 중심 원 + 방사 연결선 + 주변 원 노드, 각 노드 라벨
```

### VennDiagram (벤다이어그램)
```
type        : venn              (# 38)
use-when    : 둘(셋)의 공통점/차이점, 교집합
build       : 왼 원 → 오른 원 → 겹침 라벨
avoid-when  : 포함 관계일 때 (nested-target 40번)
structure   : 반투명 원 2~3개 겹침, 교집합 영역에 라벨
```

### BalanceScale (양팔 저울)
```
type        : balance-scale     (# 39)
use-when    : 두 가치의 균형·trade-off (자유 vs 평등, 비용 vs 효과)
build       : 받침/기둥 → 양팔 → 양쪽 접시 라벨
avoid-when  : 단순 대비일 때 (contrast 17번)
structure   : SVG로 기둥 + 기울어진 가로대 + 양쪽 접시 박스
```

### NestedTarget (동심원·과녁)
```
type        : nested-target     (# 40)
use-when    : 포함·범위 관계 (개인⊂사회⊂국가, 핵심⊂확장)
build       : 바깥(큰 원) → 안(작은 원)
avoid-when  : 교집합이 핵심일 때 (venn 38번)
structure   : 반투명 동심원 3겹, 각 고리에 라벨
```

> 차트 계열(파이·도넛·레이더·산점도·버블·폭포·깔때기·트리맵·히스토그램·복합·게이지, 번호 59~70)은
> `chart-components.md` 섹션 12를 본다.
