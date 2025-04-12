import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

app.listen(process.env.PORT, ()=>{
    // console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
    console.log(`SERVER HAS STARTED AT PORT ${process.env.PORT}`);
})
