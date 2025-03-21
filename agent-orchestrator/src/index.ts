// @ts-ignore
import dotenv from "dotenv";

import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import express, { Request, Response } from 'express';

dotenv.config();
const rag_server_connection = process.env.RAG_SERVER_CONNECTION || "http://host.docker.internal:3002/sse";
console.log(rag_server_connection)

// MCP connection
const client = new MultiServerMCPClient();
await client.connectToServerViaSSE(
  'rag-server',
  rag_server_connection
);
const tools = client.getTools();

console.log(tools)

// Agent workflow
const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY
});

const agent = createReactAgent({
  llm: model,
  tools,
});

const app = express();
const port = process.env.PORT;

app.get('/call-agent', async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: "Missing or invalid 'query' parameter" });
  }
  
  try {
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
