import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PestAlertBanner = ({ alerts = [], showLink = true }) => {
  const [selectedAlert, setSelectedAlert] = useState(null);

  if (!alerts || !alerts.length) return null;

  return (
    <div className="agri-card p-3 p-md-4 border-start border-4 border-warning">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-4 text-warning">⚠️</span>
          <div>
            <h5 className="fw-bold mb-0 text-dark">Active Agricultural Pest & Disease Alerts</h5>
            <div className="small text-muted">Field advisories tailored to regional weather conditions</div>
          </div>
        </div>
        {showLink && (
          <Link to="/pests" className="btn btn-sm btn-outline-warning text-dark fw-semibold">
            View All Alerts ({alerts.length}) <i className="bi bi-arrow-right"></i>
          </Link>
        )}
      </div>

      <div className="row g-3">
        {alerts.slice(0, 2).map((alert) => (
          <div key={alert._id} className="col-md-6">
            <div className="p-3 rounded-3 border bg-light h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="fw-bold text-dark fs-6">{alert.pestName}</span>
                  <span
                    className={`badge ${
                      alert.riskLevel === 'High'
                        ? 'bg-danger text-white'
                        : alert.riskLevel === 'Medium'
                        ? 'bg-warning text-dark'
                        : 'bg-success text-white'
                    }`}
                  >
                    {alert.riskLevel} Risk
                  </span>
                </div>

                <div className="small text-muted mb-2">
                  <i className="bi bi-tag-fill me-1 text-success"></i>
                  Crops: {Array.isArray(alert.targetCrops) ? alert.targetCrops.join(', ') : alert.targetCrops}
                </div>

                <div className="small text-secondary mb-2" style={{ fontSize: '0.82rem' }}>
                  <strong>Symptoms:</strong> {alert.symptoms}
                </div>
              </div>

              <div className="pt-2 border-top mt-2 d-flex justify-content-between align-items-center">
                <span className="small text-success fw-semibold">
                  <i className="bi bi-shield-check me-1"></i>
                  Organic: {alert.organicControl ? 'Available' : 'N/A'}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none p-0 fw-semibold text-primary"
                  onClick={() => setSelectedAlert(alert)}
                >
                  View Remedy Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedAlert && (
        <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="modal-dialog-custom p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">
                <i className="bi bi-bug-fill text-danger me-2"></i>
                {selectedAlert.pestName}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedAlert(null)}
              ></button>
            </div>

            <div className="badge bg-danger mb-3 px-3 py-2 fs-6">
              Risk Level: {selectedAlert.riskLevel}
            </div>

            <div className="mb-3">
              <h6 className="fw-bold text-dark">Affected Agricultural Crops:</h6>
              <div className="text-secondary small">
                {Array.isArray(selectedAlert.targetCrops)
                  ? selectedAlert.targetCrops.join(', ')
                  : selectedAlert.targetCrops}
              </div>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold text-dark">Field Symptoms:</h6>
              <p className="text-secondary small mb-0">{selectedAlert.symptoms}</p>
            </div>

            <div className="p-3 rounded bg-success-subtle border border-success-subtle mb-3">
              <h6 className="fw-bold text-success mb-1">
                <i className="bi bi-flower2 me-1"></i> Recommended Organic Control:
              </h6>
              <div className="text-dark small">{selectedAlert.organicControl || 'Apply cold-pressed neem seed extract (5%).'}</div>
            </div>

            <div className="p-3 rounded bg-warning-subtle border border-warning-subtle mb-3">
              <h6 className="fw-bold text-warning-emphasis mb-1">
                <i className="bi bi-capsule me-1"></i> Chemical / Conventional Control:
              </h6>
              <div className="text-dark small">{selectedAlert.chemicalControl || 'Consult local agronomy officer.'}</div>
            </div>

            <div className="text-end">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedAlert(null)}
              >
                Close Advisory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PestAlertBanner;
