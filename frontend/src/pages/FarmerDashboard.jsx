import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FarmerDashboard = () => {
  const { user } = useAuth();

  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Weather State
  const [weatherCity, setWeatherCity] = useState(user?.location || 'Ludhiana');
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  // 2. Soil Analysis Form State
  const [soilType, setSoilType] = useState('Alluvial Loam');
  const [soilPh, setSoilPh] = useState(6.8);
  const [moistureLevel, setMoistureLevel] = useState(60);
  const [soilResult, setSoilResult] = useState(null);
  const [soilAnalyzing, setSoilAnalyzing] = useState(false);

  // Predefined Educational Pest Alerts Data (Transparently Predefined, Not Live Sensor Detection)
  const predefinedPests = [
    {
      id: 'pest_01',
      pestName: 'Fall Armyworm (Spodoptera frugiperda)',
      icon: '🐛',
      affectedCrops: ['Corn / Maize', 'Rice', 'Sorghum'],
      symptoms: 'Pin-hole feeding marks on young leaves, whorl damage, moist sawdust-like frass.',
      prevention: 'Install pheromone traps (5/acre); intercrop with pulses; apply 5% Neem Seed Kernel Extract (NSKE) or Bt bio-spray at early caterpillar stage.'
    },
    {
      id: 'pest_02',
      pestName: 'Mustard Aphid (Lipaphis erysimi)',
      icon: '🦗',
      affectedCrops: ['Mustard', 'Canola', 'Rapeseed'],
      symptoms: 'Curling of tender leaves, stunted flowering twigs, sticky honeydew attracting black sooty mold.',
      prevention: 'Timely early sowing in October avoids peak aphid reproduction; spray soap-neem oil emulsion; conserve beneficial ladybird beetle predators.'
    },
    {
      id: 'pest_03',
      pestName: 'Yellow Rust / Stripe Rust (Puccinia striiformis)',
      icon: '🌾',
      affectedCrops: ['Wheat', 'Barley'],
      symptoms: 'Yellow to orange-colored powdery pustules arranged in linear stripes along leaf veins.',
      prevention: 'Cultivate rust-resistant seed strains (HD-3086, DBW-187); avoid excess nitrogen; foliar spray of 10% sour buttermilk fermented solution upon first appearance.'
    },
    {
      id: 'pest_04',
      pestName: 'Rice Stem Borer (Scirpophaga incertulas)',
      icon: '🌱',
      affectedCrops: ['Rice / Paddy', 'Sugarcane'],
      symptoms: 'Severed central shoots ("Dead hearts") in vegetative stage; empty bleached panicles ("Whiteheads") during reproductive stage.',
      prevention: 'Clip leaf tips of seedlings before transplanting to destroy egg masses; release Trichogramma egg parasitoids; avoid excessive deep water stagnation.'
    }
  ];

  // Fetch initial crops, farms, and weather
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [cropsRes, farmsRes] = await Promise.all([
          api.get('/crops').catch(() => ({ data: [] })),
          api.get('/farms').catch(() => ({ data: [] }))
        ]);
        setCrops(cropsRes.data || []);
        setFarms(farmsRes.data || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch Weather for city
  const fetchWeather = async (cityToFetch) => {
    if (!cityToFetch || !cityToFetch.trim()) return;
    setWeatherLoading(true);
    setWeatherError('');

    try {
      const res = await api.get(`/weather?city=${encodeURIComponent(cityToFetch.trim())}`);
      if (res.data && res.data.success) {
        setWeatherData(res.data);
      } else {
        setWeatherError(res.data?.message || 'Could not load weather data.');
      }
    } catch (err) {
      console.error('Weather error:', err);
      setWeatherError(
        err.response?.data?.message ||
        `City "${cityToFetch}" not found. Please enter a valid city or district name.`
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(weatherCity);
  }, [weatherCity]);

  // Handle Weather City Form Submit
  const handleWeatherSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setWeatherCity(searchInput.trim());
      setSearchInput('');
    }
  };

  // Handle Soil Health Analysis Form Submit
  const handleSoilAnalyze = (e) => {
    e.preventDefault();
    setSoilAnalyzing(true);

    setTimeout(() => {
      const phVal = Number(soilPh);
      const mVal = Number(moistureLevel);
      let score = 95;
      let status = 'Optimal & Fertile';
      let suggestions = [];

      // pH Evaluation
      if (phVal < 6.0) {
        score -= 25;
        status = 'Acidic Condition';
        suggestions.push('Apply agricultural lime (calcium carbonate) at 200–300 kg/acre to neutralize acidity and unlock phosphorus availability.');
      } else if (phVal > 7.5) {
        score -= 20;
        status = 'Alkaline Condition';
        suggestions.push('Apply agricultural gypsum (calcium sulfate) and incorporate organic green manure (Dhaincha/Sesbania) to lower alkalinity.');
      } else {
        suggestions.push('Soil pH is in the optimal agronomic range (6.0 – 7.5), ensuring peak nutrient bioavailability.');
      }

      // Moisture Evaluation
      if (mVal < 40) {
        score -= 25;
        if (status === 'Optimal & Fertile') status = 'Moisture Deficit';
        suggestions.push('Low soil moisture detected. Initiate scheduled drip or sprinkler irrigation cycle within 12–24 hours to prevent crop root stress.');
      } else if (mVal > 80) {
        score -= 15;
        if (status === 'Optimal & Fertile') status = 'High Water Saturation';
        suggestions.push('High moisture levels detected. Ensure proper field drainage to avoid root zone waterlogging and oxygen deprivation.');
      } else {
        suggestions.push('Moisture levels are optimal (45% – 75%) for active plant nutrient transport.');
      }

      // Soil Type General Suggestion
      if (soilType === 'Sandy Loam') {
        suggestions.push('Sandy soils drain quickly: augment with organic compost or mulching to boost water retention.');
      } else if (soilType === 'Clay Loam' || soilType === 'Black Cotton Soil') {
        suggestions.push('Clay-rich soils retain moisture well: avoid over-irrigation during rainy periods.');
      } else {
        suggestions.push('Alluvial loam offers balanced aeration and fertility: maintain regular organic matter additions.');
      }

      setSoilResult({
        score: Math.max(30, score),
        status,
        badgeClass: score >= 80 ? 'bg-success' : score >= 60 ? 'bg-warning text-dark' : 'bg-danger',
        suggestions
      });
      setSoilAnalyzing(false);
    }, 400);
  };

  const farmerName = user?.name || 'Farmer';
  const farmerEmail = user?.email || 'farmer@agritech.com';
  const farmLocation = user?.location || 'Ludhiana, Punjab';

  const formatDate = (d) => {
    if (!d) return 'N/A';
    try {
      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return String(d).split('T')[0];
    }
  };

  return (
    <div className="container py-4">
      {/* 1. Farmer Welcome Banner */}
      <div
        className="p-4 p-md-5 rounded-4 mb-4 text-white shadow-sm position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #15803d 0%, #166534 60%, #064e3b 100%)'
        }}
      >
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill mb-2">
              🌾 Smart Farming Command Center
            </span>
            <h2 className="display-6 fw-bold mb-2">
              Welcome, {farmerName}!
            </h2>
            <p className="lead text-white-50 mb-3" style={{ fontSize: '1.05rem' }}>
              Your digital farming dashboard is live. Access real-time weather telemetry, educational soil health diagnostics, and predefined pest prevention advisories.
            </p>

            {/* Farmer Profile Info Badge */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-4 p-2 px-3 rounded-3 bg-black bg-opacity-25 small">
              <span><i className="bi bi-person-fill text-warning me-1"></i> <strong>{farmerName}</strong></span>
              <span>•</span>
              <span><i className="bi bi-envelope-fill text-info me-1"></i> {farmerEmail}</span>
              <span>•</span>
              <span><i className="bi bi-geo-alt-fill text-danger me-1"></i> {farmLocation}</span>
              <span>•</span>
              <span className="badge bg-success text-white">Role: {user?.role || 'farmer'}</span>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Link to="/crops" className="btn btn-warning text-dark fw-bold px-3 py-2 rounded-3 shadow-sm">
                <i className="bi bi-flower1 me-1"></i> Crop Management
              </Link>
              <Link to="/farms" className="btn btn-outline-light fw-semibold px-3 py-2 rounded-3">
                <i className="bi bi-geo-alt-fill me-1"></i> My Farms
              </Link>
              <a href="#soil-section" className="btn btn-light text-success fw-bold px-3 py-2 rounded-3 shadow-sm">
                <i className="bi bi-speedometer2 me-1"></i> Soil Analysis
              </a>
              <a href="#pest-section" className="btn btn-outline-light fw-semibold px-3 py-2 rounded-3">
                <i className="bi bi-shield-exclamation me-1"></i> Pest Alerts
              </a>
            </div>
          </div>
          <div className="col-lg-4 d-none d-lg-block text-center">
            <span style={{ fontSize: '7.5rem', opacity: 0.9 }}>🚜</span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="row g-3 mb-4">
        {/* Total Crops Card */}
        <div className="col-md-4">
          <div className="agri-card p-4 h-100 agri-card-hover border-start border-4 border-success shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted fw-bold text-uppercase">Total Crops</span>
              <div className="stat-icon-wrapper bg-success-subtle text-success p-2 rounded-circle">
                <i className="bi bi-flower1 fs-4"></i>
              </div>
            </div>
            <div className="display-6 fw-bold text-success mb-1">{crops.length}</div>
            <div className="small text-muted">Active crop records stored in MongoDB</div>
            <Link to="/crops" className="small text-success fw-bold text-decoration-none d-block mt-2">
              Manage crops &rarr;
            </Link>
          </div>
        </div>

        {/* Farm Location Card */}
        <div className="col-md-4">
          <div className="agri-card p-4 h-100 agri-card-hover border-start border-4 border-primary shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted fw-bold text-uppercase">Farm Location</span>
              <div className="stat-icon-wrapper bg-primary-subtle text-primary p-2 rounded-circle">
                <i className="bi bi-geo-alt-fill fs-4"></i>
              </div>
            </div>
            <div className="fs-4 fw-bold text-dark mb-1 text-truncate" title={farmLocation}>
              {farmLocation}
            </div>
            <div className="small text-muted">Configured agricultural district</div>
            <a href="#weather-section" className="small text-primary fw-bold text-decoration-none d-block mt-2">
              View local weather &rarr;
            </a>
          </div>
        </div>

        {/* Educational Pest Advisories Card */}
        <div className="col-md-4">
          <div className="agri-card p-4 h-100 agri-card-hover border-start border-4 border-warning shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted fw-bold text-uppercase">Pest Guides</span>
              <div className="stat-icon-wrapper bg-warning-subtle text-warning-emphasis p-2 rounded-circle">
                <i className="bi bi-shield-exclamation fs-4"></i>
              </div>
            </div>
            <div className="fs-4 fw-bold text-warning-emphasis mb-1">
              4 Predefined Guides
            </div>
            <div className="small text-muted">Common regional pest prevention tips</div>
            <a href="#pest-section" className="small text-warning-emphasis fw-bold text-decoration-none d-block mt-2">
              Read pest guide &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* 3. WEATHER FORECAST SECTION (Requirement 1) */}
      <div id="weather-section" className="agri-card p-4 p-md-5 mb-4 shadow-sm border-top border-4 border-primary">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-bold mb-2">
              Smart Weather Telemetry
            </span>
            <h3 className="fw-bold text-dark mb-0">
              <i className="bi bi-cloud-sun-fill text-primary me-2"></i> Weather Forecast
            </h3>
            <div className="small text-muted">
              Live meteorological telemetry via free weather API engine with backend API key security.
            </div>
          </div>

          {/* City Search Form */}
          <form onSubmit={handleWeatherSearch} className="d-flex gap-2">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-geo-alt-fill text-danger"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Enter city (e.g. Ludhiana, Fresno, Mumbai)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ minWidth: '220px' }}
              />
            </div>
            <button type="submit" disabled={weatherLoading} className="btn btn-agri shadow-sm">
              {weatherLoading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <>
                  <i className="bi bi-search me-1"></i> Search
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Handling for Invalid City Names */}
        {weatherError && (
          <div className="alert alert-danger py-3 d-flex align-items-center gap-2 mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill fs-5"></i>
            <div>
              <strong>Weather Query Error:</strong> {weatherError}
            </div>
          </div>
        )}

        {/* Weather Data Display */}
        {weatherLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Fetching meteorological data for "{weatherCity}"...</p>
          </div>
        ) : weatherData ? (
          <div>
            <div className="row g-4 align-items-center">
              {/* Main Temperature & Condition */}
              <div className="col-md-6 col-lg-5 text-center text-md-start">
                <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
                  <span style={{ fontSize: '4.5rem', lineHeight: 1 }}>{weatherData.icon || '🌤️'}</span>
                  <div>
                    <div className="display-4 fw-bold text-dark mb-0">
                      {weatherData.temperature}°C
                    </div>
                    <div className="fs-5 fw-semibold text-secondary">
                      {weatherData.weatherCondition}
                    </div>
                    <div className="small text-muted">
                      Location: <strong className="text-dark">{weatherData.city}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Humidity, Wind Speed, and Advisory */}
              <div className="col-md-6 col-lg-7">
                <div className="row g-3">
                  {/* Humidity Display */}
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border text-center text-sm-start h-100">
                      <div className="small text-muted fw-bold text-uppercase">Humidity</div>
                      <div className="fs-3 fw-bold text-primary my-1">
                        <i className="bi bi-droplet-fill me-1"></i> {weatherData.humidity}%
                      </div>
                      <div className="small text-muted">Canopy relative moisture</div>
                    </div>
                  </div>

                  {/* Wind Speed Display */}
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border text-center text-sm-start h-100">
                      <div className="small text-muted fw-bold text-uppercase">Wind Speed</div>
                      <div className="fs-3 fw-bold text-secondary my-1">
                        <i className="bi bi-wind me-1"></i> {weatherData.windSpeed} km/h
                      </div>
                      <div className="small text-muted">Field airflow speed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Agricultural Advice Strip */}
            <div className="row g-3 mt-3 pt-3 border-top">
              <div className="col-md-6">
                <div className="p-3 rounded-3 bg-success-subtle border border-success-subtle h-100">
                  <div className="fw-bold text-success small mb-1">
                    <i className="bi bi-shield-check me-1"></i> Chemical Spraying Safety:
                  </div>
                  <div className="small text-dark">{weatherData.sprayingAdvisory}</div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 rounded-3 bg-primary-subtle border border-primary-subtle h-100">
                  <div className="fw-bold text-primary small mb-1">
                    <i className="bi bi-water me-1"></i> Field Irrigation Advice:
                  </div>
                  <div className="small text-dark">{weatherData.irrigationAdvisory}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 4. SOIL HEALTH ANALYSIS SECTION (Requirement 2) */}
      <div id="soil-section" className="agri-card p-4 p-md-5 mb-4 shadow-sm border-top border-4 border-success">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-bold mb-2">
              Soil Health Diagnostics
            </span>
            <h3 className="fw-bold text-dark mb-0">
              <i className="bi bi-speedometer2 text-success me-2"></i> Soil Health Analysis
            </h3>
            <div className="small text-muted">
              Input soil type, pH, and moisture parameters to receive an indicative fertility score and improvement plan.
            </div>
          </div>
        </div>

        {/* Clear Educational Assessment Disclaimer (Mandatory Requirement) */}
        <div className="alert alert-warning border border-warning-subtle d-flex align-items-start gap-2 mb-4" role="alert">
          <i className="bi bi-info-circle-fill text-warning-emphasis fs-5 mt-1"></i>
          <div className="small">
            <strong>Educational Assessment Notice:</strong> This analysis is an <em>indicative educational assessment</em> based on standard agronomic heuristics and is <strong>not a certified laboratory test</strong>. For commercial crop planning or certified soil testing, please submit soil samples to an authorized government or agricultural extension testing laboratory.
          </div>
        </div>

        <div className="row g-4">
          {/* Soil Input Form */}
          <div className="col-lg-5">
            <div className="p-4 rounded-3 bg-light border">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-sliders text-success me-2"></i> Enter Soil Parameters
              </h5>

              <form onSubmit={handleSoilAnalyze}>
                {/* Soil Type */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">
                    <i className="bi bi-layers-fill text-success me-1"></i> Soil Type *
                  </label>
                  <select
                    className="form-select"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    required
                  >
                    <option value="Alluvial Loam">Alluvial Loam (Rich & Highly Fertile)</option>
                    <option value="Black Cotton Soil">Black Cotton Soil (High Moisture Retention)</option>
                    <option value="Clay Loam">Clay Loam (Heavy Mineral Composition)</option>
                    <option value="Sandy Loam">Sandy Loam (Fast Draining, Aerated)</option>
                    <option value="Red Laterite Soil">Red Laterite Soil (Iron Rich)</option>
                  </select>
                </div>

                {/* Soil pH */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-dark mb-0">
                      <i className="bi bi-droplet-half text-primary me-1"></i> Soil pH Level *
                    </label>
                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                      pH {soilPh}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="4.0"
                    max="10.0"
                    className="form-control"
                    value={soilPh}
                    onChange={(e) => setSoilPh(e.target.value)}
                    required
                  />
                  <div className="d-flex justify-content-between text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                    <span>4.0 (Acidic)</span>
                    <span className="text-success fw-bold">Optimal: 6.0 – 7.5</span>
                    <span>10.0 (Alkaline)</span>
                  </div>
                </div>

                {/* Moisture Level */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-dark mb-0">
                      <i className="bi bi-moisture text-info me-1"></i> Moisture Level (%) *
                    </label>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                      {moistureLevel}%
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-control"
                    value={moistureLevel}
                    onChange={(e) => setMoistureLevel(e.target.value)}
                    required
                  />
                  <div className="d-flex justify-content-between text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                    <span>0% (Dry Drought)</span>
                    <span className="text-primary fw-bold">Ideal: 45% – 70%</span>
                    <span>100% (Saturated)</span>
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  type="submit"
                  disabled={soilAnalyzing}
                  className="btn btn-agri w-100 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  {soilAnalyzing ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      <span>Calculating Agronomic Assessment...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lightning-charge-fill"></i>
                      <span>Analyze Soil Health</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Soil Result & Improvement Suggestions Display */}
          <div className="col-lg-7">
            {soilResult ? (
              <div className="p-4 rounded-3 bg-light border h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <div>
                      <span className="badge bg-success small px-2 py-1 mb-1">{soilType}</span>
                      <h4 className="fw-bold text-dark mb-0">Indicative Soil Health Result</h4>
                      <div className="small text-muted">Educational Agronomic Heuristic Score</div>
                    </div>
                    <div className="text-end">
                      <div className="display-6 fw-bold text-success mb-0">{soilResult.score}/100</div>
                      <span className={`badge ${soilResult.badgeClass} px-3 py-1 fs-6`}>
                        {soilResult.status}
                      </span>
                    </div>
                  </div>

                  {/* Improvement Suggestions */}
                  <div className="mb-3">
                    <h6 className="fw-bold text-dark mb-2">
                      <i className="bi bi-check2-circle text-success me-1"></i> Simple Soil Improvement Suggestions:
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      {soilResult.suggestions.map((sug, idx) => (
                        <div key={idx} className="p-3 rounded bg-white border d-flex align-items-start gap-2 small">
                          <span className="badge bg-success rounded-circle mt-1">{idx + 1}</span>
                          <span className="text-dark">{sug}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="small text-muted pt-3 border-top mt-3 fst-italic">
                  * Note: Re-test soil every planting season to adjust organic compost and fertilizer ratios.
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-3 bg-light border text-center h-100 d-flex flex-column justify-content-center align-items-center">
                <span className="fs-1 d-inline-block p-3 rounded-circle bg-success-subtle mb-3">🧪</span>
                <h5 className="fw-bold text-dark">Ready for Soil Analysis</h5>
                <p className="text-muted small" style={{ maxWidth: '400px' }}>
                  Adjust soil type, pH, and moisture parameters on the left and click <strong>"Analyze Soil Health"</strong> to generate your indicative assessment.
                </p>
                <button className="btn btn-sm btn-outline-success" onClick={handleSoilAnalyze}>
                  Run Sample Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. PREDEFINED EDUCATIONAL PEST ALERTS SECTION (Requirement 3) */}
      <div id="pest-section" className="agri-card p-4 p-md-5 mb-4 shadow-sm border-top border-4 border-warning">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-1 rounded-pill fw-bold mb-2">
              Integrated Pest Management Guide
            </span>
            <h3 className="fw-bold text-dark mb-0">
              <i className="bi bi-shield-exclamation text-warning me-2"></i> Predefined Educational Pest Advisory & Identification Guide
            </h3>
            <div className="small text-muted">
              Reference guide for common agricultural crop pests, identification symptoms, and biological prevention methods.
            </div>
          </div>
        </div>

        {/* Clear Notice: Predefined Alerts, Not Live Sensor Detection (Mandatory Requirement) */}
        <div className="alert alert-info border border-info-subtle d-flex align-items-start gap-2 mb-4" role="alert">
          <i className="bi bi-info-circle-fill text-info fs-5 mt-1"></i>
          <div className="small">
            <strong>Advisory Notice:</strong> The advisories below are <strong>predefined educational pest identification guidelines</strong> based on regional agronomy. <strong>This does not represent real-time IoT or live field camera/sensor detection.</strong> Farmers should conduct physical field inspections to verify symptoms.
          </div>
        </div>

        {/* Predefined Pest Cards Grid */}
        <div className="row g-4">
          {predefinedPests.map((pest) => (
            <div key={pest.id} className="col-md-6">
              <div className="agri-card p-4 h-100 d-flex flex-column justify-content-between bg-white border border-light-subtle shadow-sm">
                <div>
                  {/* Pest Header */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-3">{pest.icon}</span>
                      <h5 className="fw-bold text-dark mb-0">{pest.pestName}</h5>
                    </div>
                    <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle small">
                      Educational Guide
                    </span>
                  </div>

                  {/* Affected Crops */}
                  <div className="small text-muted mb-3">
                    <strong className="text-dark">
                      <i className="bi bi-tag-fill text-success me-1"></i> Affected Crops:
                    </strong>{' '}
                    {pest.affectedCrops.join(', ')}
                  </div>

                  {/* Symptoms */}
                  <div className="p-3 rounded bg-light border mb-3 small">
                    <strong className="text-dark d-block mb-1">
                      <i className="bi bi-search text-danger me-1"></i> Identification Symptoms:
                    </strong>
                    <span className="text-secondary">{pest.symptoms}</span>
                  </div>

                  {/* Prevention Suggestions */}
                  <div className="p-3 rounded bg-success-subtle border border-success-subtle small">
                    <strong className="text-success d-block mb-1">
                      <i className="bi bi-shield-check me-1"></i> Basic Prevention Suggestions:
                    </strong>
                    <span className="text-dark">{pest.prevention}</span>
                  </div>
                </div>

                <div className="pt-3 border-top mt-3 text-end">
                  <span className="badge bg-light text-muted border small">
                    Predefined Agronomic Reference
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Active Crop Records Overview (from MongoDB) */}
      <div className="agri-card p-4 shadow-sm border-top border-4 border-success">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0">
            <i className="bi bi-flower1 text-success me-2"></i> Your Monitored Crops (MongoDB)
          </h5>
          <Link to="/crops" className="btn btn-sm btn-agri shadow-sm">
            <i className="bi bi-plus-circle me-1"></i> Add / Manage Crops
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-success" role="status"></div>
            <div className="small text-muted mt-2">Connecting to MongoDB...</div>
          </div>
        ) : crops.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <p>No crops registered for this farmer account yet.</p>
            <Link to="/crops" className="btn btn-sm btn-agri">
              Add Your First Crop
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Crop Name</th>
                  <th>Land Area</th>
                  <th>Sowing Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((crop) => (
                  <tr key={crop._id}>
                    <td>
                      <div className="fw-bold text-dark">{crop.cropName || crop.name}</div>
                      <span className="badge bg-light text-muted border small">
                        ID: {String(crop._id).substring(18)}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {crop.landArea || crop.sizeAcres || 2.5} Acres
                      </span>
                    </td>
                    <td className="small text-muted">
                      {formatDate(crop.sowingDate || crop.plantingDate)}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          (crop.cropStatus || crop.healthStatus) === 'Healthy'
                            ? 'bg-success'
                            : (crop.cropStatus || crop.healthStatus) === 'Attention'
                            ? 'bg-warning text-dark'
                            : (crop.cropStatus || crop.healthStatus) === 'Critical'
                            ? 'bg-danger'
                            : 'bg-info text-dark'
                        } px-3 py-1`}
                      >
                        {crop.cropStatus || crop.healthStatus || 'Healthy'}
                      </span>
                    </td>
                    <td>
                      <Link to="/crops" className="btn btn-sm btn-outline-success">
                        Manage <i className="bi bi-arrow-right"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
