import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const WeatherWidget = ({ compact = false, defaultLocation = 'Punjab' }) => {
  const { t } = useLanguage();
  const [location, setLocation] = useState(defaultLocation);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  const fetchWeather = async (loc) => {
    setLoading(true);
    try {
      const res = await api.get(`/weather?location=${encodeURIComponent(loc || 'Punjab')}`);
      setWeather(res.data);
    } catch (err) {
      console.error('Weather load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(searchInput.trim());
      setSearchInput('');
    }
  };

  if (loading && !weather) {
    return (
      <div className="agri-card p-4 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <div className="small text-muted mt-2">Loading meteorological data...</div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="agri-card p-3 p-md-4">
      {/* Header & City Switcher */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="fs-5 fw-bold text-dark">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
              {weather.location}
            </span>
            <span className="badge bg-light text-muted border small">
              Updated {weather.updatedAt}
            </span>
          </div>
          <div className="small text-muted">{weather.current.condition} • {weather.current.airQuality}</div>
        </div>

        {/* Search location bar */}
        <form onSubmit={handleSearch} className="d-flex gap-1">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Change district/city..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ maxWidth: '170px' }}
          />
          <button type="submit" className="btn btn-sm btn-outline-success">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

      {/* Main Temperature & Metric Row */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-sm-5 col-lg-4 text-center text-sm-start">
          <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-3">
            <span style={{ fontSize: '3.5rem', lineHeight: 1 }}>{weather.current.icon}</span>
            <div>
              <div className="display-5 fw-bold text-dark mb-0">{weather.current.temp}°C</div>
              <div className="small text-muted">Feels like {weather.current.feelsLike}°C</div>
            </div>
          </div>
        </div>

        <div className="col-sm-7 col-lg-8">
          <div className="row g-2 text-center text-sm-start">
            <div className="col-6 col-md-3">
              <div className="p-2 rounded bg-light border">
                <div className="small text-muted">{t('humidity')}</div>
                <div className="fw-bold text-primary fs-6">
                  <i className="bi bi-droplet me-1"></i>
                  {weather.current.humidity}%
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-2 rounded bg-light border">
                <div className="small text-muted">{t('windSpeed')}</div>
                <div className="fw-bold text-secondary fs-6">
                  <i className="bi bi-wind me-1"></i>
                  {weather.current.windSpeed} km/h
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-2 rounded bg-light border">
                <div className="small text-muted">{t('rainProbability')}</div>
                <div className="fw-bold text-info fs-6">
                  <i className="bi bi-cloud-rain me-1"></i>
                  {weather.current.rainProbability}%
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-2 rounded bg-light border">
                <div className="small text-muted">Soil Temp</div>
                <div className="fw-bold text-success fs-6">
                  <i className="bi bi-thermometer-half me-1"></i>
                  {weather.current.soilTemp}°C
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agronomic Advisory Alerts */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <div className="p-3 rounded-3 border-start border-4 border-success bg-light h-100">
            <div className="d-flex align-items-center gap-1 text-success fw-bold small mb-1">
              <i className="bi bi-shield-check fs-6"></i>
              {t('sprayingSafety')}
            </div>
            <div className="small text-secondary">{weather.agroAdvisory.sprayingStatus}</div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 rounded-3 border-start border-4 border-primary bg-light h-100">
            <div className="d-flex align-items-center gap-1 text-primary fw-bold small mb-1">
              <i className="bi bi-water fs-6"></i>
              {t('irrigationAdvice')}
            </div>
            <div className="small text-secondary">{weather.agroAdvisory.irrigationStatus}</div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Strips (Shown when not in compact mode) */}
      {!compact && weather.forecast && (
        <div className="mt-3 pt-3 border-top">
          <div className="fw-bold text-muted small mb-2 text-uppercase">5-Day Agricultural Outlook</div>
          <div className="row g-2">
            {weather.forecast.map((day, idx) => (
              <div key={idx} className="col">
                <div className="p-2 text-center rounded bg-light border h-100">
                  <div className="small fw-semibold text-dark">{day.day}</div>
                  <div className="fs-4 my-1">{day.icon}</div>
                  <div className="small fw-bold text-dark">{day.tempMax}° / {day.tempMin}°</div>
                  <div className="small text-info mt-1" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-cloud-drizzle me-1"></i>{day.rainProbability}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
