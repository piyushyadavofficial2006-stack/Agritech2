import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const ForumPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const [newPostData, setNewPostData] = useState({
    title: '',
    category: 'Soil Health',
    content: '',
    tags: 'NPK, Fertilizer'
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/forum');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching forum posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostData.title.trim() || !newPostData.content.trim()) return;

    try {
      await api.post('/forum', newPostData);
      setShowAskModal(false);
      fetchPosts();
      setNewPostData({
        title: '',
        category: 'Soil Health',
        content: '',
        tags: ''
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting question.');
    }
  };

  const handleUpvote = async (id) => {
    try {
      await api.post(`/forum/${id}/upvote`);
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p))
      );
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  const handleReplySubmit = async (postId) => {
    if (!replyContent.trim()) return;
    try {
      await api.post(`/forum/${postId}/reply`, { content: replyContent });
      setReplyContent('');
      setActiveReplyId(null);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting response.');
    }
  };

  const categories = ['All', 'Soil Health', 'Pest Control', 'Crop Advisory', 'General'];

  const filteredPosts = posts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-chat-square-quote-fill text-success me-2"></i>
            {t('navForum')} & Agricultural Consultation
          </h2>
          <p className="text-muted mb-0">
            Connect with certified agronomists, university soil scientists, and fellow progressive farmers.
          </p>
        </div>

        <button className="btn btn-agri d-flex align-items-center gap-2" onClick={() => setShowAskModal(true)}>
          <i className="bi bi-question-circle-fill"></i>
          <span>Ask Expert Question</span>
        </button>
      </div>

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
                placeholder="Search queries, symptoms, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-7 d-flex flex-wrap justify-content-md-end gap-2">
            {categories.map((c) => (
              <button
                key={c}
                className={`btn btn-sm ${selectedCategory === c ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Loading farmer advisory threads...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="agri-card p-5 text-center">
          <span className="fs-1">💬</span>
          <h4 className="fw-bold text-dark mt-3">No Discussions Found</h4>
          <p className="text-muted">Be the first to post a question to our certified agricultural experts.</p>
          <button className="btn btn-agri" onClick={() => setShowAskModal(true)}>
            Post Your Question
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredPosts.map((post) => (
            <div key={post._id} className="agri-card p-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success-subtle text-success border border-success-subtle">
                    {post.category}
                  </span>
                  <span className="small text-muted">
                    Posted by <strong>{post.authorName}</strong> ({post.authorRole || 'farmer'}) •{' '}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                  onClick={() => handleUpvote(post._id)}
                >
                  <i className="bi bi-hand-thumbs-up"></i>
                  <span>{post.upvotes || 0}</span>
                </button>
              </div>

              <h5 className="fw-bold text-dark mb-2">{post.title}</h5>
              <p className="text-secondary small mb-3">{post.content}</p>

              {post.tags && post.tags.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {post.tags.map((tg, idx) => (
                    <span key={idx} className="badge bg-light text-muted border small">
                      #{tg}
                    </span>
                  ))}
                </div>
              )}

              {/* Verified Replies Thread */}
              {post.replies && post.replies.length > 0 && (
                <div className="mt-3 pt-3 border-top">
                  <div className="small fw-bold text-muted mb-2 text-uppercase">
                    Consultation Replies ({post.replies.length}):
                  </div>
                  <div className="d-flex flex-column gap-2 mb-3">
                    {post.replies.map((rep, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-3 border ${
                          rep.authorRole === 'expert' || rep.authorRole === 'admin'
                            ? 'bg-success-subtle border-success-subtle'
                            : 'bg-light'
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold small text-dark d-flex align-items-center gap-1">
                            {rep.authorRole === 'expert' && <span className="badge bg-success">Verified Expert</span>}
                            {rep.authorRole === 'admin' && <span className="badge bg-danger">Agronomy Officer</span>}
                            <span>{rep.authorName}</span>
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {new Date(rep.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="small text-dark mb-0">{rep.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Input Box */}
              {activeReplyId === post._id ? (
                <div className="mt-3 p-3 rounded bg-light border">
                  <label className="form-label small fw-semibold">Your Agronomic Answer / Experience:</label>
                  <textarea
                    className="form-control form-control-sm mb-2"
                    rows="2"
                    placeholder="Provide actionable recommendation..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  ></textarea>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        setActiveReplyId(null);
                        setReplyContent('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm btn-agri"
                      onClick={() => handleReplySubmit(post._id)}
                    >
                      Submit Response
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-sm btn-link text-decoration-none p-0 fw-semibold text-success mt-2"
                  onClick={() => setActiveReplyId(post._id)}
                >
                  <i className="bi bi-reply-fill me-1"></i> Add an Answer / Comment
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="modal-overlay" onClick={() => setShowAskModal(false)}>
          <div className="modal-dialog-custom p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold mb-0 text-dark">Ask Community & Agricultural Experts</h5>
              <button type="button" className="btn-close" onClick={() => setShowAskModal(false)}></button>
            </div>

            <form onSubmit={handleCreatePost}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Consultation Topic Category</label>
                <select
                  className="form-select"
                  value={newPostData.category}
                  onChange={(e) => setNewPostData({ ...newPostData, category: e.target.value })}
                >
                  <option value="Soil Health">Soil Health & Nutrients</option>
                  <option value="Pest Control">Pest & Fungus Control</option>
                  <option value="Crop Advisory">Crop Advisory & Planting</option>
                  <option value="General">Irrigation & Farm Machinery</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Question Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. How to manage yellow rust on Sharbati wheat early?"
                  value={newPostData.title}
                  onChange={(e) => setNewPostData({ ...newPostData, title: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Detailed Symptoms / Query *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe soil type, recent rain, foliage color, or fertilizer applications..."
                  value={newPostData.content}
                  onChange={(e) => setNewPostData({ ...newPostData, content: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Keywords / Tags (Comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Wheat, YellowRust, BioFungicide"
                  value={newPostData.tags}
                  onChange={(e) => setNewPostData({ ...newPostData, tags: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAskModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-agri">
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumPage;
