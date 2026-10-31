const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer ID is required']
    },
    farmName: {
      type: String,
      required: [true, 'Farm name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Farm location is required'],
      trim: true
    },
    landArea: {
      type: Number,
      required: [true, 'Land area in acres is required'],
      min: [0.1, 'Land area must be greater than 0']
    },
    soilType: {
      type: String,
      required: [true, 'Soil type is required'],
      trim: true,
      default: 'Alluvial Loam'
    }
  },
  {
    timestamps: true
  }
);

// Virtual field for frontend backward-compatibility if accessed as .name or .sizeAcres
farmSchema.virtual('name').get(function () {
  return this.farmName;
});
farmSchema.virtual('sizeAcres').get(function () {
  return this.landArea;
});

farmSchema.set('toJSON', { virtuals: true });
farmSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Farm', farmSchema);
