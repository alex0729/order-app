# 백엔드 서버 시작 스크립트
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting backend server..." -ForegroundColor Green

Set-Location $PSScriptRoot

# 환경 변수 설정
$env:PORT = "3001"
if (-not $env:DB_PASSWORD) {
    Write-Host "⚠️  DB_PASSWORD 환경 변수가 설정되지 않았습니다." -ForegroundColor Yellow
    Write-Host "   서버는 시작되지만 데이터베이스 연결이 실패할 수 있습니다." -ForegroundColor Yellow
}

# 서버 실행
Write-Host "📡 Server will run on http://localhost:3001" -ForegroundColor Cyan
node src/index.js

