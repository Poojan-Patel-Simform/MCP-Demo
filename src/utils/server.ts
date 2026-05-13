import { v4 as uuid } from "uuid";
import type { Todo } from "../types/server.js";
import fs from "node:fs";

export const createTodo = async (todo: Omit<Todo, "id">) => {
  const newTodo: Todo = {
    id: uuid(),
    ...todo,
  };

  const todos = JSON.parse(fs.readFileSync("src/data/todos.json", "utf-8"));
  todos.push(newTodo);
  fs.writeFileSync("src/data/todos.json", JSON.stringify(todos, null, 2));

  return newTodo;
};

export const getAllTodos = async (): Promise<Todo[]> => {
  const todos = JSON.parse(fs.readFileSync("src/data/todos.json", "utf-8"));
  return todos;
};
