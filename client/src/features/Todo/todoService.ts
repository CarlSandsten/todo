import { isoDate } from "./helpers/isoDate";
import { TodoItemType, UpdateTodo } from "./types";

const ApiClient = async ({
  url,
  method,
  body,
  abortController,
}: {
  url: string;
  method?: string;
  body?: Record<string, unknown> | UpdateTodo | UpdateTodo[] | TodoItemType;
  abortController?: AbortController;
}) => {
  const response = await fetch(url, {
    signal: abortController?.signal,
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data;
  if (
    response.status === 204 ||
    response.status === 400 ||
    response.status === 404 ||
    response.status === 409
  ) {
    data = {
      code: response.status,
    };
  } else {
    data = await response.json();
  }

  return data;
};

/**
 * @Pattern
 *
 * Note that we aren't handling the errors here. We let the client component
 * handle the errors.
 */
export const todoService = () => {
  const todo = (title: string) => {
    const iso = isoDate();

    return {
      id: crypto.randomUUID(),
      title,
      createdAt: iso,
      updatedAt: iso,
      prioritizedAt: "",
      completed: false,
      priority: false,
      subTodos: [],
    };
  };

  const serviceCall = async (cb: () => Promise<Record<string, unknown>>) => {
    try {
      const data = await cb();

      if (data.code === 204) {
        return;
      }

      throw new Error(`Server responded with status code ${data.code}`);
    } catch (err) {
      console.error(err);
    }
  };

  const getTodos = () => {
    const abortController = new AbortController();
    return {
      abortController,
      fetch: () => ApiClient({ url: "/api/todos", abortController }),
    };
  };

  const createTodo = (todo: TodoItemType) => {
    return ApiClient({ url: "/api/todos", method: "POST", body: todo });
  };

  const createSubTodo = (todo: TodoItemType, parentId: string) => {
    return ApiClient({
      url: `/api/todos/${parentId}`,
      method: "POST",
      body: todo,
    });
  };

  const updateTodo = (todo: UpdateTodo, id: string) => {
    const iso = isoDate();
    todo.updatedAt = iso;

    return ApiClient({
      url: `/api/todos/${id}`,
      method: "PATCH",
      body: todo,
    });
  };

  const updateTodoBatch = (batch: UpdateTodo[]) => {
    const iso = isoDate();
    batch.forEach((todo) => {
      todo.updatedAt = iso;
    });

    return ApiClient({
      url: `/api/todos`,
      method: "PATCH",
      body: { data: batch },
    });
  };

  const deleteTodo = (id: string) => {
    return ApiClient({
      url: `/api/todos/${id}`,
      method: "DELETE",
    });
  };

  return {
    todo,
    serviceCall,
    getTodos,
    createTodo,
    createSubTodo,
    updateTodo,
    updateTodoBatch,
    deleteTodo,
  };
};
