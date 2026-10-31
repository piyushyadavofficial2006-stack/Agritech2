const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  addReply,
  upvotePost
} = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.post('/', protect, createPost);
router.post('/:id/reply', protect, addReply);
router.post('/:id/upvote', protect, upvotePost);

module.exports = router;
