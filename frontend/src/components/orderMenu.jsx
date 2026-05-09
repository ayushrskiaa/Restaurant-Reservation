import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./orderMenu.module.css";

const OrderMenu = ({ toggleSideMenu }) => {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null); // NEW
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

  const addToCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      const numericPrice =
        typeof item.price === "string"
          ? parseFloat(item.price.replace("₹", "").replace(",", ""))
          : item.price;
      if (newCart[item._id]) {
        newCart[item._id].quantity += 1;
      } else {
        newCart[item._id] = {
          ...item,
          quantity: 1,
          price: numericPrice,
        };
      }
      return newCart;
    });
  };

  const removeFromCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item._id] && newCart[item._id].quantity > 0) {
        newCart[item._id].quantity -= 1;
        if (newCart[item._id].quantity === 0) {
          delete newCart[item._id];
        }
      }
      return newCart;
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
    navigate("/checkOut", {
      state: {
        cart,
        total,
        items,
      },
    });
  };

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const cat = product.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // List of all categories
  const allCategories = Object.keys(productsByCategory);

  return (
    <div className={styles.sideMenu}>
      <button
        className={styles.closeBtn}
        onClick={toggleSideMenu}
        title="Close"
      >
        ×
      </button>
      <div className={styles.orderMenuContent}>
        {/* Desktop: Two columns */}
        <div className={styles.orderMenuDesktop}>
          {/* Left: Category List */}
          <div className={styles.categorySidebar}>
            <h3>Categories</h3>
            <div className={styles.categoriesContainer}>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.categoryButton} ${activeCategory === cat ? styles.active : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
              {activeCategory && (
                <button
                  className={`${styles.categoryButton} ${styles.active}`}
                  onClick={() => setActiveCategory(null)}
                >
                  Show All
                </button>
              )}
            </div>
          </div>
          {/* Right: Product List */}
          <div className={styles.productsList}>
            <h2>Order Menu</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {loading ? (
                <li className={styles.loadingText}>Loading...</li>
              ) : products.length === 0 ? (
                <li className={styles.emptyMessage}>No products found.</li>
              ) : (
                (activeCategory ? [activeCategory] : allCategories).map((cat) => (
                  <li key={cat} className={styles.categorySection}>
                    <h3 className={styles.categoryTitle}>{cat}</h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {productsByCategory[cat].map((product) => (
                        <li
                          key={product._id}
                          className={`${styles.foodItem} ${cart[product._id] ? styles.inCart : ''}`}
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            className={styles.foodItemImage}
                          />
                          <div className={styles.foodItemContent}>
                            <div className={styles.foodItemTitle}>
                              {product.title}
                            </div>
                            <div className={styles.foodItemPrice}>
                              ₹{product.price}
                              {product.offer && (
                                <span className={styles.foodItemOffer}>
                                  {product.offer}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={styles.cartControls}>
                            <button
                              className={styles.quantityButton}
                              onClick={() => removeFromCart(product)}
                              title="Decrease quantity"
                            >
                              −
                            </button>
                            <span className={styles.quantityDisplay}>
                              {cart[product._id]?.quantity || 0}
                            </span>
                            <button
                              className={`${styles.quantityButton} ${styles.increase}`}
                              onClick={() => addToCart(product)}
                              title="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        {/* Mobile: Single column with expandable categories */}
        <div className={styles.orderMenuMobile}>
          <h2>Order Menu</h2>
          {/* Category List (Collapsible) */}
          <div className={styles.mobileCategoriesSection}>
            <h3>Categories</h3>
            <div className={styles.mobileCategoriesList}>
              {allCategories.map((cat) => (
                <div key={cat}>
                  <button
                    className={`${styles.mobileCategoryButton} ${activeCategory === cat ? styles.active : ''}`}
                    onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                  >
                    <span>{cat}</span>
                    <span className={`${styles.categoryToggleIcon} ${activeCategory === cat ? styles.active : ''}`}>
                      ▼
                    </span>
                  </button>
                  {activeCategory === cat && (
                    <div className={styles.categoryProductsList}>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {productsByCategory[cat].map((product) => (
                          <li
                            key={product._id}
                            className={`${styles.foodItem} ${cart[product._id] ? styles.inCart : ''}`}
                          >
                            <img
                              src={product.image}
                              alt={product.title}
                              className={styles.foodItemImage}
                            />
                            <div className={styles.foodItemContent}>
                              <div className={styles.foodItemTitle}>
                                {product.title}
                              </div>
                              <div className={styles.foodItemPrice}>
                                ₹{product.price}
                                {product.offer && (
                                  <span className={styles.foodItemOffer}>
                                    {product.offer}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={styles.cartControls}>
                              <button
                                className={styles.quantityButton}
                                onClick={() => removeFromCart(product)}
                                title="Decrease quantity"
                              >
                                −
                              </button>
                              <span className={styles.quantityDisplay}>
                                {cart[product._id]?.quantity || 0}
                              </span>
                              <button
                                className={`${styles.quantityButton} ${styles.increase}`}
                                onClick={() => addToCart(product)}
                                title="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.checkoutBar}>
        <div className={styles.totalAmount}>
          Total: ₹{total.toFixed(2)}
        </div>
        <button
          className={styles.checkoutBtn}
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

OrderMenu.propTypes = {
  toggleSideMenu: PropTypes.func.isRequired,
};

export default OrderMenu;
