const { ResourceService } = require('../models');

// @desc Get agricultural marketplace resources
// @route GET /api/resources
const getResources = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let resources = await ResourceService.getAll(category);

    if (search) {
      const q = search.toLowerCase();
      resources = resources.filter(
        (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
    }

    res.json(resources);
  } catch (error) {
    next(error);
  }
};

// @desc Get single resource
// @route GET /api/resources/:id
const getResourceById = async (req, res, next) => {
  try {
    const resource = await ResourceService.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource product not found.' });
    }
    res.json(resource);
  } catch (error) {
    next(error);
  }
};

// @desc Create agricultural product (admin)
// @route POST /api/resources
const createResource = async (req, res, next) => {
  try {
    const { title, category, price, unit, stock, description, badge } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: 'Title, category, and price are required.' });
    }

    const newRes = await ResourceService.create({
      title,
      category,
      price: Number(price),
      unit: unit || 'Pack',
      stock: Number(stock || 50),
      rating: 4.8,
      reviewsCount: 1,
      description: description || '',
      badge: badge || 'New Arrival',
      inStock: Number(stock) > 0
    });

    res.status(201).json(newRes);
  } catch (error) {
    next(error);
  }
};

// @desc Update resource product (admin)
// @route PUT /api/resources/:id
const updateResource = async (req, res, next) => {
  try {
    const updated = await ResourceService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Resource product not found.' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc Delete resource product (admin)
// @route DELETE /api/resources/:id
const deleteResource = async (req, res, next) => {
  try {
    const deleted = await ResourceService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Resource not found.' });
    }
    res.json({ message: 'Resource deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
};
