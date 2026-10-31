import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const SoilHealthCard = ({ soilHealth = {}, cropName, farmName }) => {
  const { t } = useLanguage();

  const n = soilHealth.nitrogen || 75;
  const p = soilHealth.phosphorus || 42;
  const k = soilHealth.potassium || 185;
  const ph = soilHealth.ph || 6.8;
  const moisture = soilHealth.moisture || 58;

  // Percentage calculations for visual meters
  const nPercent = Math.min(100, Math.round((n / 120) * 100));
  const pPercent = Math.min(100, Math.round((p / 70) * 100));
  const kPercent = Math.min(100, Math.round((k / 300) * 100));
  const phPercent = Math.min(100, Math.round(((ph - 4) / (9 - 4)) * 100));
  const mPercent = Math.min(100, moisture);

  // Status computation
  let statusBadge = { bg: 'badge-healthy', label: 'Balanced Soil', text: 'All macronutrients within optimal agronomic threshold.' };
  if (ph < 6.0 || ph > 7.8 || moisture < 35 || n < 50) {
    statusBadge = { bg: 'badge-attention', label: 'Action Advised', text: 'Nutrient or moisture variance detected; check below recommendations.' };
  }

  return (
    <div className="agri-card p-3 p-md-4 h-100">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 className="fw-bold mb-0 text-dark">
            <i className="bi bi-pie-chart-fill text-success me-2"></i>
            {t('soilDiagnosis')}
          </h5>
          {(cropName || farmName) && (
            <div className="small text-muted">
              {cropName && <span className="fw-semibold text-dark">{cropName}</span>}
              {farmName && <span> • {farmName}</span>}
            </div>
          )}
        </div>
        <span className={`agri-badge ${statusBadge.bg}`}>
          {statusBadge.label}
        </span>
      </div>

      <p className="small text-muted mb-4">{statusBadge.text}</p>

      {/* Macronutrient Bars */}
      <div className="d-flex flex-column gap-3 mb-4">
        {/* Nitrogen */}
        <div>
          <div className="d-flex justify-content-between small mb-1">
            <span className="fw-semibold text-dark">{t('nitrogen')}</span>
            <span className="text-muted fw-bold">{n} kg/ha <span className="fw-normal text-secondary">(Target: 60-90)</span></span>
          </div>
          <div className="metric-bar-bg">
            <div
              className="metric-bar-fill"
              style={{
                width: `${nPercent}%`,
                backgroundColor: n >= 60 && n <= 90 ? '#16a34a' : n < 60 ? '#f59e0b' : '#3b82f6'
              }}
            ></div>
          </div>
        </div>

        {/* Phosphorus */}
        <div>
          <div className="d-flex justify-content-between small mb-1">
            <span className="fw-semibold text-dark">{t('phosphorus')}</span>
            <span className="text-muted fw-bold">{p} kg/ha <span className="fw-normal text-secondary">(Target: 30-50)</span></span>
          </div>
          <div className="metric-bar-bg">
            <div
              className="metric-bar-fill"
              style={{
                width: `${pPercent}%`,
                backgroundColor: p >= 30 && p <= 50 ? '#16a34a' : '#f59e0b'
              }}
            ></div>
          </div>
        </div>

        {/* Potassium */}
        <div>
          <div className="d-flex justify-content-between small mb-1">
            <span className="fw-semibold text-dark">{t('potassium')}</span>
            <span className="text-muted fw-bold">{k} kg/ha <span className="fw-normal text-secondary">(Target: 150-250)</span></span>
          </div>
          <div className="metric-bar-bg">
            <div
              className="metric-bar-fill"
              style={{
                width: `${kPercent}%`,
                backgroundColor: k >= 150 && k <= 250 ? '#16a34a' : '#f59e0b'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* pH and Moisture Dual Card */}
      <div className="row g-2">
        <div className="col-6">
          <div className="p-3 rounded bg-light border text-center">
            <div className="small text-muted">{t('soilPh')}</div>
            <div className="fs-4 fw-bold text-dark my-1">{ph}</div>
            <div className="badge bg-success-subtle text-success border border-success-subtle small">
              {ph >= 6.0 && ph <= 7.5 ? 'Neutral (Ideal)' : ph < 6.0 ? 'Acidic' : 'Alkaline'}
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="p-3 rounded bg-light border text-center">
            <div className="small text-muted">{t('soilMoisture')}</div>
            <div className="fs-4 fw-bold text-primary my-1">{moisture}%</div>
            <div className="badge bg-primary-subtle text-primary border border-primary-subtle small">
              {moisture >= 45 && moisture <= 75 ? 'Optimal Hydration' : moisture < 45 ? 'Irrigate Soon' : 'High Moisture'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilHealthCard;
