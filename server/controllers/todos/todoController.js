// Controllers
import { createSubTodo } from "./createSubTodo.js";
import { createTodo } from "./createTodo.js";
import { deleteTodo } from "./deleteTodo.js";
import { getTodos } from "./getTodos.js";
import { updateTodo } from "./updateTodo.js";
import { updateTodoBatch } from "./updateTodoBatch.js";

/**
 * @Factory
 *
 * Factory function that returns all the expressjs router controllers.
 *
 * We are using Dependency Injection to simplify testing and make the controllers open
 * for external change.
 */
export const todoController = (deps) => ({
  createSubTodo: createSubTodo(deps),
  createTodo: createTodo(deps),
  deleteTodo: deleteTodo(deps),
  getTodos: getTodos(deps),
  updateTodo: updateTodo(deps),
  updateTodoBatch: updateTodoBatch(deps),
});
