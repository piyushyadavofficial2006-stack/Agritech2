const express = require('express');
const router = express.Router();
const {
  getAllFarmers,
  getTotalFarmers,
  getTotalCrops,
  getAllCrops,
  deleteCropAdmin,
  deleteFarmerAdmin,
  getAdminStats,
  getAllUsers,
  updateUserRole
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes are protected and require admin authorization
router.use(protect, adminOnly);

router.get('/farmers', getAllFarmers);
router.get('/total-farmers', getTotalFarmers);
router.get('/total-crops', getTotalCrops);
router.get('/crops', getAllCrops);
router.delete('/crops/:id', deleteCropAdmin);
router.delete('/farmers/:id', deleteFarmerAdmin);
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
