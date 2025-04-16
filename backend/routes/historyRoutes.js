import express from "express";
import { 
  createOrderHistory, 
  getUserOrderHistory, 
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  reorderPreviousOrder,
  getOrderStatistics
} from "../controller/orderHistoryController.js";

const router = express.Router();

// Public routes
router.post("/create", createOrderHistory);
router.get("/user/:phoneNumber", getUserOrderHistory);
router.get("/details/:id", getOrderDetails);
router.post("/reorder/:id", reorderPreviousOrder);
router.put("/cancel/:id", cancelOrder);

// Routes that might need admin authentication in a real app
// You might want to add middleware for these in production
router.put("/status/:id", updateOrderStatus);
router.get("/statistics", getOrderStatistics);

export default router;