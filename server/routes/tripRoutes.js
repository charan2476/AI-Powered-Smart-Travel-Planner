import express from 'express';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All trip routes require authentication
router.use(protect);

router.route('/').post(createTrip).get(getTrips);
router.route('/:id').get(getTripById).put(updateTrip).delete(deleteTrip);

// Activity sub-routes
router.post('/:id/days/:dayNumber/activities', addActivity);
router.put('/:id/days/:dayNumber/activities/:activityId', updateActivity);
router.delete('/:id/days/:dayNumber/activities/:activityId', deleteActivity);

export default router;
