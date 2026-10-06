SHELL := /bin/bash
COMPOSE := docker compose -f deploy/docker-compose.yml --env-file .env

.PHONY: help model-download up down logs ps build test lint clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

model-download: ## Download the GGUF model into model/artifacts/ (never committed)
	bash model/download-model.sh

up: ## Build and start the whole stack
	$(COMPOSE) up --build -d
	@echo "→ Maze is up: http://localhost:$${FRONTEND_PORT:-3000}"

down: ## Stop the stack
	$(COMPOSE) down

logs: ## Tail logs from all services
	$(COMPOSE) logs -f

ps: ## Show running services
	$(COMPOSE) ps

build: ## Build all images
	$(COMPOSE) build

test: ## Run backend unit tests (in a container)
	$(COMPOSE) run --rm --no-deps --entrypoint pytest backend -q

lint: ## Lint the backend
	$(COMPOSE) run --rm --no-deps --entrypoint "ruff check ." backend

clean: ## Stop the stack and remove volumes
	$(COMPOSE) down -v
