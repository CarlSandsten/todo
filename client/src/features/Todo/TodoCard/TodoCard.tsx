import styles from "./TodoCard.module.scss";

interface P {
  heading: React.ReactNode;
  submitForm: React.ReactNode;
  readyList: React.ReactNode;
  completedList: React.ReactNode;
}

export const TodoCard: React.FC<P> = ({
  heading,
  submitForm,
  readyList,
  completedList,
}) => (
  <section className={styles.card} aria-label="todo-list">
    {heading}
    {submitForm}
    {readyList}
    {completedList}
  </section>
);
