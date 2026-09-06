# 수트와후드 SOOD · 문성운

스타트업 경영 코치 문성운(수트와후드)의 홈페이지. 소개 · 칼럼 아카이브 · 상담 문의.
React 19 + Vite 7 + React Router, Firebase Hosting.

- 운영 URL: https://sood-page.web.app
- 문의 메일: ultramsw67@gmail.com (상담 폼은 메일 앱을 열어 이 주소로 보냅니다)

## 로컬 실행

Node.js 22 이상.

```sh
npm ci
npm run dev
```

## 블로그 글 가져오기

네이버 블로그 발행글은 Obsidian vault(`C:\Obsidian\tomwiki\10_블로그\네이버`)의 md 파일을 읽어 `public/posts/*.json` 과 `public/sitemap.xml` 로 변환합니다.
새 글을 발행한 뒤 vault 를 갱신(`fetch-naver.js`)하고 아래를 실행한 다음 커밋하면 사이트에 반영됩니다.

```sh
npm run import:blog            # 기본 경로
npm run import:blog -- <폴더>  # 다른 경로
```

- `public/posts/index.json`: 목록(제목·날짜·카테고리·요약·썸네일)
- `public/posts/<logNo>.json`: 본문 HTML. 글 페이지는 `/articles/<logNo>` 로 열립니다.
- 이미지는 네이버 원본을 그대로 씁니다. `referrerpolicy="no-referrer"` 가 없으면 네이버가 403 을 돌려주므로 유지해야 합니다.

## 콘텐츠 수정

- `src/lib/site.js`: 이름, 이메일, 채널, 서비스 4개, 경력, 자문 사례, 진행 방식
- `src/pages/*.jsx`: 홈 · 소개 · 글 · 상담 페이지 문구
- `src/index.css`: 색상, 글꼴, 반응형
- `public/sood-character.jpg`: 브랜드 캐릭터

고객사 이름, 비공개 문서, 검증되지 않은 실적 수치는 공개하지 않습니다.

## 상담 폼 발송 방식

`src/lib/site.js` 의 `profile.formKey` 에 Web3Forms 액세스 키가 있으면 폼 내용이 사이트에서 바로 ultramsw67@gmail.com 으로 전송됩니다(무료, 회신 주소는 입력한 이메일).
키가 비어 있으면 메일 앱을 여는 방식으로 동작합니다. 키 발급: https://web3forms.com/#start 에 ultramsw67@gmail.com 을 입력하면 키가 그 메일로 옵니다.
액세스 키는 공개돼도 되는 값이지만, 스팸이 많아지면 Web3Forms 대시보드에서 hCaptcha 를 켤 수 있습니다.

## 검증

```sh
npm run lint
npm run build
npx playwright test   # 로컬은 설치된 Chrome, CI 는 Chromium
```

테스트는 반응형 레이아웃, 모바일 메뉴, 상담 폼, 글 필터·검색·본문, 문의 메일 주소, `더문테크`/`themoontech` 미포함을 확인하고 `tmp/` 에 스크린샷을 남깁니다.

## 배포

Firebase 프로젝트 `sood-page`. `main` 에 push 하면 `.github/workflows/firebase-hosting-merge.yml` 이 `npm ci && npm run build` 후 배포합니다.
GitHub Secret `FIREBASE_SERVICE_ACCOUNT_SOOD_PAGE` 가 필요합니다. `dist/` 는 저장소에 올리지 않습니다.
실패 시 GitHub Actions 로그를 확인하고 수정 커밋을 push 하거나, Firebase Hosting 콘솔에서 이전 릴리스로 롤백합니다.
