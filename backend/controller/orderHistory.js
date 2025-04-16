const Order = require('../models/orderModel');

// Get all orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find all orders where user field equals the provided userId
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by date, newest first
      .populate('items.product', 'name price'); // Populate product details if needed
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};