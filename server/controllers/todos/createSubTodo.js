export const createSubTodo = (deps) => async (req, res) => {
  const { getData, writeData, findNode } = deps;
  const data = await getData(res);
  const [node] = findNode(req.params.id, data);

  if (!node) {
    return res.sendStatus(404);
  }

  if (node.subTodos.find((el) => el.id === req.body.id)) {
    return res.sendStatus(409);
  }

  node.subTodos.unshift({ ...req.body });

  await writeData(res, data);
};
