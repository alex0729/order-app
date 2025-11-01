# 백엔드 서버 시작 스크립트
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting backend server..." -ForegroundColor Green

Set-Location $PSScriptRoot

# .env 파일에서 환경 변수 로드
$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "📋 Loading environment variables from .env file..." -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)\s*=\s*(.+)\s*$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # 따옴표 제거 (있는 경우)
            if ($value -match '^["''](.+)["'']$') {
                $value = $matches[1]
            }
            # 환경 변수가 이미 설정되어 있지 않을 때만 설정 (환경 변수가 우선)
            if (-not (Test-Path "env:$key")) {
                Set-Item -Path "env:$key" -Value $value
                Write-Host "  ✓ $key = $($value -replace '^(.*).{5}$', '$1*****')" -ForegroundColor Gray
            }
        }
    }
} else {
    Write-Host "⚠️  .env file not found. Using default values." -ForegroundColor Yellow
}

# 기본값 설정 (.env 파일이나 환경 변수에 없을 때만)
if (-not $env:PORT) { $env:PORT = "3001" }
if (-not $env:DB_HOST) { $env:DB_HOST = "localhost" }
if (-not $env:DB_PORT) { $env:DB_PORT = "5432" }
if (-not $env:DB_NAME) { $env:DB_NAME = "coffee_order_db" }
if (-not $env:DB_USER) { $env:DB_USER = "postgres" }

# 데이터베이스 연결 정보 출력
Write-Host ""
Write-Host "🔍 Database Configuration:" -ForegroundColor Cyan
Write-Host "  Host: $env:DB_HOST" -ForegroundColor Gray
Write-Host "  Port: $env:DB_PORT" -ForegroundColor Gray
Write-Host "  Database: $env:DB_NAME" -ForegroundColor Gray
Write-Host "  User: $env:DB_USER" -ForegroundColor Gray
Write-Host "  Password: $(if ($env:DB_PASSWORD) { '***' } else { '(not set)' })" -ForegroundColor Gray
Write-Host ""

# 서버 실행
Write-Host "📡 Server will run on http://localhost:$env:PORT" -ForegroundColor Cyan
Write-Host "🔗 API endpoint: http://localhost:$env:PORT/api" -ForegroundColor Cyan
Write-Host ""

node src/index.js

