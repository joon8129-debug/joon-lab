# GitHub Upload Guide

현재 업로드 위치:

```text
https://github.com/joon8129-debug/joon-lab/tree/main/kgia-golf-platform-modular
```

권장 전용 레포:

```text
joon8129-debug/kgia-golf-partner-matching
```

## 전용 레포로 분리하는 방법

GitHub CLI가 있다면:

```bash
cd kgia-golf-platform-modular
gh auth login
gh repo create joon8129-debug/kgia-golf-partner-matching --private --source=. --remote=origin --push
```

공개 레포로 만들려면:

```bash
gh repo create joon8129-debug/kgia-golf-partner-matching --public --source=. --remote=origin --push
```

이미 빈 레포를 만들었다면:

```bash
cd kgia-golf-platform-modular
git init
git add .
git commit -m "Initial commit: modular KGIA golf platform"
git branch -M main
git remote add origin https://github.com/joon8129-debug/kgia-golf-partner-matching.git
git push -u origin main
```

## 이 환경에서 확인한 것

- GitHub 계정: `joon8129-debug`
- `joon8129-debug/joon-lab`: push 권한 있음
- `joon8129-debug/kgia-golf-partner-matching`: 아직 없음
- 현재 connector에는 새 레포 생성 API가 노출되지 않음

그래서 이번 업로드는 `joon-lab/kgia-golf-platform-modular` 하위 폴더에 진행했습니다.
