import path from "path";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../db");
const todoFilePath = `${dbPath}/todos.json`;

export const todosService = () => {
  const getData = async (res) => {
    try {
      let data = await readFile(todoFilePath, "utf8");

      if (data === "") {
        data = "[]";
      }

      return JSON.parse(data);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  };

  const writeData = async (res, data) => {
    try {
      await writeFile(todoFilePath, JSON.stringify(data, null, 2));
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  };

  const findNode = (id, todos, parentNode, objDepth = []) => {
    let node;
    let parent = parentNode;
    let depth = objDepth;

    for (let i = 0; i < todos.length; i++) {
      if (node) break;

      if (todos[i].id === id) {
        node = todos[i];
        depth.push(i);
        break;
      }

      if (todos[i].subTodos.length) {
        depth.push(i);
        [node, parent, depth] = findNode(
          id,
          todos[i].subTodos,
          todos[i],
          depth
        );

        if (!node) {
          parent = undefined;
          depth.pop();
        }
      }
    }
    return [node, parent, depth];
  };

  return {
    getData,
    writeData,
    findNode,
  };
};
