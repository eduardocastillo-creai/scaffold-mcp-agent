import os
import logging
from dotenv import load_dotenv
from crewai import Agent, Crew, Process
from crewai.project import CrewBase, agent
from mcp.client.sse import sse_client
import mcp.types as types

# Load environment variables
load_dotenv()

rag_server_connection = os.getenv("RAG_SERVER_CONNECTION", "http://host.docker.internal:3002/sse")
rag_n8n_salesforce_connection = os.getenv("N8N_SALESFORCE_SERVER_CONNECTION", "http://host.docker.internal:3003/sse")

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@CrewBase
class CrewaiOrchestrator:
    """CrewaiOrchestrator crew"""

    async def initialize_client(self, server_connection: str) -> list:
        """Initialize the adapter client and connect to the RAG server using SSE, retrieve tools"""
        tools = []
        try:
            async with sse_client(server_connection) as (read, write):
                # Send initialization request
                request = types.JSONRPCMessage(
                    method="initialize",  # The method for initialization
                    params={},  # Pass any required params here
                )
                await write.send(request.model_dump())  # Send initialization message

                # Read SSE stream for response
                async for message in read:
                    if isinstance(message, types.JSONRPCMessage):
                        if message.method == "tools_list":
                            tools = message.params["tools"]
                            logger.info(f"Tools received from server: {tools}")
                            break  # Assuming once we receive tools, we can stop listening
                    else:
                        logger.warning(f"Received unexpected message: {message}")
        except Exception as e:
            logger.error(f"Error initializing client: {e}")
            raise e
        return tools

    @agent
    def researcher(self) -> Agent:
        """Define the 'researcher' agent"""
        return Agent(config=self.agents_config['researcher'], verbose=True)

    @agent
    def reporting_analyst(self) -> Agent:
        """Define the 'reporting_analyst' agent"""
        return Agent(config=self.agents_config['reporting_analyst'], verbose=True)

    async def create_crew(self) -> Crew:
        """Creates the CrewaiOrchestrator crew"""
        try:
            # Get tools from the SSE server
            tools_from_client_one = await self.initialize_client(rag_server_connection)
            tools_from_client_two = await self.initialize_client(rag_n8n_salesforce_connection)

            # Define agents
            researcher_agent = self.researcher()
            reporting_analyst_agent = self.reporting_analyst()

            # Assign tools to agents
            researcher_agent.tools = [tools_from_client_one]
            reporting_analyst_agent.tools = [tools_from_client_two]

            # Define crew with agents and optional tasks (uncomment tasks if necessary)
            crew = Crew(
                agents=[researcher_agent, reporting_analyst_agent],
                process=Process.sequential,
                verbose=True,
            )

            logger.info("Crew created successfully.")
            return crew

        except Exception as e:
            logger.error(f"Error while creating crew: {e}")
            raise e
