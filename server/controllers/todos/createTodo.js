export const createTodo = (deps) => async (req, res) => {
  const { getData, writeData, findNode } = deps;
  const data = await getData(res);
  const [node] = findNode(req.body.id, data);

  if (node) {
    return res.sendStatus(409);
  }

  data.unshift({ ...req.body });

  await writeData(res, data);
};
