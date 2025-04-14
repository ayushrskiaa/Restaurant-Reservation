import ErrorHandler from "../middlewares/error.js";
import { Orders } from "../models/orderDine.js";

export const send_Orders = async (req, res, next) => {
  console.log("Request Body:", req.body); // Log the request body for debugging

  const { customerName, phoneNumber, items, totalPrice } = req.body;

  if (!customerName || !phoneNumber || !items || !totalPrice) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required order details!",
    });
  }

  try {
    const order = await Orders.create({ customerName, phoneNumber, items, totalPrice });
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

