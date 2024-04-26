import styles from "./Typography.module.css";

interface P {
  label: string;
}

export const SubHeading: React.FC<P> = ({ label }) => (
  <h3 className={styles.subHeading}>{label}</h3>
);
