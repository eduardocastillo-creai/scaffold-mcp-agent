// @ts-ignore
import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from "dotenv";
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { AzureChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import express, { Request, Response } from 'express';
import { tool } from "@langchain/core/tools";
dotenv.config();
const client_space_server_connection = process.env.CLIENT_SPACE_SERVER_CONNECTION || "http://host.docker.internal:3001/sse";
// const rag_server_connection = process.env.RAG_SERVER_CONNECTION || "http://host.docker.internal:3002/sse";
// const n8n_salesforce_server_connection = process.env.N8N_SALESFORCE_SERVER_CONNECTION || "http://host.docker.internal:3003/sse";
// const figma_server_connection = process.env.FIGMA_SERVER_CONNECTION || "http://host.docker.internal:3004/sse";
// const airbnb_server_connection = process.env.AIRBNB_SERVER_CONNECTION || "http://host.docker.internal:3004/sse";
const mcp_salesforce_connection = process.env.MCP_SALESFORCE_CONNECTION || "http://host.docker.internal:3008/sse";
// MCP connection
const client = new MultiServerMCPClient();
// await client.connectToServerViaSSE(
//   'rag-server',
//   rag_server_connection
// );
await client.connectToServerViaSSE(
  'client-space-server',
  client_space_server_connection
);
// await client.connectToServerViaSSE(
//   'n8n-salesforce-server',
//   n8n_salesforce_server_connection
// );
// await client.connectToServerViaSSE(
//   'figma-server',
//   figma_server_connection
// );
// await client.connectToServerViaSSE(
//   'airbnb-server',
//   airbnb_server_connection
// );
await client.connectToServerViaSSE(
  'salesforce-server',
  mcp_salesforce_connection
);
const tools = client.getTools();

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
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws: any) => {
  console.log("🔗 WebSocket client connected");

  ws.on("message", async (message: any) => {
    try {
      const data = JSON.parse(message.toString());
      const query = data.query;

      if (!query || typeof query !== "string") {
        ws.send(JSON.stringify({ error: "Invalid 'query'" }));
        return;
      }

      const response = await agent.invoke({
        messages: [{ role: 'user', content: query }],
      });

      const toolMessages = response.messages.filter((message) => message.getType() === "tool")
        .map((message) => ({
            content: message.content,
            type: message.getType()
        }));
      // console.log(toolMessages)
      const finalResponse = toolMessages[toolMessages.length - 1];

      console.log(finalResponse)
      console.log("index - call-agent - OUT");

      ws.send(JSON.stringify({ message: finalResponse.content }));
    } catch (err) {
      console.error("WebSocket error:", err);
      ws.send(JSON.stringify({ error: "Error processing request" }));
    }
  });

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");
  });
});

// http

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

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`WebSocket running at ws://localhost:${port}/ws`);
});