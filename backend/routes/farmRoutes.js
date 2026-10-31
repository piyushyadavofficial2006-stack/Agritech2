const express = require('express');
const router = express.Router();
const {
  addFarm,
  getMyFarms,
  getFarmDetails,
  updateFarm,
  deleteFarm
} = require('../controllers/farmController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(addFarm)
  .get(getMyFarms);

router.route('/:id')
  .get(getFarmDetails)
  .put(updateFarm)
  .delete(deleteFarm);

module.exports = router;
