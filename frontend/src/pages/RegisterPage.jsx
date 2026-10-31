import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.location.trim()) {
      setErrorMsg('Please fill in all required fields: Farmer Name, Email, Password, and Location.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      location: formData.location.trim(),
      role: 'farmer'
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Account registered successfully! Redirecting to dashboard...');
      setTimeout(() => {
        if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 800);
    } else {
      setErrorMsg(res.error || 'Registration failed. Please check your credentials.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="agri-card p-4 p-md-5 shadow-sm border-top border-4 border-success">
            {/* Header with Farming Icon */}
            <div className="text-center mb-4">
              <span className="fs-1 d-inline-block p-2 rounded-circle bg-success-subtle mb-2">🌾</span>
              <h3 className="fw-bold text-dark mb-1">Farmer Registration</h3>
              <p className="text-muted small">Create your account to start managing your farm digitally</p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i>
                <div>{errorMsg}</div>
              </div>
            )}

            {successMsg && (
              <div className="alert alert-success py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                <i className="bi bi-check-circle-fill"></i>
                <div>{successMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* 1. Farmer Name */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">
                  <i className="bi bi-person-fill text-success me-1"></i> Farmer Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Gurpreet Singh"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* 2. Email */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">
                  <i className="bi bi-envelope-fill text-success me-1"></i> Email Address *
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="farmer@agritech.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* 3. Password */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">
                  <i className="bi bi-lock-fill text-success me-1"></i> Password *
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {/* 4. Location */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">
                  <i className="bi bi-geo-alt-fill text-success me-1"></i> Location (Village / District / State) *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ludhiana, Punjab"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-agri w-100 py-2 fw-bold mb-3 shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Registering in MongoDB...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-1"></i> Register as Farmer
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-3 border-top small text-muted">
              Already have an agricultural account?{' '}
              <Link to="/login" className="text-success fw-bold text-decoration-none">
                Sign In here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
