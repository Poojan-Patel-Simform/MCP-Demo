# MCP-Demo

A demonstration project implementing the **Model Context Protocol (MCP)** with a Todo management system. It features an MCP server exposing tools, resources, and prompts, and an AI-powered client using Groq (LLaMA 3.3) to interact with the server via natural language.

---

## Features

### MCP Server

- **Tool** — `create_todo`: Creates a new todo item (title, description, completed status) and persists it to a JSON file.
- **Resource** — `todos:all`: Returns all todo items as JSON.
- **Resource** — `todos://{todoId}`: Returns a specific todo item by ID.
- **Prompt** — `generate_fake_todo`: Generates a prompt to create a fake todo item with a random description based on a given title.

### MCP Client

- Interactive CLI chat loop powered by **Groq** (model: `llama-3.3-70b-versatile`).
- Automatically discovers and calls MCP tools based on user input.
- Maintains conversation history for multi-turn interactions.

---

## Project Structure

```
.
├── src/
│   ├── server.ts          # MCP server — tools, resources, prompts
│   ├── client.ts          # MCP client — Groq-powered CLI chat
│   ├── data/
│   │   └── todos.json     # Persistent todo storage
│   ├── types/
│   │   └── server.ts      # Todo type definition
│   └── utils/
│       └── server.ts      # File I/O utilities (createTodo, getAllTodos)
├── package.json
└── tsconfig.json
```

---

## Prerequisites

- **Node.js** v18+
- A **Groq API key** — get one at [console.groq.com](https://console.groq.com)

---

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Poojan-Patel-Simform/MCP-Demo.git
   cd MCP-Demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

---

## Usage

### Run the server (development)

```bash
npm run server:dev
```

### Run the client (interactive chat)

```bash
npm run client:dev
```

Type messages in natural language to interact with the todo system. Type `exit` to quit.

### Build for production

```bash
npm run build
npm run server:start
```

### Inspect the server with MCP Inspector

```bash
npm run server:inspect
```

Opens the MCP Inspector UI to explore tools, resources, and prompts interactively.

---

## Scripts

| Script                   | Description                                       |
| ------------------------ | ------------------------------------------------- |
| `npm run server:dev`     | Start the MCP server with `tsx` (no build needed) |
| `npm run server:start`   | Start the compiled server from `dist/`            |
| `npm run build`          | Compile TypeScript to `dist/`                     |
| `npm run server:inspect` | Launch MCP Inspector against the dev server       |
| `npm run client:dev`     | Start the interactive AI client                   |

---

## Tech Stack

- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk) — MCP server & client
- [Groq SDK](https://github.com/groq/groq-typescript) — LLM inference (LLaMA 3.3 70B)
- [Zod](https://zod.dev) — Schema validation for tool inputs
- [uuid](https://github.com/uuidjs/uuid) — Unique ID generation
- [@inquirer/prompts](https://github.com/SBoudrias/Inquirer.js) — Interactive CLI prompts
- [TypeScript](https://www.typescriptlang.org) + [tsx](https://github.com/privatenumber/tsx) — Development runtime

---

## License

ISC
