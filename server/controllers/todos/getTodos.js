export const getTodos = (deps) => async (_, res) => {
  const { getData } = deps;
  return res.json(await getData(res));
};
