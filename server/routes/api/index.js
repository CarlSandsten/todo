import { Router } from "express";
import todosRoutes from "./todos/todosRoutes.js";

const router = Router();

router.use("/todos", todosRoutes);

export default router;
