import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const CropsPage = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmFilter, setSelectedFarmFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);

  const [formData, setFormData] = useState({
    farmId: '',
    name: '',
    category: 'Cereals & Grains',
    variety: '',
    stage: 'Vegetative',
    progress: 40,
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    expectedYieldTonnes: 5.0,
    nitrogen: 75,
    phosphorus: 42,
    potassium: 185,
    ph: 6.8,
    moisture: 60,
    notes: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cropsRes, farmsRes] = await Promise.all([
        api.get('/crops'),
        api.get('/farms')
      ]);
      setCrops(cropsRes.data);
      setFarms(farmsRes.data);
      if (farmsRes.data.length && !formData.farmId) {
        setFormData((prev) => ({ ...prev, farmId: farmsRes.data[0]._id }));
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingCrop(null);
    setFormData({
      farmId: farms[0]?._id || '',
      name: '',
      category: 'Cereals & Grains',
      variety: '',
      stage: 'Vegetative',
      progress: 35,
      plantingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: '',
      expectedYieldTonnes: 4.5,
      nitrogen: 75,
      phosphorus: 42,
      potassium: 185,
      ph: 6.8,
      moisture: 60,
      notes: ''
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farmId: crop.farmId,
      name: crop.name,
      category: crop.category || 'Cereals & Grains',
      variety: crop.variety || '',
      stage: crop.stage || 'Vegetative',
      progress: crop.progress || 50,
      plantingDate: crop.plantingDate,
      expectedHarvestDate: crop.expectedHarvestDate,
      expectedYieldTonnes: crop.expectedYieldTonnes || 4.5,
      nitrogen: crop.soilHealth?.nitrogen || 75,
      phosphorus: crop.soilHealth?.phosphorus || 40,
      potassium: crop.soilHealth?.potassium || 180,
      ph: crop.soilHealth?.ph || 6.8,
      moisture: crop.soilHealth?.moisture || 55,
      notes: crop.notes || ''
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.farmId || !formData.expectedHarvestDate) {
      setErrorMsg('Please select a farm, enter crop name and expected harvest date.');
      return;
    }

    const payload = {
      farmId: formData.farmId,
      name: formData.name,
      category: formData.category,
      variety: formData.variety,
      stage: formData.stage,
      progress: Number(formData.progress),
      plantingDate: formData.plantingDate,
      expectedHarvestDate: formData.expectedHarvestDate,
      expectedYieldTonnes: Number(formData.expectedYieldTonnes),
      soilHealth: {
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        ph: Number(formData.ph),
        moisture: Number(formData.moisture)
      },
      notes: formData.notes
    };

    try {
      if (editingCrop) {
        await api.put(`/crops/${editingCrop._id}`, payload);
        setSuccessMsg(`Crop "${formData.name}" updated successfully.`);
      } else {
        await api.post('/crops', payload);
        setSuccessMsg(`Crop "${formData.name}" enrolled in monitoring.`);
      }
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving crop record.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Remove monitoring record for "${name}"?`)) {
      try {
        await api.delete(`/crops/${id}`);
        setSuccessMsg(`Crop "${name}" removed.`);
        fetchData();
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed.');
      }
    }
  };

  const filteredCrops =
    selectedFarmFilter === 'ALL'
      ? crops
      : crops.filter((c) => String(c.farmId) === String(selectedFarmFilter));

  return (
    <div className="container py-4">
      {/* Header & Controls */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-flower1 text-success me-2"></i>
            {t('navCrops')}
          </h2>
          <p className="text-muted mb-0">
            Track phenological crop stages, real-time soil nutrient telemetry, and estimated harvest yield.
          </p>
        </div>
        <button className="btn btn-agri d-flex align-items-center gap-2" onClick={openAddModal}>
          <i className="bi bi-plus-circle-fill"></i>
          <span>{t('addNewCrop')}</span>
        </button>
      </div>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {/* Filter by Farm Pill Buttons */}
      {farms.length > 0 && (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
          <span className="small text-muted fw-semibold">Filter by Farm:</span>
          <button
            className={`btn btn-sm ${selectedFarmFilter === 'ALL' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => setSelectedFarmFilter('ALL')}
          >
            All Plots ({crops.length})
          </button>
          {farms.map((f) => (
            <button
              key={f._id}
              className={`btn btn-sm ${selectedFarmFilter === f._id ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setSelectedFarmFilter(f._id)}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Loading crop records and telemetry...</p>
        </div>
      ) : filteredCrops.length === 0 ? (
        <div className="agri-card p-5 text-center">
          <span className="fs-1">🌱</span>
          <h4 className="fw-bold mt-3 text-dark">No Monitored Crops Found</h4>
          <p className="text-muted" style={{ maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            Register your wheat, rice, corn, or vegetables to unlock stage progression alerts and soil balancing advisory.
          </p>
          <button className="btn btn-agri" onClick={openAddModal}>
            <i className="bi bi-plus-lg me-1"></i> Register Crop
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredCrops.map((crop) => {
            const farm = farms.find((f) => String(f._id) === String(crop.farmId));
            return (
              <div key={crop._id} className="col-lg-6">
                <div className="agri-card p-4 h-100 d-flex flex-column justify-content-between agri-card-hover">
                  <div>
                    {/* Header info */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div className="small text-success fw-bold text-uppercase">
                          {crop.category} • {farm?.name || 'Assigned Farm'}
                        </div>
                        <h4 className="fw-bold text-dark mb-0">{crop.name}</h4>
                        <div className="small text-muted">{crop.variety || 'Certified Variety'}</div>
                      </div>
                      <span
                        className={`badge ${
                          crop.healthStatus === 'Healthy'
                            ? 'bg-success'
                            : crop.healthStatus === 'Attention'
                            ? 'bg-warning text-dark'
                            : 'bg-danger'
                        } fs-6 px-3 py-1`}
                      >
                        {crop.healthStatus}
                      </span>
                    </div>

                    {/* Stage Progress Bar */}
                    <div className="my-3 p-3 rounded bg-light border">
                      <div className="d-flex justify-content-between small fw-bold mb-1">
                        <span className="text-dark">Growth Stage: <span className="text-success">{crop.stage}</span></span>
                        <span className="text-muted">{crop.progress || 50}% Lifecycle</span>
                      </div>
                      <div className="metric-bar-bg mb-2">
                        <div
                          className="metric-bar-fill bg-success"
                          style={{ width: `${crop.progress || 50}%` }}
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                        <span>Sowing</span>
                        <span>Vegetative</span>
                        <span>Flowering</span>
                        <span>Ripening</span>
                        <span>Harvest</span>
                      </div>
                    </div>

                    {/* Dates & Soil telemetry badge strip */}
                    <div className="row g-2 mb-3 text-center">
                      <div className="col-4">
                        <div className="p-2 rounded bg-light border">
                          <span className="small text-muted d-block">Nitrogen (N)</span>
                          <strong className="text-dark">{crop.soilHealth?.nitrogen || 75} kg/ha</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 rounded bg-light border">
                          <span className="small text-muted d-block">Soil pH</span>
                          <strong className="text-dark">{crop.soilHealth?.ph || 6.8}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 rounded bg-light border">
                          <span className="small text-muted d-block">Moisture</span>
                          <strong className="text-primary">{crop.soilHealth?.moisture || 58}%</strong>
                        </div>
                      </div>
                    </div>

                    {crop.notes && (
                      <div className="small text-secondary mb-3 fst-italic">
                        <i className="bi bi-journal-text me-1"></i> {crop.notes}
                      </div>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                    <div className="small text-muted">
                      Expected Yield: <strong className="text-dark">{crop.expectedYieldTonnes || 5} Tonnes</strong>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEditModal(crop)}
                      >
                        <i className="bi bi-pencil me-1"></i> Update Metrics
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(crop._id, crop.name)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Crop Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog-custom p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold mb-0 text-dark">
                {editingCrop ? 'Update Crop Monitoring & Soil Data' : 'Register New Crop'}
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 small" role="alert">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Select Farm Plot *</label>
                <select
                  className="form-select"
                  value={formData.farmId}
                  onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                  required
                >
                  {farms.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.location} - {f.sizeAcres} Acres)
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-8">
                  <label className="form-label small fw-semibold">Crop Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Wheat (Sharbati Gold)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Cereals & Grains">Cereals & Grains</option>
                    <option value="Pulses & Legumes">Pulses & Legumes</option>
                    <option value="Oilseeds">Oilseeds</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Cash Crops / Cotton">Cash Crops / Cotton</option>
                  </select>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Variety / Seed Strain</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. HD-3086 or Pusa 1121"
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Growth Stage</label>
                  <select
                    className="form-select"
                    value={formData.stage}
                    onChange={(e) => {
                      const st = e.target.value;
                      const prog =
                        st === 'Sowing'
                          ? 15
                          : st === 'Vegetative'
                          ? 40
                          : st === 'Flowering'
                          ? 65
                          : st === 'Ripening'
                          ? 85
                          : 100;
                      setFormData({ ...formData, stage: st, progress: prog });
                    }}
                  >
                    <option value="Sowing">Sowing / Germination</option>
                    <option value="Vegetative">Vegetative Growth</option>
                    <option value="Flowering">Flowering / Booting</option>
                    <option value="Ripening">Grain Filling / Ripening</option>
                    <option value="Harvest Ready">Harvest Ready</option>
                  </select>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Planting Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.plantingDate}
                    onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Expected Harvest Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.expectedHarvestDate}
                    onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <h6 className="fw-bold text-dark mt-4 mb-2">
                <i className="bi bi-speedometer text-success me-1"></i>
                Soil Health Parameters (NPK, pH, Moisture)
              </h6>
              <div className="row g-2 mb-3">
                <div className="col-4">
                  <label className="form-label small">Nitrogen (kg/ha)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={formData.nitrogen}
                    onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small">Phosphorus (kg/ha)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={formData.phosphorus}
                    onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small">Potassium (kg/ha)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={formData.potassium}
                    onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small">Soil pH Level (0 - 14)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="3"
                    max="11"
                    className="form-control form-control-sm"
                    value={formData.ph}
                    onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small">Moisture Content (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-control form-control-sm"
                    value={formData.moisture}
                    onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Agronomist Field Notes</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Bio-fertilizer spray completed. Canopy leaves deep green."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-agri">
                  {editingCrop ? 'Save Changes' : 'Register Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropsPage;
