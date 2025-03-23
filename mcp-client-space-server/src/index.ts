import dotenv from "dotenv";

import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

dotenv.config();

interface Question {
  question: string;
  answer: string | null;
}

const server = new McpServer({
  name: "client-space-server",
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
  "create-ticket",
  "Create a ticket within client space for managers",
  {
    ticket_type: z.number(),
    questions: z.array(
      z.object({
        question: z.string(),
        answer: z.string()
      })
    ) },
  async ({ ticket_type, questions }) => {
    let currentQuestions = questions
    if (ticket_type == 1) {
      currentQuestions = currentQuestions || [
        {
          "question": "First question",
          "answer": ""
        },
        {
          "question": "Second question",
          "answer": ""
        },
        {
          "question": "Third question",
          "answer": ""
        },
        {
          "question": "Four question",
          "answer": ""
        },
      ]
    } else {
      currentQuestions = currentQuestions || [
        {
          "question": "First question type 2",
          "answer": ""
        },
        {
          "question": "Second question type 2",
          "answer": ""
        },
        {
          "question": "Third question type 2",
          "answer": ""
        },
        {
          "question": "Four question type 2",
          "answer": ""
        },
      ]
    }

    const state = eval_state(currentQuestions);
    return {
      content: [{
        type: "text",
        text: `Current state: ${state} for current questions ${currentQuestions}`,
        state: state,
        currentQuestions: currentQuestions }]
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