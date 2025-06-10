import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import cors from "cors";

// CORS configuration
app.use(cors({
  origin: [
    "https://restaurant-reservation-git-main-ayushrskiaa09s-projects.vercel.app", 
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get("/cors-check", (req, res) => {
  res.json({ message: "CORS is working!" });
});

app.listen(process.env.PORT, () => {
  console.log(`SERVER HAS STARTED AT PORT ${process.env.PORT}`);
});
