import { useState } from 'react';
import { data } from '../restApi.json';
import styles from './Menu.module.css';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const dishes = data[0]?.dishes || [];
  const categories = [...new Set(dishes.map(d => d.category || 'Other'))];

  const filteredDishes = activeCategory
    ? dishes.filter(d => (d.category || 'Other') === activeCategory)
    : dishes;

  return (
    <section className={styles.menuSection} id="menu">
      <div className={styles.menuContainer}>
        <div className={styles.headingSection}>
          <h1 className={styles.sectionTitle}>Popular Dishes</h1>
          <p className={styles.sectionDescription}>
            Experience our carefully curated selection of dishes. From traditional favorites to innovative creations, each dish is crafted with the finest ingredients and culinary expertise.
          </p>
        </div>

        <div className={styles.filterContainer}>
          <button
            className={`${styles.filterButton} ${!activeCategory ? styles.active : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterButton} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.productsGrid}>
          {filteredDishes.length > 0 ? (
            filteredDishes.map(element => (
              <div className={styles.productCard} key={element.id}>
                <div className={styles.productImageContainer}>
                  <img
                    src={element.image}
                    alt={element.title}
                    className={styles.productImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{element.title}</h3>
                  <p className={styles.productDescription}>
                    {element.description || 'Delicious and freshly prepared'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
              <div className={styles.emptyIcon}>🍽️</div>
              <h3 className={styles.emptyTitle}>No Dishes Found</h3>
              <p className={styles.emptyDescription}>
                Try selecting a different category or check back later
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Menu;
