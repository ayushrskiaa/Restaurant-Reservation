import { useState } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false); // State for side menu
  const [cart, setCart] = useState({}); // State for cart items with quantities
  const navigate = useNavigate();

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item.id]) {
        newCart[item.id].quantity += 1;
      } else {
        newCart[item.id] = { ...item, quantity: 1 };
      }
      console.log("Updated cart:", newCart); // Debugging
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
      console.log("Updated cart:", newCart); // Debugging
      return newCart;
    });
  };

  return (
    <>
      <nav>
        <div className="logo">RSKIAA CAFE</div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            {data[0].navbarLinks.map((element) => (
              <Link
                to={element.link}
                spy={true}
                smooth={true}
                duration={500}
                key={element.id}
              >
                {element.title}
              </Link>
            ))}
          </div>
          <button className="menuBtn menuBtnOrder" onClick={toggleSideMenu}>
            ORDER NOW
          </button>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>

        <Link to="" spy={true} smooth={true} duration={500} className="menuBtn">
          ORDERS{" "}
          <span>
            <HiOutlineShoppingCart
              style={{ fontSize: "20px", marginTop: "1px" }}
            />
          </span>
        </Link>
      </nav>

      {/* Side Menu */}
      {sideMenuOpen && (
        <div
          className="sideMenu"
          style={{
            position: "fixed",
            top: "0",
            right: "0", // Align the side menu to the right side
            width: "400px", // Set the width of the side menu
            height: "100%", // Full height for the side menu
            backgroundColor: "#f9f9f9",
            overflowY: "auto", // Allow scrolling if content overflows
            boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)", // Shadow on the left side
          }}
        >
          <button className="closeBtn" onClick={toggleSideMenu}>
            Close
          </button>
          <ul>
            {data[0].dishes.map((dish) => (
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

          {/* Fixed Bar for Total Price and Checkout */}
          <div
            className="checkoutBar"
            style={{
              position: "absolute", // Position relative to the side menu
              bottom: "0", // Stick to the bottom of the side menu
              left: "0",
              width: "100%", // Match the width of the side menu
              backgroundColor: "#fff",
              borderTop: "1px solid #ccc",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)", // Optional shadow for better visibility
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
              Total: ₹
              {Object.values(cart).reduce((total, item) => {
                console.log("Item:", item); 
                return total + (item.quantity * item.price || 0);
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
              onClick={() => navigate("/checkOut", { state: { cart } })} // Navigates to the checkout page
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
