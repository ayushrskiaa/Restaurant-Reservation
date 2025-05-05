import ErrorHandler from "../middlewares/error.js";
import { OrderHistory } from "../models/orderHistory.js";
import { Orders } from "../models/orderDine.js";

// When an order is placed, add it to order history
export const createOrderHistory = async (req, res, next) => {
  try {
    const { customerName, phoneNumber, address, items, totalPrice, paymentMethod } = req.body;

    if (!customerName || !phoneNumber || !address || !items || !totalPrice || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required order details!",
      });
    }

    // Create new order history record
    const orderHistory = await OrderHistory.create({
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
      message: "Order placed successfully and added to history!",
      orderHistory,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserOrderHistory = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    console.log("Fetching orders for phone number:", phoneNumber);

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    const orders = await OrderHistory.find({ phoneNumber }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this phone number.",
      });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders. Please try again later.",
    });
  }
};

// Get a single order details by ID
export const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await OrderHistory.findById(id);

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// Update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return next(new ErrorHandler("Status is required", 400));
    }

    const validStatuses = [
      "Processing", 
      "Confirmed", 
      "Preparing", 
      "Out for Delivery", 
      "Delivered", 
      "Cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return next(new ErrorHandler("Invalid status value", 400));
    }

    const order = await OrderHistory.findById(id);

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    if (status === "Delivered" && order.status !== "Delivered") {
      order.deliveredAt = Date.now();
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// Cancel order
export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await OrderHistory.findById(id);

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    if (!order.canBeCancelled()) {
      return next(new ErrorHandler("This order cannot be cancelled", 400));
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// Reorder previous order
export const reorderPreviousOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const previousOrder = await OrderHistory.findById(id);

    if (!previousOrder) {
      return next(new ErrorHandler("Order not found", 404));
    }

    // Create a new order based on the previous one
    const newOrder = await OrderHistory.create({
      customerName: previousOrder.customerName,
      phoneNumber: previousOrder.phoneNumber,
      address: previousOrder.address,
      items: previousOrder.items,
      totalPrice: previousOrder.totalPrice,
      paymentMethod: previousOrder.paymentMethod,
      status: "Processing",
      estimatedDelivery: new Date(Date.now() + 45 * 60000), // Estimate 45 minutes from now
      specialInstructions: previousOrder.specialInstructions
    });

    res.status(201).json({
      success: true,
      message: "Reorder placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// Get order statistics (for admin)
export const getOrderStatistics = async (req, res, next) => {
  try {
    const totalOrders = await OrderHistory.countDocuments();
    const deliveredOrders = await OrderHistory.countDocuments({ status: "Delivered" });
    const processingOrders = await OrderHistory.countDocuments({ 
      status: { $in: ["Processing", "Confirmed", "Preparing", "Out for Delivery"] } 
    });
    const cancelledOrders = await OrderHistory.countDocuments({ status: "Cancelled" });
    
    
    // Calculate total revenue from delivered orders
    const revenueData = await OrderHistory.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        deliveredOrders,
        processingOrders,
        cancelledOrders,
        totalRevenue
      }
    });
  } catch (error) {
    console.error("Error:", error);
    next(new ErrorHandler(error.message, 500));
  }
};