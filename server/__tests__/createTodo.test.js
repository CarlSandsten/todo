import assert from "assert";
import { mock, describe, it } from "node:test";
import { createTodo } from "../controllers/todos/createTodo.js";
import { todosService } from "../services/index.js";
import fixture from "../__mocks__/fixture.js";

describe("createTodos", () => {
  const res = {
    json: (json) => json,
    sendStatus: (code) => code,
  };
  const req = {
    body: {
      id: "test-1",
      title: "test-title",
      completed: false,
      createdAt: "2024-04-25T07:05:20.725Z",
      updatedAt: "2024-04-25T07:05:20.725Z",
      priority: false,
      subTodos: [],
    },
  };
  const service = todosService();

  it("should use getData as a dependency", async () => {
    const getData = mock.fn(async () => {
      return fixture;
    });
    const writeData = async () => {
      return;
    };

    const handler = createTodo({
      getData,
      findNode: service.findNode,
      writeData,
    });
    await handler(req, res);

    assert.strictEqual(getData.mock.calls.length, 1);
    mock.reset();
  });

  it("should use writeData as a dependency", async () => {
    const getData = async () => {
      return fixture;
    };
    const writeData = mock.fn(async () => {
      return;
    });
    req.body.id = "test-2";

    const handler = createTodo({
      getData,
      findNode: service.findNode,
      writeData,
    });
    await handler(req, res);

    assert.strictEqual(writeData.mock.calls.length, 1);
    mock.reset();
  });

  it("should return a conflict code", async () => {
    const getData = async () => {
      return fixture;
    };
    const writeData = async () => {
      return;
    };
    req.body.id = "test-2"; // Trying to create a todo that was already added to the in-memoty fixture.

    const handler = createTodo({
      getData,
      findNode: service.findNode,
      writeData,
    });
    const response = await handler(req, res);

    assert.strictEqual(response, 409);
    mock.reset();
  });
});
