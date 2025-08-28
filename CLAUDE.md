# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

Spring Boot 3.5.4 Gradle 프로젝트입니다. 주요 개발 명령어:

- `./gradlew bootRun` - 개발 서버 실행 (포트 8080)
- `./gradlew build` - 프로젝트 빌드
- `./gradlew test` - 테스트 실행
- `./gradlew clean` - 빌드 파일 정리
- `docker-compose up -d` - MySQL과 함께 전체 시스템 실행

## 프로파일 설정

- **기본 프로파일**: `docker` (application.properties에 설정)
- **개발용**: H2 인메모리 데이터베이스 사용
- **도커 환경**: MySQL 데이터베이스 사용

## 아키텍처 개요

아이들의 착한 행동을 장려하는 칭찬 포인트 시스템의 Spring Boot 백엔드입니다.

### 핵심 도메인

1. **User (부모)**: 시스템의 주 사용자
2. **Child (아이)**: 부모가 관리하는 아이들
3. **PointTransaction**: 포인트 지급/사용 내역
4. **Reward**: 부모가 등록한 상품
5. **Purchase**: 아이의 상품 구매 요청

### 이중 인증 시스템

**부모 인증**:
- JWT 토큰 기반 인증
- email/password 로그인
- `/api/auth/**` 엔드포인트

**아이 인증**:
- 별도 JWT 토큰 기반 인증
- username/authKey 로그인
- `/api/child-auth/**` 엔드포인트
- `/api/child-dashboard/**` 전용 API

### 패키지 구조

```
com.example.praisepoints/
├── config/         # Spring Security, JPA 설정
├── controller/     # REST API 컨트롤러
├── dto/           # 요청/응답 데이터 전송 객체
├── entity/        # JPA 엔티티 (도메인 모델)
├── exception/     # 커스텀 예외
├── repository/    # Spring Data JPA 리포지토리
├── security/      # JWT 인증 필터 및 유틸리티
└── service/       # 비즈니스 로직
```

### 보안 설정

- **JWT 토큰**: 부모와 아이 각각 별도 토큰 사용
- **이중 필터**: `JwtAuthenticationFilter`, `ChildJwtAuthenticationFilter`
- **권한 분리**: 부모용 API와 아이용 API 분리
- **CORS 허용**: 프론트엔드 통신을 위한 설정

### 주요 기능

**포인트 관리**:
- 포인트 지급 시 여러 아이에게 동시 지급 가능
- 트랜잭션 기반 포인트 내역 관리
- 사용 가능한 포인트와 예약된 포인트 분리

**구매 시스템**:
- 구매 요청 시 포인트 예약 (중복 구매 방지)
- 부모의 승인/거절 시스템
- 승인 시 예약 포인트에서 실제 차감

### 데이터베이스 설계

**핵심 관계**:
- User 1:N Child (부모-아이)
- User 1:N Reward (부모-상품)
- Child 1:N PointTransaction (아이-포인트내역)
- Child 1:N Purchase (아이-구매내역)
- Reward 1:N Purchase (상품-구매내역)

**포인트 시스템**:
- `totalPoints`: 총 보유 포인트
- `reservedPoints`: 구매 대기 중 예약된 포인트
- `getAvailablePoints()`: 실제 사용 가능한 포인트

### API 설계

**RESTful API 구조**:
- 모든 API는 `/api` prefix 사용
- 도메인별 컨트롤러 분리
- ResponseEntity를 통한 일관된 응답 처리
- `@CrossOrigin` 설정으로 CORS 허용

### 기술 스택 세부사항

- **Spring Boot 3.5.4** + Java 17
- **Spring Security** + JWT (jjwt 라이브러리)
- **Spring Data JPA** + Hibernate
- **MySQL** (운영) + H2 (개발)
- **Lombok** (보일러플레이트 코드 감소)
- **Validation API** (입력값 검증)
- **Spring Boot Actuator** (모니터링)

### 중요 설정

**JWT 설정**:
- 시크릿 키: application.properties에 설정
- 토큰 만료: 86400000ms (24시간)

**데이터베이스**:
- JPA 쿼리 로깅 활성화
- Auditing 기능으로 생성/수정 시간 자동 관리

**에러 처리**:
- 커스텀 예외 (`PurchaseException`)
- JSON 순환 참조 방지 (`@JsonIgnoreProperties`)

## 중요 사항

- 프론트엔드는 localhost:3000, 백엔드는 localhost:8080
- H2 Console: `/h2-console` (개발 환경에서만)
- 아이 인증과 부모 인증은 완전히 분리된 토큰 사용
- 포인트 관련 모든 작업은 트랜잭션 처리됨