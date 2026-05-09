import { useState } from 'react';
import { data } from '../restApi.json';
import styles from './Menu.module.css';

const CATEGORY_EMOJIS = {
  'All': '🍽️',
  'Breakfast': '🥐',
  'Lunch': '🍱',
  'Dinner': '🍝',
  'Starters': '🥗',
  'Fast Food': '🍔',
  'Desserts': '🍮',
  'Beverages': '☕',
  'Other': '🥡',
};

const POPULAR_IDS = [1, 3, 5, 7];

const RATINGS = { 1: 4.3, 2: 4.5, 3: 4.8, 4: 4.1, 5: 4.6, 6: 4.2, 7: 4.7, 8: 4.0 };

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState({});

  const dishes = data[0]?.dishes || [];
  const categories = ['All', ...new Set(dishes.map(d => d.category || 'Other'))];

  const filteredDishes = activeCategory === 'All'
    ? dishes
    : dishes.filter(d => (d.category || 'Other') === activeCategory);

  const addItem = (dish) => {
    setCart(prev => ({
      ...prev,
      [dish.id]: { ...dish, qty: (prev[dish.id]?.qty || 0) + 1 },
    }));
  };

  const removeItem = (dish) => {
    setCart(prev => {
      if (!prev[dish.id] || prev[dish.id].qty <= 1) {
        const next = { ...prev };
        delete next[dish.id];
        return next;
      }
      return { ...prev, [dish.id]: { ...prev[dish.id], qty: prev[dish.id].qty - 1 } };
    });
  };

  return (
    <section className={styles.menuSection} id="menu">

      {/* Header */}
      <div className={styles.menuHeader}>
        <div className={styles.eyebrow}>
          <span>🔥</span> Our Menu
        </div>
        <h2 className={styles.menuTitle}>
          Handcrafted with <span>Love & Spice</span>
        </h2>
        <p className={styles.menuSubtitle}>
          From sizzling grills to sweet indulgences — every dish tells a story of passion, freshness, and bold flavors.
        </p>
      </div>

      {/* Category filters */}
      <div className={styles.filterWrapper}>
        <div className={styles.filterScroll}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterPill} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className={styles.filterEmoji}>{CATEGORY_EMOJIS[cat] || '🍽️'}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className={styles.gridWrapper}>
        <div className={styles.productsGrid}>
          {filteredDishes.length > 0 ? (
            filteredDishes.map(dish => {
              const qty = cart[dish.id]?.qty || 0;
              const isPopular = POPULAR_IDS.includes(dish.id);
              const rating = RATINGS[dish.id] || 4.2;

              return (
                <div className={styles.card} key={dish.id}>
                  <div className={styles.imageWrap}>
                    <img
                      src={dish.image}
                      alt={dish.title}
                      className={styles.cardImage}
                      loading="lazy"
                    />
                    <div className={styles.badgeGroup}>
                      {isPopular && (
                        <span className={styles.popularBadge}>
                          🔥 Popular
                        </span>
                      )}
                      <span className={styles.categoryTag}>
                        {dish.category || 'Specialty'}
                      </span>
                    </div>
                    <span className={styles.priceBadge}>₹{dish.price}</span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardTopRow}>
                      <h3 className={styles.cardName}>{dish.title}</h3>
                      <div className={styles.vegIcon}>
                        <div className={styles.vegDot}></div>
                      </div>
                    </div>

                    <p className={styles.cardDesc}>
                      Fresh ingredients, bold flavors — prepared to perfection in our kitchen every single day.
                    </p>

                    <div className={styles.cardFooter}>
                      <div className={styles.rating}>
                        <span className={styles.ratingIcon}>⭐</span>
                        {rating}
                      </div>
                      <span className={styles.deliveryInfo}>25–35 min</span>
                    </div>

                    {qty === 0 ? (
                      <button className={styles.addBtn} onClick={() => addItem(dish)}>
                        <span className={styles.addBtnIcon}>+</span>
                        Add to Cart
                      </button>
                    ) : (
                      <div className={styles.qtyControls}>
                        <button className={styles.qtyBtn} onClick={() => removeItem(dish)}>−</button>
                        <span className={styles.qtyNumber}>{qty}</span>
                        <button className={styles.qtyBtn} onClick={() => addItem(dish)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyEmoji}>😔</span>
              <h3 className={styles.emptyTitle}>Nothing here yet</h3>
              <p className={styles.emptyText}>Try a different category</p>
            </div>
          )}
        </div>
      </div>

    </section>
  );
};

export default Menu;
