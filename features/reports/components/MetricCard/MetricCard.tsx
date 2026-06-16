import styles from "./MetricCard.module.scss";

interface Props {
  title: string;
  value: string | number;
}

export default function MetricCard({ title, value }: Props) {
  return (
    <div className={styles.card}>
      <p className={styles.title}>{title}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
}
