const express = require('express');
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
