# Render.com Environment Setup Script (PowerShell)
# Run this script to generate the environment variables for your Render.com deployment

Write-Host "=== Render.com Cookie Fix Environment Setup ===" -ForegroundColor Green
Write-Host ""

$Domain = Read-Host "Enter your custom domain (e.g., myapp.com or myapp.render.com)"

if ([string]::IsNullOrWhiteSpace($Domain)) {
    Write-Host "Error: Domain is required" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Environment Variables for Render.com ===" -ForegroundColor Yellow
Write-Host "Copy these to your Render.com service environment variables:" -ForegroundColor Yellow
Write-Host ""
Write-Host "ENVIRONMENT=production"
Write-Host "RENDER=true"
Write-Host "DOMAIN=$Domain"
Write-Host "COOKIE_DOMAIN=$Domain"
Write-Host "FRONTEND_URL=https://$Domain"
Write-Host ""
Write-Host "=== Additional Database Variables (if needed) ===" -ForegroundColor Yellow
Write-Host "DB_HOST=your-db-host"
Write-Host "DB_USER=your-db-user"
Write-Host "DB_PASSWORD=your-db-password"
Write-Host "DB_NAME=your-db-name"
Write-Host "DB_PORT=5432"
Write-Host "SSLMODE=require"
Write-Host ""
Write-Host "✅ Copy these variables to your Render.com dashboard!" -ForegroundColor Green
