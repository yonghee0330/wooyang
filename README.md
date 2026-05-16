# 우양재단 휴가관리 시스템

우양재단 구성원이 휴가 현황을 확인하고 휴가를 신청할 수 있는 정적 웹 기반 휴가관리 시스템입니다. Phase 1은 순수 HTML/CSS/JavaScript로 구현되어 GitHub Pages 같은 정적 호스팅에 바로 배포할 수 있으며, Google Apps Script API와 연동합니다.

## 파일 구조

```text
/
├── index.html
├── change-pw.html
├── dashboard.html
├── apply.html
├── assets/
│   ├── style.css
│   └── app.js
└── README.md
```

## Phase 1 구현 범위

- 로그인 화면: 사번/비밀번호 로그인, 최초 로그인 비밀번호 변경 분기, 기존 세션 자동 이동
- 비밀번호 변경 화면: 초기 비밀번호 변경 검증 및 변경 API 호출
- 대시보드: 내 정보 조회, 연차 현황 카드, 휴가 신청 이동, 최근 신청 내역 표시
- 휴가 신청: 신청자/부서/결재자 자동 표시, 휴가종류/유급구분/기간/사유 입력, 주말 제외 사용일수 자동 계산, 신청 API 호출
- 공통 기능: sessionStorage 기반 세션 관리, 로그인 보호, 로그아웃, 토스트 알림, 반응형 레이아웃

## 향후 Phase 2~4 계획

- Phase 2: 캘린더 뷰를 추가해 개인 및 부서 휴가 일정을 월간 형태로 확인
- Phase 3: 관리자 승인 페이지를 추가해 대기/승인/반려 처리와 결재 흐름 관리
- Phase 4: 통계 화면을 추가해 개인/부서별 사용 현황, 잔여 연차, 기간별 신청 추이를 시각화

## 로컬 테스트 방법

정적 파일이므로 별도 빌드 과정은 없습니다. 브라우저에서 `index.html`을 직접 열거나 간단한 로컬 서버를 실행해 확인합니다.

```bash
python3 -m http.server 8000
```

서버 실행 후 브라우저에서 `http://localhost:8000`에 접속합니다.

테스트 순서:

1. `index.html`에서 사번과 초기 비밀번호 `wooyang2026`으로 로그인합니다.
2. 최초 로그인 사용자는 `change-pw.html`로 이동하는지 확인하고 새 비밀번호로 변경합니다.
3. `dashboard.html`에서 사용자 정보, 연차 현황, 최근 신청 내역이 표시되는지 확인합니다.
4. `apply.html`에서 휴가종류와 기간을 입력하고 사용일수가 자동 계산되는지 확인합니다.
5. 휴가 신청 제출 후 접수 토스트가 표시되고 대시보드로 돌아오는지 확인합니다.
6. 로그아웃 후 보호 페이지 접근 시 로그인 화면으로 이동하는지 확인합니다.

## GitHub Pages 배포 방법

1. GitHub 저장소에 현재 파일 구조 그대로 커밋하고 푸시합니다.
2. 저장소의 `Settings` → `Pages` 메뉴로 이동합니다.
3. `Build and deployment`의 Source를 `Deploy from a branch`로 선택합니다.
4. 배포 브랜치를 선택하고 폴더는 루트(`/`)로 지정합니다.
5. 저장 후 표시되는 GitHub Pages URL로 접속해 로그인 화면을 확인합니다.

## API 연동 참고

- API URL은 `assets/app.js`의 `API_URL` 상수에 정의되어 있습니다.
- Google Apps Script CORS preflight를 피하기 위해 `fetch` 호출에 `Content-Type` 헤더를 설정하지 않습니다.
- 세션은 `sessionStorage`의 `wy_user` 키에 저장되며 브라우저를 닫으면 자동으로 로그아웃됩니다.
