# Extension Playbook

## 새 서비스를 만들 때

예: `여행 동행 파트너 테스트`를 만든다고 가정합니다.

```text
apps/travel-partner-web
packages/partner-test       그대로 사용
packages/matching-engine    그대로 사용
packages/privacy-consent    그대로 사용
packages/server-kit         그대로 사용
```

바꿔야 하는 것:

1. `partner-test`의 questions override
2. `resultTypes` override
3. `matching-engine`의 weights override
4. 서비스 전용 static pages 추가
5. 상품이 있으면 `commerce-engine` offer catalog override

## 추천 서비스별 패키지 조합

### 테스트형 바이럴 서비스

```text
partner-test
growth-engine
privacy-consent
server-kit
```

### 파트너 매칭 서비스

```text
partner-test
matching-engine
privacy-consent
crm-engine
server-kit
```

### 오프라인 이벤트/조 편성 서비스

```text
matching-engine
proam-engine
crm-engine
notification queue from server-kit
```

### 수익화/멤버십 서비스

```text
commerce-engine
crm-engine
growth-engine
privacy-consent
```

### 광고/스폰서 CRM 서비스

```text
gci-engine
crm-engine
growth-engine
privacy-consent
```

## 확장 규칙

- 앱 화면과 서비스 고유 API는 `apps/`에 둔다.
- 재사용 가능한 계산/상태/검증 로직은 `packages/`에 둔다.
- 외부 provider 연결은 package 내부 adapter 파일로 분리한다.
- 개인정보 원본은 앱 저장소에만 두고, 공유/광고/리포트에는 redacted profile만 전달한다.
- 실결제, 알림톡, DB adapter는 인터페이스는 유지하고 구현만 교체한다.
