import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || {};
  const total = location.state?.total || 0; // Use total passed from OrderMenu

  console.log("Cart Data:", cart); // Debugging cart data

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Input validation
    if (!customerName || !phoneNumber || !address || !paymentMethod) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (address.length < 10) {
      toast.error("Address must be at least 10 characters long.");
      return;
    }

    if (Object.keys(cart).length === 0) {
      toast.error("Your cart is empty. Please add items to your cart before placing an order.");
      return;
    }

    if (total === 0) {
      toast.error("Total price cannot be zero. Please check the item prices.");
      return;
    }

    // Prepare items for the backend
    const items = Object.values(cart).map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));

    // Send data to the backend
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/Orders",
        {
          customerName,
          phoneNumber,
          address,
          items,
          totalPrice: total, // Use the total passed from OrderMenu
          paymentMethod,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(data.message || "Order placed successfully!");
      navigate("/Success", {
        state: { customerName, phoneNumber, address, paymentMethod },
      });

      // Reset form fields
      setCustomerName("");
      setPhoneNumber("");
      setAddress("");
      setPaymentMethod("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundImage: "url('../background.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "black",
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
        <h3>Total: ₹{total}</h3> {/* Display the total passed from OrderMenu */}
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Delivery Details</h2>
        <form onSubmit={handlePlaceOrder}>
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
                <option value="UPI">UPI</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </label>
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
            type="submit"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
