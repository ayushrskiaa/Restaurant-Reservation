import styles from "./Qualities.module.css";

const QUALITIES = [
  {
    id: 1,
    icon: "🌿",
    title: "Farm-Fresh Ingredients",
    desc: "Every dish starts with quality. We source locally grown, seasonal produce and premium proteins — no shortcuts, no compromise.",
  },
  {
    id: 2,
    icon: "🔥",
    title: "Bold, Authentic Flavors",
    desc: "Our recipes balance tradition with innovation. Every bite delivers the depth of authentic cooking with a modern, creative twist.",
  },
  {
    id: 3,
    icon: "⚡",
    title: "Fast & Fresh Delivery",
    desc: "Hot food at your door in under 30 minutes. Our delivery network keeps your meal at the perfect temperature from kitchen to plate.",
  },
];

const Qualities = () => {
  return (
    <section className={styles.section} id="qualities">
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>✨ Why Choose Us</div>
          <h2 className={styles.title}>What Makes Us Different</h2>
          <p className={styles.subtitle}>
            We don't just serve food — we craft experiences built on quality, flavor, and care.
          </p>
        </div>

        <div className={styles.grid}>
          {QUALITIES.map(q => (
            <div key={q.id} className={styles.card}>
              <div className={styles.iconWrap}>{q.icon}</div>
              <h3 className={styles.cardTitle}>{q.title}</h3>
              <p className={styles.cardDesc}>{q.desc}</p>
              <span className={styles.cardLink}>Learn more →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Qualities;
