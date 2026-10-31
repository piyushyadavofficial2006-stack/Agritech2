const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Seed data constants
const initialUsers = [
  {
    _id: 'usr_farmer_01',
    name: 'Rajesh Kumar',
    email: 'farmer@agritech.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'farmer',
    phone: '+91 98765 43210',
    state: 'Punjab',
    language: 'en',
    avatar: '👨‍🌾',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'usr_admin_01',
    name: 'Dr. Sarah Mitchell',
    email: 'admin@agritech.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    phone: '+1 555 019 2834',
    state: 'California',
    language: 'en',
    avatar: '👩‍🔬',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'usr_expert_01',
    name: 'Prof. Anand Verma',
    email: 'expert@agritech.com',
    password: bcrypt.hashSync('expert123', 10),
    role: 'expert',
    phone: '+91 98111 22334',
    state: 'Maharashtra',
    language: 'en',
    avatar: '👨‍🏫',
    createdAt: new Date().toISOString()
  }
];

const initialFarms = [
  {
    _id: 'farm_01',
    userId: 'usr_farmer_01',
    name: 'Green Horizon Valley',
    location: 'Ludhiana, Punjab',
    sizeAcres: 12.5,
    soilType: 'Alluvial Loam',
    irrigationSource: 'Canal & Drip Irrigation',
    establishedYear: 2018,
    status: 'Optimal',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    _id: 'farm_02',
    userId: 'usr_farmer_01',
    name: 'Sunlight Organic Orchard',
    location: 'Amritsar District, Punjab',
    sizeAcres: 6.0,
    soilType: 'Sandy Clay Loam',
    irrigationSource: 'Solar Borewell Sprinkler',
    establishedYear: 2021,
    status: 'Needs Moisture Check',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  }
];

const initialCrops = [
  {
    _id: 'crop_01',
    farmId: 'farm_01',
    userId: 'usr_farmer_01',
    name: 'Wheat (Sharbati Gold)',
    cropName: 'Wheat (Sharbati Gold)',
    landArea: 5.0,
    sowingDate: '2024-11-15',
    cropStatus: 'Healthy',
    category: 'Cereals & Grains',
    variety: 'HD-3086 High Yield',
    stage: 'Flowering', // Sowing, Vegetative, Flowering, Ripening, Harvest
    progress: 68,
    plantingDate: '2024-11-15',
    expectedHarvestDate: '2025-04-10',
    soilHealth: {
      nitrogen: 78, // kg/ha (ideal 60-90)
      phosphorus: 42, // kg/ha (ideal 30-50)
      potassium: 195, // kg/ha (ideal 150-250)
      ph: 6.8, // 6.0-7.5 ideal
      moisture: 62 // %
    },
    healthStatus: 'Healthy',
    expectedYieldTonnes: 26.5,
    lastInspected: new Date().toISOString().split('T')[0],
    notes: 'Nitrogen levels well maintained with organic neem cake. Drip cycle active.',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'crop_02',
    farmId: 'farm_01',
    userId: 'usr_farmer_01',
    name: 'Mustard (Brassica)',
    cropName: 'Mustard (Brassica)',
    landArea: 2.5,
    sowingDate: '2024-10-20',
    cropStatus: 'Attention',
    category: 'Oilseeds',
    variety: 'Pusa Bold',
    stage: 'Ripening',
    progress: 85,
    plantingDate: '2024-10-20',
    expectedHarvestDate: '2025-03-05',
    soilHealth: {
      nitrogen: 65,
      phosphorus: 38,
      potassium: 170,
      ph: 7.1,
      moisture: 45
    },
    healthStatus: 'Attention',
    expectedYieldTonnes: 9.2,
    lastInspected: new Date().toISOString().split('T')[0],
    notes: 'Slight aphid activity spotted on perimeter. Bio-spray scheduled.',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'crop_03',
    farmId: 'farm_02',
    userId: 'usr_farmer_01',
    name: 'Organic Basmati Rice',
    cropName: 'Organic Basmati Rice',
    landArea: 4.0,
    sowingDate: '2025-01-10',
    cropStatus: 'Healthy',
    category: 'Cereals & Grains',
    variety: 'Pusa 1121',
    stage: 'Vegetative',
    progress: 40,
    plantingDate: '2025-01-10',
    expectedHarvestDate: '2025-06-25',
    soilHealth: {
      nitrogen: 82,
      phosphorus: 46,
      potassium: 210,
      ph: 6.6,
      moisture: 78
    },
    healthStatus: 'Healthy',
    expectedYieldTonnes: 18.0,
    lastInspected: new Date().toISOString().split('T')[0],
    notes: 'Green manure incorporated before transplanting. Excellent root vigor.',
    createdAt: new Date().toISOString()
  }
];

const initialResources = [
  {
    _id: 'res_01',
    title: 'Certified Sharbati Wheat Seeds (HD-3086)',
    category: 'Seeds',
    price: 45.0,
    unit: '25 kg Bag',
    stock: 120,
    rating: 4.8,
    reviewsCount: 34,
    description: 'High-germination rate certified seeds, drought-resistant with high protein grain yield.',
    badge: 'Best Seller',
    inStock: true
  },
  {
    _id: 'res_02',
    title: 'Bio-NPK Liquid Microbial Inoculant',
    category: 'Fertilizers',
    price: 32.5,
    unit: '1 Litre Bottle',
    stock: 85,
    rating: 4.9,
    reviewsCount: 52,
    description: 'Eco-friendly bacterial consortia fixing atmospheric Nitrogen, solubilizing Phosphorus & Potassium.',
    badge: '100% Organic',
    inStock: true
  },
  {
    _id: 'res_03',
    title: 'Cold-Pressed Neem Oil (10,000 PPM Azadirachtin)',
    category: 'Pesticides',
    price: 28.0,
    unit: '1 Litre Can',
    stock: 64,
    rating: 4.7,
    reviewsCount: 41,
    description: 'Broad-spectrum organic repellent against caterpillars, aphids, whiteflies, and mites without harming bees.',
    badge: 'Organic certified',
    inStock: true
  },
  {
    _id: 'res_04',
    title: 'Digital Soil NPK & Moisture 4-in-1 Probe',
    category: 'Tools',
    price: 89.0,
    unit: '1 Unit',
    stock: 35,
    rating: 4.6,
    reviewsCount: 29,
    description: 'Fast digital soil tester for real-time pH, moisture, temperature, and electrical conductivity reading.',
    badge: 'Smart Tech',
    inStock: true
  },
  {
    _id: 'res_05',
    title: 'Micro-Drip Irrigation Lateral Kit (0.5 Acre)',
    category: 'Tools',
    price: 155.0,
    unit: 'Kit with Drippers',
    stock: 18,
    rating: 4.9,
    reviewsCount: 19,
    description: 'Precision water delivery kit saves up to 60% water while maximizing fertilizer fertigation efficiency.',
    badge: 'Water Saver',
    inStock: true
  },
  {
    _id: 'res_06',
    title: 'Trichoderma Viride Bio-Fungicide Powder',
    category: 'Pesticides',
    price: 19.5,
    unit: '1 kg Pack',
    stock: 90,
    rating: 4.7,
    reviewsCount: 38,
    description: 'Effective antagonistic fungus combating root rot, collar rot, damping off, and wilt diseases.',
    badge: 'Bio Control',
    inStock: true
  }
];

const initialOrders = [
  {
    _id: 'ord_1001',
    userId: 'usr_farmer_01',
    userName: 'Rajesh Kumar',
    items: [
      {
        resourceId: 'res_02',
        title: 'Bio-NPK Liquid Microbial Inoculant',
        quantity: 2,
        price: 32.5
      },
      {
        resourceId: 'res_03',
        title: 'Cold-Pressed Neem Oil',
        quantity: 1,
        price: 28.0
      }
    ],
    totalAmount: 93.0,
    shippingAddress: 'Village Kalan, Ludhiana District, Punjab - 141001',
    paymentMethod: 'UPI / Direct Bank Transfer',
    status: 'Shipped', // Pending, Processing, Shipped, Delivered
    trackingNumber: 'AGR-TRK-883491',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    _id: 'ord_1002',
    userId: 'usr_farmer_01',
    userName: 'Rajesh Kumar',
    items: [
      {
        resourceId: 'res_01',
        title: 'Certified Sharbati Wheat Seeds',
        quantity: 4,
        price: 45.0
      }
    ],
    totalAmount: 180.0,
    shippingAddress: 'Village Kalan, Ludhiana District, Punjab - 141001',
    paymentMethod: 'Cash on Delivery (Kisan Pay)',
    status: 'Delivered',
    trackingNumber: 'AGR-TRK-771920',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

const initialPestAlerts = [
  {
    _id: 'pest_01',
    pestName: 'Fall Armyworm (Spodoptera frugiperda)',
    targetCrops: ['Corn / Maize', 'Sorghum', 'Rice'],
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
    targetCrops: ['Mustard', 'Canola', 'Rapeseed'],
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
  }
];

const initialForumPosts = [
  {
    _id: 'post_01',
    userId: 'usr_farmer_01',
    authorName: 'Rajesh Kumar',
    authorRole: 'farmer',
    title: 'Best natural method to manage soil salinity after heavy canal irrigation?',
    category: 'Soil Health',
    content: 'My wheat field in Sector B has shown minor white crusting on the surface. Can anyone recommend soil amendments or drainage techniques that worked for you without huge capital expense?',
    upvotes: 14,
    tags: ['SoilSalinity', 'Gypsum', 'Drainage'],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    replies: [
      {
        _id: 'rep_01',
        userId: 'usr_expert_01',
        authorName: 'Prof. Anand Verma',
        authorRole: 'expert',
        content: 'Rajesh ji, please test the electrical conductivity (EC). If EC > 4 dS/m, applying agricultural grade Gypsum based on soil test requirement followed by heavy leaching is ideal. Also plant Dhaincha (Sesbania) in the upcoming Kharif to add organic matter.',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        _id: 'rep_02',
        userId: 'usr_admin_01',
        authorName: 'Dr. Sarah Mitchell',
        authorRole: 'admin',
        content: 'Agreed with Prof. Verma. We also published an in-depth advisory on gypsum application rates in the Agricultural Advisory section.',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ]
  },
  {
    _id: 'post_02',
    userId: 'usr_farmer_01',
    authorName: 'Rajesh Kumar',
    authorRole: 'farmer',
    title: 'Neem cake application rate for organic Basmati nursery',
    category: 'Crop Advisory',
    content: 'Planning to sow nursery beds next month. How many kilograms of neem cake powder per 100 sq. meters is optimal for preventing root nematodes and termite attacks?',
    upvotes: 8,
    tags: ['OrganicBasmati', 'NeemCake', 'Nematodes'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    replies: [
      {
        _id: 'rep_03',
        userId: 'usr_expert_01',
        authorName: 'Prof. Anand Verma',
        authorRole: 'expert',
        content: 'Use 10-12 kg of well-powdered neem cake per 100 sq. meter bed mixed thoroughly in the top 10 cm soil 10 days before sowing with light watering.',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ]
  }
];

// In-Memory store container
class MemoryStore {
  constructor() {
    this.users = [...initialUsers];
    this.farms = [...initialFarms];
    this.crops = [...initialCrops];
    this.resources = [...initialResources];
    this.orders = [...initialOrders];
    this.pestAlerts = [...initialPestAlerts];
    this.forumPosts = [...initialForumPosts];
  }

  // Generic helpers
  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }
}

const store = new MemoryStore();

module.exports = store;
