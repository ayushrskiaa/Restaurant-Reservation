const Order = require('../models/orderModel');

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 }) 
      .populate('items.product', 'name price');
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};