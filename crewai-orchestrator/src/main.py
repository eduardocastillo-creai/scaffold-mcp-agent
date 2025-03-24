import warnings
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from crew import CrewaiOrchestrator

# Ignore specific warnings
warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# FastAPI app setup
app = FastAPI()

# Pydantic model for message request
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
        crew_instance = await CrewaiOrchestrator().create_crew()
        agent_response = await crew_instance.kickoff_async(inputs={"message": message})
        return {"response": agent_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")


# Function to run the crew asynchronously
async def run(inputs: dict = None):
    """
    Run the crew orchestrator asynchronously.
    """
    if inputs is None:
        inputs = {}

    try:
        # Instantiate and run the crew orchestrator asynchronously
        response = await CrewaiOrchestrator().crew().kickoff_async(inputs=inputs)
        return response
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
