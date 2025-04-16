import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const OrderDetails = ({ toggleOrderDetails }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch orders
    const fetchOrders = async () => {
      try {
        // Get user ID from localStorage (assuming you store user info after login)
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          setError("Please log in to view your orders");
          setLoading(false);
          return;
        }
        
        // Make API call to your backend to fetch orders
        const response = await axios.get(`http://localhost:5000/api/v1/Orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
          position: "relative"
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

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="loading-spinner" style={{ marginBottom: "15px" }}></div>
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#d32f2f" }}>
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p>You do not have any orders yet.</p>
            <button
              onClick={toggleOrderDetails}
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
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="orders-container">
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  marginBottom: "25px",
                  padding: "20px",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  borderLeft: order.status === "Delivered" 
                    ? "4px solid #43a047" 
                    : order.status === "Processing" 
                      ? "4px solid #fb8c00" 
                      : "4px solid #e53935"
                }}
              >
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "15px" 
                }}>
                  <h2 style={{ margin: 0, fontSize: "20px", color: "#333" }}>
                    Order #{order.id}
                  </h2>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      backgroundColor: 
                        order.status === "Delivered" ? "#e8f5e9" :
                        order.status === "Processing" ? "#fff3e0" : "#ffebee",
                      color: 
                        order.status === "Delivered" ? "#2e7d32" :
                        order.status === "Processing" ? "#ef6c00" : "#c62828"
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <p style={{ color: "#666", margin: "0" }}>Order Date: {order.date}</p>
                  <p style={{ color: "#666", margin: "0" }}>Payment: {order.paymentMethod}</p>
                </div>

                <p style={{ color: "#666", margin: "0 0 15px" }}>
                  Delivery Address: {order.address}
                </p>

                <div style={{ marginTop: "20px" }}>
                  <h3 style={{ fontSize: "16px", margin: "0 0 10px", color: "#555" }}>
                    Order Items
                  </h3>
                  <div style={{ 
                    backgroundColor: "#fff", 
                    borderRadius: "4px", 
                    overflow: "hidden",
                    border: "1px solid #eee" 
                  }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f5f5f5" }}>
                          <th style={{ padding: "12px 15px", textAlign: "left", fontSize: "14px" }}>Item</th>
                          <th style={{ padding: "12px 15px", textAlign: "center", fontSize: "14px" }}>Quantity</th>
                          <th style={{ padding: "12px 15px", textAlign: "right", fontSize: "14px" }}>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, idx) => (
                          <tr key={idx} style={{ borderTop: "1px solid #eee" }}>
                            <td style={{ padding: "12px 15px", fontSize: "14px" }}>{item.name}</td>
                            <td style={{ padding: "12px 15px", textAlign: "center", fontSize: "14px" }}>{item.quantity}</td>
                            <td style={{ padding: "12px 15px", textAlign: "right", fontSize: "14px" }}>${item.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ borderTop: "2px solid #eee", backgroundColor: "#fafafa" }}>
                          <td colSpan="2" style={{ padding: "12px 15px", textAlign: "right", fontWeight: "bold", fontSize: "14px" }}>Total:</td>
                          <td style={{ padding: "12px 15px", textAlign: "right", fontWeight: "bold", fontSize: "14px" }}>${order.total.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div style={{ marginTop: "20px", textAlign: "right" }}>
                  <button
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "transparent",
                      color: "#4285f4",
                      border: "1px solid #4285f4",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "14px"
                    }}
                  >
                    Track Order
                  </button>
                  <button
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#4285f4",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
OrderDetails.propTypes = {
  toggleOrderDetails: PropTypes.func.isRequired,
};

export default OrderDetails;
