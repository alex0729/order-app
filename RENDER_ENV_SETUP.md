# Render 환경 변수 설정 가이드

## 문제 상황
모바일 웹에서 "Load failed api url 설정되지 않음" 에러가 발생하는 경우

## 원인
Render의 Static Site는 **빌드 시점**에 환경 변수를 주입합니다.
환경 변수가 제대로 설정되지 않았거나 빌드가 환경 변수를 포함하지 않으면 프로덕션 빌드에서 환경 변수가 없습니다.

## 해결 방법

### 1단계: Render 대시보드에서 환경 변수 확인

1. Render 대시보드 로그인
2. 프론트엔드 서비스(Static Site) 선택
3. **Environment** 탭 클릭
4. `VITE_API_BASE_URL` 환경 변수가 있는지 확인

### 2단계: 환경 변수 추가/수정

**환경 변수 이름:**
```
VITE_API_BASE_URL
```

**환경 변수 값:**
```
https://your-backend-url.onrender.com/api
```

**⚠️ 중요 사항:**
- `your-backend-url.onrender.com`을 실제 백엔드 URL로 변경
- URL 끝에 `/api` 포함
- **HTTPS** 사용 (HTTP가 아닌 HTTPS)
- 예: `https://order-app-backend-pcax.onrender.com/api`

### 3단계: 환경 변수 추가 후 재배포

환경 변수를 추가하거나 수정하면 Render가 자동으로 재배포를 시작합니다.

**재배포 확인:**
- Render 대시보드 → **Events** 탭에서 배포 진행 상황 확인
- 배포가 완료될 때까지 기다리기 (보통 2-3분)

### 4단계: 빌드 로그 확인

배포 후 **Logs** 탭에서 빌드 로그를 확인하세요:

**확인할 내용:**
```
==> Running build command 'npm install && npm run build'...
```

빌드가 성공했는지 확인합니다.

### 5단계: 모바일에서 테스트

1. 모바일 브라우저에서 프론트엔드 URL 접속
2. 브라우저 개발자 도구 열기 (Chrome에서 원격 디버깅)
3. **Console** 탭에서 다음 로그 확인:
   ```
   🔍 환경 변수 확인: { VITE_API_BASE_URL: "...", ... }
   ```

**예상되는 로그:**
- ✅ 정상: `✅ API Base URL: https://...`
- ❌ 문제: `❌ VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다.`

## 문제 해결 체크리스트

- [ ] Render 대시보드에서 `VITE_API_BASE_URL` 환경 변수 확인
- [ ] 환경 변수 값이 올바른지 확인 (HTTPS, `/api` 포함)
- [ ] 환경 변수 추가/수정 후 재배포 완료 대기
- [ ] 모바일 브라우저 콘솔에서 환경 변수 로그 확인
- [ ] 백엔드 URL이 정상 작동하는지 확인 (PC에서 테스트)

## 추가 디버깅

모바일에서도 콘솔을 확인하려면:
1. **Chrome 원격 디버깅** 사용
2. 또는 **Safari Web Inspector** (iOS)
3. 또는 모바일 브라우저의 개발자 모드 활성화

## 일반적인 실수

1. ❌ 환경 변수 이름이 `VITE_`로 시작하지 않음
   - 올바름: `VITE_API_BASE_URL`
   - 잘못됨: `API_BASE_URL`

2. ❌ HTTP를 사용 (HTTPS 필요)
   - 올바름: `https://...`
   - 잘못됨: `http://...`

3. ❌ `/api` 경로 누락
   - 올바름: `https://backend.onrender.com/api`
   - 잘못됨: `https://backend.onrender.com`

4. ❌ 환경 변수 추가 후 재배포를 기다리지 않음
   - 환경 변수 변경 시 자동 재배포가 필요합니다

