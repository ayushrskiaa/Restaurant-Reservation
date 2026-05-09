import { useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./Reservation.module.css";

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
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      toast.success(data.message);
      setFirstName(""); setLastName(""); setPhone("");
      setEmail(""); setTime(""); setDate("");
      navigate("/success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <section className={styles.section} id="reservation">
      <div className={styles.inner}>

        {/* Image Side */}
        <div className={styles.imageSide}>
          <div className={styles.imageFrame}>
            <img src="/reservation.png" alt="Reserve a table" className={styles.image} />
          </div>
          <div className={styles.imageTag}>
            <div className={styles.tagIcon}>🎉</div>
            <div>
              <div className={styles.tagText}>Private Events</div>
              <div className={styles.tagSub}>Birthdays, Anniversaries & More</div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className={styles.formSide}>
          <div className={styles.formHeader}>
            <span className={styles.eyebrow}>📅 Reservations</span>
            <h2 className={styles.formTitle}>
              Book Your Table,<br /><span>Create Memories</span>
            </h2>
            <div className={styles.phoneRow}>
              <span className={styles.phoneIcon}>📞</span>
              <span>Need help? Call us at</span>
              <span className={styles.phoneNumber}>+91 1234567890</span>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleReservation}>
            <div className={styles.row}>
              <input
                className={styles.input}
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>

            <div className={styles.row}>
              <input
                className={styles.input}
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
              />
            </div>

            <div className={styles.row}>
              <input
                className={styles.input}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Reserve My Table <HiOutlineArrowNarrowRight size={20} />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Reservation;
