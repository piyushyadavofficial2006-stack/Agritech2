const { ForumService } = require('../models');

// @desc Get all community questions & expert advice
// @route GET /api/forum
const getPosts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let posts = await ForumService.getAll();

    if (category && category !== 'All') {
      posts = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc Ask question in farmer community forum
// @route POST /api/forum
const createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and detailed question content are required.' });
    }

    const post = await ForumService.create({
      userId: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role || 'farmer',
      title,
      content,
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(s => s.trim()) : [])
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc Reply to forum thread / Provide expert consultation
// @route POST /api/forum/:id/reply
const addReply = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Reply content cannot be empty.' });
    }

    const updated = await ForumService.addReply(req.params.id, {
      userId: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role || 'farmer',
      content
    });

    if (!updated) {
      return res.status(404).json({ message: 'Forum post not found.' });
    }

    res.status(201).json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc Upvote a helpful discussion
// @route POST /api/forum/:id/upvote
const upvotePost = async (req, res, next) => {
  try {
    const updated = await ForumService.upvote(req.params.id);
    if (!updated) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  createPost,
  addReply,
  upvotePost
};
