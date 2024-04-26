export const updateTodo = (deps) => async (req, res) => {
  const { getData, writeData, findNode } = deps;
  const data = await getData(res);
  let [node] = findNode(req.params.id, data);

  if (!node) {
    return res.sendStatus(404);
  }

  Object.keys(req.body).forEach((key) => {
    node[key] = req.body[key];
  });

  await writeData(res, data);
};
