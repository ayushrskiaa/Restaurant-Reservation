import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || {};

  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); // State for payment method

  const totalAmount = Object.values(cart).reduce(
    (total, item) => total + (item.quantity || 0) * (item.price || 0),
    0
  );

  const handlePlaceOrder = () => {
    if (!address || !contact || !paymentMethod) {
      alert("Please fill in your address, contact details, and select a payment method.");
      return;
    }

    navigate("/Success", {
      state: { cart, address, contact, paymentMethod }, // Pass payment method to Success page
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundImage: "url('../public/background.svg')", // Replace with the path to your image
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "black", // Adjust text color for better visibility
      }}
    >
      <h1>Checkout</h1>
      <div>
        <h2>Order Summary</h2>
        <ul>
          {Object.values(cart).map((item) => (
            <li key={item.id} style={{ marginBottom: "10px" }}>
              <div>
                <strong>{item.title}</strong> - ₹{item.price} x {item.quantity}
              </div>
            </li>
          ))}
        </ul>
        <h3>Total: ₹{totalAmount}</h3>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Delivery Details</h2>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ color: "black" }}>
            Address:
            <textarea
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "transparent"
              }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your delivery address"
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ color: "black" }}>
            Contact Number:
            <input
              type="text"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "transparent",

              }}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your contact number"
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Payment Method:
            <select
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "transparent",

              }}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="" disabled>
                Select a payment method
              </option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="UPI">UPI</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </label>
        </div>
      </div>
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "20px",
        }}
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;