import { memo } from "react";
import { TodoItemType } from "../types";
import { TodoList } from "../TodoList";
import {
  CancelIcon,
  DeleteIcon,
  DoneIcon,
  EditIcon,
  LowPriorityIcon,
  MoveIcon,
  PriorityIcon,
  SaveIcon,
} from "../../../components";
import { todoDateSort } from "../helpers";
import styles from "./TodoItem.module.scss";

interface P {
  todo: TodoItemType;
  edit: boolean;
  editId: string | undefined;
  editValue: string;
  disabled: boolean;
  priority: boolean;
  dirty: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openAddSubTodo: boolean;
}

export const TodoItem: React.FC<P> = memo(
  ({
    todo,
    edit,
    editId,
    disabled,
    editValue,
    priority,
    dirty,
    handleChange,
    openAddSubTodo,
  }) => {
    const isCompleted = todo.completed;
    return (
      <li key={todo.id} className={styles.listItem}>
        {isCompleted && (
          <div className={styles.listItemWrapper}>
            <p
              className={
                todo.completed
                  ? `${styles.text} ${styles.lineThrough}`
                  : styles.text
              }
            >
              {todo.title}
            </p>
            <button
              className={`${styles.roundButton} ${styles.moveButton}`}
              aria-label="move back"
              data-action-id="move"
              data-todo-id={todo.id}
              title="Move todo item back to ready list"
            >
              <MoveIcon />
            </button>
            <button
              className={`${styles.roundButton} ${styles.deleteButton}`}
              aria-label="remove"
              data-action-id="remove"
              data-todo-id={todo.id}
              title="Delete todo item"
            >
              <DeleteIcon />
            </button>
          </div>
        )}
        {!isCompleted && edit && (
          <div className={styles.listItemWrapper}>
            <form className={styles.editForm} aria-label="edit-form">
              <input
                type="text"
                value={editValue}
                onChange={handleChange}
                autoComplete="off"
                autoFocus
                required
                name="edit-todo"
                minLength={2}
                maxLength={30}
              />
              <button
                className={`${styles.roundButton} ${styles.saveButton}`}
                aria-label="save"
                type="submit"
                disabled={disabled}
                data-action-id="save"
                data-todo-id={todo.id}
              >
                <SaveIcon />
              </button>
            </form>
            <button
              className={`${styles.roundButton} ${styles.cancelButton}`}
              aria-label="cancel"
              data-action-id="cancel"
              data-todo-id={todo.id}
              title="Cancel edit"
            >
              <CancelIcon />
            </button>
          </div>
        )}
        {!isCompleted && !edit && (
          <div className={styles.listItemWrapper}>
            {priority && (
              <span className={styles.priorityBadge}>
                <PriorityIcon />
              </span>
            )}
            <p className={styles.text}>{todo.title}</p>
            {openAddSubTodo && (
              <button
                className={styles.addSubTodoButton}
                data-action-id="add"
                data-todo-id={todo.id}
              >
                Add Sub Todo
              </button>
            )}
            {!openAddSubTodo && (
              <>
                {todo.priority && (
                  <button
                    className={`${styles.roundButton} ${styles.lowPriorityButton}`}
                    aria-label="lowPriority"
                    data-action-id="lowPriority"
                    data-todo-id={todo.id}
                    title="Unprioritize the todo item"
                  >
                    <LowPriorityIcon />
                  </button>
                )}
                {!todo.priority && (
                  <button
                    className={`${styles.roundButton} ${styles.priorityButton}`}
                    aria-label="priority"
                    data-action-id="priority"
                    data-todo-id={todo.id}
                    title="Prioritize todo item"
                  >
                    <PriorityIcon />
                  </button>
                )}
                <button
                  className={`${styles.roundButton} ${styles.editButton}`}
                  aria-label="edit"
                  data-action-id="edit"
                  data-todo-id={todo.id}
                  data-todo-title={todo.title}
                  title="Edit todo item"
                >
                  <EditIcon />
                </button>
                <button
                  className={`${styles.roundButton} ${styles.doneButton}`}
                  aria-label="done"
                  data-action-id="done"
                  data-todo-id={todo.id}
                  title="Mark todo item as done"
                >
                  <DoneIcon />
                </button>
              </>
            )}
          </div>
        )}
        {todo.subTodos.length > 0 && (
          <TodoList
            id={`nested-list-${todo.id}`}
            render={() =>
              todoDateSort(todo.subTodos).map((subTodo) => (
                <TodoItem
                  key={subTodo.id}
                  todo={subTodo}
                  edit={subTodo.id === editId}
                  editId={editId}
                  editValue={editValue}
                  handleChange={handleChange}
                  disabled={disabled}
                  priority={subTodo.priority}
                  dirty={dirty}
                  openAddSubTodo={openAddSubTodo}
                />
              ))
            }
          />
        )}
      </li>
    );
  }
);
