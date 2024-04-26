import { useState, useEffect, useCallback, useMemo } from "react";
import { Heading, SubHeading } from "../../components";
import { TodoItem } from "./TodoItem";
import { TodoSubmitForm } from "./TodoSubmitForm";
import { TodoList } from "./TodoList";
import { TodoCard } from "./TodoCard";
import { todoService } from "./todoService";
import { TodoItemType, ReCaster, TodoAction, UpdateTodo } from "./types";
import { isoDate, todoDateSort, uid } from "./helpers";

const service = todoService();
export const Todo = () => {
  const [dirty, setDirty] = useState<string>();
  const [todos, setTodos] = useState<TodoItemType[] | []>([]);
  const [submitFormValue, setSubmitFormValue] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [editId, setEditId] = useState<string | undefined>();
  const [editValue, setEditValue] = useState("");
  const [editDisabled, setEditDisabled] = useState(false);
  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed),
    [todos]
  );
  const readyTodos = useMemo(
    () => todoDateSort(todos.filter((todo) => !todo.completed)),
    [todos]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitFormValue(e.target.value);
    setDisabled(!(e.target.value.length > 1 && e.target.value.length < 31));
  }, []);

  const handleAddTodo = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | React.SyntheticEvent<EventTarget>,
      parentId?: string
    ) => {
      e.preventDefault();
      const val = submitFormValue;
      const newTodo = service.todo(val);

      setTodos((todos) => {
        const traverseRecursively = (todos: TodoItemType[]) =>
          todos.map((todo) => {
            if (parentId) {
              if (todo.id === parentId) {
                todo.subTodos = [{ ...newTodo }, ...todo.subTodos];
                return todo;
              }

              if (todo.subTodos.length > 0) {
                todo.subTodos = traverseRecursively(todo.subTodos || []);
              }
            }
            return todo;
          });
        setSubmitFormValue("");
        setDisabled(true);
        return parentId
          ? traverseRecursively(todos)
          : [{ ...newTodo }, ...todos];
      });

      await service.serviceCall(async () =>
        parentId
          ? await service.createSubTodo(newTodo, parentId)
          : await service.createTodo(newTodo)
      );
    },
    [submitFormValue]
  );

  const handleEditForm = (id: string, title: string) => {
    setEditId(id);
    setEditValue(title);
  };

  const handleEditChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditValue(e.target.value);
      setEditDisabled(
        !(e.target.value.length > 1 && e.target.value.length < 31)
      );
    },
    []
  );

  const handleCancel = () => {
    setEditId(undefined);
  };

  const handleUpdate = async (updateTodo: UpdateTodo, id: string) => {
    setTodos((todos) => {
      const traverseRecursively = (todos: TodoItemType[]) =>
        [...todos].map((todo) => {
          if (todo.id === id) {
            Object.keys(updateTodo).forEach((key) => {
              (todo as ReCaster)[key] = (updateTodo as ReCaster)[key];
            });
          }
          if (todo.subTodos.length > 0) {
            todo.subTodos = traverseRecursively(todo.subTodos || []);
          }
          return todo;
        });
      setDirty(uid());
      return traverseRecursively(todos);
    });

    await service.serviceCall(() => service.updateTodo(updateTodo, id));
  };

  const handleEdit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    const val = editValue;
    await handleUpdate({ title: val }, editId!);
    setEditId(undefined);
  };

  const handlePriority = async (priority: boolean, todoId: string) => {
    const iso = isoDate();
    await handleUpdate(
      { priority: priority, prioritizedAt: priority ? iso : "" },
      todoId!
    );
  };

  const handleRemove = async (id: string) => {
    setTodos((todos) => {
      const traverseRecursively = (todos: TodoItemType[]) =>
        [...todos].filter((todo) => {
          if (todo.id !== id) {
            if (todo.subTodos.length > 0) {
              todo.subTodos = traverseRecursively(todo.subTodos || []);
            }
            return todo;
          }
        });
      setDirty(uid());
      return traverseRecursively(todos);
    });

    await service.serviceCall(() => service.deleteTodo(id));
  };

  const handleDone = async (id: string, toggle: boolean) => {
    setTodos((todos) => {
      const batch: UpdateTodo[] = [];
      const traverse = (
        nodes: TodoItemType[],
        initialSetNodes = false
      ): TodoItemType[] => {
        return nodes
          .map((node) => {
            let setNodes = initialSetNodes;
            if (node.id === id) {
              setNodes = true;
            }

            if (setNodes) {
              node.completed = toggle;
              batch.push({
                id: node.id,
                completed: toggle,
              });
            }

            if (node.subTodos.length > 0) {
              node.subTodos = traverse(node.subTodos || [], setNodes);
            }

            return node;
          })
          .map((node) => {
            if (node.subTodos.length > 0) {
              if (node.subTodos.every((subTodo) => subTodo.completed)) {
                node.completed = true;
                batch.push({
                  id: node.id,
                  completed: true,
                });
              }
              if (node.subTodos.find((subTodo) => !subTodo.completed)) {
                node.completed = false;
                batch.push({
                  id: node.id,
                  completed: false,
                });
              }
              return node;
            }
            return node;
          });
      };

      const newTodos = traverse(todos, false);
      service.updateTodoBatch(batch);
      setDirty(uid());
      return newTodos;
    });
  };

  /**
   * @Pattern
   *
   * The usual suspect in slower applications is the use of event listeners on
   * a lot of DOM elements. Here, we are using a "old-school" technique in
   * frontend development where the event handlers are placed on the list, not
   * the list items. To make this work efficiently, we are only "listening" to
   * the buttons that are in a list item. By removing pointer-events from the
   * SVG:s and adding a dataset property on the buttons, we can easily capture
   * the event bubbling.
   */
  const handleActionClick = (e: React.SyntheticEvent<EventTarget>) => {
    if (!(e.target instanceof HTMLButtonElement)) {
      return;
    }

    const data = e.target.dataset;
    if (data.actionId === TodoAction.ADD) {
      handleAddTodo(e, data.todoId!);
    } else if (data.actionId === TodoAction.CANCEL) {
      handleCancel();
    } else if (data.actionId === TodoAction.DONE) {
      handleDone(data.todoId!, true);
    } else if (data.actionId === TodoAction.EDIT) {
      handleEditForm(data.todoId!, data.todoTitle!);
    } else if (data.actionId === TodoAction.MOVE) {
      handleDone(data.todoId!, false);
    } else if (data.actionId === TodoAction.REMOVE) {
      handleRemove(data.todoId!);
    } else if (data.actionId === TodoAction.SAVE) {
      handleEdit(e);
    } else if (data.actionId === TodoAction.PRIORITY) {
      handlePriority(true, data.todoId!);
    } else if (data.actionId === TodoAction.LOW_PRIORITY) {
      handlePriority(false, data.todoId!);
    }
  };

  useEffect(() => {
    const getTodos = service.getTodos();
    const fetchData = async () => {
      try {
        const data = await getTodos.fetch();
        setTodos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();

    return () => {
      getTodos.abortController.abort();
    };
  }, []);

  return (
    <TodoCard
      heading={<Heading label={"Todo List"} />}
      submitForm={
        <TodoSubmitForm
          value={submitFormValue}
          disabled={disabled}
          handleChange={handleChange}
          handleAddTodo={handleAddTodo}
        />
      }
      readyList={
        readyTodos.length > 0 && (
          <TodoList
            id="ready-list"
            heading={<SubHeading label={"Ready"} />}
            handleActionClick={handleActionClick}
            render={() =>
              readyTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  edit={todo.id === editId}
                  editId={editId}
                  editValue={editValue}
                  handleChange={handleEditChange}
                  disabled={editDisabled}
                  priority={todo.priority}
                  dirty={dirty!}
                  openAddSubTodo={submitFormValue.length > 1}
                />
              ))
            }
          />
        )
      }
      completedList={
        completedTodos.length > 0 && (
          <TodoList
            id="completed-list"
            heading={<SubHeading label={"Completed"} />}
            handleActionClick={handleActionClick}
            render={() =>
              completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  edit={todo.id === editId}
                  editId={editId}
                  editValue={editValue}
                  handleChange={handleEditChange}
                  disabled={editDisabled}
                  priority={todo.priority}
                  dirty={dirty!}
                  openAddSubTodo={submitFormValue.length > 1}
                />
              ))
            }
          />
        )
      }
    />
  );
};
