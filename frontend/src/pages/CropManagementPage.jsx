import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CropManagementPage = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);

  // Exact fields required:
  // Crop name, Land area, Sowing date, Crop status
  const [formData, setFormData] = useState({
    cropName: '',
    landArea: '',
    sowingDate: new Date().toISOString().split('T')[0],
    cropStatus: 'Healthy'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Fetch Actual Crop Records from MongoDB via Axios
  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await api.get('/crops');
      setCrops(res.data || []);
    } catch (err) {
      console.error('Error fetching crop records:', err);
      setErrorMsg(err.response?.data?.message || 'Could not load crop records from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // Open modal for Adding New Crop
  const openAddModal = () => {
    setEditingCrop(null);
    setFormData({
      cropName: '',
      landArea: '',
      sowingDate: new Date().toISOString().split('T')[0],
      cropStatus: 'Healthy'
    });
    setErrorMsg('');
    setShowModal(true);
  };

  // Open modal for Editing Crop
  const openEditModal = (crop) => {
    setEditingCrop(crop);
    let sDate = new Date().toISOString().split('T')[0];
    if (crop.sowingDate) {
      try {
        sDate = new Date(crop.sowingDate).toISOString().split('T')[0];
      } catch (e) {}
    }
    setFormData({
      cropName: crop.cropName || crop.name || '',
      landArea: crop.landArea || crop.sizeAcres || '',
      sowingDate: sDate,
      cropStatus: crop.cropStatus || crop.healthStatus || 'Healthy'
    });
    setErrorMsg('');
    setShowModal(true);
  };

  // 2. Add or Edit Crop Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.cropName.trim()) {
      setErrorMsg('Please enter a crop name.');
      return;
    }
    if (!formData.landArea || Number(formData.landArea) <= 0) {
      setErrorMsg('Please enter a valid land area in acres.');
      return;
    }
    if (!formData.sowingDate) {
      setErrorMsg('Please select a valid sowing date.');
      return;
    }

    const payload = {
      cropName: formData.cropName.trim(),
      name: formData.cropName.trim(),
      landArea: Number(formData.landArea),
      sowingDate: formData.sowingDate,
      cropStatus: formData.cropStatus
    };

    try {
      if (editingCrop) {
        // Edit Crop (PUT /api/crops/:id)
        await api.put(`/crops/${editingCrop._id}`, payload);
        setSuccessMsg(`Crop "${formData.cropName}" updated successfully in MongoDB!`);
      } else {
        // Add Crop (POST /api/crops)
        await api.post('/crops', payload);
        setSuccessMsg(`New crop "${formData.cropName}" saved to MongoDB successfully!`);
      }
      setShowModal(false);
      fetchCrops();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save crop record in MongoDB.');
    }
  };

  // 3. Delete Crop from MongoDB
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete crop "${name}"?`)) {
      try {
        await api.delete(`/crops/${id}`);
        setSuccessMsg(`Crop "${name}" deleted from MongoDB.`);
        fetchCrops();
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Failed to delete crop record.');
      }
    }
  };

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
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-flower1 text-success me-2"></i>
            Crop Management
          </h2>
          <p className="text-muted mb-0">
            Real-time MongoDB synchronization for your farm plots, sowing cycles, land area, and growth status.
          </p>
        </div>

        {/* Add Crop Button */}
        <button className="btn btn-agri d-flex align-items-center gap-2 shadow-sm" onClick={openAddModal}>
          <i className="bi bi-plus-circle-fill"></i>
          <span>Add Crop</span>
        </button>
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

      {/* Display Actual Crop Records */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Connecting to MongoDB & fetching crops...</p>
        </div>
      ) : crops.length === 0 ? (
        <div className="agri-card p-5 text-center shadow-sm">
          <span className="fs-1 d-inline-block p-3 rounded-circle bg-success-subtle mb-3">🌱</span>
          <h4 className="fw-bold text-dark">No Crops Registered in MongoDB</h4>
          <p className="text-muted" style={{ maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            Begin tracking your farm by clicking "Add Crop" to store your first crop record in MongoDB.
          </p>
          <button className="btn btn-agri" onClick={openAddModal}>
            <i className="bi bi-plus-lg me-1"></i> Add Your First Crop
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {crops.map((crop) => (
            <div key={crop._id} className="col-md-6 col-lg-4">
              <div className="agri-card p-4 h-100 d-flex flex-column justify-content-between agri-card-hover border-top border-4 border-success shadow-sm">
                <div>
                  {/* Status Badge & Actions */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span
                      className={`badge ${
                        (crop.cropStatus || crop.healthStatus) === 'Healthy'
                          ? 'bg-success'
                          : (crop.cropStatus || crop.healthStatus) === 'Attention'
                          ? 'bg-warning text-dark'
                          : (crop.cropStatus || crop.healthStatus) === 'Critical'
                          ? 'bg-danger'
                          : 'bg-info text-dark'
                      } px-3 py-1 fs-6`}
                    >
                      {crop.cropStatus || crop.healthStatus || 'Healthy'}
                    </span>

                    <span className="badge bg-light text-muted border small">
                      MongoDB ID: {String(crop._id).substring(18)}
                    </span>
                  </div>

                  {/* Crop Name */}
                  <h4 className="fw-bold text-dark mb-1">{crop.cropName || crop.name}</h4>
                  <div className="small text-muted mb-3">
                    {crop.variety || 'Certified High-Yield Strain'}
                  </div>

                  {/* Crop Details Card */}
                  <div className="p-3 rounded bg-light border mb-3">
                    <div className="row g-2 small">
                      <div className="col-6">
                        <span className="text-muted d-block">Land Area:</span>
                        <strong className="text-dark fs-6">
                          <i className="bi bi-bounding-box me-1 text-success"></i>
                          {crop.landArea || crop.sizeAcres || 1} Acres
                        </strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Sowing Date:</span>
                        <strong className="text-dark">
                          <i className="bi bi-calendar-event me-1 text-primary"></i>
                          {formatDate(crop.sowingDate || crop.plantingDate)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="pt-3 border-top d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                    onClick={() => openEditModal(crop)}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                    onClick={() => handleDelete(crop._id, crop.cropName || crop.name)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Crop Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog-custom p-4" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-flower1 text-success me-2"></i>
                {editingCrop ? 'Edit Crop Details' : 'Add New Crop to MongoDB'}
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
              {/* 1. Crop Name */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Crop Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Wheat, Basmati Rice, Mustard, Sugarcane"
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  required
                />
              </div>

              {/* 2. Land Area */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Land Area (in Acres) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="form-control"
                  placeholder="e.g. 4.5"
                  value={formData.landArea}
                  onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                  required
                />
              </div>

              {/* 3. Sowing Date */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Sowing Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.sowingDate}
                  onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                  required
                />
              </div>

              {/* 4. Crop Status */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">Crop Status *</label>
                <select
                  className="form-select"
                  value={formData.cropStatus}
                  onChange={(e) => setFormData({ ...formData, cropStatus: e.target.value })}
                  required
                >
                  <option value="Healthy">Healthy (Optimal Growth)</option>
                  <option value="Attention">Attention Needed</option>
                  <option value="Critical">Critical (Action Required)</option>
                  <option value="Sowing">Sowing Stage</option>
                  <option value="Vegetative">Vegetative Growth</option>
                  <option value="Harvest Ready">Harvest Ready</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2 border-top pt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-agri">
                  {editingCrop ? 'Save Changes' : 'Add to MongoDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropManagementPage;
