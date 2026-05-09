import { validationResult } from "express-validator";
import ErrorHandler from "../middlewares/error.js";
import { Orders } from "../models/orderDine.js";
import { OrderHistory } from "../models/orderHistory.js";

/**
 * Create a new food order and add to order history
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing order details
 * @param {string} req.body.customerName - Name of the customer
 * @param {string} req.body.phoneNumber - Customer phone number
 * @param {string} req.body.address - Delivery address
 * @param {Array} req.body.items - Array of items ordered with product details
 * @param {number} req.body.totalPrice - Total order price
 * @param {string} req.body.paymentMethod - Payment method (online/cash)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with order confirmation or error message
 */
export const send_Orders = async (req, res, next) => {
  // Check for validation errors from express-validator middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }

  const {
    customerName,
    phoneNumber,
    address,
    items,
    totalPrice,
    paymentMethod,
  } = req.body;

  try {
    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return next(new ErrorHandler("At least one item is required in the order", 400));
    }

    // Validate totalPrice is a positive number
    if (typeof totalPrice !== "number" || totalPrice <= 0) {
      return next(new ErrorHandler("Total price must be a positive number", 400));
    }

    const order = await Orders.create({
      customerName,
      phoneNumber,
      address,
      items,
      totalPrice,
      paymentMethod,
    });

    // Create order history record
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
      order: {
        id: order._id,
        customerName: order.customerName,
        totalPrice: order.totalPrice,
        status: "Processing",
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors)
        .map(err => err.message)
        .join(", ");
      return next(new ErrorHandler(validationErrors, 400));
    }
    return next(error);
  }
};
