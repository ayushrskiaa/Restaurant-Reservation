import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./OrderTable.module.css";

const exportOrdersToCSV = (orders, stats, getDateString) => {
  const headers = ["S. No.", "Order ID", "Customer", "Phone", "Status", "Total", "Payment", "Order Date", "Items"];
  const rows = orders.map((order, idx) => [
    idx + 1,
    order._id,
    order.customerName || "N/A",
    order.phoneNumber || "N/A",
    order.status,
    order.totalPrice,
    order.paymentMethod + (order.paymentMethod === "Cash on Delivery" ? ` (${order.paymentDone ? "Done" : "Not Done"})` : ""),
    getDateString ? getDateString(order.createdAt) : order.createdAt,
    order.items.map(item => `${item.title} x ${item.quantity}`).join("; ")
  ]);

  let fromDate = "", toDate = "";
  if (orders.length > 0) {
    const sorted = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    fromDate = getDateString ? getDateString(sorted[0].createdAt) : sorted[0].createdAt;
    toDate = getDateString ? getDateString(sorted[sorted.length - 1].createdAt) : sorted[sorted.length - 1].createdAt;
  }

  const statsRows = [
    [`Data from: ${fromDate} to ${toDate}`],
    [`Total Orders: ${stats.total}`],
    [`Delivered: ${stats.delivered}`],
    [`Pending: ${stats.pending}`],
    [`Cancelled: ${stats.cancelled}`],
    [`Total Income: ₹${stats.income}`],
    [""]
  ];

  const csvContent =
    statsRows.map(r => r.join(",")).join("\n") +
    headers.join(",") + "\n" +
    rows.map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")).join("\n");

  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `orders_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const statusBadgeClass = (status) => {
  switch (status) {
    case "Delivered":       return styles.delivered;
    case "Processing":      return styles.processing;
    case "Preparing":       return styles.preparing;
    case "Out for Delivery":return styles.outDelivery;
    case "Cancelled":       return styles.cancelled;
    default:                return styles.statusDefault;
  }
};

const OrderTable = ({ orders, statusOptions, onStatusChange, onPaymentStatusChange, getDateString }) => {
  const [updatingPayment, setUpdatingPayment] = useState(null);

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = sortedOrders.length;
  const delivered = sortedOrders.filter(o => o.status === "Delivered").length;
  const cancelled = sortedOrders.filter(o => o.status === "Cancelled").length;
  const pending = sortedOrders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const income = sortedOrders
    .filter(o => o.status === "Delivered" && (o.paymentMethod !== "Cash on Delivery" || o.paymentDone))
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  if (sortedOrders.length === 0) {
    return <p className={styles.noOrders}>No orders found.</p>;
  }

  return (
    <>
      <div className={styles.exportRow}>
        <button
          className={styles.exportBtn}
          onClick={() => exportOrdersToCSV(sortedOrders, { total, delivered, pending, cancelled, income }, getDateString)}
        >
          Export as CSV
        </button>
      </div>

      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Items</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, idx) => (
              <tr key={order._id}>
                <td data-label="#">{idx + 1}</td>
                <td data-label="Order ID" style={{ fontSize: "0.78rem", wordBreak: "break-all" }}>{order._id}</td>
                <td data-label="Customer">{order.customerName || "N/A"}</td>
                <td data-label="Phone">{order.phoneNumber || "N/A"}</td>
                <td data-label="Status">
                  <span className={`${styles.badge} ${statusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td data-label="Total">₹{order.totalPrice}</td>
                <td data-label="Payment">
                  {order.paymentMethod === "Cash on Delivery" ? (
                    <>
                      <span className={styles.paymentLabel}>
                        COD — {order.paymentDone ? "Paid" : "Unpaid"}
                      </span>
                      <button
                        className={`${styles.paymentToggle} ${order.paymentDone ? styles.paymentDone : styles.paymentNotDone}`}
                        disabled={updatingPayment === order._id}
                        onClick={() => {
                          setUpdatingPayment(order._id);
                          onPaymentStatusChange(order._id, !order.paymentDone)
                            .finally(() => setUpdatingPayment(null));
                        }}
                      >
                        Mark {order.paymentDone ? "Unpaid" : "Paid"}
                      </button>
                    </>
                  ) : (
                    order.paymentMethod
                  )}
                </td>
                <td data-label="Date">
                  {getDateString ? getDateString(order.createdAt) : order.createdAt}
                </td>
                <td data-label="Items">
                  <ul className={styles.itemsList}>
                    {order.items.map((item, i) => (
                      <li key={i}>{item.title} × {item.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td data-label="Update Status">
                  <select
                    className={styles.statusSelect}
                    value={order.status}
                    onChange={e => onStatusChange(order._id, e.target.value)}
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

OrderTable.propTypes = {
  orders: PropTypes.array.isRequired,
  statusOptions: PropTypes.array.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onPaymentStatusChange: PropTypes.func.isRequired,
  getDateString: PropTypes.func,
};

export default OrderTable;
