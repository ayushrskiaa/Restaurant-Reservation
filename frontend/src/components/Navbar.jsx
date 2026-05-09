import { useState, useEffect } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { MdOutlineDeliveryDining, MdOutlineAnalytics } from "react-icons/md";
import { IoClose } from "react-icons/io5";
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get cart count from localStorage (if you implement cart later)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        setCartCount(Array.isArray(cart) ? cart.length : 0);
      } catch (e) {
        setCartCount(0);
      }
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
    if (orderDetailsOpen) setOrderDetailsOpen(false);
  };

  const toggleOrderDetails = () => {
    setOrderDetailsOpen(!orderDetailsOpen);
    if (sideMenuOpen) setSideMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.navContainer}>
          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🍽️</div>
            <a href="/" className={styles.logoText}>
              RSKIAA'S
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className={styles.links}>
            {data[0]?.navbarLinks?.map((element) => (
              <Link
                key={element.id}
                to={element.link}
                spy={true}
                smooth={true}
                duration={500}
                className={styles.navLink}
              >
                {element.title}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className={styles.navActions}>
            <button
              className={styles.actionButton}
              onClick={toggleSideMenu}
              title="Order Online"
            >
              <MdOutlineDeliveryDining style={{ fontSize: "18px" }} />
              <span>Order</span>
            </button>

            <button
              className={`${styles.actionButton} ${styles.cartButton}`}
              onClick={toggleOrderDetails}
              title="View Orders"
            >
              <HiOutlineShoppingCart style={{ fontSize: "18px" }} />
              <span>Cart</span>
              {cartCount > 0 && (
                <div className={styles.cartBadge}>{cartCount}</div>
              )}
            </button>

            <RouterLink
              to="/restaurant-dashboard"
              className={styles.ctaButton}
              title="Analytics Dashboard"
            >
              <MdOutlineAnalytics style={{ fontSize: "18px" }} />
              <span>Dashboard</span>
            </RouterLink>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`${styles.hamburger} ${mobileMenuOpen ? styles.active : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.active : ""}`}>
          <div className={styles.links} style={{ flexDirection: "column" }}>
            {data[0]?.navbarLinks?.map((element) => (
              <Link
                key={element.id}
                to={element.link}
                spy={true}
                smooth={true}
                duration={500}
                className={styles.navLink}
                onClick={closeMobileMenu}
              >
                {element.title}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <button
              className={styles.actionButton}
              onClick={toggleSideMenu}
              style={{ width: "100%" }}
            >
              <MdOutlineDeliveryDining style={{ fontSize: "18px" }} />
              <span>Order Online</span>
            </button>

            <button
              className={styles.actionButton}
              onClick={toggleOrderDetails}
              style={{ width: "100%" }}
            >
              <HiOutlineShoppingCart style={{ fontSize: "18px" }} />
              <span>View Cart {cartCount > 0 && `(${cartCount})`}</span>
            </button>

            <RouterLink
              to="/restaurant-dashboard"
              className={styles.ctaButton}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <MdOutlineAnalytics style={{ fontSize: "18px" }} />
              <span>Dashboard</span>
            </RouterLink>
          </div>
        </div>
      </nav>

      {/* Render the OrderMenu component */}
      {sideMenuOpen && <OrderMenu toggleSideMenu={toggleSideMenu} />}

      {/* Render the OrderDetails component */}
      {orderDetailsOpen && <OrderDetails toggleOrderDetails={toggleOrderDetails} />}
    </>
  );
};

export default Navbar;

