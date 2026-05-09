import { useState, useEffect } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import { ShoppingBag, LayoutDashboard, Menu, X, Utensils } from "lucide-react";
import OrderMenu from "./orderMenu";
import OrderDetails from "./OrderDetails";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const c = JSON.parse(saved);
        setCartCount(Array.isArray(c) ? c.length : 0);
      }
    } catch { setCartCount(0); }
  }, []);

  const openSideMenu = () => { setSideMenuOpen(true); setOrderDetailsOpen(false); setMobileOpen(false); };
  const openOrderDetails = () => { setOrderDetailsOpen(true); setSideMenuOpen(false); setMobileOpen(false); };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.navContainer}>
          <RouterLink to="/" className={styles.logo}>
            <div className={styles.logoMark}><Utensils size={16} /></div>
            <span className={styles.logoText}>Rskiaa's</span>
          </RouterLink>

          <div className={styles.links}>
            {data[0]?.navbarLinks?.map(el => (
              <Link key={el.id} to={el.link} spy smooth duration={500} className={styles.navLink}>
                {el.title}
              </Link>
            ))}
          </div>

          <div className={styles.navActions}>
            <button className={styles.iconBtn} onClick={openSideMenu}>
              <Utensils size={14} /> Order
            </button>
            <button className={`${styles.iconBtn} ${styles.cartButton}`} onClick={openOrderDetails} style={{ position: "relative" }}>
              <ShoppingBag size={14} /> Cart
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </button>
            <RouterLink to="/restaurant-dashboard" className={styles.ctaBtn}>
              <LayoutDashboard size={14} /> Dashboard
            </RouterLink>
          </div>

          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.active : ""}`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <div className={`${styles.mobileMenu} ${mobileOpen ? styles.active : ""}`}>
          {data[0]?.navbarLinks?.map(el => (
            <Link key={el.id} to={el.link} spy smooth duration={500}
              className={styles.navLink} onClick={() => setMobileOpen(false)}>
              {el.title}
            </Link>
          ))}
          <div className={styles.mobileDivider} />
          <div className={styles.mobileActions}>
            <button className={styles.iconBtn} onClick={openSideMenu} style={{ width: "100%", justifyContent: "center" }}>
              <Utensils size={14} /> Order Online
            </button>
            <button className={styles.iconBtn} onClick={openOrderDetails} style={{ width: "100%", justifyContent: "center" }}>
              <ShoppingBag size={14} /> Cart {cartCount > 0 && `(${cartCount})`}
            </button>
            <RouterLink to="/restaurant-dashboard" className={styles.ctaBtn} style={{ justifyContent: "center" }}>
              <LayoutDashboard size={14} /> Dashboard
            </RouterLink>
          </div>
        </div>
      </nav>

      {sideMenuOpen && <OrderMenu toggleSideMenu={() => setSideMenuOpen(false)} />}
      {orderDetailsOpen && <OrderDetails toggleOrderDetails={() => setOrderDetailsOpen(false)} />}
    </>
  );
};

export default Navbar;
