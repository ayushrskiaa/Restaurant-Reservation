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
            <div className={styles.subtitle}>🔥 Fresh • Fast • Delicious</div>

            <h1 className={styles.mainHeading}>
              Every Bite Tells a<br /><strong>Delicious Story</strong>
            </h1>

            <p className={styles.description}>
              Real ingredients. Real flavors. Order your favorites online or book a table — we bring the restaurant experience right to you.
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
            <div style={{ display: "flex", gap: "12px", marginTop: "32px", flexWrap: "wrap" }}>
              {[
                { icon: "⭐", label: "4.8 Rating", sub: "500+ Reviews" },
                { icon: "🚀", label: "30 min", sub: "Avg delivery" },
                { icon: "👨‍🍳", label: "20+ Chefs", sub: "Expert kitchen" },
              ].map((badge) => (
                <div key={badge.label} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px", padding: "10px 16px",
                }}>
                  <span style={{ fontSize: "22px" }}>{badge.icon}</span>
                  <div>
                    <div style={{ color: "#fff", fontSize: "14px", fontWeight: 700, lineHeight: 1.2 }}>{badge.label}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{badge.sub}</div>
                  </div>
                </div>
              ))}
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
