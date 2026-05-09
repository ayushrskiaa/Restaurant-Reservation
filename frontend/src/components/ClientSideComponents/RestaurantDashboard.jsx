import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import OrderFilter from "./OrderFilter";
import OrderTable from "./OrderTable";
import OrderStats from "./OrderStats";
import OrderAnalysis from "./OrderAnalysis";
import styles from "./RestaurantDashboard.module.css";

// --- Product Manager ---
const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("view");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: "", price: "", image: "" });
  const [editImageFile, setEditImageFile] = useState(null);
  const [category, setCategory] = useState("Main Course");

  const BASE_URL = window.location.hostname === "localhost"
    ? import.meta.env.VITE_BASE_URL
    : import.meta.env.VITE_PRODUCTION_URL;

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/products`, { withCredentials: true });
      setProducts(res.data.products || []);
    } catch {
      setMsg("Failed to load products.");
    }
  };

  useEffect(() => { fetchProducts(); }, []); // eslint-disable-line

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      let imgUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await axios.post(`${BASE_URL}/api/v1/products/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        imgUrl = uploadRes.data.url;
      }
      await axios.post(`${BASE_URL}/api/v1/products`, { title, price, image: imgUrl, category }, { withCredentials: true });
      setTitle(""); setPrice(""); setImageFile(null);
      setMsg("Product added!");
      fetchProducts();
      setTab("view");
    } catch {
      setMsg("Failed to add product.");
    }
  };

  const handleEditStart = (prod) => {
    setEditId(prod._id);
    setEditData({ title: prod.title, price: prod.price, image: prod.image || "" });
    setEditImageFile(null);
  };

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
        imgUrl = uploadRes.data.url;
      }
      await axios.put(`${BASE_URL}/api/v1/products/${id}`, { ...editData, image: imgUrl }, { withCredentials: true });
      setMsg("Product updated!");
      setEditId(null);
      setEditData({ title: "", price: "", image: "" });
      setEditImageFile(null);
      fetchProducts();
    } catch {
      setMsg("Failed to update product.");
    }
  };

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

  const isError = msg.toLowerCase().startsWith("failed");

  return (
    <div className={styles.pmWrap}>
      <div className={styles.pmTabBar}>
        <button
          className={`${styles.pmTab} ${tab === "view" ? styles.active : ""}`}
          onClick={() => setTab("view")}
        >
          Current Items
        </button>
        <button
          className={`${styles.pmTab} ${tab === "add" ? styles.active : ""}`}
          onClick={() => setTab("add")}
        >
          Add New Item
        </button>
      </div>

      {msg && (
        <div className={`${styles.pmMsg} ${isError ? styles.pmMsgError : ""}`}>{msg}</div>
      )}

      {tab === "view" && (
        <div className={styles.tableWrap}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod._id}>
                  <td data-label="Image">
                    {prod.image
                      ? <img src={prod.image} alt={prod.title} className={styles.productThumb} />
                      : <span className={styles.productThumbEmpty}>No image</span>
                    }
                  </td>

                  {editId === prod._id ? (
                    <>
                      <td data-label="Name">
                        <input
                          className={styles.editInput}
                          type="text"
                          value={editData.title}
                          onChange={e => setEditData({ ...editData, title: e.target.value })}
                        />
                      </td>
                      <td data-label="Price" className={styles.tdRight}>
                        <input
                          className={`${styles.editInput} ${styles.editInputPrice}`}
                          type="number"
                          value={editData.price}
                          min={1}
                          onChange={e => setEditData({ ...editData, price: e.target.value })}
                        />
                      </td>
                      <td data-label="Actions">
                        <div className={styles.editActionsCell}>
                          <input type="file" accept="image/*" onChange={e => setEditImageFile(e.target.files[0])} />
                          <div className={styles.editBtnRow}>
                            <button className={styles.btnSave} onClick={() => handleEditSave(prod._id)}>Save</button>
                            <button className={styles.btnCancel} onClick={() => setEditId(null)}>Cancel</button>
                          </div>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td data-label="Name">{prod.title}</td>
                      <td data-label="Price" className={styles.tdRight}>₹{prod.price}</td>
                      <td data-label="Actions" className={styles.tdCenter}>
                        <button className={styles.btnEdit} onClick={() => handleEditStart(prod)}>Edit</button>
                        <button className={styles.btnDelete} onClick={() => handleDelete(prod._id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.noProducts}>No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "add" && (
        <form className={styles.addForm} onSubmit={handleAdd}>
          <input
            className={styles.addInput}
            type="text"
            placeholder="Product name"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            className={styles.addInput}
            type="number"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            min={1}
            style={{ minWidth: 110 }}
          />
          <input
            className={styles.addFileInput}
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            required
          />
          <select
            className={styles.addSelect}
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="Main Course">Main Course</option>
            <option value="Starter">Starter</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Snacks">Snacks</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" className={styles.btnAdd}>Add Product</button>
        </form>
      )}
    </div>
  );
};
// --- End ProductManager ---

const STATUS_OPTIONS = ["Processing", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const getDateString = (date) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}${String(d.getMonth() + 1).padStart(2, "0")}${d.getFullYear()}`;
};

const RestaurantDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [section, setSection] = useState("orders");

  const BASE_URL = window.location.hostname === "localhost"
    ? import.meta.env.VITE_BASE_URL
    : import.meta.env.VITE_PRODUCTION_URL;

  const applyFilter = (ordersList, type) => {
    const now = new Date();
    if (type === "today") {
      return ordersList.filter(o => {
        const d = new Date(o.createdAt);
        return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }
    if (type === "week") {
      const ago = new Date(); ago.setDate(now.getDate() - 7);
      return ordersList.filter(o => new Date(o.createdAt) >= ago);
    }
    if (type === "month") {
      const ago = new Date(); ago.setMonth(now.getMonth() - 1);
      return ordersList.filter(o => new Date(o.createdAt) >= ago);
    }
    return ordersList;
  };

  const fetchOrders = async (keepFilter = false) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/orderHistory/all`, { withCredentials: true });
      const list = res.data.orders || [];
      setOrders(list);
      if (keepFilter) {
        setFilteredOrders(applyFilter(list, activeFilter));
      } else {
        setFilteredOrders(list);
        setActiveFilter("all");
      }
    } catch {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(true); }, []); // eslint-disable-line

  const filterByDate = (type) => {
    setActiveFilter(type);
    setFilteredOrders(applyFilter(orders, type));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/v1/orderHistory/status/${orderId}`, { status: newStatus }, { withCredentials: true });
      const update = (list) => list.map(o => o._id === orderId ? { ...o, status: newStatus } : o);
      setOrders(update);
      setFilteredOrders(update);
    } catch {
      alert("Failed to update status.");
    }
  };

  const handlePaymentStatusChange = async (orderId, paymentDone) => {
    await axios.put(`${BASE_URL}/api/v1/orderHistory/status/${orderId}`, { paymentDone }, { withCredentials: true });
    const update = (list) => list.map(o => o._id === orderId ? { ...o, paymentDone } : o);
    setOrders(update);
    setFilteredOrders(update);
  };

  const handleFilter = ({ status, phone }) => {
    let filtered = orders;
    if (status) filtered = filtered.filter(o => o.status === status);
    if (phone)  filtered = filtered.filter(o => o.phoneNumber?.includes(phone));
    setFilteredOrders(filtered);
    setActiveFilter("all");
  };

  const DATE_FILTERS = [
    { key: "today", label: "Today" },
    { key: "week",  label: "Last 7 days" },
    { key: "month", label: "Last 30 days" },
    { key: "all",   label: "All time" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Section tabs */}
        <div className={styles.tabBar}>
          {[
            { key: "orders",   label: "Orders" },
            { key: "analysis", label: "Insights" },
            { key: "products", label: "Menu Items" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.tabBtn} ${section === key ? styles.active : ""}`}
              onClick={() => setSection(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.panel}>

          {/* Orders */}
          {section === "orders" && (
            <div>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Order Management</h2>
                <button className={styles.refreshBtn} onClick={() => fetchOrders(true)}>
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              <OrderStats orders={filteredOrders} />

              <div className={styles.dateFilters}>
                {DATE_FILTERS.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`${styles.dateFilterBtn} ${activeFilter === key ? styles.active : ""}`}
                    onClick={() => {
                      if (key === "all") { setFilteredOrders(orders); setActiveFilter("all"); }
                      else filterByDate(key);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <OrderFilter onFilter={handleFilter} />

              {loading && <div className={styles.loadingWrap}>Loading orders…</div>}
              {error && <div className={styles.errorMsg}>{error}</div>}

              {filteredOrders.length > 0 && (
                <OrderTable
                  orders={filteredOrders}
                  statusOptions={STATUS_OPTIONS}
                  onStatusChange={handleStatusChange}
                  onPaymentStatusChange={handlePaymentStatusChange}
                  getDateString={getDateString}
                />
              )}

              {!loading && filteredOrders.length === 0 && (
                <div className={styles.emptyOrders}>No orders found.</div>
              )}
            </div>
          )}

          {/* Insights */}
          {section === "analysis" && (
            <div>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Order Insights</h2>
              </div>
              <OrderAnalysis orders={orders} />
            </div>
          )}

          {/* Menu Items */}
          {section === "products" && (
            <div>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Menu Management</h2>
              </div>
              <ProductManager />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
