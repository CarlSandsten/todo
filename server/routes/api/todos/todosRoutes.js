import { Router } from "express";
import { appController } from "../../../controllers/index.js";
import { validateParams } from "../../../middlewares/index.js";
import { validationRules } from "./validationRules.js";
const router = Router();

const { todoController } = appController();

router.get("/", todoController.getTodos);

router.post(
  "/",
  validateParams(validationRules.createTodo),
  todoController.createTodo
);

router.post(
  "/:id",
  validateParams(validationRules.createSubTodo),
  todoController.createSubTodo
);

router.patch(
  "/",
  validateParams(validationRules.patchTodoBatch),
  todoController.updateTodoBatch
);

router.patch(
  "/:id",
  validateParams(validationRules.patchTodo),
  todoController.updateTodo
);

router.delete(
  "/:id",
  validateParams(validationRules.deleteTodo),
  todoController.deleteTodo
);

export default router;
