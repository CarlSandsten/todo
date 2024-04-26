export enum TodoAction {
  ADD = "add",
  CANCEL = "cancel",
  DONE = "done",
  EDIT = "edit",
  MOVE = "move",
  REMOVE = "remove",
  PRIORITY = "priority",
  LOW_PRIORITY = "lowPriority",
  SAVE = "save",
}

export type TodoItemType = {
  id: string;
  title: string;
  completed: boolean;
  priority: boolean;
  createdAt: string;
  updatedAt: string;
  prioritizedAt: string;
  subTodos: TodoItemType[] | [];
};

export interface ReCaster {
  [key: string]: unknown;
}

export interface UpdateTodo {
  id?: string;
  title?: string;
  updatedAt?: string;
  prioritizedAt?: string;
  completed?: boolean;
  priority?: boolean;
}
