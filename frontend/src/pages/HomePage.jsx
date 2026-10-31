import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="py-5 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #15803d 0%, #166534 50%, #064e3b 100%)',
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container py-4">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7 text-center text-lg-start">
              <span className="badge bg-white text-success px-3 py-2 rounded-pill fw-bold mb-3 shadow-sm">
                🌱 Digital Agriculture Platform
              </span>
              <h1 className="display-4 fw-extrabold mb-3 text-white">
                Smart Farming, Better Future
              </h1>
              <p className="lead text-white-50 mb-4" style={{ fontSize: '1.2rem', maxWidth: '580px' }}>
                AgriTech is a modern digital farm management platform empowering farmers with precision soil analysis, real-time weather forecasting, crop tracking, and early pest alerts to maximize yield and foster sustainable agriculture.
              </p>

              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                {user ? (
                  <Link to="/dashboard" className="btn btn-warning text-dark fw-bold px-4 py-3 rounded-pill shadow">
                    <i className="bi bi-speedometer2 me-2"></i> Go to Farmer Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-warning text-dark fw-bold px-4 py-3 rounded-pill shadow">
                      <i className="bi bi-person-plus-fill me-2"></i> Register as Farmer
                    </Link>
                    <Link to="/login" className="btn btn-outline-light fw-bold px-4 py-3 rounded-pill">
                      <i className="bi bi-box-arrow-in-right me-2"></i> Farmer Sign In
                    </Link>
                  </>
                )}
                <Link to="/crops" className="btn btn-light text-success fw-bold px-4 py-3 rounded-pill shadow-sm">
                  <i className="bi bi-flower1 me-2"></i> Crop Management
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <div className="position-relative d-inline-block">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center shadow-lg mx-auto"
                  style={{
                    width: '280px',
                    height: '280px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '3px solid rgba(255, 255, 255, 0.25)'
                  }}
                >
                  <span style={{ fontSize: '8rem' }}>🌾</span>
                </div>
                {/* Floating highlight badges */}
                <div
                  className="position-absolute bg-white text-dark rounded-4 p-3 shadow-sm text-start"
                  style={{ bottom: '-15px', left: '-20px', minWidth: '180px' }}
                >
                  <div className="small text-muted">Soil Health Index</div>
                  <div className="fw-bold text-success fs-5">
                    <i className="bi bi-check-circle-fill me-1"></i> Optimal 92%
                  </div>
                </div>
                <div
                  className="position-absolute bg-white text-dark rounded-4 p-3 shadow-sm text-start"
                  style={{ top: '-15px', right: '-20px', minWidth: '170px' }}
                >
                  <div className="small text-muted">Micro-Climate</div>
                  <div className="fw-bold text-primary fs-5">
                    <i className="bi bi-sun-fill text-warning me-1"></i> 24°C Sunny
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
              Core Capabilities
            </span>
            <h2 className="fw-bold text-dark mt-2 mb-3">Empowering Farmers with Digital Technology</h2>
            <p className="text-muted" style={{ maxWidth: '640px', margin: '0 auto' }}>
              From sowing to harvesting, AgriTech delivers actionable data-driven insights tailored to every plot of land.
            </p>
          </div>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="agri-card p-4 h-100 text-center agri-card-hover">
                <div className="stat-icon-wrapper bg-success-subtle text-success mx-auto mb-3">
                  <i className="bi bi-flower1"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Crop Management</h5>
                <p className="small text-muted mb-0">
                  Track land area, sowing dates, phenological stages, and health statuses for all your crops in real-time.
                </p>
                <Link to="/crops" className="btn btn-sm btn-link text-success fw-bold mt-3 text-decoration-none p-0">
                  Manage Crops <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="agri-card p-4 h-100 text-center agri-card-hover">
                <div className="stat-icon-wrapper bg-primary-subtle text-primary mx-auto mb-3">
                  <i className="bi bi-cloud-sun-fill"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Weather Forecasting</h5>
                <p className="small text-muted mb-0">
                  Get hyper-local temperature, humidity, and rainfall forecasts with dynamic chemical spraying safety advisories.
                </p>
                <Link to="/weather" className="btn btn-sm btn-link text-primary fw-bold mt-3 text-decoration-none p-0">
                  Check Weather <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="agri-card p-4 h-100 text-center agri-card-hover">
                <div className="stat-icon-wrapper bg-warning-subtle text-warning-emphasis mx-auto mb-3">
                  <i className="bi bi-speedometer2"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Soil Health Analysis</h5>
                <p className="small text-muted mb-0">
                  Analyze soil pH, moisture, and N-P-K nutrient levels to generate tailored organic and mineral fertilizer plans.
                </p>
                <Link to="/soil" className="btn btn-sm btn-link text-warning-emphasis fw-bold mt-3 text-decoration-none p-0">
                  Analyze Soil <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="agri-card p-4 h-100 text-center agri-card-hover">
                <div className="stat-icon-wrapper bg-danger-subtle text-danger mx-auto mb-3">
                  <i className="bi bi-shield-exclamation"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Pest & Disease Alerts</h5>
                <p className="small text-muted mb-0">
                  Early detection advisories with dual remedies: 100% biological controls vs conventional safe chemical sprays.
                </p>
                <Link to="/dashboard" className="btn btn-sm btn-link text-danger fw-bold mt-3 text-decoration-none p-0">
                  View Alerts <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Banner */}
      <section className="py-5 bg-white border-top">
        <div className="container text-center py-3">
          <div className="agri-card p-5 bg-success text-white shadow" style={{ backgroundColor: '#15803d' }}>
            <h3 className="fw-bold mb-2">Ready to Transform Your Farm Productivity?</h3>
            <p className="lead text-white-50 mb-4" style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
              Join thousands of farmers making data-driven decisions to increase yield, conserve water, and safeguard crops.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/register" className="btn btn-warning text-dark fw-bold px-4 py-2 rounded-pill">
                Create Free Farmer Account
              </Link>
              <Link to="/login" className="btn btn-outline-light fw-bold px-4 py-2 rounded-pill">
                Explore Demo Portals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
