import PropTypes from "prop-types";

const statCard = {
  background: "#f3f4f6",
  borderRadius: 12,
  padding: "18px 24px",
  minWidth: 120,
  textAlign: "center",
  boxShadow: "0 2px 8px #6366f122",
  fontWeight: 600,
  fontSize: "1.1rem",
  color: "#6366f1",
};

const OrderStats = ({ orders = [] }) => {
  const total = orders.length;
  const delivered = orders.filter(o => o.status === "Delivered").length;
  const pending = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const cancelled = orders.filter(o => o.status === "Cancelled").length;

  return (
    <div style={{
      display: "flex",
      gap: 18,
      marginBottom: 24,
      flexWrap: "wrap",
      justifyContent: "center"
    }}>
      <div style={statCard}>Total Orders<br /><span style={{ fontWeight: 700, fontSize: 22 }}>{total}</span></div>
      <div style={{ ...statCard, color: "#43a047" }}>Delivered<br /><span style={{ fontWeight: 700, fontSize: 22 }}>{delivered}</span></div>
      <div style={{ ...statCard, color: "#fb8c00" }}>Pending<br /><span style={{ fontWeight: 700, fontSize: 22 }}>{pending}</span></div>
      <div style={{ ...statCard, color: "#e53935" }}>Cancelled<br /><span style={{ fontWeight: 700, fontSize: 22 }}>{cancelled}</span></div>
    </div>
  );
};

OrderStats.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default OrderStats;