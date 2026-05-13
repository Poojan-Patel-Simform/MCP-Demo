import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import Groq from "groq-sdk";
import { input } from "@inquirer/prompts";
import "dotenv/config";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const transport = new StdioClientTransport({
  command: "tsx",
  args: ["src/server.ts"],
});

const client = new Client({ name: "mcp-client", version: "1.0.0" });
await client.connect(transport);

const { tools } = await client.listTools();

const groqTools = tools.map((tool) => ({
  type: "function" as const,
  function: {
    name: tool.name,
    description: tool.description ?? "",
    parameters: tool.inputSchema as unknown as Record<string, unknown>,
  },
}));

const messages: Groq.Chat.ChatCompletionMessageParam[] = [];

console.log('MCP Client ready. Type "exit" to quit.\n');

while (true) {
  const userInput = await input({ message: "You" });
  if (userInput.toLowerCase() === "exit") break;

  messages.push({ role: "user", content: userInput });

  let response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    tools: groqTools,
  });

  let message = response.choices[0]?.message;
  if (!message) continue;

  let iterations = 0;
  const MAX_ITERATIONS = 1;
  while (message.tool_calls?.length && iterations < MAX_ITERATIONS) {
    iterations++;
    messages.push({
      role: "assistant",
      content: message.content ?? null,
      tool_calls: message.tool_calls,
    });

    for (const toolCall of message.tool_calls) {
      const result = await client.callTool({
        name: toolCall.function.name,
        arguments: JSON.parse(toolCall.function.arguments) as Record<
          string,
          unknown
        >,
      });

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result.content),
      });
    }

    response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      tools: groqTools,
    });

    message = response.choices[0]?.message;
    if (!message || response.choices[0]?.finish_reason === "stop") break;
  }

  if (message?.content) {
    messages.push({ role: "assistant", content: message.content });
    console.log(`\nAssistant: ${message.content}\n`);
  }
}

await client.close();
