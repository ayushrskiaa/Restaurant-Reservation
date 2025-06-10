import PropTypes from "prop-types";
import { useState } from "react";

// Utility to export CSV
const exportOrdersToCSV = (orders, stats, getDateString) => {
  const headers = [
    "S. No.",
    "Order ID",
    "Customer",
    "Phone",
    "Status",
    "Total",
    "Payment",
    "Order Date",
    "Items"
  ];
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

  // Find date range
  let fromDate = "", toDate = "";
  if (orders.length > 0) {
    const sortedByDate = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    fromDate = getDateString ? getDateString(sortedByDate[0].createdAt) : sortedByDate[0].createdAt;
    toDate = getDateString ? getDateString(sortedByDate[sortedByDate.length - 1].createdAt) : sortedByDate[sortedByDate.length - 1].createdAt;
  }

  // Add stats and date range at the top
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

  // Add BOM for UTF-8
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `orders_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const OrderTable = ({
  orders,
  statusOptions,
  onStatusChange,
  onPaymentStatusChange,
  getDateString
}) => {
  const [updatingPayment, setUpdatingPayment] = useState(null);

  // Sort orders by createdAt descending (latest first)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Calculate stats
  const total = sortedOrders.length;
  const delivered = sortedOrders.filter(o => o.status === "Delivered").length;
  const cancelled = sortedOrders.filter(o => o.status === "Cancelled").length;
  const pending = sortedOrders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
  // Only add to income if status is Delivered AND (paymentMethod is not COD OR paymentDone is true)
  const income = sortedOrders
    .filter(
      o =>
        o.status === "Delivered" &&
        (o.paymentMethod !== "Cash on Delivery" || o.paymentDone)
    )
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // Map for status colors
  const statusColorMap = {
    Delivered: "#43a047",
    Cancelled: "#e53935",
    Pending: "#ffa000",
    Processing: "#1976d2",
    Completed: "#388e3c",
    Refunded: "#f57c00",
    "Cash on Delivery": "#8e24aa",
  };

  return sortedOrders.length === 0 ? (
    <p style={{ textAlign: "center" }}>No orders found.</p>
  ) : (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button
          onClick={() =>
            exportOrdersToCSV(sortedOrders, { total, delivered, pending, cancelled, income }, getDateString)
          }
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
          Export Table as CSV
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="OrderTable__table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>S. No.</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Order ID</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Customer</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Phone</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Total</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Payment</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Order Date</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Items</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, idx) => (
              <tr key={order._id}>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>{idx + 1}</td>
                <td data-label="Order ID" style={{ padding: 8, border: "1px solid #ddd" }}>{order._id}</td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>{order.customerName || "N/A"}</td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>{order.phoneNumber || "N/A"}</td>
                <td style={{ padding: 8, border: "1px solid #ddd", color: statusColorMap[order.status] || "#333", fontWeight: 700 }}>
                  {order.status}
                </td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>₹{order.totalPrice}</td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>
                  {order.paymentMethod === "Cash on Delivery" ? (
                    <>
                      <span>
                        {order.paymentDone ? "Done" : "Not Done"}
                      </span>
                      <br />
                      <button
                        style={{
                          marginTop: 4,
                          padding: "2px 8px",
                          fontSize: "12px",
                          background: order.paymentDone ? "#e53935" : "#43a047",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                        disabled={updatingPayment === order._id}
                        onClick={() => {
                          setUpdatingPayment(order._id);
                          onPaymentStatusChange(order._id, !order.paymentDone)
                            .finally(() => setUpdatingPayment(null));
                        }}
                      >
                        Mark as {order.paymentDone ? "Not Done" : "Done"}
                      </button>
                    </>
                  ) : (
                    order.paymentMethod
                  )}
                </td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>
                  {getDateString ? getDateString(order.createdAt) : order.createdAt}
                </td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.title} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order._id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Responsive styles for Order Table */}
      <style>
        {`
        @media (max-width: 900px) {
          .OrderTable__table, .OrderTable__table thead, .OrderTable__table tbody, .OrderTable__table th, .OrderTable__table td, .OrderTable__table tr {
            display: block !important;
            width: 100% !important;
          }
          .OrderTable__table thead {
            display: none !important;
          }
          .OrderTable__table tr {
            margin-bottom: 18px !important;
            background: #f9f9fb !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 8px #6366f122 !important;
            padding: 8px !important;
          }
          .OrderTable__table td {
            text-align: left !important;
            padding: 8px 4px !important;
            border: none !important;
            border-bottom: 1px solid #eee !important;
            font-size: 1rem !important;
          }
          .OrderTable__table td:before {
            content: attr(data-label);
            font-weight: 700;
            display: block;
            margin-bottom: 2px;
            color: #6366f1;
          }
        }
        @media (max-width: 600px) {
          .OrderTable__table td {
            font-size: 0.95rem !important;
          }
          .OrderTable__table tr {
            margin-bottom: 10px !important;
          }
        }
        `}
      </style>
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