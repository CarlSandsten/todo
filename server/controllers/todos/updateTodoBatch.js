export const updateTodoBatch = (deps) => async (req, res) => {
  const { getData, writeData, findNode } = deps;
  const data = await getData(res);

  // Non-atomic process.
  for (const batchItem of req.body.data) {
    let [node] = findNode(batchItem.id, data);

    if (!node) {
      console.log("is this rendered");
      return res.sendStatus(404);
    }

    Object.keys(batchItem).forEach((key) => {
      if (key !== "id") {
        node[key] = batchItem[key];
      }
    });
  }

  await writeData(res, data);
};
