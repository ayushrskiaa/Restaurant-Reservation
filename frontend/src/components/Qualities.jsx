import { Leaf, Flame, Timer } from "lucide-react";
import styles from "./Qualities.module.css";

const QUALITIES = [
  {
    id: 1,
    Icon: Leaf,
    title: "Farm-Fresh Ingredients",
    desc: "Every dish starts with quality. We source locally grown, seasonal produce and premium proteins — no shortcuts, ever.",
  },
  {
    id: 2,
    Icon: Flame,
    title: "Bold, Authentic Flavors",
    desc: "Our recipes balance tradition with innovation. Every bite delivers the depth of authentic cooking with a modern twist.",
  },
  {
    id: 3,
    Icon: Timer,
    title: "Fast & Fresh Delivery",
    desc: "Hot food at your door in under 30 minutes. Our delivery network keeps your meal at the perfect temperature.",
  },
];

const Qualities = () => (
  <section className={styles.section} id="qualities">
    <div className={styles.inner}>
      <div className={styles.header}>
        <div className={styles.sectionLabel}>
          <span className={styles.labelDash} /> Why Choose Us
        </div>
        <h2 className={styles.heading}>What Makes Us Different</h2>
        <p className={styles.subheading}>
          We don't just serve food — we craft experiences built on quality, flavor, and care.
        </p>
      </div>

      <div className={styles.grid}>
        {QUALITIES.map(({ id, Icon, title, desc }) => (
          <div key={id} className={styles.card}>
            <div className={styles.iconBox}><Icon size={20} strokeWidth={1.75} /></div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDesc}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Qualities;
