# SOOD · 수트와후드

문성운의 개인 브랜드, 경력 포트폴리오, 스타트업 전략 상담 홈페이지입니다.
React 19 + Vite 7 + React Router / Firebase Hosting.

## 로컬 실행

Node.js 22 이상에서 다음을 실행합니다.

```sh
npm ci
npm run dev
```

## 검증

```sh
npm run lint
npm run build
npx playwright test
```

로컬 브라우저 테스트는 설치된 Chrome을 사용합니다. CI는 Playwright Chromium을 사용합니다.

## 콘텐츠 수정

- `src/lib/site.js`: 이름, 이메일, 외부 채널, 서비스, 경력, 자문 분야
- `src/lib/articles.js`: 기존 홈페이지 글. HTML은 신뢰하는 작성자만 수정합니다.
- `src/pages/Home.jsx`: 메인 문구와 섹션 구성
- `src/index.css`: 색상, 글꼴, 모바일 레이아웃
- `public/sood-character.jpg`: 수트와후드 브랜드 캐릭터

기존 홈페이지 및 사용자 로컬 기획 메모에서 확인한 경력을 반영했습니다.
고객사 이름, 비공개 문서, 검증되지 않은 실적 수치는 공개하지 않습니다.
문의 주소는 기존 사이트의 `contact@themoontech.com`을 유지했습니다.
상담 폼은 메일 앱을 열며, 사이트 자체에서 메일을 전송하거나 개인정보를 저장하지 않습니다.
방문자는 메일 앱에서 직접 발송해야 합니다. 수신 메일함 운영은 별도로 확인해야 합니다.
기존의 저장되지 않는 데모 댓글은 공개 화면에서 제거했습니다.

## 배포 및 복구

Firebase 프로젝트: `sood-page`
운영 URL: https://sood-page.web.app
`main`에 push하면 `.github/workflows/firebase-hosting-merge.yml`에서 검사, 빌드 후 배포합니다.
GitHub Secret `FIREBASE_SERVICE_ACCOUNT_SOOD_PAGE`가 필요합니다(기존 설정).
실패 시 GitHub Actions 로그를 확인하고 직전 정상 커밋으로 수정 커밋을 만들어 push합니다.
긴급 복구는 Firebase Hosting 콘솔의 이전 릴리스 롤백을 사용할 수 있습니다.

## 관리 기준

배포 전 모바일 메뉴·상담 이동·글 검색·본문·404를 검증합니다.
배포 후 홈, 소개, 상담 페이지와 이미지가 정상인지 확인합니다.
정기적으로 연락처, 경력, 채널 링크 및 문의 수신 여부를 점검합니다.
자동 상시 모니터링은 설정되어 있지 않습니다. CI는 저장소 변경 때 실행됩니다.
원본 브랜드 덱과 로컬 문서는 저장소에 올리지 않습니다.
