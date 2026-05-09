import { useState } from "react";
import Navbar from "./Navbar";
import OrderMenu from "./orderMenu";
import { Link } from "react-scroll";
import { ArrowRight, ChevronDown } from "lucide-react";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  return (
    <section className={styles.heroSection} id="heroSection">
      <Navbar />

      <div className={styles.heroInner}>
        {/* Text */}
        <div>
          <div className={styles.label}>
            <span className={styles.labelLine} />
            Fine Dining & Delivery
          </div>

          <h1 className={styles.heading}>
            Every Bite Tells<br />a <em>Delicious</em> Story
          </h1>

          <p className={styles.description}>
            Real ingredients, bold flavors. Order your favorites online or reserve a table — we bring the full restaurant experience to you.
          </p>

          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={() => setSideMenuOpen(true)}>
              Order Online <ArrowRight size={15} />
            </button>
            <Link to="menu" spy smooth duration={500} className={styles.btnSecondary}>
              View Menu
            </Link>
          </div>

          <div className={styles.stats}>
            {[
              { num: "4.8★", label: "500+ reviews" },
              { num: "30 min", label: "Avg. delivery" },
              { num: "200+", label: "Menu items" },
              { num: "8 yrs", label: "Serving city" },
            ].map(s => (
              <div key={s.num} className={styles.stat}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className={styles.imageWrap}>
          <img src="/hero1.png" alt="Signature dish" className={styles.heroImage} loading="eager" />
          <div className={styles.imageOverlay} />
        </div>
      </div>

      <div className={styles.scrollIndicator} onClick={() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      }}>
        <span className={styles.scrollText}>Scroll</span>
        <ChevronDown size={14} color="#fff" />
      </div>

      {sideMenuOpen && <OrderMenu toggleSideMenu={() => setSideMenuOpen(false)} />}
    </section>
  );
};

export default HeroSection;
