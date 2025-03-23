import dotenv from "dotenv";

import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

dotenv.config();
const n8n_webhook_uri = process.env.N8N_WEBHOOK_URI!;

const server = new McpServer({
  name: "n8n-salesforce-server",
  version: "0.1.0"
});

server.resource(
  "config",
  "config://app",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: "Client space configuration mcp server"
    }]
  })
);

server.tool(
  "call-n8n-salesforce-workflow",
  "Workflow on salesforce to create users",
  {
    name: z.string(),
    lastName: z.string(),
    company: z.string()
  },
  async ({ name, lastName, company }: { name: string; lastName: string; company: string }) => {
    const response = await fetch(n8n_webhook_uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        lastName: lastName,
        company: company
      })
    });
    return {
      content: [{
        type: "text",
        text: `${response}`,
      }]
    };
  }
);

const eval_state = (questions: { question: string; answer: string }[]) => {
  for (const item of questions) {
    if (!item.answer || item.answer.trim() === "") {
      return "pending";
    }
  }
  return "complete";
};

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