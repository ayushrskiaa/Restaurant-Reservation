import { useState } from "react";
import PropTypes from "prop-types";

const OrderFilter = ({ onFilter }) => {
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ status, phone });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 20,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          background: "#f3f4f6",
          fontSize: "1rem"
        }}
      >
        <option value="">All Statuses</option>
        <option value="Processing">Processing</option>
        <option value="Preparing">Preparing</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <input
        type="text"
        placeholder="Filter by phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: "1rem"
        }}
      />
      <button
        type="submit"
        style={{
          padding: "8px 18px",
          background: "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px #6366f133"
        }}
      >
        Filter
      </button>
    </form>
  );
};
OrderFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default OrderFilter;
