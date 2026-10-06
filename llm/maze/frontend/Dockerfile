# syntax=docker/dockerfile:1
#
# Build context is the maze root (llm/maze).
#
FROM node:22-alpine AS build
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM nginx:1.27-alpine

# The nginx image runs envsubst over /etc/nginx/templates/*.template at startup.
COPY frontend/templates /etc/nginx/templates
COPY --from=build /app/dist /usr/share/nginx/html

# Default upstream (overridden when using host networking).
ENV BACKEND_HOST=backend \
    BACKEND_PORT=8000

EXPOSE 80
