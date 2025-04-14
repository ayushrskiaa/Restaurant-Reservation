import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"; // Ensure axios is imported
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || {};

  const [customerName, setCustomerName] = useState(""); // Collect customer name
  const [phoneNumber, setPhoneNumber] = useState(""); // Rename contact to phoneNumber
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePlaceOrder = async () => {
    if (!customerName || !phoneNumber || !address || !paymentMethod) {
      alert("Please fill in all required fields.");
      return;
    }

    const items = Object.values(cart).map((item) => ({
      id: item.id,
      title: item.title,
      price: Number(item.price) || 0, // Ensure price is a number
      quantity: Number(item.quantity) || 0, // Ensure quantity is a number
    }));

    const totalAmount = Object.values(cart).reduce(
      (total, item) => total + (Number(item.quantity) || 0) * (Number(item.price) || 0),
      0
    );

    console.log("Request Body:", {
      customerName,
      phoneNumber,
      items,
      totalPrice: totalAmount,
    });

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/orders",
        {
          customerName,
          phoneNumber,
          items,
          totalPrice: totalAmount,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Response Data:", data);
      toast.success(data.message || "Order placed successfully!");
      navigate("/Success", {
        state: { customerName, phoneNumber, address, paymentMethod },
      });
    } catch (error) {
      console.error("Error Response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to place the order. Please try again.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundImage: "url('../background.svg')", // Replace with the path to your image
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
                <strong>{item.title}</strong> - {item.price} x {item.quantity}
              </div>
            </li>
          ))}
        </ul>
        <h3>Total: {Object.values(cart).reduce(
          (total, item) => total + (Number(item.quantity) || 0) * (Number(item.price) || 0),
          0
        )}</h3>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Delivery Details</h2>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ color: "black" }}>
            Customer Name:
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
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ color: "black" }}>
            Phone Number:
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
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </label>
        </div>
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
                backgroundColor: "transparent",
              }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your delivery address"
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