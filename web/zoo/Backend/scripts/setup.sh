#!/bin/bash

# Database Setup Script for Zoo Backend

echo "🚀 Setting up Zoo Backend Database..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create database if it doesn't exist
echo "📦 Creating database 'ctfdb' if it doesn't exist..."
createdb -h localhost -U postgres ctfdb 2>/dev/null || echo "Database 'ctfdb' already exists"

# Run database initialization
echo "🔄 Initializing database with tables and sample data..."
cd "$(dirname "$0")"
go run init-db.go

echo ""
echo "📊 Database Info:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: ctfdb"
echo "  User: postgres"
echo ""
echo "🚀 Ready to start the server with: go run cmd/server/main.go"
