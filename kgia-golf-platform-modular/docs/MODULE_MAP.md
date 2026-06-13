# Module Map

## `@kgia/partner-test`

심리테스트/밈테스트 계열 서비스의 핵심 모듈입니다.

책임:

- 문항 정의
- 선택지별 축 점수 산출
- 결과 유형 선택
- 결과 카드용 카피 데이터 제공
- 공유 문구 생성

다른 서비스 재사용 예:

- 골프 MBTI
- 직장인 성향 테스트
- 여행 파트너 테스트
- 팬클럽 성향 테스트
- 브랜드 체험단 타깃 테스트

## `@kgia/matching-engine`

프로필 간 궁합 점수를 계산하고 후보를 추천합니다.

책임:

- 9개 축 기반 compatibility
- 불호/제외 조건 penalty
- 지역/일정 보너스
- 추천 후보 정렬

다른 서비스 재사용 예:

- 라운딩 파트너 매칭
- 스터디 매칭
- 여행 동행 매칭
- 크리에이터 협업 매칭
- 팬클럽 운영진 매칭

## `@kgia/gci-engine`

GCI 점수와 광고 세그먼트를 산출합니다.

책임:

- 참여/매너/영향력/콘텐츠/추천/네트워크 점수
- C/B/A/S/M Rank
- GCAN 광고 세그먼트
- 광고주용 타깃 해석

## `@kgia/proam-engine`

프로암/오프라인 이벤트 조 편성 엔진입니다.

책임:

- 2인/3인/4인 조 생성
- 평균 궁합 점수 산출
- GCI 균형 고려
- 같은 지역/일정 preference 반영

## `@kgia/commerce-engine`

수익화 모듈입니다.

책임:

- 상품 카탈로그
- 주문 생성
- 결제 intent 생성
- mock payment webhook 반영
- 결제 상태 enum

실서비스 전환 시 `createPaymentIntent` 내부만 토스페이먼츠/KG이니시스/카카오페이로 바꾸면 됩니다.

## `@kgia/crm-engine`

운영자/영업 파이프라인 모듈입니다.

책임:

- 고의향 사용자 선별
- 스폰서 문의 lead scoring
- 다음 연락 대상 생성
- follow-up queue 생성

## `@kgia/growth-engine`

성장 분석 모듈입니다.

책임:

- 퍼널 집계
- 코호트 집계
- A/B 테스트 variant assignment
- growth snapshot 생성

## `@kgia/privacy-consent`

개인정보/동의 모듈입니다.

책임:

- privacy/matching/marketing consent 정규화
- 동의 원장 생성
- 공개용 프로필 redaction
- 데이터 export/delete request skeleton

## `@kgia/server-kit`

외부 의존성 없는 Node 서버 운영 유틸입니다.

책임:

- JSON store
- response helpers
- request body parser
- token/session helper
- OTP helper
- notification queue helper

## `@kgia/golf-platform`

각 패키지를 한 번에 묶어서 export하는 aggregate package입니다.
