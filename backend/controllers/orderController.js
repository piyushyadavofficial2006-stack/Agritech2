const { OrderService, ResourceService } = require('../models');

// @desc Get orders for user (or all if admin)
// @route GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      const allOrders = await OrderService.getAll();
      return res.json(allOrders);
    }
    const userOrders = await OrderService.findByUser(req.user._id);
    res.json(userOrders);
  } catch (error) {
    next(error);
  }
};

// @desc Create new agricultural input order
// @route POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !items.length || !shippingAddress) {
      return res.status(400).json({ message: 'Cart items and shipping delivery address are required.' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const resource = await ResourceService.findById(item.resourceId);
      const price = resource ? resource.price : Number(item.price || 0);
      const qty = Number(item.quantity || 1);
      totalAmount += price * qty;
      orderItems.push({
        resourceId: item.resourceId,
        title: item.title || (resource ? resource.title : 'Agricultural Supply'),
        quantity: qty,
        price
      });

      // Update stock
      if (resource) {
        await ResourceService.update(item.resourceId, {
          stock: Math.max(0, (resource.stock || 10) - qty),
          inStock: (resource.stock || 10) - qty > 0
        });
      }
    }

    const order = await OrderService.create({
      userId: req.user._id,
      userName: req.user.name,
      items: orderItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      shippingAddress,
      paymentMethod: paymentMethod || 'Kisan Pay / UPI',
      status: 'Processing'
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc Update order delivery status (admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await OrderService.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus
};
