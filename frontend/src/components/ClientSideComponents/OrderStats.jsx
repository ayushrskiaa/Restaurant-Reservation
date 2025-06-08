import PropTypes from "prop-types";

const OrderStats = ({ orders = [] }) => {
  const total = orders.length;
  const delivered = orders.filter(o => o.status === "Delivered").length;
  const pending = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const cancelled = orders.filter(o => o.status === "Cancelled").length;

  return (
    <div style={{ display: "flex", gap: 30, marginBottom: 24 }}>
      <div>Total Orders: <b>{total}</b></div>
      <div>Delivered: <b>{delivered}</b></div>
      <div>Pending: <b>{pending}</b></div>
      <div>Cancelled: <b>{cancelled}</b></div>
    </div>
  );
};

OrderStats.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default OrderStats;