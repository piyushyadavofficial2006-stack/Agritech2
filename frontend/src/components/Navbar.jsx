import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm sticky-top" style={{ backgroundColor: '#15803d' }}>
      <div className="container px-3 px-lg-4">
        {/* AgriTech Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold fs-4 me-lg-4" to="/">
          <span style={{ fontSize: '1.8rem' }}>🌱</span>
          <span className="tracking-tight">AgriTech</span>
          <span className="badge bg-light text-success fs-6 rounded-pill d-none d-sm-inline-block px-2 py-1">
            Smart Farm
          </span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
            {/* 1. Home */}
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link px-2 ${isActive ? 'active fw-bold text-white' : 'text-white-50'}`}
                onClick={() => setNavOpen(false)}
              >
                <i className="bi bi-house-door-fill me-1"></i> Home
              </NavLink>
            </li>

            {/* 2. Farmer Dashboard */}
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link px-2 ${isActive ? 'active fw-bold text-white' : 'text-white-50'}`}
                onClick={() => setNavOpen(false)}
              >
                <i className="bi bi-grid-1x2-fill me-1"></i> Dashboard
              </NavLink>
            </li>

            {/* Farm Management */}
            <li className="nav-item">
              <NavLink
                to="/farms"
                className={({ isActive }) => `nav-link px-2 ${isActive ? 'active fw-bold text-white' : 'text-white-50'}`}
                onClick={() => setNavOpen(false)}
              >
                <i className="bi bi-geo-alt-fill me-1"></i> Farms
              </NavLink>
            </li>

            {/* 3. Crop Management */}
            <li className="nav-item">
              <NavLink
                to="/crops"
                className={({ isActive }) => `nav-link px-2 ${isActive ? 'active fw-bold text-white' : 'text-white-50'}`}
                onClick={() => setNavOpen(false)}
              >
                <i className="bi bi-flower1 me-1"></i> Crop Management
              </NavLink>
            </li>

            {/* 4. Weather */}
            <li className="nav-item">
              <NavLink
                to="/weather"
                className={({ isActive }) => `nav-link px-2 ${isActive ? 'active fw-bold text-white' : 'text-white-50'}`}
                onClick={() => setNavOpen(false)}
              >
                <i className="bi bi-cloud-sun-fill me-1"></i> Weather
              </NavLink>
            </li>

            {/* 5. Soil Health */}
            <li className="nav-item">
              <NavLink
                to="/soil"
                className={({ isActive }) => `nav-link px-2 ${isActive ? 'active fw-bold text-white' : 'text-white-50'}`}
                onClick={() => setNavOpen(false)}
              >
                <i className="bi bi-speedometer2 me-1"></i> Soil Health
              </NavLink>
            </li>

            {/* 6. Admin Dashboard */}
            <li className="nav-item">
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-link px-2 ${isActive ? 'active fw-bold text-warning' : 'text-white-50'}`}
                onClick={() => setNavOpen(false)}
              >
                <i className="bi bi-shield-lock-fill me-1"></i> Admin Dashboard
              </NavLink>
            </li>
          </ul>

          {/* Right Side Controls: Login / Register / Profile */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-white text-success px-3 py-2 rounded-pill fw-semibold shadow-sm d-flex align-items-center gap-1">
                  <span>{user.avatar || '👨‍🌾'}</span>
                  <span className="d-none d-sm-inline">{user.name}</span>
                  <span className="badge bg-success ms-1 small" style={{ fontSize: '0.65rem' }}>
                    {user.role}
                  </span>
                </span>

                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                  title="Sign Out"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-light fw-semibold px-3 py-1 rounded-pill">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link to="/register" className="btn btn-sm btn-warning text-dark fw-bold px-3 py-1 rounded-pill shadow-sm">
                  <i className="bi bi-person-plus-fill me-1"></i> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
