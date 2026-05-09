import express from "express";
import { send_Orders } from "../controller/orderShow.js";
import { validateOrder } from "../middlewares/validation.js";

const router = express.Router();

router.post("/", validateOrder, send_Orders);

export default router;