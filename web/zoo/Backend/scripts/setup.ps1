# Database Setup Script for Zoo Backend (PowerShell)

Write-Host "🚀 Setting up Zoo Backend Database..." -ForegroundColor Green

# Check if PostgreSQL is running
try {
    $null = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet
    Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL is not running. Please start PostgreSQL first." -ForegroundColor Red
    exit 1
}

# Create database if it doesn't exist
Write-Host "📦 Creating database 'ctfdb' if it doesn't exist..." -ForegroundColor Yellow
try {
    & createdb -h localhost -U postgres ctfdb 2>$null
} catch {
    Write-Host "Database 'ctfdb' already exists" -ForegroundColor Yellow
}

# Run database initialization
Write-Host "🔄 Initializing database with tables and sample data..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
& go run init-db.go

Write-Host ""
Write-Host "📊 Database Info:" -ForegroundColor Cyan
Write-Host "  Host: localhost"
Write-Host "  Port: 5432"
Write-Host "  Database: ctfdb"
Write-Host "  User: postgres"
Write-Host ""
Write-Host "🚀 Ready to start the server with: go run cmd/server/main.go" -ForegroundColor Green
