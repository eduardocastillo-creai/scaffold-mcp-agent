from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from agents import Agent, Runner
from mcp_agent.app import MCPApp
from mcp_agent.workflows.llm.augmented_llm_openai import OpenAIAugmentedLLM
from mcp_agent.mcp.gen_client import connect, disconnect

agentic_app = MCPApp(name="openai-orchestrator")

# MCP Servers
fetch_client = None
try:
    fetch_client = connect("fetch")
    result = await fetch_client.list_tools()
finally:
     disconnect("fetch")

app = FastAPI()

class MessageRequest(BaseModel):
    message: str

@app.post("/message")
async def process_message(request: MessageRequest):
    """
    This endpoint processes the message sent to the agent.
    The agent processes the message and returns a response.
    """
    async with agentic_app.run() as mcp_agent_app:
        logger = mcp_agent_app.logger

    message = request.message
    try:
        agent = Agent(name="Assistant", instructions="You are a helpful assistant")
        result = Runner.run_sync(agent, "Write a haiku about recursion in programming.")
        print(result.final_output)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")