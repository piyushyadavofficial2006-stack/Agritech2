import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminPage = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, products
  const [toastMsg, setToastMsg] = useState('');

  // New product state
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'Seeds',
    price: '',
    unit: '1 kg Pack',
    stock: 50,
    description: '',
    badge: 'Verified'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, prodRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/resources')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setToastMsg(`User role updated to ${newRole}`);
      fetchData();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user role.');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/resources', newProduct);
      setToastMsg(`Product "${newProduct.title}" added to Agri Store!`);
      setNewProduct({
        title: '',
        category: 'Seeds',
        price: '',
        unit: '1 kg Pack',
        stock: 50,
        description: '',
        badge: 'Verified'
      });
      fetchData();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product.');
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Delete product "${title}" from catalog?`)) {
      try {
        await api.delete(`/resources/${id}`);
        setToastMsg(`Product removed.`);
        fetchData();
        setTimeout(() => setToastMsg(''), 3000);
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting product.');
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="container py-5 text-center">
        <div className="agri-card p-5">
          <span className="fs-1 text-danger">🚫</span>
          <h4 className="fw-bold text-dark mt-3">Administrator Access Only</h4>
          <p className="text-muted">
            You do not have administrative credentials. Please sign in as an Administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-shield-lock-fill text-danger me-2"></i>
            {t('navAdmin')} — Agricultural Control Center
          </h2>
          <p className="text-muted mb-0">
            System overview, user role management, marketplace catalog governance, and agricultural alerts.
          </p>
        </div>

        <div className="btn-group">
          <button
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview KPI
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'users' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            User Directory ({users.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'products' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('products')}
          >
            Product Catalog ({products.length})
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="alert alert-success alert-dismissible fade show py-2" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {toastMsg}
          <button type="button" className="btn-close" onClick={() => setToastMsg('')}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Loading administrative statistics...</p>
        </div>
      ) : (
        <>
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && stats && (
            <div>
              <div className="row g-3 mb-4">
                <div className="col-sm-6 col-lg-3">
                  <div className="agri-card p-3">
                    <div className="text-muted small fw-semibold">TOTAL REGISTERED USERS</div>
                    <div className="fs-2 fw-bold text-dark my-1">{stats.totalUsers}</div>
                    <div className="small text-muted">
                      {stats.farmersCount} Farmers • {stats.expertsCount} Experts
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                  <div className="agri-card p-3">
                    <div className="text-muted small fw-semibold">REGISTERED FARMS</div>
                    <div className="fs-2 fw-bold text-success my-1">{stats.totalFarms}</div>
                    <div className="small text-muted">{stats.totalAcreage} Total Acres Monitored</div>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                  <div className="agri-card p-3">
                    <div className="text-muted small fw-semibold">MARKETPLACE ORDERS</div>
                    <div className="fs-2 fw-bold text-primary my-1">{stats.totalOrders}</div>
                    <div className="small text-muted">${stats.totalRevenue?.toFixed(2)} Platform Volume</div>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                  <div className="agri-card p-3">
                    <div className="text-muted small fw-semibold">CRITICAL CROP ALERTS</div>
                    <div className="fs-2 fw-bold text-danger my-1">{stats.criticalCrops}</div>
                    <div className="small text-muted">{stats.highRiskPests} Active High-Risk Pests</div>
                  </div>
                </div>
              </div>

              {/* Database & System Architecture Info Card */}
              <div className="agri-card p-4">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="bi bi-hdd-network-fill text-success me-2"></i>
                  System Health & Relational Data Integrity
                </h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="p-3 rounded bg-light border">
                      <div className="small text-muted">Database Engine</div>
                      <div className="fw-bold text-dark">MongoDB / Atlas Connector</div>
                      <div className="small text-success mt-1">● Synced & Reactive</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 rounded bg-light border">
                      <div className="small text-muted">Authentication Engine</div>
                      <div className="fw-bold text-dark">JWT + bcrypt (10 rounds)</div>
                      <div className="small text-success mt-1">● Role-based Authorization</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 rounded bg-light border">
                      <div className="small text-muted">Agro-Meteorological Service</div>
                      <div className="fw-bold text-dark">Dynamic Soil & Weather AI</div>
                      <div className="small text-success mt-1">● 5-Day Micro-climate Feeds</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Users Management */}
          {activeTab === 'users' && (
            <div className="agri-card p-4">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-people-fill text-success me-2"></i>
                Registered AgriTech Users & Role Authorization
              </h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Location</th>
                      <th>Current Role</th>
                      <th>Assign Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="fs-4">{u.avatar || '👨‍🌾'}</span>
                            <span className="fw-bold text-dark">{u.name}</span>
                          </div>
                        </td>
                        <td className="small">{u.email}</td>
                        <td className="small text-muted">{u.state || 'Punjab'}</td>
                        <td>
                          <span
                            className={`badge ${
                              u.role === 'admin'
                                ? 'bg-danger'
                                : u.role === 'expert'
                                ? 'bg-info text-dark'
                                : 'bg-success'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            style={{ width: '130px' }}
                          >
                            <option value="farmer">Farmer</option>
                            <option value="expert">Expert</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Products Catalog Management */}
          {activeTab === 'products' && (
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="agri-card p-4">
                  <h5 className="fw-bold text-dark mb-3">
                    <i className="bi bi-plus-circle text-success me-2"></i>
                    Add Product to Agri Store
                  </h5>
                  <form onSubmit={handleCreateProduct}>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Title *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Category</label>
                        <select
                          className="form-select form-select-sm"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        >
                          <option value="Seeds">Seeds</option>
                          <option value="Fertilizers">Fertilizers</option>
                          <option value="Pesticides">Pesticides</option>
                          <option value="Tools">Tools</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Price ($) *</label>
                        <input
                          type="number"
                          step="0.5"
                          className="form-control form-control-sm"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Unit</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. 25 kg Bag"
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Initial Stock</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Description</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-sm btn-agri w-100">
                      Save to Store Catalog
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="agri-card p-4">
                  <h5 className="fw-bold text-dark mb-3">Active Catalog Inventory</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle small">
                      <thead className="table-light">
                        <tr>
                          <th>Item</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p._id}>
                            <td className="fw-bold">{p.title}</td>
                            <td>{p.category}</td>
                            <td>${p.price}</td>
                            <td>{p.stock} units</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger py-0 px-2"
                                onClick={() => handleDeleteProduct(p._id, p.title)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;
