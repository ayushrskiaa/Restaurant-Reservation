import { useState } from "react";
import PropTypes from "prop-types";
import { data } from "../restApi.json";
import { useNavigate } from "react-router-dom";


const OrderMenu = ({ toggleSideMenu }) => {
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  const addToCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item.id]) {
        newCart[item.id].quantity += 1;
      } else {
        newCart[item.id] = { ...item, quantity: 1, price: item.price || 0 }; // Ensure price is set
      }
      return newCart;
    });
  };

  const removeFromCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item.id] && newCart[item.id].quantity > 0) {
        newCart[item.id].quantity -= 1;
        if (newCart[item.id].quantity === 0) {
          delete newCart[item.id]; // Remove item if quantity is 0
        }
      }
      return newCart;
    });
  };

  return (
    <div
      className="sideMenu"
      style={{
        position: "fixed",
        top: "0",
        right: "0",
        width: "400px",
        height: "100%",
        backgroundColor: "#f9f9f9",
        overflowY: "auto",
        boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <button className="closeBtn" onClick={toggleSideMenu}>
        Close
      </button>
      <ul>
        {data[0]?.dishes?.map((dish) => (
          <li key={dish.id} className="foodItem">
            <div className="foodDetails">
              <img
                src={dish.image}
                alt={dish.title}
                style={{
                  width: "50px",
                  height: "50px",
                  marginRight: "10px",
                }}
              />
              <div>
                <h3>{dish.title}</h3>
                <p>Price {dish.price}</p>
              </div>
            </div>
            <div
              className="cartControls"
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "22px",
              }}
            >
              <button
                className="decreaseBtn"
                onClick={() => removeFromCart(dish)}
                style={{
                  padding: "5px 10px",
                  marginRight: "10px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                -
              </button>
              <span style={{ margin: "0 10px", fontSize: "16px" }}>
                {cart[dish.id]?.quantity || 0}
              </span>
              <button
                className="increaseBtn"
                onClick={() => addToCart(dish)}
                style={{
                  padding: "5px 10px",
                  marginLeft: "10px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div
        className="checkoutBar"
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          backgroundColor: "#fff",
          borderTop: "1px solid #ccc",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          Total: ₹
          {Object.values(cart).reduce((total, item) => {
            console.log("Item in cart:", item); // Debugging
            return total + ((item.quantity || 0) * (item.price || 0));
          }, 0)}
        </div>
        <button
          className="checkoutBtn"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() => navigate("/checkOut", { state: { cart } })}
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