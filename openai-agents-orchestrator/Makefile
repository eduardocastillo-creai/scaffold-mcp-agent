PYTHON := python3.11
VENV := .venv
ACTIVATE := source $(VENV)/bin/activate
POETRY := poetry
DOCKER_IMAGE_NAME := crewai-orchestrator
DOCKER_CONTAINER_NAME := crewai-orchestrator-container
DOCKER_PORT := 8080

.DEFAULT_GOAL := help

run:
	@$(POETRY) run uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload

test:
	@$(POETRY) run pytest tests

install-poetry:
	@curl -sSL https://install.python-poetry.org | $(PYTHON) -
	@echo "Poetry installed successfully."
	@echo 'export PATH="$$HOME/.local/bin:$$PATH"' >> $$HOME/.zshrc
	@echo "Poetry path added to ~/.zshrc. Run 'source ~/.zshrc' to apply changes."

create-venv:
	@$(PYTHON) -m venv $(VENV)
	@echo "Virtual environment created at $(VENV)."
	@echo "Activate it using: source $(VENV)/bin/activate"
	@echo "Then run: poetry install to manage dependencies."

install: install-poetry
	@$(POETRY) install --no-root
	@echo "Dependencies installed."

add-dep:
	@[ -n "$(package)" ] || (echo "Error: Please specify a package (e.g., make add-dep package=<package_name>)" && exit 1)
	@$(POETRY) add $(package)

add-dev-dep:
	@[ -n "$(package)" ] || (echo "Error: Please specify a package (e.g., make add-dev-dep package=<package_name>)" && exit 1)
	@$(POETRY) add $(package) --group dev

add-test-dep:
	@[ -n "$(package)" ] || (echo "Error: Please specify a test package (e.g., make add-test-dep package=<package_name>)" && exit 1)
	@$(POETRY) add $(package) --group test

build:
	@$(POETRY) build

help:
	@echo "Usage:"
	@echo "  make install          Install Poetry and dependencies"
	@echo "  make create-venv      Create and activate a virtual environment"
	@echo "  make add-dep          Add a production dependency (e.g., make add-dep package=<package_name>)"
	@echo "  make add-dev-dep      Add a development dependency (e.g., make add-dev-dep package=<package_name>)"
	@echo "  make build            Build the project for distribution"


# Docker setup
.PHONY: docker-build docker-run docker-up docker-stop docker-remove docker-clean

docker-build:
	@echo "Building Docker image..."
	docker build -t $(DOCKER_IMAGE_NAME) .

docker-run:
	@echo "Running Docker container..."
	docker run --name $(DOCKER_CONTAINER_NAME) -p $(DOCKER_PORT):$(DOCKER_PORT) $(DOCKER_IMAGE_NAME)

docker-up:
	@echo "Starting Docker container using docker-compose..."
	docker-compose up --build

docker-stop:
	@echo "Stopping Docker container..."
	docker stop $(DOCKER_CONTAINER_NAME)

docker-remove:
	@echo "Removing Docker container..."
	docker rm $(DOCKER_CONTAINER_NAME)

docker-clean: docker-stop docker-remove
	@echo "Cleaning Docker container and image..."
	docker rmi $(DOCKER_IMAGE_NAME)