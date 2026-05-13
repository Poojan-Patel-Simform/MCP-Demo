import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";
import { createTodo, getAllTodos } from "./utils/server.js";

const server = new McpServer({
  name: "MCP Demo",
  version: "1.0.0",
});

server.registerTool(
  "create_todo",
  {
    description: "Create a new todo item",
    inputSchema: {
      title: z.string().describe("The title of the todo item"),
      description: z
        .string()
        .describe("A detailed description of the todo item"),
      completed: z
        .boolean()
        .describe("Whether the todo item is completed")
        .optional(),
    },
  },
  async ({ title, description, completed }) => {
    try {
      /**
       * Creates a new todo item with the provided details.
       *
       * @param title - The title of the todo item.
       * @param description - The description of the todo item.
       * @param completed - The completion status of the todo item. Defaults to `false` if not provided.
       * @returns A promise that resolves to the newly created {@link Todo} object.
       * @throws Will throw an error if the todo creation fails.
       */
      const todo = await createTodo({
        title,
        description,
        completed: completed ?? false,
      });

      return {
        content: [
          {
            type: "text",
            text: `Todo item created successfully with ID: ${todo.id}`,
          },
        ],
      };
    } catch {
      return {
        content: [
          {
            type: "text",
            text: "An error occurred while creating the todo item.",
          },
        ],
      };
    }
  },
);

server.registerResource(
  "todos",
  "todos:all",
  {
    description: "Get all todo items",
    title: "All Todos",
    mimeType: "application/json",
  },
  async (uri) => {
    try {
      const todos = await getAllTodos();

      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(todos),
            mimeType: "application/json",
          },
        ],
      };
    } catch {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({
              error: "An error occurred while fetching todos.",
            }),
            mimeType: "application/json",
          },
        ],
      };
    }
  },
);

server.registerResource(
  "todo_detail",
  new ResourceTemplate("todos://{todoId}", { list: undefined }),
  {
    description: "Get details of a specific todo item by ID",
    title: "Todo Detail",
    mimeType: "application/json",
  },
  async (uri, { todoId }) => {
    try {
      const todos = await getAllTodos();
      /**
       * Finds a todo item from the todos array that matches the given todoId.
       * @param todos - The array of todo items to search through.
       * @param todoId - The unique identifier of the todo item to find.
       * @returns The todo item that matches the given todoId, or `undefined` if not found.
       */
      const todo = todos.find((t) => t.id === todoId);

      if (!todo) {
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify({ error: "Todo item not found." }),
              mimeType: "application/json",
            },
          ],
        };
      }

      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(todo),
            mimeType: "application/json",
          },
        ],
      };
    } catch {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({
              error: "An error occurred while fetching the todo item.",
            }),
            mimeType: "application/json",
          },
        ],
      };
    }
  },
);

server.registerPrompt(
  "generate_fake_todo",
  {
    description: "Generate a fake todo item with random title and description",
    argsSchema: {
      title: z.string().describe("The title of the fake todo item"),
    },
  },
  async ({ title }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Generate a fake todo item with the title "${title}". The description should be a random sentence based on the title.`,
          },
        },
      ],
    };
  },
);

const startServer = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

startServer();
