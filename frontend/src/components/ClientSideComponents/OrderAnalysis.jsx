import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import OrderTable from "./OrderTable";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";

const statusOptions = [
  "All",
  "Processing",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

const paymentOptions = [
  "All",
  "Cash on Delivery",
  "Online"
];

const COLORS = ["#6366f1", "#43a047", "#fb8c00", "#e53935", "#0d9488", "#f59e42", "#3b3b5c"];

const getDateString = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}${month}${year}`;
};

// Utility to export CSV with date range and stats
const exportOrdersToCSV = (orders, stats, getDateString, from, to) => {
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
  } else {
    fromDate = from ? getDateString(from) : "";
    toDate = to ? getDateString(to) : "";
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
  link.setAttribute("download", `orders_analysis_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const OrderAnalysis = ({ orders }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("All");
  const [payment, setPayment] = useState("All");
  const [item, setItem] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");

  // Filter orders by date, status, payment, item, customer, phone
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      let valid = true;
      if (from) valid = valid && orderDate >= new Date(from);
      if (to) valid = valid && orderDate <= new Date(to + "T23:59:59");
      if (status !== "All") valid = valid && order.status === status;
      if (payment !== "All") valid = valid && order.paymentMethod === payment;
      if (item)
        valid = valid && order.items.some(i => i.title.toLowerCase().includes(item.toLowerCase()));
      if (customer)
        valid = valid && order.customerName?.toLowerCase().includes(customer.toLowerCase());
      if (phone)
        valid = valid && order.phoneNumber?.includes(phone);
      return valid;
    });
  }, [orders, from, to, status, payment, item, customer, phone]);

  // Stats
  const total = filteredOrders.length;
  const delivered = filteredOrders.filter(o => o.status === "Delivered").length;
  const cancelled = filteredOrders.filter(o => o.status === "Cancelled").length;
  const pending = filteredOrders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const income = filteredOrders
    .filter(
      o =>
        o.status === "Delivered" &&
        (o.paymentMethod !== "Cash on Delivery" || o.paymentDone)
    )
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const avgOrderValue = total > 0 ? (filteredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0) / total).toFixed(2) : 0;

  // Top selling items
  const topItems = useMemo(() => {
    const itemMap = {};
    filteredOrders.forEach(order => {
      order.items.forEach(i => {
        itemMap[i.title] = (itemMap[i.title] || 0) + i.quantity;
      });
    });
    return Object.entries(itemMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [filteredOrders]);

  // Orders trend (for line chart)
  const orderTrends = useMemo(() => {
    const map = {};
    filteredOrders.forEach(order => {
      const date = getDateString(order.createdAt);
      map[date] = (map[date] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [filteredOrders]);

  // Payment method breakdown (for pie chart)
  const paymentBreakdown = useMemo(() => {
    const map = {};
    filteredOrders.forEach(order => {
      map[order.paymentMethod] = (map[order.paymentMethod] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  // Status breakdown (for pie chart)
  const statusBreakdown = useMemo(() => {
    const map = {};
    filteredOrders.forEach(order => {
      map[order.status] = (map[order.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  // Customer frequency (top customers with phone numbers)
  const topCustomers = useMemo(() => {
    const map = {};
    filteredOrders.forEach(order => {
      if (!order.customerName || !order.phoneNumber) return;
      const key = `${order.customerName}__${order.phoneNumber}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, count]) => {
        const [name, phone] = key.split("__");
        return { name, phone, count };
      });
  }, [filteredOrders]);

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 4px 24px #6366f122", margin: "32px auto", maxWidth: 1200 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24, color: "#3b3b5c" }}>Order Analysis Tool</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
        <div>
          <label>From: </label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label>To: </label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div>
          <label>Status: </label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label>Payment: </label>
          <select value={payment} onChange={e => setPayment(e.target.value)}>
            {paymentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label>Item: </label>
          <input type="text" value={item} onChange={e => setItem(e.target.value)} placeholder="Item name" />
        </div>
        <div>
          <label>Customer: </label>
          <input type="text" value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Customer name" />
        </div>
        <div>
          <label>Phone: </label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
        </div>
        <button
          style={{
            padding: "8px 18px",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px #6366f133",
            marginLeft: 16
          }}
          onClick={() => exportOrdersToCSV(filteredOrders, { total, delivered, pending, cancelled, income }, getDateString, from, to)}
          disabled={filteredOrders.length === 0}
        >
          Export Analysis as CSV
        </button>
      </div>
      <div style={{ textAlign: "center", marginBottom: 16, color: "#6366f1", fontWeight: 500 }}>
        {filteredOrders.length > 0
          ? `Data from: ${
              filteredOrders.length > 0
                ? getDateString(filteredOrders[0].createdAt)
                : ""
            } to ${
              filteredOrders.length > 0
                ? getDateString(filteredOrders[filteredOrders.length - 1].createdAt)
                : ""
            }`
          : "No data for selected filters."}
      </div>
      <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ background: "#f3f4f6", borderRadius: 8, padding: 16, minWidth: 120, textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Total</div>
          <div style={{ fontSize: 22, color: "#6366f1" }}>{total}</div>
        </div>
        <div style={{ background: "#f3f4f6", borderRadius: 8, padding: 16, minWidth: 120, textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Delivered</div>
          <div style={{ fontSize: 22, color: "#43a047" }}>{delivered}</div>
        </div>
        <div style={{ background: "#f3f4f6", borderRadius: 8, padding: 16, minWidth: 120, textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Pending</div>
          <div style={{ fontSize: 22, color: "#fb8c00" }}>{pending}</div>
        </div>
        <div style={{ background: "#f3f4f6", borderRadius: 8, padding: 16, minWidth: 120, textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Cancelled</div>
          <div style={{ fontSize: 22, color: "#e53935" }}>{cancelled}</div>
        </div>
        <div style={{ background: "#f3f4f6", borderRadius: 8, padding: 16, minWidth: 160, textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Total Income</div>
          <div style={{ fontSize: 22, color: "#0d9488" }}>₹{income}</div>
        </div>
        <div style={{ background: "#f3f4f6", borderRadius: 8, padding: 16, minWidth: 160, textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Avg. Order Value</div>
          <div style={{ fontSize: 22, color: "#6366f1" }}>₹{avgOrderValue}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", margin: "32px 0" }}>
        <div style={{ background: "#f9fafb", borderRadius: 8, padding: 16, minWidth: 320 }}>
          <h4 style={{ textAlign: "center" }}>Payment Method Breakdown</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={paymentBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {paymentBreakdown.map((entry, idx) => (
                  <Cell key={`cell-p-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#f9fafb", borderRadius: 8, padding: 16, minWidth: 320 }}>
          <h4 style={{ textAlign: "center" }}>Order Status Breakdown</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name }) => {
                  if (name === "Cancelled") return <span style={{ color: "#e53935" }}>{name}</span>;
                  if (name === "Delivered") return <span style={{ color: "#43a047" }}>{name}</span>;
                  if (name === "Processing") return <span style={{ color: "#2563eb" }}>{name}</span>;
                  return name;
                }}
              >
                {statusBreakdown.map((entry, idx) => {
                  let fill = COLORS[idx % COLORS.length];
                  if (entry.name === "Cancelled") fill = "#e53935";
                  if (entry.name === "Delivered") fill = "#43a047";
                  if (entry.name === "Processing") fill = "#2563eb";
                  return <Cell key={`cell-s-${idx}`} fill={fill} />;
                })}
              </Pie>
              <Legend
                formatter={(value) => {
                  if (value === "Cancelled") return <span style={{ color: "#e53935" }}>{value}</span>;
                  if (value === "Delivered") return <span style={{ color: "#43a047" }}>{value}</span>;
                  if (value === "Processing") return <span style={{ color: "#2563eb" }}>{value}</span>;
                  return value;
                }}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#f9fafb", borderRadius: 8, padding: 16, minWidth: 320 }}>
          <h4 style={{ textAlign: "center" }}>Top Customers</h4>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {topCustomers.map(({ name, phone, count }) => (
              <li key={name + phone} style={{ padding: "4px 0", fontWeight: 500 }}>
                {name} ({phone}): {count} orders
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ margin: "32px 0" }}>
        <h4>Orders Trend</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={orderTrends}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <CartesianGrid stroke="#eee" />
            <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ margin: "24px 0" }}>
        <h4>Top Selling Items</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topItems.map(([title, qty]) => ({ title, qty }))}>
            <XAxis dataKey="title" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <CartesianGrid stroke="#eee" />
            <Bar dataKey="qty" fill="#6366f1">
              {topItems.map((entry, idx) => (
                <Cell key={`cell-bar-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <OrderTable
        orders={filteredOrders}
        statusOptions={statusOptions.slice(1)}
        onStatusChange={() => {}}
        onPaymentStatusChange={() => {}}
        getDateString={getDateString}
      />
    </div>
  );
};
OrderAnalysis.propTypes = {
  orders: PropTypes.array.isRequired
};

export default OrderAnalysis;
