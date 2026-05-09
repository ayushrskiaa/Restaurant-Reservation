import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Phone, CalendarDays } from "lucide-react";
import styles from "./Reservation.module.css";

const Reservation = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", date: "", time: "" });
  const navigate = useNavigate();

  const BASE_URL = window.location.hostname === "localhost"
    ? import.meta.env.VITE_BASE_URL
    : import.meta.env.VITE_PRODUCTION_URL;

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/reservation`,
        form,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      toast.success(data.message);
      setForm({ firstName: "", lastName: "", email: "", phone: "", date: "", time: "" });
      navigate("/success");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <section className={styles.section} id="reservation">
      <div className={styles.inner}>
        <div className={styles.imageSide}>
          <div className={styles.imageFrame}>
            <img src="/reservation.png" alt="Reserve a table" className={styles.image} />
          </div>
          <div className={styles.imageCaption}>
            <div className={styles.captionIcon}><CalendarDays size={18} /></div>
            <div>
              <div className={styles.captionTitle}>Private Events</div>
              <div className={styles.captionSub}>Birthdays & Anniversaries</div>
            </div>
          </div>
        </div>

        <div className={styles.formSide}>
          <div className={styles.formHeader}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelDash} /> Reservations
            </div>
            <h2 className={styles.heading}>Book Your Table,<br />Create Memories</h2>
            <div className={styles.contactLine}>
              <Phone size={14} />
              Need help? Call us at
              <span className={styles.phone}>+91 1234567890</span>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <input className={styles.input} type="text" placeholder="First Name" value={form.firstName} onChange={set("firstName")} required />
              <input className={styles.input} type="text" placeholder="Last Name" value={form.lastName} onChange={set("lastName")} required />
            </div>
            <div className={styles.row}>
              <input className={styles.input} type="date" value={form.date} onChange={set("date")} required />
              <input className={styles.input} type="time" value={form.time} onChange={set("time")} required />
            </div>
            <div className={styles.row}>
              <input className={styles.input} type="email" placeholder="Email Address" value={form.email} onChange={set("email")} required />
              <input className={styles.input} type="tel" placeholder="Phone Number" value={form.phone} onChange={set("phone")} required />
            </div>
            <button type="submit" className={styles.submitBtn}>
              Reserve My Table <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
