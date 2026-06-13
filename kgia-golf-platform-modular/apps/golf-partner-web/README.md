# Golf Partner Web App

이 경로는 v7 실서비스 앱 위치입니다.

전체 로컬 패키지에는 아래 실행형 앱 파일이 들어 있습니다.

```text
index.html
my.html
offers.html
checkout.html
sponsor.html
share.html
admin_secure.html
ops.html
growth.html
crm.html
integrations.html
api/server.js
backend_schema_v7.sql
docs/*
manifest.webmanifest
sw.js
offline.html
```

GitHub에는 우선 재사용 가능한 핵심 패키지 소스와 문서를 업로드했습니다. 전체 실행형 앱 소스는 제공된 `kgia-golf-platform-modular.zip` 패키지에 포함되어 있으며, 전용 레포를 생성한 뒤 `scripts/create_github_repo_and_push.sh`로 한 번에 push하는 구조입니다.

운영 앱 실행:

```bash
npm run start
```
