import Destination from '../models/Destination.js';

/**
 * @desc    Get all destinations (with optional search and category filter)
 * @route   GET /api/destinations
 * @access  Public
 */
export const getDestinations = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const destinations = await Destination.find(query).sort({ name: 1 });

    res.json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single destination by ID or slug
 * @route   GET /api/destinations/:id
 * @access  Public
 */
export const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    res.json({
      success: true,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};
