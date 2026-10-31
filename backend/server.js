const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const { connectDB } = require('./config/db');
const { seedMongoDB } = require('./utils/seedMongo');
const { errorHandler } = require('./middleware/errorHandler');

// Express Route Handlers
const authRoutes = require('./routes/authRoutes');
const cropRoutes = require('./routes/cropRoutes');
const farmRoutes = require('./routes/farmRoutes');
const adminRoutes = require('./routes/adminRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const pestRoutes = require('./routes/pestRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const forumRoutes = require('./routes/forumRoutes');

const app = express();

// Initialize MongoDB Connection via Mongoose & Seed if empty
connectDB().then(() => {
  seedMongoDB();
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// System Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'AgriTech – Smart Farming Management System',
    version: '1.0.0',
    database: 'MongoDB (Mongoose)',
    timestamp: new Date().toISOString()
  });
});

// Mount Core APIs
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/admin', adminRoutes);

// Ancillary Agricultural Services
app.use('/api/weather', weatherRoutes);
app.use('/api/pests', pestRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/forum', forumRoutes);

// Serve Static Frontend Single Page Application
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🌱 AgriTech Smart Farming Full-Stack Server (Mongoose & Express)`);
  console.log(`🚀 Web Application Live at: http://localhost:${PORT}`);
  console.log(`📊 API Health check:       http://localhost:${PORT}/api/health`);
  console.log(`🔑 Demo Accounts:`);
  console.log(`   - Farmer: farmer@agritech.com / password123`);
  console.log(`   - Admin:  admin@agritech.com  / admin123`);
  console.log(`=======================================================`);
});

module.exports = app;
