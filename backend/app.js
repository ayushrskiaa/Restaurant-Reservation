import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import orderRouter from "./routes/orderRoute.js"; // Import the order router
import historyRouter from "./routes/historyRoutes.js"; // Import the history router
import { dbConnection } from "./database/dbConnection.js";

const app = express();
dotenv.config({ path: "./config.env" });

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/reservation", reservationRouter);
app.use("/api/v1/Orders", orderRouter); // Use the correct order router
app.use("/api/v1/orderHistory", historyRouter); // Use the history router
app.get("/", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "HELLO WORLD AGAIN",
  });
});

dbConnection();

app.use(errorMiddleware);

export default app;
