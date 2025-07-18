import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || {};
  const total = location.state?.total || 0;

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const BASE_URL =
    window.location.hostname === "localhost"
      ? import.meta.env.VITE_BASE_URL
      : import.meta.env.VITE_PRODUCTION_URL;

  // Razorpay payment handler
  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    // Create order on backend (you should have an endpoint for this)
    let orderData;
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/payment/create-order`,
        { amount: total, receipt: `order_rcptid_${Date.now()}` }
      );
      orderData = data.order;
    } catch (err) {
      toast.error("Failed to initiate payment.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "RSKIAA'S CAFE",
      description: "Order Payment",
      order_id: orderData.id,
      handler: async function (response) {
        // Place order in backend after payment success
        try {
          await axios.post(
            `${BASE_URL}/api/v1/Orders`,
            {
              customerName,
              phoneNumber,
              address,
              items: Object.values(cart).map((item) => ({
                id: item.id || item._id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
              })),
              totalPrice: total,
              paymentMethod,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          toast.success("Order placed successfully!");
          navigate("/Success", {
            state: { customerName, phoneNumber, address, paymentMethod },
          });
        } catch (error) {
          toast.error("Order placement failed after payment.");
        }
      },
      prefill: {
        name: customerName,
        contact: phoneNumber,
      },
      theme: { color: "#6366f1" },
      method: {
        upi: paymentMethod === "UPI",
        card: paymentMethod === "Card",
        netbanking: false,
        wallet: false,
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

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

    // If UPI or Card, open Razorpay
    if (paymentMethod === "UPI" || paymentMethod === "Card") {
      handleRazorpayPayment();
      return;
    }

    // For COD, place order directly
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/Orders`,
        {
          customerName,
          phoneNumber,
          address,
          items: Object.values(cart).map((item) => ({
            id: item.id || item._id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          totalPrice: total,
          paymentMethod,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success(data.message || "Order placed successfully!");
      navigate("/Success", {
        state: { customerName, phoneNumber, address, paymentMethod },
      });

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <h1 style={{ textAlign: "center" }}>Checkout</h1>
        <div>
          <h2>Order Summary</h2>
          <ul style={{ padding: "0", listStyleType: "none" }}>
            {Object.values(cart).map((item) => (
              <li key={item.id} style={{ marginBottom: "10px" }}>
                <div>
                  <strong>{item.title}</strong> - ₹{item.price} x {item.quantity}
                </div>
              </li>
            ))}
          </ul>
          <h3>Total: ₹{total}</h3>
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
                  <option value="Card">Card</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </label>
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                type="submit"
              >
                Place Order
              </button>
              <button
                type="button"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#e53935",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
