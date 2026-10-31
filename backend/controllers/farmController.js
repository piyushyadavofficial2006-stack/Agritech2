const Farm = require('../models/Farm');
const Crop = require('../models/Crop');

// @desc    Add new farm
// @route   POST /api/farms
// @access  Private (Farmer only)
const addFarm = async (req, res, next) => {
  try {
    const { farmName, name, location, landArea, sizeAcres, soilType } = req.body;
    const finalName = farmName || name;
    const finalArea = landArea || sizeAcres;

    // Field validation
    if (!finalName) {
      return res.status(400).json({ success: false, message: 'Farm name is required.' });
    }
    if (!location) {
      return res.status(400).json({ success: false, message: 'Farm location is required.' });
    }
    if (!finalArea || Number(finalArea) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid land area in acres is required.' });
    }

    const farm = await Farm.create({
      farmerId: req.user._id,
      farmName: finalName.trim(),
      location: location.trim(),
      landArea: Number(finalArea),
      soilType: (soilType || 'Alluvial Loam').trim()
    });

    res.status(201).json(farm);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all farms belonging to logged-in farmer
// @route   GET /api/farms
// @access  Private
const getMyFarms = async (req, res, next) => {
  try {
    let query = { farmerId: req.user._id };
    if (req.user.role === 'admin' && req.query.all === 'true') {
      query = {};
    }

    const farms = await Farm.find(query).sort({ createdAt: -1 });
    res.json(farms);
  } catch (error) {
    next(error);
  }
};

// @desc    Get farm details by ID
// @route   GET /api/farms/:id
// @access  Private
const getFarmDetails = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm record not found.' });
    }

    // Ownership check
    if (farm.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: You can only view your own farm records.' });
    }

    // Also get crops for this farmer
    const crops = await Crop.find({ farmerId: farm.farmerId });

    res.json({
      ...farm.toObject(),
      crops
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm record not found.' });
    }

    // Ownership check
    if (farm.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: You can only update your own farm records.' });
    }

    const { farmName, name, location, landArea, sizeAcres, soilType } = req.body;
    if (farmName || name) farm.farmName = (farmName || name).trim();
    if (location) farm.location = location.trim();
    if (landArea || sizeAcres) farm.landArea = Number(landArea || sizeAcres);
    if (soilType) farm.soilType = soilType.trim();

    const updated = await farm.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm record not found.' });
    }

    // Ownership check
    if (farm.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: You can only delete your own farm records.' });
    }

    await Farm.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Farm deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFarm,
  getMyFarms,
  getFarmDetails,
  updateFarm,
  deleteFarm
};
