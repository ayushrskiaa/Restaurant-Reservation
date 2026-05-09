import { useState, useEffect } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { MdOutlineDeliveryDining, MdOutlineAnalytics } from "react-icons/md";
import OrderMenu from "./orderMenu";
import OrderDetails from "./OrderDetails";
import { Link as RouterLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const cart = JSON.parse(saved);
        setCartCount(Array.isArray(cart) ? cart.length : 0);
      }
    } catch { setCartCount(0); }
  }, []);

  const toggleSideMenu = () => {
    setSideMenuOpen(v => !v);
    if (orderDetailsOpen) setOrderDetailsOpen(false);
  };

  const toggleOrderDetails = () => {
    setOrderDetailsOpen(v => !v);
    if (sideMenuOpen) setSideMenuOpen(false);
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.navContainer}>

          {/* Logo */}
          <RouterLink to="/" className={styles.logo}>
            <div className={styles.logoIcon}>🍽️</div>
            <span className={styles.logoText}>RSKIAA<span>'S</span></span>
          </RouterLink>

          {/* Desktop nav links */}
          <div className={styles.links}>
            {data[0]?.navbarLinks?.map(el => (
              <Link
                key={el.id}
                to={el.link}
                spy smooth duration={500}
                className={styles.navLink}
              >
                {el.title}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className={styles.navActions}>
            <button className={styles.actionButton} onClick={toggleSideMenu}>
              <MdOutlineDeliveryDining size={17} />
              Order
            </button>

            <button className={`${styles.actionButton} ${styles.cartButton}`} onClick={toggleOrderDetails}>
              <HiOutlineShoppingCart size={17} />
              Cart
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </button>

            <RouterLink to="/restaurant-dashboard" className={styles.ctaButton}>
              <MdOutlineAnalytics size={17} />
              Dashboard
            </RouterLink>
          </div>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${mobileMenuOpen ? styles.active : ""}`}
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.active : ""}`}>
          {data[0]?.navbarLinks?.map(el => (
            <Link
              key={el.id}
              to={el.link}
              spy smooth duration={500}
              className={styles.navLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              {el.title}
            </Link>
          ))}
          <div className={styles.mobileActionsGroup}>
            <button className={styles.actionButton} onClick={toggleSideMenu} style={{ width: "100%", justifyContent: "center" }}>
              <MdOutlineDeliveryDining size={17} /> Order Online
            </button>
            <button className={styles.actionButton} onClick={toggleOrderDetails} style={{ width: "100%", justifyContent: "center" }}>
              <HiOutlineShoppingCart size={17} /> Cart {cartCount > 0 && `(${cartCount})`}
            </button>
            <RouterLink to="/restaurant-dashboard" className={styles.ctaButton} style={{ justifyContent: "center" }}>
              <MdOutlineAnalytics size={17} /> Dashboard
            </RouterLink>
          </div>
        </div>
      </nav>

      {sideMenuOpen && <OrderMenu toggleSideMenu={toggleSideMenu} />}
      {orderDetailsOpen && <OrderDetails toggleOrderDetails={toggleOrderDetails} />}
    </>
  );
};

export default Navbar;
