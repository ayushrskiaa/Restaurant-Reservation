import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import OrderTable from "./OrderTable";
import styles from "./OrderAnalysis.module.css";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";

const statusOptions = ["All", "Processing", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
const paymentOptions = ["All", "Cash on Delivery", "Online"];
const COLORS = ["#e85d04", "#16a34a", "#d97706", "#dc2626", "#0d9488", "#8b5cf6", "#0f0f0f"];

const STATUS_COLORS = {
  Delivered: "#16a34a",
  Cancelled: "#dc2626",
  Processing: "#1d4ed8",
  Preparing: "#d97706",
  "Out for Delivery": "#c2410c",
};

const getDateString = (date) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}${String(d.getMonth() + 1).padStart(2, "0")}${d.getFullYear()}`;
};

const exportOrdersToCSV = (orders, stats, from, to) => {
  const headers = ["S. No.", "Order ID", "Customer", "Phone", "Status", "Total", "Payment", "Order Date", "Items"];
  const rows = orders.map((order, idx) => [
    idx + 1, order._id, order.customerName || "N/A", order.phoneNumber || "N/A",
    order.status, order.totalPrice,
    order.paymentMethod + (order.paymentMethod === "Cash on Delivery" ? ` (${order.paymentDone ? "Done" : "Not Done"})` : ""),
    getDateString(order.createdAt),
    order.items.map(i => `${i.title} x ${i.quantity}`).join("; ")
  ]);

  let fromDate = "", toDate = "";
  if (orders.length > 0) {
    const sorted = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    fromDate = getDateString(sorted[0].createdAt);
    toDate = getDateString(sorted[sorted.length - 1].createdAt);
  } else {
    fromDate = from ? getDateString(from) : "";
    toDate = to ? getDateString(to) : "";
  }

  const statsRows = [
    [`Data from: ${fromDate} to ${toDate}`],
    [`Total Orders: ${stats.total}`], [`Delivered: ${stats.delivered}`],
    [`Pending: ${stats.pending}`], [`Cancelled: ${stats.cancelled}`],
    [`Total Income: ₹${stats.income}`], [""]
  ];

  const csvContent =
    statsRows.map(r => r.join(",")).join("\n") +
    headers.join(",") + "\n" +
    rows.map(r => r.map(f => `"${String(f).replace(/"/g, '""')}"`).join(",")).join("\n");

  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
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

  const filteredOrders = useMemo(() => orders.filter(order => {
    const d = new Date(order.createdAt);
    let ok = true;
    if (from) ok = ok && d >= new Date(from);
    if (to)   ok = ok && d <= new Date(to + "T23:59:59");
    if (status !== "All")  ok = ok && order.status === status;
    if (payment !== "All") ok = ok && order.paymentMethod === payment;
    if (item)     ok = ok && order.items.some(i => i.title.toLowerCase().includes(item.toLowerCase()));
    if (customer) ok = ok && order.customerName?.toLowerCase().includes(customer.toLowerCase());
    if (phone)    ok = ok && order.phoneNumber?.includes(phone);
    return ok;
  }), [orders, from, to, status, payment, item, customer, phone]);

  const total = filteredOrders.length;
  const delivered = filteredOrders.filter(o => o.status === "Delivered").length;
  const cancelled = filteredOrders.filter(o => o.status === "Cancelled").length;
  const pending = filteredOrders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const income = filteredOrders
    .filter(o => o.status === "Delivered" && (o.paymentMethod !== "Cash on Delivery" || o.paymentDone))
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const avgOrderValue = total > 0 ? (filteredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0) / total).toFixed(2) : 0;

  const topItems = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => o.items.forEach(i => { map[i.title] = (map[i.title] || 0) + i.quantity; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filteredOrders]);

  const orderTrends = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => { const d = getDateString(o.createdAt); map[d] = (map[d] || 0) + 1; });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [filteredOrders]);

  const paymentBreakdown = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => { map[o.paymentMethod] = (map[o.paymentMethod] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  const statusBreakdown = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  const topCustomers = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      if (!o.customerName || !o.phoneNumber) return;
      const key = `${o.customerName}__${o.phoneNumber}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([key, count]) => { const [name, phone] = key.split("__"); return { name, phone, count }; });
  }, [filteredOrders]);

  return (
    <div>
      {/* Filters */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>From</label>
          <input className={styles.filterInput} type="date" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>To</label>
          <input className={styles.filterInput} type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select className={styles.filterSelect} value={status} onChange={e => setStatus(e.target.value)}>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Payment</label>
          <select className={styles.filterSelect} value={payment} onChange={e => setPayment(e.target.value)}>
            {paymentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Item</label>
          <input className={styles.filterInput} type="text" value={item} onChange={e => setItem(e.target.value)} placeholder="Item name" />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Customer</label>
          <input className={styles.filterInput} type="text" value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Customer name" />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Phone</label>
          <input className={styles.filterInput} type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
        </div>
        <button
          className={styles.exportBtn}
          onClick={() => exportOrdersToCSV(filteredOrders, { total, delivered, pending, cancelled, income }, from, to)}
          disabled={filteredOrders.length === 0}
        >
          Export CSV
        </button>
      </div>

      {filteredOrders.length > 0 && (
        <p className={styles.dateRange}>
          Showing data from {getDateString(filteredOrders[0].createdAt)} to {getDateString(filteredOrders[filteredOrders.length - 1].createdAt)}
        </p>
      )}
      {filteredOrders.length === 0 && (
        <p className={styles.dateRange}>No data for selected filters.</p>
      )}

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total</div>
          <div className={styles.statNum}>{total}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Delivered</div>
          <div className={`${styles.statNum} ${styles.clrGreen}`}>{delivered}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Pending</div>
          <div className={`${styles.statNum} ${styles.clrOrange}`}>{pending}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Cancelled</div>
          <div className={`${styles.statNum} ${styles.clrRed}`}>{cancelled}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Income</div>
          <div className={`${styles.statNum} ${styles.clrTeal}`}>₹{income}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg. Order</div>
          <div className={`${styles.statNum} ${styles.clrAccent}`}>₹{avgOrderValue}</div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Payment Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={paymentBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {paymentBreakdown.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Status Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {statusBreakdown.map((entry, idx) => (
                  <Cell key={idx} fill={STATUS_COLORS[entry.name] || COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Top Customers</div>
          {topCustomers.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.875rem", textAlign: "center", marginTop: 32 }}>No data</p>
          ) : (
            <ul className={styles.topList}>
              {topCustomers.map(({ name, phone: ph, count }) => (
                <li key={name + ph} className={styles.topListItem}>
                  <div className={styles.topListInfo}>
                    <span className={styles.topListName}>{name}</span>
                    <span className={styles.topListPhone}>{ph}</span>
                  </div>
                  <span className={styles.topListCount}>{count} orders</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Orders trend */}
      <div className={styles.trendSection}>
        <div className={styles.trendTitle}>Orders Trend</div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={orderTrends}>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <CartesianGrid stroke="#e5e5e5" />
            <Line type="monotone" dataKey="count" stroke="#e85d04" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top selling items */}
      <div className={styles.trendSection}>
        <div className={styles.trendTitle}>Top Selling Items</div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topItems.map(([title, qty]) => ({ title, qty }))}>
            <XAxis dataKey="title" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <CartesianGrid stroke="#e5e5e5" />
            <Bar dataKey="qty" radius={[4, 4, 0, 0]}>
              {topItems.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <OrderTable
        orders={filteredOrders}
        statusOptions={statusOptions.slice(1)}
        onStatusChange={() => {}}
        onPaymentStatusChange={() => Promise.resolve()}
        getDateString={getDateString}
      />
    </div>
  );
};

OrderAnalysis.propTypes = { orders: PropTypes.array.isRequired };
export default OrderAnalysis;
