# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY Frontend/package*.json ./
COPY Frontend/yarn.lock* ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

COPY Frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Build Backend
FROM golang:1.23.4-alpine AS backend-builder

WORKDIR /app/backend

# Install git and ca-certificates
RUN apk add --no-cache git ca-certificates

# Copy go mod files
COPY Backend/go.mod Backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy backend source
COPY Backend/ ./

# Copy built frontend to backend public directory
COPY --from=frontend-builder /app/frontend/dist ./public

# Build the Go binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# Stage 3: Production image
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy binary and static files
COPY --from=backend-builder /app/backend/main ./
COPY --from=backend-builder /app/backend/public ./public
COPY --from=backend-builder /app/backend/ctf_files ./ctf_files

# Set environment variables
ENV GIN_MODE=release

EXPOSE 8080

CMD ["./main"]