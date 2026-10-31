const store = require('../models/store');

// Predefined educational pest alerts
const defaultPestAlerts = [
  {
    _id: 'pest_01',
    pestName: 'Fall Armyworm (Spodoptera frugiperda)',
    targetCrops: ['Corn / Maize', 'Sorghum', 'Rice', 'Sugarcane'],
    riskLevel: 'High',
    region: 'Northern & Central Plains',
    weatherCondition: 'Warm temperatures (24-30°C) with sporadic rains',
    symptoms: 'Pin-hole feeding marks on young leaves, whorl damage, moist sawdust-like frass.',
    prevention: 'Install pheromone traps (5 traps/acre); intercrop with pulses or Desmodium.',
    chemicalControl: 'Apply Chlorantraniliprole 18.5% SC @ 0.4 ml/litre if threshold > 10% damaged plants.',
    organicControl: 'Spray Bacillus thuringiensis (Bt) @ 2g/litre or 5% Neem Seed Kernel Extract (NSKE).'
  },
  {
    _id: 'pest_02',
    pestName: 'Mustard Aphid (Lipaphis erysimi)',
    targetCrops: ['Mustard', 'Canola', 'Rapeseed', 'Cabbage'],
    riskLevel: 'Medium',
    region: 'Punjab, Haryana, Rajasthan',
    weatherCondition: 'Cloudy, overcast weather with relative humidity above 75%',
    symptoms: 'Curling of young leaves, stunted inflorescence, sticky honeydew attracting black sooty mold.',
    prevention: 'Timely early sowing in October avoids peak aphid population; conserve ladybird beetles.',
    chemicalControl: 'Dimethoate 30% EC @ 1 ml/litre water during late afternoon.',
    organicControl: 'Spray soap-oil emulsion (5ml liquid soap + 15ml neem oil per litre of water).'
  },
  {
    _id: 'pest_03',
    pestName: 'Yellow Rust / Stripe Rust (Puccinia striiformis)',
    targetCrops: ['Wheat', 'Barley'],
    riskLevel: 'High',
    region: 'Sub-Himalayan belt & plains',
    weatherCondition: 'Cool nights (10-15°C) followed by humid mornings and heavy dew',
    symptoms: 'Yellow to orange-colored powdery pustules arranged in linear stripes along leaf veins.',
    prevention: 'Cultivate resistant varieties (HD-3086, DBW-187); avoid excessive nitrogen application.',
    chemicalControl: 'Spray Propiconazole 25% EC (Tilt) @ 1 ml/litre upon first appearance of pustules.',
    organicControl: 'Foliar spray of cow urine & sour buttermilk fermented solution (10% dilution).'
  },
  {
    _id: 'pest_04',
    pestName: 'Stem Borer (Scirpophaga incertulas)',
    targetCrops: ['Basmati Rice', 'Paddy'],
    riskLevel: 'Medium',
    region: 'All Paddy Growing Belts',
    weatherCondition: 'High humidity (>80%) and temperatures between 25-32°C',
    symptoms: 'Dead hearts in vegetative stage and white ears (empty panicles) in reproductive stage.',
    prevention: 'Release Trichogramma japonicum egg parasitoid @ 40,000/acre at weekly intervals.',
    chemicalControl: 'Cartap hydrochloride 4G @ 10 kg/acre or Fipronil 0.3% G @ 10 kg/acre.',
    organicControl: 'Install light traps and spray neem oil (1500 ppm) @ 3 ml/litre.'
  }
];

// @desc Get all educational pest alerts
// @route GET /api/pests
const getPestAlerts = async (req, res, next) => {
  try {
    const alerts = store?.pestAlerts && store.pestAlerts.length > 0 ? store.pestAlerts : defaultPestAlerts;
    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

// @desc Create new educational pest advisory
// @route POST /api/pests
const createPestAlert = async (req, res, next) => {
  try {
    const {
      pestName,
      targetCrops,
      riskLevel,
      region,
      weatherCondition,
      symptoms,
      prevention,
      chemicalControl,
      organicControl
    } = req.body;

    if (!pestName || !symptoms) {
      return res.status(400).json({ message: 'Pest name and symptoms are required.' });
    }

    const newAlert = {
      _id: `pest_${Date.now()}`,
      pestName,
      targetCrops: Array.isArray(targetCrops) ? targetCrops : (targetCrops ? targetCrops.split(',').map(s => s.trim()) : ['General']),
      riskLevel: riskLevel || 'Medium',
      region: region || 'All Agricultural Zones',
      weatherCondition: weatherCondition || '',
      symptoms,
      prevention: prevention || '',
      chemicalControl: chemicalControl || '',
      organicControl: organicControl || ''
    };

    if (store?.pestAlerts) {
      store.pestAlerts.unshift(newAlert);
    }

    res.status(201).json(newAlert);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPestAlerts,
  createPestAlert
};
