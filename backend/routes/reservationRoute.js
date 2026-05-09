import express from "express";
import send_reservation from "../controller/reservation.js";
import { validateReservation } from "../middlewares/validation.js";

const router = express.Router();

router.post("/", validateReservation, send_reservation);

export default router;
