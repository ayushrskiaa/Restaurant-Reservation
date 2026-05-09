import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./OrderFilter.module.css";

const OrderFilter = ({ onFilter }) => {
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ status, phone });
  };

  return (
    <form className={styles.bar} onSubmit={handleSubmit}>
      <select
        className={styles.select}
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="Processing">Processing</option>
        <option value="Preparing">Preparing</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <input
        className={styles.input}
        type="text"
        placeholder="Filter by phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />
      <button type="submit" className={styles.btn}>Filter</button>
    </form>
  );
};

OrderFilter.propTypes = { onFilter: PropTypes.func.isRequired };
export default OrderFilter;
