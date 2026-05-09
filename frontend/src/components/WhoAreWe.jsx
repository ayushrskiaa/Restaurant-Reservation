import styles from "./WhoAreWe.module.css";

const STATS = [
  { id: 1, number: "14", label: "Restaurants", icon: "🏪" },
  { id: 2, number: "20", label: "Expert Chefs", icon: "👨‍🍳" },
  { id: 3, number: "8",  label: "Years of Excellence", icon: "🏆" },
  { id: 4, number: "200", label: "Menu Items", icon: "🍽️" },
];

const WhoAreWe = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.eyebrow}>📊 By The Numbers</span>

        <h2 className={styles.heading}>
          Trusted by Thousands of<br /><span>Happy Customers</span>
        </h2>

        <div className={styles.statsGrid}>
          {STATS.map(stat => (
            <div key={stat.id} className={styles.statItem}>
              <span className={styles.statIcon}>{stat.icon}</span>
              <span className={styles.statNumber}>
                {stat.number}<span className={styles.statPlus}>+</span>
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoAreWe;
