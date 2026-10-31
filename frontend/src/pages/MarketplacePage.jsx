import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const MarketplacePage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount, totalCount } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(
    user?.state ? `Village Farm, District Center, ${user.state}` : 'Village Kalan, Ludhiana, Punjab - 141001'
  );
  const [paymentMethod, setPaymentMethod] = useState('Kisan Pay / UPI Direct');
  const [orderPlacing, setOrderPlacing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/resources');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    if (!shippingAddress.trim()) {
      alert('Please enter a delivery address.');
      return;
    }

    setOrderPlacing(true);
    try {
      const itemsPayload = cart.map((item) => ({
        resourceId: item._id,
        title: item.title,
        quantity: item.quantity,
        price: item.price
      }));

      await api.post('/orders', {
        items: itemsPayload,
        shippingAddress,
        paymentMethod
      });

      clearCart();
      setShowCartModal(false);
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order. Please sign in first.');
    } finally {
      setOrderPlacing(false);
    }
  };

  const categories = ['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Tools'];

  const filtered = products.filter((p) => {
    const matchesCat = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="container py-4">
      {/* Title & Cart Float Button */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-shop text-success me-2"></i>
            {t('navMarketplace')} — Farm Input Store
          </h2>
          <p className="text-muted mb-0">
            Certified drought-tolerant seeds, bio-inoculants, cold-pressed neem oils, and digital soil sensors.
          </p>
        </div>

        <button
          className="btn btn-agri position-relative d-flex align-items-center gap-2"
          onClick={() => setShowCartModal(true)}
        >
          <i className="bi bi-cart3 fs-5"></i>
          <span>{t('cart')}</span>
          {totalCount > 0 && (
            <span className="badge bg-warning text-dark rounded-pill fw-bold">
              {totalCount} (${totalAmount})
            </span>
          )}
        </button>
      </div>

      {toastMsg && (
        <div className="alert alert-success alert-dismissible fade show py-2" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {toastMsg}
          <button type="button" className="btn-close" onClick={() => setToastMsg('')}></button>
        </div>
      )}

      {/* Search & Categories */}
      <div className="agri-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search seeds, fertilizer, probes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-7 d-flex flex-wrap justify-content-md-end gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${categoryFilter === cat ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Loading verified agricultural inputs catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="agri-card p-5 text-center">
          <span className="fs-1">📦</span>
          <h4 className="fw-bold text-dark mt-3">No Products Found</h4>
          <p className="text-muted">Try clearing the search query or category filter.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((item) => (
            <div key={item._id} className="col-md-6 col-lg-4">
              <div className="agri-card p-4 h-100 d-flex flex-column justify-content-between agri-card-hover">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-light text-success border border-success-subtle fw-semibold">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h5 className="fw-bold text-dark mb-2">{item.title}</h5>

                  <p className="small text-muted mb-3" style={{ minHeight: '40px' }}>
                    {item.description}
                  </p>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="text-warning small">
                      {'★'.repeat(Math.round(item.rating || 5))}
                      {'☆'.repeat(5 - Math.round(item.rating || 5))}
                    </div>
                    <span className="small text-muted">
                      ({item.rating || 4.8} / 5 • {item.reviewsCount || 20}+ farmers)
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fs-4 fw-bold text-dark">${item.price}</div>
                    <div className="small text-muted">per {item.unit}</div>
                  </div>

                  <button
                    className="btn btn-agri d-flex align-items-center gap-1"
                    onClick={() => {
                      addToCart(item);
                      setToastMsg(`Added "${item.title}" to cart!`);
                      setTimeout(() => setToastMsg(''), 3000);
                    }}
                  >
                    <i className="bi bi-cart-plus"></i>
                    <span>{t('addToCart')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {showCartModal && (
        <div className="modal-overlay" onClick={() => setShowCartModal(false)}>
          <div className="modal-dialog-custom p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-bag-check-fill text-success me-2"></i>
                Agricultural Cart ({totalCount} items)
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowCartModal(false)}></button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-cart-x fs-1 text-muted"></i>
                <p className="mt-2">Your cart is currently empty.</p>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success"
                  onClick={() => setShowCartModal(false)}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckout}>
                <div className="d-flex flex-column gap-2 mb-3 max-h-50 overflow-auto">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="p-2 rounded bg-light border d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-bold text-dark small">{item.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-light border px-2 py-0"
                          onClick={() => updateQuantity(item._id, -1)}
                        >
                          -
                        </button>
                        <span className="small px-1 fw-bold">{item.quantity}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-light border px-2 py-0"
                          onClick={() => updateQuantity(item._id, 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm text-danger ms-2 p-0"
                          onClick={() => removeFromCart(item._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between fs-5 fw-bold text-dark py-2 border-top border-bottom mb-3">
                  <span>{t('total')}:</span>
                  <span className="text-success">${totalAmount.toFixed(2)}</span>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">{t('deliveryAddress')} *</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Enter village, postal code, district, state"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Payment Option</label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Kisan Pay / UPI Direct">Kisan Pay / UPI Direct (Fastest)</option>
                    <option value="Direct Agri Bank Transfer">Direct Agri Bank Transfer</option>
                    <option value="Cash on Delivery (Farm Gate Pay)">Cash on Delivery (Farm Gate Pay)</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCartModal(false)}
                  >
                    Keep Shopping
                  </button>
                  <button type="submit" disabled={orderPlacing} className="btn btn-agri">
                    {orderPlacing ? 'Confirming Order...' : 'Place Farm Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
