const User = require('../models/User');
const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

// @desc    Get all registered farmers
// @route   GET /api/admin/farmers
// @access  Private/Admin
const getAllFarmers = async (req, res, next) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password').sort({ createdAt: -1 });
    res.json(farmers);
  } catch (error) {
    next(error);
  }
};

// @desc    Get total farmers count
// @route   GET /api/admin/total-farmers
// @access  Private/Admin
const getTotalFarmers = async (req, res, next) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    res.json({ totalFarmers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get total crops count
// @route   GET /api/admin/total-crops
// @access  Private/Admin
const getTotalCrops = async (req, res, next) => {
  try {
    const totalCrops = await Crop.countDocuments();
    res.json({ totalCrops });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all crops across all farmers
// @route   GET /api/admin/crops
// @access  Private/Admin
const getAllCrops = async (req, res, next) => {
  try {
    const crops = await Crop.find()
      .populate('farmerId', 'name email location')
      .sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any crop (Admin operation)
// @route   DELETE /api/admin/crops/:id
// @access  Private/Admin
const deleteCropAdmin = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop record not found' });
    }
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: `Crop "${crop.cropName}" deleted successfully.` });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete farmer and clean up their associated data (Admin operation)
// @route   DELETE /api/admin/farmers/:id
// @access  Private/Admin
const deleteFarmerAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account.' });
    }

    await Crop.deleteMany({ farmerId: user._id });
    await Farm.deleteMany({ farmerId: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({
      success: true,
      message: `Farmer "${user.name}" and associated records removed successfully.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comprehensive system stats for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const [totalFarmers, totalAdmins, totalUsers, totalCrops, totalFarms] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments(),
      Crop.countDocuments(),
      Farm.countDocuments()
    ]);

    res.json({
      totalFarmers,
      totalAdmins,
      totalUsers,
      totalCrops,
      totalFarms,
      farmersCount: totalFarmers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for user management table
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['farmer', 'admin', 'expert'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role assignment' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFarmers,
  getTotalFarmers,
  getTotalCrops,
  getAllCrops,
  deleteCropAdmin,
  deleteFarmerAdmin,
  getAdminStats,
  getAllUsers,
  updateUserRole
};
