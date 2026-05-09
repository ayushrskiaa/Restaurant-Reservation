import { useState } from "react";
import { data } from "../restApi.json";
import { Star, Plus, Minus, Clock } from "lucide-react";
import styles from "./Menu.module.css";

const RATINGS = { 1: 4.3, 2: 4.5, 3: 4.8, 4: 4.1, 5: 4.6, 6: 4.2, 7: 4.7, 8: 4.0 };

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState({});

  const dishes = data[0]?.dishes || [];
  const categories = ["All", ...new Set(dishes.map(d => d.category || "Other"))];
  const filtered = activeCategory === "All" ? dishes : dishes.filter(d => (d.category || "Other") === activeCategory);

  const add = (dish) => setCart(prev => ({
    ...prev,
    [dish.id]: { ...dish, qty: (prev[dish.id]?.qty || 0) + 1 },
  }));

  const remove = (dish) => setCart(prev => {
    if (!prev[dish.id] || prev[dish.id].qty <= 1) {
      const next = { ...prev };
      delete next[dish.id];
      return next;
    }
    return { ...prev, [dish.id]: { ...prev[dish.id], qty: prev[dish.id].qty - 1 } };
  });

  return (
    <section className={styles.section} id="menu">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelDash} /> Our Menu
            </div>
            <h2 className={styles.heading}>Popular Dishes</h2>
          </div>
        </div>

        <div className={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.length > 0 ? filtered.map(dish => {
            const qty = cart[dish.id]?.qty || 0;
            return (
              <div key={dish.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img src={dish.image} alt={dish.title} className={styles.cardImg} loading="lazy" />
                  <span className={styles.catBadge}>{dish.category || "Specialty"}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.cardName}>{dish.title}</h3>
                    <div className={styles.vegBadge}><div className={styles.vegDot} /></div>
                  </div>

                  <div className={styles.cardMeta}>
                    <span className={styles.price}>₹{dish.price}</span>
                    <div className={styles.rating}>
                      <Star size={11} fill="#f59e0b" strokeWidth={0} className={styles.ratingIcon} />
                      {RATINGS[dish.id] || 4.2}
                    </div>
                  </div>

                  <div className={styles.deliveryTime}>
                    <Clock size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                    25–35 min
                  </div>

                  {qty === 0 ? (
                    <button className={styles.addBtn} onClick={() => add(dish)}>
                      <Plus size={14} strokeWidth={2.5} /> Add to Cart
                    </button>
                  ) : (
                    <div className={styles.qtyControls}>
                      <button className={styles.qtyBtn} onClick={() => remove(dish)}><Minus size={14} /></button>
                      <span className={styles.qtyNum}>{qty}</span>
                      <button className={styles.qtyBtn} onClick={() => add(dish)}><Plus size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No dishes in this category</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Menu;
