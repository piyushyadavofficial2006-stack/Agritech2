import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// 8 Primary Application Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import FarmerDashboard from './pages/FarmerDashboard';
import CropManagementPage from './pages/CropManagementPage';
import WeatherPage from './pages/WeatherPage';
import SoilHealthPage from './pages/SoilHealthPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Additional feature pages
import MarketplacePage from './pages/MarketplacePage';
import OrdersPage from './pages/OrdersPage';
import ForumPage from './pages/ForumPage';
import FarmsPage from './pages/FarmsPage';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <div className="d-flex flex-column min-vh-100">
              <Navbar />
              <main className="flex-grow-1">
                <Routes>
                  {/* 1. Home Page */}
                  <Route path="/" element={<HomePage />} />

                  {/* 2. Register Page */}
                  <Route path="/register" element={<RegisterPage />} />

                  {/* 3. Login Page */}
                  <Route path="/login" element={<LoginPage />} />

                  {/* 4. Farmer Dashboard */}
                  <Route path="/dashboard" element={<FarmerDashboard />} />

                  {/* 5. Crop Management Page */}
                  <Route path="/crops" element={<CropManagementPage />} />

                  {/* 6. Weather Page */}
                  <Route path="/weather" element={<WeatherPage />} />

                  {/* 7. Soil Health Page */}
                  <Route path="/soil" element={<SoilHealthPage />} />

                  {/* 8. Admin Dashboard */}
                  <Route path="/admin" element={<AdminDashboardPage />} />

                  {/* Additional Value Pages */}
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/forum" element={<ForumPage />} />
                  <Route path="/farms" element={<FarmsPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
