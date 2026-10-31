import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { user, isAdmin, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalFarmers: 0, totalCrops: 0, totalFarms: 0 });
  const [farmersList, setFarmersList] = useState([]);
  const [cropsList, setCropsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('farmers'); // 'farmers' | 'crops' | 'security'
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [farmersRes, totalFarmersRes, totalCropsRes, cropsRes, statsRes] = await Promise.all([
        api.get('/admin/farmers').catch(() => ({ data: [] })),
        api.get('/admin/total-farmers').catch(() => ({ data: { totalFarmers: 0 } })),
        api.get('/admin/total-crops').catch(() => ({ data: { totalCrops: 0 } })),
        api.get('/admin/crops').catch(() => ({ data: [] })),
        api.get('/admin/stats').catch(() => ({ data: {} }))
      ]);

      const farmers = Array.isArray(farmersRes.data) ? farmersRes.data : [];
      const crops = Array.isArray(cropsRes.data) ? cropsRes.data : [];

      setFarmersList(farmers);
      setCropsList(crops);
      setStats({
        totalFarmers: totalFarmersRes.data?.totalFarmers ?? farmers.length,
        totalCrops: totalCropsRes.data?.totalCrops ?? crops.length,
        totalFarms: statsRes.data?.totalFarms ?? 0
      });
    } catch (err) {
      console.error('Admin fetch error:', err);
      showFeedback('danger', 'Unable to retrieve data from MongoDB backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user, isAdmin]);

  // Admin Operation: Update user role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      showFeedback('success', `User platform role successfully updated to "${newRole}".`);
      fetchAdminData();
    } catch (err) {
      showFeedback('danger', err.response?.data?.message || 'Error updating user role.');
    }
  };

  // Admin Operation: Delete a farmer
  const handleDeleteFarmer = async (farmerId, farmerName) => {
    if (!window.confirm(`Are you sure you want to delete farmer "${farmerName}"? This will also remove their associated crops and farm profiles.`)) {
      return;
    }
    try {
      const res = await api.delete(`/admin/farmers/${farmerId}`);
      showFeedback('success', res.data?.message || `Farmer "${farmerName}" removed.`);
      fetchAdminData();
    } catch (err) {
      showFeedback('danger', err.response?.data?.message || 'Failed to delete farmer record.');
    }
  };

  // Admin Operation: Delete a crop
  const handleDeleteCrop = async (cropId, cropName) => {
    if (!window.confirm(`Are you sure you want to delete crop record "${cropName}"?`)) {
      return;
    }
    try {
      const res = await api.delete(`/admin/crops/${cropId}`);
      showFeedback('success', res.data?.message || `Crop "${cropName}" deleted.`);
      fetchAdminData();
    } catch (err) {
      showFeedback('danger', err.response?.data?.message || 'Failed to delete crop record.');
    }
  };

  // Quick Switch to Admin Demo Account for testing
  const handleSwitchToAdmin = async () => {
    setLoading(true);
    const result = await demoLogin('admin');
    if (result.success) {
      showFeedback('success', 'Logged in as Administrator (admin@agritech.com).');
      fetchAdminData();
    } else {
      showFeedback('danger', result.error || 'Failed to switch to admin.');
      setLoading(false);
    }
  };

  // Security Gate: Non-admin or Unauthenticated UI
  if (!user || !isAdmin) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0 border-top border-4 border-danger p-4 text-center">
              <div className="text-danger mb-3">
                <i className="bi bi-shield-lock-fill" style={{ fontSize: '3.5rem' }}></i>
              </div>
              <h3 className="fw-bold text-dark mb-2">Restricted Admin Access</h3>
              <p className="text-muted mb-4">
                This administration dashboard is protected by JWT authorization and restricted strictly to users with the <span className="badge bg-danger">admin</span> role.
              </p>

              {user ? (
                <div className="alert alert-warning py-2 mb-4 text-start small">
                  <strong>Current Account:</strong> {user.name} ({user.email})<br />
                  <strong>Current Role:</strong> <span className="badge bg-secondary">{user.role}</span> (Lacks Admin Clearance)
                </div>
              ) : (
                <div className="alert alert-secondary py-2 mb-4 small">
                  You are not currently logged in. Please sign in with administrator credentials.
                </div>
              )}

              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <button
                  type="button"
                  className="btn btn-success fw-semibold"
                  onClick={handleSwitchToAdmin}
                >
                  <i className="bi bi-key-fill me-1"></i> 1-Click Login as Admin
                </button>
                <Link to="/login" className="btn btn-outline-secondary">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Admin Login Page
                </Link>
                <Link to="/dashboard" className="btn btn-link text-decoration-none">
                  Farmer Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter lists based on search query
  const filteredFarmers = farmersList.filter((f) =>
    (f.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCrops = cropsList.filter((c) =>
    (c.cropName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.cropStatus || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.farmerId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.farmerId?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-4">
      {/* Top Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-shield-check text-success me-2"></i>
            Admin Dashboard & Security Console
          </h2>
          <p className="text-muted mb-0">
            Real-time management of registered farmers, crop acreage, and MongoDB security enforcement.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 shadow-sm"
            onClick={fetchAdminData}
            disabled={loading}
          >
            <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i>
            Refresh
          </button>
          <div className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-semibold">
            <i className="bi bi-person-fill-check me-1"></i> Admin: {user?.name}
          </div>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback.message && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show py-2 mb-4`} role="alert">
          <i className={`bi ${feedback.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
          {feedback.message}
          <button type="button" className="btn-close" onClick={() => setFeedback({ type: '', message: '' })}></button>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="row g-3 mb-4">
        {/* Total Farmers */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-4 border-success p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted fw-bold text-uppercase">Total Farmers</span>
              <div className="bg-success-subtle text-success p-2 rounded-circle">
                <i className="bi bi-people-fill fs-5"></i>
              </div>
            </div>
            <div className="h2 fw-bold text-success mb-1">{stats.totalFarmers}</div>
            <div className="small text-muted">Registered agricultural producers</div>
          </div>
        </div>

        {/* Total Crops */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-4 border-primary p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted fw-bold text-uppercase">Total Crops</span>
              <div className="bg-primary-subtle text-primary p-2 rounded-circle">
                <i className="bi bi-flower1 fs-5"></i>
              </div>
            </div>
            <div className="h2 fw-bold text-primary mb-1">{stats.totalCrops}</div>
            <div className="small text-muted">Monitored field crop records</div>
          </div>
        </div>

        {/* Total Farms */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-4 border-warning p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted fw-bold text-uppercase">Total Farms</span>
              <div className="bg-warning-subtle text-warning p-2 rounded-circle">
                <i className="bi bi-geo-alt-fill fs-5"></i>
              </div>
            </div>
            <div className="h2 fw-bold text-warning mb-1">{stats.totalFarms}</div>
            <div className="small text-muted">Geographical farm plots tracked</div>
          </div>
        </div>

        {/* System Security */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-4 border-info p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted fw-bold text-uppercase">Security Protocol</span>
              <div className="bg-info-subtle text-info p-2 rounded-circle">
                <i className="bi bi-shield-lock-fill fs-5"></i>
              </div>
            </div>
            <div className="h4 fw-bold text-info mb-1">JWT + Bcrypt</div>
            <div className="small text-muted">Protected REST APIs & Role ACL</div>
          </div>
        </div>
      </div>

      {/* Tabs & Search Navigation */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-bottom pt-3 pb-0">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <ul className="nav nav-tabs border-bottom-0">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link fw-semibold ${activeTab === 'farmers' ? 'active text-success border-success border-bottom-0' : 'text-secondary'}`}
                  onClick={() => setActiveTab('farmers')}
                >
                  <i className="bi bi-people-fill me-1"></i> Registered Farmers ({farmersList.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link fw-semibold ${activeTab === 'crops' ? 'active text-success border-success border-bottom-0' : 'text-secondary'}`}
                  onClick={() => setActiveTab('crops')}
                >
                  <i className="bi bi-flower1 me-1"></i> All Crop Records ({cropsList.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link fw-semibold ${activeTab === 'security' ? 'active text-success border-success border-bottom-0' : 'text-secondary'}`}
                  onClick={() => setActiveTab('security')}
                >
                  <i className="bi bi-lock-fill me-1"></i> Security Architecture
                </button>
              </li>
            </ul>

            {/* Quick search */}
            {activeTab !== 'security' && (
              <div className="pb-2">
                <div className="input-group input-group-sm" style={{ width: '240px' }}>
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0"
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchQuery('')}>
                      &times;
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Body */}
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="text-muted mt-2">Loading data from MongoDB Atlas...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: FARMER DIRECTORY */}
              {activeTab === 'farmers' && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Farmer Name</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Registered Date</th>
                        <th>Role</th>
                        <th>Manage Role</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFarmers.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4 text-muted">
                            No farmer records found matching the criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredFarmers.map((farmer) => (
                          <tr key={farmer._id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="bg-success-subtle text-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                                  👨‍🌾
                                </div>
                                <div>
                                  <div className="fw-bold text-dark">{farmer.name}</div>
                                  <span className="small text-muted font-monospace">ID: {farmer._id.substring(0, 8)}...</span>
                                </div>
                              </div>
                            </td>
                            <td className="small text-dark fw-medium">{farmer.email}</td>
                            <td>
                              <span className="small text-secondary">
                                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                {farmer.location || 'Punjab, India'}
                              </span>
                            </td>
                            <td className="small text-muted">
                              {farmer.createdAt ? new Date(farmer.createdAt).toLocaleDateString() : 'Active'}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  farmer.role === 'admin'
                                    ? 'bg-danger'
                                    : farmer.role === 'expert'
                                    ? 'bg-info text-dark'
                                    : 'bg-success'
                                } px-2 py-1`}
                              >
                                {farmer.role}
                              </span>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={farmer.role}
                                onChange={(e) => handleRoleChange(farmer._id, e.target.value)}
                                style={{ width: '110px' }}
                              >
                                <option value="farmer">Farmer</option>
                                <option value="expert">Expert</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Delete Farmer"
                                onClick={() => handleDeleteFarmer(farmer._id, farmer.name)}
                                disabled={farmer._id === user._id}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 2: CROP RECORDS */}
              {activeTab === 'crops' && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Crop Name</th>
                        <th>Farmer / Producer</th>
                        <th>Land Area</th>
                        <th>Sowing Date</th>
                        <th>Health Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCrops.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-muted">
                            No crop records found matching the criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredCrops.map((crop) => (
                          <tr key={crop._id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <span className="fs-5">🌾</span>
                                <div>
                                  <div className="fw-bold text-dark">{crop.cropName}</div>
                                  <span className="small text-muted font-monospace">ID: {crop._id.substring(0, 8)}...</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="small fw-semibold text-dark">{crop.farmerId?.name || 'Registered Farmer'}</div>
                              <div className="small text-muted">{crop.farmerId?.email || 'N/A'}</div>
                            </td>
                            <td className="small">
                              <span className="badge bg-light text-dark border">
                                {crop.landArea} {crop.landArea === 1 ? 'Acre' : 'Acres'}
                              </span>
                            </td>
                            <td className="small text-muted">
                              {crop.sowingDate ? new Date(crop.sowingDate).toLocaleDateString() : 'N/A'}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  crop.cropStatus === 'Healthy'
                                    ? 'bg-success'
                                    : crop.cropStatus === 'Growing'
                                    ? 'bg-primary'
                                    : crop.cropStatus === 'Harvested'
                                    ? 'bg-secondary'
                                    : 'bg-warning text-dark'
                                } px-2 py-1`}
                              >
                                {crop.cropStatus || 'Healthy'}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Delete Crop Record"
                                onClick={() => handleDeleteCrop(crop._id, crop.cropName)}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: SECURITY AUDIT & SPECIFICATION */}
              {activeTab === 'security' && (
                <div className="p-4">
                  <h5 className="fw-bold text-dark mb-3">
                    <i className="bi bi-shield-lock-fill text-success me-2"></i>
                    AgriTech System Security Specification
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 border rounded bg-light h-100">
                        <h6 className="fw-bold text-success mb-2">
                          <i className="bi bi-check-circle-fill me-1"></i> Authentication & Hashing
                        </h6>
                        <ul className="small text-muted mb-0 ps-3">
                          <li><strong>JWT Tokens:</strong> Generated upon valid credentials, stored securely and sent via <code>Authorization: Bearer</code> headers.</li>
                          <li><strong>Bcrypt Hashing:</strong> Passwords are automatically hashed with 10 salt rounds prior to MongoDB write. Plain text passwords are never stored.</li>
                          <li><strong>Sanitized Output:</strong> All database queries systematically exclude passwords using <code>.select('-password')</code>.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="p-3 border rounded bg-light h-100">
                        <h6 className="fw-bold text-success mb-2">
                          <i className="bi bi-shield-check me-1"></i> Access Control & Isolation
                        </h6>
                        <ul className="small text-muted mb-0 ps-3">
                          <li><strong>Role-Based Access:</strong> Admin endpoints are guarded by <code>adminOnly</code> middleware, returning 403 Forbidden for non-admins.</li>
                          <li><strong>Farmer Data Isolation:</strong> Crop and farm queries strictly scope to <code>farmerId: req.user._id</code>, preventing unauthorized access.</li>
                          <li><strong>Input Validation:</strong> Server routes validate required fields, positive land areas, and authentic roles before performing operations.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
