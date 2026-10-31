const express = require('express');
const router = express.Router();
const { getPestAlerts, createPestAlert } = require('../controllers/pestController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPestAlerts);
router.post('/', protect, createPestAlert);

module.exports = router;
