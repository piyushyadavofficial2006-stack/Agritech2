const Crop = require('../models/Crop');

// Helper for Soil Health Analysis
const computeSoilHealth = (soil = {}) => {
  const n = Number(soil.nitrogen || 70);
  const p = Number(soil.phosphorus || 40);
  const k = Number(soil.potassium || 180);
  const ph = Number(soil.ph || 6.8);
  const moisture = Number(soil.moisture || 55);

  let issues = [];
  let plan = [];
  let score = 95;

  if (ph < 6.0) {
    issues.push('Acidic Soil detected: Nutrient lockup risk for phosphorus and calcium.');
    plan.push('Apply Agricultural Lime (Calcium Carbonate) at 200 kg/acre to neutralize acidity.');
    score -= 20;
  } else if (ph > 7.8) {
    issues.push('Alkaline Soil detected: Micronutrient deficiency risk (Iron, Zinc, Manganese).');
    plan.push('Apply Agricultural Gypsum (Calcium Sulfate) and incorporate green manure (Sesbania).');
    score -= 20;
  } else {
    plan.push('Soil pH is in the optimal agronomic range (6.0 - 7.5). High bioavailability.');
  }

  if (moisture < 40) {
    issues.push('Low Soil Moisture: Crop water stress detected.');
    plan.push('Initiate scheduled drip or sprinkler irrigation cycle within 12 hours.');
    score -= 20;
  } else if (moisture > 80) {
    issues.push('High Moisture / Waterlogging risk: Potential root hypoxia.');
    plan.push('Improve field drainage and postpone upcoming surface irrigation.');
    score -= 15;
  } else {
    plan.push('Soil moisture is optimal (45% - 75%) for active vegetative growth.');
  }

  let healthStatus = 'Healthy';
  if (score < 60) healthStatus = 'Critical';
  else if (score < 80) healthStatus = 'Attention';

  return {
    score: Math.max(score, 25),
    healthStatus,
    issues,
    summary: issues.length ? issues.join(' ') : 'Soil parameters are well-balanced and fertile.',
    actionPlan: plan
  };
};

// @desc    Add new crop belonging to logged-in farmer
// @route   POST /api/crops
// @access  Private (Farmer only access to own records)
const addCrop = async (req, res, next) => {
  try {
    const { cropName, name, landArea, sowingDate, plantingDate, cropStatus, status } = req.body;
    const finalName = cropName || name;
    const finalSowingDate = sowingDate || plantingDate;
    const finalStatus = cropStatus || status || 'Healthy';

    // Field validation
    if (!finalName) {
      return res.status(400).json({ success: false, message: 'Crop name is required.' });
    }
    if (!landArea || Number(landArea) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid land area in acres is required.' });
    }
    if (!finalSowingDate) {
      return res.status(400).json({ success: false, message: 'Sowing date is required.' });
    }

    // Create Crop document in MongoDB with logged-in farmer's ID
    const crop = await Crop.create({
      farmerId: req.user._id,
      cropName: finalName.trim(),
      landArea: Number(landArea),
      sowingDate: new Date(finalSowingDate),
      cropStatus: finalStatus
    });

    res.status(201).json(crop);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all crops belonging to logged-in farmer
// @route   GET /api/crops
// @access  Private (Farmers only access their own records)
const getMyCrops = async (req, res, next) => {
  try {
    // If admin, can optionally view all; if farmer, strictly filter by farmerId
    let query = { farmerId: req.user._id };
    if (req.user.role === 'admin' && req.query.all === 'true') {
      query = {};
    }

    const crops = await Crop.find(query).sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
// @access  Private
const getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop record not found.' });
    }

    // Ownership check: farmer must only access their own records
    if (crop.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: You can only view your own crop records.' });
    }

    res.json(crop);
  } catch (error) {
    next(error);
  }
};

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private
const updateCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop record not found.' });
    }

    // Ownership check
    if (crop.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: You can only update your own crop records.' });
    }

    const { cropName, name, landArea, sowingDate, plantingDate, cropStatus, status } = req.body;

    if (cropName || name) crop.cropName = (cropName || name).trim();
    if (landArea) crop.landArea = Number(landArea);
    if (sowingDate || plantingDate) crop.sowingDate = new Date(sowingDate || plantingDate);
    if (cropStatus || status) crop.cropStatus = cropStatus || status;

    const updatedCrop = await crop.save();
    res.json(updatedCrop);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop record not found.' });
    }

    // Ownership check
    if (crop.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: You can only delete your own crop records.' });
    }

    await Crop.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Crop deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze soil health
// @route   POST /api/crops/analyze-soil
// @access  Private
const analyzeSoil = async (req, res, next) => {
  try {
    const { ph, moisture, nitrogen, phosphorus, potassium, cropType } = req.body;
    const analysis = computeSoilHealth({ ph, moisture, nitrogen, phosphorus, potassium });
    res.json({
      success: true,
      cropType: cropType || 'Farmland Crop',
      soilInput: { ph, moisture, nitrogen, phosphorus, potassium },
      ...analysis
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCrop,
  getMyCrops,
  getCropById,
  updateCrop,
  deleteCrop,
  analyzeSoil
};
