// import React from "react";
import { useState } from "react";
import Navbar from "./Navbar";
import OrderMenu from "./orderMenu";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { data } from "../restApi.json";

const HeroSection = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const popularDishImages = (data?.[0]?.dishes || []).slice(0, 8);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  return (
    <section
      className="heroSection"
      id="heroSection"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <div
        className="container"
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          padding: "24px 0 40px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Oswald', Arial, sans-serif", // Use same font as Navbar
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(248, 250, 252, 0.88) 0%, rgba(224, 231, 255, 0.82) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "-40px -40px -60px -40px",
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 14,
              transform: "rotate(-6deg)",
              opacity: 0.22,
              filter: "saturate(1.1)",
            }}
          >
            {popularDishImages.map((dish) => (
              <div
                key={dish.id}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 6px 24px rgba(60,60,120,0.12)",
                }}
              >
                <img
                  src={dish.image}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scale(1.06)",
                  }}
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

       

        <div
          style={{
            maxWidth: 900,
            width: "92%",
            textAlign: "center",
            color: "#3b3b5c",
            fontSize: "1.15rem",
            lineHeight: 1.6,
            fontWeight: 500,
            marginBottom: 18,
            opacity: 0.9,
            fontFamily: "'Oswald', Arial, sans-serif",
            position: "relative",
            zIndex: 2,
          }}
        >
          Order your favorites in seconds, or reserve a table for your next visit.
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 26,
            zIndex: 3,
            position: "relative",
          }}
        >
          <button
            onClick={toggleSideMenu}
            style={{
              padding: "12px 22px",
              background: "#f3f4f6",
              color: "#333",
              border: "2px solid black",
              borderRadius: "30px",
              fontWeight: 600,
              fontSize: "1.05rem",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              animation: "fadeIn 1.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <MdOutlineRestaurantMenu style={{ fontSize: "20px" }} />
            Order Food
          </button>

          <button
            onClick={() => scrollToSection("menu")}
            style={{
              padding: "12px 22px",
              background: "linear-gradient(90deg,#6366f1,#60a5fa)",
              color: "#fff",
              border: "none",
              borderRadius: "30px",
              fontWeight: 600,
              fontSize: "1.05rem",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              animation: "fadeIn 1.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <MdOutlineRestaurantMenu style={{ fontSize: "20px" }} />
            View Menu
          </button>

          <button
            onClick={() => scrollToSection("reservation")}
            style={{
              padding: "12px 22px",
              background: "#ffffff",
              color: "#333",
              border: "2px solid #6366f1",
              borderRadius: "30px",
              fontWeight: 600,
              fontSize: "1.05rem",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              animation: "fadeIn 1.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <MdOutlineDeliveryDining style={{ fontSize: "20px" }} />
            Reserve a Table
          </button>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "28px",
            marginTop: "6px",
            position: "relative",
            fontFamily: "'Oswald', Arial, sans-serif",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "28px",
              flexWrap: "wrap",
              width: "100%",
              maxWidth: 1100,
              marginBottom: "28px",
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
        </div>

        <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
          <div style={{ animation: "bounce 1.8s infinite" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 8v20M18 28l-8-8M18 28l8-8" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
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
        @media (max-width: 700px) {
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
          button {
            padding: 10px 20px !important;
            font-size: 1rem !important;
          }
        }
        `}
      </style>
      {sideMenuOpen && <OrderMenu toggleSideMenu={toggleSideMenu} />}
    </section>
  );
};

export default HeroSection;
