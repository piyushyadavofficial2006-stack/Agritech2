import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import WeatherWidget from '../components/WeatherWidget';
import SoilHealthCard from '../components/SoilHealthCard';
import PestAlertBanner from '../components/PestAlertBanner';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [farmsRes, cropsRes, pestsRes] = await Promise.all([
          api.get('/farms').catch(() => ({ data: [] })),
          api.get('/crops').catch(() => ({ data: [] })),
          api.get('/pests').catch(() => ({ data: [] }))
        ]);
        setFarms(farmsRes.data || []);
        setCrops(cropsRes.data || []);
        setPestAlerts(pestsRes.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute summary metrics
  const totalAcreage = farms.reduce((acc, f) => acc + (Number(f.sizeAcres) || 0), 0);
  const healthyCropsCount = crops.filter((c) => c.healthStatus === 'Healthy').length;
  const healthRate = crops.length ? Math.round((healthyCropsCount / crops.length) * 100) : 100;
  const primaryCrop = crops[0] || null;

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div
        className="p-4 p-md-5 rounded-4 mb-4 text-white shadow-sm position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #15803d 0%, #166534 60%, #064e3b 100%)'
        }}
      >
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill mb-2">
              🌾 Digital Smart Agriculture
            </span>
            <h2 className="display-6 fw-bold mb-2">
              {t('welcomeBack')}, {user ? user.name : 'Farmer'}!
            </h2>
            <p className="lead text-white-50 mb-4" style={{ fontSize: '1.05rem' }}>
              Your smart farming command center is active. Real-time soil telemetry, micro-climate forecasts, and pest monitoring are synced with your farm profiles.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/farms" className="btn btn-warning text-dark fw-bold px-3 py-2 rounded-3">
                <i className="bi bi-plus-circle me-1"></i> {t('addNewFarm')}
              </Link>
              <Link to="/crops" className="btn btn-outline-light fw-semibold px-3 py-2 rounded-3">
                <i className="bi bi-flower1 me-1"></i> {t('addNewCrop')}
              </Link>
              <Link to="/soil" className="btn btn-success fw-semibold px-3 py-2 rounded-3">
                <i className="bi bi-speedometer2 me-1"></i> {t('navSoil')}
              </Link>
            </div>
          </div>
          <div className="col-lg-4 d-none d-lg-block text-center">
            <span style={{ fontSize: '7rem', opacity: 0.9 }}>🚜</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 agri-card-hover h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="stat-icon-wrapper bg-success-subtle text-success">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <span className="badge bg-light text-muted border small">Total Farms</span>
            </div>
            <div className="fs-3 fw-bold text-dark">{farms.length}</div>
            <div className="small text-muted">{Math.round(totalAcreage * 10) / 10} Acres Managed</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 agri-card-hover h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="stat-icon-wrapper bg-primary-subtle text-primary">
                <i className="bi bi-flower1"></i>
              </div>
              <span className="badge bg-light text-muted border small">Crops</span>
            </div>
            <div className="fs-3 fw-bold text-dark">{crops.length}</div>
            <div className="small text-muted">{healthyCropsCount} in prime health</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 agri-card-hover h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="stat-icon-wrapper bg-warning-subtle text-warning-emphasis">
                <i className="bi bi-heart-pulse-fill"></i>
              </div>
              <span className="badge bg-light text-muted border small">Health Score</span>
            </div>
            <div className="fs-3 fw-bold text-success">{healthRate}%</div>
            <div className="small text-muted">Optimal canopy vigor</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 agri-card-hover h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="stat-icon-wrapper bg-danger-subtle text-danger">
                <i className="bi bi-shield-exclamation"></i>
              </div>
              <span className="badge bg-danger-subtle text-danger border small">Field Alerts</span>
            </div>
            <div className="fs-3 fw-bold text-danger">{pestAlerts.length}</div>
            <div className="small text-muted">Pest & climate alerts</div>
          </div>
        </div>
      </div>

      {/* Real-time Weather & Soil Analytics Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <WeatherWidget defaultLocation={user?.state || 'Punjab'} />
        </div>

        <div className="col-lg-5">
          <SoilHealthCard
            soilHealth={primaryCrop?.soilHealth}
            cropName={primaryCrop?.name || 'Wheat Field (Sample)'}
            farmName={farms[0]?.name || 'Primary Farm'}
          />
        </div>
      </div>

      {/* Pest Alerts Banner */}
      <div className="mb-4">
        <PestAlertBanner alerts={pestAlerts} />
      </div>

      {/* Active Crop Monitoring List */}
      <div className="agri-card p-3 p-md-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-0 text-dark">
              <i className="bi bi-clock-history text-success me-2"></i>
              Active Crop Life-Cycle Tracking
            </h5>
            <div className="small text-muted">Real-time phenological stages and harvest estimates</div>
          </div>
          <Link to="/crops" className="btn btn-sm btn-outline-success">
            {t('viewAll')} ({crops.length}) <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {crops.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <p>No crops registered yet.</p>
            <Link to="/crops" className="btn btn-sm btn-success">
              + Register First Crop
            </Link>
          </div>
        ) : (
          <div className="row g-3">
            {crops.slice(0, 3).map((crop) => (
              <div key={crop._id} className="col-md-4">
                <div className="p-3 rounded-3 border bg-light h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <div className="fw-bold text-dark">{crop.name}</div>
                      <div className="small text-muted">{crop.variety}</div>
                    </div>
                    <span
                      className={`badge ${
                        crop.healthStatus === 'Healthy'
                          ? 'bg-success'
                          : crop.healthStatus === 'Attention'
                          ? 'bg-warning text-dark'
                          : 'bg-danger'
                      }`}
                    >
                      {crop.healthStatus}
                    </span>
                  </div>

                  <div className="small text-muted mb-2">
                    Stage: <strong className="text-success">{crop.stage}</strong> ({crop.progress || 50}%)
                  </div>

                  <div className="metric-bar-bg mb-3">
                    <div
                      className="metric-bar-fill bg-success"
                      style={{ width: `${crop.progress || 50}%` }}
                    ></div>
                  </div>

                  <div className="d-flex justify-content-between small text-muted border-top pt-2">
                    <span>Sown: {crop.plantingDate}</span>
                    <span>Harvest: {crop.expectedHarvestDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Services */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="agri-card p-3 text-center agri-card-hover h-100">
            <span className="fs-1">🧪</span>
            <h6 className="fw-bold mt-2 text-dark">{t('navSoil')}</h6>
            <p className="small text-muted">
              Input field N-P-K & pH values to receive instant AI fertilizer dosage recommendations.
            </p>
            <Link to="/soil" className="btn btn-sm btn-outline-success">
              Run Soil Test
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="agri-card p-3 text-center agri-card-hover h-100">
            <span className="fs-1">🛍️</span>
            <h6 className="fw-bold mt-2 text-dark">{t('navMarketplace')}</h6>
            <p className="small text-muted">
              Order certified seeds, bio-fertilizers, neem oil, and smart drip kits directly.
            </p>
            <Link to="/marketplace" className="btn btn-sm btn-outline-success">
              Browse Supplies
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="agri-card p-3 text-center agri-card-hover h-100">
            <span className="fs-1">👨‍🏫</span>
            <h6 className="fw-bold mt-2 text-dark">{t('navForum')}</h6>
            <p className="small text-muted">
              Get certified agronomist answers for crop pests, soil salinity, and yield enhancement.
            </p>
            <Link to="/forum" className="btn btn-sm btn-outline-success">
              Ask Agricultural Expert
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
