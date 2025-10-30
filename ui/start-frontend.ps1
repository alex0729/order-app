# 프런트엔드 서버 시작 스크립트
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting frontend server..." -ForegroundColor Green

Set-Location $PSScriptRoot

# 프런트엔드 서버 실행
Write-Host "🌐 Frontend will run on http://localhost:3000" -ForegroundColor Cyan
npm run dev

