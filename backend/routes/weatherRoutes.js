const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController');

// Public or protected weather lookup
router.get('/', getWeather);

module.exports = router;
