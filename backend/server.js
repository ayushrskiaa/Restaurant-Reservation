import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import historyRoutes from "./routes/historyRoutes.js";


app.use("/api/history", historyRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`SERVER HAS STARTED AT PORT ${process.env.PORT}`);
})
