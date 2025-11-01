# 프런트엔드 서버 시작 스크립트
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting frontend server..." -ForegroundColor Green

Set-Location $PSScriptRoot

# .env 파일 확인 및 생성
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    "VITE_API_BASE_URL=http://localhost:3001/api" | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

# 프런트엔드 서버 실행
Write-Host "🌐 Frontend will run on http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 API Base URL: http://localhost:3001/api" -ForegroundColor Cyan
npm run dev

