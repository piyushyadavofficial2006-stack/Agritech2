import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const OrdersPage = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStepProgress = (status) => {
    switch (status) {
      case 'Pending':
        return 25;
      case 'Processing':
        return 50;
      case 'Shipped':
        return 75;
      case 'Delivered':
        return 100;
      default:
        return 50;
    }
  };

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-truck text-success me-2"></i>
            {t('navOrders')} & Supply Tracking
          </h2>
          <p className="text-muted mb-0">
            Real-time status updates for certified seeds, microbial fertilizers, and farm equipment.
          </p>
        </div>
        <Link to="/marketplace" className="btn btn-outline-success">
          <i className="bi bi-cart-plus me-1"></i> Order More Supplies
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Loading supply dispatch history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="agri-card p-5 text-center">
          <span className="fs-1">📦</span>
          <h4 className="fw-bold text-dark mt-3">No Orders Placed Yet</h4>
          <p className="text-muted" style={{ maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Browse the Agri Store for certified seeds, organic neem sprays, and soil testing kits.
          </p>
          <Link to="/marketplace" className="btn btn-agri">
            Visit Agri Store
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((ord) => (
            <div key={ord._id} className="agri-card p-4">
              {/* Header */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-3 border-bottom">
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-dark fs-5">Order #{ord.trackingNumber || ord._id}</span>
                    <span
                      className={`badge ${
                        ord.status === 'Delivered'
                          ? 'bg-success'
                          : ord.status === 'Shipped'
                          ? 'bg-info text-dark'
                          : 'bg-warning text-dark'
                      } px-3 py-1`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <div className="small text-muted">
                    Placed on: {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                    {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="text-md-end">
                  <div className="fs-4 fw-bold text-success">${ord.totalAmount?.toFixed(2)}</div>
                  <div className="small text-muted">{ord.paymentMethod}</div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="my-3 px-2">
                <div className="metric-bar-bg mb-2" style={{ height: '8px' }}>
                  <div
                    className="metric-bar-fill bg-success"
                    style={{ width: `${getStepProgress(ord.status)}%` }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between small text-muted font-monospace">
                  <span className={getStepProgress(ord.status) >= 25 ? 'text-success fw-bold' : ''}>
                    ✓ Order Received
                  </span>
                  <span className={getStepProgress(ord.status) >= 50 ? 'text-success fw-bold' : ''}>
                    ✓ Quality Check & Packed
                  </span>
                  <span className={getStepProgress(ord.status) >= 75 ? 'text-success fw-bold' : ''}>
                    ✓ Dispatched & In Transit
                  </span>
                  <span className={getStepProgress(ord.status) >= 100 ? 'text-success fw-bold' : ''}>
                    ✓ Delivered to Farm
                  </span>
                </div>
              </div>

              {/* Item List & Shipping Info */}
              <div className="row g-3 pt-3">
                <div className="col-md-7">
                  <h6 className="fw-bold text-dark mb-2">Ordered Items:</h6>
                  <ul className="list-group list-group-flush rounded-3 border small">
                    {ord.items?.map((it, idx) => (
                      <li
                        key={idx}
                        className="list-group-item d-flex justify-content-between align-items-center bg-light"
                      >
                        <span className="fw-semibold text-dark">
                          {it.title} <span className="text-muted fw-normal">× {it.quantity}</span>
                        </span>
                        <span className="text-dark fw-bold">${(it.price * it.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-md-5">
                  <div className="p-3 rounded bg-light border h-100">
                    <h6 className="fw-bold text-dark mb-1">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      Delivery Farm Location:
                    </h6>
                    <p className="small text-secondary mb-2">{ord.shippingAddress}</p>
                    <div className="small text-muted">
                      <strong>Tracking Reference:</strong> {ord.trackingNumber || 'AGR-TRK-LIVE'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
