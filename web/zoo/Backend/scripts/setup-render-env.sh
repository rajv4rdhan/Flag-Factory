#!/bin/bash

# Render.com Environment Setup Script
# Run this script to generate the environment variables for your Render.com deployment

echo "=== Render.com Cookie Fix Environment Setup ==="
echo ""

read -p "Enter your custom domain (e.g., myapp.com or myapp.render.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "Error: Domain is required"
    exit 1
fi

echo ""
echo "=== Environment Variables for Render.com ==="
echo "Copy these to your Render.com service environment variables:"
echo ""
echo "ENVIRONMENT=production"
echo "RENDER=true"
echo "DOMAIN=$DOMAIN"
echo "COOKIE_DOMAIN=$DOMAIN"
echo "FRONTEND_URL=https://$DOMAIN"
echo ""
echo "=== Additional Database Variables (if needed) ==="
echo "DB_HOST=your-db-host"
echo "DB_USER=your-db-user"
echo "DB_PASSWORD=your-db-password"
echo "DB_NAME=your-db-name"
echo "DB_PORT=5432"
echo "SSLMODE=require"
echo ""
echo "✅ Copy these variables to your Render.com dashboard!"
