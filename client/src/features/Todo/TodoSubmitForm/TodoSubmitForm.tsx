import { memo } from "react";
import styles from "./TodoSubmitForm.module.scss";

interface P {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
}

export const TodoSubmitForm: React.FC<P> = memo(
  ({ value, handleChange, handleAddTodo, disabled }) => {
    return (
      <form className={styles.form} onSubmit={handleAddTodo} aria-label="todo">
        <input
          onChange={handleChange}
          type="text"
          name="todo"
          autoComplete="off"
          value={value}
          autoFocus
          required
          minLength={2}
          maxLength={30}
        />
        <button
          className={styles.submitButton}
          type="submit"
          disabled={disabled}
        >
          Add Todo
        </button>
      </form>
    );
  }
);
