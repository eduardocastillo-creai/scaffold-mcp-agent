import sys
import warnings

from datetime import datetime

from crew import CrewaiOrchestrator

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run(inputs: dict = None):
    """
    Run the crew.
    """
    if inputs is None:
        inputs = {}

    try:
        CrewaiOrchestrator().crew().kickoff(inputs=inputs)
        return "Crew run successfully."
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
