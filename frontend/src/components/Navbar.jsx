import { useState } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineShoppingCart } from "react-icons/hi";
// import { MdOutlineRestaurantMenu } from "react-icons/md";
import { MdOutlineDeliveryDining, MdOutlineAnalytics } from "react-icons/md"; // Add MdOutlineAnalytics import
import OrderMenu from "./orderMenu";
import OrderDetails from "./OrderDetails";
import { Link as RouterLink } from "react-router-dom"; // Import Link and useNavigate from react-router-dom

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false); // State for side menu
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false); // State for order details

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
    // Close order details if open
    if (orderDetailsOpen) setOrderDetailsOpen(false);
  };

  const toggleOrderDetails = () => {
    setOrderDetailsOpen(!orderDetailsOpen);
    // Close side menu if open
    if (sideMenuOpen) setSideMenuOpen(false);
  };

  return (
    <>
      <nav>
        <div className="logo">RSKIAA'S CAFE</div>

        {/* <button
          className="menuBtn"
          style={{ border: "2px solid black" }}
          onClick={toggleSideMenu}
        >
          <MdOutlineRestaurantMenu style={{ fontSize: "20px", marginRight: "5px" }} />
          DINE IN
        </button> */}
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

          <button className="menuBtn" onClick={toggleSideMenu}>
            <MdOutlineDeliveryDining style={{ fontSize: "20px", marginRight: "5px" }} />
            ORDER ONLINE
          </button>

          <button className="menuBtn" onClick={toggleOrderDetails}>
            <HiOutlineShoppingCart style={{ fontSize: "20px", marginRight: "5px" }} />
            ORDERS
          </button>
          <RouterLink to="/restaurant-dashboard" className="menuBtn" style={{ textDecoration: "none" }}>
            <MdOutlineAnalytics style={{ fontSize: "20px", marginRight: "5px" }} />
            VISIT ANALYTICS DASHBOARD
          </RouterLink>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>

      {/* Render the OrderMenu component */}
      {sideMenuOpen && <OrderMenu toggleSideMenu={toggleSideMenu} />}

      {/* Render the OrderDetails component */}
      {orderDetailsOpen && <OrderDetails toggleOrderDetails={toggleOrderDetails} />}
    </>
  );
};

export default Navbar;

