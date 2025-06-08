import { Link as RouterLink } from "react-router-dom"; // Import Link from react-router-dom

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="banner">
          <div className="left">
            {/* Add the new button link here */}
            <RouterLink
              to="/restaurant-dashboard"
              style={{
                display: "inline-block",
                padding: "10px 22px",
                background: "#6366f1",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 2px 8px #6366f133",
                marginRight: "12px"
              }}
            >
              Restaurant Dashboard
            </RouterLink>
          </div>
          <div className="right">
            <p>Open: 05:00 PM - 12:00 AM</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;