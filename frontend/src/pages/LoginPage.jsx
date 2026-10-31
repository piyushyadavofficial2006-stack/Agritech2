import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, demoLogin, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErr, setFormErr] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErr('');
    setSuccessMsg('');
    setLoading(true);

    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`Welcome, ${res.user?.name}! Authenticated successfully.`);
      setTimeout(() => {
        if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 700);
    } else {
      setFormErr(res.error || 'Invalid email or password credentials.');
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setFormErr('');
    setSuccessMsg('');
    const res = await demoLogin(role);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`Signed in as Demo ${role.toUpperCase()}. Redirecting...`);
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 700);
    } else {
      setFormErr(res.error || 'Demo login failed.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="agri-card p-4 p-md-5 shadow-sm border-top border-4 border-success">
            {/* Header with Farming Logo */}
            <div className="text-center mb-4">
              <span className="fs-1 d-inline-block p-2 rounded-circle bg-success-subtle mb-2">🌱</span>
              <h3 className="fw-bold text-dark mb-1">Farmer Sign In</h3>
              <p className="text-muted small">Verify credentials to access smart agricultural telemetry</p>
            </div>

            {(formErr || error) && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{formErr || error}</div>
              </div>
            )}

            {successMsg && (
              <div className="alert alert-success py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                <i className="bi bi-check-circle-fill"></i>
                <div>{successMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* 1. Email */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">
                  <i className="bi bi-envelope-fill text-success me-1"></i> Email Address *
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="farmer@agritech.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* 2. Password */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">
                  <i className="bi bi-lock-fill text-success me-1"></i> Password *
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* 3. Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-agri w-100 py-2 fw-bold mb-3 shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Fast Demo Credentials Buttons */}
            <div className="pt-3 border-top text-center">
              <span className="small text-muted fw-bold d-block mb-2">⚡ Instant 1-Click Demo Login</span>
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success text-start d-flex justify-content-between align-items-center"
                  onClick={() => handleQuickDemo('farmer')}
                >
                  <span>👨‍🌾 Farmer Demo (Rajesh Kumar)</span>
                  <span className="badge bg-success">Login</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger text-start d-flex justify-content-between align-items-center"
                  onClick={() => handleQuickDemo('admin')}
                >
                  <span>👩‍🔬 Admin Demo (Dr. Sarah Mitchell)</span>
                  <span className="badge bg-danger">Login</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-3 border-top mt-3 small text-muted">
              Don't have a farmer account yet?{' '}
              <Link to="/register" className="text-success fw-bold text-decoration-none">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
