# Render.com 배포 가이드

이 문서는 Order App을 Render.com에 배포하는 방법을 안내합니다.

## 배포 순서

### 1단계: PostgreSQL 데이터베이스 생성 (먼저 진행)

1. Render.com 대시보드에 로그인
2. "New +" 버튼 클릭 → "PostgreSQL" 선택
3. 데이터베이스 설정:
   - **Name**: `coffee-order-db` (또는 원하는 이름)
   - **Database**: `coffee_order_db`
   - **User**: `coffee_order_user` (자동 생성됨)
   - **Region**: 가장 가까운 리전 선택
   - **PostgreSQL Version**: 최신 버전 선택
   - **Plan**: Free tier 선택 (또는 필요에 따라 유료 플랜)
4. "Create Database" 클릭
5. **중요**: 데이터베이스가 생성되면 다음 정보를 복사해두세요:
   - **Internal Database URL** (백엔드 서버에서 사용)
   - **External Database URL** (로컬 개발 시 필요하면 사용)

### 2단계: 백엔드 서버 배포

1. Render.com 대시보드에서 "New +" 버튼 클릭 → "Web Service" 선택
2. GitHub 저장소 연결:
   - GitHub 계정 연결 (처음이면)
   - 저장소 선택: `order-app`
   - Branch: `main` (또는 사용하는 브랜치)
3. 서비스 설정:
   - **Name**: `order-app-backend` (또는 원하는 이름)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: `server` (또는 설정에 따라)
4. 환경 변수 설정 (Environment Variables):
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<PostgreSQL Internal Host>
   DB_PORT=5432
   DB_NAME=coffee_order_db
   DB_USER=<PostgreSQL User>
   DB_PASSWORD=<PostgreSQL Password>
   ```
   - PostgreSQL 정보는 1단계에서 생성한 데이터베이스의 "Connections" 탭에서 확인 가능
   - **Internal Database URL**을 파싱하여 각 값 추출
5. "Create Web Service" 클릭
6. 배포가 완료되면 백엔드 URL을 복사해두세요 (예: `https://order-app-backend.onrender.com`)

### 3단계: 프론트엔드 배포

1. Render.com 대시보드에서 "New +" 버튼 클릭 → "Static Site" 선택
   - **참고**: Vite 빌드 결과를 배포하므로 Static Site로 배포 가능
2. GitHub 저장소 연결:
   - 같은 저장소: `order-app`
   - Branch: `main`
3. 빌드 설정:
   - **Name**: `order-app-frontend`
   - **Build Command**: `cd ui && npm install && npm run build`
   - **Publish Directory**: `ui/dist`
4. 환경 변수 설정:
   ```
   VITE_API_BASE_URL=https://order-app-backend.onrender.com/api
   ```
   - 2단계에서 받은 백엔드 URL을 사용
5. "Create Static Site" 클릭

### 4단계: 데이터베이스 초기화

백엔드 서버가 배포되면 데이터베이스 초기화가 자동으로 실행됩니다. 
서버 로그에서 다음 메시지를 확인하세요:
- `✅ Database initialized successfully`
- `✅ Database connected`

만약 초기화가 실패하면, Render의 백엔드 서비스에 SSH로 접속하거나 
서버 로그를 확인하여 문제를 해결하세요.

## 환경 변수 체크리스트

### 백엔드 환경 변수
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000` (Render 기본 포트)
- [ ] `DB_HOST` (PostgreSQL Internal Host)
- [ ] `DB_PORT=5432`
- [ ] `DB_NAME=coffee_order_db`
- [ ] `DB_USER` (PostgreSQL 사용자)
- [ ] `DB_PASSWORD` (PostgreSQL 비밀번호)

### 프론트엔드 환경 변수
- [ ] `VITE_API_BASE_URL` (백엔드 API URL)

## 배포 후 확인 사항

1. **백엔드 Health Check**
   - `https://your-backend-url.onrender.com/health` 접속 확인
   - JSON 응답이 나와야 함

2. **프론트엔드 접속**
   - 프론트엔드 URL로 접속
   - 브라우저 개발자 도구에서 네트워크 탭 확인
   - API 호출이 정상적으로 작동하는지 확인

3. **데이터베이스 연결**
   - 백엔드 서비스의 로그에서 데이터베이스 연결 확인
   - 관리자 페이지에서 데이터가 표시되는지 확인

## 문제 해결

### 백엔드가 시작되지 않는 경우
- 환경 변수가 올바르게 설정되었는지 확인
- Build Command와 Start Command가 올바른지 확인
- 서버 로그에서 에러 메시지 확인

### 데이터베이스 연결 실패
- PostgreSQL의 Internal Database URL 사용 (External이 아님)
- 환경 변수의 값이 정확한지 확인 (특수문자 이스케이프 필요 시)
- PostgreSQL 서비스가 실행 중인지 확인

### 프론트엔드에서 API 호출 실패
- CORS 설정 확인 (백엔드의 cors 미들웨어)
- `VITE_API_BASE_URL` 환경 변수가 올바른지 확인
- 브라우저 콘솔에서 에러 메시지 확인

## 참고 사항

- Render의 Free tier는 15분간 요청이 없으면 서비스가 sleep 상태가 됩니다
- 첫 요청 시 깨우는데 몇 초가 걸릴 수 있습니다
- 프로덕션 환경에서는 유료 플랜 사용을 고려하세요

