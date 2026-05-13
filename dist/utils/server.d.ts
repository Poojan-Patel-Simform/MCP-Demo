import type { Todo } from "../types/server.js";
export declare const createTodo: (todo: Omit<Todo, "id">) => Promise<Todo>;
export declare const getAllTodos: () => Promise<Todo[]>;
//# sourceMappingURL=server.d.ts.map