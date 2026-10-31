import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const PestsPage = () => {
  const { t } = useLanguage();
  const { isAdmin, isExpert } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAlertData, setNewAlertData] = useState({
    pestName: '',
    targetCrops: 'Wheat, Barley',
    riskLevel: 'High',
    region: 'Northern Plains',
    weatherCondition: 'Cool nights and heavy morning dew',
    symptoms: '',
    prevention: '',
    chemicalControl: '',
    organicControl: ''
  });

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pests');
      setAlerts(res.data);
    } catch (err) {
      console.error('Error fetching pests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pests', newAlertData);
      setShowAddModal(false);
      fetchAlerts();
      setNewAlertData({
        pestName: '',
        targetCrops: '',
        riskLevel: 'Medium',
        region: '',
        weatherCondition: '',
        symptoms: '',
        prevention: '',
        chemicalControl: '',
        organicControl: ''
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish advisory.');
    }
  };

  const filtered = alerts.filter((a) => {
    const matchesRisk = riskFilter === 'ALL' || a.riskLevel.toUpperCase() === riskFilter;
    const matchesSearch =
      !searchTerm ||
      a.pestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(a.targetCrops) && a.targetCrops.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesRisk && matchesSearch;
  });

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-shield-exclamation text-danger me-2"></i>
            {t('navPests')} & Crop Disease Advisory
          </h2>
          <p className="text-muted mb-0">
            Early detection warning system, symptoms catalog, and dual organic/chemical integrated pest management (IPM).
          </p>
        </div>

        {(isAdmin || isExpert) && (
          <button className="btn btn-agri" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-megaphone-fill me-1"></i> Issue Pest Advisory
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="agri-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by pest name, symptoms, or crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-md-end gap-2">
            <button
              className={`btn btn-sm ${riskFilter === 'ALL' ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setRiskFilter('ALL')}
            >
              All Risks ({alerts.length})
            </button>
            <button
              className={`btn btn-sm ${riskFilter === 'HIGH' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setRiskFilter('HIGH')}
            >
              High Risk
            </button>
            <button
              className={`btn btn-sm ${riskFilter === 'MEDIUM' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}`}
              onClick={() => setRiskFilter('MEDIUM')}
            >
              Medium Risk
            </button>
            <button
              className={`btn btn-sm ${riskFilter === 'LOW' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setRiskFilter('LOW')}
            >
              Low Risk
            </button>
          </div>
        </div>
      </div>

      {/* Pest Cards Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Scanning agricultural alerts database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="agri-card p-5 text-center">
          <span className="fs-1">🛡️</span>
          <h4 className="fw-bold text-dark mt-3">No Active Pest Threats Match Criteria</h4>
          <p className="text-muted">Your crops are safe under current environmental parameters.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((item) => (
            <div key={item._id} className="col-md-6">
              <div className="agri-card p-4 h-100 d-flex flex-column justify-content-between agri-card-hover">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span
                      className={`badge ${
                        item.riskLevel === 'High'
                          ? 'bg-danger text-white'
                          : item.riskLevel === 'Medium'
                          ? 'bg-warning text-dark'
                          : 'bg-success text-white'
                      } px-3 py-1 fs-6`}
                    >
                      {item.riskLevel} Risk Alert
                    </span>
                    <span className="small text-muted">
                      <i className="bi bi-geo-alt me-1"></i>
                      {item.region}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1">{item.pestName}</h5>

                  <div className="small text-success fw-semibold mb-3">
                    <i className="bi bi-tag me-1"></i>
                    Host Crops: {Array.isArray(item.targetCrops) ? item.targetCrops.join(', ') : item.targetCrops}
                  </div>

                  <div className="p-3 rounded bg-light border mb-3 small">
                    <strong>Symptoms:</strong>
                    <p className="text-secondary mb-0 mt-1">{item.symptoms}</p>
                  </div>

                  {item.weatherCondition && (
                    <div className="small text-muted mb-3">
                      <strong>Favorable Weather:</strong> {item.weatherCondition}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                  <span className="small text-muted">Integrated Pest Management (IPM)</span>
                  <button
                    className="btn btn-sm btn-agri"
                    onClick={() => setSelectedAlert(item)}
                  >
                    View Controls & Treatment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedAlert && (
        <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="modal-dialog-custom p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-shield-shaded text-success me-2"></i>
                {selectedAlert.pestName}
              </h5>
              <button type="button" className="btn-close" onClick={() => setSelectedAlert(null)}></button>
            </div>

            <div className="mb-3">
              <span
                className={`badge ${
                  selectedAlert.riskLevel === 'High'
                    ? 'bg-danger'
                    : selectedAlert.riskLevel === 'Medium'
                    ? 'bg-warning text-dark'
                    : 'bg-success'
                } px-3 py-2 fs-6`}
              >
                {selectedAlert.riskLevel} Risk Level
              </span>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold text-dark">Target Host Crops:</h6>
              <div className="text-secondary small">
                {Array.isArray(selectedAlert.targetCrops)
                  ? selectedAlert.targetCrops.join(', ')
                  : selectedAlert.targetCrops}
              </div>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold text-dark">Field Identification Symptoms:</h6>
              <div className="p-3 rounded bg-light border small text-dark">
                {selectedAlert.symptoms}
              </div>
            </div>

            {selectedAlert.prevention && (
              <div className="mb-3">
                <h6 className="fw-bold text-dark">Cultural & Preventive Practices:</h6>
                <div className="small text-secondary">{selectedAlert.prevention}</div>
              </div>
            )}

            <div className="p-3 rounded-3 bg-success-subtle border border-success-subtle mb-3">
              <h6 className="fw-bold text-success mb-1">
                <i className="bi bi-leaf-fill me-1"></i> 100% Organic Bio-Control Remedy:
              </h6>
              <div className="text-dark small">
                {selectedAlert.organicControl || 'Apply 5% Neem Seed Kernel Extract (NSKE) or Trichoderma.'}
              </div>
            </div>

            <div className="p-3 rounded-3 bg-warning-subtle border border-warning-subtle mb-3">
              <h6 className="fw-bold text-warning-emphasis mb-1">
                <i className="bi bi-capsule me-1"></i> Conventional Chemical Control:
              </h6>
              <div className="text-dark small">
                {selectedAlert.chemicalControl || 'Consult district agricultural extension officer.'}
              </div>
            </div>

            <div className="text-end">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedAlert(null)}
              >
                Dismiss Advisory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Advisory Modal (Admin/Expert) */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog-custom p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold mb-0 text-dark">Publish Field Pest Advisory</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
            </div>

            <form onSubmit={handleCreateAlert}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Pest / Pathogen Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Yellow Rust or Fall Armyworm"
                  value={newAlertData.pestName}
                  onChange={(e) => setNewAlertData({ ...newAlertData, pestName: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Risk Level</label>
                  <select
                    className="form-select"
                    value={newAlertData.riskLevel}
                    onChange={(e) => setNewAlertData({ ...newAlertData, riskLevel: e.target.value })}
                  >
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Region / Zone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAlertData.region}
                    onChange={(e) => setNewAlertData({ ...newAlertData, region: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Target Crops (Comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Wheat, Barley, Oats"
                  value={newAlertData.targetCrops}
                  onChange={(e) => setNewAlertData({ ...newAlertData, targetCrops: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Symptoms *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={newAlertData.symptoms}
                  onChange={(e) => setNewAlertData({ ...newAlertData, symptoms: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Organic Remedy</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Spray cold-pressed neem oil (10,000 ppm)"
                  value={newAlertData.organicControl}
                  onChange={(e) => setNewAlertData({ ...newAlertData, organicControl: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Chemical Control</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Tilt 25% EC @ 1ml/L"
                  value={newAlertData.chemicalControl}
                  onChange={(e) => setNewAlertData({ ...newAlertData, chemicalControl: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-agri">
                  Publish Advisory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PestsPage;
