const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

const seedMongoDB = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`[Database] MongoDB contains ${userCount} users. Ready.`);
      return;
    }

    console.log('[Database] Empty database detected. Seeding initial Mongoose documents...');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const farmerPassword = await bcrypt.hash('password123', salt);
    const adminPassword = await bcrypt.hash('admin123', salt);

    const farmer = await User.create({
      name: 'Rajesh Kumar',
      email: 'farmer@agritech.com',
      password: farmerPassword,
      role: 'farmer',
      location: 'Ludhiana, Punjab'
    });

    const admin = await User.create({
      name: 'Dr. Sarah Mitchell',
      email: 'admin@agritech.com',
      password: adminPassword,
      role: 'admin',
      location: 'California'
    });

    // 2. Create Farms
    const farm1 = await Farm.create({
      farmerId: farmer._id,
      farmName: 'Green Horizon Valley',
      location: 'Ludhiana, Punjab',
      landArea: 12.5,
      soilType: 'Alluvial Loam'
    });

    const farm2 = await Farm.create({
      farmerId: farmer._id,
      farmName: 'Sunlight Organic Orchard',
      location: 'Amritsar District, Punjab',
      landArea: 6.0,
      soilType: 'Sandy Loam'
    });

    // 3. Create Crops
    await Crop.create([
      {
        farmerId: farmer._id,
        cropName: 'Wheat (Sharbati Gold)',
        landArea: 5.0,
        sowingDate: new Date('2024-11-15'),
        cropStatus: 'Healthy'
      },
      {
        farmerId: farmer._id,
        cropName: 'Mustard (Brassica)',
        landArea: 2.5,
        sowingDate: new Date('2024-10-20'),
        cropStatus: 'Attention'
      },
      {
        farmerId: farmer._id,
        cropName: 'Organic Basmati Rice',
        landArea: 4.0,
        sowingDate: new Date('2025-01-10'),
        cropStatus: 'Healthy'
      }
    ]);

    console.log('[Database] MongoDB seeded successfully with Users, Crops, and Farms!');
  } catch (err) {
    console.error('[Database] Seeder error:', err.message);
  }
};

module.exports = { seedMongoDB };
