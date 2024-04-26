import assert from "assert";
import { mock, describe, it } from "node:test";
import { getTodos } from "../controllers/todos/getTodos.js";
import fixture from "../__mocks__/fixture.js";

describe("getTodos", () => {
  const res = {
    json: (json) => json,
  };

  it("should use getData as a dependency", async () => {
    const getData = mock.fn(async () => {
      return fixture;
    });

    const handler = getTodos({ getData });
    await handler(undefined, res);

    assert.strictEqual(getData.mock.calls.length, 1);
    mock.reset();
  });

  it("should return a json fixture", async () => {
    const getData = mock.fn(async () => {
      return fixture;
    });

    const handler = getTodos({ getData });
    const output = await handler(undefined, res);

    assert.deepStrictEqual(output, fixture);
    mock.reset();
  });
});
