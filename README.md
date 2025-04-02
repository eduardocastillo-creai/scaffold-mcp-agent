# Project: Agent Orchestrator and MCP Servers Scaffold (MCP Connections)

This project is a scaffold for an agent orchestrator (using agent framework like Langgraph, CrewAI, OpenAI Agents) and an MCP (Message Communication Protocol) Server using (modelcontextprotocol). It comes with the necessary setup for integration with OpenAI llms, dockerized services, and communication via Server-Sent Events (SSE) for remote connections. You will need to set up environment variables and install several tools before running the project.

## Prerequisites

Before running the project, make sure you have the following tools installed:

- [**Docker**](https://docs.docker.com/engine/install/): A platform for developing, shipping, and running applications.
- [**Docker Compose**](https://docs.docker.com/compose/install/): A tool for defining and running multi-container Docker applications.
- **Make**: A build automation tool to help run commands in a consistent manner.
```bash
sudo apt install make
```
- **NVM**: Node Version Manager, used to install and manage multiple versions of Node.js.
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```
- **Node.js**: JavaScript runtime required for some services in this project.
```bash
nvm list
nvm install v20.19.0
nvm install v22.14.0
```
- **PYENV**: A tool for managing multiple versions of Python.
```bash
curl https://pyenv.run | bash
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```
- **Python**: Required for orchestrator functionality.
```bash
pyenv install 3.11.11
pyenv local 3.11.11
```

- [**ngrok**](https://ngrok.com/downloads/linux): Required for tunnel n8n to OAuth on salesforce
```bash
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
  && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list \
  && sudo apt update \
  && sudo apt install ngrok
``` 
And make an account for setup an authtoken within ngrok


Installation guides:

- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)
- [Make Installation Guide](https://www.gnu.org/software/make/)
- [NVM Installation Guide](https://github.com/nvm-sh/nvm)
- [Node.js Installation Guide](https://nodejs.org/)
- [Pyenv Installation Guide](https://github.com/pyenv/pyenv)
- [Python Installation Guide](https://www.python.org/downloads/)
- [Ngrok Installation Guide](https://dashboard.ngrok.com/get-started/setup/windows)

## Setup

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone git@github.com:eduardocastillo-creai/scaffold-mcp-agent.git
cd scaffold-mcp-agent
```

### 2. Enable ngrok to the port for n8n instance
This is required for OAuth callback (deafult port for n8n 5678)
```bash
ngrok http 5678
```

### 3. Set .env files for all folders

- langgraph-orchestrator/.env:
```bash
PORT=3000
OPENAI_API_KEY=
azureOpenAIApiKey=
azureOpenAIApiInstanceName=
azureOpenAIApiVersion=
azureOpenAIApiDeploymentName=
azureOpenAIEndpoint=
```

- crewai-orchestrator/.env:
```bash
PORT=8080
OPENAI_API_KEY=
```

- mcp-airbnb-server/.env:
```bash
PORT=3005
```

- mcp-airbnb-server/.env:
```bash
PORT=3005
```

- mcp-client-space-server/.env:
```bash
PORT=3001
```

- mcp-figma-server/.env:
```bash
PORT=3004
FIGMA_API_KEY=
```

- mcp-n8n-salesforce-server/.env:
```bash
PORT=3003
N8N_WEBHOOK_URI=https://<random-number>.ngrok-free.app/webhook/salesforce
```

- mcp-rag-server/.env:
```bash
PORT=3002
OPENAI_API_KEY=
```

### 4. Set OAuth callback on salesforce
This is a guide for set OAuth on n8n salesforce
[Guide for auth n8n salesforce](https://docs.n8n.io/integrations/builtin/credentials/salesforce/)

Ensure to use the same route for ngrok that link the callback and the n8n container.
Like this: `https://<random>.ngrok-free.app/rest/oauth2-credential/callback`

### 5. Run MCP Servers and Orchestrators using docker compose
```bash
docker-compose up -d
```

### 6. GET Request to orchestrator (agent) using query param
```bash
curl "http://0.0.0.0:3000/call-agent?query=Can%20you%20calculate%20my%20bmi,%2066kg%20and%20170cm"
```

## Docker-compose

For n8n image we need to pass ngrok tunnel on environment like this example:

```bash
  n8n-salesforce-server:
    image: docker.n8n.io/n8nio/n8n
    container_name: n8n-salesforce-server
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=489c-187-190-207-236.ngrok-free.app
      - N8N_PROTOCOL=https
      - N8N_PORT=5678
      - WEBHOOK_URI=https://489c-187-190-207-236.ngrok-free.app/webhook/salesforce
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - my-network
```

Or use Postman.