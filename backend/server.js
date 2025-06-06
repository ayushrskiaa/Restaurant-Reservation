import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import cors from "cors";
// import historyRoutes from "./routes/historyRoutes.js";


// app.use("/api/history", historyRoutes);
app.use(cors({
  origin: "https://restaurant-reservation-git-main-ayushrskiaa09s-projects.vercel.app", // your Vercel frontend URL
  credentials: true,
}));

app.listen(process.env.PORT, ()=>{
    console.log(`SERVER HAS STARTED AT PORT ${process.env.PORT}`);
})
