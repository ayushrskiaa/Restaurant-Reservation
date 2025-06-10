# Restaurant Reservation & Food Ordering App 🍽️

A full-stack MERN (MongoDB, Express, React, Node.js) application for restaurant table reservations and online food ordering.  
Beautifully designed for both desktop and mobile, with a modern UI, admin features, and seamless user experience.

---

## 🚀 Features

- **Table Reservation:**  
  Book tables with date, time, and guest details. Prevents double-booking and validates all inputs.

- **Online Food Ordering:**  
  Browse menu by categories, add items to cart, adjust quantities, and place orders with delivery details.

- **Order History:**  
  Users can view their past orders and reservation history.

- **Admin Panel:**  
  Manage menu items, view all reservations and orders, and update restaurant info.

- **Responsive Design:**  
  Optimized for both desktop and mobile devices.

- **Modern UI:**  
  Clean, attractive interface with smooth transitions and easy navigation.

---

## 🛠️ Tech Stack

- **Frontend:**  
  React, Vite, CSS Modules  
  (with modern hooks and functional components)

- **Backend:**  
  Node.js, Express

- **Database:**  
  MongoDB (Mongoose ODM)

- **Other:**  
  JWT Auth, REST API, CORS, Vercel/Netlify ready

---

## 📦 Folder Structure

```
RESTAURANT_RESERVATION/
├── backend/
│   ├── controller/         # All backend controllers (orders, reservations, products)
│   ├── database/           # MongoDB connection
│   ├── middlewares/        # Error handling, auth, etc.
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── server.js           # Entry point
│   └── ...
├── frontend/
│   ├── public/             # Static assets (images, SVGs)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main app
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── ...
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/restaurant-reservation.git
cd RESTAURANT_RESERVATION
```

### 2. Setup Backend

```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and PORT
npm start
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```




---

## 🖼️ Screenshots

| Desktop Menu | Mobile Reservation | Admin Panel |
|:------------:|:-----------------:|:-----------:|
| ![Desktop Menu](public/about1.png) | ![Mobile Reservation](public/about2.jpg) | ![Admin Panel](public/about3.jpg) |

---



---

## 👨‍💻 Author

- [Ayush Rskiaa](https://github.com/ayushrskiaa09)
- Contributions welcome!

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐️ Star this repo if you like it!

---
