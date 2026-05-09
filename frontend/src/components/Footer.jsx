import { Link as RouterLink } from "react-router-dom";
import { Link } from "react-scroll";
import styles from "./Footer.module.css";

const NAV_LINKS = [
  { label: "Home", to: "heroSection" },
  { label: "About Us", to: "about" },
  { label: "Services", to: "qualities" },
  { label: "Our Team", to: "team" },
  { label: "Reservation", to: "reservation" },
];

const HOURS = [
  { day: "Mon – Fri", time: "11:00 AM – 11:00 PM" },
  { day: "Saturday", time: "10:00 AM – 12:00 AM" },
  { day: "Sunday", time: "05:00 PM – 11:00 PM" },
];

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>

        {/* Brand */}
        <div className={styles.brandCol}>
          <div className={styles.logoRow}>
            <div className={styles.logoIcon}>🍽️</div>
            <span className={styles.logoName}>RSKIAA<span>'S</span></span>
          </div>
          <p className={styles.tagline}>
            Handcrafted flavors, warm hospitality, and unforgettable dining moments — every single day.
          </p>
          <div className={styles.socialRow}>
            {["📘", "📸", "🐦", "▶️"].map((icon, i) => (
              <a key={i} href="#" className={styles.socialBtn} aria-label="Social link">
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.col}>
          <span className={styles.colTitle}>Quick Links</span>
          {NAV_LINKS.map(link => (
            <Link
              key={link.label}
              to={link.to}
              spy smooth duration={500}
              className={styles.colLink}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Hours */}
        <div className={styles.col}>
          <span className={styles.colTitle}>Opening Hours</span>
          {HOURS.map(h => (
            <div key={h.day} className={styles.hoursItem}>
              <span className={styles.day}>{h.day}</span>
              <span className={styles.time}>{h.time}</span>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <span className={styles.colTitle}>Contact</span>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📍</span>
            <span className={styles.contactText}>123 Flavor Street, Food City, FC 110001</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <span className={styles.contactText}>+91 1234567890</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>✉️</span>
            <span className={styles.contactText}>hello@rskiaas.com</span>
          </div>
        </div>

      </div>

      <div className={styles.bottom}>
        <span className={styles.copyright}>
          © 2025 <span>Rskiaa's</span>. All rights reserved.
        </span>
        <RouterLink to="/restaurant-dashboard" className={styles.dashboardLink}>
          📊 Restaurant Dashboard
        </RouterLink>
      </div>
    </footer>
  );
};

export default Footer;
