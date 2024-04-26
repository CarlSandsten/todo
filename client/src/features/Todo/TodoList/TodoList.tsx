import styles from "./TodoList.module.scss";

interface P {
  heading?: React.ReactNode;
  id: string;
  render: () => React.ReactNode;
  handleActionClick?: (e: React.MouseEvent) => void;
}

export const TodoList: React.FC<P> = ({
  heading,
  id,
  render,
  handleActionClick,
}) => (
  <div className={styles.wrapper} aria-label={id} onClick={handleActionClick}>
    {heading}
    <ul data-testid={id}>{render()}</ul>
  </div>
);
