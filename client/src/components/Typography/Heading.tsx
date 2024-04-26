import styles from "./Typography.module.css";

interface P {
  label: string;
}

export const Heading: React.FC<P> = ({ label }) => (
  <h2 className={styles.heading}>{label}</h2>
);
