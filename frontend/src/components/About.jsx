import { Link } from "react-scroll";
import styles from "./About.module.css";

const FEATURES = [
  { icon: "🌿", label: "Farm Fresh Ingredients" },
  { icon: "👨‍🍳", label: "Expert Chefs" },
  { icon: "🚀", label: "30 Min Delivery" },
  { icon: "⭐", label: "4.8 Star Rated" },
];

const About = () => {
  return (
    <section className={styles.section} id="about">
      <div className={styles.container}>

        {/* Text */}
        <div className={styles.textSide}>
          <span className={styles.eyebrow}>🍴 Our Story</span>

          <h2 className={styles.heading}>
            More Than a Meal —<br />
            It's an <span>Experience</span>
          </h2>

          <p className={styles.body}>
            Welcome to Rskiaa's, where every visit feels like coming home. We
            take pride in serving freshly crafted dishes made with the finest
            local ingredients. Our chefs blend tradition with creativity to
            deliver flavors that stay with you long after the last bite. Whether
            it's a quick lunch, a family dinner, or a celebration — we make
            every moment delicious.
          </p>

          <div className={styles.features}>
            {FEATURES.map(f => (
              <div key={f.label} className={styles.featurePill}>
                <span className={styles.featureIcon}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>

          <Link to="menu" spy smooth duration={500} className={styles.cta}>
            Explore Our Menu →
          </Link>
        </div>

        {/* Image */}
        <div className={styles.imageSide}>
          <div className={styles.imageFrame}>
            <img
              src="https://images.pexels.com/photos/12129480/pexels-photo-12129480.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Our kitchen"
              className={styles.image}
            />
          </div>
          <div className={styles.imageAccent} />

          {/* Floating card */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏆</div>
            <div>
              <div className={styles.statNumber}>8+ Years</div>
              <div className={styles.statLabel}>Serving Excellence</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
