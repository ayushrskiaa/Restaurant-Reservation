import { useState } from "react";
import Navbar from "./Navbar";
import OrderMenu from "./orderMenu";
import { MdOutlineRestaurantMenu, MdOutlineDeliveryDining } from "react-icons/md";
import { Link } from "react-scroll";
import { data } from "../restApi.json";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className={styles.heroSection} id="heroSection">
      <Navbar />

      {/* Background Decorations */}
      <div className={styles.heroBackground}>
        <div className={styles.backgroundGradient}></div>
        <div className={styles.backgroundPattern}></div>
      </div>

      {/* Floating Shapes */}
      <div className={styles.floatingShapes}>
        <div className={styles.shape} style={{ ...{ width: "300px", height: "300px", top: "-100px", right: "-100px", animation: "float 6s ease-in-out infinite" } }}></div>
        <div className={styles.shape} style={{ ...{ width: "200px", height: "200px", bottom: "-50px", left: "10%", animationDelay: "2s" } }}></div>
        <div className={styles.shape} style={{ ...{ width: "150px", height: "150px", top: "20%", left: "5%", animationDelay: "4s" } }}></div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.container}>
          {/* Text Content */}
          <div className={styles.textContent}>
            <div className={styles.subtitle}>Premium Dining Experience</div>

            <h1 className={styles.mainHeading}>
              Taste Excellence, <strong>Delivered Fresh</strong>
            </h1>

            <p className={styles.description}>
              Experience culinary perfection with our carefully crafted menu. Order from our exclusive selection or reserve your table for an unforgettable dining experience. Every dish is prepared with passion and the finest ingredients.
            </p>

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button className={styles.primaryButton} onClick={toggleSideMenu}>
                <MdOutlineRestaurantMenu style={{ fontSize: "20px" }} />
                <span>Order Online</span>
              </button>

              <Link
                to="menu"
                spy={true}
                smooth={true}
                duration={500}
                className={styles.primaryButton}
                style={{ cursor: "pointer" }}
              >
                <MdOutlineRestaurantMenu style={{ fontSize: "20px" }} />
                <span>View Menu</span>
              </Link>

              <Link
                to="reservation"
                spy={true}
                smooth={true}
                duration={500}
                className={styles.secondaryButton}
                style={{ cursor: "pointer" }}
              >
                <MdOutlineDeliveryDining style={{ fontSize: "20px" }} />
                <span>Reserve Table</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div style={{ display: "flex", gap: "var(--space-lg)", marginTop: "var(--space-2xl)", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", color: "rgba(255, 255, 255, 0.8)" }}>
                <span style={{ fontSize: "24px" }}>⭐</span>
                <span style={{ fontSize: "var(--font-size-sm)" }}>4.8 (500+ Reviews)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", color: "rgba(255, 255, 255, 0.8)" }}>
                <span style={{ fontSize: "24px" }}>🚚</span>
                <span style={{ fontSize: "var(--font-size-sm)" }}>Fast & Fresh Delivery</span>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className={styles.imageContent}>
            <div className={styles.imageGlow}></div>
            <img
              src="/hero1.png"
              alt="Delicious food"
              className={styles.heroImage}
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <div
          className={styles.scrollDot}
          onClick={() => scrollToSection("menu")}
          role="button"
          tabIndex="0"
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              scrollToSection("menu");
            }
          }}
        >
          <div className={styles.scrollIcon}></div>
        </div>
      </div>

      {/* Order Menu Sidebar */}
      {sideMenuOpen && <OrderMenu toggleSideMenu={toggleSideMenu} />}
    </section>
  );
};

export default HeroSection;
