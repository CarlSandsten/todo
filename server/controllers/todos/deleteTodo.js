export const deleteTodo = (deps) => async (req, res) => {
  const { getData, writeData, findNode } = deps;
  const data = await getData(res);
  const [node, parent, depth] = findNode(req.params.id, data);

  if (!node) {
    return res.sendStatus(404);
  }

  if (!parent) {
    data.splice(depth[0], 1);
  } else {
    parent.subTodos.splice(depth[depth.length - 1], 1);
  }

  await writeData(res, data);
};
