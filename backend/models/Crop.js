const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer ID is required']
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true
    },
    landArea: {
      type: Number,
      required: [true, 'Land area in acres is required'],
      min: [0.1, 'Land area must be greater than 0']
    },
    sowingDate: {
      type: Date,
      required: [true, 'Sowing date is required']
    },
    cropStatus: {
      type: String,
      required: [true, 'Crop status is required'],
      trim: true,
      default: 'Healthy'
    }
  },
  {
    timestamps: true
  }
);

// Virtual field for frontend backward-compatibility if accessed as .name
cropSchema.virtual('name').get(function () {
  return this.cropName;
});

cropSchema.set('toJSON', { virtuals: true });
cropSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Crop', cropSchema);
