// @ts-ignore
import dotenv from "dotenv";
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { AzureChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import express, { Request, Response } from 'express';
dotenv.config();
const client_space_server_connection = process.env.CLIENT_SPACE_SERVER_CONNECTION || "http://host.docker.internal:3001/sse";
const rag_server_connection = process.env.RAG_SERVER_CONNECTION || "http://host.docker.internal:3002/sse";
const n8n_salesforce_server_connection = process.env.N8N_SALESFORCE_SERVER_CONNECTION || "http://host.docker.internal:3003/sse";
const figma_server_connection = process.env.FIGMA_SERVER_CONNECTION || "http://host.docker.internal:3004/sse";
const airbnb_server_connection = process.env.AIRBNB_SERVER_CONNECTION || "http://host.docker.internal:3004/sse";
// MCP connection
const client = new MultiServerMCPClient();
await client.connectToServerViaSSE(
  'rag-server',
  rag_server_connection
);
await client.connectToServerViaSSE(
  'client-space-server',
  client_space_server_connection
);
await client.connectToServerViaSSE(
  'n8n-salesforce-server',
  n8n_salesforce_server_connection
);
await client.connectToServerViaSSE(
  'figma-server',
  figma_server_connection
);
await client.connectToServerViaSSE(
  'airbnb-server',
  airbnb_server_connection
);
const tools = client.getTools();
console.log(tools)
// Agent workflow
const model = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.azureOpenAIApiKey,
  azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
  azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
  azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
  azureOpenAIEndpoint: process.env.azureOpenAIEndpoint,
  model: "gpt-4o",
  temperature: 0,
});
const agent = createReactAgent({
  llm: model,
  tools,
});


// Logs, auth, 

// 



const app = express();
const port = process.env.PORT;
app.get('/call-agent', async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: "Missing or invalid 'query' parameter" });
  }
  
  try {
    // HITL STATES 

    const response = await agent.invoke({
      messages: [{ role: 'user', content: query }],
    });
    
    res.json({ message: response });
  } catch (error) {
    console.error("Error calling agent:", error);
    res.status(500).send('Error interacting with LangChain');
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});