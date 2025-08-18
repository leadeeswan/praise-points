# 칭찬 포인트 시스템 (Praise Points System)

아이들의 착한 행동을 장려하고 동기부여를 제공하기 위한 디지털 보상 시스템입니다.

## 📋 프로젝트 개요

### 주요 기능
- **부모 기능**
  - 회원가입/로그인
  - 아이 프로필 관리
  - 포인트 지급 (1-10개, 칭찬 사유 포함)
  - 상품 등록/관리
  - 구매 요청 승인/거절
  - 포인트 및 구매 내역 조회

- **아이 기능**
  - 현재 포인트 확인
  - 상품 목록 조회
  - 상품 구매 요청
  - 포인트 내역 확인
  - 구매 내역 확인

## 🛠 기술 스택

### 백엔드
- **Framework**: Spring Boot 3.5.4
- **언어**: Java 17
- **데이터베이스**: H2 (개발), PostgreSQL (운영)
- **인증**: Spring Security + JWT
- **ORM**: Spring Data JPA

### 프론트엔드
- **Framework**: React 18 + TypeScript
- **UI Library**: Material-UI (MUI)
- **상태관리**: React Context API
- **HTTP Client**: Axios
- **라우팅**: React Router

## 🚀 실행 방법

### Docker Compose로 실행 (권장)

1. 프로젝트 루트 디렉토리에서 실행:
```bash
docker-compose up -d
```

2. 서비스 상태 확인:
```bash
docker-compose ps
```

3. 로그 확인:
```bash
docker-compose logs -f backend
```

4. 서비스 종료:
```bash
docker-compose down
```

### 개발 모드로 실행

#### 백엔드 실행 (H2 데이터베이스 사용)

1. 프로젝트 루트 디렉토리에서 실행:
```bash
./gradlew bootRun
```

또는 IDE에서 `PraisePointsApplication.java` 실행

#### 프론트엔드 실행

1. 프론트엔드 디렉토리로 이동:
```bash
cd frontend
```

2. 의존성 설치 (최초 1회만):
```bash
npm install
```

3. 개발 서버 시작:
```bash
npm start
```

## 🌐 접속 정보

- **백엔드 API**: http://localhost:8080
- **프론트엔드**: http://localhost:3000
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: `password`

## 📱 사용 방법

### 1. 회원가입 및 로그인
1. http://localhost:3000 접속
2. 회원가입 버튼 클릭
3. 이름, 이메일, 비밀번호 입력 후 가입
4. 로그인 완료 후 부모 대시보드로 이동

### 2. 아이 등록
1. 부모 대시보드 → 아이 관리 메뉴
2. "아이 추가" 버튼 클릭
3. 아이 정보 입력 (이름, 생년월일, 프로필 이미지 등)

### 3. 상품 등록
1. 부모 대시보드 → 상품 관리 메뉴
2. "상품 추가" 버튼 클릭
3. 상품 정보 입력 (이름, 설명, 필요 포인트, 카테고리 등)

### 4. 포인트 지급
1. 부모 대시보드 → 포인트 관리 메뉴
2. "포인트 지급" 버튼 클릭
3. 아이 선택, 포인트 수, 칭찬 사유, 메시지 입력

### 5. 아이 화면 접속
1. 부모 대시보드 → 대시보드 메뉴에서 아이 카드 클릭
2. 또는 직접 URL 접속: http://localhost:3000/child/{아이ID}

### 6. 상품 구매 및 승인
1. 아이: 구매하기 버튼 클릭으로 구매 요청
2. 부모: 구매 승인 메뉴에서 승인/거절 처리

## 📊 데이터베이스 스키마

### 주요 테이블
- **users**: 부모 정보
- **children**: 아이 정보
- **point_transactions**: 포인트 거래 내역
- **rewards**: 상품 정보
- **purchases**: 구매 요청/승인 정보

## 🔐 API 인증

모든 API는 JWT 토큰을 통한 인증이 필요합니다. (로그인/회원가입 제외)

**요청 헤더 예시:**
```
Authorization: Bearer {JWT_TOKEN}
```

## 📝 주요 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입

### 아이 관리
- `GET /api/children` - 아이 목록 조회
- `POST /api/children` - 아이 추가
- `PUT /api/children/{id}` - 아이 정보 수정
- `DELETE /api/children/{id}` - 아이 삭제

### 포인트 관리
- `POST /api/points/award` - 포인트 지급
- `GET /api/points/history/{childId}` - 포인트 내역 조회
- `GET /api/points/balance/{childId}` - 포인트 잔액 조회

### 상품 관리
- `GET /api/rewards` - 상품 목록 조회
- `POST /api/rewards` - 상품 등록
- `PUT /api/rewards/{id}` - 상품 수정
- `DELETE /api/rewards/{id}` - 상품 삭제

### 구매 관리
- `POST /api/purchases` - 구매 요청
- `PUT /api/purchases/{id}/approve` - 구매 승인
- `PUT /api/purchases/{id}/reject` - 구매 거절
- `GET /api/purchases/pending` - 승인 대기 목록

## 🎯 주요 특징

### 보안
- JWT 기반 인증/인가
- Spring Security를 통한 엔드포인트 보호
- 사용자별 데이터 접근 권한 제어

### 사용성
- 반응형 웹 디자인 (모바일 친화적)
- 직관적인 Material-UI 컴포넌트
- 실시간 데이터 업데이트

### 확장성
- 컴포넌트 기반 React 구조
- RESTful API 설계
- TypeScript를 통한 타입 안정성

## 📈 향후 개선 계획

- 푸시 알림 기능
- 가족 간 포인트 선물하기
- 월간/연간 통계 대시보드
- 성취 배지 시스템
- 모바일 앱 개발

## 🐛 문제 해결

### 일반적인 문제들

1. **CORS 에러**: 백엔드에서 CORS 설정이 적용되어 있습니다.
2. **JWT 토큰 만료**: 로그아웃 후 다시 로그인하세요.
3. **H2 데이터베이스 초기화**: 애플리케이션 재시작 시 데이터가 초기화됩니다.

### 포트 충돌 시 해결방법
- 백엔드: `application.properties`에서 `server.port` 변경
- 프론트엔드: `package.json`의 start 스크립트에 포트 지정

## 📞 지원

문의사항이나 버그 리포트는 프로젝트 담당자에게 연락주세요.