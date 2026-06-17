import Image from "next/image";
import styles from "./TeamRankingCard.module.scss";

interface RankingItem {
  id: string;
  name: string;
  avatar?: string;
  value: number;
  subtitle?: string;
}

interface Props {
  title: string;
  description: string;
  items: RankingItem[];
  color: string;
}

export default function TeamRankingCard({
  title,
  description,
  items,
  color,
}: Props) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className={styles.card}>
      <h3 className={styles.card__title}>{title}</h3>

      <p className={styles.card__description}>{description}</p>

      <div className={styles.card__list}>
        {items.map((item) => (
          <div key={item.id} className={styles.card__item}>
            <Image
              src={item.avatar || "/avatar-placeholder.png"}
              alt={item.name}
              width={40}
              height={40}
              className={styles.card__avatar}
            />

            <div className={styles.card__content}>
              <div className={styles.card__header}>
                <span className={styles.card__name}>{item.name}</span>

                <span className={styles.card__value}>{item.value}</span>
              </div>

              <div className={styles.card__bar}>
                <div
                  className={styles.card__barFill}
                  style={{
                    width: `${(item.value / max) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
