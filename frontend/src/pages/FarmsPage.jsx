import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FarmsPage = () => {
  const { user } = useAuth();

  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  // Exact farm fields matching Mongoose model:
  // farmName, location, landArea, soilType
  const [formData, setFormData] = useState({
    farmName: '',
    location: user?.location || '',
    landArea: '',
    soilType: 'Alluvial Loam'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Fetch Actual Farm Records from MongoDB
  const fetchFarms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/farms');
      setFarms(res.data || []);
    } catch (err) {
      console.error('Error fetching farms:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to load farms from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const openAddModal = () => {
    setEditingFarm(null);
    setFormData({
      farmName: '',
      location: user?.location || 'Ludhiana, Punjab',
      landArea: '',
      soilType: 'Alluvial Loam'
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (farm) => {
    setEditingFarm(farm);
    setFormData({
      farmName: farm.farmName || farm.name || '',
      location: farm.location || '',
      landArea: farm.landArea || farm.sizeAcres || '',
      soilType: farm.soilType || 'Alluvial Loam'
    });
    setErrorMsg('');
    setShowModal(true);
  };

  // 2. Submit Farm Form (Add or Edit) to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.farmName.trim()) {
      setErrorMsg('Please enter a farm plot name.');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMsg('Please enter the farm location.');
      return;
    }
    if (!formData.landArea || Number(formData.landArea) <= 0) {
      setErrorMsg('Please enter a valid land area in acres.');
      return;
    }

    const payload = {
      farmName: formData.farmName.trim(),
      name: formData.farmName.trim(),
      location: formData.location.trim(),
      landArea: Number(formData.landArea),
      sizeAcres: Number(formData.landArea),
      soilType: formData.soilType
    };

    try {
      if (editingFarm) {
        // Edit Farm in MongoDB (PUT /api/farms/:id)
        await api.put(`/farms/${editingFarm._id}`, payload);
        setSuccessMsg(`Farm "${formData.farmName}" updated successfully in MongoDB!`);
      } else {
        // Add Farm in MongoDB (POST /api/farms)
        await api.post('/farms', payload);
        setSuccessMsg(`New farm plot "${formData.farmName}" saved to MongoDB!`);
      }
      setShowModal(false);
      fetchFarms();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save farm record.');
    }
  };

  // 3. Delete Farm Record from MongoDB
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete farm "${name}" from MongoDB?`)) {
      try {
        await api.delete(`/farms/${id}`);
        setSuccessMsg(`Farm "${name}" deleted successfully.`);
        fetchFarms();
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Could not delete farm record.');
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Actual Farmer Information Card */}
      <div className="agri-card p-4 mb-4 shadow-sm border-start border-4 border-success bg-white">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <span className="fs-1 p-2 rounded-circle bg-success-subtle">👨‍🌾</span>
            <div>
              <div className="small text-muted text-uppercase fw-bold">Verified Farmer Profile</div>
              <h4 className="fw-bold text-dark mb-0">{user?.name || 'Farmer Account'}</h4>
              <div className="small text-muted">
                <i className="bi bi-envelope me-1 text-success"></i> {user?.email || 'farmer@agritech.com'} •{' '}
                <i className="bi bi-geo-alt me-1 text-danger"></i> {user?.location || 'Ludhiana, Punjab'}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fs-6">
              Role: {user?.role || 'farmer'}
            </span>
            <button className="btn btn-agri d-flex align-items-center gap-2 shadow-sm" onClick={openAddModal}>
              <i className="bi bi-plus-circle-fill"></i>
              <span>Add Farm Plot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 mb-3" role="alert">
          <i className="bi bi-check-circle-fill"></i>
          <div>{successMsg}</div>
          <button type="button" className="btn-close ms-auto" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2 mb-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <div>{errorMsg}</div>
          <button type="button" className="btn-close ms-auto" onClick={() => setErrorMsg('')}></button>
        </div>
      )}

      {/* Actual Farm Records from MongoDB */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Loading farm holdings from MongoDB...</p>
        </div>
      ) : farms.length === 0 ? (
        <div className="agri-card p-5 text-center shadow-sm">
          <span className="fs-1 d-inline-block p-3 rounded-circle bg-success-subtle mb-3">🌾</span>
          <h4 className="fw-bold text-dark">No Farm Plots Found in MongoDB</h4>
          <p className="text-muted" style={{ maxWidth: '460px', margin: '0 auto 1.5rem' }}>
            Register your first farmland plot to store acreage, soil classification, and regional location in MongoDB.
          </p>
          <button className="btn btn-agri" onClick={openAddModal}>
            <i className="bi bi-plus-lg me-1"></i> Add Your First Farm Plot
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {farms.map((farm) => (
            <div key={farm._id} className="col-md-6 col-lg-4">
              <div className="agri-card p-4 h-100 d-flex flex-column justify-content-between agri-card-hover border-top border-4 border-success shadow-sm">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold">
                      Active Farm Plot
                    </span>
                    <span className="badge bg-light text-muted border small">
                      MongoDB ID: {String(farm._id).substring(18)}
                    </span>
                  </div>

                  <h4 className="fw-bold text-dark mb-1">{farm.farmName || farm.name}</h4>
                  <div className="small text-muted mb-3">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                    {farm.location}
                  </div>

                  <div className="p-3 rounded bg-light border mb-3">
                    <div className="row g-2 small">
                      <div className="col-6">
                        <span className="text-muted d-block">Land Area:</span>
                        <strong className="text-dark fs-6">
                          <i className="bi bi-bounding-box text-success me-1"></i>
                          {farm.landArea || farm.sizeAcres || 5} Acres
                        </strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Soil Type:</span>
                        <strong className="text-dark">
                          <i className="bi bi-layers text-primary me-1"></i>
                          {farm.soilType || 'Alluvial Loam'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-top d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                    onClick={() => openEditModal(farm)}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                    onClick={() => handleDelete(farm._id, farm.farmName || farm.name)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Farm Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog-custom p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-geo-alt text-success me-2"></i>
                {editingFarm ? 'Edit Farm Profile' : 'Add New Farm to MongoDB'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i>
                <div>{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* 1. Farm Name */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Farm Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Green Horizon Valley"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  required
                />
              </div>

              {/* 2. Farm Location */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Location / District *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ludhiana, Punjab"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              {/* 3. Land Area */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Total Land Area (in Acres) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="form-control"
                  placeholder="e.g. 12.5"
                  value={formData.landArea}
                  onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                  required
                />
              </div>

              {/* 4. Soil Type */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">Soil Type</label>
                <select
                  className="form-select"
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                >
                  <option value="Alluvial Loam">Alluvial Loam (Highly Fertile)</option>
                  <option value="Black Cotton Soil">Black Cotton Soil (Moisture Retentive)</option>
                  <option value="Sandy Loam">Sandy Loam (Fast Draining)</option>
                  <option value="Clay Loam">Clay Loam (Heavy Mineral Content)</option>
                  <option value="Red Laterite Soil">Red Laterite Soil (Iron Rich)</option>
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2 border-top pt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-agri">
                  {editingFarm ? 'Save Changes' : 'Save Farm to MongoDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmsPage;
