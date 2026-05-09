import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, ArrowRight } from "lucide-react";
import styles from "./orderMenu.module.css";

const OrderMenu = ({ toggleSideMenu }) => {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const BASE_URL = window.location.hostname === "localhost"
    ? import.meta.env.VITE_BASE_URL
    : import.meta.env.VITE_PRODUCTION_URL;

  useEffect(() => {
    axios.get(`${BASE_URL}/api/v1/products`)
      .then(r => setProducts(r.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [BASE_URL]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") toggleSideMenu(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSideMenu]);

  const parsePrice = (p) => typeof p === "string" ? parseFloat(p.replace(/[^\d.]/g, "")) : p;

  const addToCart = (item) => setCart(prev => {
    const price = parsePrice(item.price);
    const ex = prev[item._id];
    return { ...prev, [item._id]: ex ? { ...ex, quantity: ex.quantity + 1 } : { ...item, quantity: 1, price } };
  });

  const removeFromCart = (item) => setCart(prev => {
    if (!prev[item._id]) return prev;
    if (prev[item._id].quantity <= 1) { const n = { ...prev }; delete n[item._id]; return n; }
    return { ...prev, [item._id]: { ...prev[item._id], quantity: prev[item._id].quantity - 1 } };
  });

  const handleCheckout = () => {
    const items = Object.values(cart).map(i => ({ id: i.id || i._id, title: i.title, price: i.price, quantity: i.quantity }));
    const total = Object.values(cart).reduce((s, i) => s + i.quantity * i.price, 0);
    navigate("/checkOut", { state: { cart, total, items } });
  };

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category || "Other")))];
  const visible = activeCategory === "All" ? products : products.filter(p => (p.category || "Other") === activeCategory);
  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);
  const delivery = subtotal > 0 ? 40 : 0;
  const total = subtotal + delivery;
  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <div className={styles.backdrop} onClick={toggleSideMenu} />
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label="Order menu">

        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            Order Online
            {totalQty > 0 && <span className={styles.itemCount}>{totalQty}</span>}
          </span>
          <button className={styles.closeBtn} onClick={toggleSideMenu} aria-label="Close">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {!loading && products.length > 0 && (
          <div className={styles.tabs}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.tab} ${activeCategory === cat ? styles.active : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className={styles.scrollArea}>
          {loading ? (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner} />
              <span className={styles.loadingText}>Loading menu…</span>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyWrap}>
              <p className={styles.emptyTitle}>Menu unavailable</p>
              <p className={styles.emptyText}>Please try again later</p>
            </div>
          ) : (
            <>
              {activeCategory !== "All" && (
                <div className={styles.groupLabel}>{activeCategory}</div>
              )}
              {visible.map(product => {
                const qty = cart[product._id]?.quantity || 0;
                return (
                  <div key={product._id} className={`${styles.productRow} ${qty > 0 ? styles.inCart : ""}`}>
                    <img src={product.image} alt={product.title} className={styles.thumb} loading="lazy" />
                    <div className={styles.productInfo}>
                      <p className={styles.productName}>{product.title}</p>
                      <p className={styles.productPrice}>
                        ₹{product.price}
                        {product.offer && <span className={styles.offerTag}>{product.offer}</span>}
                      </p>
                    </div>
                    {qty === 0 ? (
                      <button className={styles.addBtn} onClick={() => addToCart(product)}>
                        <Plus size={12} strokeWidth={2.5} /> ADD
                      </button>
                    ) : (
                      <div className={styles.qtyGroup}>
                        <button className={styles.qtyBtn} onClick={() => removeFromCart(product)}><Minus size={13} /></button>
                        <span className={styles.qtyNum}>{qty}</span>
                        <button className={styles.qtyBtn} onClick={() => addToCart(product)}><Plus size={13} /></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className={styles.checkoutBar}>
          {subtotal > 0 && (
            <div className={styles.summary}>
              <div className={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className={styles.summaryRow}><span>Delivery</span><span>₹{delivery.toFixed(2)}</span></div>
              <div className={styles.summaryTotal}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
          )}
          <button
            className={styles.checkoutBtn}
            onClick={subtotal > 0 ? handleCheckout : undefined}
            disabled={subtotal === 0}
          >
            {subtotal === 0
              ? "Add items to continue"
              : <><span>Proceed to Checkout</span><ArrowRight size={15} /></>}
          </button>
        </div>
      </div>
    </>
  );
};

OrderMenu.propTypes = { toggleSideMenu: PropTypes.func.isRequired };
export default OrderMenu;
