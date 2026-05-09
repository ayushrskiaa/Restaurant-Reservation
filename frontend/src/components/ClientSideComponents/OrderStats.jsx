import PropTypes from "prop-types";
import styles from "./OrderStats.module.css";

const OrderStats = ({ orders = [] }) => {
  const total = orders.length;
  const delivered = orders.filter(o => o.status === "Delivered").length;
  const pending = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const cancelled = orders.filter(o => o.status === "Cancelled").length;

  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.cardTotal}`}>
        <div className={styles.label}>Total Orders</div>
        <div className={styles.num}>{total}</div>
      </div>
      <div className={`${styles.card} ${styles.cardDelivered}`}>
        <div className={styles.label}>Delivered</div>
        <div className={`${styles.num} ${styles.numDelivered}`}>{delivered}</div>
      </div>
      <div className={`${styles.card} ${styles.cardPending}`}>
        <div className={styles.label}>Pending</div>
        <div className={`${styles.num} ${styles.numPending}`}>{pending}</div>
      </div>
      <div className={`${styles.card} ${styles.cardCancelled}`}>
        <div className={styles.label}>Cancelled</div>
        <div className={`${styles.num} ${styles.numCancelled}`}>{cancelled}</div>
      </div>
    </div>
  );
};

OrderStats.propTypes = { orders: PropTypes.array.isRequired };
export default OrderStats;
