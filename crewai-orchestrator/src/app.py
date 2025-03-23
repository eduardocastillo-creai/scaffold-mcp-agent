from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from main import run
from crewai_orchestrator.crew import CrewaiOrchestrator

app = FastAPI()

class MessageRequest(BaseModel):
    message: str

@app.post("/message")
async def process_message(request: MessageRequest):
    """
    This endpoint processes the message sent to the agent.
    The agent processes the message and returns a response.
    """
    message = request.message
    try:
        agent_response = run(inputs={"message": message, "topic": "AI LLMs", "current_year": "2025"})        
        return {"response": agent_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

