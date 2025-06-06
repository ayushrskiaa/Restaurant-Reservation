import ErrorHandler from "../middlewares/error.js";
import { Orders } from "../models/orderDine.js";
import { OrderHistory } from "../models/orderHistory.js";

export const send_Orders = async (req, res, next) => {
  console.log("Request Body:", req.body);

  const {
    customerName,
    phoneNumber,
    address,
    items,
    totalPrice,
    paymentMethod,
  } = req.body;

  if (
    !customerName ||
    !phoneNumber ||
    !address ||
    !items ||
    !totalPrice ||
    !paymentMethod
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required order details!",
    });
  }

  try {
    const order = await Orders.create({
      customerName,
      phoneNumber,
      address,
      items,
      totalPrice,
      paymentMethod,
    });

    await OrderHistory.create({
      customerName,
      phoneNumber,
      address,
      items,
      totalPrice,
      paymentMethod,
      status: "Processing",
      estimatedDelivery: new Date(Date.now() + 45 * 60000),
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
