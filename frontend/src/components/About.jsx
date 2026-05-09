import { Link } from "react-scroll";
import { Check, ArrowRight, Award } from "lucide-react";
import styles from "./About.module.css";

const CHECKLIST = [
  "Locally sourced, seasonal ingredients",
  "Prepared fresh daily — never frozen",
  "Recipes perfected over 8 years",
  "Delivery in under 30 minutes",
];

const About = () => (
  <section className={styles.section} id="about">
    <div className={styles.inner}>
      <div className={styles.textSide}>
        <div className={styles.sectionLabel}>
          <span className={styles.labelDash} /> Our Story
        </div>
        <h2 className={styles.heading}>
          More Than a Meal —<br />It's an Experience
        </h2>
        <p className={styles.body}>
          Welcome to Rskiaa's, where every visit feels like coming home. We take
          pride in serving dishes made with the finest local ingredients. Our chefs
          blend tradition with creativity to deliver flavors that stay with you
          long after the last bite.
        </p>
        <div className={styles.checklist}>
          {CHECKLIST.map(item => (
            <div key={item} className={styles.checkItem}>
              <Check size={15} strokeWidth={2.5} className={styles.checkIcon} />
              {item}
            </div>
          ))}
        </div>
        <Link to="menu" spy smooth duration={500} className={styles.cta}>
          Explore Menu <ArrowRight size={15} />
        </Link>
      </div>

      <div className={styles.imageSide}>
        <div className={styles.imageFrame}>
          <img
            src="https://images.pexels.com/photos/12129480/pexels-photo-12129480.jpeg?auto=compress&cs=tinysrgb&w=900"
            alt="Our kitchen"
            className={styles.image}
          />
        </div>
        <div className={styles.floatCard}>
          <div className={styles.floatIcon}><Award size={20} /></div>
          <div>
            <div className={styles.floatNum}>8+ Years</div>
            <div className={styles.floatLabel}>Of Culinary Excellence</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
