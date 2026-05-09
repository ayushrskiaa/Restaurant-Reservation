# Design System Documentation

A comprehensive design system for the Restaurant Reservation & Food Ordering application.

## 📋 Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing System](#spacing-system)
4. [Components](#components)
5. [Usage Examples](#usage-examples)

---

## 🎨 Color Palette

### Primary Colors
```
Primary Dark:   #2D3436  (Text, headings, heavy elements)
Primary Light:  #454545  (Alternative primary)
Primary Dark:   #1a1a1a  (Darkest shade)
```

### Accent Colors
```
Main Accent:    #FF6B6B  (CTAs, highlights, buttons)
Light:          #FF8787  (Hover states)
Dark:           #E05555  (Active states)
```

### Status Colors
```
Success:        #27AE60  (Positive actions, confirmed)
Warning:        #F39C12  (Alerts, caution)
Danger:         #E74C3C  (Errors, delete)
Info:           #3498DB  (Information)
```

### Neutral Grays
```
Gray 50:        #F9FAFB  (Lightest background)
Gray 100:       #F3F4F6
Gray 200:       #E5E7EB
Gray 300:       #D1D5DB
Gray 400:       #9CA3AF
Gray 500:       #6B7280
Gray 600:       #4B5563
Gray 700:       #374151  (Darkest gray)
```

### Special Colors
```
Gold:           #D4AF37  (Premium accent)
Green:          #27AE60  (Freshness)
Warm:           #E8B4A0  (Food warmth)
```

### Usage in CSS

Use CSS variables defined in `index.css`:

```css
/* Primary */
color: var(--color-primary);
background: var(--color-accent);

/* Status */
color: var(--color-success);
background: var(--color-danger);

/* Grays */
border: 1px solid var(--color-border);
background: var(--color-gray-50);
```

---

## 🔤 Typography

### Font Stack
```
Primary:   -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif
Monospace: 'Courier New', monospace
```

### Font Sizes
```
XS:   12px  (Small labels, timestamps)
SM:   14px  (Form text, descriptions)
Base: 16px  (Default body text)
LG:   18px  (Large paragraphs)
XL:   20px  (Subheadings)
2XL:  24px  (Section headings)
3XL:  30px  (Major headings)
4XL:  36px  (Page titles)
5XL:  48px  (Hero titles)
```

### Font Weights
```
Light:      300  (Minimal emphasis)
Normal:     400  (Body text)
Medium:     500  (Form labels)
Semibold:   600  (Subheadings)
Bold:       700  (Headings)
```

### Line Heights
```
Tight:      1.2   (Headings, compact text)
Normal:     1.5   (Body text, default)
Relaxed:    1.75  (Longer paragraphs)
```

### Usage in CSS

```css
h1 {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

p {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-relaxed);
}
```

---

## 📏 Spacing System

Base unit: **8px**

### Spacing Scale
```
XS:   4px    (Tight spacing)
SM:   8px    (Small gaps)
MD:   16px   (Default spacing)
LG:   24px   (Standard padding)
XL:   32px   (Large sections)
2XL:  48px   (Section spacing)
3XL:  64px   (Page sections)
```

### Common Patterns
```
Padding:         var(--space-lg)     (24px)
Margin-bottom:   var(--space-md)     (16px)
Gap (flex):      var(--space-lg)     (24px)
Border-radius:   var(--radius-md)    (12px)
```

### Usage in CSS

```css
.card {
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
  gap: var(--space-md);
}

@media (max-width: 640px) {
  .card {
    padding: var(--space-md);
  }
}
```

---

## 🧩 Components

### Button Component

**Location:** `src/components/Button.module.css`

#### Variants
- **Primary**: CTA buttons, main actions
- **Secondary**: Alternative actions
- **Outline**: Tertiary actions
- **Ghost**: Minimal, text-only
- **Success**: Positive actions
- **Danger**: Destructive actions

#### Sizes
- **Default**: Standard button size
- **SM**: Small buttons, compact UI
- **LG**: Large buttons, prominent CTAs

#### States
- **Hover**: Visual feedback on hover
- **Active**: Pressed state
- **Disabled**: Disabled state
- **Loading**: Loading spinner animation

#### Usage

```jsx
// Using semantic HTML
<button className="btn-primary">Click Me</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-outline">Outline</button>

// Or with module CSS
import styles from './Button.module.css';

<button className={styles.button}>Primary</button>
<button className={`${styles.button} ${styles.secondary}`}>
  Secondary
</button>
```

### Card Component

**Location:** `src/components/Card.module.css`

#### Variants
- **Default**: Standard white card
- **Flat**: Outlined card with border
- **Elevated**: Card with stronger shadow
- **Outlined**: Border only, no background

#### Card Sections
```jsx
<div className={styles.card}>
  <div className={styles.header}>
    <h3>Card Title</h3>
  </div>
  <div className={styles.body}>
    <p>Card content goes here</p>
  </div>
  <div className={styles.footer}>
    <button>Action</button>
  </div>
</div>
```

#### Specialized Cards

**Product Card**
```jsx
<div className={`${styles.card} ${styles.productCard}`}>
  <div className={styles.productImage}>
    <img src="..." alt="Product" />
  </div>
  <div className={styles.productInfo}>
    <div className={styles.productCategory}>Category</div>
    <h3 className={styles.productName}>Product Name</h3>
    <p className={styles.productDescription}>Description</p>
    <div className={styles.productFooter}>
      <div className={styles.productPrice}>$99.99</div>
      <div className={styles.productRating}>
        <span className={styles.star}>⭐</span>
        <span>4.5 (120)</span>
      </div>
    </div>
  </div>
</div>
```

**Order Card**
```jsx
<div className={`${styles.card} ${styles.orderCard}`}>
  <div className={styles.orderHeader}>
    <div className={styles.orderId}>#ORD-12345</div>
    <span className={`${styles.orderStatus} ${styles.success}`}>
      Delivered
    </span>
  </div>
  <div className={styles.orderItems}>
    <div className={styles.orderItem}>
      <span>Biryani x2</span>
      <span>$29.99</span>
    </div>
  </div>
  <div className={styles.orderTotal}>
    <span>Total</span>
    <span>$49.99</span>
  </div>
</div>
```

---

## 💡 Usage Examples

### Creating a New Component

1. **Use CSS Variables**
```css
.myComponent {
  background-color: var(--color-light);
  color: var(--color-text);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

2. **Responsive Design**
```css
.myComponent {
  padding: var(--space-2xl);
}

@media (max-width: 640px) {
  .myComponent {
    padding: var(--space-lg);
  }
}
```

3. **Interactive States**
```css
.myButton {
  background-color: var(--color-accent);
  transition: all var(--transition-fast);
}

.myButton:hover {
  background-color: var(--color-accent-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Grid Layouts

```jsx
<div className="grid grid-cols-4 gap-6">
  {items.map(item => (
    <div key={item.id} className="card">
      {/* Card content */}
    </div>
  ))}
</div>
```

**Responsive automatically:**
- Desktop (1024px+): 4 columns
- Tablet (640-1024px): 2 columns
- Mobile (<640px): 1 column

### Common Utility Classes

```html
<!-- Text utilities -->
<p class="text-primary">Primary text</p>
<p class="text-accent">Accent text</p>
<p class="text-light">Light text</p>
<p class="text-sm">Small text</p>

<!-- Spacing utilities -->
<div class="mb-lg">Margin bottom</div>
<div class="p-lg">Padding</div>
<div class="gap-md">Gap (flex)</div>

<!-- Flexbox -->
<div class="flex items-center justify-between gap-lg">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Visibility -->
<div class="hidden-mobile">Desktop only</div>
<div class="hidden-desktop">Mobile only</div>
```

---

## 🎯 Best Practices

1. **Always use CSS variables** instead of hardcoding colors/sizes
2. **Follow the spacing scale** - don't use arbitrary values
3. **Use component modules** for scoped styles
4. **Mobile-first approach** - design for mobile, then enhance for desktop
5. **Test accessibility** - ensure sufficient color contrast
6. **Respect animations** - check `prefers-reduced-motion`
7. **Responsive by default** - include breakpoints in component CSS

---

## 🔄 Responsive Breakpoints

```css
/* Mobile First */
Default          < 640px
Tablet           640px - 1024px
Desktop          > 1024px

/* Media Query Examples */
@media (max-width: 640px) {
  /* Mobile styles */
}

@media (max-width: 1024px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `src/index.css` | Global design system variables and utilities |
| `src/App.css` | Application layout and page styles |
| `src/components/Button.module.css` | Button component styles |
| `src/components/Card.module.css` | Card component styles |
| Component CSS files | Individual component styles (module.css) |

---

## 🚀 Next Steps

Phase 2 will redesign:
- Navbar (sticky, modern layout)
- HeroSection (gradient background, animations)
- Menu cards (product card redesign)
- Forms (reservation, checkout)

---

**Last Updated:** December 2024
**Version:** 1.0
