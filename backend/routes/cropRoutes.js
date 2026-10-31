const express = require('express');
const router = express.Router();
const {
  addCrop,
  getMyCrops,
  getCropById,
  updateCrop,
  deleteCrop,
  analyzeSoil
} = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

// Standalone soil analysis endpoint
router.post('/analyze-soil', analyzeSoil);

// All crop operations require farmer authentication
router.use(protect);

router.route('/')
  .post(addCrop)
  .get(getMyCrops);

router.route('/:id')
  .get(getCropById)
  .put(updateCrop)
  .delete(deleteCrop);

module.exports = router;
