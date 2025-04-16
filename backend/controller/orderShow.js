import ErrorHandler from "../middlewares/error.js";
import { Orders } from "../models/orderDine.js";
import { OrderHistory } from "../models/orderHistory.js";

export const send_Orders = async (req, res, next) => {
  console.log("Request Body:", req.body); // Log the request body for debugging

  const { customerName, phoneNumber, address, items, totalPrice, paymentMethod } = req.body;

  if (!customerName || !phoneNumber || !address || !items || !totalPrice || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required order details!",
    });
  }

  try {
    // Create the order
    const order = await Orders.create({ customerName, phoneNumber, address, items, totalPrice, paymentMethod });
    
    // Also add to order history
    await OrderHistory.create({
      customerName,
      phoneNumber,
      address,
      items,
      totalPrice,
      paymentMethod,
      status: "Processing",
      estimatedDelivery: new Date(Date.now() + 45 * 60000) // Estimate 45 minutes from now
    });
    
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

