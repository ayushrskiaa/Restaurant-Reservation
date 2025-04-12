// filepath: c:\Users\ayush\Desktop\coding\MERN-project\RESTAURANT_RESERVATION\backend\database\dbConnection.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const dbConnection = () => {
  console.log("MONGO_URI:", process.env.MONGO_URI);
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "Restaurant-Booking",
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log(`Some error occured while connecing to database: ${err}`);
    });
};
