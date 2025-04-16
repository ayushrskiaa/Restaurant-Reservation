// filepath: c:\Users\ayush\Desktop\coding\MERN-project\RESTAURANT_RESERVATION\backend\routes\orderRoute.js
import express from "express";
import { send_Orders } from "../controller/orderShow.js"; // Use named import

const router = express.Router();

router.post("/", send_Orders); // Route for creating an order

export default router;