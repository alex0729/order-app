# Order App Backend Server

커피 주문 앱의 백엔드 서버입니다.

## 기술 스택

- **Framework**: Express.js
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **Tools**: 
  - nodemon (개발용)
  - morgan (로그)
  - cors (CORS 설정)
  - dotenv (환경 변수 관리)
  - pg (PostgreSQL 클라이언트)

## 설치 및 실행

### 1. 의존성 설치

```bash
cd server
npm install
```

### 2. 데이터베이스 설정

PostgreSQL이 설치되어 있어야 합니다. 데이터베이스를 생성하세요:

```bash
# PostgreSQL에 접속하여 데이터베이스 생성
psql -U postgres -c "CREATE DATABASE coffee_order_db;"

# 또는 스크립트를 사용하여 자동 생성
node src/scripts/createDatabase.js
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 필요한 환경 변수를 설정하세요.

```bash
cp .env.example .env
```

`.env` 파일에서 다음 값들을 실제 값으로 수정하세요:
- `DB_PASSWORD`: PostgreSQL 비밀번호
- `JWT_SECRET`: JWT 토큰 시크릿 키
- `SESSION_SECRET`: 세션 시크릿 키

### 4. 개발 서버 실행

```bash
npm run dev
```

서버는 `http://localhost:3000`에서 실행됩니다.

### 5. 프로덕션 빌드

```bash
npm start
```

## 프로젝트 구조

```
server/
├── src/
│   ├── index.js          # 메인 서버 파일
│   ├── config/           # 데이터베이스 설정
│   │   ├── database.js   # DB 연결 설정
│   │   ├── createTables.js # 테이블 생성 스크립트
│   │   └── initDb.js     # DB 초기화
│   ├── routes/           # 라우트 파일들
│   ├── controllers/      # 컨트롤러 파일들
│   ├── models/           # 데이터 모델
│   ├── middleware/       # 커스텀 미들웨어
│   ├── utils/            # 유틸리티 함수
│   └── scripts/          # 유틸리티 스크립트
│       ├── setup.js      # 설정 스크립트
│       └── createDatabase.js # DB 생성 스크립트
├── package.json
├── .env                  # 환경 변수 (gitignore에 포함)
├── .env.example          # 환경 변수 예시
├── .gitignore            # Git 제외 파일 목록
└── README.md
```

## API 엔드포인트

### Health Check
- `GET /health` - 서버 상태 확인

### 메뉴 관련
- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/:id` - 특정 메뉴 조회

### 주문 관련
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 특정 주문 조회
- `POST /api/orders` - 주문 생성
- `PUT /api/orders/:id/status` - 주문 상태 변경

## 개발 가이드

### 코드 스타일
- JavaScript ES6+ 사용
- Express.js 베스트 프랙티스 준수
- RESTful API 설계 원칙 따르기

### 환경 변수

- `PORT`: 서버 포트 (기본값: 3000)
- `NODE_ENV`: 실행 환경 (development/production)
- `DB_HOST`: 데이터베이스 호스트
- `DB_PORT`: 데이터베이스 포트
- `DB_NAME`: 데이터베이스 이름
- `DB_USER`: 데이터베이스 사용자
- `DB_PASSWORD`: 데이터베이스 비밀번호

## 라이센스

ISC

