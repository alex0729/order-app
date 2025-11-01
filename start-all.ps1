# 전체 서비스 실행 스크립트 (백엔드, 프론트엔드, DB)
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting all services..." -ForegroundColor Green
Write-Host ""

# 프로젝트 루트로 이동
Set-Location $PSScriptRoot

# PostgreSQL 연결 확인
Write-Host "🔍 Checking PostgreSQL connection..." -ForegroundColor Cyan
$dbPort = 5433  # .env 파일에 설정된 포트
$dbTest = Test-NetConnection -ComputerName localhost -Port $dbPort -InformationLevel Quiet -WarningAction SilentlyContinue

if ($dbTest) {
    Write-Host "✅ PostgreSQL is running on port $dbPort" -ForegroundColor Green
} else {
    Write-Host "⚠️  PostgreSQL might not be running on port $dbPort" -ForegroundColor Yellow
    Write-Host "   Please make sure PostgreSQL is running before starting the servers." -ForegroundColor Yellow
}

Write-Host ""

# 데이터베이스 확인
Write-Host "📊 Checking database..." -ForegroundColor Cyan
Set-Location server
node src/scripts/createDatabase.js
Set-Location ..

Write-Host ""

# 백엔드 서버 시작
Write-Host "🔧 Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { Set-Location '$PSScriptRoot\server'; & '.\start-server.ps1' }"
Start-Sleep -Seconds 2

Write-Host ""

# 프론트엔드 서버 시작
Write-Host "🎨 Starting frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { Set-Location '$PSScriptRoot\ui'; & '.\start-frontend.ps1' }"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ All services are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📍 API:      http://localhost:3001/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Please wait a few seconds for the servers to start..." -ForegroundColor Yellow

