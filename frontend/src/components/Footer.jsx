import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto bg-dark text-white-50 py-4 border-top border-secondary">
      <div className="container">
        <div className="row gy-4 align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
              <span className="fs-4">🌱</span>
              <span className="fw-bold text-white fs-5">{t('appName')}</span>
              <span className="badge bg-success small">v1.0.0</span>
            </div>
            <p className="small mb-0 text-white-50">
              {t('appTagline')} — Empowering farmers worldwide with smart IoT-ready analytics, predictive pest management, and digital agronomy.
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 small mb-2">
              <span className="text-white"><i className="bi bi-telephone-fill text-success me-1"></i> Kisan Helpline: 1800-180-1551</span>
              <span>•</span>
              <span className="text-white"><i className="bi bi-shield-check text-info me-1"></i> MERN Verified</span>
            </div>
            <div className="small text-white-50">
              © {new Date().getFullYear()} AgriTech Smart Farming Solutions. Built for sustainable agriculture.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
