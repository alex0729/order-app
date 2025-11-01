# API URL 수정 가이드 (긴급)

## 문제 상황
에러 메시지: "API URL: https://order-app-frontend-gcms.onrender.com/api"
- ❌ 프론트엔드 URL이 사용되고 있음
- ✅ 백엔드 URL을 사용해야 함

## 즉시 해결 방법

### 1단계: 백엔드 URL 확인

1. Render 대시보드 로그인
2. **백엔드 서비스(Web Service)** 선택
3. 서비스 이름: `order-app-backend` (또는 설정한 이름)
4. 대시보드 상단에서 **URL 확인**
   - 예: `https://order-app-backend-pcax.onrender.com`
   - 또는 `https://order-app-backend-xxxxx.onrender.com` 형태

### 2단계: 프론트엔드 환경 변수 수정

1. **프론트엔드 서비스(Static Site)** 선택
   - 서비스 이름: `order-app-frontend` (또는 설정한 이름)
2. **Environment** 탭 클릭
3. `VITE_API_BASE_URL` 환경 변수 찾기
4. **현재 값** (잘못됨):
   ```
   https://order-app-frontend-gcms.onrender.com/api
   ```
5. **올바른 값으로 수정**:
   ```
   https://order-app-backend-xxxxx.onrender.com/api
   ```
   ⚠️ `xxxxx`를 실제 백엔드 서비스 이름으로 변경
   ⚠️ URL 끝에 `/api` 포함 확인

### 3단계: 재배포 대기

1. 환경 변수 저장 후 자동 재배포 시작
2. **Events** 탭에서 배포 진행 상황 확인
3. 배포 완료까지 **2-3분** 대기

### 4단계: 확인

1. 배포 완료 후 프론트엔드 URL 접속
2. 브라우저 콘솔(F12)에서 확인:
   ```
   ✅ API Base URL: https://order-app-backend-xxxxx.onrender.com/api
   ```
3. 에러가 사라졌는지 확인

## 백엔드 URL을 모르는 경우

Render 대시보드에서:
1. **Services** 메뉴 클릭
2. **Web Service** 타입의 서비스 찾기 (백엔드)
3. 서비스 이름 클릭
4. 상단에 표시된 URL 복사
   - 형식: `https://xxxxx.onrender.com`
5. 끝에 `/api` 추가:
   - 최종: `https://xxxxx.onrender.com/api`

## 예시

**백엔드 서비스 URL:**
```
https://order-app-backend-pcax.onrender.com
```

**환경 변수 값:**
```
VITE_API_BASE_URL=https://order-app-backend-pcax.onrender.com/api
```

## 중요 사항

- ✅ 환경 변수 이름: `VITE_API_BASE_URL` (정확히 동일)
- ✅ 백엔드 URL 사용 (프론트엔드 URL 아님)
- ✅ HTTPS 사용
- ✅ URL 끝에 `/api` 포함
- ✅ 환경 변수 저장 후 재배포 완료 대기

