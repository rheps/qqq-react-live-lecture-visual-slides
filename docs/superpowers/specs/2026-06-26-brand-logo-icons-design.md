# 공식 브랜드 로고 아이콘 — 설계 문서

- 날짜: 2026-06-26
- 대상 스킬: `qqq-react-live-lecture-visual-slides`

## 1. 배경과 문제

슬라이드에서 Claude Code·Codex·Antigravity 같은 AI 코딩 툴이나 GitHub·Python 같은
개발 도구를 언급할 때, 지금은 임의 이모지(🤖, 💻 등)를 쓴다. 이러면 어떤 툴인지
즉시 식별되지 않고 인상이 약하다. **해당 툴을 언급할 때는 그 툴의 공식 로고를 쓴다.**
(교육용 재현이며 사용자가 사용을 승인함.)

## 2. 목표

- 자주 쓰는 AI 툴·개발 도구의 **공식 로고를 재사용 가능한 SVG 세트**로 제공한다.
- 어느 슬라이드에서든 임의 이모지 대신 공식 로고를 쓰도록 스킬에 명시한다.
- 카탈로그에서 눈으로 보고 고를 수 있게 **쇼케이스 카드 1개**를 추가한다.
- 로고는 **라이트 광택 타일 안에**(사용자 선택) 브랜드 원색으로 표시한다.

### 비목표
- 모든 브랜드 망라(YAGNI). 합의된 8종 마크만.
- 다크 테마·로고 애니메이션.
- Cursor/Copilot/Windsurf 등 미선택 툴(추후 필요 시 키만 추가).

## 3. 접근법

로고는 **인라인 SVG로 간결 재현(접근법 A)**. 외부 의존성·네트워크 없이 오프라인
슬라이드에서 동작하고 파일이 완결적이다. CDN/아이콘폰트(B)는 렌더 시 네트워크가
필요해 부적합, 풀 SVG 통째 임베드(C)는 과하다.

## 4. 아키텍처

기존 광택 키트와 같은 위치(`component-gallery.html` 공용 빌더 구역)에 추가한다.

- `BRAND` — key→{logo, color, label} 데이터 객체. `logo`는 viewBox 0 0 24 24 기준 inner SVG 문자열.
- `brandLogo(key, size=40)` → `<svg>` 로 감싼 브랜드 원색 마크 반환 (raw, 타일 없음, 내부용).
- `brandTile(key, label?)` → **중립 라이트 글래스 광택 타일** 안에 `brandLogo` + (옵션)라벨.
  타일은 흰빛 반투명 + 옅은 중립 글로우 + 상단 하이라이트(브랜드 원색이 또렷이 뜨도록).
- 카탈로그에 **로고 모음 쇼케이스 컴포넌트** 1개 추가(다음 빈 번호, cat L 또는 신규 표시).
  `brandTile` 그리드로 8종 전부 표시.

### 단일 출처·문서
- `SKILL.md`에 한 줄: **"AI 툴·서비스(Claude Code/Codex/Antigravity/GitHub 등)를 언급할 때
  임의 이모지 금지 — `brandTile`/`brandLogo`의 공식 로고를 쓴다."**
- `references/component-registry.md`에 쇼케이스 컴포넌트 행 추가.

## 5. 로고 키 세트 (마크 8종, 라벨 10개)

| key | 마크 | 색 | 라벨 |
| --- | --- | --- | --- |
| `claude` | Anthropic 별빛(starburst) | clay `#D97757` | Claude / Claude Code |
| `openai` | OpenAI 매듭 | `#0F0F0F` | Codex / ChatGPT |
| `antigravity` | Google 4색 마크(근사) | Google 4색 | Antigravity |
| `gemini` | 4각 스파크 | blue→purple 그라데 | Gemini |
| `github` | 옥토캣 실루엣 | `#181717` | GitHub |
| `vscode` | 리본 마크 | `#0A84C9` | VS Code |
| `python` | 두 뱀 | `#3776AB`/`#FFD43B` | Python |
| `node` | 육각형 | `#5FA04E` | Node.js |

- Claude Code는 `claude` 마크 재사용, ChatGPT는 `openai` 마크 재사용.
- Antigravity는 신생 제품이라 정확 마크가 불확실 → Google 4색 근사. `BRAND` 주석에 명시.
- 모든 마크는 멀리서도 식별되는 단순 재현(교육용).

## 6. 광택 타일 처리

타일은 도형용 컬러 광택과 달리 **중립(흰빛) 글래스**다. 브랜드 원색이 타일 색에
묻히지 않게 하기 위함.
- 배경: `rgba(255,255,255,.6)` + `backdrop-filter: blur` (기존 카드 톤)
- 테두리/하이라이트: `1px rgba(255,255,255,.75)` + inset 상단 흰 하이라이트
- 그림자: 옅은 중립 그림자 + 아주 옅은 그레이 글로우(브랜드색 글로우 아님 — 색 충돌 방지)
- 검정 계열 마크(OpenAI·GitHub)도 밝은 타일 위에서 또렷.

## 7. 검증

1. **정적 가드(`tests/gloss-guard.mjs` 확장)**: `BRAND`/`brandLogo`/`brandTile` 정의,
   8개 key(claude·openai·antigravity·gemini·github·vscode·python·node) 존재,
   쇼케이스 컴포넌트가 `brandTile(` 사용, `SKILL.md`에 "공식 로고" 지침 문구 존재.
2. **실행 검증(`render-check`)**: 쇼케이스 컴포넌트 render 무오류, 비어있지 않음.
3. **시각(Playwright 캡처)**: 8개 타일이 식별 가능한 공식 로고로 또렷이 뜨고,
   밝은 배경에서 안 깨지는가.

## 8. 동기화

작업 위치 `C:\AI\qqq-react-live-lecture-visual-slides`(GitHub 풀 클론). 완료 후
글로벌(`~/.claude/skills/...`) 동기화. push는 사용자 요청 시.
