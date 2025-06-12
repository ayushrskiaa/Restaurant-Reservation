import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import cors from "cors";

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL_LOCAL,
    process.env.FRONTEND_URL_PROD,
    process.env.FRONTEND_URL_VERCEL,
    process.env.FRONTEND_URL_RENDER
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
