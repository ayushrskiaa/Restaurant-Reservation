import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./orderMenu.module.css";

const OrderMenu = ({ toggleSideMenu }) => {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const BASE_URL =
    window.location.hostname === "localhost"
      ? import.meta.env.VITE_BASE_URL
      : import.meta.env.VITE_PRODUCTION_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/products`);
        setProducts(res.data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [BASE_URL]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") toggleSideMenu();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleSideMenu]);

  const addToCart = (item) => {
    setCart((prev) => {
      const price =
        typeof item.price === "string"
          ? parseFloat(item.price.replace("₹", "").replace(",", ""))
          : item.price;
      const existing = prev[item._id];
      return {
        ...prev,
        [item._id]: existing
          ? { ...existing, quantity: existing.quantity + 1 }
          : { ...item, quantity: 1, price },
      };
    });
  };

  const removeFromCart = (item) => {
    setCart((prev) => {
      if (!prev[item._id]) return prev;
      if (prev[item._id].quantity <= 1) {
        const next = { ...prev };
        delete next[item._id];
        return next;
      }
      return { ...prev, [item._id]: { ...prev[item._id], quantity: prev[item._id].quantity - 1 } };
    });
  };

  const handleCheckout = () => {
    const items = Object.values(cart).map((item) => ({
      id: item.id || item._id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));
    const total = Object.values(cart).reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    navigate("/checkOut", { state: { cart, total, items } });
  };

  // Build category list
  const categorySet = new Set(products.map((p) => p.category || "Other"));
  const allCategories = ["All", ...Array.from(categorySet)];

  const visibleProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => (p.category || "Other") === activeCategory);

  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const delivery = subtotal > 0 ? 40 : 0;
  const total = subtotal + delivery;
  const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div className={styles.overlay} onClick={toggleSideMenu} />

      {/* Side Panel */}
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label="Order Menu">

        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            🍽️ Order Online
            {totalQty > 0 && (
              <span className={styles.itemCount}>{totalQty}</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={toggleSideMenu} aria-label="Close menu">
            ×
          </button>
        </div>

        {/* Category Tabs */}
        {!loading && products.length > 0 && (
          <div className={styles.categoryTabs}>
            {allCategories.map((cat) => (
              <button
                key={cat}
                className={`${styles.catTab} ${activeCategory === cat ? styles.active : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product List */}
        <div className={styles.productScroll}>
          {loading ? (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner} />
              <span className={styles.loadingText}>Loading menu…</span>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyCart}>
              <span className={styles.emptyIcon}>🥘</span>
              <p className={styles.emptyTitle}>Menu unavailable</p>
              <p className={styles.emptyText}>Please try again later</p>
            </div>
          ) : (
            <>
              {activeCategory !== "All" && (
                <div className={styles.groupHeader}>{activeCategory}</div>
              )}
              {visibleProducts.map((product) => {
                const qty = cart[product._id]?.quantity || 0;
                return (
                  <div
                    key={product._id}
                    className={`${styles.productRow} ${qty > 0 ? styles.inCart : ""}`}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className={styles.productThumb}
                      loading="lazy"
                    />
                    <div className={styles.productInfo}>
                      <div className={styles.productName}>{product.title}</div>
                      <div className={styles.productMeta}>
                        <span className={styles.productPrice}>₹{product.price}</span>
                        {product.offer && (
                          <span className={styles.offerTag}>{product.offer}</span>
                        )}
                      </div>
                    </div>

                    {qty === 0 ? (
                      <button
                        className={styles.addItemBtn}
                        onClick={() => addToCart(product)}
                      >
                        + ADD
                      </button>
                    ) : (
                      <div className={styles.qtyGroup}>
                        <button className={styles.qtyBtn} onClick={() => removeFromCart(product)}>−</button>
                        <span className={styles.qtyNum}>{qty}</span>
                        <button className={styles.qtyBtn} onClick={() => addToCart(product)}>+</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Checkout Bar */}
        <div className={styles.checkoutBar}>
          {subtotal > 0 && (
            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery fee</span>
                <span>₹{delivery.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRowTotal}>
                <span>Total</span>
                <span className={styles.totalValue}>₹{total.toFixed(2)}</span>
              </div>
            </div>
          )}
          <button
            className={`${styles.checkoutBtn} ${subtotal === 0 ? styles.checkoutBtnDisabled : ""}`}
            onClick={subtotal > 0 ? handleCheckout : undefined}
            disabled={subtotal === 0}
          >
            {subtotal === 0 ? "Add items to continue" : `Proceed to Checkout • ₹${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </>
  );
};

OrderMenu.propTypes = {
  toggleSideMenu: PropTypes.func.isRequired,
};

export default OrderMenu;
