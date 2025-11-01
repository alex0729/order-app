# 프론트엔드 Render 배포 가이드

이 문서는 Order App 프론트엔드를 Render.com에 배포하는 방법을 안내합니다.

## 사전 준비사항

1. ✅ 백엔드 서버가 이미 Render에 배포되어 있어야 합니다
2. ✅ 백엔드 API URL을 확인해야 합니다 (예: `https://order-app-backend-pcax.onrender.com`)

## 코드 확인 사항

프론트엔드 코드는 이미 환경 변수를 사용하도록 설정되어 있습니다:

- `ui/src/utils/api.ts`에서 `import.meta.env.VITE_API_BASE_URL` 사용
- 기본값: `http://localhost:3001/api` (개발 환경)

## Render 배포 설정

### 1단계: Static Site 생성

1. Render.com 대시보드 로그인
2. "New +" 버튼 클릭 → **"Static Site"** 선택
3. GitHub 저장소 연결:
   - GitHub 계정 연결 (이미 연결되어 있으면 생략)
   - 저장소 선택: `order-app`
   - Branch: `main` (또는 사용하는 브랜치)

### 2단계: 빌드 설정

다음과 같이 입력하세요:

#### **Name**
```
order-app-frontend
```
(또는 원하는 이름)

#### **Root Directory**
```
ui
```

#### **Build Command**
```
npm install && npm run build
```

#### **Publish Directory**
```
dist
```

### 3단계: 환경 변수 설정

**Environment Variables** 섹션에서 다음 환경 변수를 추가하세요:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

**⚠️ 중요**: 
- `your-backend-url.onrender.com`을 실제 백엔드 서버 URL로 변경해야 합니다
- 예: `https://order-app-backend-pcax.onrender.com/api`
- 백엔드 서버의 Render 대시보드에서 URL을 확인할 수 있습니다

### 4단계: 배포

"Create Static Site" 버튼을 클릭하면 배포가 시작됩니다.

## 배포 후 확인

1. **프론트엔드 URL 확인**
   - Render 대시보드에서 프론트엔드 서비스 URL 확인
   - 예: `https://order-app-frontend.onrender.com`

2. **API 연결 테스트**
   - 프론트엔드 URL로 접속
   - 브라우저 개발자 도구 (F12) → Network 탭 확인
   - API 호출이 정상적으로 작동하는지 확인

3. **CORS 확인**
   - 백엔드 서버의 CORS 설정이 프론트엔드 도메인을 허용하는지 확인
   - 백엔드 `server/src/index.js`에서 `app.use(cors())` 설정 확인

## 문제 해결

### API 호출 실패 시

1. **환경 변수 확인**
   - Render 대시보드 → Environment Variables
   - `VITE_API_BASE_URL`이 올바른지 확인

2. **빌드 로그 확인**
   - Render 대시보드 → Logs 탭
   - 빌드 중 에러가 있는지 확인

3. **CORS 에러**
   - 백엔드 서버의 CORS 설정 확인
   - `app.use(cors())`가 모든 도메인을 허용하도록 설정되어 있는지 확인

### 빌드 실패 시

1. **의존성 확인**
   - `package.json`의 모든 의존성이 올바른지 확인
   - TypeScript 오류가 없는지 확인

2. **빌드 명령어 확인**
   - Build Command가 올바른지 확인
   - Root Directory가 `ui`인지 확인

## 참고 사항

- Render Free tier의 Static Site는 무료로 사용 가능합니다
- 환경 변수 변경 시 자동으로 재배포가 진행됩니다
- 첫 배포 후 빌드에 몇 분이 걸릴 수 있습니다

