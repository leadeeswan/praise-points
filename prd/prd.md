# 별 포인트 보상 시스템 PRD (Product Requirements Document)

## 1. 프로젝트 개요

### 1.1 프로젝트명
별 포인트 보상 시스템 (Star Point Reward System)

### 1.2 프로젝트 목적
아이들의 착한 행동을 장려하고 동기부여를 제공하기 위한 디지털 보상 시스템 구축

### 1.3 프로젝트 비전
부모와 아이들 간의 긍정적인 소통을 통해 건전한 가족 문화를 조성하고, 아이들의 자발적인 착한 행동을 유도

## 2. 타겟 사용자

### 2.1 주요 사용자
- **부모 (관리자)**: 포인트 지급, 상품 등록, 시스템 관리
- **아이들 (사용자)**: 포인트 확인, 상품 구매

### 2.2 사용자 특성
- 부모: 스마트폰/태블릿 사용 가능한 성인
- 아이들: 5세~15세, 기본적인 터치 조작 가능

## 3. 핵심 기능 요구사항

### 3.1 사용자 관리
#### 3.1.1 부모 계정 관리
- 회원가입/로그인 기능
- 가족 그룹 생성
- 프로필 설정

#### 3.1.2 아이 프로필 관리
- 아이 프로필 추가/수정/삭제
- 아이별 포인트 현황 조회
- 프로필 사진 설정

### 3.2 포인트 지급 시스템
#### 3.2.1 칭찬 사유 관리
- 사전 정의된 칭찬 사유 목록
    - 숙제 완료
    - 정리정돈
    - 도움 행동
    - 예의바른 행동
    - 동생 돌보기
    - 기타 (직접 입력)
- 사유별 기본 포인트 설정 가능
- 맞춤형 칭찬 사유 추가

#### 3.2.2 포인트 지급 기능
- 아이 선택 (단일/다중 선택)
- 칭찬 사유 선택
- 포인트 개수 설정 (1~10개)
- 칭찬 메시지 작성 (선택사항)
- 일괄 지급 기능

### 3.3 상품 관리 시스템
#### 3.3.1 상품 등록
- 상품명 입력
- 필요 포인트 설정
- 상품 이미지 업로드
- 상품 설명 입력
- 상품 카테고리 분류
    - 장난감
    - 간식
    - 체험활동
    - 용돈
    - 기타

#### 3.3.2 상품 관리
- 상품 활성화/비활성화
- 상품 수정/삭제
- 상품 진열 순서 조정

### 3.4 포인트 사용 시스템
#### 3.4.1 상품 구매
- 사용 가능한 상품 목록 조회
- 포인트 잔액 확인
- 상품 구매 요청
- 구매 승인 대기

#### 3.4.2 구매 승인 시스템
- 부모 승인 대기 알림
- 승인/거절 기능
- 승인 시 포인트 차감
- 구매 완료 알림

### 3.5 히스토리 관리
#### 3.5.1 포인트 내역
- 포인트 지급/차감 이력
- 날짜별 조회
- 사유별 필터링

#### 3.5.2 구매 내역
- 상품 구매 이력
- 승인/거절 상태 표시
- 월별/연별 통계

## 4. 비기능 요구사항

### 4.1 성능 요구사항
- 응답시간: 3초 이내
- 동시 사용자: 1,000명
- 가용성: 99.9%

### 4.2 보안 요구사항
- 사용자 인증/인가
- 개인정보 암호화
- HTTPS 통신

### 4.3 호환성 요구사항
- 모바일 우선 반응형 웹
- iOS Safari, Android Chrome 지원
- 태블릿 환경 최적화

## 5. 기술 스택 제안

### 5.1 백엔드
- **Framework**: Spring Boot 3.x
- **언어**: Java 17+
- **데이터베이스**: MySQL
- **인증**: Spring Security + JWT
- **API**: REST API

### 5.2 프론트엔드
- **Framework**: React.js 또는 Vue.js
- **모바일**: PWA (Progressive Web App)
- **상태관리**: Redux/Vuex
- **UI Framework**: Material-UI / Ant Design

### 5.3 인프라
- **클라우드**: AWS/GCP
- **컨테이너**: Docker + Kubernetes
- **CI/CD**: GitHub Actions
- **모니터링**: Prometheus + Grafana

## 6. 데이터베이스 설계 (주요 엔티티)

### 6.1 User (부모)
```sql
- id (Primary Key)
- email
- password
- name
- created_at
- updated_at
```

### 6.2 Child (아이)
```sql
- id (Primary Key)
- user_id (Foreign Key)
- name
- birth_date
- profile_image
- total_points
- created_at
```

### 6.3 PointTransaction (포인트 거래)
```sql
- id (Primary Key)
- child_id (Foreign Key)
- transaction_type (EARN/SPEND)
- points
- reason
- message
- created_at
```

### 6.4 Reward (상품)
```sql
- id (Primary Key)
- user_id (Foreign Key)
- name
- description
- required_points
- category
- image_url
- is_active
- created_at
```

### 6.5 Purchase (구매)
```sql
- id (Primary Key)
- child_id (Foreign Key)
- reward_id (Foreign Key)
- status (PENDING/APPROVED/REJECTED)
- requested_at
- approved_at
```

## 7. API 설계 (주요 엔드포인트)

### 7.1 인증 관련
- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/logout` - 로그아웃

### 7.2 아이 관리
- `GET /api/children` - 아이 목록 조회
- `POST /api/children` - 아이 추가
- `PUT /api/children/{id}` - 아이 정보 수정
- `DELETE /api/children/{id}` - 아이 삭제

### 7.3 포인트 관리
- `POST /api/points/award` - 포인트 지급
- `GET /api/points/history/{childId}` - 포인트 내역 조회
- `GET /api/points/balance/{childId}` - 포인트 잔액 조회

### 7.4 상품 관리
- `GET /api/rewards` - 상품 목록 조회
- `POST /api/rewards` - 상품 등록
- `PUT /api/rewards/{id}` - 상품 수정
- `DELETE /api/rewards/{id}` - 상품 삭제

### 7.5 구매 관리
- `POST /api/purchases` - 상품 구매 요청
- `PUT /api/purchases/{id}/approve` - 구매 승인
- `PUT /api/purchases/{id}/reject` - 구매 거절
- `GET /api/purchases/pending` - 승인 대기 목록

## 8. 사용자 시나리오

### 8.1 부모 시나리오
1. 회원가입 후 아이 프로필 등록
2. 상품 등록 (장난감, 간식 등)
3. 아이의 착한 행동 목격 시 포인트 지급
4. 아이의 상품 구매 요청 승인/거절

### 8.2 아이 시나리오
1. 현재 포인트 확인
2. 상품 목록 둘러보기
3. 원하는 상품 구매 요청
4. 부모 승인 후 상품 받기

## 9. 개발 일정

### Phase 1 (4주)
- 기본 사용자 인증 시스템
- 아이 프로필 관리
- 기본 포인트 지급 기능

### Phase 2 (3주)
- 상품 등록/관리 시스템
- 구매 요청/승인 시스템
- 기본 UI/UX 구현

### Phase 3 (2주)
- 히스토리 조회 기능
- 알림 시스템
- 성능 최적화

### Phase 4 (1주)
- 테스트 및 배포
- 문서화

## 10. 추후 확장 가능 기능

- 가족 간 포인트 선물하기
- 포인트 적립 목표 설정
- 월간/연간 통계 대시보드
- 아이별 성취 배지 시스템
- 가족 랭킹 시스템
- 푸시 알림 기능
- 소셜 공유 기능