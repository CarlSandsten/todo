export const validationRules = {
  createTodo: [
    {
      paramType: "body",
      rules: {
        id: {
          type: "string",
          required: true,
        },
        title: {
          type: "string",
          required: true,
        },
        createdAt: {
          type: "string",
          required: true,
        },
        updatedAt: {
          type: "string",
          required: true,
        },
        prioritizedAt: {
          type: "string",
          required: true,
        },
        completed: {
          type: "boolean",
          required: true,
        },
        priority: {
          type: "boolean",
          required: true,
        },
        subTodos: {
          // JS is quirky. It's an array. But, for this exercise, this will do.
          type: "object",
          required: true,
        },
      },
    },
  ],
  createSubTodo: [
    {
      paramType: "query",
      rules: {
        id: {
          type: "string",
          required: true,
        },
      },
    },
    {
      paramType: "body",
      rules: {
        id: {
          type: "string",
          required: true,
        },
        title: {
          type: "string",
          required: true,
        },
        createdAt: {
          type: "string",
          required: true,
        },
        updatedAt: {
          type: "string",
          required: true,
        },
        prioritizedAt: {
          type: "string",
          required: true,
        },
        completed: {
          type: "boolean",
          required: true,
        },
        priority: {
          type: "boolean",
          required: true,
        },
        subTodos: {
          type: "object",
          required: true,
        },
      },
    },
  ],
  deleteTodo: [
    {
      paramType: "query",
      rules: {
        id: {
          type: "string",
          required: true,
        },
      },
    },
  ],
  patchTodo: [
    {
      paramType: "query",
      rules: {
        id: {
          type: "string",
          required: true,
        },
      },
    },
    {
      paramType: "body",
      rules: {
        title: {
          type: "string",
        },
        updatedAt: {
          type: "string",
          required: true,
        },
        prioritizedAt: {
          type: "string",
        },
        completed: {
          type: "boolean",
        },
        priority: {
          type: "boolean",
        },
      },
    },
  ],
  patchTodoBatch: [
    {
      paramType: "body",
      rules: {
        data: {
          type: "object",
        },
      },
    },
  ],
};
