import dotenv from "dotenv";

import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

dotenv.config();

const server = new McpServer({
  name: "rag-server",
  version: "1.0.0"
});

server.resource(
  "config",
  "config://app",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: "Rag configuration mcp server"
    }]
  })
);

server.tool(
  "calculate-bmi",
  "Calculate bmi using weight and height",
  {
    weightKg: z.number(),
    heightM: z.number()
  },
  async ({ weightKg, heightM }) => ({
    content: [{
      type: "text",
      text: String(weightKg / (heightM * heightM))
    }]
  })
);

server.tool(
  "fetch-weather",
  "Fetch and query weather",
  { city: z.string() },
  async ({ city }) => {
    const response = await fetch(`https://api.weather.com/${city}`);
    const data = await response.text();
    return {
      content: [{ type: "text", text: data }]
    };
  }
);

server.tool(
  "retrieve-data",
  "Retrieves data for client or personal data",
  { question: z.string() },
  async ({ question }) => {
    return {
      content: [{ type: "text", text: `For ${question} the answer is this ...` }]
    };
  }
);

const app = express();
let transport: SSEServerTransport | null = null;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("No active transport connection.");
  }
});

app.listen(process.env.PORT);