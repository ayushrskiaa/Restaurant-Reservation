import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Reservation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const BASE_URL =
    window.location.hostname === "localhost"
      ? import.meta.env.VITE_BASE_URL
      : import.meta.env.VITE_PRODUCTION_URL;

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/reservation`,
        { firstName, lastName, email, phone, date, time },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setTime("");
      setDate("");
      navigate("/success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <section
      className="reservation"
      id="reservation"
      style={{
        background: "#f8fafc", // Match HeroSection background
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 48,
          padding: "40px 0",
        }}
      >
        {/* Image with height matching the reservation box */}
        <div
          className="banner"
          style={{
            flex: "1 1 350px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 320,
          }}
        >
          <img
            src="/reservation.png"
            alt="res"
            style={{
              width: "100%",
              maxWidth: 900,
              height: "650px", // Match the form box height
              // objectFit: "cover",
              borderRadius: 18,
              boxShadow: "0 4px 32px #6366f122",
              margin: "0 auto",
              display: "block",
            }}
          />
        </div>
        {/* Reservation Box */}
        <div
          className="banner"
          style={{
            flex: "1 1 400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: 340,
          }}
        >
          <div
            className="reservation_form_box"
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 4px 32px #6366f122",
              padding: "40px 32px",
              maxWidth: 420,
              width: "100%",
              margin: "0 auto",
              minHeight: "420px", // Match the image height
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                fontWeight: 700,
                color: "#6366f1",
                marginBottom: 8,
                fontSize: "2rem",
                textAlign: "center",
              }}
            >
              Want to celebrate your events?
            </h1>
            <h2
              style={{
                fontWeight: 700,
                color: "#3b3b5c",
                marginBottom: 12,
                fontSize: "1.4rem",
                textAlign: "center",
              }}
            >
              MAKE A RESERVATION
            </h2>
            <p
              style={{
                color: "#6366f1",
                fontWeight: 500,
                marginBottom: 0,
                textAlign: "center",
              }}
            >
              For Related Query, Please Call
            </p>
            <p
              style={{
                color: "#3b3b5c",
                fontWeight: 600,
                marginBottom: 24,
                fontSize: "1.1rem",
                textAlign: "center",
              }}
            >
              +91 1234567890
            </p>
            <form
              onSubmit={handleReservation}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 12, width: "100%" }}>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#f3f4f6",
                    fontSize: "1rem",
                  }}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#f3f4f6",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 12, width: "100%" }}>
                <input
                  type="date"
                  placeholder="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#f3f4f6",
                    fontSize: "1rem",
                  }}
                />
                <input
                  type="time"
                  placeholder="Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#f3f4f6",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 12, width: "100%" }}>
                <input
                  type="email"
                  placeholder="Email"
                  className="email_tag"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#f3f4f6",
                    fontSize: "1rem",
                  }}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#f3f4f6",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  marginTop: 8,
                  padding: "14px 0",
                  background: "linear-gradient(90deg, #6366f1 60%, #60a5fa 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  letterSpacing: 1,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #6366f133",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "background 0.2s",
                  width: "100%",
                }}
              >
                RESERVE NOW <HiOutlineArrowNarrowRight />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
