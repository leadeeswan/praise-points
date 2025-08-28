# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

Create React App TypeScript 프로젝트입니다. 개발에 필요한 명령어:

- `npm start` - 개발 서버 실행 (http://localhost:3000)
- `npm run build` - 프로덕션 빌드
- `npm test` - 테스트 실행 (watch 모드)
- `npm run eject` - Create React App에서 탈출 (되돌릴 수 없음)

## 아키텍처 개요

아이들의 포인트와 보상을 관리하는 칭찬 포인트 시스템의 React TypeScript 프론트엔드입니다. 이중 인증 모드를 지원합니다:

### 인증 시스템
- **부모 인증**: JWT 기반 표준 인증
- **아이 인증**: username/authKey를 사용하는 별도 인증 시스템
- 두 개의 분리된 인증 컨텍스트: `AuthContext` (부모용), `ChildAuthContext` (아이용)

### 컴포넌트 구조
```
components/
├── auth/          # 부모와 아이 모두를 위한 로그인/회원가입 컴포넌트
├── parent/        # 부모 대시보드 및 관리 컴포넌트
└── child/         # 아이 대시보드 컴포넌트
```

### 주요 컴포넌트
- **ParentDashboard**: 중첩 라우팅을 포함한 메인 부모 인터페이스
- **ChildDashboard**: 기존 아이 인터페이스 (부모를 통해 접근)
- **ChildDashboardNew**: 별도 인증을 가진 새로운 독립적 아이 인터페이스

### API 통합
- 백엔드 API 기본 URL: `http://localhost:8080/api`
- JWT 토큰 자동 주입 기능을 가진 중앙화된 API 클라이언트 (`services/api.ts`)
- 분리된 API 모듈들: `authAPI`, `childAPI`, `pointAPI`, `rewardAPI`, `purchaseAPI`

### 상태 관리
- React Context를 사용한 컨텍스트 기반 상태 관리
- 인증 토큰과 사용자 데이터의 localStorage 지속성
- 외부 상태 관리 라이브러리 미사용 (Redux, Zustand 등 없음)

### 주요 기능
- 포인트 지급 및 관리 시스템
- 보상 생성 및 구매 승인 워크플로우
- 아이 관리 (CRUD 기능)
- 구매 요청/승인 시스템
- 포인트 거래 내역

### 라우팅 구조
- `/parent/*` - 보호된 부모 대시보드 라우트
- `/child/:childId` - 부모 관리 아이 뷰
- `/child-dashboard/:childId` - 독립적인 아이 대시보드
- `/login`, `/signup` - 부모 인증
- `/child-login` - 아이 인증

### 기술 스택
- TypeScript를 사용한 React 19
- 컴포넌트와 테마를 위한 Material-UI (MUI)
- 네비게이션을 위한 React Router
- HTTP 요청을 위한 Axios
- 도구를 위한 Create React App

## 중요 사항

- 백엔드는 localhost:8080에서 실행됩니다
- 아이 인증은 별도 토큰 저장소 사용 (`childToken`, `childData`)
- 부모 인증은 표준 토큰 저장소 사용 (`token`, `email`, `name`)
- 모든 API 요청은 axios 인터셉터를 통해 JWT 토큰을 자동으로 포함합니다