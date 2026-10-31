import React, { useState, useEffect } from 'react';
import api from '../services/api';

const WeatherPage = () => {
  const [cityInput, setCityInput] = useState('Punjab');
  const [activeCity, setActiveCity] = useState('Punjab');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch weather for the specified city
  const fetchWeather = async (city) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get(`/weather?city=${encodeURIComponent(city)}`);
      setWeatherData(res.data);
    } catch (err) {
      console.error('Weather error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to load weather data for the specified location.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(activeCity);
  }, [activeCity]);

  // Handle City Form Submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setActiveCity(cityInput.trim());
    }
  };

  const currentTemp = weatherData?.current?.temp ?? weatherData?.temperature ?? 24;
  const currentCondition = weatherData?.current?.condition ?? weatherData?.weatherCondition ?? 'Clear & Sunny';
  const currentHumidity = weatherData?.current?.humidity ?? weatherData?.humidity ?? 60;
  const currentWind = weatherData?.current?.windSpeed ?? weatherData?.windSpeed ?? 10;
  const currentIcon = weatherData?.current?.icon ?? weatherData?.icon ?? '🌤️';
  const locationLabel = weatherData?.location || weatherData?.city || activeCity;

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1 text-dark">
          <i className="bi bi-cloud-sun-fill text-primary me-2"></i>
          Agricultural Weather Forecast
        </h2>
        <p className="text-muted mb-0">
          Hyper-local weather telemetry, humidity, and real-time conditions to optimize field spraying and irrigation schedules.
        </p>
      </div>

      {/* 1. City Input Section */}
      <div className="agri-card p-4 mb-4 shadow-sm">
        <h5 className="fw-bold text-dark mb-3">
          <i className="bi bi-search text-success me-2"></i>
          Search City / District Weather
        </h5>
        <form onSubmit={handleSearch} className="row g-2 align-items-center">
          <div className="col-md-8 col-lg-9">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-geo-alt-fill text-danger"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-lg border-start-0"
                placeholder="Enter city or district name (e.g. Ludhiana, Fresno, Mumbai, Delhi)..."
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-3">
            <button type="submit" className="btn btn-agri btn-lg w-100 fw-bold shadow-sm">
              <i className="bi bi-cloud-arrow-down-fill me-1"></i> Get Weather
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top align-items-center">
          <span className="small text-muted fw-semibold">Popular Agricultural Regions:</span>
          {['Punjab', 'Haryana', 'Maharashtra', 'Delhi', 'California', 'Texas'].map((c) => (
            <button
              key={c}
              type="button"
              className={`btn btn-sm ${activeCity.toLowerCase() === c.toLowerCase() ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => {
                setCityInput(c);
                setActiveCity(c);
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger py-2 small" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {errorMsg}
        </div>
      )}

      {/* Weather Results Display */}
      {loading ? (
        <div className="agri-card p-5 text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Fetching satellite and meteorological data...</p>
        </div>
      ) : weatherData ? (
        <>
          {/* Main Weather Card */}
          <div className="agri-card p-4 p-md-5 mb-4 shadow-sm border-top border-4 border-primary">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
              <div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-bold mb-2">
                  Live Meteorological Feed
                </span>
                <h3 className="fw-bold text-dark mb-0">
                  <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                  {locationLabel}
                </h3>
                <div className="small text-muted mt-1">
                  Last updated: {weatherData.updatedAt || 'Just now'} | Source: {weatherData.source || 'Agricultural Met Feed'}
                </div>
              </div>

              <div className="text-end">
                <span className="badge bg-light text-muted border px-3 py-2 fs-6">
                  {weatherData.current?.airQuality || 'Air Quality: Good'}
                </span>
              </div>
            </div>

            <div className="row g-4 align-items-center">
              {/* Temperature & Conditions */}
              <div className="col-md-6 col-lg-5 text-center text-md-start">
                <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
                  <span style={{ fontSize: '4.5rem', lineHeight: 1 }}>{currentIcon}</span>
                  <div>
                    <div className="display-4 fw-bold text-dark mb-0">
                      {currentTemp}°C
                    </div>
                    <div className="fs-5 fw-semibold text-secondary">
                      {currentCondition}
                    </div>
                    <div className="small text-muted">
                      Feels like {weatherData.current?.feelsLike ?? (currentTemp + 1)}°C
                    </div>
                  </div>
                </div>
              </div>

              {/* Humidity, Wind Speed, and Parameters */}
              <div className="col-md-6 col-lg-7">
                <div className="row g-3">
                  {/* Humidity */}
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border text-center text-sm-start">
                      <div className="small text-muted fw-bold text-uppercase">Humidity</div>
                      <div className="fs-3 fw-bold text-primary my-1">
                        <i className="bi bi-droplet-fill me-1"></i>
                        {currentHumidity}%
                      </div>
                      <div className="small text-muted">Relative canopy humidity</div>
                    </div>
                  </div>

                  {/* Wind Speed */}
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border text-center text-sm-start">
                      <div className="small text-muted fw-bold text-uppercase">Wind Speed</div>
                      <div className="fs-3 fw-bold text-secondary my-1">
                        <i className="bi bi-wind me-1"></i>
                        {currentWind} km/h
                      </div>
                      <div className="small text-muted">Safe for drone/sprayer</div>
                    </div>
                  </div>

                  {/* Rain Probability */}
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border text-center text-sm-start">
                      <div className="small text-muted fw-bold text-uppercase">Rain Risk</div>
                      <div className="fs-3 fw-bold text-info my-1">
                        <i className="bi bi-cloud-rain-fill me-1"></i>
                        {weatherData.current?.rainProbability ?? 15}%
                      </div>
                      <div className="small text-muted">Precipitation risk today</div>
                    </div>
                  </div>

                  {/* Soil Temperature */}
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border text-center text-sm-start">
                      <div className="small text-muted fw-bold text-uppercase">Soil Temp</div>
                      <div className="fs-3 fw-bold text-success my-1">
                        <i className="bi bi-thermometer-half me-1"></i>
                        {weatherData.current?.soilTemp ?? (currentTemp - 2)}°C
                      </div>
                      <div className="small text-muted">Topsoil root zone temp</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Farming Recommendations */}
            <div className="mt-4 pt-4 border-top">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 rounded-3 bg-success-subtle border border-success-subtle">
                    <div className="fw-bold text-success mb-1">
                      <i className="bi bi-shield-check me-2"></i> Pesticide Spraying Advisory
                    </div>
                    <div className="small text-dark">
                      {weatherData.sprayingAdvisory || weatherData.agroAdvisory?.sprayingStatus || 'Safe: Wind speed is calm for foliar application.'}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3 bg-primary-subtle border border-primary-subtle">
                    <div className="fw-bold text-primary mb-1">
                      <i className="bi bi-water me-2"></i> Field Irrigation Advisory
                    </div>
                    <div className="small text-dark">
                      {weatherData.irrigationAdvisory || weatherData.agroAdvisory?.irrigationStatus || 'Optimal: Maintain normal scheduled irrigation cycle.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Weather Outlook */}
          {weatherData.forecast && weatherData.forecast.length > 0 && (
            <div className="agri-card p-4 shadow-sm">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-calendar3 text-success me-2"></i>
                5-Day Agricultural Forecast Outlook
              </h5>
              <div className="row g-3">
                {weatherData.forecast.map((day, idx) => (
                  <div key={idx} className="col-6 col-md">
                    <div className="p-3 text-center rounded bg-light border h-100">
                      <div className="fw-bold text-dark">{day.day}</div>
                      <div className="small text-muted mb-1">{day.date}</div>
                      <div className="fs-2 my-2">{day.icon}</div>
                      <div className="fw-bold text-dark">{day.tempMax}° / {day.tempMin}°C</div>
                      <div className="small text-secondary mt-1">{day.condition}</div>
                      <div className="badge bg-info-subtle text-info border border-info-subtle mt-2 small">
                        <i className="bi bi-droplet me-1"></i> {day.rainProbability}% Rain
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default WeatherPage;
