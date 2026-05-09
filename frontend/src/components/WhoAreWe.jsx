import styles from "./WhoAreWe.module.css";

const STATS = [
  { id: 1, num: "14", label: "Restaurants" },
  { id: 2, num: "20", label: "Expert Chefs" },
  { id: 3, num: "8",  label: "Years of Excellence" },
  { id: 4, num: "200", label: "Menu Items" },
];

const WhoAreWe = () => (
  <section className={styles.section}>
    <div className={styles.inner}>
      <div className={styles.textBlock}>
        <div className={styles.sectionLabel}>
          <span className={styles.labelDash} /> By The Numbers
        </div>
        <h2 className={styles.heading}>
          Trusted by thousands<br />of happy customers
        </h2>
      </div>

      <div className={styles.divider} />

      {STATS.map(s => (
        <div key={s.id} className={styles.statItem}>
          <span className={styles.statNum}>{s.num}<span>+</span></span>
          <span className={styles.statLabel}>{s.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default WhoAreWe;
