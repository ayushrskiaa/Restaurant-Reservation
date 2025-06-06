import express from "express";
import {
  createOrderHistory,
  getUserOrderHistory,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  reorderPreviousOrder,
  getOrderStatistics,
} from "../controller/orderHistoryController.js";

const router = express.Router();

router.post("/create", createOrderHistory);
router.get("/user/:phoneNumber", getUserOrderHistory);
router.get("/details/:id", getOrderDetails);
router.post("/reorder/:id", reorderPreviousOrder);
router.put("/cancel/:id", cancelOrder);

router.put("/status/:id", updateOrderStatus);
router.get("/statistics", getOrderStatistics);

export default router;
