import Trip from '../models/Trip.js';

// Helper to compute duration
const calculateDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 1;
};

/**
 * @desc    Create a new trip
 * @route   POST /api/trips
 * @access  Private
 */
export const createTrip = async (req, res, next) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      travelers = 1,
      budget,
      currency = 'USD',
      travelStyle = 'Relaxed',
      interests = [],
      tripTitle,
      destinationSummary,
      estimatedTotalCost,
      budgetBreakdown,
      days,
      travelTips,
      packingSuggestions,
      importantNotes,
    } = req.body;

    if (!destination || !startDate || !endDate || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Destination, start date, end date, and budget are required',
      });
    }

    const duration = calculateDuration(startDate, endDate);

    // Determine status
    const today = new Date().toISOString().split('T')[0];
    let status = 'Upcoming';
    if (endDate < today) {
      status = 'Completed';
    }

    const trip = await Trip.create({
      userId: req.user._id,
      destination,
      startDate,
      endDate,
      duration,
      travelers,
      budget,
      currency,
      travelStyle,
      interests,
      tripTitle: tripTitle || `${travelStyle} Trip to ${destination}`,
      destinationSummary: destinationSummary || '',
      estimatedTotalCost: estimatedTotalCost || budget,
      budgetBreakdown: budgetBreakdown || {
        accommodation: Math.round(budget * 0.35),
        food: Math.round(budget * 0.25),
        transportation: Math.round(budget * 0.15),
        activities: Math.round(budget * 0.15),
        miscellaneous: Math.round(budget * 0.1),
      },
      days: days || [],
      travelTips: travelTips || [],
      packingSuggestions: packingSuggestions || [],
      importantNotes: importantNotes || [],
      status,
    });

    res.status(201).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all trips for the authenticated user
 * @route   GET /api/trips
 * @access  Private
 */
export const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const today = new Date().toISOString().split('T')[0];
    
    // Calculate statistics
    const totalTrips = trips.length;
    let upcomingTrips = 0;
    let completedTrips = 0;
    let totalPlannedBudget = 0;

    trips.forEach((trip) => {
      totalPlannedBudget += Number(trip.budget) || 0;
      if (trip.endDate < today || trip.status === 'Completed') {
        completedTrips++;
      } else {
        upcomingTrips++;
      }
    });

    res.json({
      success: true,
      data: trips,
      stats: {
        totalTrips,
        upcomingTrips,
        completedTrips,
        totalPlannedBudget,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single trip by ID
 * @route   GET /api/trips/:id
 * @access  Private
 */
export const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    // Verify ownership
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this trip',
      });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a trip
 * @route   PUT /api/trips/:id
 * @access  Private
 */
export const updateTrip = async (req, res, next) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    // Verify ownership
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this trip',
      });
    }

    const {
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      currency,
      travelStyle,
      interests,
      tripTitle,
      destinationSummary,
      estimatedTotalCost,
      budgetBreakdown,
      days,
      travelTips,
      packingSuggestions,
      importantNotes,
      status,
    } = req.body;

    if (startDate && endDate) {
      trip.duration = calculateDuration(startDate, endDate);
    }

    if (destination !== undefined) trip.destination = destination;
    if (startDate !== undefined) trip.startDate = startDate;
    if (endDate !== undefined) trip.endDate = endDate;
    if (travelers !== undefined) trip.travelers = travelers;
    if (budget !== undefined) trip.budget = budget;
    if (currency !== undefined) trip.currency = currency;
    if (travelStyle !== undefined) trip.travelStyle = travelStyle;
    if (interests !== undefined) trip.interests = interests;
    if (tripTitle !== undefined) trip.tripTitle = tripTitle;
    if (destinationSummary !== undefined) trip.destinationSummary = destinationSummary;
    if (estimatedTotalCost !== undefined) trip.estimatedTotalCost = estimatedTotalCost;
    if (budgetBreakdown !== undefined) trip.budgetBreakdown = budgetBreakdown;
    if (days !== undefined) trip.days = days;
    if (travelTips !== undefined) trip.travelTips = travelTips;
    if (packingSuggestions !== undefined) trip.packingSuggestions = packingSuggestions;
    if (importantNotes !== undefined) trip.importantNotes = importantNotes;
    if (status !== undefined) trip.status = status;

    const updatedTrip = await trip.save();

    res.json({
      success: true,
      data: updatedTrip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a trip
 * @route   DELETE /api/trips/:id
 * @access  Private
 */
export const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this trip',
      });
    }

    await trip.deleteOne();

    res.json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add activity to a specific day
 * @route   POST /api/trips/:id/days/:dayNumber/activities
 * @access  Private
 */
export const addActivity = async (req, res, next) => {
  try {
    const { id, dayNumber } = req.params;
    const { time, title, description, estimatedCost, category } = req.body;

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const dayIndex = trip.days.findIndex((d) => d.day === Number(dayNumber));
    if (dayIndex === -1) {
      return res.status(404).json({ success: false, message: `Day ${dayNumber} not found` });
    }

    trip.days[dayIndex].activities.push({
      time: time || '10:00 AM',
      title,
      description: description || '',
      estimatedCost: Number(estimatedCost) || 0,
      category: category || 'Sightseeing',
    });

    await trip.save();
    res.json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an activity in a specific day
 * @route   PUT /api/trips/:id/days/:dayNumber/activities/:activityId
 * @access  Private
 */
export const updateActivity = async (req, res, next) => {
  try {
    const { id, dayNumber, activityId } = req.params;
    const { time, title, description, estimatedCost, category } = req.body;

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const day = trip.days.find((d) => d.day === Number(dayNumber));
    if (!day) {
      return res.status(404).json({ success: false, message: `Day ${dayNumber} not found` });
    }

    const activity = day.activities.id(activityId);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    if (time !== undefined) activity.time = time;
    if (title !== undefined) activity.title = title;
    if (description !== undefined) activity.description = description;
    if (estimatedCost !== undefined) activity.estimatedCost = Number(estimatedCost);
    if (category !== undefined) activity.category = category;

    await trip.save();
    res.json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an activity from a day
 * @route   DELETE /api/trips/:id/days/:dayNumber/activities/:activityId
 * @access  Private
 */
export const deleteActivity = async (req, res, next) => {
  try {
    const { id, dayNumber, activityId } = req.params;

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const day = trip.days.find((d) => d.day === Number(dayNumber));
    if (!day) {
      return res.status(404).json({ success: false, message: `Day ${dayNumber} not found` });
    }

    day.activities.pull(activityId);
    await trip.save();

    res.json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};
