# 커피 주문 앱 PRD (Product Requirements Document)

## 1. 프로젝트 개요

### 1.1 프로젝트명
커피 주문 앱 (Coffee Order App)

### 1.2 프로젝트 목적
사용자가 편리하게 커피를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스텍 웹 앱

### 1.3 프로젝트 범위
- 커피 메뉴 조회 및 선택
- 주문 옵션 커스터마이징 (사이즈, 온도, 추가 옵션)
- 장바구니 관리
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능 

## 2. 타겟 사용자

### 2.1 주요 사용자
- 커피를 자주 마시는 20-40대 직장인
- 모바일 앱 사용에 익숙한 사용자
- 빠르고 편리한 주문을 선호하는 사용자

### 2.2 사용자 니즈
- 빠른 주문 처리
- 메뉴 정보의 명확한 제공
- 간편한 결제 시스템
- 주문 상태 실시간 확인

## 3. 핵심 기능

### 3.1 메뉴 관리
- 커피 메뉴 카테고리별 분류 (에스프레소, 라떼, 아메리카노 등)
- 메뉴 상세 정보 (가격, 설명, 이미지, 영양 정보)
- 인기 메뉴 및 추천 메뉴 표시

### 3.2 주문 기능
- 메뉴 선택 및 옵션 커스터마이징
- 장바구니 추가/삭제/수정
- 주문 수량 조절
- 주문 요청사항 입력

### 3.3 결제 시스템
- 다양한 결제 수단 지원 (카드, 간편결제, 현금)
- 할인 쿠폰 및 포인트 사용
- 주문 금액 계산 및 영수증 발행

### 3.4 주문 관리
- 주문 내역 조회
- 주문 상태 실시간 확인 (접수, 제조중, 완료)
- 주문 취소 및 환불 처리

## 4. 기술 요구사항

### 4.1 플랫폼
- 모바일 앱 (iOS/Android)
- 웹 애플리케이션 (반응형)

### 4.2 기술 스택 (예상)
- Frontend: HTML, CSS, 리액트, 자바스크립트
- Backend: Node.js + Express 또는 Python + FastAPI
- Database: PostgreSQL
- Payment: 결제 API 연동 (토스페이먼츠, 카카오페이 등) --> 옵션

### 4.3 성능 요구사항
- 앱 로딩 시간: 3초 이내
- 주문 처리 시간: 30초 이내
- 동시 사용자: 1000명 이상 지원

## 5. UI/UX 요구사항

### 5.1 디자인 원칙
- 직관적이고 사용하기 쉬운 인터페이스
- 커피 브랜드에 맞는 따뜻하고 친근한 디자인
- 접근성 고려 (폰트 크기, 색상 대비)

### 5.2 주요 화면
- 메인 화면 (메뉴 카테고리)
- 메뉴 상세 화면
- 장바구니 화면
- 주문 확인 화면
- 결제 화면
- 주문 내역 화면

## 6. 비즈니스 요구사항

### 6.1 수익 모델
- 커피 판매 수익
- 배달비 수수료
- 광고 수익 (선택사항)

### 6.2 운영 요구사항
- 실시간 재고 관리
- 주문 통계 및 분석
- 고객 관리 시스템
- 매장 관리 기능

## 7. 보안 및 개인정보 보호

### 7.1 데이터 보안
- 개인정보 암호화 저장
- 안전한 결제 정보 처리
- HTTPS 통신 보장

### 7.2 개인정보 처리
- 최소한의 개인정보 수집
- 사용자 동의 기반 데이터 처리
- 개인정보 삭제 요청 처리

## 8. 프로젝트 일정 (예상)

### 8.1 개발 단계
- 1단계: 기본 UI/UX 및 메뉴 조회 기능 (4주)
- 2단계: 주문 및 장바구니 기능 (3주)
- 3단계: 결제 시스템 연동 (3주)
- 4단계: 주문 관리 및 내역 조회 (2주)
- 5단계: 테스트 및 배포 (2주)

### 8.2 총 개발 기간
약 14주 (3.5개월)

## 9. 성공 지표 (KPI)

### 9.1 사용자 지표
- 일일 활성 사용자 수 (DAU)
- 월간 활성 사용자 수 (MAU)
- 사용자 유지율

### 9.2 비즈니스 지표
- 일일 주문 건수
- 평균 주문 금액
- 전환율 (방문자 대비 주문자)

## 10. 위험 요소 및 대응 방안

### 10.1 기술적 위험
- 결제 시스템 연동 복잡성
- 대용량 트래픽 처리
- 모바일 앱 성능 최적화

### 10.2 비즈니스 위험
- 경쟁사 대비 차별화 부족
- 사용자 채택률 저조
- 운영 비용 증가

---
## 11. 기본 사항
- 프런트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음 

---

## 12. 백엔드 개발 PRD

### 12.1 데이터 모델

#### 12.1.1 Menus 테이블
커피 메뉴 정보를 저장하는 테이블

| 필드명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 메뉴 고유 ID |
| name | VARCHAR(100) | NOT NULL | 커피 이름 |
| description | TEXT | NULL | 커피 설명 |
| price | DECIMAL(10,2) | NOT NULL | 가격 |
| image_url | VARCHAR(255) | NULL | 이미지 URL |
| stock_quantity | INTEGER | NOT NULL, DEFAULT 0 | 재고 수량 |
| category | VARCHAR(50) | NULL | 카테고리 (에스프레소, 라떼, 아메리카노 등) |
| is_available | BOOLEAN | NOT NULL, DEFAULT TRUE | 판매 가능 여부 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 수정일시 |

#### 12.1.2 Options 테이블
메뉴 옵션 정보를 저장하는 테이블

| 필드명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 옵션 고유 ID |
| name | VARCHAR(100) | NOT NULL | 옵션 이름 (예: 사이즈, 온도, 샷 추가) |
| price_modifier | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | 가격 변동 (추가 비용 또는 할인) |
| menu_id | INTEGER | NOT NULL | 연결할 메뉴 ID (Foreign Key) |
| option_type | VARCHAR(50) | NOT NULL | 옵션 타입 (size, temperature, extra_shot 등) |
| is_required | BOOLEAN | NOT NULL, DEFAULT FALSE | 필수 옵션 여부 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 수정일시 |

#### 12.1.3 Orders 테이블
주문 정보를 저장하는 테이블

| 필드명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 주문 고유 ID |
| order_number | VARCHAR(20) | NOT NULL, UNIQUE | 주문 번호 (예: ORD-20241201-001) |
| order_datetime | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 주문 일시 |
| total_amount | DECIMAL(10,2) | NOT NULL | 총 주문 금액 |
| status | VARCHAR(20) | NOT NULL, DEFAULT '접수' | 주문 상태 (접수, 제조중, 완료, 취소) |
| customer_name | VARCHAR(100) | NULL | 고객명 |
| customer_phone | VARCHAR(20) | NULL | 고객 연락처 |
| special_requests | TEXT | NULL | 특별 요청사항 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 수정일시 |

#### 12.1.4 Order_Items 테이블
주문 상세 항목을 저장하는 테이블

| 필드명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 주문 항목 고유 ID |
| order_id | INTEGER | NOT NULL | 주문 ID (Foreign Key) |
| menu_id | INTEGER | NOT NULL | 메뉴 ID (Foreign Key) |
| quantity | INTEGER | NOT NULL, DEFAULT 1 | 수량 |
| unit_price | DECIMAL(10,2) | NOT NULL | 단위 가격 |
| total_price | DECIMAL(10,2) | NOT NULL | 항목별 총 가격 |
| selected_options | JSON | NULL | 선택된 옵션들 (JSON 형태로 저장) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일시 |

### 12.2 데이터 스키마를 위한 사용자 흐름

#### 12.2.1 메뉴 조회 및 표시 흐름
1. **메뉴 데이터 조회**
   - 클라이언트에서 메뉴 목록 요청
   - 백엔드에서 Menus 테이블에서 모든 활성 메뉴 조회
   - 각 메뉴의 Options 정보도 함께 조회
   - 재고 수량 정보 포함하여 응답

2. **화면 표시**
   - 일반 사용자 화면: 메뉴명, 설명, 가격, 이미지 표시
   - 관리자 화면: 추가로 재고 수량 표시

#### 12.2.2 주문 처리 흐름
1. **장바구니 관리**
   - 사용자가 메뉴 선택 시 클라이언트에서 임시 저장
   - 선택된 메뉴, 수량, 옵션 정보를 클라이언트 상태로 관리

2. **주문 생성**
   - '주문하기' 버튼 클릭 시 주문 정보를 Orders 테이블에 저장
   - 주문 상세 항목들을 Order_Items 테이블에 저장
   - 주문 번호 자동 생성 (예: ORD-YYYYMMDD-XXX)

3. **재고 업데이트**
   - 주문 완료 시 해당 메뉴들의 재고 수량 차감
   - 재고 부족 시 주문 실패 처리

#### 12.2.3 주문 관리 흐름
1. **주문 현황 조회**
   - 관리자 화면에서 Orders 테이블의 모든 주문 조회
   - 주문 상태별 필터링 가능
   - 최신 주문부터 정렬

2. **주문 상태 변경**
   - '주문 접수' → '제조 중' → '완료' 순서로 상태 변경
   - 각 상태 변경 시 updated_at 필드 업데이트
   - 상태 변경 이력 로깅 (선택사항)

### 12.3 API 설계

#### 12.3.1 메뉴 관련 API

**GET /api/menus**
- 커피 메뉴 목록 조회
- 응답 예시:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노",
      "description": "진한 에스프레소에 물을 넣어 만든 커피",
      "price": 4000,
      "image_url": "/images/americano.jpg",
      "stock_quantity": 50,
      "category": "아메리카노",
      "is_available": true,
      "options": [
        {
          "id": 1,
          "name": "사이즈",
          "price_modifier": 0,
          "option_type": "size",
          "is_required": true
        }
      ]
    }
  ]
}
```

**GET /api/menus/{menu_id}**
- 특정 메뉴 상세 정보 조회

#### 12.3.2 주문 관련 API

**POST /api/orders**
- 새 주문 생성
- 요청 예시:
```json
{
  "customer_name": "홍길동",
  "customer_phone": "010-1234-5678",
  "special_requests": "얼음 적게",
  "items": [
    {
      "menu_id": 1,
      "quantity": 2,
      "selected_options": [
        {
          "option_id": 1,
          "value": "Large"
        }
      ]
    }
  ]
}
```

- 응답 예시:
```json
{
  "success": true,
  "data": {
    "order_id": 123,
    "order_number": "ORD-20241201-001",
    "total_amount": 8000,
    "status": "접수",
    "created_at": "2024-12-01T10:30:00Z"
  }
}
```

**GET /api/orders**
- 주문 목록 조회 (관리자용)
- 쿼리 파라미터: status, page, limit

**GET /api/orders/{order_id}**
- 특정 주문 상세 정보 조회
- 응답 예시:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "order_number": "ORD-20241201-001",
    "order_datetime": "2024-12-01T10:30:00Z",
    "total_amount": 8000,
    "status": "접수",
    "customer_name": "홍길동",
    "customer_phone": "010-1234-5678",
    "special_requests": "얼음 적게",
    "items": [
      {
        "id": 1,
        "menu_name": "아메리카노",
        "quantity": 2,
        "unit_price": 4000,
        "total_price": 8000,
        "selected_options": [
          {
            "option_name": "사이즈",
            "value": "Large"
          }
        ]
      }
    ]
  }
}
```

**PUT /api/orders/{order_id}/status**
- 주문 상태 변경
- 요청 예시:
```json
{
  "status": "제조중"
}
```

#### 12.3.3 재고 관리 API

**GET /api/menus/stock**
- 메뉴별 재고 현황 조회 (관리자용)

**PUT /api/menus/{menu_id}/stock**
- 특정 메뉴 재고 수량 수정 (관리자용)
- 요청 예시:
```json
{
  "stock_quantity": 100
}
```

### 12.4 데이터베이스 관계도

```
Menus (1) ←→ (N) Options
  ↓
  (N) Order_Items (N) ←→ (1) Orders
```

### 12.5 에러 처리

#### 12.5.1 공통 에러 응답 형식
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "잘못된 요청입니다.",
    "details": "필수 필드가 누락되었습니다."
  }
}
```

#### 12.5.2 주요 에러 코드
- `INVALID_REQUEST`: 잘못된 요청
- `MENU_NOT_FOUND`: 메뉴를 찾을 수 없음
- `INSUFFICIENT_STOCK`: 재고 부족
- `ORDER_NOT_FOUND`: 주문을 찾을 수 없음
- `INVALID_STATUS`: 잘못된 주문 상태
- `DATABASE_ERROR`: 데이터베이스 오류

### 12.6 보안 고려사항

#### 12.6.1 입력 검증
- 모든 입력 데이터 유효성 검사
- SQL Injection 방지
- XSS 공격 방지

#### 12.6.2 API 보안
- CORS 설정
- Rate Limiting 적용
- 관리자 API 접근 제한

---

*이 문서는 커피 주문 앱 개발을 위한 초기 PRD이며, 프로젝트 진행에 따라 지속적으로 업데이트될 예정입니다.*
