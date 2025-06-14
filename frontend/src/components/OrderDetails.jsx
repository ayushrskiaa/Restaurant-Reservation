import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const OrderDetails = ({ toggleOrderDetails }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(true);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  
  // Use environment variables for the base URL
  const BASE_URL =
    window.location.hostname === "localhost"
      ? import.meta.env.VITE_BASE_URL
      : import.meta.env.VITE_PRODUCTION_URL;

  const fetchOrdersByPhone = async (phone) => {
    try {
      setLoading(true); 
      setError(null); 

      const response = await axios.get(`${BASE_URL}/api/v1/orderHistory/user/${phone}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, 
      });

      if (response.data.success) {
        // Sort orders by createdAt descending (latest first)
        const sortedOrders = [...response.data.orders].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        setShowPhoneInput(false);
      } else {
        setError("No orders found for this phone number.");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("No orders found for this phone number.");
      } else {
        setError("Failed to load orders. Please try again later.");
      }
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      fetchOrdersByPhone(phoneNumber);
    } else {
      setError("Please enter a valid 10-digit phone number.");
    }
  };

  const handleCancelClick = (orderId) => {
    setCancelOrderId(orderId);
    setShowCancelPopup(true);
  };

  const confirmCancelOrder = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/v1/orderHistory/cancel/${cancelOrderId}`,
        {},
        { withCredentials: true }
      );
      setShowCancelPopup(false);
      setCancelOrderId(null);
      fetchOrdersByPhone(phoneNumber);
    } catch (err) {
      alert("Failed to cancel order.");
      setShowCancelPopup(false);
      setCancelOrderId(null);
    }
  };

  const reorderOrder = async (orderId) => {
    try {
      await axios.post(
        `${BASE_URL}/api/v1/orderHistory/reorder/${orderId}`,
        {},
        { withCredentials: true }
      );
      // Refresh orders after reorder
      fetchOrdersByPhone(phoneNumber);
    } catch (err) {
      alert("Failed to reorder.");
    }
  };

  const cancelPopup = (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.4)", zIndex: 2000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", padding: 32, borderRadius: 8, minWidth: 300,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)", textAlign: "center"
      }}>
        <h3>Cancel Order</h3>
        <p>Are you sure you want to cancel this order?</p>
        <div style={{ marginTop: 20, display: "flex", gap: 16, justifyContent: "center" }}>
          <button
            onClick={confirmCancelOrder}
            style={{
              padding: "8px 20px", background: "#e53935", color: "#fff",
              border: "none", borderRadius: "4px", cursor: "pointer"
            }}
          >
            Yes, Cancel
          </button>
          <button
            onClick={() => { setShowCancelPopup(false); setCancelOrderId(null); }}
            style={{
              padding: "8px 20px", background: "#eee", color: "#333",
              border: "none", borderRadius: "4px", cursor: "pointer"
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="orderDetailsPage"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="orderDetailsContent"
        style={{
          width: "80%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflow: "auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          padding: "30px",
          position: "relative",
        }}
      >
        <button
          onClick={toggleOrderDetails}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#666",
          }}
        >
          ×
        </button>

        <h1 style={{ marginTop: "0", marginBottom: "30px", textAlign: "center", color: "#333" }}>
          Your Orders
        </h1>

        {showPhoneInput ? (
          <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
            <p style={{ textAlign: "center", marginBottom: "20px" }}>
              Enter your phone number to view your order history
            </p>

            {error && (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  borderRadius: "4px",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "16px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                disabled={loading}
              >
                {loading ? "Loading..." : "View Orders"}
              </button>
            </form>
          </div>
        ) : loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p>You do not have any orders yet.</p>
            <button
              onClick={() => setShowPhoneInput(true)}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="orders-container">
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  marginBottom: "25px",
                  padding: "20px",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                  borderLeft: order.status === "Delivered"
                    ? "4px solid #43a047"
                    : order.status === "Processing"
                    ? "4px solid #fb8c00"
                    : "4px solid #e53935",
                }}
              >
                <h2>Order #{order._id}</h2>
                <p>Status: <b>{order.status}</b></p>
                <p>Total: ${order.totalPrice.toFixed(2)}</p>
                <p>Payment Method: {order.paymentMethod}</p>
                <p>Delivery Address: {order.address}</p>
                <h3>Items:</h3>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.title} - {item.quantity} x ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: "10px" }}>
                  {order.status !== "Cancelled" && order.status !== "Delivered" && (
                    <button
                      onClick={() => handleCancelClick(order._id)}
                      style={{
                        marginRight: "10px",
                        padding: "8px 16px",
                        backgroundColor: "#e53935",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                  <button
                    onClick={() => reorderOrder(order._id)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#43a047",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Reorder
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => fetchOrdersByPhone(phoneNumber)}>
              Refresh Orders
            </button>
          </div>
        )}
        {showCancelPopup && cancelPopup}
      </div>
    </div>
  );
};

OrderDetails.propTypes = {
  toggleOrderDetails: PropTypes.func.isRequired,
};

export default OrderDetails;
