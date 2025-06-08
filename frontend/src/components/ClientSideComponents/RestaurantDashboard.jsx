import { useEffect, useState } from "react";
import axios from "axios";
import OrderFilter from "./OrderFilter";
import OrderTable from "./OrderTable";
import OrderStats from "./OrderStats";
import OrderAnalysis from "./OrderAnalysis";

// --- Product Management Component ---
const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [image, setImage] = useState(""); // image file name or url
  const [imageFile, setImageFile] = useState(null); // file object for upload
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("view"); // "view" or "add"
  const [editId, setEditId] = useState(null); // id of product being edited
  const [editData, setEditData] = useState({ title: "", price: "", offer: "", image: "" });
  const [editImageFile, setEditImageFile] = useState(null);
  const [category, setCategory] = useState("Main Course"); // default value

  const BASE_URL =
    window.location.hostname === "localhost"
      ? import.meta.env.VITE_BASE_URL
      : import.meta.env.VITE_PRODUCTION_URL;

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/products`, { withCredentials: true });
      setProducts(res.data.products || []);
    } catch {
      setMsg("Failed to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  // Add product
  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      let imgUrl = image;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await axios.post(`${BASE_URL}/api/v1/products/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        imgUrl = uploadRes.data.url; // Use Cloudinary URL
      }
      await axios.post(
        `${BASE_URL}/api/v1/products`,
        { title, price, offer, image: imgUrl, category },
        { withCredentials: true }
      );
      setTitle("");
      setPrice("");
      setOffer("");
      setImage("");
      setImageFile(null);
      setMsg("Product added!");
      fetchProducts();
      setTab("view");
    } catch {
      setMsg("Failed to add product.");
    }
  };

  // Start editing a product
  const handleEditStart = (prod) => {
    setEditId(prod._id);
    setEditData({
      title: prod.title,
      price: prod.price,
      offer: prod.offer || "",
      image: prod.image || ""
    });
    setEditImageFile(null);
  };

  // Save edited product
  const handleEditSave = async (id) => {
    setMsg("");
    try {
      let imgUrl = editData.image;
      if (editImageFile) {
        const formData = new FormData();
        formData.append("image", editImageFile);
        const uploadRes = await axios.post(`${BASE_URL}/api/v1/products/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        imgUrl = uploadRes.data.url; // Use Cloudinary URL
      }
      await axios.put(
        `${BASE_URL}/api/v1/products/${id}`,
        { ...editData, image: imgUrl },
        { withCredentials: true }
      );
      setMsg("Product updated!");
      setEditId(null);
      setEditData({ title: "", price: "", offer: "", image: "" });
      setEditImageFile(null);
      fetchProducts();
    } catch {
      setMsg("Failed to update product.");
    }
  };

  // Remove product
  const handleDelete = async (id) => {
    setMsg("");
    try {
      await axios.delete(`${BASE_URL}/api/v1/products/${id}`, { withCredentials: true });
      setMsg("Product deleted!");
      fetchProducts();
    } catch {
      setMsg("Failed to delete product.");
    }
  };

  // Tab button style
  const tabBtn = (active) => ({
    padding: "10px 32px",
    background: active ? "#6366f1" : "#f3f4f6",
    color: active ? "#fff" : "#333",
    border: "none",
    borderRadius: "8px 8px 0 0",
    fontWeight: 700,
    fontSize: "1.1rem",
    cursor: "pointer",
    marginRight: 2,
    boxShadow: active ? "0 2px 8px #6366f133" : "none",
    borderBottom: active ? "4px solid #6366f1" : "4px solid transparent",
    transition: "all 0.2s"
  });

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 32,
        boxShadow: "0 4px 24px #6366f122",
        margin: "32px auto",
        maxWidth: 1600, // Make Product Management as wide as the dashboard
        width: "100%",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24, color: "#3b3b5c" }}>Product Management</h2>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <button style={tabBtn(tab === "view")} onClick={() => setTab("view")}>See & Edit Current Items</button>
        <button style={tabBtn(tab === "add")} onClick={() => setTab("add")}>Add New Item</button>
      </div>
      {msg && <div style={{ color: "#6366f1", textAlign: "center", marginBottom: 16 }}>{msg}</div>}
      {tab === "view" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: 12, width: 100, textAlign: "center" }}>Image</th>
                <th style={{ padding: 12, width: 350, textAlign: "left" }}>Name</th>
                <th style={{ padding: 12, width: 120, textAlign: "right" }}>Price</th>
                <th style={{ padding: "12px 32px 12px 32px", width: 180, textAlign: "left" }}>Offer</th> {/* Add horizontal padding */}
                <th style={{ padding: 12, width: 180, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod._id}>
                  <td style={{ padding: 12, textAlign: "center" }}>
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.title}
                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }}
                      />
                    ) : (
                      <span style={{ color: "#aaa" }}>No Image</span>
                    )}
                  </td>
                  {editId === prod._id ? (
                    <>
                      <td style={{ padding: 12 }}>
                        <input
                          type="text"
                          value={editData.title}
                          onChange={e => setEditData({ ...editData, title: e.target.value })}
                          style={{ padding: 4, borderRadius: 4, border: "1px solid #ccc", minWidth: 100, width: "90%" }}
                        />
                      </td>
                      <td style={{ padding: 12, textAlign: "right" }}>
                        <input
                          type="number"
                          value={editData.price}
                          min={1}
                          onChange={e => setEditData({ ...editData, price: e.target.value })}
                          style={{ width: 80, padding: 4, borderRadius: 4, border: "1px solid #ccc", textAlign: "right" }}
                        />
                      </td>
                      <td style={{ padding: "12px 32px 12px 32px" }}>
                        <input
                          type="text"
                          value={editData.offer || ""}
                          onChange={e => setEditData({ ...editData, offer: e.target.value })}
                          style={{ width: "90%", padding: 4, borderRadius: 4, border: "1px solid #ccc" }}
                        />
                      </td>
                      <td style={{ padding: 12, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setEditImageFile(e.target.files[0])}
                        />
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => handleEditSave(prod._id)}
                            style={{
                              background: "#43a047",
                              color: "#fff",
                              border: "none",
                              borderRadius: 4,
                              padding: "4px 12px",
                              cursor: "pointer"
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            style={{
                              background: "#e53935",
                              color: "#fff",
                              border: "none",
                              borderRadius: 4,
                              padding: "4px 12px",
                              cursor: "pointer"
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: 12 }}>{prod.title}</td>
                      <td style={{ padding: 12, textAlign: "right" }}>{prod.price}</td>
                      <td style={{ padding: "12px 32px 12px 32px" }}>{prod.offer || ""}</td>
                      <td style={{ padding: 12, textAlign: "center" }}>
                        <button
                          onClick={() => handleEditStart(prod)}
                          style={{
                            background: "#6366f1",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 12px",
                            cursor: "pointer",
                            marginRight: 6
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          style={{
                            background: "#e53935",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 12px",
                            cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#888", padding: 16 }}>No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {tab === "add" && (
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 16, marginBottom: 24, justifyContent: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Product Name"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", minWidth: 160 }}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            min={1}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", minWidth: 100 }}
          />
          <input
            type="text"
            placeholder="Offer (optional)"
            value={offer}
            onChange={e => setOffer(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", minWidth: 120 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              setImageFile(e.target.files[0]);
              setImage(e.target.files[0]?.name || "");
            }}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", minWidth: 160 }}
            required
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
              minWidth: 140,
              background: "#f3f4f6",
              fontSize: "1rem"
            }}
          >
            <option value="Main Course">Main Course</option>
            <option value="Starter">Starter</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Snacks">Snacks</option>
            <option value="Other">Other</option>
          </select>
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
            Add Product
          </button>
        </form>
      )}
    </div>
  );
};
// --- End ProductManager ---

const statusOptions = [
  "Processing",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

const getDateString = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}${month}${year}`;
};

const RestaurantDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  // const [view, setView] = useState("order"); // "order" or "analysis"
  const [section, setSection] = useState("orders"); // orders | analysis | products

  const BASE_URL =
    window.location.hostname === "localhost"
      ? import.meta.env.VITE_BASE_URL
      : import.meta.env.VITE_PRODUCTION_URL;

  // Fetch all orders on mount
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/orderHistory/all`, {
        withCredentials: true,
      });
      setOrders(res.data.orders || []);
      setFilteredOrders(res.data.orders || []);
    } catch (err) {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Quick date filters
  const filterByDate = (type) => {
    setActiveFilter(type);
    const now = new Date();
    let filtered = orders;
    if (type === "today") {
      filtered = orders.filter((order) => {
        const d = new Date(order.createdAt);
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    } else if (type === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      filtered = orders.filter(
        (order) => new Date(order.createdAt) >= weekAgo
      );
    } else if (type === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      filtered = orders.filter(
        (order) => new Date(order.createdAt) >= monthAgo
      );
    }
    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/api/v1/orderHistory/status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setFilteredOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handlePaymentStatusChange = async (orderId, paymentDone) => {
    try {
      await axios.put(
        `${BASE_URL}/api/v1/orderHistory/status/${orderId}`,
        { paymentDone },
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, paymentDone } : order
        )
      );
      setFilteredOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, paymentDone } : order
        )
      );
    } catch (err) {
      alert("Failed to update payment status.");
    }
  };

  const handleFilter = ({ status, phone }) => {
    let filtered = orders;
    if (status) filtered = filtered.filter(o => o.status === status);
    if (phone) filtered = filtered.filter(o => o.phoneNumber?.includes(phone));
    setFilteredOrders(filtered);
    setActiveFilter("all");
  };

  // --- Styling ---
  const bgStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
    padding: "40px 0"
  };
  const cardStyle = {
    maxWidth: 1600, // Make all sections equally wide
    margin: "0 auto",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 32px rgba(60,60,120,0.10)",
    padding: 32
  };
  const titleStyle = {
    textAlign: "center",
    fontWeight: 700,
    fontSize: "2.2rem",
    marginBottom: 24,
    color: "#3b3b5c"
  };
  const filterBtn = (active) => ({
    padding: "10px 22px",
    background: active ? "linear-gradient(90deg,#6366f1,#60a5fa)" : "#f3f4f6",
    color: active ? "#fff" : "#333",
    border: "none",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: active ? "0 2px 8px #6366f133" : "none",
    transition: "all 0.2s"
  });
  const toggleBtn = (active) => ({
    padding: "10px 32px",
    background: active ? "#6366f1" : "#f3f4f6",
    color: active ? "#fff" : "#333",
    border: "none",
    borderRadius: "8px 8px 0 0",
    fontWeight: 700,
    fontSize: "1.1rem",
    cursor: "pointer",
    marginRight: 2,
    boxShadow: active ? "0 2px 8px #6366f133" : "none",
    borderBottom: active ? "4px solid #6366f1" : "4px solid transparent",
    transition: "all 0.2s"
  });

  return (
    <div style={bgStyle}>
      <div style={cardStyle}>
        {/* Toggle Button */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <button
            style={toggleBtn(section === "orders")}
            onClick={() => setSection("orders")}
          >
            Orders
          </button>
          <button
            style={toggleBtn(section === "analysis")}
            onClick={() => setSection("analysis")}
          >
            Analysis
          </button>
          <button
            style={toggleBtn(section === "products")}
            onClick={() => setSection("products")}
          >
            Products
          </button>
        </div>
        {/* Orders View */}
        {section === "orders" && (
          <div style={{ width: "100%" }}>
            <h2 style={titleStyle}>Restaurant Orders Dashboard</h2>
            <OrderStats orders={filteredOrders} />
            <div style={{ display: "flex", gap: 16, marginBottom: 24, justifyContent: "center" }}>
              <button style={filterBtn(activeFilter === "today")} onClick={() => filterByDate("today")}>Today</button>
              <button style={filterBtn(activeFilter === "week")} onClick={() => filterByDate("week")}>Last Week</button>
              <button style={filterBtn(activeFilter === "month")} onClick={() => filterByDate("month")}>Last Month</button>
              <button style={filterBtn(activeFilter === "all")} onClick={() => { setFilteredOrders(orders); setActiveFilter("all"); }}>All Time</button>
            </div>
            <OrderFilter onFilter={handleFilter} />
            {loading && <p style={{ textAlign: "center", color: "#6366f1", fontWeight: 600 }}>Loading orders...</p>}
            {error && (
              <div
                style={{
                  color: "#c62828",
                  background: "#ffebee",
                  padding: "10px",
                  borderRadius: "4px",
                  marginBottom: "20px",
                  textAlign: "center",
                  fontWeight: 600
                }}
              >
                {error}
              </div>
            )}
            {filteredOrders.length > 0 && (
              <OrderTable
                orders={filteredOrders}
                statusOptions={statusOptions}
                onStatusChange={handleStatusChange}
                onPaymentStatusChange={handlePaymentStatusChange}
                getDateString={getDateString}
              />
            )}
            {!loading && filteredOrders.length === 0 && (
              <p style={{ textAlign: "center", color: "#888", fontWeight: 500 }}>No orders found.</p>
            )}
          </div>
        )}
        {/* Analysis View */}
        {section === "analysis" && (
          <div style={{ width: "100%", textAlign: "center" }}>
            <h2 style={{ ...titleStyle, marginBottom: 32 }}>Orders Analysis</h2>
            <OrderAnalysis orders={orders} />
          </div>
        )}
        {/* Products View */}
        {section === "products" && (
          <div style={{ width: "100%" }}>
            <ProductManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;