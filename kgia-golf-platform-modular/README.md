# KGIA Golf Platform Modular

골프 라운딩 파트너 매칭 v7을 **실서비스 앱 + 재사용 가능한 기능 패키지** 구조로 재정리한 모노레포입니다.

기존 v7 앱은 `apps/golf-partner-web`에 보존하고, 테스트/매칭/GCI/프로암/결제/CRM/성장분석/동의/서버 유틸은 `packages/` 아래 기능별 패키지로 분리했습니다. 다음에 골프가 아닌 다른 매칭 서비스, 이벤트 서비스, 광고 리드 서비스, 테스트형 바이럴 서비스를 만들 때도 필요한 패키지만 가져다 쓸 수 있습니다.

## 구조

```text
.
├── apps/
│   └── golf-partner-web/          # v7 실서비스 앱. 정적 페이지 + Node API 서버
├── packages/
│   ├── partner-test/              # 문항/결과/점수 산출 엔진
│   ├── matching-engine/           # 후보 추천/궁합 점수 엔진
│   ├── gci-engine/                # GCI 점수/랭크/광고 세그먼트
│   ├── proam-engine/              # 2~4인 조 자동 편성
│   ├── commerce-engine/           # 상품/주문/결제 intent/mock webhook
│   ├── crm-engine/                # 운영 CRM 파이프라인/후속 액션
│   ├── growth-engine/             # 퍼널/A-B 테스트/코호트 분석
│   ├── privacy-consent/           # 동의 원장/익명화/데이터 export helper
│   ├── server-kit/                # JSON 저장소/HTTP/Auth/OTP/알림 유틸
│   └── golf-platform/             # 위 패키지를 한 번에 export하는 집합 패키지
├── templates/
│   └── new-service/               # 새 서비스 만들 때 복사해서 시작하는 예시
├── docs/
│   ├── MODULE_MAP.md
│   ├── EXTENSION_PLAYBOOK.md
│   └── GITHUB_UPLOAD.md
└── test/
    └── modules.smoke.js
```

## 실행

```bash
npm run start
```

브라우저:

```text
http://localhost:8787
```

운영 실행:

```bash
ADMIN_PASSWORD='원하는관리자비밀번호' APP_SECRET='랜덤긴문자열' npm run start
```

## 검증

```bash
npm run modules:check
npm run modules:smoke
npm run app:check
npm run app:smoke
```

## 다른 서비스에서 재사용하는 예시

```js
const { partnerTest, matching, gci, commerce } = require('./packages/golf-platform');

const scores = partnerTest.scoreAnswers(['B','C','D'], partnerTest.defaultQuestions);
const result = partnerTest.pickResultType(scores);
const rank = gci.calculateGci({ scores, result });
const candidates = matching.recommendCandidates(myProfile, profiles, { limit: 5 });
const order = commerce.createOrder({ offerId: 'offer_match_vip', profileId: myProfile.id });
```

## 업로드 상태

이 폴더는 `joon8129-debug/joon-lab` 안에 업로드된 모듈형 scaffold입니다. 전용 레포를 만들 수 있으면 `joon8129-debug/kgia-golf-partner-matching`로 이동하는 것을 권장합니다.
