# Development Setup Guide

## Prerequisites

- **Node.js:** v18+ (v16 has compatibility issues with some dependencies)
- **npm:** v8+
- **MongoDB:** Local or MongoDB Atlas cloud instance
- **Git:** For version control

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/ayushrskiaa/Restaurant-Reservation.git
cd RESTAURANT_RESERVATION

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### 2. Environment Variables

**Backend** - Create `backend/.env` from `backend/.env.example`:

```bash
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant_db
FRONTEND_URL_LOCAL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

**Frontend** - Create `frontend/.env`:

```bash
VITE_BACKEND_URL=http://localhost:4000
```

### 3. Run Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📁 Project Structure

```
RESTAURANT_RESERVATION/
├── backend/
│   ├── controller/           # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middlewares/         # Custom middlewares
│   ├── database/            # DB connection
│   ├── .env.example         # Environment variables template
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── Pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Frontend config
│   └── vite.config.js       # Vite configuration
│
├── API_DOCUMENTATION.md     # API endpoint reference
├── SECURITY.md              # Security best practices
└── README.md                # Project overview
```

---

## 🔧 Available Scripts

### Backend

```bash
npm run dev      # Start server with auto-reload (nodemon)
npm start        # Start production server
```

### Frontend

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🗂️ Key Files to Know

### Backend

| File | Purpose |
|------|---------|
| `app.js` | Express app configuration, middlewares, routes |
| `server.js` | Server startup, CORS configuration |
| `database/dbConnection.js` | MongoDB connection |
| `middlewares/error.js` | Centralized error handling |
| `middlewares/validation.js` | **NEW** Input validation rules |
| `models/reservation.js` | Reservation schema with validations |

### Frontend

| File | Purpose |
|------|---------|
| `App.jsx` | Main router and layout |
| `components/Reservation.jsx` | Reservation form |
| `components/Menu.jsx` | Menu display |
| `components/checkOut.jsx` | Checkout/order placement |

---

## 🔍 Testing APIs

### Using cURL

```bash
# Create a reservation
curl -X POST http://localhost:4000/api/v1/reservation \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+92-3001234567",
    "date": "2024-12-25",
    "time": "19:30",
    "guests": 4
  }'

# Get all products
curl http://localhost:4000/api/v1/products
```

### Using Postman

1. Download and open Postman
2. Create a new request
3. Set method to POST
4. Enter URL: `http://localhost:4000/api/v1/reservation`
5. Go to Body → Raw → JSON
6. Paste the request JSON from above

---

## 🐛 Debugging

### Backend Debugging

```bash
# Enable debug logs
NODE_DEBUG=* npm run dev

# Or use VS Code debugger (launch.json):
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/server.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

### Frontend Debugging

1. Open DevTools (F12 or Ctrl+Shift+I)
2. Check Console for errors
3. Use React DevTools browser extension

### Database Issues

```bash
# Check MongoDB connection
mongo "mongodb+srv://username:password@cluster.mongodb.net/restaurant_db"

# View collections
show collections

# Clear a collection
db.reservations.deleteMany({})
```

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "MongoDB connection failed"
**Solution:**
- Check `MONGO_URI` in `.env` is correct
- Verify MongoDB Atlas IP whitelist
- Ensure network connectivity

### Issue: CORS errors in frontend
**Solution:**
- Verify backend is running on port 4000
- Check `FRONTEND_URL_LOCAL` is set correctly
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Port 4000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :4000
kill -9 <PID>
```

---

## 📦 Dependency Management

### Add a new package

```bash
cd backend
npm install package-name
```

### Update packages

```bash
npm update          # Update to latest minor/patch versions
npm audit fix       # Fix security vulnerabilities
```

### Check outdated packages

```bash
npm outdated
```

---

## 🔐 Security Notes

- Never commit `.env` files
- Keep API keys in environment variables
- Use `.env.example` as template
- Rotate credentials regularly
- Enable GitHub secret scanning

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Vite Docs](https://vitejs.dev/)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes with descriptive commits
3. Push to your branch: `git push origin feature/feature-name`
4. Create a pull request

---

**Last Updated:** December 2024
**Version:** 1.0
