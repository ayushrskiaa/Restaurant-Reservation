import { Link as RouterLink } from "react-router-dom";
import { Link } from "react-scroll";
import { MapPin, Phone, Mail, LayoutDashboard, Utensils, Instagram, Twitter, Facebook } from "lucide-react";
import styles from "./Footer.module.css";

const NAV = [
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

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.top}>
      <div className={styles.brandCol}>
        <div className={styles.logoRow}>
          <div className={styles.logoMark}><Utensils size={14} /></div>
          <span className={styles.logoName}>Rskiaa's</span>
        </div>
        <p className={styles.tagline}>
          Handcrafted flavors and warm hospitality — every single day.
        </p>
        <div className={styles.socials}>
          <a href="#" className={styles.socialBtn} aria-label="Instagram"><Instagram size={14} /></a>
          <a href="#" className={styles.socialBtn} aria-label="Twitter"><Twitter size={14} /></a>
          <a href="#" className={styles.socialBtn} aria-label="Facebook"><Facebook size={14} /></a>
        </div>
      </div>

      <div className={styles.col}>
        <span className={styles.colTitle}>Quick Links</span>
        {NAV.map(l => (
          <Link key={l.label} to={l.to} spy smooth duration={500} className={styles.link}>
            {l.label}
          </Link>
        ))}
      </div>

      <div className={styles.col}>
        <span className={styles.colTitle}>Opening Hours</span>
        <div className={styles.hoursGroup}>
          {HOURS.map(h => (
            <div key={h.day} className={styles.hoursRow}>
              <span className={styles.hoursDay}>{h.day}</span>
              <span className={styles.hoursTime}>{h.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.col}>
        <span className={styles.colTitle}>Contact</span>
        <div className={styles.contactGroup}>
          <div className={styles.contactRow}>
            <MapPin size={13} className={styles.contactIcon} />
            <span className={styles.contactText}>123 Flavor Street, Food City, FC 110001</span>
          </div>
          <div className={styles.contactRow}>
            <Phone size={13} className={styles.contactIcon} />
            <span className={styles.contactText}>+91 1234567890</span>
          </div>
          <div className={styles.contactRow}>
            <Mail size={13} className={styles.contactIcon} />
            <span className={styles.contactText}>hello@rskiaas.com</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.bottom}>
      <div className={styles.bottomInner}>
        <span className={styles.copyright}>© 2025 Rskiaa's. All rights reserved.</span>
        <RouterLink to="/restaurant-dashboard" className={styles.dashLink}>
          <LayoutDashboard size={13} /> Restaurant Dashboard
        </RouterLink>
      </div>
    </div>
  </footer>
);

export default Footer;
