NODE_VERSION := 22
DOCKER_IMAGE_NAME := mcp-rag-server
DOCKER_CONTAINER_NAME := mcp-rag-server-container
DOCKER_PORT := 3002

# Local setup
.PHONY: install install-dev start build test clean

install:
	@echo "Installing dependencies..."
	npm install

install-dev:
	@echo "Installing development dependencies..."
	npm install --only=development

build:
	@echo "Building TypeScript project..."
	npm run build

start:
	@echo "Starting the project locally..."
	npm run dev

test:
	@echo "Running tests..."
	npm run test

clean:
	@echo "Cleaning project..."
	rm -rf node_modules dist

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