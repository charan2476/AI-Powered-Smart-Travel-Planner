import express from 'express';
import { generateAIItinerary, chatTravelAssistant } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow authenticated users to generate itinerary and chat with travel assistant
router.post('/generate-itinerary', protect, generateAIItinerary);
router.post('/travel-assistant', protect, chatTravelAssistant);

export default router;
