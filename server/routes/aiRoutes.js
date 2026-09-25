import express from 'express';
import { generateAIItinerary, chatTravelAssistant, testGeminiStatus } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow authenticated users to generate itinerary, chat with travel assistant, and test AI connectivity
router.post('/generate-itinerary', protect, generateAIItinerary);
router.post('/travel-assistant', protect, chatTravelAssistant);
router.get('/test', protect, testGeminiStatus);

export default router;
