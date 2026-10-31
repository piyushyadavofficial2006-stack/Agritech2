import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const SoilAnalysisPage = () => {
  const { t } = useLanguage();

  const [inputs, setInputs] = useState({
    cropType: 'Wheat / Cereals',
    nitrogen: 72,
    phosphorus: 38,
    potassium: 190,
    ph: 6.8,
    moisture: 58
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/crops/analyze-soil', inputs);
      setResult(res.data);
    } catch (err) {
      console.error('Soil test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1 text-dark">
          <i className="bi bi-speedometer2 text-success me-2"></i>
          {t('navSoil')} & Fertilizer Recommendation Engine
        </h2>
        <p className="text-muted mb-0">
          Enter lab or digital soil probe metrics to receive an instant agronomic health score and prescriptive fertilizer plan.
        </p>
      </div>

      <div className="row g-4">
        {/* Input Parameters Form */}
        <div className="col-lg-5">
          <div className="agri-card p-4">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-sliders text-success me-2"></i>
              Soil Test Parameters
            </h5>

            <form onSubmit={handleAnalyze}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Target Crop Classification</label>
                <select
                  className="form-select"
                  value={inputs.cropType}
                  onChange={(e) => setInputs({ ...inputs, cropType: e.target.value })}
                >
                  <option value="Wheat / Cereals">Wheat / Cereals</option>
                  <option value="Basmati Rice / Paddy">Basmati Rice / Paddy</option>
                  <option value="Mustard / Oilseeds">Mustard / Oilseeds</option>
                  <option value="Cotton / Cash Crops">Cotton / Cash Crops</option>
                  <option value="Pulses / Chickpeas">Pulses / Chickpeas</option>
                  <option value="Vegetables / Horticultural">Vegetables / Horticultural</option>
                </select>
              </div>

              {/* Nitrogen */}
              <div className="mb-3">
                <div className="d-flex justify-content-between small">
                  <label className="form-label fw-semibold mb-1">{t('nitrogen')}</label>
                  <span className="text-success fw-bold">{inputs.nitrogen} kg/ha</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="20"
                  max="140"
                  value={inputs.nitrogen}
                  onChange={(e) => setInputs({ ...inputs, nitrogen: Number(e.target.value) })}
                />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                  <span>20 (Deficient)</span>
                  <span className="text-success fw-semibold">Ideal: 60-90</span>
                  <span>140 (Excess)</span>
                </div>
              </div>

              {/* Phosphorus */}
              <div className="mb-3">
                <div className="d-flex justify-content-between small">
                  <label className="form-label fw-semibold mb-1">{t('phosphorus')}</label>
                  <span className="text-success fw-bold">{inputs.phosphorus} kg/ha</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="10"
                  max="80"
                  value={inputs.phosphorus}
                  onChange={(e) => setInputs({ ...inputs, phosphorus: Number(e.target.value) })}
                />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                  <span>10 (Deficient)</span>
                  <span className="text-success fw-semibold">Ideal: 30-50</span>
                  <span>80 (High)</span>
                </div>
              </div>

              {/* Potassium */}
              <div className="mb-3">
                <div className="d-flex justify-content-between small">
                  <label className="form-label fw-semibold mb-1">{t('potassium')}</label>
                  <span className="text-success fw-bold">{inputs.potassium} kg/ha</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="80"
                  max="320"
                  value={inputs.potassium}
                  onChange={(e) => setInputs({ ...inputs, potassium: Number(e.target.value) })}
                />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                  <span>80 (Deficient)</span>
                  <span className="text-success fw-semibold">Ideal: 150-250</span>
                  <span>320 (High)</span>
                </div>
              </div>

              {/* pH Level */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">{t('soilPh')}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="4.0"
                    max="9.5"
                    className="form-control"
                    value={inputs.ph}
                    onChange={(e) => setInputs({ ...inputs, ph: Number(e.target.value) })}
                  />
                  <div className="small text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                    Ideal: 6.0 – 7.5
                  </div>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">{t('soilMoisture')} (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    className="form-control"
                    value={inputs.moisture}
                    onChange={(e) => setInputs({ ...inputs, moisture: Number(e.target.value) })}
                  />
                  <div className="small text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                    Ideal: 45 – 70%
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-agri w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Analyzing Agronomic Ratios...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-lightning-charge-fill"></i>
                    <span>Run Smart Soil Diagnostic</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Diagnosis Results & Recommendations */}
        <div className="col-lg-7">
          {result ? (
            <div className="agri-card p-4">
              {/* Score header */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 rounded-3 bg-light border mb-4">
                <div>
                  <div className="small text-muted text-uppercase fw-semibold">Soil Health Index</div>
                  <h3 className="fw-bold mb-0 text-dark">
                    {result.cropType} Diagnostic
                  </h3>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="text-end">
                    <div
                      className={`fs-3 fw-bold ${
                        result.score >= 80 ? 'text-success' : result.score >= 60 ? 'text-warning' : 'text-danger'
                      }`}
                    >
                      {result.score}/100
                    </div>
                    <span
                      className={`badge ${
                        result.healthStatus === 'Healthy'
                          ? 'bg-success'
                          : result.healthStatus === 'Attention'
                          ? 'bg-warning text-dark'
                          : 'bg-danger'
                      }`}
                    >
                      {result.healthStatus} Condition
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary message */}
              <div className="p-3 rounded-3 border-start border-4 border-success bg-success-subtle text-dark mb-4 small">
                <strong>Agronomic Evaluation:</strong> {result.summary}
              </div>

              {/* Issues detected */}
              {result.issues && result.issues.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold text-dark mb-2">
                    <i className="bi bi-exclamation-triangle-fill text-warning me-1"></i>
                    Nutrient & Balance Variances:
                  </h6>
                  <ul className="list-group list-group-flush border rounded-3 small">
                    {result.issues.map((issue, idx) => (
                      <li key={idx} className="list-group-item list-group-item-light text-danger fw-semibold">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action plan */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-check2-circle text-success me-1"></i>
                  Tailored Prescription & Action Plan:
                </h6>
                <div className="d-flex flex-column gap-2">
                  {result.actionPlan.map((action, idx) => (
                    <div key={idx} className="p-3 rounded bg-light border d-flex gap-2 align-items-start">
                      <span className="badge bg-success rounded-circle mt-1">{idx + 1}</span>
                      <div className="small text-dark fw-medium">{action}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Link to Store */}
              <div className="p-3 rounded-3 bg-light border d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <div className="fw-bold text-dark small">Procure Certified Soil Amendments</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    Purchase Bio-NPK, cold-pressed neem oil, or organic compost with doorstep farm delivery.
                  </div>
                </div>
                <Link to="/marketplace" className="btn btn-sm btn-agri">
                  Browse Agri Store <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          ) : (
            <div className="agri-card p-5 text-center h-100 d-flex flex-column justify-content-center align-items-center">
              <span className="fs-1">🧪</span>
              <h4 className="fw-bold text-dark mt-3">Ready for Soil Diagnostic</h4>
              <p className="text-muted" style={{ maxWidth: '420px' }}>
                Adjust the sliders on the left with your soil test report figures and click "Run Smart Soil Diagnostic" to view nutrient bioavailability and prescriptive dosages.
              </p>
              <button className="btn btn-agri" onClick={handleAnalyze}>
                Run Quick Demo Test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysisPage;
