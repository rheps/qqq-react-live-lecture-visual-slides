# Component Selection Rules

이 문서는 슬라이드를 만들기 전에 **반드시** 읽는다.
테마 규칙(design-and-readability.md)보다 이 파일을 먼저 적용한다.

> **먼저 `structure-catalog.md`를 본다.** 거기엔 "내용 모양 → 실제 구현된 구조 13개"가 1:1로 정리돼 있다(STEP 0 표).
> 아래 4번 intent 표는 **이상적 목표**라 아직 안 만든 컴포넌트도 섞여 있다 — 실제로 끄집어 쓸 수 있는 것은 카탈로그의 ✅ 표시뿐이다.
> 내용이 흐름·위계·대비인데 **카드로 뭉개는 것**이 가장 흔한 실수다. 모양을 먼저 말로 그리고, 그 모양의 구조를 고른다.

---

## 1. 슬라이드의 세 층 구조

슬라이드 하나는 세 층으로 생각한다.

```
Layer 1 — Slide Template     한 장 전체의 큰 구조
Layer 2 — Visual Component   내용 하나를 표현하는 시각 요소
Layer 3 — Micro Animation    요소가 나타나고 강조되는 방식
```

예:

```
Template  : SplitCompare
Component : BeforeAfterPanel (left) + ContrastKeyword (right)
Animation : left fade-in → right fade-in → 핵심 차이 highlight-sweep
```

현재 Skill이 약한 부분은 **Layer 2**다. Layer 1만 있고 Layer 2가 없으면 결과물이 "제목 + 카드 + 문장" 패턴만 반복된다.

---

## 2. 절대 규칙 세 가지

```
1. 텍스트를 그냥 보여주지 말고, 내용의 관계를 시각 구조로 바꾼다.
2. title + paragraph 레이아웃은 절대 기본값으로 선택하지 않는다.
3. 같은 시각 컴포넌트를 2장 연속으로 사용하지 않는다.
```

모든 슬라이드는 다음 중 하나 이상을 반드시 포함한다:
카드 / 다이어그램 / 차트 / 타임라인 / 비교 패널 / 키워드 클러스터 / SVG 시각 요소 / 인용 블록

---

## 3. 슬라이드 생성 절차 (10단계)

1. 원문 내용 전체를 읽는다
2. 내용 덩어리를 슬라이드 단위로 쪼갠다 (한 슬라이드 = 하나의 의도)
3. **각 덩어리의 content intent를 분류한다** (아래 선택표 참고)
4. 분류된 intent에 맞는 컴포넌트를 고른다 (visual-component-library.md 참고)
5. 텍스트를 핵심만 남기고 나머지는 speaker notes로 이동한다
6. slides 배열 데이터를 작성한다 (id, type, title, builds, notes)
7. build animation 순서를 정한다
8. 같은 컴포넌트가 연속으로 나오지 않는지 점검한다
9. React 구현 및 SVG 시각화를 추가한다
10. 최종 점검 (글자 크기 / 스크롤 / 테마 / notes 유무)

---

## 4. Content Intent 선택표

슬라이드를 만들기 전에 이 표에서 intent를 찾고, 해당 컴포넌트를 선택한다.

| 내용 유형 | Intent 코드 | 1순위 컴포넌트 | 대안 컴포넌트 |
|---|---|---|---|
| 단원·파트 시작 | `opening` | `section-divider`, `hero-title` | `big-title` |
| 핵심 질문 하나 | `question` | `big-question` | `question` |
| 강한 주장 하나 | `key-message` | `key-message` | `quote-focus` |
| 핵심 단어 하나 강조 | `keyword` | `keyword-spotlight`, `big-keyword` | `key-message` |
| 세 가지 핵심 요소 | `triad` | `three-keywords`, `icon-triptych` | `card-grid-3` |
| 네 가지 프레임워크 | `framework` | `four-card`, `two-by-two-matrix` | `card-grid-4` |
| 개념 정의 | `definition` | `definition-card` | `key-message` |
| 용어 묶음 | `term-group` | `term-chip-group`, `keyword-cluster` | `three-keywords` |
| 시간 순서·역사 흐름 | `timeline` | `timeline-dots`, `chronology-ribbon` | `vertical-step-flow` ✅ |
| 단계별 과정·방법론 | `process` | `vertical-step-flow` ✅ | `flow` ✅ |
| A→장치→C 메커니즘 | `mechanism` | `flow` ✅ (가운데 노드 박스 강조) | `vertical-step-flow` ✅ |
| 반복 개선 루프 | `cycle` | `loop-diagram`, `cycle-diagram` | `vertical-step-flow` ✅ |
| 원인 → 결과 | `cause-effect` | `cause-effect-chain` | `flow` ✅ |
| 두 가지 비교 | `contrast` | `split-compare`, `contrast` | `before-after-panel` |
| 변화 전·후 | `before-after` | `before-after-panel` | `slope-chart` |
| 찬반·장단점 | `pros-cons` | `pros-cons-board`, `debate-board` | `split-compare` |
| 관점 여러 개 | `perspective` | `perspective-cards` | `card-grid` |
| 수치 비교 | `data-compare` | `bar-chart`, `lollipop-chart` | `big-number` |
| 시간에 따른 추세 | `trend` | `line-chart`, `slope-chart` | `bar-chart` |
| 비율·구성 | `ratio` | `stacked-bar-100` | (pie 사용 자제) |
| 개념 관계망 | `relationship` | `concept-map`, `keyword-cluster` | `actor-map` |
| 계층·분류 구조 | `hierarchy` | `pyramid`, `tree-diagram`, `ladder` | `card-grid` |
| 2축 분류·우선순위 | `matrix` | `two-by-two-matrix`, `spectrum-line` | `split-compare` |
| 사료·인용문 분석 | `source` | `quote-annotation`, `primary-source-lens` | `quote-focus` |
| 인물 소개 | `person` | `historical-figure-card` | `concept-card` |
| 수업 발문·토론 | `activity` | `big-question`, `discussion-prompt` | `think-pause` |
| 간단 퀴즈·확인 | `quiz` | `mini-quiz`, `check-for-understanding` | `question` |
| 핵심 3개로 정리 | `recap` | `recap-three`, `summary-map` | `checklist` |
| 마무리·행동 촉구 | `closing` | `closing-prompt`, `exit-ticket` | `key-message` |
| 큰 수치 하나 강조 | `big-number` | `big-number` | `key-message` |
| 재사용·재생산 루프(지속·일관성) | `reproduce` | `reproduce` ✅ | `cycle` |
| 분야별 항목 묶음(예: 모델 카테고리) | `term-group` | `platforms` ✅ | `three-keywords` |
| 한 주장 + 이유·장점 나열 | `recap`/`reasons` | `reasons` ✅ | `recap-three` |
| 핵심 문장 + 증거 칩 | `key-message` | `keymsg` ✅ | `key-message` |
| 두 방식 핵심 대조 한 방 | `contrast` | `versus` ✅, `icon-versus` | `split-compare` |
| A→B 전환의 원동력 + 용어 설명 | `mechanism` | `bridge` ✅ | `flow` ✅ |
| 단점 + 그래도 쓰는 큰 장점 | `pros-cons` | `tradeoff` ✅ | `pros-cons-board` |

> 75~81 (`reproduce`·`platforms`·`reasons`·`keymsg`·`versus`·`bridge`·`tradeoff`)는 ✅ 실제 구현·검증됨. 코드는 `added-templates.md`.

---

## 5. 내용 변환 예시

원문:
> 조선 후기에는 상품 화폐 경제가 발달하면서 도시가 성장하고, 농민층이 분화되었으며, 일부 농민은 부농으로 성장했지만 다수는 몰락하였다.

**나쁜 방식** (title + bullet):
```
제목: 조선 후기 사회 변화
- 상품 화폐 경제 발달
- 도시 성장
- 농민층 분화
- 부농과 몰락 농민 등장
```

**좋은 방식** — intent 분류 후 변환:

```
Intent: cause-effect → cause-effect-chain
  상품 화폐 경제 → 도시 성장 → 농민층 분화

Intent: contrast → split-compare
  부농 / 몰락 농민

Intent: perspective → perspective-cards
  상인 / 농민 / 양반의 입장

Intent: question → big-question
  경제가 성장하면 모두가 잘살게 될까?
```

같은 원문에서 4가지 다른 슬라이드가 나온다. 어떤 각도에서 보여줄지 강사가 결정하면 된다.

---

## 6. 단조로움 방지 규칙

```
- 같은 slide type을 2장 연속 사용하지 않는다
- 텍스트 중심 슬라이드(key-message, big-title)는 3장 이상 연속 금지
- 비교 내용은 반드시 비교 컴포넌트로 만든다 (bullet list 변환 금지)
- 순서·과정은 반드시 흐름도 컴포넌트로 만든다
- 원인-결과는 반드시 화살표·체인으로 표현한다
- 수치가 있으면 그래프 또는 big-number로 변환한다
- 사료·인용문은 quote/source 컴포넌트로 만든다
- 수업 발문은 big-question 컴포넌트로 만든다
```

---

## 7. 발표형 vs. 콘텐츠형 밀도 차이

이 Skill의 기본 모드는 **발표형** (강사가 말로 설명, 화면은 보조).

| 컴포넌트 | 발표형 (이 Skill 기본) | 콘텐츠형 (밀도 높음) |
|---|---|---|
| 카드 안 텍스트 | 키워드 1~2개만 | 짧은 설명 포함 가능 |
| 타임라인 사건 수 | 3~5개 | 5~8개 가능 |
| 비교 패널 내용 | 큰 키워드 중심 | 설명 문장 포함 가능 |
| 차트 데이터 수 | 3~5개 | 6~8개 가능 |
| 흐름도 단계 수 | 3~5단계 | 6단계까지 가능 |

발표형에서 화면이 복잡해지면 강사의 설명이 화면에 묻힌다. 단순하게 유지한다.
