import { todoController } from "./todos/todoController.js";
import { todosService } from "../services/index.js";

export const appController = () => ({
  todoController: todoController(todosService()),
});
