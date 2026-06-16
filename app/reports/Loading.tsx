import styles from "./loading.module.scss";

function Card() {
  return (
    <div className={styles.card}>
      <div className={`${styles.skeleton} ${styles.cardInner}`} />
    </div>
  );
}

export default function ReportsLoading() {
  return (
    <div
      className={styles.page}
      aria-busy="true"
      aria-label="Cargando reportes"
    >
      <div className={`${styles.skeleton} ${styles.title}`} />

      {/* filtros (botón + range picker) */}
      <div className={styles.filters}>
        <div className={`${styles.skeleton} ${styles.filterBtn}`} />
        <div className={`${styles.skeleton} ${styles.rangePicker}`} />
      </div>

      {/* métricas */}
      <div className={styles.metrics}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.metricCard}>
            <div className={`${styles.skeleton} ${styles.metricLabel}`} />
            <div className={`${styles.skeleton} ${styles.metricValue}`} />
          </div>
        ))}
      </div>

      {/* pie charts */}
      <div className={styles.pies}>
        <div className={styles.pieBox}>
          <Card />
        </div>
        <div className={styles.pieBox}>
          <Card />
        </div>
      </div>

      {/* trend */}
      <div className={styles.trend}>
        <Card />
      </div>

      {/* tabla */}
      <div className={styles.table}>
        <Card />
      </div>

      {/* mapa + calendario */}
      <div className={styles.mapCalendar}>
        <div className={styles.mapCalendarBox}>
          <Card />
        </div>
        <div className={styles.mapCalendarBox}>
          <Card />
        </div>
      </div>

      {/* radar */}
      <div className={styles.radar}>
        <Card />
      </div>

      {/* desempeño del equipo */}
      <div className={`${styles.skeleton} ${styles.teamTitle}`} />
      <div className={styles.teamGrid}>
        <div className={styles.teamBox}>
          <Card />
        </div>
        <div className={styles.teamBox}>
          <Card />
        </div>
        <div className={styles.teamBox}>
          <Card />
        </div>
      </div>
    </div>
  );
}
