import express from "express";
import { createRazorpayOrder } from "../controller/paymentController.js";
const router = express.Router();

router.post("/create-order", createRazorpayOrder);

export default router;