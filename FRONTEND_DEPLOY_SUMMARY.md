# 프론트엔드 Render 배포 요약

## 코드 수정 사항 ✅

프론트엔드 코드는 **추가 수정이 필요하지 않습니다**. 이미 환경 변수를 사용하도록 설정되어 있습니다.

### 확인된 사항:
- ✅ `ui/src/utils/api.ts`에서 `import.meta.env.VITE_API_BASE_URL` 사용 중
- ✅ Vite 빌드 설정 완료
- ✅ 환경 변수 기본값 설정됨 (`http://localhost:3001/api`)

### 선택적 개선 사항:
- `ui/vite.config.ts`에 base 경로 설정 추가 (이미 반영됨)

## Render 배포 설정

### 1. Render 대시보드에서 Static Site 생성

1. **"New +" → "Static Site"** 클릭
2. **GitHub 저장소 연결**
   - Repository: `alex0729/order-app`
   - Branch: `main`

### 2. 빌드 설정 입력

#### **Name**
```
order-app-frontend
```

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

### 3. 환경 변수 설정 ⚠️ 중요!

**Environment Variables** 섹션에 추가:

```
VITE_API_BASE_URL=https://order-app-backend-pcax.onrender.com/api
```

**⚠️ 백엔드 URL을 실제 URL로 변경해야 합니다!**
- Render 백엔드 서비스 대시보드에서 실제 URL 확인
- 예: `https://order-app-backend-pcax.onrender.com` (실제 URL로 변경)
- 뒤에 `/api`를 붙여야 함

### 4. 배포 시작

"Create Static Site" 버튼 클릭

## 배포 후 확인

1. **프론트엔드 URL 확인**
   - Render 대시보드에서 프론트엔드 URL 확인
   - 예: `https://order-app-frontend.onrender.com`

2. **접속 테스트**
   - 프론트엔드 URL로 접속
   - 브라우저 개발자 도구 (F12) 열기
   - Network 탭에서 API 호출 확인
   - Console 탭에서 에러 확인

3. **API 연결 확인**
   - 메뉴가 로드되는지 확인
   - 주문 기능이 작동하는지 확인

## 문제 해결

### API 호출 실패
- **원인**: `VITE_API_BASE_URL` 환경 변수가 잘못되었거나 없음
- **해결**: Render 대시보드에서 환경 변수 확인 및 수정 후 재배포

### 빌드 실패
- **원인**: TypeScript 오류 또는 의존성 문제
- **해결**: 로컬에서 `cd ui && npm install && npm run build` 실행하여 확인

### CORS 에러
- **원인**: 백엔드 CORS 설정 문제 (하지만 현재는 모든 도메인 허용 중)
- **해결**: 백엔드 서버 로그 확인

## 체크리스트

배포 전:
- [ ] 백엔드 서버가 Render에 배포되어 있고 정상 작동 중
- [ ] 백엔드 API URL 확인 완료
- [ ] 로컬에서 `npm run build` 성공 확인

배포 시:
- [ ] Root Directory: `ui`
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`
- [ ] Environment Variable: `VITE_API_BASE_URL` 설정 (백엔드 URL)

배포 후:
- [ ] 프론트엔드 URL 접속 확인
- [ ] API 호출 정상 작동 확인
- [ ] 메뉴 목록 표시 확인
- [ ] 주문 기능 테스트

