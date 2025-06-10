// import React from "react";
import { useState } from "react";
import Navbar from "./Navbar";
import OrderMenu from "./orderMenu";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { MdOutlineRestaurantMenu } from "react-icons/md";

const HeroSection = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  return (
    <section className="heroSection" id="heroSection">
      <Navbar />
      <div
        className="container"
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          marginTop: "40px",
          position: "relative",
          fontFamily: "'Oswald', Arial, sans-serif", // Use same font as Navbar
        }}
      >
        {/* Welcome message */}
        <div
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "linear-gradient(90deg, #ff512f 0%, #dd2476 100%)", // fallback for browsers not supporting background-clip
            marginBottom: "18px",
            letterSpacing: 1,
            textAlign: "center",
            animation: "fadeIn 1.2s",
            fontFamily: "'Oswald', Arial, sans-serif",
            background: "linear-gradient(90deg, #ff512f 0%, #dd2476 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Welcome to Our Food Ordering App!
        </div>
        {/* Amazing animated gradient border for the offer box */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "40px",
            marginTop: "20px",
            position: "relative",
            fontFamily: "'Oswald', Arial, sans-serif",
          }}
        >
          {/* Three words in a line with a subtle fade-in animation */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
              marginBottom: "48px",
              animation: "fadeIn 1.2s",
              zIndex: 2,
              fontFamily: "'Oswald', Arial, sans-serif",
            }}
          >
            <h1
              className="title"
              style={{
                margin: 0,
                transition: "color 0.3s",
                fontSize: "3.5rem",
                lineHeight: 1.1,
                fontWeight: 700,
                fontFamily: "'Oswald', Arial, sans-serif",
                 padding: "12px 10px",
              }}
            >
              Delicious.
            </h1>
            <h1
              className="title fresh"
              style={{
                margin: 0,
                transition: "color 0.3s",
                fontSize: "3.5rem",
                lineHeight: 1.1,
                fontWeight: 700,
                fontFamily: "'Oswald', Arial, sans-serif",
                 padding: "12px 10px",
              }}
            >
              Fresh.
            </h1>
            <h1
              className="title dishes_title third"
              style={{
                margin: 0,
                transition: "color 0.3s",
                fontSize: "3.5rem",
                lineHeight: 1.1,
                fontWeight: 700,
                fontFamily: "'Oswald', Arial, sans-serif",
                padding: "12px 10px",
                
              }}
            >
              Inviting.
            </h1>
          </div>

          {/* ORDER FOOD button - added between tagline and offer box */}
          <div style={{ marginTop: "8px", marginBottom: "20px",padding: "5px 20px", zIndex: 3 }}> 
            <button
              onClick={toggleSideMenu}
              style={{
                padding: "12px 28px",
                background: "#f3f4f6",
                color: "#333",
                border: "2px solid black",
                borderRadius: "30px",
                fontWeight: 600,
                fontSize: "1.1rem",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation: "fadeIn 1.2s",
                zIndex: 3
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              <MdOutlineRestaurantMenu style={{ fontSize: "20px" }} />
              ORDER FOOD
            </button>
          </div>
          
          {/* Sparkle effect */}
          <div
            style={{
              position: "absolute",
              
              top: 0,
              right: "10%",
              pointerEvents: "none",
              zIndex: 3,
              animation: "sparkle 2.5s infinite linear",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <g opacity="0.7">
                <circle cx="24" cy="24" r="2" fill="#ffe066" />
                <circle cx="10" cy="10" r="1.5" fill="#f59e42" />
                <circle cx="38" cy="14" r="1.2" fill="#10b981" />
                <circle cx="18" cy="38" r="1" fill="#6366f1" />
                <circle cx="40" cy="32" r="1.5" fill="#60a5fa" />
              </g>
            </svg>
          </div>
          {/* Offer of the day box with animated border */}
          <div
            className="offer-day-box"
            style={{
              background: "linear-gradient(90deg, #f0f4ff 0%, #e0f7fa 100%)",
              borderRadius: "22px", // Already present, but you can increase for more roundness
              padding: "38px 0",
              fontWeight: 700,
              textAlign: "center",
              maxWidth: 900,
              width: "90%",
              margin: "32px auto 0 auto",
              letterSpacing: 1,
              position: "relative",
              zIndex: 2,
              fontSize: "2.2rem",
              boxShadow: "0 8px 32pxrgba(0, 4, 239, 0.27)",
              border: "5px solid",
              borderImage: "linear-gradient(90deg,rgb(177, 55, 118) 0%, #10b981 100%) 1",
              animation: "borderGlow 2.5s infinite alternate",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "22px",
              flexWrap: "wrap",
              fontFamily: "'Oswald', Arial, sans-serif",
              // You can increase the radius for a more rounded look:
              // borderRadius: "32px",
            }}
          >
            <span role="img" aria-label="star" style={{ fontSize: "2.7rem", verticalAlign: "middle", color: "#ffe066" }}>🌟</span>
            <span style={{ fontWeight: 700, fontSize: "2rem", color: "#3b3b5c", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#f59e42", fontSize: "2.2rem" }}>🎁</span>
              Offer of the Day:
            </span>
            <span style={{ color: "#10b981", fontWeight: 700, fontSize: "2rem", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "2.1rem" }}>💸</span>
              Get <span style={{ color: "#6366f1", margin: "0 6px" }}>20% OFF</span>
            </span>
            <span style={{ color: "#6366f1", fontWeight: 600, fontSize: "1.3rem", marginLeft: 10 }}>
              on your first order!
            </span>
          </div>
        </div>
        {/* Order Food button */}
        <div style={{ marginTop: "32px", marginBottom: "24px" }}>
          <button
            onClick={toggleSideMenu}
            style={{
              padding: "12px 28px",
              background: "linear-gradient(90deg,#6366f1,#60a5fa)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3)",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              animation: "fadeIn 1.2s"
            }}
            onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
          >
            <MdOutlineDeliveryDining style={{ fontSize: "24px" }} />
            ORDER FOOD
          </button>
        </div>
        {/* Subtle animated scroll-down arrow */}
        <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
          <div style={{ animation: "bounce 1.8s infinite" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 8v20M18 28l-8-8M18 28l8-8" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      {/* Keyframes for animation */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes borderGlow {
          0% { box-shadow: 0 0 24px #6366f133, 0 0 0 #60a5fa00; }
          100% { box-shadow: 0 0 32pxrgba(208, 58, 163, 0.67), 0 0 16px #60a5fa77; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(12px);}
        }
        @keyframes sparkle {
          0% { opacity: 0.7; transform: scale(1);}
          50% { opacity: 1; transform: scale(1.15);}
          100% { opacity: 0.7; transform: scale(1);}
        }
        /* Responsive styles for offer box and headings */
        @media (max-width: 700px) {
          .offer-day-box {
            flex-direction: column !important;
            gap: 10px !important;
            padding: 18px 6px !important;
            font-size: 1.1rem !important;
            width: 99% !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
          }
          .heroSection h1.title,
          .heroSection h1.fresh,
          .heroSection h1.dishes_title {
            font-size: 1.5rem !important;
            text-align: center !important;
            padding: 6px 2px !important;
          }
          .heroSection .container {
            padding-left: 2vw !important;
            padding-right: 2vw !important;
          }
          .offer-day-box span {
            font-size: 1.1rem !important;
          }
          button {
            padding: "10px 20px" !important;
            font-size: "1rem" !important;
          }
        }
        `}
      </style>
      {/* Add the OrderMenu component */}
      {sideMenuOpen && <OrderMenu toggleSideMenu={toggleSideMenu} />}
    </section>
  );
};

export default HeroSection;
