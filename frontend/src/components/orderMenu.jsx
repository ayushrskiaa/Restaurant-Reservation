import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div
      className="sideMenu"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "100vw",
        maxWidth: 600,
        minWidth: 0,
        height: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        boxShadow: "-2px 0 12px rgba(60,60,120,0.13)",
        zIndex: 1000,
        transition: "all 0.3s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        className="closeBtn"
        onClick={toggleSideMenu}
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          background: "#e53935",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 36,
          height: 36,
          fontSize: 20,
          cursor: "pointer",
          boxShadow: "0 2px 8px #e5393533",
          zIndex: 10,
        }}
        title="Close"
      >
        ×
      </button>
      <div
        className="orderMenuContent"
        style={{
          flex: 1,
          overflow: "hidden",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Desktop: Two columns */}
        <div className="orderMenuDesktop" style={{
          display: "none",
          height: "100%",
          flexDirection: "row",
          overflow: "hidden"
        }}>
          {/* Left: Category List */}
          <div
            className="categorySidebar"
            style={{
              width: 160,
              minWidth: 120,
              maxWidth: 200,
              background: "#fff",
              borderRight: "1.5px solid #e0e7ff",
              padding: "32px 0 0 0",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <h3
              style={{
                color: "#6366f1",
                fontWeight: 700,
                fontSize: "1.1rem",
                margin: "0 0 18px 0",
                textAlign: "center",
                letterSpacing: 1,
              }}
            >
              Categories
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "14px 10px",
                    background: activeCategory === cat ? "#6366f1" : "#fff",
                    color: activeCategory === cat ? "#fff" : "#6366f1",
                    border: "none",
                    borderLeft: activeCategory === cat ? "4px solid #6366f1" : "4px solid transparent",
                    borderRadius: 0,
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                >
                  {cat}
                </button>
              ))}
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  style={{
                    padding: "14px 10px",
                    background: "#e0e7ff",
                    color: "#6366f1",
                    border: "none",
                    borderLeft: "4px solid #6366f1",
                    borderRadius: 0,
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    marginTop: 8,
                  }}
                >
                  Show All
                </button>
              )}
            </div>
          </div>
          {/* Right: Product List */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "32px 24px 110px 24px",
              minHeight: 0,
            }}
          >
            <h2
              style={{
                textAlign: "center",
                fontWeight: 700,
                fontSize: "1.7rem",
                marginBottom: 24,
                color: "#6366f1",
                letterSpacing: 1,
              }}
            >
              Order Menu
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {loading ? (
                <li style={{ textAlign: "center", color: "#6366f1" }}>Loading...</li>
              ) : products.length === 0 ? (
                <li style={{ textAlign: "center", color: "#888" }}>No products found.</li>
              ) : (
                (activeCategory ? [activeCategory] : allCategories).map((cat) => (
                  <li key={cat} style={{ marginBottom: 18 }}>
                    <h3
                      style={{
                        margin: "18px 0 10px 0",
                        color: "#6366f1",
                        fontWeight: 700,
                        fontSize: "1.15rem",
                        letterSpacing: 1,
                        borderBottom: "1px solid #e0e7ff",
                        paddingBottom: 4,
                      }}
                    >
                      {cat}
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {productsByCategory[cat].map((product) => (
                        <li
                          key={product._id}
                          className="foodItem"
                          style={{
                            background: "#fff",
                            borderRadius: 10,
                            boxShadow: "0 1px 4px #6366f122",
                            marginBottom: 14,
                            padding: "16px 28px", // Increased horizontal padding for width
                            display: "flex",
                            alignItems: "center",
                            border: cart[product._id] ? "2px solid #6366f1" : "1px solid #e0e7ff",
                            transition: "border 0.2s, box-shadow 0.2s",
                            gap: 24, // Increased gap for more space between image and content
                            width: "100%", // Ensure full width of container
                            boxSizing: "border-box", // Prevent overflow
                            minWidth: 0,
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            style={{
                              width: 54,
                              height: 54,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "1px solid #e0e7ff",
                              background: "#f3f4f6",
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: "1rem", color: "#3b3b5c", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {product.title}
                            </div>
                            <div style={{ color: "#6366f1", fontWeight: 600, fontSize: "0.98rem", marginTop: 2 }}>
                              ₹{product.price}
                              {product.offer && (
                                <span
                                  style={{
                                    marginLeft: 8,
                                    background: "#e0e7ff",
                                    color: "#6366f1",
                                    borderRadius: 5,
                                    padding: "1px 8px",
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  {product.offer}
                                </span>
                              )}
                            </div>
                          </div>
                          <div
                            className="cartControls"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <button
                              className="decreaseBtn"
                              onClick={() => removeFromCart(product)}
                              style={{
                                padding: "4px 10px",
                                backgroundColor: "#f3f4f6",
                                color: "#e53935",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "1.1rem",
                                fontWeight: 700,
                              }}
                            >
                              −
                            </button>
                            <span
                              style={{
                                minWidth: 18,
                                textAlign: "center",
                                fontWeight: 600,
                                color: "#3b3b5c",
                                fontSize: "1rem",
                              }}
                            >
                              {cart[product._id]?.quantity || 0}
                            </span>
                            <button
                              className="increaseBtn"
                              onClick={() => addToCart(product)}
                              style={{
                                padding: "4px 10px",
                                backgroundColor: "#6366f1",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "1.1rem",
                                fontWeight: 700,
                              }}
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
        <div className="orderMenuMobile" style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflowY: "auto",
          padding: "32px 24px 110px 24px",
          minHeight: 0,
        }}>
          <h2
            style={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: "1.7rem",
              marginBottom: 24,
              color: "#6366f1",
              letterSpacing: 1,
            }}
          >
            Order Menu
          </h2>
          {/* Category List (Collapsible) */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ color: "#3b3b5c", fontWeight: 700, marginBottom: 12, fontSize: "1.1rem" }}>
              Categories
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {allCategories.map((cat) => (
                <div key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                    style={{
                      padding: "10px 16px",
                      background: activeCategory === cat ? "#6366f1" : "#fff",
                      color: activeCategory === cat ? "#fff" : "#6366f1",
                      border: "1.5px solid #6366f1",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: "1rem",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ flex: 1, textAlign: "left" }}>{cat}</span>
                    <span
                      style={{
                        transition: "transform 0.3s",
                        display: "inline-block",
                        marginLeft: 8,
                        transform: activeCategory === cat ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    >
                      ▼
                    </span>
                  </button>
                  {activeCategory === cat && (
                    <div style={{ paddingLeft: 26, paddingTop: 8, paddingBottom: 16, borderLeft: "4px solid #6366f1", background: "#f9fafb", borderRadius: 8 }}>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {productsByCategory[cat].map((product) => (
                          <li
                            key={product._id}
                            className="foodItem"
                            style={{
                              background: "#fff",
                              borderRadius: 10,
                              boxShadow: "0 1px 4px #6366f122",
                              marginBottom: 14,
                              padding: "10px 14px",
                              display: "flex",
                              alignItems: "center",
                              border: cart[product._id] ? "2px solid #6366f1" : "1px solid #e0e7ff",
                              transition: "border 0.2s, box-shadow 0.2s",
                              gap: 14,
                            }}
                          >
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{
                                width: 54,
                                height: 54,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: "1px solid #e0e7ff",
                                background: "#f3f4f6",
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: "1rem", color: "#3b3b5c", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {product.title}
                              </div>
                              <div style={{ color: "#6366f1", fontWeight: 600, fontSize: "0.98rem", marginTop: 2 }}>
                                ₹{product.price}
                                {product.offer && (
                                  <span
                                    style={{
                                      marginLeft: 8,
                                      background: "#e0e7ff",
                                      color: "#6366f1",
                                      borderRadius: 5,
                                      padding: "1px 8px",
                                      fontSize: "0.85rem",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {product.offer}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div
                              className="cartControls"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <button
                                className="decreaseBtn"
                                onClick={() => removeFromCart(product)}
                                style={{
                                  padding: "4px 10px",
                                  backgroundColor: "#f3f4f6",
                                  color: "#e53935",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  fontSize: "1.1rem",
                                  fontWeight: 700,
                                }}
                              >
                                −
                              </button>
                              <span
                                style={{
                                  minWidth: 18,
                                  textAlign: "center",
                                  fontWeight: 600,
                                  color: "#3b3b5c",
                                  fontSize: "1rem",
                                }}
                              >
                                {cart[product._id]?.quantity || 0}
                              </span>
                              <button
                                className="increaseBtn"
                                onClick={() => addToCart(product)}
                                style={{
                                  padding: "4px 10px",
                                  backgroundColor: "#6366f1",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  fontSize: "1.1rem",
                                  fontWeight: 700,
                                }}
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
      <div
        className="checkoutBar"
        style={{
          position: "sticky",
          bottom: 0,
          right: 0,
          width: "100%",
          background: "linear-gradient(90deg, #6366f1 60%, #60a5fa 100%)",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 0,
          padding: "18px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          justifyContent: "center",
          alignItems: "stretch",
          boxShadow: "0px -2px 12px #6366f133",
          zIndex: 5,
        }}
      >
        <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff", textAlign: "center" }}>
          Total: ₹{total.toFixed(2)}
        </div>
        <button
          className="checkoutBtn"
          style={{
            padding: "12px 0",
            backgroundColor: "#fff",
            color: "#6366f1",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1.1rem",
            fontWeight: 700,
            boxShadow: "0 2px 8px #6366f133",
            transition: "background 0.2s, color 0.2s",
            width: "100%",
          }}
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

/* 
@media (max-width: 700px) {
  .sideMenu {
    width: 100vw !important;
    max-width: 100vw !important;
    min-width: 0 !important;
    padding: 0 !important;
  }
  .checkoutBar {
    padding: 14px 8px !important;
  }
}
*/
