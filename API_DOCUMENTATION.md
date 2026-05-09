# Restaurant Reservation & Food Ordering API Documentation

## Base URL
```
http://localhost:4000/api/v1
```

---

## 🍽️ Reservation Endpoints

### Create Reservation
**POST** `/reservation`

Create a new table reservation.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+92-300-1234567",
  "date": "2024-12-25",
  "time": "19:30",
  "guests": 4
}
```

**Validation Rules:**
- `firstName`: 3-30 characters, required
- `lastName`: 3-30 characters, required
- `email`: Valid email format, required
- `phone`: Valid international phone format, required
- `date`: Future date only, YYYY-MM-DD format
- `time`: HH:MM format (24-hour), required
- `guests`: 1-20 guests, required

**Response (201):**
```json
{
  "success": true,
  "message": "Reservation Sent Successfully!",
  "reservation": {
    "id": "507f1f77bcf86cd799439011",
    "date": "2024-12-25",
    "time": "19:30"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation error details"
}
```

---

## 🛒 Order Endpoints

### Create Order
**POST** `/Orders`

Place a new food order.

**Request Body:**
```json
{
  "customerName": "Jane Doe",
  "phoneNumber": "+92-300-9876543",
  "address": "123 Main St, City, Country",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "title": "Biryani",
      "price": 500,
      "quantity": 2
    }
  ],
  "totalPrice": 1000,
  "paymentMethod": "online"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully!",
  "order": {
    "id": "507f1f77bcf86cd799439012"
  }
}
```

---

## 📊 Order History Endpoints

### Get Order History
**GET** `/orderHistory`

Retrieve user's order history.

**Query Parameters:**
- `email`: User email (optional, for filtering)
- `limit`: Number of records (default: 10)
- `skip`: Number of records to skip (default: 0)

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "customerName": "Jane Doe",
      "totalPrice": 1000,
      "status": "delivered",
      "createdAt": "2024-12-20T10:30:00Z"
    }
  ]
}
```

---

## 🍲 Product Endpoints

### Get All Products
**GET** `/products`

Retrieve all menu items.

**Query Parameters:**
- `category`: Filter by category (Main Course, Starter, Dessert, Beverage, Breakfast, Snacks, Other)
- `limit`: Number of products per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Biryani",
      "price": 500,
      "offer": "10%",
      "category": "Main Course",
      "image": "https://cloudinary.com/..."
    }
  ]
}
```

### Add Product (Admin)
**POST** `/products`

Add a new menu item. *Requires admin authentication.*

**Request Body:**
```json
{
  "title": "Karahi",
  "price": 600,
  "offer": "5%",
  "category": "Main Course",
  "image": "https://cloudinary.com/..."
}
```

**Response (201):**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Karahi",
    "price": 600
  }
}
```

---

## 💳 Payment Endpoints

### Create Payment Order
**POST** `/payment/orders`

Create a Razorpay payment order.

**Request Body:**
```json
{
  "amount": 1000,
  "currency": "INR",
  "receipt": "order_rcptid_11"
}
```

**Response (200):**
```json
{
  "id": "order_DBJOWzybf0sJbb",
  "entity": "order",
  "amount": 1000
}
```

### Verify Payment
**POST** `/payment/verify`

Verify a completed payment.

**Request Body:**
```json
{
  "razorpay_order_id": "order_DBJOWzybf0sJbb",
  "razorpay_payment_id": "pay_DBJOWzybf0sJbb",
  "razorpay_signature": "signature_hash"
}
```

---

## 🤖 Chatbot Endpoints

### Get Chatbot Response
**POST** `/chatbot`

Get AI-powered responses for restaurant queries.

**Request Body:**
```json
{
  "message": "What is your opening time?"
}
```

**Response (200):**
```json
{
  "success": true,
  "response": "We are open from 11 AM to 11 PM daily."
}
```

---

## Error Responses

All endpoints use standardized error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error or bad request"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Permission denied"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- General endpoints: 100 requests per 15 minutes per IP
- Auth endpoints: 5 requests per 15 minutes per IP

**Rate Limit Headers:**
- `X-RateLimit-Limit`: 100
- `X-RateLimit-Remaining`: 95
- `X-RateLimit-Reset`: 1640000000

---

## Security Headers

All responses include security headers set by Helmet:
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only)

---

## Testing with cURL

```bash
# Create reservation
curl -X POST http://localhost:4000/api/v1/reservation \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+92-300-1234567",
    "date": "2024-12-25",
    "time": "19:30",
    "guests": 4
  }'

# Get products
curl http://localhost:4000/api/v1/products?category=Main+Course
```

---

**Last Updated:** December 2024
**Version:** 1.0
